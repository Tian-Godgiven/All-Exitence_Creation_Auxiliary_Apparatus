	// pxToRem.js
    import _ from 'lodash'
	// 以1920px 底图为准开发页面，动态修改根元素字体的大小
	export const setDomFontSize = () => {
	    let width = document.documentElement.clientWidth || document.body.clientWidth;
	    let fontsize = (width <= 200 ? 1200 : width) / 100 + 'px';
	    (document.getElementsByTagName('html')[0].style)['font-size'] = fontsize;
	}
	
	// let setDomFontSizeDebounce = _.debounce(setDomFontSize, 400)
	// window.addEventListener('resize', setDomFontSizeDebounce); // 浏览器加入收缩监听防抖，重新计算rem配置
	window.addEventListener('resize', setDomFontSize); 
	// 这里有个知识点： window.onresize，window.addEventLister两种方式的区别
	// 最主要的区别：onresize本身就是一个回调，多次执行会被覆盖，通过addEventLister监听多次执行就不会被覆盖，运用于循环生成多个Echarts时，改变窗口大小，Echarts图表自适应问题
