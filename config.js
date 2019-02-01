'use strict';

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/testBlogTest'
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blogTest';
const PORT = process.env.PORT || 8080;

module.exports = { DATABASE_URL, PORT, TEST_DATABASE_URL }