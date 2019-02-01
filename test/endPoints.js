const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose')
const faker = require('faker');

chai.use(chaiHttp)

const { runServer, app, closeServer} = require('../server')

function testHooks() {
    before(function() {
        return runServer()
     });
     beforeEach(function() {
         console.log('refurbished server')
     });
     afterEach(function() {
         console.log('refurbish server for next use')
     });
     after(function() {
         return closeServer()
     });
}

/*
-Each describe block:
-Starts the test server and makes sure it's empty;

-each test inside the block:
    -genereates fresh mock data and populates db
    -tests;
    -drop db(maybe collection?)

-purge db/collection
-close db connection

 */
function mockData() {
    return `{
        author: {
            firstName: String,
            lastName: String
        },
        title: 
    }`
}

/*const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
}, {collection: 'posts'}); */



describe('Get route', function() {

    testHooks();

    it('should return a list of restaurants', function() {
         return chai.request(app)
          .get('/posts')
          .then(function(res) {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res).to
          })
    })


})
