
twitterStart.controller('searchController', function($scope, $http) {

	$scope.hide_search = true;
	$scope.hide_tweet = false;

	$scope.searchString = function() {
		$http({
			method : "POST",
			url : '/getSearch',
			data : {
				"searchKey" : $scope.searchKey
			}
		}).success(function(data) {
			if (data.statusGetSearch == 200) {
				$scope.searchResults = data.searchResults;
				$scope.hide_search = false;
				$scope.hide_tweet = true;				
			}
		}).error(function(error) {

		});
	};
})
