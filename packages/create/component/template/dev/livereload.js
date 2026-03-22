const livereload = require('livereload');
const path = require('path');

const server = livereload.createServer();
server.watch([path.resolve(__dirname, '../dev'), path.resolve(__dirname, '../dist')]);
console.log('\u001b[1m\u001b[32mLiveReload enabled😄\u001b[39m\u001b[22m');