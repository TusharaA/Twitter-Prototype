var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";
var crypto = require('crypto');

exports.signup = function(msg, callback){	
	var res = {};
	var fname = msg.fname;
	var lname = msg.lname;
	var emailId = msg.emailId;
	var password = msg.password;
	var cpassword = msg.cpassword;
	var newPassword = crypto.createHash("sha1").update(password).digest('hex');
	var confirmNewPassword = crypto.createHash("sha1").update(cpassword).digest('hex');
//	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userdetails');
		coll.findOne({emailId: emailId}, function(err, user){
			if (user && user.hasOwnProperty("emailId")) {
			res.value = "Existing";
			callback(null, res);
			} else {				
				// inserting the user's entry in database
				if (password == cpassword) {																	
						var coll = mongo.collection('userdetails');
						var addFollowList = [];							
						coll.find({ 'emailId': { $ne: emailId}},{"emailId":1,"firstName":1,"lastName":1,"twitterHandle":1,"_id":0}).toArray(function(err, user){
							if(user)
								{									
								for(var u=0; u<user.length; u++){
									addFollowList.push({"emailId":user[u].emailId, "firstName":user[u].firstName, "lastName":user[u].lastName ,"twitterHandle":user[u].twitterHandle});
								}
								coll.insert({"emailId":emailId,"userPassword":newPassword,"firstName":fname,"lastName":lname, "userName":"","twitterHandle" : "", "followingCount" : 0, "followerCount" : 0, "tweetCount" : 0,"birthDate" : "", "contactInfo": "","locationInfo" : "", "follower" : [], "following" : [],"whoToFollow":addFollowList});										
								}							
							else
								{
								coll.insert({"emailId":emailId,"userPassword":newPassword,"firstName":fname,"lastName":lname, "userName":"","twitterHandle" : "", "followingCount" : 0, "followerCount" : 0, "tweetCount" : 0,"birthDate" : "", "contactInfo": "","locationInfo" : "", "follower" : [], "following" : [],"whoToFollow":[]});			
								}
							res.value="Success";
							callback(null, res);
						});									
				} else {
				res.value ="Mismatch";	
				callback(null, res);
				}
			}
			
		});			
//	});
};

exports.contact = function(msg, callback){
	var res = {};
	var contactInfo = msg.contactInfo;
	var emailId = msg.emailId;
//	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('userdetails');
		coll.findOne({"contactInfo": contactInfo}, function(err, user){
			if (user && user.hasOwnProperty("contactInfo")) {
				res.value = "Existing";	
				callback(null, res);
			} else {
			coll.update({emailId:emailId},{$set:{contactInfo: contactInfo}}, function(err,user){				 
					if(err)
					{
						throw err;
					}				
					else
					{
					res.value = "Success";	
					callback(null, res);
					}//closing else inside update              		   			}
				      });
			}
			
		});
//	});	
};

exports.username = function(msg, callback){
	var res = {};
	var username = msg.username;
	var twitterHandle = msg.twitterHandle;
	var emailId = msg.emailId;
	var fname = msg.fname;
	var lname = msg.lname;	
	
//	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userdetails');
		coll.findOne({"userName": username}, function(err, user){
			if (user && user.hasOwnProperty("username")) {
				console.log("UserName already exists");
				res.value = "Existing";
				callback(null, res);						
			} else {
			coll.update({emailId:emailId},{$set:{userName: username,twitterHandle:twitterHandle}}, function(err,user){
			coll.update({ 'emailId': { $ne: emailId}},{$push: {whoToFollow:{emailId:emailId,firstName:fname,lastName:lname,twitterHandle:twitterHandle}}},{w:1, multi: true},function(err,updateWhoToFollow){
				res.value = "Success";
				callback(null, res);	
							});
				      });
			}
		});
//	});		
};

exports.loggedin = function(msg, callback){
	var res = {};
	var emailId = msg.emailId;
	var password = msg.password;
	var dbpassword = crypto.createHash("sha1").update(password)
	.digest('hex');
//	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userdetails');
		coll.findOne({"emailId": emailId, "userPassword":dbpassword}, function(err, user){
			if (user)
			{		
				res.emailId = emailId;
				res.fname = user.firstName;
				res.lname = user.lastName;		 
				res.fullName = user.firstName + " " + user.lastName;
				res.twitterHandle = user.twitterHandle;
				res.followerCount = user.followerCount;
				res.followingCount = user.followingCount;
				res.tweetCount = user.tweetCount;
				res.value = "Success";
				callback(null, res);
			}
			else
			{
				res.value = "Failed";
				callback(null, res);
			}
				});
//	});		
	
};
