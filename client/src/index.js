import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './components/App.js';
import './index.css';
import Blocks from './components/Blocks.js';
import ConductTransaction from './components/ConductTransaction.js';
import TransactionPool from './components/TransactionPool.js'

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/blocks' element={<Blocks />} />
            <Route path='/conduct-transaction' element={<ConductTransaction />} />
            <Route path='/transaction-pool' element={<TransactionPool />} />
        </Routes>
    </BrowserRouter>
);