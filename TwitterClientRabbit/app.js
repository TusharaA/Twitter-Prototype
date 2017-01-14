
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var login = require('./routes/login');
var mongoSessionConnectURL = "mongodb://localhost:27017/twitter";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(express.cookieParser());
app.use(expressSession({
	secret: 'twitterApp',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));
app.use( express.static( "public" ) );

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/twitterHome', login.enterTwitterPage); //display home page of twitter
app.post('/login', login.enterLoginSignup); //direct to login-page
app.post('/signup', login.enterLoginSignup); //direct to signup-page
app.get('/signup',login.enterSignup); //direct to signup page from login page
app.post('/contactInfo',login.signUp); //direct to contactInfo Page
app.get('/userName',login.enterContactDetails); //when user clicks on skip on contactinfo page
app.post('/userName',login.enterContactDetails); //direct to username Page
app.post('/checkUserName',login.checkUserName); 
app.post('/checkLogin',login.checklogin); 
app.get('/homepage',login.redirectHomepage);
app.get('/homepage/userProfile',login.redirectProfile);
app.post('/addTweet',login.addTweet);
app.get('/logout',login.userLogout);
app.post('/updateFollowing',login.updateFollowing);
app.get('/displayFollowingList',login.getFollowing);
app.get('/displayFollowerList',login.getFollowers);
app.post('/performReTweet', login.performReTweet);
app.post('/getSearch',login.getSearchString);
app.get('/editProfile',login.setFlag);
app.post('/updateTable',login.updateDetails);

mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log("Express server listening on port " + app.get('port'));
	});
});