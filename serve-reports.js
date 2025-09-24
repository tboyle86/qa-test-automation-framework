const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ALLURE_DIR = path.join(__dirname, 'test-results', 'allure-report');

const server = http.createServer((req, res) => {
    let filePath = path.join(ALLURE_DIR, req.url === '/' ? 'index.html' : req.url);
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        
        const ext = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.ico': 'image/x-icon'
        }[ext] || 'text/plain';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Allure report serving at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});