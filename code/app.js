const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes);

server.listen(3000);

// run project:
// npm start
// or
// node app.js
// or
// if you custom script key in package.json like this: "start_server": "node app.js"
// npm run start_server
// or
// if you install nodemon globally, you can run:
// nodemon app.js
// if you install nodemon locally, you can set script key in package.json like this: "start": "nodemon app.js"
// and run: npm start

// install nodemon in dev mode:
// npm install --save-dev nodemon
// with: save is for production mode, save-dev is for development mode
// install nodemon in global mode:
// npm install -g nodemon