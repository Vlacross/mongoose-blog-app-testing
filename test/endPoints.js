const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose')

chai.use(chaiHttp)

const { runServer, app, closeServer} = require('../server')



    before(function() {
        return runServer()
    });
    beforeEach(function() {
        console.log('starting another test')
    });
    afterEach(function() {
        console.log('finished test')
    });
    after(function() {
        return closeServer()
    });

describe('GET route', function() {
    it('should return a list of restaurants', function() {
         chai.request(app)
          .get('/posts')
          .then(function(res) {
            expect(res).to.have.status(207)
          })
    })
})


