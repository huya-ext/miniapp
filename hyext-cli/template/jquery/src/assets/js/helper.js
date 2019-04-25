const Helper = (() => {
	function getURLParam(name) {
		let value = window.location.search.match(new RegExp("[?&]" + name + "=([^&]*)(&?)", "i"));
		return value ? decodeURIComponent(value[1]) : value;
	}
	
	function getCookie(cookieName) {
		var cookieString = document.cookie;
		var cookies = cookieString.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var start = cookie.indexOf(cookieName + '=');
			if (start == -1 || start > 1) continue;
			start += cookieName.length + 1;
			return cookie.substring(start);
		}
		return null;
	}

	class Helper {
		getURLParam(name) {
			let value = window.location.search.match(new RegExp("[?&]" + name + "=([^&]*)(&?)", "i"));
			return value ? decodeURIComponent(value[1]) : value;
		}

		formatTime(time) {
			let min = Math.floor(time / 60),
				second = time % 60;
			min = min < 10 ? ('0' + min) : min;
			second = second < 10 ? ('0' + second) : second;
			return min + ':' + second;
		}

		/**
		 * 返回时:分
		 */
		formatTimeHM(time) {
			let d = new Date(time * 1000),
				h = d.getHours(),
				m = d.getMinutes();

			h = h < 10 ? ('0' + h) : h;
			m = m < 10 ? ('0' + m) : m;

			return h + ':' + m;
		}

		formatHour (hour) {
			return hour < 10 ? ('0' + hour) : hour;
		}

		formatNum(num) {
			return String(num).replace(/\B(?=(\d{3})+$)/g, ',');
		}

		formatYMDHM (time) {
			let d = new Date(time * 1000),
				y = d.getFullYear(),
				month = d.getMonth() + 1,
				day = d.getDate(),
				h = d.getHours(),
				m = d.getMinutes();

			y = y < 10 ? ('0' + y) : y;
			month = month < 10 ? ('0' + month) : month;
			day = day < 10 ? ('0' + day) : day;
			h = h < 10 ? ('0' + h) : h;
			m = m < 10 ? ('0' + m) : m;

			return y + '年' + month + '月' + day + '日' + ' ' + h + ':' + m;
		}

		getCookie(cookieName) {
			var cookieString = document.cookie;
			var cookies = cookieString.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var start = cookie.indexOf(cookieName + '=');
				if (start == -1 || start > 1) continue;
				start += cookieName.length + 1;
				return cookie.substring(start);
			}
			return null;
		}

		/**
		 * 打印信息
		 */
		log(tip, data, outputJSON) {
			// if (!debug) return;
			console.log('%c[YS-LOG-' + tip + ':]%c', this.logcss("#009100"), null, data);
		}

		/**
		 * 给log添加颜色
		 */

		logcss(color) {
			return "color:" + color + ";font-weight:900";
		}

		getPlatform() {
			var browser = {
				versions: function() {
					var u = navigator.userAgent,
						app = navigator.appVersion;
					return { //移动终端浏览器版本信息 
						trident: u.indexOf('Trident') > -1, //IE内核 
						presto: u.indexOf('Presto') > -1, //opera内核 
						webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
						gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核 
						mobile: !!u.match(/AppleWebKit.+Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端 
						ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
						android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器 
						iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQ HD浏览器 
						iPad: u.indexOf('iPad') > -1, //是否iPad 
						webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部 
					};
				}()
			};

			return browser.versions.android ? 'android' : 'ios';
		}

		decorator (target, fn) {
			return function () {
				const ret = target.apply(this, arguments);
				fn.apply(this. arguments);
				return ret;
			}
		}
		copy(target) {
			let ob = {};

			for (let key in target) {
				ob[key] = target[key];
			}

			return ob;
		}

		extend(target, object) {
			for (let key in object) {
				target[key] = object[key];
			}

			return target;
		}

		isIOS () {
		    var browser={ 
		      versions:function(){ 
		        var u = navigator.userAgent, app = navigator.appVersion; 
		          return {//移动终端浏览器版本信息 
		            trident: u.indexOf('Trident') > -1, //IE内核 
		            presto: u.indexOf('Presto') > -1, //opera内核 
		            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
		            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核 
		            mobile: !!u.match(/AppleWebKit.+Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端 
		            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
		            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器 
		            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQ HD浏览器 
		            iPad: u.indexOf('iPad') > -1, //是否iPad 
		            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部 
		          }; 
		        }()
		      }; 

		    return !!browser.versions.ios;
		}
		xssFilter (msg) {
            if (typeof msg !== 'string') return msg;

            msg = msg.replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\'/g, '&#39;')
                    .replace(/\"/g, '&quot;');

            return msg;        
        }
		numberFormat (value) {
		    if (value < 10) {
		      return "0" + value.toString();
		    } else {
		      return value.toString();
		    }
		}
	}

	return Helper;
})();

export default new Helper

