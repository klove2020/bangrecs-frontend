// import sakuraStyles from 'sakura.css/css/sakura.css';  // 请更改为实际路径

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import styled from 'styled-components';

import remarkToc from 'remark-toc';
import {remark} from 'remark';
import remarkHtml from 'remark-html';

// import 'github-markdown-css/github-markdown.css';


// import sakuraStyles from 'sakura.css/css/sakura.css';  // 请更改为实际路径

// const SakuraDiv = styled.div`${sakuraStyles}`;

// const Md2Page = ({ filePath }) => { // 注意，这里使用了 props 来传递 filePath
//     const [markdown, setMarkdown] = useState('');
//     const [isLoading, setIsLoading] = useState(true); // 新增状态变量

//     useEffect(() => {
//         const fetchMarkdown = async () => {
//             try {
//                 const response = await axios.get(filePath);
//                 setMarkdown(response.data);
//             } catch (error) {
//                 console.error('Error fetching markdown:', error);
//             }
//             setIsLoading(false); // 数据加载完成
//         };

//         fetchMarkdown();
//     }, [filePath]); // filePath 作为依赖
        
//     return (
//         <div className='mysakura'>
//             {markdown && (
//                 <ReactMarkdown
//                     children={markdown}
//                     remarkPlugins={[remarkToc({ heading: '目录', maxDepth: 4 })]}
//                 />
//             )}
//         </div>
//     );
// };


const Md2Page = ({ filePath }) => {
    const [markdownHtml, setMarkdownHtml] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMarkdown = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(filePath);
                const processedMarkdown = await remark()
                    .use(remarkToc, { heading: '目录', maxDepth: 4 })
                    .use(remarkHtml)
                    .process(response.data) // 处理 Markdown 文本
                    // .then(processedMarkdown => {
                    //     const htmlContent = processedMarkdown.toString();
                    //     console.log(htmlContent); // 打印处理后的 HTML
                        // setMarkdownHtml(htmlContent); // 设置状态
                    // })
                setMarkdownHtml(processedMarkdown.toString());
            } catch (error) {
                console.error('Error fetching markdown:', error);
            }
            setIsLoading(false);
        };

        fetchMarkdown();
    }, [filePath]);

    // if (isLoading) {
    //     return <div>Loading...</div>; // 显示加载指示器
    // }

    return (
        <div className='mysakura' dangerouslySetInnerHTML={{ __html: markdownHtml }} />
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

export const ReportPage = () => {
    const filePath = '/bgmrec/markdown/report.md';
    return <Md2Page filePath={filePath} />;
};

// export const ThankPage = () => {
//     const filePath = '/bgmrec/markdown/thank.md';
//     return <Md2Page filePath={filePath} />;
// };