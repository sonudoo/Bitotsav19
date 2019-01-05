const mongojs = require('mongojs');
const secretKey = 'sidh8c7thw78ergiqc3e';
const db = mongojs('mongodb://bitotsav:Bitotsav2019!%40@52.247.203.150:27017/bitotsav',['bitotsav']);

module.exports = {
    secretKey,
    db
}