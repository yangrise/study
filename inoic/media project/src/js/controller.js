angular.module("mainApp", [])
		//主控制器
		.controller("mainController",function (carList,cookies,$http,$scope,$httpParamSerializer,$ionicModal,$ionicPopup,localStorageService,$location) {
			var vm = this;
			//当点击启动页的进入按钮的时候,进入首页,并存储localStorageService
			$scope.firstOpen = function () {
				localStorageService.setData("open",true);
			};
			//当localStorageService中有存储数据的时候,每当进入到boot页,自动切换回首页
			if(localStorageService.getData("open") === true) {
				if($location.path() == "/boot") {
					$location.path("/");
				}
			}
			//设置遍历输出轮播图的数组
			$scope.lunbo = [0,1,2,3,4,5];
			//创建登录模态框
			$scope.shopping = false;
			$ionicModal.fromTemplateUrl("./views/login.html",{
				scope:$scope,
				animation : 'slide-in-up'
			}).then(function (modal) {
				$scope.login_modal = modal;
			});
			//创建注册模态框
			$ionicModal.fromTemplateUrl("./views/signin.html",{
				scope:$scope,
				animation : 'slide-in-up'
			}).then(function (modal) {
				$scope.signin_modal = modal;
			});
			// 打开模态框的方法
			$scope.openModal = function (url) {
				if(url === 'login_modal') {
					$scope.login_modal.show();
				}else {
					$scope.signin_modal.show();
				}
			};
			//关闭模态框
			$scope.closeModal = function(url) {
			   if(url === 'login_modal') {
					$scope.login_modal.hide();
				}else {
					$scope.signin_modal.hide();
				}
				$scope.userSignin = {};
				$scope.userLogin = {};
			};
			//确认密码
			$scope.checkPwd = function(){
       			return $scope.userSignin.password === $scope.userSignin.rePassword;
       		};
       		//注册用户
       		/*
       		当code为0时,表示注册成功,点击按钮前往登录页面
       		当code为1时,表示用户名已经存在,点击重新注册按钮则清除用户名信息,点击离开按钮则前往登录页面
       		dangcode为1和0之外的数字时,表示注册失败或者参数缺少,点击重新注册,清除所有的数据,点击离开,则前往登录页面
       		*/
			$scope.userSignin = {};
			$scope.signinSubmit = function (Formname) {
				console.log($scope.userSignin);
				$scope.userSignin.password = hex_md5($scope.userSignin.password);
				$scope.userSignin.rePassword = hex_md5($scope.userSignin.rePassword);
				var data = $httpParamSerializer($scope.userSignin);
				//创建所有的input的表单的选项
				$scope.signin = [Formname.signinUsername,Formname.signinPassword,Formname.signinRePassword,Formname.signinPhoneNumber,Formname.signinPhoneNumber];
				//将所有的input的表单的$touched的状态设为false
				for(var x in $scope.signin) {
					$scope.signin[x].$touched = false;
				}
				$http.post("../../shopApi/book/userRegist.php",data).then(function (res) {
					console.log(res);
					if(res.data.code === 0) {
						console.log($scope.afterMd5);
					    var alertPopup = $ionicPopup.alert({
					      title: '提示',
					      template: '注册成功',
					      okText: '前往登录页面'
					    });
					    alertPopup.then(function(res) {
					         $scope.userSignin = {};
					      	$scope.closeModal('signin_modal');
					    });
					} else if(res.data.code === 1) {
						var confirmPopup = $ionicPopup.confirm({
					       title: '提示',
					       template: '用户名已经存在',
					       okText : '重新注册',
					       cancelText: '前往登录'
					     });
					     confirmPopup.then(function(res) {
					       if(res) {
					         $scope.userSignin.name = "";
					       } else {
					       	$scope.closeModal('signin_modal');
					         $scope.userSignin.name = "";
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
			};
			//登录
			$scope.userLogin = {};
			$scope.loginSubmit = function () {
				console.log($scope.userSignin);
				$scope.userLogin.password = hex_md5($scope.userLogin.password);//加密密码
				var data = $httpParamSerializer($scope.userLogin);
				$http.post("../../shopApi/book/userInfoLogin.php",data).then(function (res) {
					console.log(res);
					// 当code为0时,将userName和userId存入cookie中,并提示登录成功,按钮前往购购物
					if(res.data.code === 0) {
						var d = new Date();
						d.setTime(d.getTime()+3600*1000*24*365);//设置时间为一年后
						cookie.setCookie("userName",res.data.data.user_name,d);
						cookie.setCookie("userId",res.data.data.user_id,d);
						cookies.cook = cookie.getCookie("userName");
					    var alertPopup = $ionicPopup.alert({
					      title: '提示',
					      template: '登录成功',
					      okText: '前往购物'
					    });
					    alertPopup.then(function(res) {
					        $scope.userLogin = {};//清空登录界面输入内容
					      	$scope.closeModal('login_modal');//关闭登录模态框
					    });
					    //当code为1时,提示用户不存在,可选择前往注册或者是离开
					} else if(res.data.code === 1) {
						var confirmPopup = $ionicPopup.confirm({
					       title: '提示',
					       template: '用户不存在',
					       okText : '前往注册',
					       cancelText: '离开'
					     });
					     confirmPopup.then(function(res) {
					       if(res) {
					      	$scope.openModal('signin_modal');//打开注册模态框
					        $scope.userLogin = {};//清空登录的输入框
					       } else {
					       	$scope.closeModal('login_modal');//关闭登录模态框
					        $scope.userLogin = {};//清空登录的输入框
					       }
					    });
					} else if(res.data.code === 2) {
						//提示登录失败,选择重新登录或者离开
						var confirmPopup = $ionicPopup.confirm({
					       title: '提示',
					       template: '用户名或者密码错误',
					       okText : '重新输入',
					       cancelText: '离开'
					     });
					     confirmPopup.then(function(res) {
					       if(res) {
					       	 $scope.userLogin = {};//清空输入框
					       } else {
					       	$scope.closeModal('login_modal');//关闭登录的模态框
					       }
					    });
					}else {
						//提示登录失败,选择重新登录或者离开
						var confirmPopup = $ionicPopup.confirm({
					       title: '提示',
					       template: '登录失败',
					       okText : '重新登录',
					       cancelText: '离开'
					     });
					     confirmPopup.then(function(res) {
					       if(res) {
					       	$scope.loginSubmit();//进行重新提交
					       } else {
					       	$scope.closeModal('login_modal');//关闭登录的模态框
					       }
					    });
					}
				})
			};
			//获取到登录的用户名
			$scope.name = cookies;
			//点击注销的时候,提示是否退出,选择是清除储存的cookie,选择否则关闭弹出框
			$scope.logout = function () {
				var confirmPopup = $ionicPopup.confirm({
				       title: '提示',
				       template: '确定退出吗?',
				       okText : '是',
				       cancelText: '否'
				     });
				     confirmPopup.then(function(res) {
				       if(res) {
						cookie.deleteCookie("userName");//清除cookie中的userName
						cookie.deleteCookie("userId");//清除cookie中的userId
						cookies.cook= null;
						carList.bookCartList = {};//清除服务中存储的购物车信息
				       } else {
				       }
				    });
			};
			//判断cookie是否存在,来决定显示的按钮
			$scope.cookieshow = function () {
				if(cookies.cook !== null && cookies.cook !== undefined){
					return true;
				}else {
					return false;
				}
			};
			// 购物车
			// 购物车数量首先从localStorage获取,然后进行脏检查判断服务中的值是否发生变化并随之改变
			if(cookie.getCookie("userName") != undefined || carList.bookCartList != undefined) {
				$scope.jso = localStorage.cart;//如果cookie存在,则获取localStorage中的数据
				if($scope.jso != "" && $scope.jso != undefined) {
					$scope.cartList = JSON.parse($scope.jso)
				} else {
					$scope.cartList = [];
				}
				carList.bookCartList = $scope.cartList;
				$scope.$watch(function () {
					return carList.bookCartList;
				},function () {
					console.log(carList.bookCartList);
					$scope.cartList = carList.bookCartList;
				console.log($scope.cartList);
				})
			}
		})
		//首页控制器
		.controller("homeController", function(carList,book,$http,$scope,$httpParamSerializer,$ionicModal,$ionicPopup,$location) {
			$scope.detailid = function (id) {
				book.bookId = id;
				// location.href = 'http://localhost/inoic/media%20project/src/#/particulars';
				$location.path("/particulars");
			};
			//随机出输出,以此来随机产生畅销排行版
			var num = Math.floor(Math.random()*100000%18);
			$http.get('../../shopApi/book/book.php?length=5&start='+num)
			   		.then(function(items) {
					    if(items.data.code === 0) {
		   						$scope.hotList = items.data.data;
			   					console.log("请求成功");
			   				} else {
			   					console.log("没有对应的数据");
			   				}
			   			},function (message) {
			   				console.log("没有对应的数据");
			   			});
	   		/*
	   		每当页面加载,进行get请求,并把start传入,值为count*10,当items.data.code=0时,进行判断,如果count=0时,将获取到的值赋予给bookList,当count不等于0时,将获取到的数据添加到bookList中,并将count加一
	   		*/
	   		var count = 0;
	   		var path = null;
	   		var cate = null;
			$scope.loadMore = function(cateid) {
				console.log($scope.caId);
				//alert("ok");
				//当cateid=0时,并且cate为null的时候,获取全部的数据,并且cate等于cateid
				//当有cateid不等于0且不等于undefined的时候,获取对应cateid的信息
				//当cateid为undefined,且cate不等于空且不等于0时,将cate作为数据分类传入
				//当cateid === undefined并且cate等于0时,获取所有的数据
				//当cateid等于0,并且cate不等于空的时候,获取所有的数据
				if(cateid === 0 && cate === null) {
					path = '../../shopApi/book/book.php?start='+10*count;
					cate = 0;
				} else if(cateid !== 0 && cateid !== undefined) {
					path = '../../shopApi/book/book.php?start='+10*count+"&cateid="+cateid;
					cate = cateid;
				}else if (cateid === undefined && cate !== null &&cate !== 0) {
					path = '../../shopApi/book/book.php?start='+10*count+"&cateid="+cate;
				}else if(cateid === undefined && cate === 0 ){
					path = '../../shopApi/book/book.php?start='+10*count;
				}else if(cateid === 0 && cate !== null) {
					path = '../../shopApi/book/book.php?start='+10*count;
					cate = 0;
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
			    count = 0;
			    $scope.bookList = null;
			    $scope.loadMore(cateid);
				$scope.caId = cateid;
			};
			//使页面默认显示的书籍位全部书籍
			$scope.classify(1);
			$scope.$on('stateChangeSuccess', function() {
			    $scope.loadMore();
			});
			// 将选中的产品加入到购物车当中,并存储到服务中
			$scope.cartList = {};
			$scope.cartList.books = [];
			$scope.cartList.num = 0;
			$scope.addCart = function (books) {
				if(cookie.getCookie("userName") == null) {//如果cookie中的userName为空,提示先登录
					var confirmPopup = $ionicPopup.confirm({
				       title: '提示',
				       template: '请先登录!!!',
				       okText : '前往登录',
				       cancelText: '前往注册'
				     });
				     confirmPopup.then(function(res) {
				       if(res) {
				       	$scope.openModal('login_modal');
				       } else {
				       	$scope.openModal('signin_modal');
				       }
				    });
				}else {
					$scope.jso = localStorage.cart;//判断localStorage中是否有数据,有的话获取
					if($scope.jso != "" && $scope.jso != undefined && $scope.jso.length !== 2) {
						$scope.cartList = JSON.parse($scope.jso)
                    }
                    // console.log($scope.jso.length != []);
                    // console.log($scope.cartList.num);
                    var boo = {"book":books,"num":1,checked:true};//创建一个变量,存入书的信息和属性
					var li = $scope.cartList.books;//将从localStorage中获取到的数据给li
					var same = null;
					if( li == undefined||li.length==0 ){
						li.push(boo);//如果li为空或未定义的话,直接将boo加入li中
					} else {
						for(var i=0;i<li.length;i++) {//遍历li
							if(li[i].book.id === boo.book.id) {//如果li中有id与当前的boo的id相等
								li[i].num += 1;//当前这本书的num加1
								same = null;//设置为null表示相同
								break;//退出当前循环
							} else {
								same = "yes";//设置same为yes表示不同
							}
						}
						console.log(same);
						if(same==="yes") {//如果same=yes,将boo加入li中
							li.push(boo);
						}
					}
					$scope.cartList.books = li;//将最后获取到的值给$scope.cartList.books
					carList.bookCartList = $scope.cartList;//存储到服务中心
					$scope.cartList.num += 1;//每到点击一次加入购物车的时候,总的书本数量加一
					$scope.cartList.userId = cookie.getCookie("userId");//从cookie中获取到用户id
					var bookList = JSON.stringify($scope.cartList);
					//存入localStorage
					localStorage.cart = bookList;
				}
			}
	   })
		//详情页控制器
		.controller("bookParticularsController",function ($ionicPopup,carList,$http,$scope,book, $ionicSlideBoxDelegate,$location) {
			// $scope.bookCart = {};
			// $scope.bookCart.num = 0;
			// $scope.extendedPrices = 0;
			// $scope.bookCart.books = {};
			console.log(book.bookId);
			$scope.id = 0;
			// 判断id是从首页传过来还是从搜索页传过来
			if(book.bookId != null) {//如果从首页传过来的id不为空
				$scope.id = book.bookId;//将其赋给一个变量
				book.bookId = null;
				$scope.bookId = true;//为true说明是从首页过来
			} else {
				$scope.id = book.bookSearchId;//将搜索页传过来的id给赋予id变量
				book.bookId = null;
				$scope.bookId = false;//为false表明是从搜索页面跳转来的
			}
			//根据id进行判断返回的页面
			$scope.retreat = function () {//根据之前给bookId的值,设定返回的位置
				if($scope.bookId == true) {
					$location.path("");//返回首页
				} else {
					$location.path("/search");//返回搜索页面
				}
			};
			// 根据传递过来的数据获取到详细的书本信息
			$http.get("../../shopApi/book/bookId.php?id="+$scope.id)
				.then(function (res) {
					$scope.bookParticulars = res.data.data;
				});
			$scope.bookSale = $scope.id*10;//产生销量
			//点击按钮的时候滚动到对应的页面中
			$scope.nextSlide = function(id) {
			    $ionicSlideBoxDelegate.slide(id);
			  };
			// 使在刚进入详情页的时候,购物车商品数量会显示
			$scope.jso = localStorage.cart;
			console.log($scope.jso);
			if($scope.jso != "" && $scope.jso != undefined) {
				$scope.cartList = JSON.parse($scope.jso)
			}
			console.log($scope.cartList.length);
			$scope.redShow = function () {
				if($scope.cartList.length == 0) {
					return false;
				} else {
					return true;
				}
			}
			// $scope.cartList = carList ;
			//添加到购物车
			console.log($scope.cartList);
			if($scope.cartList.length == 0) {
				$scope.cartList = {};
				$scope.cartList.books = [];
				$scope.cartList.num = 0;
			}
			console.log($scope.carList === []);
			$scope.addCart = function () {
				if(cookie.getCookie("userName") == null) {//如果cookie中的userName为空的话提示先登录或者注册
					var confirmPopup = $ionicPopup.confirm({
				       title: '提示',
				       template: '请先登录!!!',
				       okText : '前往登录',
				       cancelText: '前往注册'
				     });
				     confirmPopup.then(function(res) {
				       if(res) {
				       	$scope.openModal('login_modal');
				       } else {
				       	$scope.openModal('signin_modal');
				       }
				    });
				}else {
					//从localStorage中获取数据,当localStorage有数据的时候将其转换为对象,
					// $scope.jso = localStorage.cart;
					// if($scope.jso != "" && $scope.jso != undefined && $scope.jso.length !== 2) {
					// 	$scope.cartList = JSON.parse($scope.jso)
					// }
					// var boo = {"book":$scope.bookParticulars,"num":1,checked:true};
					// var li = $scope.cartList.books;
					// var same = null;
					// if( li == undefined||li.length==0 ){
					// 	li = [];
					// 	li.push(boo);
					// } else {
					// 	for(var i=0;i<li.length;i++) {
					// 		if(li[i].book.id === boo.book.id) {
					// 			li[i].num += 1;
					// 			same = null;
					// 			break;
					// 		} else {
					// 			same = "yes";
					// 		}
					// 	}
					// 	console.log(same);
					// 	if(same==="yes") {
					// 		li.push(boo);
					// 	}
					// }
					// carList.bookCartList = $scope.cartList;
					// $scope.cartList.books = li;
					// $scope.cartList.num += 1;
					// $scope.cartList.userId = cookie.getCookie("userId");
					// var bookList = JSON.stringify($scope.cartList);
					// //存入
					// localStorage.cart = bookList;
					$scope.jso = localStorage.cart;//判断localStorage中是否有数据,有的话获取
					if($scope.jso != "" && $scope.jso != undefined && $scope.jso.length !== 2) {
						$scope.cartList = JSON.parse($scope.jso)
                    }
                    // console.log($scope.jso.length != []);
                    // console.log($scope.cartList.num);
                    var boo = {"book":$scope.bookParticulars,"num":1,checked:true};//创建一个变量,存入书的信息和属性
					var li = $scope.cartList.books;//将从localStorage中获取到的数据给li
					var same = null;
					if( li == undefined||li.length==0 ){
						li.push(boo);//如果li为空或未定义的话,直接将boo加入li中
					} else {
						for(var i=0;i<li.length;i++) {//遍历li
							if(li[i].book.id === boo.book.id) {//如果li中有id与当前的boo的id相等
								li[i].num += 1;//当前这本书的num加1
								same = null;//设置为null表示相同
								break;//退出当前循环
							} else {
								same = "yes";//设置same为yes表示不同
							}
						}
						console.log(same);
						if(same==="yes") {//如果same=yes,将boo加入li中
							li.push(boo);
						}
					}
					$scope.cartList.books = li;//将最后获取到的值给$scope.cartList.books
					carList.bookCartList = $scope.cartList;//存储到服务中心
					$scope.cartList.num += 1;//每到点击一次加入购物车的时候,总的书本数量加一
					$scope.cartList.userId = cookie.getCookie("userId");//从cookie中获取到用户id
					var bookList = JSON.stringify($scope.cartList);
					//存入localStorage
					localStorage.cart = bookList;
				}
			}
		})
		//查询控制器
		.controller("searchController",function ($http,$scope,$ionicPopup,book) {
			$scope.searchTitle = "";
			//获取随机数,以此来随机推荐热门搜索
			var start = Math.floor(Math.random()*10000%23);
			$http.get("../../shopApi/book/book.php?start="+start)
				.then(function (res) {
					$scope.hotSearch = res.data.data;
				});
			// 将搜索框中的内容座位限制条件来获取数据,从而实现搜索
			$scope.bookTitle = function (title) {
				$http.get("../../shopApi/book/bookSearch.php?search="+title)
					.then(function (res) {
						if(res.data.code === 0) {
							$scope.searchResult = res.data.data;
						} else {
							var confirmPopup = $ionicPopup.confirm({
						       title: '提示',
						       template: '没有搜索结果',
						       okText : '重新搜索',
						       cancelText: '回到主页'
						     });
						     confirmPopup.then(function(res) {
						       if(res) {
						         $scope.userSignin.name = "";
						       } else {
						       	// $scope.closeModal('signin_modal');
                                   $location.path("/");
						       	// location.href = 'http://localhost/inoic/media%20project/src/#/';
						       }
						    });
						}
					})
			};
			// 点击搜索到的图书的时候将获取到的id给予自定义变量的bookSearchId
			$scope.detailid = function (id) {
				book.bookSearchId = id;
				console.log(book.bookSearchId);
			};
			// $http.get("../../shopApi/book/bookId.php?id="+book.bookId)
			// 	.then(function (res) {
			// 		$scope.bookParticulars = res.data.data;
			// 	})
		})
		//购物车控制器
		.controller("shoppingCartController",function ($httpParamSerializer,carList,$http,$scope,carList,$ionicPopup,$location) {
			$scope.bookCart = {};
			$scope.bookCart.num = 0;
			$scope.extendedPrices = 0;
			$scope.bookCart.books = {};
			$scope.checkedAll = null;//默认全选
			$scope.$watch("cookie.getCookie('userName')",function () {
				if(cookie.getCookie('userName') === undefined) {
					$scope.bookCart = {};
				}
			});
			//判断有无用户名存在
			if(cookie.getCookie("userName") == undefined || cookie.getCookie("userName" == "")){
				//没有存在提示未登录
				var confirmPopup = $ionicPopup.confirm({
				       title: '提示',
				       template: '你还没有登录',
				       okText : '前往登录',
				       cancelText: '取消'
				     });
				     confirmPopup.then(function(res) {
				       if(res) {
				       	$scope.openModal('login_modal');
				       	$location.path("/")
				       } else {
				       	$location.path("/")
				       }
				    });
			}
			//计算总价
			$scope.extendedPrice = function() {
				var total = 0;
				for(var i in $scope.bookCart.books) {
					// console.log(i);
					if($scope.bookCart.books[i].checked == true ) {
						total += $scope.bookCart.books[i].book.price*$scope.bookCart.books[i].num;
					}
				}
				$scope.extendedPrices = total;
			};

			//从localStorage中获取购物车数据
			if(cookie.getCookie("userName") != undefined) {
				$scope.jso = localStorage.cart;
				if($scope.jso != undefined) {
					$scope.cartList = JSON.parse($scope.jso);
				}
				$scope.bookCart = $scope.cartList;
			}
			// console.log($scope.bookCart);
			$scope.isCheckAll = function () {
				if($scope.bookCart.books !== undefined){
					for(var i in $scope.bookCart.books) {
						if($scope.bookCart.books[i].checked == false) {
							$scope.checkedAll = false;
							return;
						} else {
							$scope.checkedAll = true;
						}
					}
				}
			}
			$scope.deleteShow = false;
			$scope.showDele = function () {
				if ($scope.deleteShow) {
					$scope.deleteShow = false;
				} else {
					$scope.deleteShow = true;
				}
			}
			$scope.isCheckAll();
			//在刚进入购物车页面的时候计算总价
			$scope.extendedPrice();
			// 将购物车的内容给予服务中的变量
			carList.bookCartList = $scope.bookCart;
			console.log(carList.bookCartList);
			console.log($scope.bookCart);
			//购物车商品数量的加减,每次加减的时候将对象存到localStorage中,当数量小于一时,从数组中将其删除
			$scope.deleteCart = function (num) {
				$scope.bookCart.num -= $scope.bookCart.books[num].num;
				$scope.bookCart.books.splice(num,1);
				$scope.isCheckAll();
				console.log($scope.bookCart.books);
				$scope.extendedPrice();
				carList.bookCartList = $scope.bookCart;
				localStorage.cart = JSON.stringify($scope.bookCart);
			};
			$scope.numMinus = function (num) {
				$scope.bookCart.books[num].num -= 1;
				$scope.bookCart.num -= 1;
				$scope.extendedPrice();
				carList.bookCartList = $scope.bookCart;
				localStorage.cart = JSON.stringify($scope.bookCart);
				if($scope.bookCart.books[num].num < 1) {
					$scope.bookCart.books.splice(num,1);
					$scope.isCheckAll();
					console.log($scope.bookCart);
					localStorage.cart = JSON.stringify($scope.bookCart);
				}
			};
			$scope.numPlus = function (num) {
				$scope.bookCart.books[num].num += 1;
				$scope.bookCart.num += 1;
				$scope.extendedPrice();
				carList.bookCartList = $scope.bookCart;
				console.log($scope.bookCart);
				localStorage.cart = JSON.stringify($scope.bookCart);
				// return false;
			};
			$scope.seleAll = function () {
				if($scope.checkedAll === true) {
					$scope.checkedAll =true;
					console.log(111);
					for(var i in $scope.bookCart.books) {
						$scope.bookCart.books[i].checked=true;
					}
				}else {
					$scope.checkedAll = false;
					console.log(222);
					for(var i in $scope.bookCart.books) {
						$scope.bookCart.books[i].checked=false;
					}
				}
				$scope.extendedPrice();
				carList.bookCartList = $scope.bookCart;
				localStorage.cart = JSON.stringify($scope.bookCart);
			}
			$scope.selected = function (num) {
				$scope.isCheckAll();
				$scope.extendedPrice();
				carList.bookCartList = $scope.bookCart;
				localStorage.cart = JSON.stringify($scope.bookCart);
				// if($scope.bookCart.books[num].checked === true) {
				// 	$scope.bookCart.books[num].checked === false;
				// 	console.log($scope.bookCart.books[num].checked);
				// 	console.log(111);
				// } else {
				// 	$scope.bookCart.books[num].checked === true;
				// }
			}
			console.log($scope.bookCart);
			//判断购物车是否为空,显示对应的内容
			$scope.showCar = function () {
				if($scope.bookCart.num  === 0 || $scope.bookCart.num === undefined) {
					return true;
				} else {
					return false;
				}
			};
			//提交订单
			$scope.submitOrder = function () {
				// 当购物车为空的时候,提示先购物
				if ($scope.bookCart.num ===0) {
					var confirmPopup = $ionicPopup.confirm({
				       title: '提示',
				       template: '请先购物!!!',
				       okText : '前往购物',
				       cancelText: '取消'
				     });
				     confirmPopup.then(function(res) {
				       if(res) {
				       	location.href = 'http://localhost/inoic/media%20project/src/#/';
				       } else {
				       	// $scope.openModal('signin_modal');
				       }
				    });
				}else {
					//如果不为空,则提交数据
 					$scope.order = {
						"user_id":"",
						"cart" : []
					};
					$scope.order.user_id = $scope.bookCart.userId;
					var list = $scope.bookCart.books;
					console.log(list);
					for(var i =0;i<list.length;i++) {
						console.log(list[i]);
						$scope.order.cart.push({"id":list[i].book.id,"num":list[i].num})
					}
				$http({
				  method: 'post',
				  url: '../../shopApi/book/order.php',
				  data: $scope.order,
				  headers: {
					   	'Content-Type': "application/json"
					 },
				}).then(function successCallback(res) {
					//当code为0的时候,选择是继续购物还是取消
				    if(res.data.code === 0) {
					   var confirmPopup = $ionicPopup.confirm({
					       title: '提示',
					       template: '提交成功',
					       okText : '继续购物',
					       cancelText: '买不起了'
					     });
					     confirmPopup.then(function(res) {
					       if(res) {
					       	 $scope.bookCart = {};
					       	 carList.bookCartList = {};
					       	 $scope.extendedPrices = 0;
					         $location.path("");
					         localStorage.removeItem("cart");
					       } else {
					       	 $scope.bookCart = {};
					       	 carList.bookCartList = {};
					       	 $scope.extendedPrices = 0;
					       	 $location.path("//shoppingCart");
					         localStorage.removeItem("cart");
					       }
						$scope.bookCart.num = 0;
					    });
					} else {
						//提示提交失败,可以选择继续购物或是重新提交
						var confirmPopup = $ionicPopup.confirm({
					       title: '提示',
					       template: '提交失败',
					       okText : '重新提交',
					       cancelText: '前往购物'
					     });
					     confirmPopup.then(function(res) {
					       if(res) {
					         $scope.submitOrder();
					       } else {
					         $location.path("");
					       }
					    });
					}
				  }, function errorCallback(response) {
				    var confirmPopup = $ionicPopup.confirm({
					       title: '提示',
					       template: '提交失败',
					       okText : '重新提交',
					       cancelText: '前往购物'
					     });
					     confirmPopup.then(function(res) {
					       if(res) {
					         $scope.submitOrder();
					       } else {
					         $location.path("");
					       }
					    });
				  });
				}
				}
		})
		//个人中心控制器
		.controller("myController",function ($http,$scope) {
			console.log(cookie.getCookie("userName"));
			$scope.showHeader = function () {
				if(cookie.getCookie("userName") == undefined) {
					console.log(cookie.getCookie("userName") == undefined);
					return false;
				} else {
					return true;
				}
			}
		})
		//订单控制器
		.controller("orderListController",function ($http,$scope,$ionicModal,$httpParamSerializer,$location,$ionicPopup) {
			console.log(cookie.getCookie("userId"));
			$scope.beLogin = false;
			$scope.none = false;
			$scope.moreData = true;
			var count = 0;
			if(cookie.getCookie("userName") == undefined) {
				$scope.moreData = false;
				var confirmPopup = $ionicPopup.confirm({
				       title: '提示',
				       template: '请先登录',
				       okText : '前往登录',
				       cancelText: '取消'
				     });
				     confirmPopup.then(function(res) {
				       if(res) {
				         $scope.openModal('login_modal');
				         $location.path("//my");
				       } else {
				         $scope.beLogin = true;
				       }
				    });
			}
			//根据userId获取订单信息
			$scope.loadMore = function(cateid) {
			$http.get("../../shopApi/book/orderQuery.php?user_id="+cookie.getCookie("userId")+'&start='+10*count)
					.then(function (res) {
						console.log(res);
						//如果code等于0,创建评论的模态框
						if(res.data.code === 0) {
							if(count === 0) {
									$scope.orderList = res.data.data;
					    		$scope.moreData = true;

					    		} else {
					    			angular.forEach(res.data.data, function(value, key) {
									  this.push(value);
									}, $scope.orderList);
									console.log($scope.orderList);
					    			$scope.moreData = true;
					    		}
					    		$scope.$broadcast('scroll.infiniteScrollComplete');
					    		$scope.moreData = true;
			   					console.log("请求成功");
								count++;
							//创建评论模态框
							$ionicModal.fromTemplateUrl("./views/comment.html",{
								scope:$scope,
								animation : 'slide-in-up'
							}).then(function (modal) {
								$scope.comment_modal = modal;
							});
							// 打开模态框的方法
							$scope.openModal = function (index) {
								$scope.comment_modal.show();
								$scope.ind = index;
							};
							//关闭模态框
							$scope.closeModal = function() {
								$scope.comment_modal.hide();
							};
							//当code等于1或者2的时候,提示先登录,如果选择取消,则显示没有登录的相关内容
						} else if(res.data.code === 1 || res.data.code === 2) {
							var confirmPopup = $ionicPopup.confirm({
						       title: '提示',
						       template: '请先登录',
						       okText : '前往登录',
						       cancelText: '取消'
						     });
						     confirmPopup.then(function(res) {
						       if(res) {
						         $scope.openModal('login_modal');
						         $location.href("my");
						       } else {
						         $scope.beLogin = true;
						       }
						    });
					    	$scope.moreData = false;
						} else {
							//如果在0,1,2之外,则显示没有购买商品的样式
							$scope.none = true;
					    	$scope.moreData = false;
						}
					})
				};
			$scope.$on('stateChangeSuccess', function() {
			    $scope.loadMore();
			});
			$scope.userComment = {};
			$scope.userComment.user_id = null;
			//提交评论函数
			$scope.commentSubmit = function (id) {
				$scope.userComment.id = id;
				$scope.userComment.user_id = cookie.getCookie("userId");
				console.log($scope.userComment);
				var data = $httpParamSerializer($scope.userComment);
				//提交评论
				$http.post("../../shopApi/book/comment.php",data)
					.then(function (res) {
						console.log(res);
						// 当code等于0的时候,提示提交成功,并可返回首页或是继续评论
						if(res.data.code === 0) {
							var confirmPopup = $ionicPopup.confirm({
						       title: '提示',
						       template: '提交成功',
						       okText : '前往购物',
						       cancelText: '继续评论'
						     });
						     confirmPopup.then(function(res) {
						       if(res) {
						       	$scope.closeModal();
						       	$location.path("");
						       	$scope.userComment={};
						       } else {
						       	$scope.userComment={};
						       	$scope.closeModal();
						       }
						    });
						     //当code为0之外时候,提示提交失败,可选择重新提交,或者返回订单页
						} else {
							var confirmPopup = $ionicPopup.confirm({
						       title: '提示',
						       template: '提交失败',
						       okText : '重新提交',
						       cancelText: '回到订单页'
						     });
						     confirmPopup.then(function(res) {
						       if(res) {
						         $scope.commentSubmit();
						       } else {
						       	$scope.userComment={};
						       	$scope.closeModal();
						       }
						    });
						}
					})

			}
		});
