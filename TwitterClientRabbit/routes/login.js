var ejs = require("ejs");
var mq_client = require('../rpc/client');
var fname, lname, emailId, password, contactInfo, username, twitterHandle;

//enter twitter home page
exports.enterTwitterPage = function(req, res) {
	ejs.renderFile('./views/startTwitter.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}

//enter login/signup page
exports.enterLoginSignup = function(req, res) {
	var buttonStart = req.body.submit;
	if (buttonStart == 'loginStart') {
		ejs.renderFile('./views/login.ejs', function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});
	} else if (buttonStart == 'signupStart') {
		ejs.renderFile('./views/signup.ejs', function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});
	}
}

exports.enterSignup = function(req, res) {
	ejs.renderFile('./views/signup.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}

//enter signup page
exports.signUp = function(req, res) {

	var fname = req.param("fname");
	var lname = req.param("lname");
	var emailId = req.param("emailID");
	var password = req.param("passwd");
	var cpassword = req.param("passwd1");
	var errorMessage = '';
	var msgstatus = 'signup';

	var msg_payload = {"fname" : fname , "lname" : lname , "emailId" : emailId , "password" : password , "cpassword" : cpassword , "msgstatus" : msgstatus };
	if(fname.length > 0  && lname.length > 0 && emailId.length > 0 && password.length > 0)
		{
		req.session.fname = fname;
		req.session.lname = lname;
		req.session.fullName = fname + " " + lname;
		req.session.emailID = emailId;		
mq_client.make_request('logsign_queue',msg_payload, function(err,results){	
		console.log("Value Results: " + results.value);
		if(err){
			throw err;
		}
		else 
		{
			if(results.value == 'Existing')
			{
			ejs.renderFile('./views/signup.ejs', {
									errorMessage : "EmailID already registered"
								}, function(err, result) {
									// render on success
									if (!err) {
										res.end(result);
									}
									// render or error
									else {
										res.end('An error occurred');
										console.log(err);
									}
								});
			}
			else if(results.value == 'Success')
			{
				console.log("In Success");
			ejs.renderFile('./views/contactInfo.ejs', function(err, result) {
										// render on success
										if (!err) {
											res.end(result);
										}
										// render or error
										else {
											res.end('An error occurred');
											console.log(err);
										}
									});
			}
			else if(results.value == "Mismatch")
			{
			ejs.renderFile('./views/signup.ejs', {
										errorMessage : "Password Mismatch"
									}, function(err, result) {
										// render on success
										if (!err) {
											res.end(result);
										}
										// render or error
										else {
											res.end('An error occurred');
											console.log(err);
										}
									});
			}
		}  
	});
		}
	else
	{
	ejs.renderFile('./views/signup.ejs', {
		errorMessage : "Please enter values in the field"
	}, function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
	}		
	}

exports.enterContactDetails = function(req, res) {
	contactInfo = req.param("contactInfo");
	var errorMessage = '';
	var msgstatus = 'contactinfo';
	
	if (contactInfo != '') {
		req.session.contactInfo = contactInfo;	
		var msg_payload = {"contactInfo" : contactInfo , "emailId" : req.session.emailID , "msgstatus" : msgstatus };
		mq_client.make_request('logsign_queue',msg_payload, function(err,results){	
			if(err){
				throw err;
			}
			else 
			{
				if(results.value == "Existing")
				{
				ejs.renderFile('./views/contactInfo.ejs', {
											errorMessage : "Contact Info already registered"
										}, function(err, result) {
											// render on success
											if (!err) {
												res.end(result);
											}
											// render or error
											else {
												res.end('An error occurred');
												console.log(err);
											}
										});
				}
				else if(results.value == "Success")
				{
				ejs.renderFile('./views/username.ejs', {
													errorMessage : ''
												}, function(err, result) {
													// render on success
													if (!err) {
														res.end(result);
													} else {
														res.end('An error occurred');
														console.log(err);
													}
												});
				}
			}
			
		});
		
	}
	else {
		ejs.renderFile('./views/username.ejs', {
			errorMessage : ''
		}, function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});
	}	
};

exports.checkUserName = function(req, res) {
	var username;
	var json_responses;
	var msgstatus = 'username';
	username = req.param("username");
	var twitterHandle;
	req.session.tweetCount = 0;
	req.session.followerCount = 0;
	req.session.followingCount = 0;
	
	if (username != '') {
		req.session.username = username;
		req.session.twitterHandle = '@' + username;
		twitterHandle = '@' + username;
		var msg_payload = {"username" : username , "twitterHandle" : twitterHandle , "emailId" : req.session.emailID ,"fname" : req.session.fname , "lname" : req.session.lname ,  "msgstatus" : msgstatus };
		mq_client.make_request('logsign_queue',msg_payload, function(err,results){	
			if (err)
				{
				throw err;
				}
			else {
			if(results.value == "Existing")
			{
					json_responses = {"status" : 403};
					res.send(json_responses);
			}
			else if(results.value == "Success")
			{
					json_responses = {"status" : 200};
					res.send(json_responses);
			}	
		}
		});
		
	}
	else {
		json_responses = {"status" : 401};
		res.send(json_responses);
	}

};

exports.checklogin = function(req, res) {
	var emailID, password;
	var json_responses;
	emailID = req.param("emailID");
	password = req.param("password");
	var msgstatus = 'login';
	
	if (emailID != '' && password != '') {
		var msg_payload = {"emailId" : emailID , "password" : password ,  "msgstatus" : msgstatus };
		mq_client.make_request('logsign_queue',msg_payload, function(err,results){	
			if(err)
				{
				throw err;
				}
			else {
			if(results.value == "Success")
			{
				req.session.emailID = results.emailId;
				req.session.fname = results.fname;
				req.session.lname = results.lname;
				req.session.fullName = results.fullName;
				req.session.twitterHandle = results.twitterHandle;
				req.session.tweetCount = results.tweetCount;
				req.session.followerCount = results.followerCount;
				req.session.followingCount = results.followingCount;
				
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
			}
			else if(results.value == "Failed")
			{
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
			}
		});		
	}
	else {
		json_responses = {"statusCode" : 401};
		res.send(json_responses);
	}
};

exports.redirectHomepage = function(req, res) { 
	var followingList = '';
	var tweetValue = '';	
	var result;
	var msg_type = "userhome";
	if (req.session.emailID) {		
		var msg_payload = {"emailId" : req.session.emailID , "msg_type" : msg_type};
		mq_client.make_request('userhome_queue',msg_payload, function(err,results){
			if(err)
				{
				throw err;
				}
			else {
			result = {fullName : req.session.fullName,
					twitterHandle : req.session.twitterHandle,
					tweetCount : req.session.tweetCount,
					followerCount : req.session.followerCount,
					followingCount : req.session.followingCount};
			result.followingList = results.followingList;
			result.tweetValue = results.tweetValue;
			result.tweetCount = results.tweetCount;
			result.followerCount = results.followerCount;
			result.followingCount = results.followingCount;
			result.twitterHandle = results.twitterHandle;
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("homepage", result);
			}
		});
	}
	else {
		res.redirect('/twitterHome');
	}	
};

exports.getSearchString = function(req,res)
{
	var searchKey = req.param("searchKey");
	var msg_type = "hashtag";
	if(req.session.emailID){
		var msg_payload = {"emailId" : req.session.emailID, "searchKey" : searchKey , "msg_type" : msg_type};
		mq_client.make_request('userhome_queue',msg_payload, function(err,results){
			if(err)
				{
				throw err;
				}
			else
				{
				var json_response = {"searchResults":results.searchResults,"statusGetSearch":200};
				res.send(json_response);
				}
		});
	}
	else
	{
		res.redirect('/twitterHome');
	}
};

exports.redirectProfile = function(req,res) {
	var result;
	var msg_type = "userprofile";
	if (req.session.emailID) {
		var msg_payload = {"emailId" : req.session.emailID , "msg_type" : msg_type };
		mq_client.make_request('userprofile_queue',msg_payload, function(err,results){
			if(err)
			{
			throw err;
			}
		else {
			console.log("Profile : " + results);
			result = {fullName : req.session.fullName,
					twitterHandle : req.session.twitterHandle };
					result.tweetCount = results.tweetCount;
					result.followerCount = results.followerCount;
					result.followingCount = results.followingCount;
					result.followingList = results.followingList;
					result.username = results.username;
					result.twitterHandle = results.twitterHandle;
					result.contactInfo = results.contactInfo;
					result.locationInfo = results.locationInfo;
					result.dob = results.dob;
					result.firstName = results.firstName;
					result.lastName = results.lastName;
					result.fullName = results.firstName + " " + results.lastName;
					req.session.fullName = results.firstName + " " + results.lastName;
					req.session.fname = results.firstName;
					req.session.lname = results.lastName;
					result.tweetValue = results.tweetValue;
					res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render("userProfile", result);	
		}
		});		
	}
	else {
		res.redirect('/twitterHome');
	}
};

exports.setFlag = function(req,res)
{
var json_response = {"statusFlag":200};
res.send(json_response);
}

exports.updateDetails = function(req,res)
{
	var firstName = req.param("firstName");
	var lastName = req.param("lastName");
	var userName = req.param("userName");
	var contact = req.param("contact");
	var location = req.param("location");
	var birthdate = req.param("birthdate");	
	var msg_type = "editprofile";
	if(req.session.emailID){
		var msg_payload = {"emailId" : req.session.emailID, "firstName" : firstName , "lastName" : lastName , "userName" : userName , "contact" : contact , "location" : location ,"birthdate" : birthdate , "msg_type" : msg_type };
		mq_client.make_request('userprofile_queue',msg_payload, function(err,results){
			if(err){
				throw err;
			}
			else {
				if(results.value == "Success") {
			var json_response = {"statusUpdate":200};
			res.send(json_response);
				}
			}
		});
	}
	else
	{
		res.redirect('/twitterHome');
	}
};


exports.getFollowers = function(req,res)
{
	var followerList = '';
	var msg_type = "followerlist";
	if (req.session.emailID) {
		var msg_payload = {"emailId" : req.session.emailID , "msg_type" : msg_type  };
		mq_client.make_request('followingfollower_queue',msg_payload, function(err,results){
			if(err)
			{
			throw err;
			}
		else {
			var json_response = {"followerList" : results.followerList , "statusGetFollowers": 200};
			res.send(json_response);
		}			
		});
	}
	else {
		res.redirect('/twitterHome');
	}
};

exports.getFollowing = function(req,res) {
	var followingList = '';
	var msg_type = "followinglist";
	if (req.session.emailID) {
		var msg_payload = {"emailId" : req.session.emailID , "msg_type" : msg_type  };
		mq_client.make_request('followingfollower_queue',msg_payload, function(err,results){
			if(err)
			{
			throw err;
			}
		else {
			console.log("Hiiiiiiiiii" + results.followingList);
			var json_response = {"followingList" : results.followingList , "statusGetFollowing": 200};
			res.send(json_response);
		}
		});
	}
	else {
		res.redirect('/twitterHome');
	}
};

exports.updateFollowing = function(req,res)
{
	var followemailID = req.param("followemailID");
	var followfn = req.param("followfn");
	var followln = req.param("followln");
	var followth = req.param("followth");
	var msg_type = "updtfollwing";
	if(req.session.emailID){	
		var msg_payload = {"emailId" : req.session.emailID , "fname" : req.session.fname , "lname" : req.session.lname , "twitterHandle" : req.session.twitterHandle , "followemailID" : followemailID , "followfn" : followfn , "followln" : followln , "followth" : followth , "msg_type" : msg_type   };
		mq_client.make_request('followingfollower_queue',msg_payload, function(err,results){
			if(err)
			{
			throw err;
			}
		else {
			if(results.value == "Success")
				{
				var json_response = {"updateFollowingList":200};
				res.send(json_response);
				}
		}			
		});
	}
	else
	{
		res.redirect('/twitterHome');
	}
};

exports.addTweet = function(req,res)
{
	var json_responses;
	var msg_type = "tweet";
	if (req.session.emailID) {
		var tweetText = req.param("tweetText");
		var msg_payload = {"emailId" : req.session.emailID , "fname" : req.session.fname , "lname" : req.session.lname , "twitterHandle" : req.session.twitterHandle , "tweetText" : tweetText , "msg_type" : msg_type};
		mq_client.make_request('tweet_queue',msg_payload, function(err,results){
			if(err)
			{
			throw err;
			}
		else {
			if(results.value == "Success") {
			json_responses = {"statusTweet" : 200};
			res.send(json_responses);
			}
		}
		});		
	}
	else
	{
	res.redirect('/twitterHome');
	}
};



exports.performReTweet = function(req,res)
{
	var tweetText = req.param("tweetText");
	var tweeterFirstName=req.param("tweeterFirstName");
	var tweeterLastName=req.param("tweeterLastName");
	var tweeterTwitterHandle =req.param("tweeterTwitterHandle");
	var msg_type = "retweet";
	var json_response;	
	if(req.session.emailID){
		var msg_payload = {"emailId" : req.session.emailID , "fname" : req.session.fname , "lname" : req.session.lname , "twitterHandle" : req.session.twitterHandle , "tweetText" : tweetText , "tweeterFirstName" : tweeterFirstName , "tweeterLastName" : tweeterLastName , "tweeterTwitterHandle" : tweeterTwitterHandle , "msg_type" : msg_type  };
		mq_client.make_request('tweet_queue',msg_payload, function(err,results){
			if(err)
			{
			throw err;
			}
		else {
			if(results.value == "Success")
			{
				json_response = {"retweetStatus":200};
				res.send(json_response);
			}
		}
		});
	}
	else
	{
		res.redirect('/twitterHome');
	}
};



exports.userLogout = function(req,res)
{
	req.session.destroy();
	res.redirect('/twitterHome');
}

