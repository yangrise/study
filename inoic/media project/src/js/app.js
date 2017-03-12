angular.module("myApp", ["ionic","ui.router","mainApp","serviceModule"])
		.config(function($stateProvider, $urlRouterProvider, $locationProvider,$ionicConfigProvider){
			$locationProvider.hashPrefix("");
	   		$urlRouterProvider.otherwise("/boot");
	   		$stateProvider
	   		// .state("home", {
	   		// 	url:"/home",
	   		// 	templateUrl:"views/home.html",
	   		// 	controller:"homeController"
	   		// })
		   		.state("boot", {
		   			url:"/boot",
		   			views:{
		   				"":{
		   					templateUrl:"./views/bootPage.html",
		   					controller:"mainController"
		   				},
		   			}
		   		})
		   		.state("home", {
		   			url:"/",
		   			views:{
		   				"":{
		   					templateUrl:"./views/home.html",
		   					controller:"mainController"
		   				},
		   				"list@home": {
		   					templateUrl:"./views/list.html",
		   					controller:"homeController"
		   				},
		   			}
		   		})
		   		.state("home.particulars", {
		   			url:"/particulars",
		   			// templateUrl:"./views/bookParticulars.html",
	   				// controller:"bookParticularsController"
	   				views:{
		   				"list@home":{
		   					templateUrl:"./views/bookParticulars.html",
	   						controller:"bookParticularsController"
		   				}
		   			}
	   			})
		   		.state("home.shoppingCart", {
		   			url:"/shoppingCart",
		   			views:{
		   				"list@home":{
		   					templateUrl:"views/shoppingCart.html",
		   					controller:"shoppingCartController"
		   				}
		   			}
		   		})
		   		.state("home.my", {
		   			url:"/my",
		   			views:{
		   				"list@home":{
		   					templateUrl:"views/my.html",
		   					controller:"myController"
		   				}
		   			}
		   		})
		   		.state("home.orderList", {
		   			url:"/orderList",
		   			views:{
		   				"list@home":{
		   					templateUrl:"views/orderList.html",
		   					controller:"orderListController"
		   				}
		   			}
		   		})
	   			.state("search", {
		   			url:"/search",
		   			views:{
		   				"":{
		   					templateUrl:"views/search.html",
		   					controller:"searchController"
		   				},
		   				"Search@search": {
		   					templateUrl:"./views/hotSearch.html",
		   				},
		   			}
		   		})
		   		.state("search.searchResult", {
		   			url:"/searchResult",
		   			views:{
		   				"Search@search":{
		   					templateUrl:"views/searchResult.html",
		   					controller:"searchController"
		   				}
		   			}
		   		})
		   	$ionicConfigProvider.platform.ios.tabs.style('standard');  
		    $ionicConfigProvider.platform.ios.tabs.position('bottom');  
		    $ionicConfigProvider.platform.android.tabs.style('standard');  
		    $ionicConfigProvider.platform.android.tabs.position('standard');
		    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');  
		    $ionicConfigProvider.platform.android.navBar.alignTitle('center');  
		      
		    // $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');  
		    // $ionicConfigProvider.platform.android.backButton.previousTitleText('Back').icon('ion-android-arrow-back');  
		    // $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');  
		      
		    // $ionicConfigProvider.platform.ios.views.transition('ios');  
		    // $ionicConfigProvider.platform.android.views.transition('android');
		})