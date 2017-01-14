var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";

exports.searchtag = function(msg, callback){
	var res = {};
	var searchKey = msg.searchKey;
	var searchResults = [];
//mongo.connect(mongoURL, function(){		
		var coll = mongo.collection('tweets');
		coll.find({"twitterText": new RegExp(searchKey,'i')},{"emailId":1,"twitterText":1,"tweetOwnerIdFirstName":1,"tweetOwnerIdLastName":1,"tweetOwnerIdTwitterHandle":1,"_id":0}).toArray(function(err,searchres)
				{
			if(searchres)
				{			
				for (var u=0; u<searchres.length; u++){	
					searchResults.push({"twitterHandle":searchres[u].tweetOwnerIdTwitterHandle,"tweetOwnerEmail":searchres[u].emailId, "tweetText":searchres[u].twitterText,"firstName":searchres[u].tweetOwnerIdFirstName,"lastName":searchres[u].tweetOwnerIdLastName});			
				}	
				res.searchResults = searchResults;
				callback(null, res);
				}			
				});		
//	});
};