import React, { useState, useEffect } from 'react';
import Transaction from './Transaction.js';
import { Link, useNavigate } from 'react-router-dom';

const POLL_INTERVAL_MS = 10000;

const TransactionPool = () => {
    const [transactionPoolMap, setTransactionPoolMap] = useState({});
    const navigate = useNavigate();

    const fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => setTransactionPoolMap(json));
    }

    const fetchMineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`)
            .then(response => {
                if (response.status === 200) {
                    alert('success');
                    navigate('/blocks');
                } else {
                    alert('The mine-transactions block request did not complete.');
                }
            });
    }

    useEffect(() => {
        fetchTransactionPoolMap();

        const intervalId = setInterval(fetchTransactionPoolMap, POLL_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='flex flex-col items-center gap-6 m-10'>
            <div><Link to='/' className="text-[#e66] underline hover:text-[#ff7777]">Home</Link></div>
            <h3 className="text-3xl font-bold">Transaction Pool</h3>
            <div className="w-full max-w-4xl bg-[#333] p-6 rounded shadow-lg">
                {
                    Object.values(transactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id} className="border-b border-gray-600 last:border-0 pb-4 mb-4 last:mb-0">
                                <Transaction transaction={transaction} />
                            </div>
                        )
                    })
                }

                {Object.values(transactionPoolMap).length === 0 && (
                    <div className="text-gray-400 italic mb-4">No pending transactions.</div>
                )}

                <div className="pt-4 border-t border-gray-500">
                    <button
                        onClick={fetchMineTransactions}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
                    >
                        Mine the Transactions
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TransactionPool;