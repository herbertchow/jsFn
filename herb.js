//通用js库

/** 
 *所有浏览器支持的浏览器控制台输出信息的方法 
 * http://blog.csdn.net/small_love/article/details/6779705
 */
(function() {
	if (!window.debug) {
		window.debug = function(message) {
			try {
				if (!window.console) {
					window.console = {};
					window.console.log = function() {
						return
					}
				}
				window.console.log(message + ' ')
			} catch (e) {}
		}
	}
})();

//设置移动端fontsize
function reinitFontSize(){
	document.getElementsByTagName('html')[0].style.fontSize = document.documentElement.clientHeight/document.documentElement.clientWidth<1.5 ? (document.documentElement.clientHeight/603*312.5+"%") : (document.documentElement.clientWidth/375*312.5+"%");// 单屏切换
	// document.getElementsByTagName('html')[0].style.fontSize = document.documentElement.clientWidth/375*312.5+"%"; // 长屏

	//jq or zepto写法
	// $("html").css("font-size",document.documentElement.clientHeight/document.documentElement.clientWidth<1.5 ? (document.documentElement.clientHeight/603*312.5+"%") : (document.documentElement.clientWidth/375*312.5+"%")); //单屏全屏布局时使用,短屏下自动缩放
	//$("html").css("font-size",document.documentElement.clientWidth/375*312.5+"%");//长页面时使用,不缩放
}

//requestAniamtionFrame兼容
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

}());


/*简化console.log*/
function log(t){
    if(window.console){
    	console.log(t);
    }
};
//通过Id获取元素
function id(id){ 
	return typeof id==='string'?document.getElementById(id):id;	
};

//通过ClassName获取元素，并且兼容低版本 
//！！注意函数返回的是一个数组，要调用时请加上cn('classname')[0].value数组下角标
function cn(className,root,tagName) {    //root：父节点，tagName：该节点的标签名。 这两个参数均可有可无
    if(root){
        root=typeof root=="string" ? document.getElementById(root) : root;   
    }else{
        root=document.body;
    }
    tagName=tagName||"*";                                    
    if (document.getElementsByClassName) {                    //如果浏览器支持getElementsByClassName，就直接的用
        return root.getElementsByClassName(className);
    }else { 
        var tag= root.getElementsByTagName(tagName);    //获取指定元素
        var tagAll = [];                                    //用于存储符合条件的元素
        for (var i = 0; i < tag.length; i++) {                //遍历获得的元素
            for(var j=0,n=tag[i].className.split(' ');j<n.length;j++){    //遍历此元素中所有class的值，如果包含指定的类名，就赋值给tagnameAll
                if(n[j]==className){
                    tagAll.push(tag[i]);
                    break;
                }
            }
        }
        return tagAll;
    }
};

//模拟forEach
// var arr=[1,2,3,4];
// arr.forEach(function(e){alert(e)});使用方法
(function() {
	if(!Array.prototype.forEach) {
		Array.prototype.forEach = function(fun /*, thisp*/){
			var len = this.length;
			if (typeof fun != "function")
			throw new TypeError();

			var thisp = arguments[1];
			for (var i = 0; i < len; i++)
			{
				if (i in this)
				fun.call(thisp, this[i], i, this);
			}
		};
	}
})();

//实用版 兼容输出console
(function() {
	if (!window.console) {
		window.console = {};
		window.console.log = function() {
			var arg = [].slice.call(arguments);
			return arg;
		}
	}
	// window.console.log(msg + ' ')
})();

/**
*jq中ajax的jsonp说明
*jsonp原理，用script加载url的，所以post是针对未跨域的情况，可以用ajax post请求
跨域了高版本jquery会自动转为get请求【用script加载，而不是使用ajax】，低版本则是没有反应，跨域报错，因为用ajax请求
(url,data,[get,jsonp,]sucfn,errfn) //严格按顺序
**/
var Api = function(){
	return {
	    create : function(){
	    	var self = this;
	    	self.arg = [].slice.call(arguments);
			self.ajaxType = self.arg.length >= 5 ? self.arg[2] : "GET";  //默认get
			self.dataType = self.arg.length >= 6 ? self.arg[3] : "jsonp"; //默认jsonp
			self.succallback = self.arg[self.arg.length - 2] || function() {};
			self.errcallback = self.arg[self.arg.length - 1] || function() {};
	        
	        return $.ajax({
	            url : self.arg[0],
	            type : self.ajaxType,
	            data : self.arg[1],
	            timeout:5000,
	            dataType : self.dataType,
	            success : function(data){
	            	if(typeof self.succallback == 'function'){
	            		self.succallback(data);
	            	}else{
	            		log('Api调用错误：sucfn要求为function，默认请传function(){}')
	            	}
	            },
	            error:function(error){
	                if(typeof self.errcallback == 'function'){
	            		self.errcallback(error);
	            	}else{
	            		log('Api调用错误：errfn要求为function，默认请传function(){}')
	            	}
	            }
	        });
		}
	}
}();


//模拟各类函数并兼容不同浏览器
var win = function(){
	var fn = {
		cloneObj : function(oldObj){ //复制对象方法
			if (typeof(oldObj) != 'object') return oldObj;
			if (oldObj == null) return oldObj;
			var newObj = new Object();
			for (var i in oldObj)
			newObj[i] = fn.cloneObj(oldObj[i]);
			return newObj;
		},
		extendObj :function() { //扩展对象(与jq的extend有一定差别,参看下方注释代码20161019 extend) 模拟jQ的$.extend  使用方法var t=win.extendObj(o1,o2,o3);//var o1=win.extendObj(o1,o2,o3);
			var args = arguments;
			if (args.length < 2) return;
			var temp = fn.cloneObj(args[0]); //调用复制对象方法
			for (var n = 1; n < args.length; n++) {
				for (var i in args[n]) {
					temp[i] = args[n][i];
				}
			}
			return temp;
		},
		trimAll : function(str){
			return str.replace(/\s/g,"");	//去除全局空格
		},
		trim : function(str){
			return str.replace(/(^\s*)|(\s*$)/g, ""); 	 //去除首尾空格
		},

		//排序函数，默认为升序，当且仅当第二个参数为0时降序
		sortData : function(data,setSort){
			var sortUp = function sortNumber(a,b)
			{
				return a - b;//升序
			}, sortDown = function sortNumber(a,b)
			{
				return b - a;//降序
			}
			if(fn.isItNaNArray(data)){
				if(setSort == 0){
					data = data.sort(sortDown);
				} else {
					data = data.sort(sortUp);
				}
				
				// for(var i in data){
				// 	document.write(data[i]+"<br>");
				// }
				// document.write('排序成功');
				return data;
			}
			else{
				alert('该数组非纯数字或超出排序范围，无法排序');
				console.log('该数组非纯数字或超出排序范围，无法排序');
				return ; 
			}
		},

		//判断是否为纯数字数组，是返回1，否返回0
		isItNaNArray : function(data){
			var Tit = 1;//如果有一个不是数字，就设为0
			if(data instanceof Array){
				for(var i in data){
					if(isNaN(data[i])){
						Tit = 0;
					}
				}
				return Tit;
			}
			else {
				return 0;
			}
		},
		
		//数组去重
		removeArr : function(arr){
			if(!(arr instanceof Array)){
				console.log('非数组，去重失败');
				return;
			}
			// var res = [arr[0]];
			// for(var i = 1; i < arr.length; i++){
			// 	var repeat = false;
			// 	for(var j = 0; j < res.length; j++){
			// 		if(arr[i] == res[j]){
			// 			repeat = true;
			// 			break;
			// 		}
			// 	}
			// 	if(!repeat){
			// 		res.push(arr[i]);
			// 	}
			// }
			// return res;
			var res = [];
			var json = {};
			for(var i = 0; i < arr.length; i++){
				if(!json[arr[i]]){
					res.push(arr[i]);
					json[arr[i]] = true;
				}
			}
			return res;
		},

		//获取字符串长度，返回一个数值，英文一个+1，汉字+2
		getCharLen : function(str){ 
	        ///<summary>获得字符串实际长度，中文2，英文1</summary>
	        ///<param name="str">要获得长度的字符串</param>
	        var realLength = 0, len = str.length, charCode = -1;
	        for (var i = 0; i < len; i++) {
		        charCode = str.charCodeAt(i);
		        if (charCode >= 0 && charCode <= 128) 
		        	realLength += 1;
		        else
		        	realLength += 2;
	        }
	        return realLength;
		},
		pScroll : function(contSelectorA,barSelectorA,sliderSelectorA){//这个方法要用JQ
			var Scroll = {};
			(function(win,doc,$){
			    function CusScrollBar(options){
			        //初始化
			        this._init(options);
			    }

			    $.extend(CusScrollBar.prototype,{
			        _init : function(options){
			            var self = this;
			            self.options = {
			                contSelector: "",   // 滑动内容区选择器
			                barSelector: "",    // 滑动条选择器
			                sliderSelector: "", // 滑动块选择器
			                wheelStep: 20       // 滚动步幅
			            };

			            $.extend(true,self.options,options || {});

			            // Dom选择函数
			            self._initDomEvent();
			            // 绑定滑块点击拖动事件
			            self._initSliderDragEvent();
			            // 绑定滚轮事件
			            self._bandMouseWheel();
			            // 监听内容滚动，同步滑块移动
			            self._bandContScroll();
			            //如果无需滚动条，则隐藏滚动条
			            self.checkShowHide();
			            return self;
			        },

			        /*
			         * 初始化DOM引用
			         * @method _initDomEvent
			         */
			        _initDomEvent : function(){
			            var opts = this.options;

			            // 滑动内容区对象，必须填
			            this.$cont = $(opts.contSelector);
			            // 滑动条滑块对象，必须填
			            this.$slider = $(opts.sliderSelector);
			            // 滑动条对象
			            this.$bar = opts.barSelector ? $(opts.barSelector) : this.$slider.parent();
			            // 文档对象
			            this.$doc = $(doc);
			        },

			        /*
			         * 初始化滑动块滑动功能
			         */
			        _initSliderDragEvent : function(){
			            var self = this,
			                slider = self.$slider,//滑块
			                cont = self.$cont,//内容区
			                doc = self.$doc,//document
			                dragStartPagePosition,
			                dragStartScrollPosition,
			                dragContBarRate;

			            function mousemoveHandler(e){
			                if(dragStartPagePosition == null){
			                    return;
			                }
			                self.scrollContTo(dragStartScrollPosition + (e.pageY - dragStartPagePosition)*dragContBarRate);
			            }

			            slider.on("mousedown", function (event){
			                event.preventDefault();
			                dragStartPagePosition = event.pageY;
			                dragStartScrollPosition = cont[0].scrollTop;
			                dragContBarRate = self.getMaxScrollPosition()/self.getMaxSliderPosition();

			                doc.on("mousemove.scroll", function(event){
			                    event.preventDefault();
			                    mousemoveHandler(event);
			                }).on("mouseup.scroll", function(event){
			                    event.preventDefault();
			                    doc.off(".scroll");
			                });
			            });
			        },

			        // 监听内容滚动事件，同步滑块位置
			        _bandContScroll : function() {
			            var self = this;
			            self.$cont.on("scroll", function(e) {
			                e.preventDefault();
			                self.$slider.css( 'top', self.getSliderPosition() + 'px');
			            });
			        },

			        // 绑定鼠标滚轮事件
			        _bandMouseWheel : function() {
			            var self = this;
			            self.$cont.on("mousewheel DOMMouseScroll", function(e) {
			                if( self.$cont[0].scrollTop>0 &&
			                	!(self.$cont[0].scrollTop
			                	>=(self.$cont[0].scrollHeight 
			                	-$.trim(self.$cont.css("padding-top").match(/\d+/g))
			                	-$.trim(self.$cont.css("padding-bottom").match(/\d+/g))
			                	-$.trim(self.$cont.css("height").match(/\d+/g)) ) )  ){
			                	e.preventDefault();
			                }
			                // console.log(self.$cont[0].scrollTop)
			                // 	e.preventDefault();
			                // 	console.log(222222)
			                // console.log('b'+  (self.$cont[0].scrollHeight -$.trim(self.$cont.css("padding-top").match(/\d+/g))-$.trim(self.$cont.css("padding-bottom").match(/\d+/g))-$.trim(self.$cont.css("height").match(/\d+/g))  )   )
			                var oEv = e.originalEvent;
			                // console.log(oEv.wheelDelta + 'xxx')
			                var wheelRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detail || 0)/3;
			                // console.log(wheelRange + 'zzzz')
			                self.scrollContTo(self.$cont[0].scrollTop + wheelRange * self.options.wheelStep);
			                // console.log(self.$cont[0].scrollTop + wheelRange * self.options.wheelStep +'yyy')
			                if( !(self.$cont[0].scrollTop<=0) &&
			                	!(self.$cont[0].scrollTop
			                	>=(self.$cont[0].scrollHeight 
			                	-$.trim(self.$cont.css("padding-top").match(/\d+/g))
			                	-$.trim(self.$cont.css("padding-bottom").match(/\d+/g))
			                	-$.trim(self.$cont.css("height").match(/\d+/g)) ) )  ){
			                	e.preventDefault();
			                }

			            });
			            return self;
			        },

			        // 获取滑块位置
			        getSliderPosition : function() {
			            var self = this;
			            return self.$cont[0].scrollTop/(self.getMaxScrollPosition()/self.getMaxSliderPosition());
			        },

			        // 文档可滚动最大距离
			        getMaxScrollPosition : function() {
			            var self = this;
			            return Math.max(self.$cont.height(),self.$cont[0].scrollHeight) - self.$cont.height() -parseInt($.trim(self.$cont.css("padding-top").match(/\d+/g)))-parseInt($.trim(self.$cont.css("padding-bottom").match(/\d+/g)));
			        },

			        // 滑块可移动最大距离
			        getMaxSliderPosition : function() {
			            var self = this;
			            return self.$bar.height() - self.$slider.height();
			        },

			        // 滚动文档内容
			        scrollContTo : function(positionVal) {
			            var self = this;
			            self.$cont.scrollTop(positionVal);
			        },

			        //检测滚动条是否隐藏
			        checkShowHide : function(){
			        	var self = this;
			        	if(Math.max(self.$cont.height(),self.$cont[0].scrollHeight) - self.$cont.height() -$.trim(self.$cont.css("padding-top").match(/\d+/g))-$.trim(self.$cont.css("padding-bottom").match(/\d+/g))==0){
			        		self.$slider.hide();
			        		self.$bar.hide();
			        	}
			        }

			    });

			    Scroll.CusScrollBar = CusScrollBar;
			})(window,document,jQuery);

			var _scroll = new Scroll.CusScrollBar({
			    contSelector   : contSelectorA,//".fignav",   // 滑动内容区选择器(必须)
			    barSelector    : barSelectorA,//".sildenav",    // 滑动条选择器（必须）
			    sliderSelector : sliderSelectorA//".scroll-slider" // 滑动快选择器
			});
		}
	};
	return fn
}();
/*******************20161019 extend start******************************/
//执行没有错误
// var Obj = {};
// (function(){
// 	function method(){
// 		this._init();
// 	}
// 	$.extend(method.prototype,{
// 		_init : function(){
// 			var self = this;
// 			self._alert();
// 			self._alert2();
// 			return self;
// 		},
// 		_alert : function(){
// 			alert(123);
// 		},
// 		_alert2 : function(){
// 			alert(456);
// 		}
// 	});
//  console.log(method);//function()区别就在于这里,jq extend合并之后返回一个方法
// 	Obj.method = method;
// })();

// var x1 = new Obj.method();

//执行报错 Obj.method is not a constructor
// var Obj = {};
// (function(){
// 	function method(){
// 		this._init();
// 	}
// 	method = win.extendObj(method.prototype,{
// 		_init : function(){
// 			var self = this;
// 			self._alert();
// 			self._alert2();
// 			return self;
// 		},
// 		_alert : function(){
// 			alert(123);
// 		},
// 		_alert2 : function(){
// 			alert(456);
// 		}
// 	});
// 	console.log(method);//Object()模拟返回一个对象
// 	Obj.method = method;
// })();

// var x1 = new Obj.method(); //Obj.method is not a constructor,因为method是一个Object对象而不是一个Function对象

//执行报错 Obj.method is not a constructor 的解决方法如下:把合并后的新对象，赋值给method.prototype
// var Obj = {};
// (function(){
// 	function method(){
// 		this._init();
// 	}
// 	method.prototype = win.extendObj(method.prototype,{
// 		_init : function(){
// 			var self = this;
// 			self._alert();
// 			self._alert2();
// 			return self;
// 		},
// 		_alert : function(){
// 			console.log(123);
// 		},
// 		_alert2 : function(){
// 			console.log(456);
// 		}
// 	});
// 	console.log(method);//Object()模拟返回一个对象
// 	Obj.method = method;
// })();

// var x1 = new Obj.method(); //Obj.method is not a constructor,因为method是一个Object对象而不是一个Function对象

/////////////////////////////////////////////////////////////
// var x = function(){};
// x.prototype._init=function(){
// 	alert(231);
// }
// // x._init();//x._init is not a function
// x.prototype._init();//成功


// var obj = {s:'ssss'};
// if(obj.s){alert(1)}
// if(obj['s']){alert(2)} //表明可以用中括号来取得对象的属性


/*******************extend end******************************/