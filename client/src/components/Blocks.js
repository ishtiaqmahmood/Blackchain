import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Block from './Block';

const Blocks = () => {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        fetch(`${document.location.origin}/api/blocks`)
            .then(response => response.json())
            .then(json => setBlocks(json));
    }, []);

    return (
        <div className="flex flex-col items-center gap-4">
            <div><Link to='/' className="text-[#e66] underline hover:text-[#ff7777]">Home</Link></div>
            <h3 className="text-3xl font-bold">Blocks</h3>
            <div className="w-full max-w-4xl">
                {
                    blocks.map(block => {
                        return (
                            <Block key={block.hash} block={block}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Blocks;