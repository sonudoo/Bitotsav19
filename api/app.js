'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const cors = require('cors');
/**
 * Include all the routes
 */
const sapOpsHandler = require('./routes/sap');

const app = express();

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false}));
app.use(validator());

/**
 * CORS middleware. This is important for letting the UI and APIs on separate domain.
 */
app.use(cors());

/**
 * Use all routes here
 */

app.use('/api', sapOpsHandler);

/**
 * Listen indefinitely on port 3000
 */
app.listen(3000, () => {
    console.log('API Server up at port 3000...');
})