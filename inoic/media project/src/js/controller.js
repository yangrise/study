angular.module("mainApp", [])
		.config(["$httpProvider", function($httpProvider){
		    $httpProvider.defaults.headers.post = {
		      "content-type":"application/x-www-form-urlencoded"
		    }
		 }])
		.controller("mainController",function ($http,$scope,$httpParamSerializer,$ionicModal,$ionicPopup) {
			//创建登录模态框
			$ionicModal.fromTemplateUrl("./views/login.html",{
				scope:$scope,
				animation : 'slide-in-up'
			}).then(function (modal) {
				$scope.login_modal = modal;
			})
			//创建注册模态框
			$ionicModal.fromTemplateUrl("./views/signin.html",{
				scope:$scope,
				animation : 'slide-in-up'
			}).then(function (modal) {
				$scope.signin_modal = modal;
			})
			// 打开模态框的方法
			$scope.openModal = function (url) {
				if(url === 'login_modal') {
					$scope.login_modal.show();
				}else {
					$scope.signin_modal.show();
					// //确认密码与密码是否一致
				}
			}
			//关闭模态框
			$scope.closeModal = function(url) {
			   if(url === 'login_modal') {
					$scope.login_modal.hide();
				}else {
					$scope.signin_modal.hide();
				}
			};
			//确认密码
			$scope.checkPwd = function(){
       			return $scope.userSignin.password === $scope.userSignin.rePassword;
       		}
       		//注册用户
       		/*
       		当code为0时,表示注册成功,点击按钮前往登录页面
       		当code为1时,表示用户名已经存在,点击重新注册按钮则清除用户名信息,点击离开按钮则前往登录页面
       		dangcode为1和0之外的数字时,表示注册失败或者参数缺少,点击重新注册,清除所有的数据,点击离开,则前往登录页面
       		*/
			$scope.userSignin = {};
			$scope.signinSubmit = function () {
				console.log($scope.userSignin);
				var data = $httpParamSerializer($scope.userSignin);
				$http.post("../../shopApi/book/userRegist.php",data).then(function (res) {
					console.log(res);
					if(res.data.code === 0) {
					    var alertPopup = $ionicPopup.alert({
					      title: '提示',
					      template: '注册成功',
					      okText: '前往登录页面'
					    });
					    alertPopup.then(function(res) {
					      	$scope.closeModal('signin_modal');
					    });
					} else if(res.data.code === 1) {
						var confirmPopup = $ionicPopup.confirm({
					       title: '提示',
					       template: '用户名已经存在',
					       okText : '重新注册',
					       cancelText: '离开'
					     });
					     confirmPopup.then(function(res) {
					       if(res) {
					         $scope.userSignin.name = "";
					       } else {
					       	$scope.closeModal('signin_modal');
					       }
					    });
					} else {
						var confirmPopup = $ionicPopup.confirm({
					       title: '提示',
					       template: '注册失败',
					       okText : '重新注册',
					       cancelText: '离开'
					     });
					     confirmPopup.then(function(res) {
					       if(res) {
					         $scope.userSignin = {};
					       } else {
					       	$scope.closeModal('signin_modal');
					       }
					    });
					}
				})
			}
		})
		.controller("homeController", function($http,$scope,$httpParamSerializer,$ionicModal,$ionicPopup) {
	  //  		$scope.options = {
			//   loop: true,
			//   effect: 'fade',
			//   speed: 500,
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
	   		var path = null;
	   		var cate = null;
			$scope.loadMore = function(cateid) {
				//当没有cateid传入,并且cate为null的时候,获取全部的数据
				//当有cateid传入,并且cate为null时候,获取到对应的cateid所对应的值,并且将cateid的值赋给cateid
				//当没有cateid传入,并且cate不等于null,将cata作为分类的值传入
				//当有cate传入,并且cate不等于null时候,将cataid作为分类的值传入
				if(cateid === undefined && cate === null) {
					path = '../../shopApi/book/book.php?start='+10*count;
				} else if(cateid !== undefined && cate === null) {
					path = '../../shopApi/book/book.php?start='+10*count+"&cateid="+cateid;
					cate = cateid;
				}else if (cateid === undefined && cate !== null) {
					path = '../../shopApi/book/book.php?start='+10*count+"&cateid="+cate;
				}else {
					path = '../../shopApi/book/book.php?start='+10*count+"&cateid="+cateid;
				}
			   	$http.get(path)
			   		.then(function(items) {
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
					    		$scope.moreData = true;
			   					console.log("请求成功");
								count++;
			   				} else {
			   					console.log("没有对应的数据");
					    		$scope.moreData = false;
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
			//使页面默认显示的书籍位全部书籍
			$scope.classify();
			$scope.$on('stateChangeSuccess', function() {
			    $scope.loadMore($scope.clas);
			});
			//创建注册模态框
			$ionicModal.fromTemplateUrl("./views/particulars.html",{
				scope:$scope,
				animation : 'slide-in-up'
			}).then(function (modal) {
				$scope.particulars_modal = modal;
			})
			// 打开模态框的方法
			$scope.bookParticulars = {};
			$scope.openModal = function (id) {
				$scope.particulars_modal.show();
				$http.get("../../shopApi/book/bookId.php?id="+id)
					.then(function (res) {
						// console.log(res);
						$scope.bookParticulars = res.data.data;
						console.log($scope.bookParticulars);
					})
			}
			//关闭模态框
			$scope.closeModal = function() {
				$scope.particulars_modal.hide();
			};

	   })