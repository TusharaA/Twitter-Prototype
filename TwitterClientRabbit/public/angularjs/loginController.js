//defining the login controller
twitterStart.controller('loginCtrl', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/checklogin',
			data : {
				"emailID" : $scope.enteredEmailID,
				"password" : $scope.enteredPassword
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
			}
			else
				window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
	};
})
