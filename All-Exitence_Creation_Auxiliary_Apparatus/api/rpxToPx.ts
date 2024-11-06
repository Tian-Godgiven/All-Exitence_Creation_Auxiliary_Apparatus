const screenWidth = uni.getSystemInfoSync().screenWidth
export function rpxToPx(rpx:number):number{
	return (rpx / 750) * screenWidth; // 750rpx 代表全屏宽度
}

export function pxToRpx(px:number):number{
	return (px * 750) / screenWidth;
}