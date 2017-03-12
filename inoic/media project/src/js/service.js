angular.module("serviceModule", [])
		.config(["$httpProvider", function($httpProvider){
		    $httpProvider.defaults.headers.post = {
		      "content-type":"application/x-www-form-urlencoded"
		    }
		 }])
		.value("book",{
					 bookId: null,//查看详情的bookid
					 bookSearchId: null,//查询时的bookid
		})
		.factory("carList",[function () {
				return { bookCartList : {}}//购物车信息
		}])
		.factory("cookies",[function (argument) {
			return {cook : cookie.getCookie("userName")}//cookie信息
		}])
		 .service("localStorageService", ["$window", function($window){
	       		//把字符串存入 localStorage
	       		this.set = function(key, value) {
	       			$window.localStorage[key] =value
	       		}

	       		this.get = function(key) {
	       			return $window.localStorage[key];
	       		}

	       		//把对象存入localStorage
	       		this.setData = function(key, obj) {
	       			//console.log(obj);
	       			$window.localStorage[key] = angular.toJson(obj)
	       		}

	       		this.getData = function(key) {
	       			return angular.fromJson($window.localStorage[key]);
	       		}



	       }])