var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";

exports.doretweet = function(msg, callback){
	var res = {};
	var emailId = msg.emailId;
	var fname = msg.fname;
	var lname = msg.lname;
	var twitterHandle = msg.twitterHandle;
	var tweetText = msg.tweetText;
	var tweeterFirstName = msg.tweeterFirstName;
	var tweeterLastName = msg.tweeterLastName;
	var tweeterTwitterHandle = msg.tweeterTwitterHandle;
//	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('tweets');
		var usercoll = mongo.collection('userdetails');
		coll.insert({"emailId":emailId,"originalTweetFirstName":tweeterFirstName,"originalTweetLastName":tweeterLastName,"originalTweetTwitterHandle":tweeterTwitterHandle,"twitterText":tweetText,"tweetTime":new Date(),"tweetOwnerIdFirstName":fname,"tweetOwnerIdLastName":lname,"tweetOwnerIdTwitterHandle":twitterHandle});
		usercoll.findOne({"emailId":emailId},{"tweetCount":1,"_id":0},function(err, user){
			if (err) {
				throw err;
			} else{
				if(user && user.hasOwnProperty("tweetCount")){
					coll.update({'emailId':emailId},{$set: {"tweetCount": parseInt(user.tweetCount)+1}});
					res.value = "Success";
					callback(null, res);
				}
			}
		});
//	});
};