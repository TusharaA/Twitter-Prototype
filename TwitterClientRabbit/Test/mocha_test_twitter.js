var request = require("request")
, express = require("express")
,assert = require("assert")
,http = require("http");
describe('http tests', function(){
	
	it('should return profile page if the url is correct', function(done){
		http.get('http://localhost:3000/homepage/userProfile', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	});
		
	it('should signup a new user', function(done) {
		request.post(
			    'http://localhost:3000/contactInfo',
			    { form: { fname: 'John',lname : 'Ryan' , emailID : 'john.ryan@gmail.com' , passwd:'abc' , passwd1 : 'abc' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('should not return the login page if the url is wrong', function(done){
		http.get('http://localhost:3000/userlogin', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});  

	it('should login existing user', function(done) {
		request.post(
			    'http://localhost:3000/checkLogin',
			    { form: { emailID: 'william.donald@gmail.com',password:'abc@123' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('should return the tweets with hashtag', function(done) {
		request.post(
			    'http://localhost:3000/getSearch',
			    { form: { searchKey: '#mondaymotivation',lname : 'D' , emailID : 'william.donald@gmail.com' , passwd:'abc' , passwd1 : 'abc' } },
			    function (error, response, body) {
			    	assert.equal(302, response.statusCode);
			    	done();
			    }
			);
	  });
});
