// 获取文件系统管理器
// uni.getFileSystemManager()
// const fs = uni.getFileSystemManager();

// 使用 Promise 封装异步操作
// export function readFileToJSON(shortPath: string): Promise<any> {
//   return new Promise((resolve, reject) => {
//     // 指定文件路径，假设文件位于 '/data/example.json'
//     const filePath = `${uni.env.USER_DATA_PATH}/data${shortPath}`;
    
//     // 读取文件
//     fs.readFile({
//       filePath: filePath, // 文件路径
//       encoding: 'utf8',    // 编码方式
//       success: function (res) {
//         let fileContent = res.data;

//         if (fileContent instanceof ArrayBuffer) {
//           // 将 ArrayBuffer 转换为字符串
//           const decoder = new TextDecoder('utf-8');
//           fileContent = decoder.decode(fileContent);
//         }

//         try {
//           // 解析 JSON 数据
//           const jsonData = JSON.parse(fileContent);
//           resolve(jsonData); // 返回解析后的 JSON 数据
//         } catch (error) {
//           reject(new Error('JSON 解析失败: ' + error));
//         }
//       },
//       fail: function (err) {
//         reject(new Error('读取文件失败: ' + err.errMsg));
//       }
//     });
//   });
// }


// function readFileToJSON(shortPath:string){
// 	  // 指定文件路径，假设文件位于 '/data/example.json'
// 	  const filePath = `${uni.env.USER_DATA_PATH}/data${shortPath}`;
	  
// 	  const _that = this
// 	  plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
// 	  	entry.getFile(function(file) {
// 	  		var fileReader = new plus.io.FileReader();
// 	  		fileReader.readAsText(file, 'utf-8');
// 	  		fileReader.onloadend = function(evt) {
// 	  			console.log(evt.target.result);
// 	  			_that.list = JSON.parse(evt.target.result)
// 	  			fileReader.abort()
// 	  		}
// 	  	});
// 	  }, 
// 	  function(e) {
// 	  	console.log("读取失败: " + e.message);
// 	  });
// 	}
	
	
// }

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