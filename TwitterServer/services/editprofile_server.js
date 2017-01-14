var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twitter";

exports.editdetails = function(msg, callback){
	var res = {};
	var firstName = msg.firstName;
	var lastName = msg.lastName;
	var userName = msg.userName;
	var contact = msg.contact;
	var location = msg.location;
	var birthdate = msg.birthdate;
	var emailId = msg.emailId;
//	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('userdetails');
		if (firstName != '')
			{
		coll.update({'emailId':emailId},{$set: {"firstName": firstName}});
		coll.update({'emailId':emailId},{$set: {"tweetOwnerIdFirstName": firstName}});
			}
		if (lastName != '')
			{
		coll.update({'emailId':emailId},{$set: {"lastName": lastName}});
		coll.update({'emailId':emailId},{$set: {"tweetOwnerIdLastName": lastName}});
			}
		if (userName != '')
			{
		coll.update({'emailId':emailId},{$set: {"userName": userName,"twitterHandle": '@'+userName}});
		coll.update({'emailId':emailId},{$set: {"tweetOwnerIdTwitterHandle": '@'+userName}});
			}
		if (contact != '')
		coll.update({'emailId':emailId},{$set: {"contactInfo": contact}});
		if (location != '')
		coll.update({'emailId':emailId},{$set: {"locationInfo": location}});
		if (birthdate != '')
		coll.update({'emailId':emailId},{$set: {"birthDate": birthdate}});	
		res.value = "Success";
		callback(null, res);
//	});	
	
};