const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose')
const faker = require('faker');
const db = mongoose.connection

const { BlogPost } = require('../models')

chai.use(chaiHttp)

const { runServer, app, closeServer} = require('../server')

function testHooks() {
    before(function() {
        return runServer()
     });
     beforeEach(function() {
         buildCollection()
     });
     afterEach(function() {
         dropCollection()
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
console.log('refurbish server for next use')
-purge db/collection
-close db connection

 */
function dropCollection() {
    db.dropCollection('postsers')
    console.log('dropping collection')
}
 
function buildCollection() {
console.log('Building new Collection!')
    for(let i = 0; i < 10; i++) {
        console.log(i)
        let newPost = mockData()
        newPost.then(function(post) {
            return post
        })
    }
}

function mockData() {
    return BlogPost.create({
        author: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        },
        title: faker.lorem.words(),
        content: faker.lorem.paragraph()
    })
    // .then(function(post) {console.log(post)})
}
    /*set up GET tests */
    describe('Get route', function() {

        testHooks();
        it('should return a list of restaurants', function() {
            return chai.request(app)
            .get('/posts')
            .then(function(res) {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('array')
                expect(res).to.be.an('object')
                res.body.forEach(post => {
                    expect(post).to.have.property('author').that.is.a('string')
                    expect(post).to.have.property('title').that.is.a('string')
                    expect(post).to.have.property('content').that.is.a('string')

                })
                
            })
        })

        it('should return a single post when provided author id in params', function() {

            var postId

            /*Get list to use one */
            return chai.request(app)
            .get('/posts')
            .then(res => {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                postId = res.body[0].id
                return chai.request(app)
                    .get(`/posts/${postId}`)
                    .then(res => {
                        expect(res.body.id).to.equal(postId)
                    })
            })

        })

    })
    /*set up Post tests */
    describe('Post route', function() {

        testHooks();

        const newPost = {
            author: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            },
            title: faker.lorem.words(),
            content: faker.lorem.paragraph()
        }

        const badPost = {
            author: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            },
            title: faker.lorem.words()
        }

        it('should create a new post', function() {
            return chai.request(app)
            .post('/posts')
            .send(newPost)
            .then(res => {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                expect(res.body).to.be.an('object')
                expect(res.body.author).to.equal(`${newPost.author.firstName}` + ' ' + `${newPost.author.lastName}`)
                expect(res.body.title).to.equal(newPost.title)
                expect(res.body.content).to.equal(newPost.content)
                console.log()        
            })
        })

        it('should fail if request is missing data', function() {
            return chai.request(app)
            .post('/posts')
            .send(badPost)
            .then(res => {
                expect(res).to.have.status(400)
            })
        })

        describe('Update/PUT routes', function() {
            
        })


})