const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose')

chai.use(chaiHttp)

const { runServer, app, closeServer} = require('../server')

describe('server', function() {


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


    it('should return a list of restaurants', function() {
         return chai.request(app)
          .get('/posts')
          .then(function(res) {
            expect(res).to.have.status(207)
          })
    })


})
