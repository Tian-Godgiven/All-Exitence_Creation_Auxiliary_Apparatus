

// // 获取文件系统并读取 JSON 文件
// export function readFileToJSON(shortPath:string) {
// 	return new Promise((resovle,reject)=>{
// 		plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS,
// 		// 成功访问文件系统
// 		function (fs) {
// 			fs.root.getFile(`data/${shortPath}`, { create: false }, 
// 				// 成功获取文件，开始读取文件内容
// 				function (fileEntry) {
// 					fileEntry.file(
// 						// 读取成功
// 						(file) => {
// 							console.log(file)
// 							// var reader = new FileReader();
// 							// // 以文本方式读取文件
// 							// reader.readAsText(file);
// 							// reader.onloadend = function () {
// 							// 	try {
// 							// 		let fileContent = reader.result;
// 							// 		if (fileContent instanceof ArrayBuffer) {
// 							// 		  // 将 ArrayBuffer 转换为字符串
// 							// 		  const decoder = new TextDecoder('utf-8');
// 							// 		  fileContent = decoder.decode(fileContent);
// 							// 		}
							
// 							// 		// 解析 JSON 内容
// 							// 		const jsonData = JSON.parse(fileContent);
// 							// 		resovle(jsonData)
// 							// 	} 
// 							// 	catch (e) {
// 							// 		console.error('解析 JSON 数据时出错:', e);
// 							// 		reject("访问失败")
// 							// 	}	
// 							// };
							
// 						}, 
// 						// 读取失败
// 						(error) => {
// 							console.error('读取文件失败:', error);
// 							reject("访问失败")
// 						}
// 					);
// 				}, 
// 				//获取文件失败
// 				(error) => {
// 					console.error('获取文件失败:', error);
// 					reject("访问失败")
// 				}
// 			);
// 		}, 
// 		// 访问文件系统失败
// 		function (error) {
// 			console.error('无法访问文件系统:', error);
// 			reject("访问失败")
// 		});
// 	})
	
// }