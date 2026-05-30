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

    this.publisher = redis.createClient({ url: redisUrl });
    this.subscriber = redis.createClient({ url: redisUrl });

    this.subscriber.on('error', (err) => console.log('Redis Subscriber Error', err));
    this.publisher.on('error', (err) => console.log('Redis Publisher Error', err));

    this.connected = false;
  }

  async connect() {
    await this.publisher.connect();
    await this.subscriber.connect();
    this.connected = true;
    await this.subscribeToChannels();
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
        console.log('Skipping publish: Not connected to Redis');
        return;
    }
    await this.publisher.publish(channel, message);
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