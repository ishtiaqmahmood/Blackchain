import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ConductTransaction = () => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();

    const updateRecipient = event => {
        setRecipient(event.target.value);
    }

    const updateAmount = event => {
        setAmount(Number(event.target.value));
    }

    const conductTransaction = () => {
        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ recipient, amount })
        })
        .then(response => response.json())
        .then(json => {
            alert(json.message || json.type);
            navigate('/transaction-pool');
        });
    }

    return (
        <div className='flex flex-col items-center gap-6 m-10'>
            <Link to='/' className="text-[#e66] underline hover:text-[#ff7777]">Home</Link>
            <h3 className="text-3xl font-bold">Conduct a Transaction</h3>

            <div className="w-full max-w-md flex flex-col gap-4">
                <input
                    type='text'
                    placeholder='recipient'
                    value={recipient}
                    onChange={updateRecipient}
                    className="w-full px-4 py-2 bg-[#333] border border-gray-600 rounded text-white focus:outline-none focus:border-red-500"
                />
                <input
                    type='number'
                    placeholder='amount'
                    value={amount}
                    onChange={updateAmount}
                    className="w-full px-4 py-2 bg-[#333] border border-gray-600 rounded text-white focus:outline-none focus:border-red-500"
                />

                <button
                    onClick={conductTransaction}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default ConductTransaction;