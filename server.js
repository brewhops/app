const http = require('http');
const micro = require('micro');
const path = require('path');
const serveStatic = require('serve-static');

const staticDirectory = path.join(__dirname, 'dist');
const server = new http.Server(micro(serveStatic(staticDirectory)));

server.listen(process.env.PORT || 3000);