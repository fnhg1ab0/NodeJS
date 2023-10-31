const fs = require('fs');

const requestHandler = (req, res) => {
    // console.log(req);
    // console.log(req.url, req.method, req.headers);

    const url = req.url;
    if (url === '/') {
        res.write('<html lang="">');
        res.write('<head><title>My First Node App</title></head>');
        res.write('<body><h1>Welcome to my Node App</h1>');
        res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    } else if (url === '/message') {
        const body = [];

        // parse the request body
        // listen to the data event
        req.on('data', (chunk) => {
            body.push(chunk);
            console.log(chunk);
        });

        // listen to the end event
        // the end event is fired when the data event is parsed
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[0];
            fs.writeFile('message.txt', message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }


    // send response
    res.setHeader('Content-Type', 'text/html');
    res.write('<html lang="">');
    res.write('<head><title>My First Node App</title></head>');
    res.write('<body><h1>My First Node App</h1></body>');
    res.write('</html>');
    res.end();

    // close the connection and exit the loop
    //process.exit();
}

module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//      someText: 'Some hard coded text'
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some hard coded text';


// If exporting individual components, a shortcut can be used:
// exports.handler = requestHandler;
// exports.someText = 'Some hard coded text';