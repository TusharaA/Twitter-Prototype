//defining the login controller
twitterStart.controller('displayController', function($scope, $http) {
	$scope.followingFlag = true;
	$scope.myTweets=false;
	$scope.followerFlag=true;
	
	$scope.retweet= function(tweetText,tweeterFirstName,tweeterLastName,tweeterTwitterHandle) {
		$http({
			method : "POST",
			url : '/performReTweet',
			data : {
				"tweetText":tweetText,
				"tweeterFirstName":tweeterFirstName,
				"tweeterLastName":tweeterLastName,
				"tweeterTwitterHandle":tweeterTwitterHandle
			}
		}).success(function(data) {
			window.location.assign("/homepage");

		}).error(function(error) {

		});
	}; 

	
	$scope.retweetProfile= function(tweetId,tweetOwnerId) {
		$http({
			method : "POST",
			url : '/performReTweet',
			data : {
				"tweetId" : tweetId
			}
		}).success(function(data) {
			window.location.assign("/homepage/userProfile");

		}).error(function(error) {

		});
	}; 
	
	$scope.getFollowingList= function (){
		$http({
			method : "GET",
			url : '/displayFollowingList',
		}).success(function(data) {
			if(data.statusGetFollowing == 200){
				$scope.followingFlag = false;
				$scope.myTweets=true;
				$scope.followerFlag=true;
				$scope.followingList = data.followingList;
			}
		}).error(function(error) {

		});
	};
	
	$scope.getFollowerList= function (){
		$http({
			method : "GET",
			url : '/displayFollowerList',
		}).success(function(data) {
			if(data.statusGetFollowers == 200){
				$scope.followingFlag = true;
				$scope.myTweets=true;
				$scope.followerFlag=false;
				$scope.followerList = data.followerList;
			}
		}).error(function(error) {

		});
	};
	
	
});