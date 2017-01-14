//defining the login controller
twitterStart.controller('followingController', function($scope, $http) {
	$scope.followingEmailId = function(followingEmailIDValue,followingFirstName,followingLastName,followingTwitterHandle) {
		$http({
			method : "POST",
			url : '/updateFollowing',
			data : {
				"followemailID" : followingEmailIDValue,
				"followfn" : followingFirstName,
				"followln" : followingLastName,
				"followth" : followingTwitterHandle
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.updateFollowingList == 200) {
				window.location.assign("/homepage"); 
			}
		}).error(function(error) {
		});
	};
})
