
twitterStart.controller('editController', function($scope, $http) {
	
	$scope.hide_form=true;
	$scope.hide_profile = false;
	
	$scope.editProfile = function() {
		
		$http({
			method : "GET",
			url : '/editProfile'
		}).success(function(data) {		
			if(data.statusFlag == 200)
				{
				$scope.hide_form=false;
				$scope.hide_profile = true;	
				}
		}).error(function(error) {

		});
	};
	
$scope.saveChange = function() {
		
		$http({
			method : "POST",
			url : '/updateTable',
			data : {
				"firstName" : $scope.editFname,
				"lastName" : $scope.editlname,
				"userName" : $scope.editUname,
				"contact" : $scope.editContact,
				"location" : $scope.editLoc,
				"birthdate" : $scope.editDob
			}
		}).success(function(data) {		
			if(data.statusUpdate == 200)
				{
				$scope.hide_form=true;
				$scope.hide_profile = false;
				window.location.assign('/homepage/userProfile');
				}
		}).error(function(error) {

		});
	};
	
$scope.cancelChange = function() {
		
		$http({
			method : "GET",
			url : '/homepage/userProfile',
		}).success(function(data) {	
			window.location.assign('/homepage/userProfile');
		}).error(function(error) {

		});
	};
})
