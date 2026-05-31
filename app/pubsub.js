const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION'
};

class PubSub {
  constructor({ blockchain, transactionPool, redisUrl }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;

    const redisOptions = {
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.log('Redis reconnection attempts exhausted. Operating without Redis.');
            return false; // Stop retrying
          }
          return Math.min(retries * 100, 3000); // Exponential backoff
        }
      }
    };

    this.publisher = redis.createClient(redisOptions);
    this.subscriber = redis.createClient(redisOptions);

    this.subscriber.on('error', (err) => {
      if (!this.connected) {
         // Quietly log only once if possible or just silence if it's the expected "no redis" case
      } else {
        console.log('Redis Subscriber Error', err.message);
      }
    });

    this.publisher.on('error', (err) => {
       if (!this.connected) {
         // Quietly log
      } else {
        console.log('Redis Publisher Error', err.message);
      }
    });

    this.connected = false;
  }

  async connect() {
    try {
      await this.publisher.connect();
      await this.subscriber.connect();
      this.connected = true;
      await this.subscribeToChannels();
      console.log('Successfully connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis. Running in standalone mode.');
    }
  }

  handleMessage(message, channel) {
    console.log(`Message receive. Channel: ${channel}. Message: ${message}.`);

    const parsedMessage = JSON.parse(message);

    switch(channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, true, () => {
          this.transactionPool.clearBlockchainTransactions({
            chain: parsedMessage
          });
        });
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage);
        break;
      default:
        return; 
    }
  }

  async subscribeToChannels() {
    for (const channel of Object.values(CHANNELS)) {
      await this.subscriber.subscribe(channel, (message, channelName) => {
          this.handleMessage(message, channelName);
      });
    }
  }

  async publish({ channel, message }) {
    if (!this.connected) {
        // console.log('Skipping publish: Not connected to Redis');
        return;
    }
    try {
      await this.publisher.publish(channel, message);
    } catch (error) {
      console.error(`Failed to publish to channel ${channel}:`, error.message);
    }
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    });
  }
}

module.exports = PubSub;
