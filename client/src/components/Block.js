import React, { useState } from 'react';
import Transaction from './Transaction.js';

const Block = ({ block }) => {
    const [displayTransaction, setDisplayTransaction] = useState(false);

    const toggleTransaction = () => {
        setDisplayTransaction(!displayTransaction);
    }

    const { timestamp, hash, data } = block;

    const hashDisplay = `${hash.substring(0, 15)}...`;
    const stringifiedData = JSON.stringify(data);

    const dataDisplay = stringifiedData.length > 35 ?
        `${stringifiedData.substring(0, 35)}...` : 
        stringifiedData;

    return (
        <div className='border border-white p-5 m-5 bg-[#333] rounded shadow-lg text-left'>
            <div className="mb-2"><span className="font-bold text-gray-400">Hash:</span> {hashDisplay}</div>
            <div className="mb-2"><span className="font-bold text-gray-400">Timestamp:</span> {new Date(timestamp).toLocaleString()}</div>

            {displayTransaction ? (
                <div>
                    <div className="font-bold text-gray-400 mb-1">Data:</div>
                    {
                        data.map(transaction => (
                            <div key={transaction.id} className="border-t border-gray-600 mt-2">
                                <Transaction transaction={transaction} />
                            </div>
                        ))
                    }
                    <button
                        className="mt-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                        onClick={toggleTransaction}
                    >
                        Show Less
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-400">Data:</span> {dataDisplay}
                    <button
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                        onClick={toggleTransaction}
                    >
                        Show More
                    </button>
                </div>
            )}
        </div>
    );
}

export default Block;