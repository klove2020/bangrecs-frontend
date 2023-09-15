// import sakuraStyles from 'sakura.css/css/sakura.css';  // 请更改为实际路径

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import styled from 'styled-components';
// import 'github-markdown-css/github-markdown.css';


// import sakuraStyles from 'sakura.css/css/sakura.css';  // 请更改为实际路径

// const SakuraDiv = styled.div`${sakuraStyles}`;

const Md2Page = ({ filePath }) => { // 注意，这里使用了 props 来传递 filePath
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                const response = await axios.get(filePath);
                setMarkdown(response.data);
            } catch (error) {
                console.error('Error fetching markdown:', error);
            }
        };

        fetchMarkdown();
    }, [filePath]); // filePath 作为依赖

    return (

        <div className='mysakura'>
            <ReactMarkdown children={markdown} />
        </div>

    );
};


export const AboutPage = () => {
    const filePath = '/bgmrec/markdown/about.md';
    return <Md2Page filePath={filePath} />;
};

export const UpdatePage = () => {
    const filePath = '/bgmrec/markdown/update.md';
    return <Md2Page filePath={filePath} />;
};

export const ThankPage = () => {
    const filePath = '/bgmrec/markdown/thank.md';
    return <Md2Page filePath={filePath} />;
};