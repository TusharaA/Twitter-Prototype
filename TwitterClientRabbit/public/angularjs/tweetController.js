twitterStart.controller('tweetController', function($scope, $http) {
	$scope.tweetSuccess = true;
	
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/addTweet',
			data : {
				"tweetText" : $scope.tweetText
			}
		}).success(function(data) {
			//checking the response data for statusCode
				window.location.assign("/homepage"); 
				$scope.tweetSuccess = false;
		}).error(function(error) {
		});
	};	
	
	
	$scope.submitProfile = function() {
		$http({
			method : "POST",
			url : '/addTweet',
			data : {
				"tweetText" : $scope.tweetText
			}
		}).success(function(data) {
			//checking the response data for statusCode
				window.location.assign("/homepage/userProfile"); 
				$scope.tweetSuccess = false;
		}).error(function(error) {
		});
	};	
})