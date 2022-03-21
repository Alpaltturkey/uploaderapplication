const express = require('express'); // Fast web framework for node js

// Setting up express & must use middleware
let app = express();
app.set('trust proxy', 1); // When using something like nginx or apache as a proxy

app.use(express.json()); // Allows use of req.body (for json)

app.use('/', express.static('.'));

// Setting up node js server
let port = process.env.PORT || 15103;
let server = app.listen(port, () => console.log(`Server running on port ${port}...`));

// Basic Routing
app.get('/robots.txt', (req, res) => {
    console.log(req)
    res.sendFile('robots.txt', {root: '.'})
});
app.get('*', (req, res) => {
    console.log(req);
    res.sendFile('index.html', {root: '.'})
});