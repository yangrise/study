angular.module("myApp", ["ionic"])
.config(["$httpProvider", function($httpProvider){
    $httpProvider.defaults.headers.post = {
      "content-type":"application/x-www-form-urlencoded"
    }
 }])

		.controller("mainCtrl", function($http,$scope,$httpParamSerializer,$ionicModal) {
	   		// $scope.options = {
	   		// 	loop:true,
					// speed: 500
	   		// }
	   		// $http.get("http://localhost/inoic/shopApi/book/book.php")
	   		// 	.then(function (res) {
	   		// 		console.log(res);
	   		// 		if(res.data.code === 0) {
	   		// 			$scope.bookList = res.data.data;
	   		// 			console.log("请求成功");
	   		// 		} else {
	   		// 			console.log("没有对应的数据");
	   		// 		}
	   		// 	},function (message) {
	   		// 		console.log("没有对应的数据");
	   		// 	})
	   		/*
	   		每当页面加载,进行get请求,并把start传入,值为count*10,当items.data.code=0时,进行判断,如果count=0时,将获取到的值赋予给bookList,当count不等于0时,将获取到的数据添加到bookList中,并将count加一
	   		*/
	   		var count = 0;
			$scope.loadMore = function(cateid) {
			   	$http.get('http://localhost/inoic/shopApi/book/book.php?start='+10*count+"&cateid="+cateid)
			   		.then(function(items) {
			   			if(cateid == 1 || cateid == 2) {
			   				items.data.code = 0;
			   			}
					    if(items.data.code === 0) {
					    		if(count === 0) {
			   						$scope.bookList = items.data.data;
					    		} else {
					    			angular.forEach(items.data.data, function(value, key) {
									  this.push(value);
									}, $scope.bookList);
									console.log($scope.bookList);
					    		}
					    		$scope.$broadcast('scroll.infiniteScrollComplete');
			   					console.log("请求成功");
								count++;
			   				} else {
			   					console.log("没有对应的数据");
			   				}
			   			},function (message) {
			   				console.log("没有对应的数据");
			   			})
			 };
			 //清除掉bookList中的数据,并且将count清零(防止进行数据添加),点击切换分类的时候对应的分类id传入
			$scope.classify = function (cateid) {
			    $scope.bookList = null;
			    count = 0;
			    $scope.loadMore(cateid);
			}
			//使页面默认显示的书籍技术分类
			$scope.classify(1);
			$scope.$on('stateChangeSuccess', function() {
			    $scope.loadMore();
			});
			//创建模态框
			$ionicModal.fromTemplateUrl("./views/login.html",{
				scope:$scope,
				animation : 'slide-in-up'
			}).then(function (modal) {
				console.log(modal);
				$scope.modal = modal;
			})
			// 打开模态框的方法
			$scope.openModal = function () {
				$scope.modal.show();
			}
			$scope.closeModal = function() {
			    $scope.modal.hide();
			};
	   })