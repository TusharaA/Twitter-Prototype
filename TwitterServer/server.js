
		//super simple rpc server example
var amqp = require('amqp')
, util = require('util');


var login = require('./services/login_server');
var home = require('./services/userhome_server');
var profile = require('./services/userprofile_server');
var follower = require('./services/getfollower_server');
var following = require('./services/getfollowing_server');
var tweets = require('./services/addtweets_server');
var updtfoll = require('./services/updtfoll_server');
var addretweet = require('./services/addretweet_server');
var search = require('./services/hashtag_server');
var editprofile = require('./services/editprofile_server');

var cnn = amqp.createConnection({host:'127.0.0.1'});

var mongo = require('./services/mongo');
var mongoURL = "mongodb://localhost:27017/twitter";
mongo.connect(mongoURL, function(){

});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('logsign_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.msgstatus == 'signup')
				{
			login.signup(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		}
			else if(message.msgstatus == 'contactinfo')
			{
				login.contact(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
			else if(message.msgstatus == 'username')
			{
				login.username(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
			else if(message.msgstatus == 'login')
			{
				login.loggedin(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
		});
	});
		
	cnn.queue('userhome_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.msg_type == 'userhome')
				{
			home.displayhome(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		}
			else if(message.msg_type == 'hashtag')
			{
				search.searchtag(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
		});
	});
	
	cnn.queue('userprofile_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.msg_type == 'userprofile')
				{
			profile.displayprofile(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		}
			else if(message.msg_type == 'editprofile')
			{
				editprofile.editdetails(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
		});
	});
		
	cnn.queue('tweet_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.msg_type == 'tweet')
				{
			tweets.addtweets(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		}
			else if(message.msg_type == 'retweet')
			{
				addretweet.doretweet(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
		});
	});
	
	cnn.queue('followingfollower_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.msg_type == 'followinglist')
				{
			following.getfollowing(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		}
			else if(message.msg_type == 'followerlist')
			{
				follower.getfollower(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
			else if(message.msg_type == 'updtfollwing')
			{
				updtfoll.updatefollowing(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
		});
	});
	
	
	
});