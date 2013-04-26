(function(){
    "use strict";
    /* global myApp */
    myApp.controller("ListCtrl", [ "$scope", "$routeParams", "AppsService", function ($scope, $routeParams, AppsService) {

        $scope.appsList = [];

        function initialise() {
            if($routeParams.lastLaunched)
            {
                AppsService.launchLastRunApp()
                .then(null, function(e){
                    e = e || {};
                    console.error("Error launching last run app: " + e.message);
                    alert("Error launching last run app. Please try again.");
                });
            }
            else
            {
                $scope.loadAppsList(true);
            }
        }

        $scope.loadAppsList = function(callApply) {
            AppsService.getAppsList()
            .then(function(newAppsList){
                newAppsList.sort();
                //clear the old apps list
                $scope.appsList.splice(0, $scope.appsList.length);
                angular.extend($scope.appsList, newAppsList);
                if(callApply) {
                    $scope.$apply();
                }
            }, function(error){
                var str = "There was an error retrieving the apps list";
                console.error(str + JSON.stringify(error));
                alert(str);
            });
        };

        $scope.launchApp = function(app){
            AppsService.launchApp(app)
            .then(null, function(error){
                console.error("Error during loading of app " + app + ": " + error);
                alert("Something went wrong during the loading of the app. Please try again.");
            });
        };

        $scope.refreshApp = function(app) {
            alert("refreshApp called: " + app);
        };

        $scope.removeApp = function(app) {
            var shouldUninstall = confirm("Are you sure you want to uninstall " + app + "?");
            if(shouldUninstall) {
                AppsService.uninstallApp(app)
                .then(function() { $scope.loadAppsList(true); }, function(error){
                    console.error("Error during uninstall of app " + app + ": " + error);
                    alert("Something went wrong during the uninstall of the app. Please try again.");
                });
            }
        };

        document.addEventListener("deviceready", initialise, false);
    }]);
})();