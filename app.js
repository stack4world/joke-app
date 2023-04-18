const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
    dotenv.config();
    console.info('Env File Loaded');
} else {
    dotenv.config({ path: path.join(__dirname, '.env.local') });
    console.info('Local Env File Loaded');
}

const mainRouter = require('./server');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static('public'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});

app.use('/jokes', mainRouter);

// Basic 404 handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, req, res, next) => {
    /* eslint no-unused-vars: "off" */
    console.info((err && err.message) ? err.message : err);
    const {
        status,
        message
    } = err;
    if (Number.isInteger(status) && message) {
        res.status(status).send(message);
        return;
    }
    res.status(500).send('Something broke!');
});

app.listen(process.env.PORT || '3005', function () {
    console.log('API is listening on port ' + (process.env.PORT || '3005'));
});