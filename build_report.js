const fs = require('fs');
const path = require('path');

let report = fs.readFileSync('report.md', 'utf-8');

// Replace missing image paths with fake online placeholders so they take up 1/2 a physical page each
report = report.replace(/!\[(.*?)\]\((.*?)\)/g, '![Placeholder](https://via.placeholder.com/800x600.png?text=Insert+Screenshot+Here)');

// Append Code
const filesToAppend = [
    { title: 'Appendix A.1: index.html', lang: 'html', file: 'index.html' },
    { title: 'Appendix A.2: style.css', lang: 'css', file: 'style.css' },
    { title: 'Appendix A.3: script.js', lang: 'javascript', file: 'script.js' },
    { title: 'Appendix B.1: server.js', lang: 'javascript', file: 'server.js' },
    { title: 'Appendix B.2: db.js', lang: 'javascript', file: 'db.js' }
];

let paddingText = '\n\n<div style="page-break-after: always;"></div>\n\n## Complete Source Code Appendices\n';

filesToAppend.forEach(item => {
    try {
        const content = fs.readFileSync(item.file, 'utf-8');
        paddingText += `\n### ${item.title}\n\`\`\`${item.lang}\n${content}\n\`\`\`\n\n<div style="page-break-after: always;"></div>\n`;
    } catch (e) {
        console.error(`Failed to read ${item.file}`);
    }
});

fs.writeFileSync('report.md', report + paddingText);
console.log('Appended code perfectly.');
