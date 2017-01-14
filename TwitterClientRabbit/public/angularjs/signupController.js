//defining the login controller
twitterStart.controller('signupCtrl', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.empty_userName = true;
	$scope.existing_userName = true;

	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/checkUserName',
			data : {
				"username" : $scope.username
			}
		}).success(function(data) {
			//checking the response data for statusCode
			
			if (data.status == 401) {
				$scope.empty_userName = false;
				$scope.existing_userName = true;
			}
			else if (data.status == 403) {
				$scope.existing_userName = false;
				$scope.empty_userName = true;				
			}
			else
				window.location.assign("/homepage"); 
		}).error(function(error) {

		});
	};
})
