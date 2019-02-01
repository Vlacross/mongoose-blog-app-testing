'use strict';

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blogTest';
const PORT = process.env.PORT || 8080;

module.exports = { DATABASE_URL, PORT }