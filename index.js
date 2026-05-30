const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const Transaction = require('./wallet/transaction');
const TransactionMiner = require('./app/transaction-miner');
const cors = require('cors')

const isDevelopment = process.env.ENV === 'development';

const app = express();
app.use(cors());
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });
  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain });
    }
  } catch(error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction);

  res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect('/api/blocks');
});

app.get('/api/wallet-info',(req, res) => {
  const address = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'client/dist/index.html'));
});

const syncWithRootState = async () => {
  try {
    const blocksResponse = await axios.get(`${ROOT_NODE_ADDRESS}/api/blocks`);
    if (blocksResponse.status === 200) {
      const rootChain = blocksResponse.data;
      console.log('replace chain on a sync with', rootChain);
      blockchain.replaceChain(rootChain);
    }
  } catch (error) {
    console.error('Error syncing blocks:', error.message);
  }

  try {
    const tpMapResponse = await axios.get(`${ROOT_NODE_ADDRESS}/api/transaction-pool-map`);
    if (tpMapResponse.status === 200) {
      const rootTransactionPoolMap = tpMapResponse.data;
      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
      transactionPool.setMap(rootTransactionPoolMap);
    }
  } catch (error) {
    console.error('Error syncing transaction pool map:', error.message);
  }
};

if (isDevelopment) {
  const walletFoo = new Wallet();
  const walletBar = new Wallet();

  const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
      recipient, amount, chain: blockchain.chain 
    });
    transactionPool.setTransaction(transaction);
  };

  const walletAction = () => generateWalletTransaction({
    wallet, recipient: walletFoo.publicKey, amount: 5
  });

  const walletFooAction = () => generateWalletTransaction({
    wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
  });

  const walletBarAction = () => generateWalletTransaction({
    wallet: walletBar, recipient: wallet.publicKey, amount: 15
  });

  for (let i=0; i<10; i++) {
    if (i%3 === 0) {
      walletAction();
      walletFooAction();
    } else if (i%3 === 1) {
      walletAction();
      walletBarAction();
    } else {
      walletFooAction();
      walletBarAction();
    }

    // transactionMiner.mineTransactions();
  }
}

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;

const startServer = async () => {
  // pubsub.connect() is called asynchronously but we don't wait for it to start the server
  // This allows the server to start even if Redis is down
  pubsub.connect().catch(error => {
    console.error('Initial Redis connection failed:', error.message);
  });

  app.listen(PORT, async () => {
    console.log(`Listening at localhost:${PORT}`);

    if (PORT !== DEFAULT_PORT) {
      await syncWithRootState();
    }
  });
};

startServer();