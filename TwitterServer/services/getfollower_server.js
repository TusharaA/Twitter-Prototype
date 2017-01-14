var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";

exports.getfollower = function(msg, callback){
	var res = {};
	var emailId = msg.emailId;	
//	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userdetails');
		coll.findOne({"emailId":emailId},{"follower":1,"_id":0},function(err, user){
			if (err) {
				throw err;
			} else{
				var followerList=[];
				for(var j=0; j<user.follower.length; j++){
					followerList.push({"emailId":user.follower[j].emailId,"firstName":user.follower[j].firstName,"lastName":user.follower[j].lastName,"twitterHandle":user.follower[j].twitterHandle});
				}
				res.followerList = followerList;
				callback(null, res);
			}
		});
//	});	
};