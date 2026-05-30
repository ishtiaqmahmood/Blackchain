import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'

const App = () => {
    const [walletInfo, setWalletInfo] = useState({});

    useEffect(() => {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => setWalletInfo(json));
    }, []);

    const { address, balance } = walletInfo;

    return (
        <div className="flex flex-col items-center">
            <img className="logo" src={logo} alt="blockchain-logo" />
            <br />
            <div className="text-2xl">
                Welcome to the blockchain...
            </div>
            <br />
            <div className="flex flex-col gap-2">
                <div><Link to='/blocks' className="text-[#e66] underline hover:text-[#ff7777]">Blocks</Link></div>
                <div><Link to='/conduct-transaction' className="text-[#e66] underline hover:text-[#ff7777]">Conduct a Transaction</Link></div>
                <div><Link to='/transaction-pool' className="text-[#e66] underline hover:text-[#ff7777]">Transaction Pool</Link></div>
            </div>
            <br />
            <div className="w-[500px] border border-white p-4 rounded bg-[#333]">
                <div className="break-all">Address: {address}</div>
                <div>Balance: {balance}</div>
            </div>
        </div>
    );
}

export default App;