/**
 * 
 */
$(document).ready(function() {		
	if(projectUrl){
		var sdkInput = $("#wx_sdk");
		// 界面上不存在weixinBridge的hidden字段的，不进行任何处理
		if (sdkInput.length == 0) {
			return;
		}
		var sdklist = sdkInput.val().split(',');		
		configWxsdk(projectUrl,sdklist);
	}
});

var loadJsapiTicketSignNum = 0;
/**
 * 异步传递url换取签名，并调用jssdk注册
 */
function loadJsapiTicketSign(url,jsApiList){
	$("#wx_sdkstate").val("start");
	var signUrl = location.href.split('#')[0];
	//console.log(signUrl);
	$.ajax( {
		type : "post",
		async : true,
		url : url + "/wechat/loadJsapiTicketSign.jsp",
		data : {
			"url" : signUrl,
			"i" : Math.random()
		},
		timeout : "10000",
		dataType : "JSON",
		success : function(obj) {
			if (obj == null) {
			} else {
				configApiList(obj,jsApiList);
			}
		},
		error : function() {
			// 如果出错，重试5次;
			if(loadJsapiTicketSignNum<5){
				loadJsapiTicketSignNum=loadJsapiTicketSignNum+1;
				setTimeout(function() {
					loadJsapiTicketSign();
				}, 500);
			}
		}
	});
}
/**
 * 需要使用JSSDK的页面要调用此方法进行注册
 * 
 */
function configWxsdk(url,sdklist){
	try {		
		//if(wx){
			loadJsapiTicketSignNum=0;
			// 存在wx这个对象说明是微信浏览器，此时才能使用微信JSSDK
			var jsApiList = [];
			for(var i in sdklist){
				var c = sdklist[i].replace(/\s/g, "");//去除空格
				if(c=='hideshare'){
					jsApiList.push('hideAllNonBaseMenuItem');
				}else if(c=='share'){// 分享部分
					jsApiList = jsApiList.concat(['onMenuShareTimeline', 'onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone']); 
				}else if(c=='record'){// 录音部分
					jsApiList = jsApiList.concat(['startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice']); 
				}else if(c=='location'){// 地理位置
					jsApiList = jsApiList.concat(['openLocation','getLocation']); 
				}else if(c=='image'){// 上传图片
					jsApiList = jsApiList.concat(['chooseImage','previewImage','uploadImage','downloadImage']); 
				}else if(c=='scan'){//微信扫一扫
					jsApiList.push('scanQRCode');
				}else if(c=='pay'){//支付
					jsApiList.push('chooseWXPay');
				}else if(c=='card'){//卡券
					jsApiList = jsApiList.concat(['addCard','chooseCard','openCard']); 
				}else if(c=='close'){//关闭
					jsApiList.push('closeWindow');
				}
			}
			console.log("sdklist",sdklist);
			console.log("jsApiList",jsApiList);
			// 注册成功执行的ready方法
			wx.ready(function(){
				// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
				// config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
				// 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				wxsdkReady(sdklist);
			});
			// 注册失败执行的error方法
			wx.error(function(res){
				wxsdkError(res);
			});
			// 将链接传递给后台换取微信JSSDK签名，并进行JSSDK使用注册。
			loadJsapiTicketSign(url,jsApiList);
		//}
	}catch(e){
		
	}
}

/**
 * 注册jssdk
 */
function configApiList(obj,jsApiList){
	$("#wx_sdkstate").val("config");

	var apiList = jsApiList || [ 
		// 分享部分
		'onMenuShareTimeline', 'onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'
		// 录音部分
		,'startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice'
		// 地理位置
		,'openLocation','getLocation'
		// 上传图片
		,'chooseImage','previewImage','uploadImage','downloadImage'
		//微信扫一扫
		,'scanQRCode'
		//支付
		,'chooseWXPay'
		//卡券
		,'addCard','chooseCard','openCard'
		// 显示隐藏按钮
		,'hideOptionMenu','showOptionMenu','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem'
		//关闭窗口
		,'closeWindow'
		];
	wx.config( {
		debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId : obj.appId, // 必填，公众号的唯一标识
		timestamp : obj.timestamp, // 必填，生成签名的时间戳
		nonceStr : obj.nonceStr, // 必填，生成签名的随机串
		signature : obj.signature,// 必填，签名，见附录1
		jsApiList : apiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
}
/**
 * jssdk分享注册成功后的回调方法，初始化分享、录音、获取地理位置方法
 */
function wxsdkReady(sdklist){
	$("#wx_sdkstate").val("finish");
	for(var c in sdklist){
		c = c.replace(/\s/g, "");//去除空格
		if(c=='hideshare'){
			wx.hideAllNonBaseMenuItem();
		}else if(c=='share'){// 分享部分
			initWxsdkShareLink();
		}else if(c=='record'){// 录音部分
			initWxsdkVoiceRecord();
		}else if(c=='location'){// 地理位置
			initWxsdkLocation();
		}else if(c=='image'){// 上传图片
			
		}else if(c=='scan'){//微信扫一扫
		}else if(c=='pay'){//支付
		}else if(c=='card'){//卡券
		}else if(c=='close'){//关闭窗口
		}
	}
}
/**
 * jssdk分享注册失败后的回调方法
 */
function wxsdkError(res){
	$("#wx_sdkstate").val("error");
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
}
/**
 * 根据界面的链接、图片、内容等初始化分享的title等信息
 */
function initWxsdkShareLink(){
	var shareFinishHrefLinkInput = $('#wx_share_finish_href');
	var shareFinishHrefLink = '';
	if (shareFinishHrefLinkInput.length == 1) {
		shareFinishHrefLink = shareFinishHrefLinkInput.val();
	}
	var shareHref = (shareFinishHrefLink != '');

	var shareFinishNotifyLinkInput = $('#wx_share_finish_notify_link');
	var shareFinishNotifyLink = '';
	if (shareFinishNotifyLinkInput.length == 1) {
		shareFinishNotifyLink = shareFinishNotifyLinkInput.val();
	}
	var shareNotify = (shareFinishNotifyLink != '');
	
	
	var title = $('#wx_data_title').val();
	var desc = $('#wx_data_desc').val();
	var imgUrl = $('#wx_data_img').val();
	var link = $('#wx_data_url').val();
	var dataForWeixin = {
		title : title,
		desc : desc,
		imgUrl : imgUrl,
		link : link,
		success : function() {
			// 用户确认分享后执行的回调函数
			if (shareNotify) {
				shareNotifyNum(shareFinishNotifyLink);
			}
			if (shareHref) {
				window.location = shareFinishHrefLink;
			}
		},
		cancel : function() {
			// 用户取消分享后执行的回调函数
		}
	};
	// 非微信的非授权链接

	var link2 = $('#wx_data_url2').val();
	if(link2==undefined || link2==''){
		link2 = link;
	}
	var dataForWeixin2 = {
		title : title,
		desc : desc,
		imgUrl : imgUrl,
		link : link2,
		success : function() {
			// 用户确认分享后执行的回调函数
			if (shareNotify) {
				shareFinish(shareFinishNotifyLink);
			}
			if (shareHref) {
				window.location = shareFinishHrefLink;
			}
		},
		cancel : function() {
			// 用户取消分享后执行的回调函数
		}
	};
	wx.onMenuShareTimeline(dataForWeixin);
	wx.onMenuShareAppMessage(dataForWeixin);
	
	wx.onMenuShareQQ(dataForWeixin2);
	wx.onMenuShareWeibo(dataForWeixin2);
	wx.onMenuShareQZone(dataForWeixin2);
}
/**
 * 初始化录音接口
 */
function initWxsdkVoiceRecord(){			
	// 录音部分
	// 监听录音自动停止接口
	wx.onVoiceRecordEnd({
	    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
	    complete: function (res) {
	        voiceRecordEndCallBack(res.localId); 
	    }
	});
	// 监听语音播放完毕接口
	wx.onVoicePlayEnd({
	    success: function (res) {
	        voicePlayEndCallBack(res.localId); // 返回音频的本地ID
	    }
	});
	readyRecordCallBack();
}
/**
 * 初始化获取地理位置接口
 */
function initWxsdkLocation(){
	getLocation();
}
// 录音准备好的回调方法
function readyRecordCallBack(){	
}
// 音频接口
// 开始录音接口
function startRecord(){
	wx.startRecord();
}
// 停止录音接口
function stopRecord(){
	wx.stopRecord({
	    success: function (res) {
	        stopRecordCallBack(res.localId);
	    }
	});
}
// 监听录音自动停止接口
function voiceRecordEndCallBack(myLocalId){
	
}
// 播放语音接口
function playVoice(myLocalId){
	wx.playVoice({
	    localId: myLocalId // 需要播放的音频的本地ID，由stopRecord接口获得
	});
}

// 暂停播放接口
function pauseVoice(myLocalId){
	wx.pauseVoice({
	    localId: myLocalId // 需要暂停的音频的本地ID，由stopRecord接口获得
	});
}
// 停止播放接口
function stopVoice(myLocalId){
	wx.stopVoice({
	    localId: myLocalId // 需要停止的音频的本地ID，由stopRecord接口获得
	});
}
// 语音播放完毕回调
function voicePlayEndCallBack(myLocalId){
	
}
// 上传语音接口
function uploadVoice(myLocalId){
	wx.uploadVoice({
	    localId: myLocalId, // 需要上传的音频的本地ID，由stopRecord接口获得
	    isShowProgressTips: 1, // 默认为1，显示进度提示
	        success: function (res) {
	        uploadVoiceCallBack(res.serverId,myLocalId); // 返回音频的服务器端ID
	    }
	});
}
// 上传结束回调
function uploadVoiceCallBack(myServerId,myLocalId){
	
}
// 备注：上传语音有效期3天，可用微信多媒体接口下载语音到自己的服务器，此处获得的 serverId 即 media_id，参考文档
// ../12/58bfcfabbd501c7cd77c19bd9cfa8354.html
// 目前多媒体文件下载接口的频率限制为10000次/天，如需要调高频率，请邮件weixin-open@qq.com,邮件主题为【申请多媒体接口调用量】，请对你的项目进行简单描述，附上产品体验链接，并对用户量和使用量进行说明。
// 下载语音接口
function downloadVoice(myServerId){
	wx.downloadVoice({
	    serverId: myServerId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
	    isShowProgressTips: 1, // 默认为1，显示进度提示
	    success: function (res) {
	        downloadVoiceCallBack(myServerId,res.localId); // 返回音频的本地ID
	    }
	});
}
// 下载结束回调
function downloadVoiceCallBack(myServerId,myLocalId){
	
}

// 地理位置
// 使用微信内置地图查看位置接口
function openLocation(latitude,longitude,name,address,scale,infoUrl){
	wx.openLocation({
	    latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
	    longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
	    name: name, // 位置名
	    address: address, // 地址详情说明
	    scale: scale, // 地图缩放级别,整形值,范围从1~28。默认为最大
	    infoUrl: infoUrl // 在查看位置界面底部显示的超链接,可点击跳转
	});
}
// 获取地理位置接口
function getLocation(){
	wx.getLocation({
	    success: function (res) {
	        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
	        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
	        var speed = res.speed; // 速度，以米/每秒计
	        var accuracy = res.accuracy; // 位置精度
	        getLocationCallBack(latitude,longitude,speed,accuracy);
	    }
	});
}
// 获取地理位置结束回调
function getLocationCallBack(latitude,longitude,speed,accuracy){
	
}

/**
 * 上传图片接口 2、参数size为压缩尺寸，为了保证压缩图片在页面上的使用质量，此处采用如下做法：
 * 如果宽度大于高度，则把高度固定为size，宽度按照原图等比例缩小；反之亦然 示例：
 * 
 * wxUploadImage({ size : 68, callback : function(data){ } });
 * 
 */
function wxUploadImage(ops){ 
	var sdkstate = $("#wx_sdkstate").val(); 
	if(sdkstate == "finish"){ 
		/*
		 * if(ops.initError == undefined){ showInfo("相机初始化失败，正在重新刷新页面！",1);
		 * location.reload(); }else{ ops.initError(); }
		 */
		chooseImgUpload(ops);
	}else if(sdkstate == "config"){
		// setTimeout(function(){chooseImgUpload(ops)}, 1000);
		showInfo("JS SDK加载中..请稍后");
		return ;
	}else{
		//location.reload();
	}
}

function chooseImgUpload(ops){
	wx.chooseImage({
	    count: 1, // 默认9
	    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	    error : function(res) {
	    	alert("res-->>"+res);
		},
	    success: function (res) {
	    	var localId = res.localIds[0];
	    	wx.uploadImage({
	    	    localId: localId,  // 需要上传的图片的本地ID，由chooseImage接口获得
	    	    isShowProgressTips: 1, // 默认为1，显示进度提示
	    	    success: function (res) {
	    	        var serverId = res.serverId; // 返回图片的服务器端ID
	    	        $("#uploadResult").text(serverId);
	    	        $.ajax({
	    	    		type : "get",
	    	    		url : url + "/wechat/downloadWxImage.jsp",
	    	    		data : {
	    	    			"serverId" : serverId,
	    	    			"size" : (ops.size == undefined ? 0 : ops.size),
	    	    			"a" : Math.random(),
	    	    		},
	    	    		timeout : "10000",
	    	    		dataType : "JSON",
	    	    		success : function(obj) {
	    	    			if (obj != null) {
	    	    				$("#downloadResult").text(obj);
	    	    				if(obj.err == 0){
	    	    					if(ops.callback != undefined){
	    	    						ops.callback(obj.msg);
	    	    					}
	    	    				}
	    	    			} else {
	    	    				 // TODO:
	    	    			}
	    	    		},
	    	    		error : function() {
	    	    			 // TODO:
	    	    		}
	    	    	});
	    	    }
	    	});
	    	
	    }
	});
}
function wxUploadImage2(ops){
	if($("#wx_sdkstate").val() != "finish"){
		showInfo("JS SDK加载中..请稍后");
		return;
	}
	var piccount = ops.piccount || 1;
	wx.chooseImage({
	    count: piccount, // 默认9
	    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	    error : function(res) {
	    	alert("res-->>"+res);
		},
	    success: function (res) {
	    	var localId = res.localIds[0];
	    	wx.uploadImage({
	    	    localId: localId,  // 需要上传的图片的本地ID，由chooseImage接口获得
	    	    isShowProgressTips: 1, // 默认为1，显示进度提示
	    	    success: function (res) {
	    	        var serverId = res.serverId; // 返回图片的服务器端ID
	    	        $("#uploadResult").text(res);
	    	        dlImgFromWxToImgServer(ops.token,serverId,ops.p);
	    	    }
	    	});
	    }
	});
}
function wxUploadImage3(ops){
	if($("#wx_sdkstate").val() != "finish"){
		showInfo("JS SDK加载中..请稍后");
		return;
	}
	var piccount = ops.piccount || 1;
	wx.chooseImage({
	    count: piccount, // 默认9
	    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	    error : function(res) {
	    	alert("res-->>"+res);
		},
	    success: function (res) {
	    	var localIds = res.localIds;
	    	syncUpload(localIds);
	    }
	});
}
var syncUpload=function(localIds){
	var localId = localIds.pop();
	wx.uploadImage({
	    localId: localId,  // 需要上传的图片的本地ID，由chooseImage接口获得
	    isShowProgressTips: 1, // 默认为1，显示进度提示
	    success: function (res) {
	        var serverId = res.serverId; // 返回图片的服务器端ID
	        $("#uploadResult").text(res);
	        dlImgFromWxToImgServer(serverId);
	        var size=localIds.length;
	        if(size+1>0){
	        	setTimeout(syncUpload(localIds),1500);
	        }
	    }
	});
}


function addCard(cardId,cardExt,callback){
	wx.addCard({
	    cardList: [{
	        cardId: cardId,
	        cardExt: cardExt
	    }], // 需要添加的卡券列表
	    success: function (res) {
	    	if(callback){
	    		callback(res);
	    	}
	        //var cardList = res.cardList; // 添加的卡券列表信息
	    }
	});	
}
function openCard(cardId,code){
	wx.openCard({
	    cardList: [{
	        cardId: cardId,
	        code: code
	    }]// 需要打开的卡券列表
	});
}
function openCard(cardList){
	wx.openCard({
	    cardList: cardList// 需要打开的卡券列表
	});
}

function chooseWXPay(timestamp,nonceStr,pack,signType,paySign,callback){
	wx.chooseWXPay({
	    'timestamp': timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
	    'nonceStr': nonceStr, // 支付签名随机串，不长于 32 位
	    'package': pack, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
	    'signType': signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
	    'paySign': paySign, // 支付签名
	    success: function (res) {
	    	if(callback){
	    		callback(res);
	    	}
	    }
	});
}
function scanQRCode(callback){
	wx.scanQRCode({
	    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
	    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
	    success: function (res) {
	    	if(callback){
	    		callback(res);
	    	}
	    	//var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
	    }
	});
}
//关闭窗口
function closeWindow(){
	wx.closeWindow();
}
function shareFinish(link) {
	$.ajax( {
		type : "get",
		url : link,
		timeout : "10000",
		dataType : "JSON",
		success : function(obj) {
		},
		error : function() {
		}
	});
}
function isWeiXin(){ 
	var ua = window.navigator.userAgent.toLowerCase(); 
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		return true; 
	}else{ 
		return false; 
	} 
} 
