const screenWidth = window.innerWidth;
export default function(px:number):number{
	return (px / 750) * screenWidth; // 750rpx 代表全屏宽度
}