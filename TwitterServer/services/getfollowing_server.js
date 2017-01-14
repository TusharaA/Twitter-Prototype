var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";
var crypto = require('crypto');

exports.getfollowing = function(msg, callback){
	var res = {};
	var emailId = msg.emailId;
//	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userdetails');
		coll.findOne({"emailId":emailId},{"following":1,"_id":0},function(err, user){
			if (err) {
				throw err;
			} else{
				var followingList=[];
				for(var j=0; j<user.following.length; j++){
					followingList.push({"emailId":user.following[j].emailId,"firstName":user.following[j].firstName,"lastName":user.following[j].lastName,"twitterHandle":user.following[j].twitterHandle});
				}
				res.followingList = followingList;
				callback(null, res);				
			}
		});
//	});
};