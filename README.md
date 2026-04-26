# Cryptochain

A full-stack blockchain and cryptocurrency application built with Node.js, Express, React, and Redis. This project implements a functional blockchain with proof-of-work consensus, a wallet system for secure transactions, and a peer-to-peer network for synchronization.

## Features

- **Blockchain Core**: Implements a linked list of blocks with a proof-of-work mining algorithm.
- **Dynamic Difficulty**: Adjusts mining difficulty to maintain a consistent block time.
- **Wallet System**: Generates public/private keys using Elliptic Curve Cryptography (secp256k1) and supports digital signatures.
- **Transactions**: Secure transaction system with input/output maps and balance verification.
- **Transaction Pool**: Handles pending transactions that are yet to be mined into a block.
- **Miner Rewards**: Incentivizes miners with a reward for each block mined.
- **Peer-to-Peer Network**: Uses Redis Pub/Sub for real-time communication between nodes.
- **Chain Synchronization**: Automatically synchronizes new nodes with the root node's chain and transaction pool.
- **Frontend UI**: A React-based dashboard to view the blockchain, conduct transactions, and mine new blocks.

## Technology Stack

- **Backend**: Node.js, Express
- **Frontend**: React, React-Bootstrap, Parcel
- **Database/Networking**: Redis (Pub/Sub)
- **Cryptography**: Elliptic, Hex-to-Binary
- **Testing**: Jest

## Prerequisites

- [Node.js](https://nodejs.org/) (v10+ recommended)
- [Redis](https://redis.io/)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/cryptochain.git
   cd cryptochain
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Redis**:
   Make sure your Redis server is running. On most systems, you can start it with:
   ```bash
   redis-server
   ```

## Usage

### Running the Application

To start the main node and the frontend development server:

1. **Start the backend (Main Node)**:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000`.

2. **Start the frontend**:
   ```bash
   npm run dev-client
   ```
   Open `http://localhost:1234` (or the port specified by Parcel) in your browser.

### Running Peer Nodes

You can start additional peer nodes that will synchronize with the main node:

```bash
npm run dev-peer
```
This will start a node on a random port and connect it to the main node.

## API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/blocks` | Returns the entire blockchain. |
| `POST` | `/api/mine` | Mines a new block with custom data. |
| `POST` | `/api/transact` | Creates a new transaction. Requires `amount` and `recipient` in body. |
| `GET` | `/api/transaction-pool-map` | Returns the current pending transactions. |
| `GET` | `/api/mine-transactions` | Mines a block containing the transactions from the pool. |
| `GET` | `/api/wallet-info` | Returns the wallet's public key and current balance. |

## Testing

The project uses Jest for unit and integration testing.

To run all tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm test -- --watchAll
```

## License

ISC
