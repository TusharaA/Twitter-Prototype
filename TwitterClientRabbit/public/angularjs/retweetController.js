//defining the login controller
twitterStart.controller('reTweetController', function($scope, $http) {
	$scope.followingFlag = true;
	$scope.myTweets=false;
	$scope.followerFlag=true;
	$scope.retweet= function(tweetId,tweetOwnerId) {
		$http({
			method : "POST",
			url : '/performReTweet',
			data : {
				"tweetId" : tweetId
			}
		}).success(function(data) {
			window.location.assign("/homepage");

		}).error(function(error) {

		});
	};

	$scope.getFollowingList= function (){
		$http({
			method : "GET",
			url : '/displayFollowingList',
		}).success(function(data) {
			if(data.statusDisplayFollowingList !=404){
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
			if(data.statusDisplayFollowerList !=404){
				$scope.followingFlag = true;
				$scope.myTweets=true;
				$scope.followerFlag=false;
				$scope.followerList = data.followerList;
			}
		}).error(function(error) {

		});
	};
	
	
});