const mongojs = require('mongojs');
const crypto = require('crypto');
const secretKey = 'sidh8c7thw78ergiqc3e';
const db = mongojs('mongodb://bitotsav:OhY0ALah5M7agATp5ZRPn7Ke3Y2CyRp1Tdo0YSndFIuednrkdnEQUdcFxV1kCkcdReA19GjCtW3AWsQ6EHYRCw==@bitotsav.documents.azure.com:10255/?ssl=true&replicaSet=globaldb',['bitotsav']);

module.exports = {
    secretKey,
    db
}