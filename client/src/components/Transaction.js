import React from 'react'

const Transaction = ({ transaction }) => {
    const { input, outputMap } = transaction;
    const recipients = Object.keys(outputMap);

    return (
        <div className='p-4 text-left'>
            <div className="mb-2">
                <span className="font-bold text-gray-400">From:</span> {`${input.address.substring(0, 20)}...`}
                <span className="ml-2 font-bold text-gray-400">Balance:</span> {input.amount}
            </div>
            <div className="pl-4 space-y-1">
                {
                    recipients.map(recipient => (
                        <div key={recipient} className="text-sm">
                            <span className="font-bold text-gray-400">To:</span> {`${recipient.substring(0, 20)}...`}
                            <span className="ml-2 font-bold text-gray-400">Sent:</span> {outputMap[recipient]}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Transaction;