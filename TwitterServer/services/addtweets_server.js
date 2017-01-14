var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";

exports.addtweets = function(msg, callback){
	var res = {};
	var emailId = msg.emailId;
	var tweetText = msg.tweetText;
	var fname = msg.fname;
	var lname = msg.lname;
	var twitterHandle = msg.twitterHandle;
//	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll1 = mongo.collection('userdetails');	
		coll1.findOne({"emailId":emailId},{"tweetCount":1,"_id":0},function(err,result)
			{
			var tweetCount = parseInt(result.tweetCount) + 1 ;
		coll1.update({"emailId":emailId},{$set:{"tweetCount":tweetCount}},function(err,reslt)
				{
			if(err)
				{
				throw err;
				}
			if(reslt)
				{
				var coll = mongo.collection('tweets');			
				coll.insert({"emailId":emailId,"tweetOwnerIdFirstName":fname,"tweetOwnerIdLastName":lname,"twitterText":tweetText, "tweetOwnerIdTwitterHandle":twitterHandle,"tweetTime" : new Date()});
				res.value = "Success";
				callback(null, res);
				}
			});
						
			});
//	});	
};