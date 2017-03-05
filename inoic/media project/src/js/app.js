angular.module("myApp", ["ionic","ui.router","mainApp"])
		.config(function($stateProvider, $urlRouterProvider, $locationProvider){
			$locationProvider.hashPrefix("");
	   		$urlRouterProvider.otherwise("/home");
	   		$stateProvider
	   		.state("home", {
	   			url:"/home",
	   			templateUrl:"views/home.html",
	   			controller:"homeController"
	   		})
		})