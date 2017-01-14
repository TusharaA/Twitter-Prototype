var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";
var crypto = require('crypto');

exports.displayhome = function(msg, callback){
	var res = {};
	var emailId = msg.emailId;
	
//	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userdetails');
		coll.findOne({"emailId": emailId},{"whoToFollow":1,"following":1,"_id":0}, function(err, user){
			if (err) {
				throw err;
			} else{
				if (user && user.hasOwnProperty("whoToFollow")){
					var whoToFollowListArray=[];
					for(var u=0; u<user.whoToFollow.length; u++){
						whoToFollowListArray.push({"emailId":user.whoToFollow[u].emailId, "firstName":user.whoToFollow[u].firstName, "lastName":user.whoToFollow[u].lastName ,"twitterHandle":user.whoToFollow[u].twitterHandle});
					}
					var followingList=[];
					for(var u=0; u<user.following.length; u++){
						followingList.push(user.following[u].emailId);
					}			
					res.followingList = whoToFollowListArray;					
					mongo.connect(mongoURL, function(){
						var coll = mongo.collection('tweets');
						coll.find({"emailId":{ $in: followingList}},{"_id":0}).sort({"tweetTime":-1}).toArray(function(err, tweetResult){
							if (err) {
								throw err;
							} else{
								if (tweetResult){
									res.tweetValue = tweetResult;										
									mongo.connect(mongoURL, function(){
									var coll = mongo.collection('userdetails');
								coll.findOne({"emailId": emailId},{"tweetCount":1,"followingCount":1,"followerCount":1,"twitterHandle":1,"_id":0}, function(err, countValues){
								if (err) {
								throw err;
							} else{
								if (countValues){
									res.tweetCount = countValues.tweetCount;
									res.followerCount = countValues.followerCount;
									res.followingCount = countValues.followingCount;
									res.twitterHandle = countValues.twitterHandle;
									callback(null, res);
								}
							}
						});
					});
								}
							}
						});
					});
				}

			}

		});
//	});
	
};