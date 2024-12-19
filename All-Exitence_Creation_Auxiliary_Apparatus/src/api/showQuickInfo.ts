//显示一条短信息
export function showQuickInfo(
	infoText:string, //显示的内容信息
	css?:{[key:string]:string},
	position?:{[key:string]:string}, //显示的位置
	divCenter?:boolean,//是否将这个div的中心显示在目标位置
	time?:number //显示的持续时间，默认为5s
){
	//在该位置显示一个info元素
	const infoDiv = document.createElement('div');
	infoDiv.classList.add('quickInfo');  // 给新 div 添加一个类名
	infoDiv.textContent = infoText;  // 给 div 设置文本内容
	// 将新 div 插入body中
	document.body.appendChild(infoDiv);
	// 设定关键css
	infoDiv.style.position = "fixed"
	

	//默认显示在屏幕中心
	if(!position){
		// 获取窗口的尺寸
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		// 获取元素的尺寸
		const elementWidth = infoDiv.offsetWidth;
		const elementHeight = infoDiv.offsetHeight;
		position = {
			top: `${(windowHeight - elementHeight) / 2}px`,
		   	left: `${(windowWidth - elementWidth) / 2}px`
		}
	}
	else{
		//如果要求中心显示在目标位置
		if(divCenter){
			position.left = (parseInt(position.left) - infoDiv.offsetWidth/2) + "px"
		}
	}

	if(!time){
		time = 5000
	}

	// 其他css
	if(css){
		Object.assign(infoDiv.style, css);
	}

	//再次设定关键css防呆
	Object.assign(infoDiv.style, {
		maxWidth:"80%",
		top : position.top,
		left :  position.left,
		zIndex : "1000",
		position : "fixed",
		display: "flex",
		alignItems: "center",
        justifyContent: "center",
		opacity : "1",  // 初始透明度为 1（完全可见）
    	transition : "opacity 2s ease",  // 设置透明度过渡动画
	});
        
	
	// 触发渐变消失
    setTimeout(() => {
        infoDiv.style.opacity = "0";  // 触发透明度变为 0，开始动画
    }, time - 2000);  // 提前 2 秒触发透明度变化，使其在 2s 过渡完成后完全消失

	//时间到消失
	setTimeout(()=>{
		document.body.removeChild(infoDiv)
	},time)
    
}