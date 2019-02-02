const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose')
const faker = require('faker');
const db = mongoose.connection

const { BlogPost } = require('../models')
const { TEST_DATABASE_URL } = require('../config')

chai.use(chaiHttp)

const { runServer, app, closeServer} = require('../server')

function testHooks() {
  before(function() {
    return runServer(TEST_DATABASE_URL)
    });
    beforeEach(function() {
    //   BlogPost.collection.insert(buildCollection())
    console.log('Building Database')
    return BlogPost.insertMany(buildCollection())
                            
  });
  afterEach(function() {
    return dropCollection()
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
  db.dropCollection('posts')
  console.log('dropping collection')
}
 
function buildCollection() {
let seedData = new Array(10);
  for(let i = 0; i < 10; i++) {
    seedData[i] = {
    author: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
    },
    title: faker.lorem.words(),
    content: faker.lorem.paragraph()
    };
  };
  return seedData;
}

/*set up GET tests */
describe('Get route', function() {

  testHooks();

  it('should return a list of restaurants', function() {

    return BlogPost.find()
    .then(function(res) {
      expect(res).to.be.an('array')
      res.forEach(function(post) {
        expect(post).to.be.an('object')
        expect(post).to.have.property('author').that.is.a('object')
        expect(post).to.have.nested.property('author.firstName').that.is.a('string')
        expect(post).to.have.nested.property('author.lastName').that.is.a('string')
        expect(post).to.have.property('title').that.is.a('string')
        expect(post).to.have.property('content').that.is.a('string')
      }) 
    })
  })

  it('should return a single post when provided author id in params', function() {

    

    return BlogPost.findOne()
      .then(data => {
        return chai.request(app)
        .get(`/posts/${data.id}`)
        .then(function(res) {
          expect(res).to.have.status(200)
          expect(res).to.be.an('object')
          expect(res.body.id).to.equal(data.id)
          expect(res.body.author).to.equal(`${data.author.firstName}` + ' ' + `${data.author.lastName}`)
          
          
            
      })
    })
          

    /*Get list to use one - integration testing */
    // return chai.request(app)
    //  .get('/posts')
    //  .then(res => {
    //      expect(res).to.have.status(200)
    //      expect(res).to.be.an('object')
    //      postId = res.body[0].id
    //      console.log(res.body[0])
    //      return chai.request(app)
    //          .get(`/posts/${postId}`)
    //          .then(res => {
    //              expect(res.body.id).to.equal(postId)
    //          })
    //  })

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
  };

  const badPost = {
      author: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName()
      },
      title: faker.lorem.words()
  };

  it('UNIT - should create a new post', function() {
      /*unit Testing */
    return BlogPost.create(newPost)
    .then(res => {
      expect(res).to.be.an('object')
      expect(res).to.have.property('id')
      expect(res.author.firstName).to.equal(newPost.author.firstName)
      expect(res.author.lastName).to.equal(newPost.author.lastName)
      expect(res.title).to.equal(newPost.title)
    })

  })

  it('INTEGRATION - should create a new post', function() {
      /*Integration Testing */
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



  it('INTEGRATION - should fail if request is missing data', function() {
      /*Integration Testing */
    return chai.request(app)
    .post('/posts')
    .send(badPost)
    .then(res => {
      expect(res).to.have.status(400)
    })
  })
})
    
    
describe('Update/PUT routes', function() {
  testHooks();

  // var updatePost = {
  //     author: {
  //         firstName: faker.name.firstName(),
  //         lastName: faker.name.lastName()
  //     },
  //     title: faker.name.words(),
  //     content: faker.name.paragraph()
  // }

  function updater(obj1, obj2) {
    obj1._id = obj2._id
    obj1.author = 'Author not found in db!'
    obj1.title = 'Title has been removed!';
    obj1.content = 'Content Removed!';
    return obj1
  }

  var newPost = { }

  it('UNIT - should obtain the correct post based on id', function() {
      /*Unit Testing */
    return BlogPost.findOne()
    .then(oldPost => {
      updater(newPost, oldPost)
      return BlogPost.findByIdAndUpdate({_id: oldPost._id}, newPost, {new: true})
      .then(res => {
        expect(res).to.be.an('object')
        expect(res.id).to.equal(oldPost.id)
        expect(res.author).to.not.equal(oldPost.author)
        expect(res.title).to.not.equal(oldPost.title)
        expect(res.content).to.not.equal(oldPost.content)
      })
    })
  })

  it.only('Should obtain the correct post and return and updated version', function() {

  
      /*Integration Testing */
    return chai.request(app)
    .get('/posts')
    .then(res => {
      
      updater(newPost, res.body[0])
      console.log(newPost)
      // return chai.request(app)
      // .put(`/posts/${newPost.id}`)
      // .send(newPost)
      // .then(res => {
      //   console.log(res.body)
      // })
    })
  })
})





