var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";

exports.updatefollowing = function(msg, callback){
	var res = {};
	var emailId = msg.emailId;
	var fname = msg.fname;
	var lname = msg.lname;
	var twitterHandle = msg.twitterHandle;
	var followemailID = msg.followemailID;
	var followfn = msg.followfn;
	var followln = msg.followln;
	var followth = msg.followth;
//	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userdetails');
		coll.update({'emailId':emailId},{$push: {"following": {"emailId":followemailID,"firstName":followfn,"lastName":followln,"twitterHandle":followth}}});
		coll.update({'emailId':followemailID},{$push: {"follower":{"emailId":emailId,"firstName":fname,"lastName":lname,"twitterHandle":twitterHandle}}});
		coll.update({"emailId":emailId},{$pull:{ "whoToFollow":{"emailId":followemailID}}});
		coll.findOne({"emailId":emailId},{"followingCount":1,"_id":0},function(err, user){
			if (err) {
				throw err;
			} else{
				if(user && user.hasOwnProperty("followingCount")){
					var fc = parseInt(user.followingCount) + 1;						
					coll.update({'emailId':emailId},{$set: {"followingCount": fc}});
					coll.findOne({"emailId":followemailID},{"followerCount":1,"_id":0},function(err, user){
						if (err) {
							throw err;
						} else{
							if(user && user.hasOwnProperty("followerCount")){
								var flc = parseInt(user.followerCount) + 1;			
								coll.update({'emailId':followemailID},{$set: {"followerCount": flc}});
								res.value = "Success";
								callback(null, res);
							}
						}
					});
				}
			}
		});
//	});	
};