const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const mongoose = require('mongoose')

chai.use(chaiHttp)

const { runServer, app, closeServer} = require('../server')



    before(function() {
        runServer
    });
    beforeEach(function() {
        console.log('starting another test')
    });
    afterEach(function() {
        console.log('finished test')
    });
    after(function() {
        closeServer
    });

describe('GET route', function() {
    it('should return a list of restaurants', function() {
        return chai.request(app)
          .get('/posts')
    })
})


