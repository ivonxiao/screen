/** 
 * @fileoverview  卓望数码 jQuery Common Library
 * @description:封装一些系统公用模块
 * @author oCEAn Zhuang (zhuangruhai@aspirecn.com QQ: 153414843)
 * @version 1.0
 * @date 2013-10-30
 */
var CONTEXT_PATCH = '';//获取
var isShowLoading = false;
if (document.getElementsByTagName('base').length && document.getElementsByTagName('base')[0].href) {
	CONTEXT_PATCH = document.getElementsByTagName('base')[0].href;
}
/**
 * 显示进度条
 */
var showLoading = function(){
	if (!document.getElementById('_loading')){
		$('body').append('<div id="_loading" style="width:200px;height:30px;background-color: #f5f5f5;text-align:center;z-index:9999"><div style="margin-top:5px;"><img src="images/loading.gif"/><span style="margin-left:4px;">数据处理中...</span><div id="close">x</div></div></div>');
	}
	$('#_loading').floatDiv({show:true,clsBtn: $('#close')});
}
/**
 * 隐藏进度条
 */
var hideLoading = function(){
	$('#_loading').floatDiv({show:false});
}
$(document).ajaxComplete(function(event, xhr, settings){
	if(isShowLoading){
		hideLoading();
	}
	isShowLoading = false;
	try{
		var result = jQuery.parseJSON(xhr.responseText);
		/* 用户会话失效或为登录，重定向至登录页面 */
		if(result && result.data && result.data.sessionInvalid && result.data.redirectUrl) {
			window.location.replace(result.data.redirectUrl);
		}
	}catch(e){}
});
$(document).ajaxStart(function(event, jqxhr, settings){
	if (!isShowLoading)return;
	showLoading();
});
/**
 * 统一弹出框
 * @param {Object} $
 */
(function($) {
	$.alerts = {
		verticalOffset: -75, // vertical offset of the dialog from center screen, in pixels
		horizontalOffset: 0, // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize: true, // re-centers the dialog on window resize
		overlayOpacity: .01, // transparency level of overlay
		overlayColor: '#666666', // base color of overlay
		draggable: false, // make the dialogs draggable (requires UI Draggables plugin)
		okButton: '&nbsp;确认&nbsp;', // text for the OK button
		cancelButton: '&nbsp;取消&nbsp;', // text for the Cancel button
		dialogClass: null, // if specified, this class will be applied to all dialogs

		// Public methods

		alert: function(message, title, callback) {
			if (title == null) title = 'Alert';
			$.alerts._show(title, message, null, 'alert', function(result) {
				if (callback) callback(result);
			});
		},

		confirm: function(message, title, callback) {
			if (title == null) title = 'Confirm';
			$.alerts._show(title, message, null, 'confirm', function(result) {
				if (callback) callback(result);
			});
		},

		prompt: function(message, value, title, callback) {
			if (title == null) title = 'Prompt';
			$.alerts._show(title, message, value, 'prompt', function(result) {
				if (callback) callback(result);
			});
		},

		// Private methods

		_show: function(title, msg, value, type, callback) {

			$.alerts._hide();
			$.alerts._overlay('show');

			$("BODY").append(
				'<div class="popwindow" id="popup_container">' + '<div class="popwintop">' + '<div class="poptitle" id="popup_title"></div>' + '<div class="popwinright">' + '<div class="daibanright" id="popwindowclose">x</div>' + '</div></div>' + '<div  class="popwinframe" id="popup_message" style="overflow:hidden;">' + '</div></div>');

			if ($.alerts.dialogClass) $("#popup_container").addClass($.alerts.dialogClass);

			// IE6 Fix
			//var pos = ($.browser.msie && parseInt($.browser.version) <= 6) ? 'absolute' : 'fixed';
			var pos ='fixed';
			$("#popup_container").css({
				position: pos,
				zIndex: 99999,
				padding: 0,
				margin: 0
			});

			$("#popup_title").text(title);

			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});

			$.alerts._reposition();
			$.alerts._maintainPosition(true);
			$("#popwindowclose").click(function() {
				$.alerts._hide();
				if (callback) {
					callback();
				};
			});
			$('#popup_message').empty();
			switch (type) {
				case 'alert':
					$('<table width="90%" border="0" cellpadding="0" cellspacing="0" class="pop_insert_table"><tr><td class="pop_center">' + msg + '</td></tr></table>').appendTo('#popup_message');
					setTimeout(function(){$("#popwindowclose").trigger('click');},2000);
					break;
				case 'confirm':
					$('<table width="90%" border="0" cellpadding="0" cellspacing="0" class="pop_insert_table"><tr class="rizhiline"><td class="pop_center">' + msg + '</td></tr><tr style="height:48px;"><td><p align="center"><input type="button" id="popup_ok" value="确认" class="bluebtn1" />&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" id="popup_cancel" value="取消" class="bluebtn1" /></p></td></tr></table>').appendTo('#popup_message');
					$("#popup_ok").click(function() {
						$.alerts._hide();
						if (callback) callback(true);
					});
					$("#popup_cancel").click(function() {
						$.alerts._hide();
						if (callback) callback(false);
					});
					$("#popup_ok").focus();
					$("#popup_ok, #popup_cancel").keypress(function(e) {
						if (e.keyCode == 13) $("#popup_ok").trigger('click');
						if (e.keyCode == 27) $("#popup_cancel").trigger('click');
					});
					
					break;
				case 'prompt':
					if(value==0){
						$('<table width="90%" border="0" cellpadding="0" cellspacing="0" class="pop_insert_table"><tr><td class="pop_center1"><p><img src="images/pop_wrong.png" width="70" height="70" border="0"/></p><p style="line-height:50px">' + msg + '</p></td></tr><tr style="height:48px;"><td><p align="center"><input type="button" id="popup_ok" value="确认" class="bluebtn1" /></p></td></tr></table>').appendTo('#popup_message');
					}else if(value==1){
						$('<table width="90%" border="0" cellpadding="0" cellspacing="0" class="pop_insert_table"><tr><td class="pop_center1"><p><img src="images/pop_right.png" width="70" height="70" border="0"/></p><p style="line-height:50px">' + msg + '</p></td></tr></table>').appendTo('#popup_message');
					}else{
						$('<table width="90%" border="0" cellpadding="0" cellspacing="0" class="pop_insert_table"><tr><td class="pop_center1"><p style="line-height:50px">' + msg + '</p></td></tr><tr style="height:48px;"><td><p align="center"><input type="button" id="popup_ok" value="确认" class="bluebtn1" /></p></td></tr></table>').appendTo('#popup_message');

					}
					$("#popup_ok").click(function() {
						$("#popwindowclose").trigger('click');
					});
					if (value == 1)
					setTimeout(function(){$("#popwindowclose").trigger('click');},2000);
					break;
			}
			$("#popup_container").fadeIn(200);

		},

		_hide: function() {
			$("#popup_container").remove();
			$.alerts._overlay('hide');
			$.alerts._maintainPosition(false);
		},

		_overlay: function(status) {
			switch (status) {
				case 'show':
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						background: '#666666',
						filter: 'alpha(opacity=60)',
						'-moz-opacity': 0.6,
						opacity: 0.6,
						position: 'absolute',
						left: 0,
						top: 0,
						width: '100%',
						height: $(document).height(),
						'z-index': 1001
					});
					break;
				case 'hide':
					$("#popup_overlay").remove();
					$("#popup_container").fadeOut(200);
					break;
			}
		},

		_reposition: function() {
			//var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
			//var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			var left = (Math.max($(document).width(), $(window).width()) - $("#popup_container").outerWidth()) / 2;
			var top = $(window).scrollTop() + $(window).height() / 9;
			if (top < 0) top = 0;
			if (left < 0) left = 0;

			// IE6 fix
			//if ($.browser.msie && parseInt($.browser.version) <= 6) top = top + $(window).scrollTop();

			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px',
				position: 'absolute'
			});
			$("#popup_overlay").height($(document).height());
		},

		_maintainPosition: function(status) {
			if ($.alerts.repositionOnResize) {
				switch (status) {
					case true:
						$(window).bind('resize', function() {
							$.alerts._reposition();
						});
						break;
					case false:
						$(window).unbind('resize');
						break;
				}
			}
		}

	}
	/**
	 * @namespace 提示弹出框
	 * @param message 提示信息
	 * @param callback 回调函数,非必传
	 */
	Q_Alert = function(message, callback) {
		$.alerts.alert(message, "提示", callback);
	}
	/**
	 * @namespace 确认提示框
	 * @public 
	 * @param message 确认提示的信息
	 * @param callback 回调函数,如果确认返回1，取消返回0
	 * @example
	 * Q_Confirm('确认删除当前记录吗?',function(rtn){
	 * 		if (rtn){//确认删除
	 * 		}else{//取消删除
	 * 		}
	 * });
	 */
	Q_Confirm = function(message, callback) {
		$.alerts.confirm(message, "提示", callback);
	}
	/**
	 * @namespace 带成功或失败标识的提示框 
	 * @param message 提示信息
	 * @param value 1表示成功，0表示失败,2没有错误或成功图片
	 * @param callback 回调函数,非必传
	 */
	Q_Prompt = function(message, value, callback) {
		$.alerts.prompt(message, value, "提示", callback);
	}
	
	
	/**
	 * @namespace 成功提示框
	 * @public 
	 * @param message 提示信息
	 * @param callback 回调函数,非必传
	 */
	Q_Prompt_SUCC = function(message, callback) {
		$.alerts.prompt(message, 1, "提示", callback);
	}
	/**
	 * @namespace 失败提示框
	 * @param message 提示信息
	 * @param callback 回调函数,非必传
	 */
	Q_Prompt_FAIL = function(message, callback) {
		$.alerts.prompt(message, 0, "提示", callback);
	}
	/**
	 * @namespace 简单提示框
	 * @param message 提示信息
	 * @param callback 回调函数,非必传
	 */
	Q_Prompt_Simple= function(message, value, callback) {
		$.alerts.prompt(message, 2, "提示", callback);
	}
})(jQuery);

/**
 * 初始化列表，选项为最近10年。
 *
 **/
var initYearSelect = function(id) {
	var s = document.getElementById(id),
		size = 10,
		d = new Date(),
		year = d.getFullYear();
	s.length = 0;
	for (var i = size; i >= 0; i--) {
		s.options[s.length] = new Option((year - (size - i)) + '年', (year - (size - i)));
	}

};
/**
 * 提供静态方法初始化业务相关的列表。
 *
 **/
var SelectObj = {
	rendereSelect: function(id, datas) {
		var s = null;
		if (typeof(id) == 'string') {
			s = document.getElementById(id);
		} else if (typeof(id) == 'object') {
			s = id;
		}
		var len = datas.length;
		s.length = 0;
		for (var i = 0; i < len; i++) {
			s.options[s.length] = new Option(datas[i].text, datas[i].value);
		}
	},
	initSubProduct : function(subProductId,pid,isAdd){
		var subProductObj = subProductId;
		var subPUrl = "qm/product/product!selectProduct.action?product.dynamicFields.isManager=1&product.productId=" + pid;
		if (typeof subProductId == 'string') {
			subProductObj = $('#' + subProductId);
		}
		if(isAdd && isAdd == 'isAdd'){
			subPUrl += "&product.dynamicFields.isAdd=isAdd"; 
		}
		subProductObj.ajaxRender(subPUrl, {
			firstOption: {
				text: '--请选择--',
				value: ''
			},
			keyValue: {
				text: 'productName',
				value: 'subProductId'
			},
			root:"data.list"
		});
	},
	initProductAndVersion : function(versionId,productOptions,versionOptions){

		var versionObj = versionId;
		if (typeof versionId == 'string') {
			versionObj = $('#' + versionId);
		}	
		var params = $.extend({},versionOptions || {});
		versionObj.ajaxRender("qm/product/productVersion!selectVersion.action?" + $.param(params),{
			firstOption: {
				text: '--请选择--',
				value: ' '
			},
			keyValue: {
				text: 'value',
				value: 'key'
			},
			root: 'data.list'
		});
	},
	initProduct : function(productId,productOptions) { //下拉框
		var productObj = productId;
		if (typeof productId == 'string') {
			productObj = $('#' + productId);
		}
		//var roleType = getP('roleType');
		var params = $.extend({},productOptions || {});

		productObj.ajaxRender(
			"qm/product/product!selectProduct.action?product.dynamicFields.grade=first&" + $.param(params), {
			firstOption: {
				text: '--请选择--',
				value: ''
			},
			keyValue : {
				text : 'name',
				value : 'productId'
			},
			 root:'data.list'
		 });
	},
	initTestCode	:	function(testCodeId, url, callback) { //下拉框
		var testCodeObj = testCodeId;
		if (typeof testCodeId == 'string') {
			testCodeObj = $('#' + testCodeId);
		}
		var option = {
				firstOption: {
					text: '--请选择--',
					value: ''
				},
				keyValue: {
					text: 'value',
					value: 'key'
				},
				root:"data.listTestCode"
		};
		
		if(callback){
			option['callback'] = callback;
		}
		testCodeObj.ajaxRender(url, option);
	},
	initProductAndSubProduct2: function(productId, subProductId,productOptions,subProdctOptions,isAdd, testCodeOptions) { //下拉框
		var productObj = productId,
			subProductObj = subProductId;
		if (typeof productId == 'string') {
			productObj = $('#' + productId);
		}
		if (typeof subProductId == 'string') {
			subProductObj = $('#' + subProductId);
		}
		//var roleType = getP('roleType');
		var params = $.extend({},productOptions || {});
		productObj.ajaxRender(
			"qm/product/product!selectProduct.action?product.dynamicFields.grade=first&" + $.param(params), {
			firstOption: {
				text: '--请选择--',
				value: ''
			},
			keyValue : {
				text : 'name',
				value : 'productId'
			},
			 root:'data.list'
		 });
		 
		 //加载子产品列表
		var subpara = $.extend({},subProdctOptions || {});
		var subParams = $.param(subpara).replaceAll("obj.","product.");//因传product.productId会导致主产品选中事件不可用
		if(subProductObj && subParams!=''){
			var listSubProductUrl = "qm/product/product!selectProduct.action?";
			if(isAdd && isAdd == 'isAdd'){
				listSubProductUrl = "qm/product/product!selectProduct.action?product.dynamicFields.isAdd=isAdd&";
			}			
			subProductObj.ajaxRender(listSubProductUrl + subParams, {
				firstOption: {
					text: '--请选择--',
					value: ''
				},
				keyValue: {
					text: 'productName',
					value: 'subProductId'
				},
				root:"data.list"
			 });
		 }
		 //主产品选中事件
		 productObj.unbind('change').bind('change',function(){
			
			var pid = productObj.val();
			if (subProductObj) {
				if (!pid){
					subProductObj.empty();
					subProductObj.append('<option value="">--请选择--</option>');
				}else{
					//
					var params = {
							'product.productId' : ''+pid
						};
					params = $.extend({},params,(subProdctOptions || {}));
					var listSubProductUrl = "qm/product/product!selectProduct.action?";
					if(isAdd && isAdd == 'isAdd'){
						listSubProductUrl = "qm/product/product!selectProduct.action?product.dynamicFields.isAdd=isAdd&";
					}
					subProductObj.ajaxRender(listSubProductUrl + $.param(params), {
						firstOption: {
							text: '--请选择--',
							value: ''
						},
						keyValue: {
							text: 'productName',
							value: 'subProductId'
						},
						root:"data.list"
					 });
					 $('#subProductId').val("");
				}
				//subProductObj.trigger('blur').trigger('change');
			}
			
			if(testCodeOptions && testCodeOptions instanceof Object && testCodeOptions['$testCode']){
				if (!pid){
					testCodeOptions['$testCode'].empty();
					testCodeOptions['$testCode'].append('<option value="">--请选择--</option>');
				}else{
					var listTestCodeUrl = "qm/testCodeList.action?productId=" + pid;
					SelectObj.initTestCode(testCodeOptions['$testCode'], listTestCodeUrl, function(ele){
						if($(ele).find('option').length > 1 && testCodeOptions['$acceptedChannels'] && testCodeOptions['$acceptedChannels'].val() === '131'){//测试指标出现条件，反馈渠道：拨测指标，+拨测指标必须有可选值
							$(ele).parent().show();
							if(testCodeOptions['$involveAspect'] && testCodeOptions['$involveAspect'].val() === '3'){
								$(ele).parent().find('label>span').addClass('red').html('*');
								$(ele).parent().find('select').attr('nullmsg', '请选拨测指标').attr('dataType', '*');
							}
							
						}else{
							$(ele).parent().hide();
						}
					});
				}
			}
			productObj.removeAttr("ignore");
		});
		//检查子产品经理
		subProductObj.bind('change',function(){
			 var subPid = subProductObj.val();
			 if(subPid!=''){
				//更改主产品校验信息
				productObj.parent().find('span.Validform_checktip').eq(0).html("");//清空校验信息
				productObj.parent().find('span.Validform_checktip').eq(0).removeClass("Validform_wrong").addClass("Validform_right");
				productObj.attr("ignore","ignore");//忽略校验
			 }else{
				productObj.attr("ignore","_ignore");//校验
				productObj.trigger('blur');//此处需重新检查主产品是否配置产品经理
			 }
		 });
	},
	initSuggestVersion: function(productId, subProductId,productOptions,subProdctOptions){
		var productObj = productId,
			subProductObj = subProductId;
		if (typeof productId == 'string') {
			productObj = $('#' + productId);
		}
		if (typeof subProductId == 'string') {
			subProductObj = $('#' + subProductId);
		}
		/**productObj.bind('focus', function() {
			if (subProductObj) {
				subProductObj.length = 0;
				subProductObj.options[subProductObj.length] = new Option('--请选择--', '');
			}
		})**/
		if (productObj.attr('hiddenName')){
			var hiddenId = 'hidden_' + (new Date()).getTime();
			$('<input type="hidden" name="'+productObj.attr('hiddenName')+'" id="' + hiddenId + '"/>').insertBefore(productObj);
			productObj.attr('hiddenId',hiddenId);
		}
		productObj.unbind('change').bind('change',function(){
			//if($.browser.mozilla){//firefox的onchange事件跟其它浏览器不一样，这里做了兼容
				if ($(this).attr('_pid')){
					$(this).attr('pid',$(this).attr('_pid'));
					if ($(this).attr('hiddenId')){
						$('#' + $(this).attr('hiddenId')).val($(this).attr('_pid'));
					}
					$(this).attr('_pid','');
				}else{
					$(this).attr('pid','');
					$('#' + $(this).attr('hiddenId')).val('');
					if (subProductObj) {
						subProductObj.empty();
						subProductObj.append('<option value="">全部</option>');
						subProductObj.trigger('blur');
					}
				}
			//}else{

				//if (subProductObj) {
				//	subProductObj.empty();
				//	subProductObj.append('<option value="">--全部--</option>');
				//	subProductObj.trigger('blur');
				//}
			//}
			
		});
		//var roleType = getP('roleType');

		productObj.autocomplete({
			minLength: 0,
			//source: [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ],
			source: function(request, response) {

				$.ajax({
					url: "qm/product/product!suggestVersion.action",
					dataType: "json",
					data: {
						featureClass: "P",
						style: "full",
						maxRows: 12,
						'productVersion.dynamicFields.versionNo': request.term,
						'systemKey':'qm'
					},
					success: function(_data) {
						if (!_data.data.list)return;
						response($.map(_data.data.list, function(item) {
							return {
								label: item.value,
								value: item.key
							}
						}));
					}
				});
			},
			select: function(event, ui) {
				$(this).val(ui.item.label);
				$(this).attr('pid',ui.item.value);
				if ($(this).attr('hiddenId')){
					$('#' + $(this).attr('hiddenId')).val(ui.item.value);
				}
				$(this).attr('_pid',ui.item.value);
				if (subProductObj) {
					var pid = $(this).attr('pid');
					if (pid){
						var params = $.extend({'product.productId' : (''+pid),'product.productName':ui.item.value},subProdctOptions || {});
						subProductObj.ajaxRender("qm/product/product!suggestSubName.action?" + $.param(params), {
							firstOption: {
								text: '全部',
								value: ''
							},
							keyValue: {
								text: 'productName',
								value: 'subProductId'
							},
							root:"data.list"
						});
					}else{
						subProductObj.empty();
						subProductObj.append('<option value="">全部</option>');
					}
					subProductObj.trigger('change');
				}
				return false;
			}
			
		});	

	},
	initProductAndSubProduct: function(productId, subProductId,productOptions,subProdctOptions) { //用户数据及订购关系说明
		var productObj = productId,
			subProductObj = subProductId;
		if (typeof productId == 'string') {
			productObj = $('#' + productId);
		}
		if (typeof subProductId == 'string') {
			subProductObj = $('#' + subProductId);
		}
		/**productObj.bind('focus', function() {
			if (subProductObj) {
				subProductObj.length = 0;
				subProductObj.options[subProductObj.length] = new Option('--请选择--', '');
			}
		})**/
		if (productObj.attr('hiddenName')){
			var hiddenId = 'hidden_' + (new Date()).getTime();
			$('<input type="hidden" name="'+productObj.attr('hiddenName')+'" id="' + hiddenId + '"/>').insertBefore(productObj);
			productObj.attr('hiddenId',hiddenId);
		}
		productObj.unbind('change').bind('change',function(){
			//if($.browser.mozilla){//firefox的onchange事件跟其它浏览器不一样，这里做了兼容
				if($(this).val() == ''){//删除产品时，子产品清空置为全部
					subProductObj.empty();
					subProductObj.append('<option value="">全部</option>');
				}
				if ($(this).attr('_pid')){
					$(this).attr('pid',$(this).attr('_pid'));
					if ($(this).attr('hiddenId')){
						$('#' + $(this).attr('hiddenId')).val($(this).attr('_pid'));
					}
					$(this).attr('_pid','');
				}else{
					$(this).attr('pid','');
					$('#' + $(this).attr('hiddenId')).val('');
					if (subProductObj) {
						subProductObj.empty();
						subProductObj.append('<option value="">全部</option>');
						subProductObj.trigger('blur');
					}
				}
			//}else{

				//if (subProductObj) {
				//	subProductObj.empty();
				//	subProductObj.append('<option value="">--全部--</option>');
				//	subProductObj.trigger('blur');
				//}
			//}
			
		});
		//var roleType = getP('roleType');
		var params = $.extend({},productOptions || {});
		var keyMap = new Array();
		productObj.autocomplete({
			minLength: 0,
			//source: [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ],
			source: function(request, response) {
				if (productObj.attr('queryParams')){
					$.extend(params, eval('(' + productObj.attr('queryParams') + ')') || {});
				}
				$.ajax({
					url: "qm/product/product!suggestName.action?" + $.param(params),
					dataType: "json",
					data: {
						featureClass: "P",
						style: "full",
						maxRows: 12,
						'product.dynamicFields.name': request.term
					},
					success: function(_data) {
						if (!_data.data.list)
							return;
						keyMap = new Array();
						for(var i=0;i<_data.data.list.length;i++){
							keyMap[i]=_data.data.list[i].name+"@"+_data.data.list[i].productId;
						}
						response($.map(_data.data.list, function(item) {
							return {
								label: item.name,
								value: item.name
							}
						}));
					}
				});
			},
//			focus:function(event, ui){
//				alert(1);
//				 $(this).autocomplete("search");
//                 return false;
//			},
			select: function(event, ui) {
				$(this).val(ui.item.label);
				var proId="";
				for(var i=0;i<keyMap.length;i++){
					var pro = keyMap[i].split('@');
					if(pro[0] == ui.item.label){
						proId = pro[1]
					}
				}
				$(this).attr('pid',proId);
				if ($(this).attr('hiddenId')){
					$('#' + $(this).attr('hiddenId')).val(proId);
				}
				$(this).attr('_pid',proId);
				if (subProductObj) {
					var pid = $(this).attr('pid');
					if (pid){
						var params = $.extend({'product.productId' : (''+pid),'product.productName':proId},subProdctOptions || {});
						subProductObj.ajaxRender("qm/product/product!suggestSubName.action?" + $.param(params), {
							firstOption: {
								text: '全部',
								value: ''
							},
							keyValue: {
								text: 'productName',
								value: 'subProductId'
							},
							root:"data.list"
						});
					}else{
						subProductObj.empty();
						subProductObj.append('<option value="">全部</option>');
					}
					subProductObj.trigger('change');
				}
				return false;
			}
		}).focus(function(){
            $(this).autocomplete("search");
            return false;
        });
	}
}
/**
 * 弹出标签式的列表选项。
 *@class
 *@example
 *html: 
 *		<div id="supportCodeDesc_tag"></div>
 *js:	
 *		var supportCodeDesc_tagObj = new TagSelectObj('supportCodeDesc_tag');
 *		supportCodeDesc_tagObj.init({'url':'qm/requirement/requirement!receives.action','btnName':'需求受理方','hiddenName':'receives'});
 *
 */
var TagSelectObj = function(contenterId) {
	this._contenterId = contenterId;
	this._hiddenId = 'h_' + (new Date()).getTime();
	this._options = {
		btnName: '请选择',
		hiddenName:'',
		url: '',
		hideCs:false,
		css:'0',
		checkedIds:'',
		grayIds:'',
		addHtmlInfo:'',
		extHidenId:'',
		icon:'N',
		okcallback:'okcallback'
	};
}
TagSelectObj.prototype = {
	getSelectedTags: function() {
		var result = [],
			tags = $('#' + this._contenterId + ' div.choice .item');
		$.each(tags, function() {
			var tagid = $(this).attr('tagid');
			result.push(tagid);
		});
		return result.join(',');
	},
	getSelectedIds: function() {
		var result = [],
		tags = $('input[name="checkbox_companyName_tag"]');
		$.each(tags, function() {
			if($(this).is(':checked'))
				result.push($(this).val());
		});
		return result.join(',');
	},
	getSelectedTexts: function() {
		var result = [],
		tags = $('input[name="checkbox_companyName_tag"]');
		$.each(tags, function() {
			if($(this).is(':checked'))
				result.push($(this).parent().text());
		});
		return result.join(',');
	},
	getTagHTML: function(contenterId, id, text) {
			return '<div class="item" id="' + contenterId + id + '" tagId="' + id + '"><div class="choiceitem">' + text + '</div><div class="closeitem1"> <a href="javascript:;"></a> </div></div>';
	},
	_bindCloseItem : function(){
		var _this = this;
		$('#' + this._contenterId + ' .choice').find('.closeitem1 > a').unbind().bind('click',function(){
			$(this).parent('div').parent('div').fadeRemove(function(){
				$('#' + _this._hiddenId).val(_this.getSelectedTags());
			});
			$('#' + $(this).parent('div').parent('div').attr('id') + '_cb').attr('checked',false);
		});
	},
	clear : function(){
		$(':input[type=checkbox][name=checkbox_' + this._contenterId + ']').each(function(){
			$(this).attr('checked',false);
		});
		$('#' + this._contenterId + ' .choice').empty();
		$('#' + this._hiddenId).val('');
	},
	closepop	:	function(){
		var popObj = $('.pop_outer');
		popObj.prev().remove();
		popObj.remove();
		if($('#resultNoneMsg') && $('#resultNoneMsg').length>0){
			$('#resultNoneMsg').hide();
		}
	},
	init: function(opt) {
		var _this = this;
		var _addHtmlIcon='';
		$.extend(_this._options, opt);
		if(_this._options.icon == 'Y'){
			_addHtmlIcon = '<span class="add_icon"></span>';
		}
		var addHtmlInfo='';
		if(_this._options.addHtmlInfo && _this._options.addHtmlInfo!=''){
			addHtmlInfo=_this._options.addHtmlInfo;
		}
		var divId = _this._contenterId;
		if (_this._options.hiddenName){
			var checkedIds = _this._options.checkedIds;
			var checkedValue = "";
			if(checkedIds!=null){
				checkedValue = checkedIds;
			}
			var idArr = checkedValue.split(",");
			var grayIdArr = _this._options.grayIds.split(",");
			$('#' + _this._contenterId).append('<input type="hidden" value="'+checkedValue+'" name="' + _this._options.hiddenName + '" id="' + _this._hiddenId + '"/>');
		}

		//$('<div></div><br /><div> <input type="button" width="81px" value="选择" class="bluebtn" style="width:81px;height:25px; line-height:25px;" /></div><div style="clear:both"></div><div  class="popwindow" style="z-index:998" id="popwindow_'+divId + '"><div class="popwintop"> 				<div class="poptitle">请选择</div> 				<div class="popwinright"> 					<div class="closefenge"></div><a class="daibanright" href="javascript:;" onclick="javascript:$(\'#popwindow_'+divId + '\').hide(500);"></a> </div></div><div class="popwinframe"></div>').appendTo('#' + this._contenterId);
		if(_this._options.css=="0"){		
		  $(' <div style="float:left;">'+addHtmlInfo+'<input type="button" style="min-width:70px;height:25px; line-height:20px;margin-top:3px;width:auto;" class="bluebtn" value="' + _this._options.btnName + '">'+_addHtmlIcon+'</div><div style="clear:both"></div><div id ="choose" class="choice"></div><div style="clear:both"></div><div  class="popwindow" style="z-index:998;position:absolute;width:510px;" id="popwindow_' + divId + '"><div class="popwintop"> 				<div class="poptitle">请选择</div> 				<div class="popwinright"> 					<div class="closefenge"></div><a class="daibanright" href="javascript:;" onclick="javascript:$(\'#popwindow_' + divId + '\').hide(200);"></a> </div></div><div class="popwinframe" style="padding:5px"></div>').appendTo('#' + this._contenterId);		
		  $('#' + divId + ' div:eq(0) :button').bind('click', function() {	  
			  $('[id^=popwindow_]').hide();
			  $('#popwindow_' + divId).show();				 			  
			  return false;//阻止冒泡
		  });		  
		  $('#' +_this._contenterId +' .add_icon').bind('click', function(){
			  if($('.pop_outer').length !=0){
				  $('.pop_outer').remove();
			  }
			  var popEl = '<div class="zhezhaoceng"></div>'+
						  '<div class="pop_outer">'+
							  '<div class="pop_head">'+
								  '<span class="head-msg">'+_this._options.btnName+'</span>'+
								  '<span class="pop_close"></span>'+
							  '</div>'+
							  '<div class="pop_body"><input type="text" style="width: 200px;" maxlength="20"></div>'+
							  '<div class="pop_footer">'+
								  '<input type="button" class="pop_cancel" value="取消">'+
								  '<input type="button" class="pop_confirm" value="确定">'+
							  '</div>'+										
						  '</div>';
			  $('body').append(popEl);
			  $('.pop_outer').on('click', '.pop_confirm', _this._options.okcallback);
			  $('.pop_outer').on('click','.pop_cancel,.pop_close', _this.closepop);
		  });
			if ($('#popwindow_' + divId).children('div.popwinframe').html() == '') {
				$.ajaxSubmit(_this._options.url, {}, function(rtn) {
					if (rtn.success) {
						var datas = rtn.data.list;
						var csSupporterId = rtn.data.csSupporterId;
						
						var hideCs = _this._options.hideCs;
						var tmp = ['<div class="choice_list"><input type="checkbox" name="checkBoxAll" id="checkboxall_' + divId + '"/> <lable id="all">全选</lable></div><div style="clear:both"></div>'];
						for (var i = 0; i < datas.length; i++) {
							var width = 20;
							if(!datas[i].name || !datas[i].name.length){
								width = 20;
							}else if (datas[i].name.length < 7) {
								width = 20;
							} else if (datas[i].name.length >= 7) {
								width = 40;
							}
							var checked = "";
							if($.inArray(datas[i].id,idArr)>=0){
								checked = "checked";
								$('#' + divId + ' .choice').append(_this.getTagHTML(divId, datas[i].id, datas[i].name));
								_this._bindCloseItem();
								$('#' + _this._hiddenId).val(_this.getSelectedTags());
							}
							//置灰按钮
							var isDisabled = "";
							if($.inArray(datas[i].id,grayIdArr)>=0){
								isDisabled = "disabled";
							}
							var item = '<div class="choice_list" style="width:' + width + '%"><input type="checkbox" id="' + divId + datas[i].id + '_cb" name="checkbox_' + divId + '" value="' + datas[i].id + '" '+checked+' '+isDisabled+'/> ' + datas[i].name + '</div>';
							
							if(datas[i].id==999){
								if(!hideCs){//是否隐藏总部
									tmp.push(item);
								}
							}else{
								tmp.push(item);
							}
						}
						tmp.push('<div style="clear:both"></div>');
						$('#popwindow_' + divId).children('div.popwinframe').append(tmp.join(''));
						$('input[name=checkbox_' + divId + ']').bind('click', function(e) {
							e.stopPropagation();//阻止冒泡（及阻止执行弹出框的点击事件）
							var isCheck = $(this).attr('checked') || false;
							if (isCheck) {
								$('#' + divId + ' .choice').append(_this.getTagHTML(divId, $(this).val(), $(this).parent().text()));
								_this._bindCloseItem();
								$('#' + _this._hiddenId).val(_this.getSelectedTags());
								var allsize = $('div.popwinframe').find('input[type="checkbox"]').length-1;//所有checkbox总数
								var checkedsize = $('div.popwinframe').find('input[type="checkbox"]:checked').length;//选中项数
								if(allsize==checkedsize){
									$('input[name="checkBoxAll"]').attr("checked",true);
								}
							} else {
								$('#' + divId + $(this).val()).fadeRemove(function(){
									$('#' + _this._hiddenId).val(_this.getSelectedTags());
								});
								$('input[name="checkBoxAll"]').attr("checked",false);
							}
						});
						$.checkbox_chkAll('checkboxall_' + divId, 'checkbox_' + divId, function(allObj, selObjs) {
							var isCheck = allObj.attr('checked') || false;
							if (isCheck) {
								var extHidenName='';
								if(_this._options.icon && _this._options.icon == 'Y' && _this._options.extHidenId){
									extHidenName=$('#' + _this._options.extHidenId).val();
								}
								$('#' + divId + ' .choice').empty();
								$.each(selObjs, function() {
									if(!$(this).attr("disabled")){//可用
										$('#' + divId + ' .choice').append(_this.getTagHTML(divId, $(this).val(), $(this).parent().text()));
									}else{
										$(this).attr("checked",false);
									}
								});
								if(extHidenName && extHidenName!=''){
									var exdArray=extHidenName.split(',');
									for (i=0;i<exdArray.length ;i++ ){ 
										$('#' + divId + ' .choice').append(_this.getTagHTML(divId, 'addExtendName_'+exdArray[i], exdArray[i]));
									} 
								}
								_this._bindCloseItem();
								$('#' + _this._hiddenId).val(_this.getSelectedTags());
							} else {
								$('#' + divId + ' .choice').empty();
								$('#' + _this._hiddenId).val('');
								if(_this._options.icon && _this._options.icon == 'Y' && _this._options.extHidenId){
									$('#' + _this._options.extHidenId).val('');
								}
							}
						});
					}
				});
			}
		 }
		 else if(_this._options.css=="1"){
			 $(' <div style="float:left;"><input type="button" style="width:auto;height:25px; line-height:20px;margin-top:3px;" class="bluebtn" value="' + _this._options.btnName + '"></div><div style="clear:both"></div><div class="choice"></div><div style="clear:both"></div><div  class="popwindow" style="z-index:998;position:absolute;right:145px;width:510px;" id="popwindow_' + divId + '"><div class="popwintop"><div class="poptitle">请选择</div><div class="popwinright"><div class="closefenge"></div><a class="daibanright" href="javascript:;" onclick="javascript:$(\'#popwindow_' + divId + '\').hide(200);"></a> </div></div><div class="popwinframe" style="padding:5px"></div>').appendTo('#' + this._contenterId);
			 $('#' + divId + ' div:eq(0) :button').bind('click', function() {	
				 if($('#popwindow_' + divId).css("display") != 'none'){				 
					 $('[id^=popwindow_]').hide();
				 }else{
					 $('#popwindow_' + divId).show();
					 $('[id^=popwindow_]').not('#popwindow_' + divId).hide();
				 }					 				  
				 if ($('#popwindow_' + divId).children('div.popwinframe').html() == '') {
						$.ajaxSubmit(_this._options.url, {}, function(rtn) {
							if (rtn.success) {
								var datas = rtn.data.list;
								var csSupporterId = rtn.data.csSupporterId;
								
								var hideCs = _this._options.hideCs;
								var tmp = ['<div class="choice_list"><input type="checkbox" name="checkBoxAll" id="checkboxall_' + divId + '"/> 全选</div><div style="clear:both"></div>'];
								for (var i = 0; i < datas.length; i++) {
									var width = 20;
									if (datas[i].name.length < 7) {
										width = 20;
									} else if (datas[i].name.length >= 7) {
										width = 40;
									}
									var item = '<div class="choice_list" style="width:' + width + '%"><input type="checkbox" id="' + divId + datas[i].id + '_cb" name="checkbox_' + divId + '" value="' + datas[i].id + '"/> ' + datas[i].name + '</div>';
									
									if(datas[i].id==999){
										if(!hideCs){//是否隐藏总部
											tmp.push(item);
										}
									}else{
										tmp.push(item);
									}
								}
								tmp.push('<div style="clear:both"></div>');
								$('#popwindow_' + divId).children('div.popwinframe').append(tmp.join(''));

								$('input[name=checkbox_' + divId + ']').bind('click', function() {
									$("#doctCompanyList").val("");
									$("#doctCompanyIdList").val("");
									$("#doctCompanyList").attr("title",_this.getSelectedTexts());
									$("#doctCompanyList").val(_this.getSelectedTexts());
									$("#doctCompanyIdList").val(_this.getSelectedIds());
								});
								$.checkbox_chkAll('checkboxall_' + divId, 'checkbox_' + divId, function(allObj, selObjs) {
									$("#doctCompanyList").val("");
									$("#doctCompanyIdList").val("");
									$("#doctCompanyList").attr("title",_this.getSelectedTexts());
									$("#doctCompanyList").val(_this.getSelectedTexts());
									$("#doctCompanyIdList").val(_this.getSelectedIds());
									
								});
							}
						});
					}
			 });
		 }
		$(document).bind("click",function(){
			$("#popwindow_" + divId).hide();
		});
		$("#popwindow_" + divId).bind("click",function(e){
			e.stopPropagation();//阻止冒泡
		});
//		  //点击窗口以外，弹出框消失
//		  $(document).not('input.bluebtn').click(function(event){
//			  var target = $(event.target);
//			  var css = target.attr("class");
//			  if(target.closest('#popwindow_' + divId).length==0 && css!='bluebtn'){
//				  $('#popwindow_' + divId).hide();
//			  }
//		  });
		
	}
}
/**
 * 初始化列表，选项为12月份。
 *
 **/
var initMonthSelect = function(id) {
	var s = document.getElementById(id),
		m = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
		size = m.length;
	s.length = 0;
	for (var i = 0; i < size; i++) {
		s.options[s.length] = new Option(m[i] + '月', m[i]);
	}

}
var COOKIE_DOMAIN = 'portal_domain';
var COOKIE_TICKET = 'ticket';
var _DOMAIN = 'admin';
var getDomain = function(){
	var vDomain = getCookie(COOKIE_DOMAIN);
	if(vDomain == null){
		vDomain = _DOMAIN;
	}
	if(vDomain == null || vDomain == undefined){
		vDomain = '';
	}
	return vDomain;
}
/**
 * 根据cookie名字取cookie的值
 */
var getCookie = function (name){
    var start = document.cookie.indexOf( name + "=" );
    var len = start + name.length + 1;
    if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
    	return null;
    }
    if ( start == -1 )
        return null;

    var end = document.cookie.indexOf( ';', len );
    if ( end == -1 )
        end = document.cookie.length;

    return unescape( document.cookie.substring( len, end ));
}
appendExtraParams = function(url){
    var vTicket = getCookie(COOKIE_TICKET);
    var vDomain = getDomain();
    if(vTicket==null) {
        vTicket = "";;
    }
    if(url.indexOf("?")==-1){
        return url+"?ticket="+vTicket+"&domain="+vDomain;
    }else{
        return url+"&ticket="+vTicket+"&domain="+vDomain;
    }
};
/**
 * 对Pluploader附件上传插件按照业务需求做简单封装。
 * @class
 * @example
 * html:
 * 		<div id="uploadFileDiv"></div>
 * js: 
 * 		var pluploaderObj = new PlUploaderObj('uploadFileDiv');
 *		pluploaderObj.init({
 *					'btnName' : '上传文件',
 *				'btnWidth' : '100px',
 *				'hiddenName' : 'product.productGroupId',
 *				'attachTypeId' : 'qm_pro_file',
 *				'max_file_size' : '10M'
 *			});
 **/
var PlUploaderObj = function(contenterId) {
	this._contenterId = contenterId;
	this._uploadUrl = '';
	this._uploadId = 'uploading_' + this._contenterId;
	this._count = 0;
	this._uploadFileBtnId = 'uploadFileBtn';
	this._attachFileIds = [];
	this._add_attachFileIds = [];
	this._del_attachFileIds = [];
	this._attachGroupId = '';
	this._hiddenId = '';
	this._isInit = false;
	this.uploader = null;
	this._options = {
		btnName: '上传附件',
		btnWidth : '',
		max_file_size: '10M',
		max_file: 1,
		mime_types:[],
		addUrl: CONTEXT_PATCH + 'spreq/attachment!add.action',
		mutilAddUrl : CONTEXT_PATCH + 'spreq/attachment!addForMulti.action',
		delUrl: CONTEXT_PATCH + 'spreq/attachment!withdraw.action',
		downloadUrl: CONTEXT_PATCH + 'spreq/attachment!download.action',
		viewUrl: CONTEXT_PATCH + 'spreq/attachment!view.action',
		viewTypeUrl: CONTEXT_PATCH + 'spreq/attachment!viewType.action',
		attachGroupId : '',
		disTheme: 1,
		hiddenName : '', //附件组ID
		hiddenAttachId : '',//附件ID，多个用逗号隔开，多附件该参数不能为空
		hiddenAttr :null,
		uploadFinishedName : '',
		uploadFinishedAttr : {'uploadfinishedflag':'1','datatype':'uploadFinished','uploadfinishedignore':'uploadfinishedignore'},
		attachTypeId:'',
		isView : false,
		isShortView:false,
		initData: []
	};
}
PlUploaderObj.prototype = {
	_disableBrowse: function(flag) { //控制上传按钮启用/禁用以及按钮样式
		var _this = this;
		_this.uploader.disableBrowse(flag);
		if (flag) {
			$('#' + _this._uploadFileBtnId).removeClass('bluebtn').addClass('graybtn');
		} else {
			$('#' + _this._uploadFileBtnId).removeClass('graybtn').addClass('bluebtn');
		}
	},
	_checkMaxSize: function() { //检查是否上传的附件总数已达到最大
		var _this = this;
		if (!_this.getSucc()){
			$('#' + _this._uploadFileBtnId).parent().show();
			//document.getElementById(_this._uploadFileBtnId).style.display = 'inline';
			//$('#' + _this._uploadFileBtnId).parent().show();
			//_this._disableBrowse(false);
			//if (!_this._isInit){
				if (_this.uploader){
				_this.uploader.destroy();
				}
				_this._initPlUpload();
				//_this._isInit = true;
			//}
			return;
		}
		if (_this.getSucc().split(',').length < _this._options.max_file) {
			$('#' + _this._uploadFileBtnId).parent().show();
			//document.getElementById(_this._uploadFileBtnId).style.display = 'inline';
			//if (!_this._isInit){
				if (_this.uploader){
					_this.uploader.destroy();
				}
				_this._initPlUpload();
			//	_this._isInit = true;
			//}
			//$('#' + _this._uploadFileBtnId).parent().show();
			//_this._disableBrowse(false);
		} else {
			//document.getElementById(_this._uploadFileBtnId).style.display = 'none';
			$('#' + _this._uploadFileBtnId).parent().hide();
			//_this._isInit = false;
			//$('#' + _this._uploadFileBtnId).parent().hide();
			//_this._disableBrowse(true);
		}
		
	},
	_bindCloseItemEvent: function() { //绑定上传的附件关闭事件
		var _this = this;
		$('#' + this._contenterId + ' .uploading').find('.closeitem').unbind().bind("click",function() {
			//_this.uploader.trigger('CancelUpload');
			var o = $(this).parent('div');
			if (o.attr('attachfileid')){
				$.ajaxSubmit(_this._options.delUrl,{'attachFileId':o.attr('attachfileid')},function(_data){
					if (_data && _data.success){
						_this._del_attachFileIds.push(o.attr('attachfileid'));
						o.fadeOut(500, function() {
							o.remove();
							_this._checkMaxSize();
							_this._initHiddenName();
						});
					}
				});
			}else{
				o.fadeOut(500, function() {
					o.remove();
					_this._checkMaxSize();
					_this._initHiddenName();
				});
			}
			//_this.uploader.refresh();
			//$(this).parent('div').parent('div').remove();
		});
	},
	_changeParam: function(url, name, value) {
		var newUrl = "";
		var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
		var tmp = name + "=" + value;
		if (url.match(reg) != null) {
			newUrl = url.replace(eval(reg), tmp);
		} else {
			if (url.match("[\?]")) {
				newUrl = url + "&" + tmp;
			} else {
				newUrl = url + "?" + tmp;
			}
		}
		return newUrl;
	},
	_initDatas: function() { //初始化已上传的附件信息
		var _this = this;
		var _options = _this._options;
		_options.initData = _options.initData || [];
			if (_options.initData.length > 0){
				for (var i = 0; i < _options.initData.length; i++) {
						if (!_options.initData[i] || _options.initData[i] == null || !_options.initData[i].fileId)continue;
						$('#' + _this._contenterId).attr('attachGroupId', _options.initData[i].groupId);
						if (_options.disTheme == 2) {
							$('#' + _this._contenterId).append('<div class="uploading" attachfileid="' + _options.initData[i].fileId + '" style="width:100px;height:100px;"><div class="uploadcontent" style="height:18px;"><img style="width:100px;height:100px;" src="' + appendExtraParams(_options.viewUrl + '?attachFileId=' + _options.initData[i].fileId) + '"/></div>' + (!_this._options.isView ? '<div  class="closeitem"><iframe name="excel" frameborder=0 height=0 width=0></iframe>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;">&nbsp;</a>':'') + ' </div></div>');
						} else {
							$('#' + _this._contenterId).append('<div class="uploading" attachfileid="' + _options.initData[i].fileId + '"><div class="uploadcontent" style="height:18px;"><div class="uploadfile"><iframe name="excel" frameborder=0 height=0 width=0></iframe>&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+appendExtraParams(_this._options.downloadUrl + "?attachFileId=" + _options.initData[i].fileId) + '" target="excel" title="' + _options.initData[i].fileName + '">' + _options.initData[i].fileName + '</a>&nbsp;&nbsp;</div></div>'+(!_this._options.isView ? '<div  class="closeitem"> <a href="javascript:;">&nbsp;</a>':'') + '</div></div>');
						}
				 }
				_this._initHiddenName();
				_this._bindCloseItemEvent();
		}
		_this._checkMaxSize();
	},
	_initHiddenName : function(){
		/*var name = this._options.hiddenName ? this._options.hiddenName : '';
		var id = 'hidden_' + this._contenterId;
		if (!document.getElementById(id)){
			this._hiddenId = id;
			$('#' + this._uploadFileBtnId).parent().append('<input type="hidden" '+ (this._options.hiddenName ? 'name="' + this._options.hiddenName + '"' : '') +' id="' + id + '"/>');
			if (this._options.hiddenAttr){
				for (var obj in this._options.hiddenAttr){
					$('#' + id).attr(obj,this._options.hiddenAttr[obj]);
			   }
			}
			
		}*/
		if (this._options.max_file > 1){
			$('#' + this._hiddenId).val(this.getSucc());	
			$('#' + this._attachGroupId).val(this.getGroupId());
		}else{
			if (this.getSucc()){
				$('#' + this._hiddenId).val(this.getGroupId());	
			}else{
				$('#' + this._hiddenId).val('');	
				$('#' + this._hiddenId).trigger('blur');
			}
		}
		
		/**if(this._options.max_file == 1){
			$('#' + id).val(this.getGroupId());	
		}else{
			$('#' + id).val(this.getGroupId() + "|" + this.getSucc());	
		}**/
		$('#' + this._contenterId).attr('attachFiles',this.getAttachFiles());
		
	},
	_addAttacheTypeParam:function(){
		var params = "attachTypeId="+this._options.attachTypeId;
		if (this._options.max_file > 1){
			params += '&attachGroupId=' + this.getGroupId() + '&attachFileIds=' + this.getSucc();
			this._uploadUrl = this._options.mutilAddUrl;
		}else{
			this._uploadUrl = this._options.addUrl;
		}
		if(this._options.addUrl.indexOf("?") == -1){
	        this._uploadUrl += "?" + params;
	    }else{
	    	this._uploadUrl += "&" + params;
	    }
	},
	_initPlUpload : function(){
		var _this = this;
		_this._addAttacheTypeParam();//byhaomingli
		_this.uploader = new plupload.Uploader({
			runtimes: 'gears,html5,flash,silverlight,html4',
			browse_button: _this._uploadFileBtnId, // you can pass in id...
			container: _this._contenterId, // ... or DOM Element itself
			url: _this._uploadUrl,
			multi_selection: false,
			chunk_size: '1mb',
			max_retries:0,
			//multipart:true,
			flash_swf_url: 'js/plupload/Moxie.swf',
			silverlight_xap_url:'js/plupload/Moxie.xap',
			filters:{max_file_size: _this._options.max_file_size,mime_types: _this._options.mime_types},
			file_data_name:'attachment',
			headers : {'attachTypeId':_this._options.attachTypeId},
			init: {
			PostInit: function() {

			},
			FilesAdded: function(up, files) {
				$('#' + _this._uploadFileBtnId).parent().hide();
				//document.getElementById(_this._uploadFileBtnId).style.display = 'none';
				plupload.each(files, function(file) {
					//$('#' + _this._contenterId).append('<div class="uploading"><div><div class="uploadfile"><a href="javascript:;" target="_blank">' + file.name + ' (' + plupload.formatSize(file.size) + ')</a></div><span class="red">0%</span></div><div class="uploadbar"  style="width:0%"></div><div class="closeitem"> <a href="javascript:;"></a> </div></div>');
					$('#' + _this._contenterId).append('<div class="uploading"> <div class="uploadcontent"> <div class="uploadfile"><iframe name="excel" frameborder=0 height=0 width=0></iframe>&nbsp;&nbsp;&nbsp;&nbsp;<a target="excel" href="javascript:;" title="' + file.name + '">' + file.name + '</a>&nbsp;&nbsp;</div>           <div class="red uploadpercent">0%</div></br><div class="uploadbarbox"><div style="width: 0%;" class="uploadbar"></div></div>                         </div> <div class="closeitem"> <a href="javascript:;">&nbsp;</a> </div></div>');
					//$('.uploading:last').attr('attachFileId', file.name);
				});
				
				/**if ($('#' + _this._contenterId).attr('attachGroupId')) {
					_this.uploader.settings.url = _this._changeParam(_this.uploader.settings.url, 'attachGroupId', $('#' + _this._contenterId).attr('attachGroupId'));
				}**/
				_this._bindCloseItemEvent();
				//up.refresh(); 
				//$('#uploadFileBtn').hide();
				//$('#uploadFileBtn2').show();
				up.refresh();
				_this.uploader.disableBrowse(true);
				_this.uploader.start();
			},
			 BeforeUpload : function(up, file){
				 //$('#' + _this._contenterId + ' .uploading .uploadcontent .uploadpercent:last').width($('#' + _this._contenterId + ' .uploading .uploadcontent .uploadpercent:last').width());
				 //$('#' + _this._contenterId + ' .uploading .uploadcontent .uploadbarbox:last').width($('#' + _this._contenterId + ' .uploading .uploadcontent:last').width());
				 var uploadFinishedId = 'hidden_uploadFinishedId_' + _this._contenterId;
				 $('#'+uploadFinishedId).attr("uploadfinishedflag","0");
				 //添加额外参数 ，支持分块传输,by haomingli
		  	  	 if(up.settings.multipart_params == undefined){
		  	  	  	up.settings.multipart_params = {fileId:file.id }
		  	  	 }
			 },
			
			UploadProgress: function(up, file) {				
				$('#' + _this._contenterId + ' .uploading .uploadcontent .uploadpercent:last').html(file.percent - 1 + '%');
				$('#' + _this._contenterId + ' .uploading .uploadcontent .uploadbarbox .uploadbar:last').width(file.percent + '%');
			},
			UploadComplete: function(up, file) {
				//
			},
			FileUploaded: function(up, file, res) {
			 var result = {'success':false};
			 if (res.response){
				try{
					result = eval(("(" + res.response + ")"));
				}catch(err){
					result = {'success':false,'data':{'msg':'发生未知错误'}};
				}
			 }
			if (result.success){
				_this._add_attachFileIds.push(result.attachFileId);
				$('#' + _this._contenterId + ' .uploading .uploadcontent .uploadpercent:last').remove();
				$('#' + _this._contenterId + ' .uploading .uploadcontent .uploadbarbox:last').remove();
				if (_this._options.disTheme == 2) {
					$('#' + _this._contenterId + ' .uploading .uploadcontent:last').remove();
					$('#' + _this._contenterId + ' .uploading:last').css('width', '100px').css('height', '100px').append('<img width="100px" height="100px" src="'+appendExtraParams(_this._options.viewUrl + "?attachFileId=" + result.attachFileId) + '"/>');
				}else{
					$('#' + _this._contenterId + ' .uploading .uploadcontent .uploadfile a:last').attr('href',appendExtraParams(_this._options.downloadUrl + "?attachFileId=" + result.attachFileId));
				}
				$('#' + _this._contenterId + ' .uploading:last').attr('attachfileid', result.attachFileId);
				$('#' + _this._contenterId).attr('attachGroupId', result.attachGroupId);
				//$('#h_' + this._contenterId).val(result.attachGroupId + "|");
				_this._initHiddenName();
				
				//上传成功后修改高度
				$('#' + _this._contenterId +' .uploadcontent').css("height","18px");
				//显示短文件名
				if(_this._options.isShortView){
					$('div.uploading').css("width","150px");
					$('div.uploadfile').css("max-width","140px").css("overflow","hidden");
				}
			}else{
				alert(result.data.msg);
				//$('#' + _this._contenterId +' .uploading:last').remove();
				//$('#' + _this._contenterId +' .uploading:last').append('<div style="float:bottom"><a href="javascript:void(0)">续传</a> </div>');
			}
			
				//$('#uploadFileBtn2').hide();
			//$('#uploadFileBtn').show();
			//_this.uploader.init();
			//$('#uploadFileBtn').removeClass('graybtn').addClass('bluebtn');
			up.refresh();
			_this._bindCloseItemEvent();
			//_this._disableBrowse(false);
			_this._checkMaxSize();
			$('#' + _this._hiddenId).trigger('blur');
			if (_this.uploader)_this.uploader.disableBrowse(false);
			
			},
			ChunkUploaded:function(up, file, res){//分块文件每块上传后回调
				result = {'success':false,'data':{'msg':'未知错误'}};
				if (res.response){
					try{
						result = eval(("(" + res.response + ")"));					
					}catch(err){
						result = {'success':false,'data':{'msg':'发生未知错误'}};
					}
				}
				if(result.success == false){//上传失败
					//继续上传 to
					alert(result.data.msg);
		  	  	    $('#' + _this._contenterId +' .uploading:last').remove();
		  	  	  	up.refresh();
		  	  	  	_this._checkMaxSize();
		  	  	  	if (_this.uploader)_this.uploader.disableBrowse(false);
				}
			},
			Error: function(up, err) {
				 if(err.message.indexOf("HTTP")>-1){
					 alert("附件上传失败，请检查网络是否通畅！");
					 $('#' + _this._contenterId +' .uploading:last').append('<div style="float:bottom;margin-top:14px;"><a class="keepUpload" href="javascript:void(0)">续传</a> </div>');
				 }else{
					 alert(err.message);
				 }
				 //$('#' + _this._contenterId +' .uploading:last').append('<div style="float:bottom;margin-top:14px;"><a class="keepUpload" href="javascript:void(0)">续传</a> </div>');
				 $('#' + _this._contenterId +' .uploading .keepUpload').click(function(){
					 err.file.status = plupload.UPLOADING;
					 up.state= plupload.UPLOADING;
					 $('#' + _this._contenterId +' .uploading .keepUpload').remove();
					 _this.uploader.trigger("UploadFile", err.file);
				 });
				 if (_this.uploader)_this.uploader.disableBrowse(false);
			}
		  }
		});
		_this.uploader.init();
	},
	_init : function(){
		var _this = this;
		_this._uploadFileBtnId = 'uploadBtn_' + _this._contenterId;
		//var name = _this._options.hiddenName ? _this._options.hiddenName : '';
		_this._hiddenId  = 'hidden_' + _this._contenterId;
		_this._attachGroupId = 'hidden_groupid_' + _this._contenterId;
		$('#' + _this._contenterId).empty();
		$('#' + _this._contenterId).append('<div><input type="button" id="' + _this._uploadFileBtnId + '" value="' + _this._options.btnName + '(最大'+this._options.max_file_size+')" class="bluebtn uploadBtnIe7" '+(_this._options.btnWidth?'style="width:'+_this._options.btnWidth+'"':'')+'/></div>');
		if (_this._options.max_file > 1){
			$('#' + _this._contenterId).append('<input type="hidden" '+ (_this._options.hiddenAttachId ? 'name="' + _this._options.hiddenAttachId + '"' : '') +' id="' + _this._hiddenId  + '"/><input type="hidden" '+ (_this._options.hiddenName ? 'name="' + _this._options.hiddenName + '"' : '') +' id="' + _this._attachGroupId  + '"/>');
		}else{
			$('#' + _this._contenterId).append('<input type="hidden" '+ (_this._options.hiddenName ? 'name="' + _this._options.hiddenName + '"' : '') +' id="' + _this._hiddenId  + '"/>');
		}
		if (_this._options.hiddenAttr){
			for (var obj in this._options.hiddenAttr){
				$('#' + _this._hiddenId).attr(obj,this._options.hiddenAttr[obj]);
			 }
		}
		if(_this._options.attachTypeId){
			//根据配置修改按钮显示最大附件大小
			$.ajaxSubmit("qm/qmFindAttachSizeLimit.action",{attachTypeId:_this._options.attachTypeId},function(rtn){
				if(rtn.success){
					var limitSize = rtn.data.limitSize;
					var btnName = _this._options.btnName;
					var name = btnName;
					if(btnName.indexOf("（")>0){
						var name = btnName.split("（")[0];
					}
					if(btnName.indexOf("(")>0){
						var name = btnName.split("(")[0];
					}
					if(name!='' && (btnName.indexOf("（")>0 || btnName.indexOf("(")>0)){
						$('input#'+_this._uploadFileBtnId).val(name+"（最大"+limitSize+"M）");
					}
				}
			});
		}
		//$('<div style="float:left;"><a id="' + _this._uploadFileBtnId + '" class="bluebtn">' + _this._options.btnName + '<a></div>').appendTo('#' + _this._contenterId);
	    _this._initDatas();
	},
	init: function(ops) {
		var _this = this;
		if (typeof ops == 'object') {
			$.extend(_this._options, ops);
		}
		if (_this._options.attachTypeId){
				$.ajaxSubmit(_this._options.viewTypeUrl,{attachTypeId:_this._options.attachTypeId},function(rtn){
					var _config = {};
					if (rtn && rtn.success && rtn.data){
						var _data = rtn.data;
						var _single_limit_size = _data.singleLimitSize/1024;
						if(_single_limit_size < 1024){
							_single_limit_size = _single_limit_size + 'K';
						}else{
							_single_limit_size =  _single_limit_size/1024 + 'M';
						}
						_config = {
								max_file_size:(_single_limit_size),
								max_file:_data.limitCount
						};
						if (_data.limitSuffix){
							var _suffix = _data.limitSuffix.replaceAll(';',',');
							$.extend(_config, {mime_types : [{
								title : _suffix,
								extensions : _suffix
							}]});
						}
					}
					$.extend(_this._options, _config);
					_this._init();
				});
		}else{
			_this._init();
		}
	},
	getGroupId: function() {
		return $('#' + this._contenterId).attr('attachGroupId')?$('#' + this._contenterId).attr('attachGroupId'):'';
	},
	getAddAttachFileIds : function(){
		return this._add_attachFileIds.join(',');
	},
	getDelAttachFileIds : function(){
		return this._del_attachFileIds.join(',');
	},
	getAttachFiles: function() {
		var succ = [];
		$('#' + this._contenterId + ' .uploading').each(function(i) {
			if ($(this).attr('attachfileid')) {
				succ.push($(this).attr('attachfileid') + "|" + $(this).find('.uploadfile a').text());
			}
		})
		return succ.join(',');
	},
	getSucc: function() {
		var succ = [];
		$('#' + this._contenterId + ' .uploading').each(function(i) {
			if ($(this).attr('attachfileid')) {
				succ.push($(this).attr('attachfileid'));
			}
		})
		return succ.join(',');
	}

}
/**
 * 为url组装指定参数
 */
function addUrlParam(url, name, value) {
		var newUrl = "";
		if(!url){
			return newUrl;
		}
		var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
		var tmp = name + "=" + value;
		if (url.match(reg) != null) {
			newUrl = url.replace(eval(reg), tmp);
		} else {
			if (url.match("[\?]")) {
				newUrl = url + "&" + tmp;
			} else {
				newUrl = url + "?" + tmp;
			}
		}
		return newUrl;
	}
/**
 * Validform初始化默认配置
 * 
 */
var getValidformDefaultConfig = function(config) {
	var _default = {
		tiptype: 3,
		ajaxPost: false,
		showAllError:true,
		//dragonfly:true,
		datatype: { //传入自定义datatype类型，可以是正则，也可以是函数（函数内会传入一个参数）;
			"zh1-6" : /^[\u4E00-\u9FA5\uf900-\ufa2d]{1,6}$/,
			"zh1-25" : /^[\u4E00-\u9FA5\uf900-\ufa2d]{1,25}$/,
			"s1-6":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{1,6}$/,
			//"cm_mobile":/^(13[4-9]|15[0-2]|15[7-9]|182|18[7-8]|147)\d{8}$/,
			"cm_mobile" : function(gets, obj, curform, regxp){
				if (!gets) {
					return false;
				}
				var mobile = null;
				$.ajax({  
			        type:'GET',  
			        url:'qm/qmConfigValue.action',  
			        data:{'configName':'QM_VALID_CM_MOBILE'}, 
			        dataType:'json',  
			        cache : false,  
			        async : false,  
			        success:function(data){ 
			        	var configValue = data.data.configValue;
			        	if(configValue!=null && configValue!=''){
			        		mobile = eval(data.data.configValue);
			        	}
			        },  
			        error : function(error) {  
			        	mobile = null;
			        }  
			    });
				if(mobile==null){
					return "读取配置出错";
				}
				if(!mobile.test(gets)){
					return false;
				}
				return true;
	        },
			"email" : function(gets, obj, curform, regxp) {
				if (!gets) {
					return false;
				}
				var email = /^(-|\.|\w)+\@((-|\w)+\.)+[A-Za-z]{2,}$/;
				if(email.test(gets)){
					if(gets.length > 64){
						return "邮件地址长度不能超过64个字符";
					}
				}else{
					return "邮箱地址格式不对";
				}
				return true;
			},
			"s1-100":function(gets, obj, curform, regxp){
				if (!gets) {
					return false;
				}
				var sl00 = /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{1,100}$/;
				if(!sl00.test(gets)){
					return "请输入100字符以内的中文或英文";
				}
				return true;
			},
			"s10-4000":function(gets, obj, curform, regxp){
				if (!gets) {
					return false;
				}
				var len = 0,_len = 4000;
				if (gets){
					len = gets.replace(/[^\x00-\xff]/g, '..').length;
				}
				if (len < 20 || len > _len){
					return false;
				}
				return true;
			},
			"validateMaxLength" :function(gets, obj, curform, regxp) {
				if (!gets) {
					return false;
				}
				var len = 0,_len = obj.attr('maxlength');
				if (gets){
					//把换行和中文替换成..
					len = obj.val().replace(/\r|\n|(\r\n)|[^\x00-\xff]/g, '..').length;
				}
				if (_len && len > _len){
					return '长度不能超过' + _len + '个字符或'+ _len/2 + '个汉字';
				}
				return true;
			},
			"startTimeValid": function(gets, obj, curform, regxp) {
				//参数gets是获取到的表单元素值，obj为当前表单元素，curform为当前验证的表单，regxp为内置的一些正则表达式的引用;
				if (!gets) {
					return false;
				}
				var from = obj,
					to = $('#' + obj.attr('endtimeflag'));
				if (from.val() != '' && to.val() != '' && !isEndTimeGtStartTime(from.val(), to.val())) {
					return false;
				}
				return true;
				//注意return可以返回true 或 false 或 字符串文字，true表示验证通过，返回字符串表示验证失败，字符串作为错误提示显示，返回false则用errmsg或默认的错误提示;
			},
			"endTimeValid": function(gets, obj, curform, regxp) {
				//参数gets是获取到的表单元素值，obj为当前表单元素，curform为当前验证的表单，regxp为内置的一些正则表达式的引用;
				if (!gets) {
					return false;
				}
				var st = obj.attr('starttimeflag');
				if (st) {
					var from = $('#' + st),
						to = obj;
					if (from.val() != '' && to.val() != '' && !isEndTimeGtStartTime(from.val(), to.val())) {
						return false;
					}
				}
				return true;
				//注意return可以返回true 或 false 或 字符串文字，true表示验证通过，返回字符串表示验证失败，字符串作为错误提示显示，返回false则用errmsg或默认的错误提示;
			},
			"endTimeValid2": function(gets, obj, curform, regxp) {
				//参数gets是获取到的表单元素值，obj为当前表单元素，curform为当前验证的表单，regxp为内置的一些正则表达式的引用;
				if (!gets) {
					return false;
				}
				var st = obj.attr('starttimeflag');
				if (st) {
					var from = $('#' + st),
						to = obj;
					if (!from.val()){
						return '开始时间不能为空';
					}
					if (from.val() != '' && to.val() != '' && !isEndTimeGtStartTime(from.val(), to.val())) {
						return false;
					}
				}
				return true;
				//注意return可以返回true 或 false 或 字符串文字，true表示验证通过，返回字符串表示验证失败，字符串作为错误提示显示，返回false则用errmsg或默认的错误提示;
			},
			"endTimeValid3": function(gets, obj, curform, regxp) {
				//参数gets是获取到的表单元素值，obj为当前表单元素，curform为当前验证的表单，regxp为内置的一些正则表达式的引用;
				if (!gets) {
					return false;
				}
				var st = obj.attr('starttimeflag');
				if (st) {
					var from = $('#' + st),
						to = obj;
					
					if (from.val() != '' && to.val() != '' && !isEndTimeGtStartTime(from.val(), to.val())) {
						return false;
					}
				}
				return true;
				//注意return可以返回true 或 false 或 字符串文字，true表示验证通过，返回字符串表示验证失败，字符串作为错误提示显示，返回false则用errmsg或默认的错误提示;
			},
			"validProductName": function(gets, obj, curform, regxp) {
				//参数gets是获取到的表单元素值，obj为当前表单元素，curform为当前验证的表单，regxp为内置的一些正则表达式的引用;
				if (obj.attr('pid') && obj.attr('pid') != '') {
					return true;
				}
				return false;
			},
			"validReportScore":function(gets, obj, curform, regxp){
				//月报审核打分校验，需根据审核结果来定，同意则打分，不同意不打分
				var opn = obj.attr("refer");
				if(opn=='201'){
					if(!gets){
						return false;
					}
				}
			},
			"validReplyLimitDate":function(gets, obj, curform, regxp){
				//公告截止回复时间校验
				var opn = obj.attr("refer");
				if(opn=='Y'){
					if(!gets){
						return false;
					}
				}
			},
			"checkMonthValid": function(gets, obj, curform, regxp) {
				//参数gets是获取到的表单元素值，obj为当前表单元素，curform为当前验证的表单，regxp为内置的一些正则表达式的引用;
				if (!gets) {
					return false;
				}
				var date = new Date();
				var year = date.getFullYear();
				var mon = date.getMonth()+1;
				var mstr = mon;
				if(mon<10){
					mstr = "0"+mon;
				}
				var vle = year+mstr;
				if(parseInt(gets)>parseInt(vle)){
					return false;
				}
				return true;
			},
			"checkNumber": function(gets, obj, curform, regxp){
				if (!gets) {
					return false;
				}
				var pattern=/^(([0-9]\d*(\.\d?[0-9])?)|(0\.[1-9][0-9])|(0\.[0][1-9]))$/;
				var len = 0;
				var maxNum = parseInt(obj.attr('maxNum'));
				var minNum = parseInt(obj.attr('minNum'));
				if(!pattern.test(gets)){
					if(!isNaN(parseInt(minNum))){
						return "请输入"+ minNum + "到" + maxNum +"的数字，最多保留2位小数";
					}else{
						return "请输入不超过"+ maxNum +"的分数，最多保留2位小数";
					}					
				}else{
					if(!isNaN(parseInt(minNum))){
						if(gets < minNum || gets > maxNum){
							return "请输入"+ minNum + "到" + maxNum +"的数字，最多保留2位小数";
						}
					}else{
						if(gets < 0.01 || gets > maxNum){
							return "请输入不超过"+ maxNum +"的分数，最多保留2位小数";
						}
					}					
				}
				return true;
			},
			"checkDecimal":function(gets, obj, curform, regxp){
				if (!gets) {
					return false;
				}
				var dn = parseInt(obj.attr('dn'));
				var pattern=/^\d+(.[0-9]{0,9})?$/;
				if(!pattern.test(gets)){
					return "请输入正确数字";
				}else{
					if(gets.indexOf(".")>0){
						var aft = gets.split(".")[1];
						if(aft.length>parseInt(dn)){
							return "最多保留"+dn+"位小数";
						}
					}
				}
				return true;
			},
			"checkProductManager":function(gets, obj, curform, regxp){
				//检查产品在支撑公司是否配置产品经理
				if (!gets) {
					return false;
				}
				var ignore = obj.attr("ignore");
				var errormsg = obj.attr("errormsg");
				var supporterType = getParamter("supporterType");
				if(supporterType==null || supporterType==''){
					supporterType = getParamter("roleType");
				}
				
				if(ignore=='ignore'){
					return true;
				}
				var count = 0;
				$.ajax({  
			        type:'GET',  
			        url:'qm/product/product!countProductManager.action',  
			        data:{'subProduct.productId':gets,'supporterType':supporterType}, 
			        dataType:'json',  
			        cache : false,  
			        async : false,  
			        success:function(data){  
			        	count = data.data.count;//产品经理数量
			        },  
			        error : function(error) {  
			        	count = -1;
			        }  
			    });
				if(count<=0){
					return errormsg;
				}
				return true;
			},
			"checkInputNum":function(gets, obj, curform, regxp){
				if (!gets) {
					return false;
				}
				var maxNum = obj.attr("maxNum");
				if(maxNum==''){
					maxNum = "10";
				}
				var pattern=/^\d{1,}$/;
				if(!pattern.test(gets)){
					return "请输入数字";
				}
				if(parseInt(gets)>parseInt(maxNum)){
					return "请输入不大于"+maxNum+"的数字";
				}
				return true;
			}
		}
	}
	return typeof config == 'object' ? $.extend(_default, config) : _default;
}
function isSupportPlaceholder(){
	return 'placeholder' in document.createElement('input') && !window.navigator.userAgent.indexOf("MSIE")>=1;
}
var clearPlaceholder = function(){
	if (isSupportPlaceholder())return;
	$("textarea, input[type='text']").each(function(index, element){
		$(element).trigger("parentformsubmitted");
	});
}
var clearPlaceholderStyle = function(){
	if (isSupportPlaceholder())return;
	$("textarea, input[type='text']").each(function(index, element){
		$(element).trigger("clearStyle");
	});
}
/**
 * 字符串转换为字节，中文转换为2个字符
 * @param str 转换的字符串
 * @returns {Number} 转换后的字符串
 */
function getCharLength(str){
	var len = 0;
	if(str!=''){
		for(var i=0;i<str.length;i++){
			var tmp = str.substring(i,i+1);
			if (tmp.match(/[\u4e00-\u9fa5]/g) != null){
				len+=2;
			}else{
				len+=1;
			}
		}
	}
	return len;
}
/**
 * 校验字符串长度是否超过指定长度，中文算2个字节
 * @param desc 要校验的字符串
 * @param maxlength 长度
 * @returns {Boolean} 如果超过返回true,否则返回false
 */
function validateLength(desc,maxlength){
	if(getCharLength(desc) > maxlength){
		return false ;
	}
	return true;
}	

/**
 * Validform开启ignore属性,跳过校验
 * @function
 * @param form form表单ID
 * @param flag true/false
 */
var enableFormIgnore = function(form,flag){
	$('#' + form + ' input[nullmsg],#' + form + ' select[nullmsg],#' + form + ' textarea[nullmsg]').each(function(i){
		if ($(this).attr('ignore') && $(this).attr('ignore') == 'no'){
		}else{
			if (flag){
				$(this).attr('ignore','ignore');
			}else{
				$(this).attr('ignore','_ignore');
			}
		}

	});
}
/**
 * 页面加载完后，需要初始化的东东
 */
$(document).ready(function(){
	//$("select").select2();
	//不使用jqueryui的日期插件
	/*$.datepicker.setDefaults({
	  changeYear: true,
	  changeMonth: true,
      showButtonPanel: true,
      closeText: '清除',
      onChangeMonthYear:function(year, month, inst){
		setTimeout(function(){$(".ui-datepicker-close").unbind().bind("click", function (){ 
			inst['input'].val('');
             //$(input).val(''); 
             return false;
        });},500);  
      },
      beforeShow: function(input,inst) {
		setTimeout(function(){
			$('#ui-datepicker-div').css("z-index", 9998);//解决被菜单挡到的问题
			$(".ui-datepicker-close").unbind().bind("click", function (){ 
			inst['input'].val('');
             //$(input).val(''); 
             return false;
        });},500);  
      }  
   }); */
	//try{
	//	$( document ).tooltip();
	//	$('a[name="attachFileTip"]').attr('title','上传的附件只支持:图片文件(jpg,jpeg,gif),Word文件(doc,docx),Pdf文件(pdf),Rar文件(zip,rar),Excel文件(xls,xlsx),PowerPoint文件(ppt,pptx)。');
	//	$('a[name="attachFileTip"]').tooltip();
	//}catch(err){}
});
/**
 * 项目里签权校验函数
 * @param callback 校验完后回调函数
 * @example
 * 比如:
 * 	删除按钮做签权
 * html:
 * 		<input type="button" resourceKey="menu_admin_qualitymanage_demand_base_documentInfo&menu_admin_qualitymanage_demand_documentInfo&menu_admin_qualitymanage_demand_documentInfo&menu_admin_qualitymanage_demand_base_documentInfo_202" operationKey="DELETE&DELETE&DELETE&DELETE" value="删除"/>
 * js:
 * 		validateAuth();
 */
function validateAuth(callback){
	var resourceKeyAndOperationKeys = [];
	$('[resourceKey]').each(function(i){
		if ($(this).attr('resourceKey') && $(this).attr('operationKey')){
			if (!$(this).attr('authId')){
				var _id = $(this).attr('resourceKey') + "_" + $(this).attr('operationKey') + "_" + (new Date()).getTime();
				$(this).attr('authId',_id);
			}
			resourceKeyAndOperationKeys.push($(this).attr('authId') + "," + $(this).attr('resourceKey') + "," + $(this).attr('operationKey'));
		}
	});
	if (resourceKeyAndOperationKeys.length > 0){
		$.ajaxSubmit('qm/common/auth.action', {'resourceKeyAndOperationKeys' : resourceKeyAndOperationKeys.join(';')}, function(rtn) {
			if (rtn && rtn.success && rtn.data && rtn.data.value){
				var result = rtn.data.value;
				var arr = result.split(';');
				for (var i = 0;i < arr.length;i++){
					var strs = arr[i].split(',');
					if (strs.length == 2){
						if (strs[1] == 'true'){
							$('[authId="' + strs[0]+'"]').show();
						}else{
							$('[authId="' + strs[0]+'"]').hide();
						}
					}
				}
				if (typeof(callback) == 'function'){
					callback(result);
				}
			}
			
		});
	}
}
/**
 * 获取url参数值，模糊匹配参数，
 * @param n 为参数名
 **/
function getParam(n) {
	var hrefstr, pos, parastr, para, tempstr;
	hrefstr = window.location.href;
	pos = hrefstr.indexOf("?");
	parastr = hrefstr.substring(pos + 1);
	para = parastr.split("&");
	tempstr = "";
	for (var i = 0; i < para.length; i++) {
		tempstr = para[i];
		pos = tempstr.indexOf("=");
		if (tempstr.substring(0, pos).toLowerCase().indexOf(n.toLowerCase()) != -1) {
			var tmp = {};
			tmp[tempstr.substring(0, pos)] = tempstr.substring(pos + 1);
			return tmp;
		}
	}
	return '';
}

//ajax请求添加默认参数开始
try{
	var params = ['roleType','simsType','supporterType','flowType','systemKey'],len = params.length,_defaultPamrams = {};
	for (var i = 0;i < len;i++){
		var tmp = getParam(params[i]);
		if (tmp){
			$.extend(_defaultPamrams, tmp);
		}
	}
	$.extend({
		ajaxDefaultParams:_defaultPamrams
	});
	
	//扩展或重设提示信息
	var tipmsg={//默认提示文字;
			tit:"提示信息",
			w:{
				"*":"不能为空！",
				"*6-16":"请填写6到16位任意字符！",
				"n":"请填写数字！",
				"n6-16":"请填写6到20位数字！",
				"s":"不能输入特殊字符！",
				"s6-18":"请填写6到18位字符！",
				"p":"请填写邮政编码！",
				"m":"请填写手机号码！",
				"e":"邮箱地址格式不对！",
				"url":"请填写网址！",
				"ulogin":"帐号名已存在"
			},
			def:"请填写正确信息！",
			undef:"datatype未定义！",
			reck:"两次输入的内容不一致！",
			r:" ",
			c:"正在检测信息…",
			s:"请{填写|选择}{0|信息}！",
			v:"所填信息没有经过验证，请稍后…",
			p:"正在提交数据…"
		}
	$.extend(true,$.Tipmsg, tipmsg);
}catch(err){
	//alert(err);
}
function addDefaultParamToUrl(url){
	var _params = $.ajaxDefaultParams || {};
	for (var obj in _params){
		url = addUrlParam(url,obj,_params[obj]);
	}
	return url;
}
/**
 * 为a标签添加项目默认要带的参数
 * @param obj
 */
function appendParams(obj){
	var href = $(obj).attr('href');
	if (!href || href.indexOf('javascript') != -1){
		return;
	}
	//var p = $.param(($.ajaxDefaultParams || {}));
	//href = href.indexOf('?') == -1 ?href + '?' + p :href + '&' + p;
	href = addDefaultParamToUrl(href);
	$(obj).attr('href',href);
}
/**
 * 页面跳转，解决JS中获取不到base标签href的问题
 * @param url 请求的url
 * @param isBlank 是否新开窗口,true为新开，false或不传为当前页打开
 */
function linkTo(url,isBlank) {
	var href = url;
	//IE11的edge模式在这里会有问题，加入后边的($.browser.mozilla && $.browser.version == '11.0')判断
	if ($.browser.msie || ($.browser.mozilla && $.browser.version == '11.0')) {
		if (document.getElementsByTagName('base') && document.getElementsByTagName('base')[0].href) {
			href = document.getElementsByTagName('base')[0].href + href;
		}
	}
	
	href = addDefaultParamToUrl(href);
	if (isBlank){
		var _openWin = window.open(href);
		return _openWin;
	}else{
		window.location.href = href;
	}
	
}
/**
 * 关闭当前窗口，兼容ie,ff
 */
function closeWin() {
	if (navigator.userAgent.indexOf("MSIE") > 0) {
		if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
			window.opener = null;
			window.close();
		} else {
			window.open('', '_top');
			window.top.close();
		}
	} else if (navigator.userAgent.indexOf("Firefox") > 0) {
		window.opener = null;
		window.open('', '_self', '');
		window.close();
	} else {
		window.opener = null;
		window.open('', '_self', '');
		window.close();
	}
} 
/**
 * 将相对地址的url转换为绝对地址
 * @param url 要转换的url
 * @returns 返回绝对地址的url
 */
function getAbsoluteUrl(url){
	if (!url || url.indexOf('http://') != -1)return url;
	var href = url;
	if (document.getElementsByTagName('base') && document.getElementsByTagName('base')[0].href) {
			href = document.getElementsByTagName('base')[0].href + href;
	}
	return href;
}

/*
 *创建附件下载链接，适合多附件
 *htmlId:需要创建下载链接的页面元素ID
 *list:附件数据结果集
 */
 function createDownloadLink(htmlId,list){
     var preUrl = CONTEXT_PATCH + 'spreq/attachment!download.action';
     var links = "";
     if(list!=null){
         var flen = list.length;
         if(flen>0){
           for(var i=0;i<flen;i++){
               var item = list[i];
               var fileId = item.fileId;
               var fileName = item.fileName;
   
               var durl = appendExtraParams(preUrl+"?attachFileId="+fileId);
               var itemUrl = "<iframe name='excel' frameborder=0 height=0 width=0></iframe><span class='downloadspan'>&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+durl+"' target='excel'>"+fileName+"</a>&nbsp;</span>";
                   links += itemUrl;
            }
         }
     }
   $('#'+htmlId).empty().html(links);
}

/**
* 附件转换为可下载的链接
*/
;
(function($){
var downLoadAttachUrl = CONTEXT_PATCH + 'spreq/attachment!download.action';
$.fn.extend({
	createAttachLink:function(){
		return this.each(function( j ) {
			var attachFileId = $(this).find('span[isAttachId]').text();
			var attachName = $(this).find('span[isAttachName]').text();
			if($.trim(attachFileId) != '' && $.trim(attachName) != ''){
			    var aHtml = '<iframe name="excel" frameborder=0 height=0 width=0></iframe>  <span class=downloadspan>&nbsp;&nbsp;&nbsp;&nbsp;<a href="' + appendExtraParams(downLoadAttachUrl + '?attachFileId=' + attachFileId) + '" target="excel" title="' + attachName + '">' + attachName + '</a>&nbsp;</span>';
				//var aHtml = '<a href="' + appendExtraParams(downLoadAttachUrl + '?attachFileId=' + attachFileId) + '" target="_blank" title="' + attachName + '">' + attachName + '</a>';
				$(this).empty().append(aHtml);
			}
			
		});
	}
});	
	
})(jQuery);

/**
* Logo图片附件转换为图片显示效果
*/
;
(function($){
var downLoadAttachUrl = 'spreq/attachment!view.action';
$.fn.extend({
	createAttachLogo:function(_options){
	   var _default = {
    		width :100,
    		height:100
	  };
      $.extend(_default,_options||{});
		return this.each(function( j ) {
			var attachFileId = $(this).find('span[isAttachId]').text();
			var attachName = $(this).find('span[isAttachName]').text();
			var durl = appendExtraParams(downLoadAttachUrl + '?attachFileId=' + attachFileId);
			if($.trim(attachFileId) != '' && $.trim(attachName) != ''){
				var aHtml = '<a href="'+durl+'" target="excel"><img src="' + durl + '" width="'+_default.width+'px" height="'+_default.height+'px"/></a>';
				$(this).empty().append(aHtml);
			}else{
				var aHtml = '<a href="images/mobilelogo.gif" target="excel"><img src="images/mobilelogo.gif" width="'+_default.width+'px" height="'+_default.height+'px"/></a>';
				$(this).empty().append(aHtml);
			}
			
		});
	}
});	
	
})(jQuery);
//结束
//$.ajaxSetup({
//	cache:false
//});
//所有的ajax请求添加默认请求参数
$(document).ajaxSend(function( event, jqxhr, settings ) {
	var _url = settings.url;
	settings.url = addDefaultParamToUrl(_url);
});
//datagrid 返回的原始数据转换
function _myLoadFilter(data, parent){
	var newobj = {"success": true,"total":10,"rows":[]};
	if (data.data && data.success && data.data.list){
		newobj.rows = data.data.list;
		newobj.total = data.totalCount;
	}else{
		alert('加载列表数据出错');
	}
	
	var rows = newobj.rows;
	if (null == rows || rows.length == 0)return newobj;
	//处理转义
	if(jQuery.isArray(rows)){
		jQuery.each(rows, function(i, one){
			jQuery.each(one,function(key,val){
				if(typeof one[key] == 'string'){
					one[key] = _transfer(one[key]);
				}
		    });
		});
	}
	
	
	//以下扩展了二级元素获取
	var columnFields = $(this).datagrid('getColumnFields');
	var _columns = [];
	for (var i = 0 ; i < columnFields.length; i++){
		var columnOptions = $(this).datagrid('getColumnOption',columnFields[i]);
		var field = columnOptions['field'];
		if (field.indexOf('.')  > 0){
			_columns.push(field);
		}
	}
	if (_columns.length > 0){
		for (var i = 0; i < _columns.length; i++){
			for (var j =0 ; j < rows.length;j++){
				rows[j][_columns[i]] = $.str2Value(rows[j],_columns[i]);
			}
		}
	}
	newobj.rows = rows;
	return newobj;
}
/**
 * 字符串转换为字节，中文转换为2个字符
 * @param str 转换的字符串
 * @returns {Number} 转换后的字符串
 */
function getSubStr(str,fontSize,subLen){
	var len = 0;
	var s = [];
	var id = '_tmpShortStr';
	if (!document.getElementById('_tmpShortStr')){
		$('<div id="' + id + '" style="display:none;font-size:' + fontSize + '"></div>').appendTo('body');
	}
	if(str!=''){
		for(var i=0;i<str.length;i++){
			var tmp = str.substring(i,i+1);
			$('#' + id).html(s.join('') + tmp + '...');
			if ($('#' + id).width() > subLen){
				break;
			}else{
				s.push(tmp);
			}
		}
	}
	s.push('...');
	return s.join('');;
}
function getSubStr_(str,fontSize,subLen){
	var len = 0;
	var s = [];
	var id = '_tmpShortStr';
	if (!document.getElementById('_tmpShortStr')){
		$('<div id="' + id + '" style="display:none;font-size:' + fontSize + '"></div>').appendTo('body');
	}
	if(str!=''){
		for(var i=0;i<str.length;i++){
			var tmp = str.substring(i,i+1);
			$('#' + id).html(s.join('') + tmp + '...');
			if ($('#' + id).width() > subLen){
				s.push('<BR>');
			}else{
				s.push(tmp);
			}
		}
	}
	return s.join('');;
}
function renderFieldTip(_this){
	if (!$(_this).data('txt')){
		$(_this).data('txt',$(_this).html());
	}
	var dhtml = $(_this).data('txt');
	$(_this).html(dhtml);
	var dtext = $(_this).text();
	var fontSize = $(_this).css("font-size").replace("px","");
    var csize = parseInt(fontSize) / 2;
    var divlen = $(_this).width();
    var txtlen = getCharLength(dtext);
    $(_this).unbind('mouseover').unbind('mouseout');
    if((txtlen*csize)>divlen){
         //超长标题以...结尾
         var len = Math.floor(divlen/csize) - 6;
		 var shortHtml = '' ;
		 //debugger;
		 if($(_this).find('[word-break=break-all]').length+0 > 0){
			shortHtml = getSubStr_(dtext,fontSize,divlen);
		 }else{
			shortHtml = getSubStr(dtext,fontSize,divlen);
		 }
		 var _span = $('<span title="'+$(_this).text()+'"/>').html($(_this).html().replace(dtext,shortHtml));
         $(_this).html(_span);
    }else{
		var _span = $('<span title="'+$(_this).text()+'"/>').html($(_this).html());
        $(_this).html(_span);
	}
}

//datagrid 默认初始化
/**
 * 初始化easyui datagrid 默认参数,同时扩展了默认排序字段在表头显示的效果，tip提示，禁用标题列改变列宽等
 * @function
 * @param config datagrid参数用法跟datagrid传参一致
 * @example
 * $('#dg').datagrid(getDefaultDgConfig({
 * 		url : jsonUrl
 * });
 */
function getDefaultDgConfig(config){
	var _default = {
					singleSelect : true,
					pagination : true,
					pageSize: '10',
					striped : true,
					method : 'POST',
					collapsible : true,
					fitColumns : true,
					remoteSort : true,
					onBeforeLoad : function(param){
						var sort = param['sort'];
						if (sort){
							var columnOption = $(this).datagrid('getColumnOption',sort);
							var sortName = sort;
							if (columnOption && columnOption['sortName']){
								sortName = columnOption['sortName'];
							}else{
								//排序默认选中
								var columnFields = $(this).datagrid('getColumnFields');
								for (var i = 0 ; i < columnFields.length; i++){
									var columnOptions = $(this).datagrid('getColumnOption',columnFields[i]);
									if (columnOptions['sortName'] == sort){
										var field = columnFields[i];
										var orderClass = param['sortOrder'] == 'desc'?'datagrid-sort-asc':'datagrid-sort-desc';
										$('td[field="' + field + '"]').find('div').addClass(orderClass);
									}
								}
							}
							$(this).datagrid('options').url = addUrlParam($(this).datagrid('options').url,'sortName',sortName);
						}
						
					},
					onLoadError : function(){alert('加载列表数据异常');},
					loadFilter:_myLoadFilter,
					onResizeColumn : function(field, width){
						$('tr.datagrid-row').find('td[field="' + field + '"]').find('div').each(function(){
							renderFieldTip(this);
						});
					},
					onLoadSuccess:function(){
						var tip = true;
						var columnFields = $(this).datagrid('getColumnFields');
						for(var i = 0 ; i < columnFields.length; i++){
							var field = columnFields[i];
							var columnOptions = $(this).datagrid('getColumnOption',field);
							var showTip = columnOptions['showTip'];
							if(showTip==false){
								tip = false;
							}else{
								tip = true;
							}
							if(tip){//需添加tip提示
								$('tr.datagrid-row').find('td[field="' + field + '"]').find('div').each(function(){
									renderFieldTip(this);
								});
							}
						}
					}
	}
	return $.extend(_default,config);	
}

var initDemandStatus = function () {
	var status  = getParamter("demand_status");
	
	if ( status != null ) {
			/** 判断是从首页点了哪个需求状态 **/
			/**
			    0:草稿箱
			    1:待审核
			    2:待处理
			    3:处理中
			    4:待验证
			    5:已完成
			    6:未采纳
			    7:终止
			**/
			switch(status)
			{
			case "1":
			  waitAuditDo();
			  break;
			case "2":
			  waitDealDo();
			  break;
			case "3":
			  dealingDo();
			  break;
			case "4":
			  waitValidDo();
			  break;
			case "5":
			  finishedDo();
			  break;
			case "6":
			  unAcceptDo();
			  break;
			case "7":
			  endDo();
			  break;
			default:
			  dgQuery();
			  break;
			  
			}
	}else {
		 dgQuery();
	}
}
/**
 * 子窗口被关闭定时监控类
 * @class
 * @param obj 子窗口对象
 * @example
 * 		var winopen = window.open('page/requirement/requirement12_add.shtml');
 *		var timer = new OpenerIsNullTimerCheck(winopen);
 *		timer.init(function(){
 *			//这里可加业务逻辑
 *		});
 */
var OpenerIsClosedTimerCheck = function(obj) {
	this._obj = obj;
	this._timer = null;
}
OpenerIsClosedTimerCheck.prototype = {
		init : function(callback){
			var _this = this;
			_this._timer = setInterval(function(){
				if (_this._obj.closed){
					clearTimeout(_this._timer);
					if (callback) callback();
				}
			},500);
		}
}

//创建html编辑器
function createKindEditor(id,htmlContent,kwidth,kheight){
   var editor = KindEditor.create('#'+id, {
	               items:['source',
	               '|','selectall', 'cut', 'copy', 'paste',
	               'plainpaste', 'wordpaste',
	               '|', 'justifyleft', 'justifycenter', 'justifyright','justifyfull', 'insertorderedlist',
	               'insertunorderedlist', 'indent', 'outdent', 'subscript','superscript', 
	               '|', '-','formatblock', 'fontname', 'fontsize', 
	               '|', 'forecolor', 'hilitecolor', 'bold','italic', 'underline', 'strikethrough', 'lineheight','removeformat', 'clearhtml',
	               '|', 'code', 'image','table','hr', 'link', 'unlink',
	               '|', 'undo', 'redo',
	               '/', 'fullscreen', 'print', 'preview'],
	               width:kwidth,
	               height:kheight,
	               allowImageUpload:false, //禁用图片上传功能
	               resizeType:1, //2:可以拖动改变宽度和高度，1:只能改变高度，0:不能拖动
	               afterCreate : function(){
	                   this.sync();//同步数据到textarea
	               }, 
	               afterBlur:function(){ 
	                   this.sync();//同步数据到textarea
                   }
       });
       editor.html(htmlContent);
       editor.focus();
 return editor;
}

function getSystemKeyName(){
	var systemKey  = getParamter("systemKey");
	switch(systemKey){
		case 'qm' : return '个人产品';
		case 'jk' : return '产品工单';
		case 'is' : return '信息安全资料';
		case 'op' : return '运营管理';
		case 'pn' : return '规划管理';
		case 'qc' : return '品质管理';
		case 'cs' : return '合作及服务管理';
		case 'zl' : return '品质管理资料';
		case 'tr' : return '拨测需求';
		case 'ta' : return '拨测告警';
		default : return '品质管理';
	}
}

//需求模块使用
function getSystemKey4Req(){
	var systemKey  = getParamter("systemKey");
	switch(systemKey){
		case 'qm' : return '个人产品';
		case 'jk' : return '集团产品';
		default : return '个人产品';
	}
}

String.prototype.startWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
	   return false;
	if(this.substr(0,s.length)==s)
	   return true;
	else
	   return false;
    return true;
}

String.prototype.endWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
	   return false;
	if(this.substring(this.length-s.length)==s)
	   return true;
	else
	   return false;
	return true;
}


$.fn.mergeColumns = function(cols) {  
	var _columns_map = {};
	this.each(function() {  
		var len = cols.length;
		for (var i =  len - 1; i >= 0; i--) {  //获取表格td的数量进行循环  
			_columns_map[cols[i]] = [];
			var s = null;  
			var prevTd = null; 
			var prevIndex;
			$(this).find('tr').each(function(index) {  
				var td = $(this).find('td').eq(cols[i]);  
				var s1 = td.text();  
				if (s1 == s) { //相同即执行合并操作  
					td.hide(); //hide() 隐藏相同的td ,remove()会让表格错位 此处用hide 
					var span = prevTd.attr('rowspan') ? parseInt(prevTd.attr('rowspan')) + 1 : 2;
					prevTd.attr('rowspan', span); //赋值rowspan属性  
					//prevTd.attr('width',prevTd.attr('width') + td.attr('width'));
					_columns_map[cols[i]].push('hidden');
					_columns_map[cols[i]][prevIndex] = span;
				}else {  
					s = s1;  
					prevTd = td;
					
					prevIndex = index;
					_columns_map[cols[i]].push(1);
				}  
			});  
		}  
	});
	return _columns_map;
}  
$.fn.mergeRows = function() {  
	return this.each(function() {  
		$(this).find('thead tr').each(function() {  
			var s = null;  
			var prevTd = null;  
			for (var i = 0; i < $(this).find('th').size(); i++) {  
				var td = $(this).find('th').eq(i);  
				var s1 = td.text();  
				if (s1 == s) { //相同即执行合并操作  
					prevTd.width(prevTd.width() + td.width());	
					prevTd.attr('colspan', parseInt(prevTd.attr('colspan'),10) ? parseInt(prevTd.attr('colspan'),10) + 1 : 2); //赋值colspan属性 
					td.hide(); //hide() 隐藏相同的td ,remove()会让表格错位 此处用hide  
				}  
				else {  
					s = s1;  
					prevTd = td;  
				}  
			}
			//$(this).find('th:hidden').remove();
		});  
	});  
} 
;
(function ($) {
    $.fn.extend({
        FixedHead: function (options) {
            var op = $.extend({ tableLayout: "auto" }, options);
            return this.each(function () {
                var $this = $(this); //指向当前的table
                var $thisParentDiv = $(this).parent(); //指向当前table的父级DIV，这个DIV要自己手动加上去
                $thisParentDiv.wrap("<div class='fixedtablewrap'></div>").parent().css({ "position": "relative" }); //在当前table的父级DIV上，再加一个DIV
                var x = $thisParentDiv.position();
                //在当前table的父级DIV的前面加一个DIV，此DIV用来包装tabelr的表头
                var fixedDiv = $("<div class='fixedheadwrap' style='clear:both;overflow:hidden;z-index:2;position:absolute;' ></div>").insertBefore($thisParentDiv).css({ "width": $thisParentDiv[0].clientWidth, "left": x.left, "top": x.top });

                var $thisClone = $this.clone(true);
				var id = $thisClone.attr('id');
				if (id){
					$thisClone.attr('id','FixedHead_' + id);
				}
                $thisClone.find("tbody").remove(); //复制一份table，并将tbody中的内容删除，这样就仅余thead，所以要求表格的表头要放在thead中
                $thisClone.appendTo(fixedDiv); //将表头添加到fixedDiv中

                $this.css({ "marginTop": 0, "table-layout": op.tableLayout });
                //当前TABLE的父级DIV有水平滚动条，并水平滚动时，同时滚动包装thead的DIV
                $thisParentDiv.scroll(function () {
                    fixedDiv[0].scrollLeft = $(this)[0].scrollLeft;
                });

                //因为固定后的表头与原来的表格分离开了，难免会有一些宽度问题
                //下面的代码是将原来表格中每一个TD的宽度赋给新的固定表头
                var $fixHeadTrs = $thisClone.find("thead tr");
                var $orginalHeadTrs = $this.find("thead");
                $fixHeadTrs.each(function (indexTr) {
                    var $curFixTds = $(this).find("td");
                    var $curOrgTr = $orginalHeadTrs.find("tr:eq(" + indexTr + ")");
                    $curFixTds.each(function (indexTd) {
                        $(this).css("width", $curOrgTr.find("td:eq(" + indexTd + ")").width());
                    });
                });
            });
        }
    });
})(jQuery);
;
(function() {
	jQuery.extend(jQuery.fn, {
		render: function(options) {
			var _options = {
					columns : [],
					rows : [],
					rowStyler : null,
					errorMsg : null,
					editable : false,
					category : ''
			}
			$(_this).data('_rows',[]);
			$(_this).data('_chgRows',[]);
			$.extend(_options,options);
			var cols = _options['columns'],chgRows = [],errorMsg = _options['errorMsg'] ,_this = this,editable = _options['editable'], category=_options['category'],rows = _options['rows'],clen = cols.length,len = rows.length,html = [];
			html.push('<thead>');
			html.push('<tr>');
			var preCate = '',span = 1;
			if (category){
				for (var i = 0 ; i < clen; i++){
					cate = cols[i][category];
					if (cate){
						html.push('<th width="'	+ cols[i]['width'] + '" title="' + cols[i]['title'] + '">' + cate + '</th>');
					}else{
						html.push('<th width="'	+ cols[i]['width'] + '" rowspan="2" title="' + cols[i]['title'] + '">' + cols[i]['title'] + '</th>');
					}
					
				}
				html.push('</tr>');
				html.push('<tr>');
				for (var i = 0 ; i < clen; i++){
					if (cols[i][category]){
						html.push('<th width="'	+ cols[i]['width'] + '" title="' + cols[i]['title'] + '">' + cols[i]['title'] + '</th>');
					}
				}
			}else{
				for (var i = 0 ; i < clen; i++){
						html.push('<th width="'	+ cols[i]['width'] + '" title="' + cols[i]['title'] + '">' + cols[i]['title'] + '</th>');
				}
			}
			
			html.push('</tr>');
			html.push('</thead>');
			html.push('<tbody>');
			for (var n = 0 ; n < len; n++){
				var rowStyler = _options['rowStyler'];
				if (typeof rowStyler === 'function'){
					var _css = rowStyler.call(_this,n,rows[n]);
					if (_css){
						html.push('<tr style="' + _css + '">');
					}
				}else{
					html.push('<tr>');
				}
				$(this).data('_rows',rows);
				for (var m = 0 ; m < clen; m++){
					var formatter = cols[m]['formatter'];
					var alignStyle = cols[m]['alignStyle'];
					var value = '';
					var tdAlign = 'center';
					if(typeof alignStyle === 'function'){
						tdAlign = alignStyle.call(cols[m],rows[n]);
					}
					if (typeof formatter === 'function'){
						value = formatter.call(cols[m],rows[n]);
						value = value || '';
						html.push('<td align="'+tdAlign+'" field="'+cols[m]['field']+'">' + value + '</td>');
					}else{
						value = rows[n][cols[m]['field']];
						value = value || '';
						html.push('<td align="'+tdAlign+'" field="'+cols[m]['field']+'" title="'+value+'">' + value + '</td>');
					}
				
					
				}
				html.push('</tr>');
			}
			html.push('</tbody>');
			$(this).html(html.join(''));
			//$(this).find('tbody tr:odd').addClass('odd');
			var toggleEditable = function(rownum){
				for (var i = 0 ; i < clen; i++){
					if (cols[i]['editable']){
						var _td = _this.find('tbody tr').eq(rownum).find('td[field="'+cols[i]['field']+'"]');
						var input = $('<input type="text"/>').width('95%').val(_td.text()).attr('colNum',i);
						if (_td.css('text-overflow') == 'ellipsis'){
							_td.attr('ellipsis','true').css('text-overflow','') ;
						}
						_td.attr('orginalVal',_td.text()).html(input).attr('editable',true);
						input.bind('click',function(event){
							event.stopPropagation(); 
						});
						input.blur(function(event){
								event.stopPropagation(); 
								var val = $(this).val(),validator = cols[parseInt($(this).attr('colNum'),10)]['validator'],_td = $(this).parent('td');
								if (typeof validator === 'function'){
									var rtn = validator.call(this,val,rows[rownum]);
									if (!rtn){
										//event.returnValue = false; 
										$(this).val(_td.attr('orginalVal'));
										/**$(this).attr('valid',"true").css("border-color","green");
										if (typeof errorMsg === 'function'){
											errorMsg.call(this,'',rows[rownum]);
										}**
									}else{
										
										/**$(this).attr('valid',"false").css("border-color","red");
										if (typeof errorMsg === 'function'){
											errorMsg.call(this,rtn,rows[rownum]);
										}**/
									}else{
										_td.attr('orginalVal',$(this).val());
									}
								}
						});
						
					}
				}
			}
			if (editable){
				var trs = $(this).find('tbody tr');
				trs.bind('click',function(){
					var validNum = $(_this).find('tbody input[valid="false"]').length;
					if (validNum > 0) return;
					var rownum = trs.index($(this));
					var editTrs = $(_this).find('tbody tr[editing="true"]');
					
					editTrs.each(function(){
						var editTrNum = trs.index($(this));
						if (rownum != editTrNum){
							var _row = rows[editTrNum];
							var isChange = false;
							$(_this).find('tbody tr').eq(editTrNum).find('td').each(function(){
								var val = $(this);
								if (val.attr('editable') == "true"){
									var v = val.find('input'),_field = val.attr('field');
									if (v){
										if (val.attr('ellipsis') == 'true'){
											val.css('text-overflow','ellipsis').removeAttr('ellipsis');
										}
										if (typeof _row[_field] != 'undefined' && _row[_field] != v.val()){
											isChange = true;
										}
										_row[_field] = v.val();
										val.removeAttr('editable');
										val.html(_row[_field]);
									}
								}
								
							});
							if (isChange){
								var _chgRows = $(_this).data('_chgRows') || [];
								_chgRows[editTrNum] = _row;
								$(_this).data('_chgRows',_chgRows);
							}
							rows[editTrNum] = _row;
							$(_this).data('_rows',rows);
							$(this).removeAttr('editing');
					 }
					
					});
					 if (rownum < len && !$(this).attr('editing')){
							toggleEditable(rownum);
							$(this).attr('editing',true);
					 }
					
				});
			}
		},
		saveChange : function(){
			var editTrs = $(this).find('tbody tr[editing="true"]');
			var trs = $(this).find('tbody tr');
			var _this = this,rows = $(this).data('_rows')||[];
			editTrs.each(function(){
				var editTrNum = trs.index($(this));
				var _row = rows[editTrNum];
				var isChange = false;
				$(_this).find('tbody tr').eq(editTrNum).find('td').each(function(){
					var val = $(this);
					if (val.attr('editable') == "true"){
						var v = val.find('input'),_field = val.attr('field');
						if (v){
							v.trigger('blur');
							if (_row[_field] != v.val()){
								isChange = true;
							}
							_row[_field] = v.val();
							val.removeAttr('editable');
							val.html(_row[_field]);
						}
					}
					
				});
				if (isChange){
					var _chgRows = $(_this).data('_chgRows') || [];
					_chgRows[editTrNum] = _row;
					$(_this).data('_chgRows',_chgRows);
				}
				$(this).removeAttr('editing');
				rows[editTrNum] = _row;
				$(_this).data('_rows',rows);
			
			});
		}
	});
})(jQuery);

(function() {
	jQuery.extend(jQuery.fn, {
		saveChange : function(){
			var editTrs = $(this).find('tbody tr[editing="true"]');
			var trs = $(this).find('tbody tr');
			var _this = this,rows = $(this).data('_rows')||[];
			editTrs.each(function(){
				var editTrNum = trs.index($(this));
				var _row = rows[editTrNum];
				var isChange = false;
				$(_this).find('tbody tr').eq(editTrNum).find('td').each(function(){
					var val = $(this);
					if (val.attr('editable') == "true"){
						var v = val.find('input'),_field = val.attr('field');
						if (v){
							v.trigger('blur');
							if (_row[_field] != v.val()){
								isChange = true;
							}
							_row[_field] = v.val();
							val.removeAttr('editable');
							val.html(_row[_field]);
						}
					}
					
				});
				if (isChange){
					var _chgRows = $(_this).data('_chgRows') || [];
					_chgRows[editTrNum] = _row;
					$(_this).data('_chgRows',_chgRows);
				}
				$(this).removeAttr('editing');
				rows[editTrNum] = _row;
				$(_this).data('_rows',rows);
			
			});
		}
	});
})(jQuery);


(function($) {
	$.fn.jFixedtable = function(options) {
		var options = $.extend({
			width: "640",
			height: "320",
			margin: "0",
			padding: "0",
			overflow: "hidden",
			colWidths: undefined,
			fixedCols: 0,
			headerRows: 1,
			onStart: function() {},
			onFinish: function() {},
			onCumclick: function() {},
			cssSkin: "sSky",
			edit: false,
			pkey: null
		}, options);
		return this.each(function() {
			this.cssSkin = options.cssSkin || "";
			this.headerRows = parseInt(options.headerRows || "1");
			this.fixedCols = parseInt(options.fixedCols || "0");
			this.colWidths = options.colWidths || [];
			this.initFunc = options.onStart || null;
			this.callbackFunc = options.onFinish || null;
			this.initFunc && this.initFunc();
			this.oncumclick = options.oncumclick;
			this.sHeaderHeight = 0;
			this.replaceStr = function(str) {
				str = str.replace(/&lt;/g, "<");
				str = str.replace(/&gt;/g, ">");
				return str;
			};
			this.id = $(this).attr("id");
			$(this).data("id", this.id);
			$table = $(this);
			$(this).attr("id", "");
			this.sBase = $("<div></div>");
			this.sFHeader = this.sBase.clone(true);
			this.sHeader = this.sBase.clone(true);
			this.sHeaderInner = this.sBase.clone(true);
			this.sFData = this.sBase.clone(true);
			this.sFDataInner = this.sBase.clone(true);
			this.sData = this.sBase.clone(true);
			this.sDataTable = $table;
			this.sColGroup = document.createElement("COLGROUP");
			this.sFHeader.addClass("sFHeader");
			this.sHeader.addClass("sHeader");
			this.sHeaderInner.addClass("sHeaderInner");
			this.sFData.addClass("sFData");
			this.sFDataInner.addClass("sFDataInner");
			this.sData.addClass("sData");
			this.sData.attr("id", this.id + "_sData");
			this.sBase.addClass("sBase");
			this.ToFixTb = function() {
				$table.wrap("<div></div>");
				$table.parent().append(this.sBase);
				this.sBase.parent().css({
					width: options.width,
					height: options.height
				});
				var $th = $table.find("tr:first");
				var $ths = $table.find("tr:first>td");
				if (!$ths) $ths = $table.find("tr:first>th");
				this.sHeaderTable = $("<table><tbody></tbody></table>");
				if (this.headerRows > 0) {
					for (var i = 0; i < this.headerRows; i++) {
						this.sHeaderHeight += parseInt($table.find("tr").eq(options.headerRows - 1).outerHeight());
					};
					$th = $table.find("tr:lt(" + this.headerRows + ")");
				};
				for (i = 0; i < this.headerRows; i++) {
					this.sHeaderTable.append($table.find("tr").eq(i).clone(true));
				};
				this.sFHeaderWidth = 0;
				this.sHeaderInner.append(this.sHeaderTable);
				if (this.fixedCols) {
					this.sFHeaderTable = this.sHeaderTable.clone(true);
					this.sFHeader.append(this.sFHeaderTable);
					this.sFDataTable = this.sDataTable.clone(true);
					this.sFDataInner.append(this.sFDataTable);
				};
				var tds = $table.find("tr").eq(this.headerRows).find("td");
				if ($table.find("thead tr").length > 0){
					tds = $table.find("thead tr").eq(0).find('th');
				}
				for (i = 0, j = tds.length; i < j; i++) {
					if (i === this.colWidths.length || this.colWidths[i] === -1) {
						this.colWidths[i] = parseInt(tds[i].width || tds[i].offsetWidth);
					}
				};
				for (i = 0; i < this.headerRows; i++) {
					var tds = this.sDataTable.find("tr").eq(i).find("td");
					for (var k = 0; k < tds.size(); k++) {
						tds.eq(k).removeAttr("width");
					}
				};
				for (i = 0, j = this.colWidths.length; i < j; i++) {
					this.sColGroup.appendChild(document.createElement("COL"));
					this.sColGroup.lastChild.setAttribute("width", this.colWidths[i]);
				};
				$(this.sColGroup.cloneNode(true)).prependTo(this.sDataTable);
				$(this.sColGroup.cloneNode(true)).prependTo(this.sHeaderTable);
				if (this.fixedCols > 0) {
					$(this.sColGroup.cloneNode(true)).prependTo(this.sFHeaderTable);
					$(this.sColGroup.cloneNode(true)).prependTo(this.sFDataTable);
				};
				if (this.fixedCols > 0) {
					this.sBase.append(this.sFHeader);
				};
				this.sBase.append(this.sHeader);
				this.sHeader.append(this.sHeaderInner);
				if (this.fixedCols > 0) {
					this.sFData.append(this.sFDataInner);
					this.sBase.append(this.sFData);
				};
				this.sData.append(this.sDataTable);
				this.sBase.append(this.sData);
				if (this.fixedCols > 0) {
					this.sFHeaderWidth = $(this).find('thead tr').eq(0).find('th').eq(this.fixedCols)[0].offsetLeft;
					//this.sFHeaderWidth = this.sDataTable[0].tBodies[0].rows[this.headerRows - 1].cells[this.fixedCols].offsetLeft + 1;
				} else this.sFHeaderWidth = 0;
				this.sFHeader.css("width", this.sFHeaderWidth + "px");
				this.sData.css({
					"margin-left": this.sFHeaderWidth,
					"margin-top": this.sHeaderHeight,
					height: (options.height - this.sHeaderHeight),
					width: (options.width - this.sFHeaderWidth)
				});
				this.sDataTable.css({
					"margin-left": -this.sFHeaderWidth,
					"margin-top": -this.sHeaderHeight
				});
				this.id = $(this).data("id");
				this.sDataTable.attr("id", this.id);
				if (this.fixedCols > 0) {
					this.sData.scroll(function() {
						$(this).parent().find(".sHeaderInner").css({
							right: $(this).scrollLeft() + "px"
						});
						$(this).parent().find(".sFDataInner").css({
							top: -1 * $(this).scrollTop() + "px"
						});
					});
				} else {
					this.sData.scroll(function() {
						$(this).parent().find(".sHeaderInner").css({
							right: $(this).scrollLeft() + "px"
						});
					});
				}; if (options.edit) $("#" + this.id).jGrid({
					ftb: options
				});
			};
			this.ToFixTb();
		});
	}
})(jQuery);
//获取前N个季度， 格式：2014年第04季度
function getUpQuarter(upq){
	var quarter = 0;
	var currentDate = new Date();
	currentDate.setMonth(currentDate.getMonth()-(3*upq));
	 //获得当前月份0-11  
    var currentMonth = currentDate.getMonth();
    //获得当前年份4位年  
    var currentYear = currentDate.getFullYear();
    if(currentMonth<=2){
    	quarter = 1;
    }else if(currentMonth <=5){
    	quarter = 2;
    }else if(currentMonth <=8){
    	quarter = 3;
    }else{
    	quarter = 4;
    }
	return currentYear+"年第0"+quarter+"季度";
};
//获取前N个季度， 格式：201404
function getUpQuarterStr(upq){
	var quarter = 0;
	var currentDate = new Date();
	currentDate.setMonth(currentDate.getMonth()-(3*upq));
	 //获得当前月份0-11  
    var currentMonth = currentDate.getMonth();
    //获得当前年份4位年  
    var currentYear = currentDate.getFullYear();
    if(currentMonth<=2){
    	quarter = 1;
    }else if(currentMonth <=5){
    	quarter = 2;
    }else if(currentMonth <=8){
    	quarter = 3;
    }else{
    	quarter = 4;
    }
	return currentYear+"0"+quarter;
};

//hover页面
(function($){
	var test1 = function(){
		var hoverObj = $('body > .hv_active');
		if(hoverObj.length != 0){
			hoverObj.remove();
		}
		var _self = $(this);
		var contentHtml = _self.attr('hover-msg');
		var _hover_width = parseInt(_self.attr('hover-width'));
		var tipforward = _self.attr('hover-tip');
		if(!tipforward){
			tipforward = 'down';
		}
		var timer;
		$('body').append(
			'<div class="hv_active"> '+
				'<div class="hover_border">'+contentHtml+'</div> '+
				'<div class="hover_tips hover_'+tipforward+'_out"> '+
					'<div class="hover_tips hover_'+tipforward+'_in"></div> '+
				'</div> '+
			'</div>'
		);
		
		var _scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
		var _scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		var hoverEle = $('body > .hv_active')[0];
		if(_hover_width){
			$(hoverEle).css({'width': _hover_width})
		}
		var _top;
		var _left;
		switch( tipforward ){
			case 'left'		: 
								_top = _scrollTop + this.getBoundingClientRect().top + _self.height()/2-$(hoverEle).height()/2;
								_left = _scrollLeft + this.getBoundingClientRect().left + _self.width() + 8;
								break;
			case 'right'	: 	_top = _scrollTop + this.getBoundingClientRect().top + _self.height()/2-$(hoverEle).height()/2;
								_left = _scrollLeft + this.getBoundingClientRect().left - $(hoverEle).width()-8;
								break;
			case 'up' 		: 	_top = _scrollTop + this.getBoundingClientRect().top + _self.height() + 8;
								_left = _scrollLeft + this.getBoundingClientRect().left - $(hoverEle).width()/2;
								break;
			case 'down' 	: 	_top = _scrollTop + this.getBoundingClientRect().top -$(hoverEle).height() - 8;
								_left = _scrollLeft + this.getBoundingClientRect().left - $(hoverEle).width()/2 + 4;
								break;
			default			:   _top = 0;
								_left = 0;
								break;
		}
		$(hoverEle).css({
							top:_top,
							left:_left
						});
		hoverEle.onmouseenter = function(){ 
			$(this).attr('hv','true');
		};
		hoverEle.onmouseleave = function(){ 
			$(this).attr('hv','false');
			test3($(this));
		};
	};
	var test2 = function(){
		var _selfObj = $('body > .hv_active');
		timer = setTimeout(
							function(){
								clearTimeout(timer);
								test3(_selfObj)
							}, 300);
	};
	var test3 = function(hoverObj){
		if(!hoverObj.is('[hv="true"]')){
			hoverObj.remove();
		}
	};
	$(document).on("mouseenter","[hover-msg]",test1);
	$(document).on("mouseleave","[hover-msg]",test2);
})(jQuery);

//弹出页面
var buildpoppage = function(params){
	//属性处理            --start----
	var _headmsg;      //头部信息
	var _contenthtml;	//中间内容
	var _footerhtml;	//脚部内容
	var _minwidth;
	var _maxwidth;
	var _width;
	var _autoclose;
	var _time = 1000;   //加如自动关闭弹出框，多久毫秒关	
	var _divId;
	var _reqFoot = true;
	var _height;
	var options = {
			'contenthtml'		:		'NO DATA!',
			'headmsg'			:		'information',
			'min-width'			:		'200px',
			'max-width'			:		'900px',
			'type'				:		'0',
			'auto-close'		:		false     //是否自动关闭弹出框
	};
	options = $.extend(options, params);
	if(options['contentId']){		   
		_divId = options['contentId'];
	}
	_headmsg = options['headmsg'];
	_contenthtml = options['contenthtml'];
	if(options['footerhtml']){
		_footerhtml = options['footerhtml'];
	}
	_autoclose = options['auto-close'];
	if(typeof parseInt(options['time']) == 'number'){
		_time = parseInt(options['time']);
	}	
	if(options['reqFoot'] == false){
		_reqFoot = false;
	}
	if(typeof parseInt(options['width']) == 'number'){
		_width  = parseInt(options['width']);
	}
	if(typeof parseInt(options['height']) == 'number'){
		_height  = parseInt(options['height']);
	}
	//属性处理            --end----
	
	//方法处理   --start--
	(function(){
		if($('.pop_outer').length !=0){
			$('.pop_outer').remove();
		}
		
		var closepop1 = function(){
			var popObj = $('.pop_outer');
			popObj.prev().remove();
			popObj.remove();
		};
		var aa='';
		if(options['type']=='1'){
			aa='<input type="button" class="pop_cancel" value="否">'+
			'<input type="button" class="pop_confirm" value="是">';
		}
		else{
			aa='<input type="button" class="pop_cancel" value="取消">'+
			'<input type="button" class="pop_confirm" value="确定">';
		}
		var popEl = '<div class="zhezhaoceng"></div>'+
					'<div class="pop_outer">'+
						'<div class="pop_head">'+
							'<span class="head-msg">'+_headmsg+'</span>'+
							'<span class="pop_close"></span>'+
						'</div>'+
						'<div class="pop_body">'+_contenthtml+'</div>'+
						'<div class="pop_footer">'+
							aa+
						'</div>'+										
					'</div>'
		$('body').append(popEl);
		if(_reqFoot && _footerhtml){
				$('.pop_outer > .pop_footer').empty();
				$('.pop_outer > .pop_footer').append(_footerhtml);
		}
		if(_width){
			$('.pop_outer').css({'width': _width + 'px'});
		}
		if(_height){
			$('.pop_outer').css({'height': _height + 'px'});
		}
		if(!_reqFoot){
			$('.pop_outer > .pop_footer').remove();
		}
		$('.pop_outer').css({
			'margin-top':'-'+$('.pop_outer').height()/2+'px',
			'margin-left':'-'+$('.pop_outer').width()/2+'px'
		});
		$('.pop_outer').on('click', '.pop_confirm', function(){
			if(typeof options.okCallBack === 'function'){
				options.okCallBack();
			}
			closepop1();
		});
		$('.pop_outer').on('click','.pop_cancel,.pop_close', function(){
			if(typeof options.cancelCallBack === 'function'){
				options.cancelCallBack();
			}
			closepop1();
		});
		if(_autoclose){
			var timer = setTimeout(closepop1, _time);
		}
	})();
	//方法处理   --end--
};


var createDownloadLink = function (htmlId,list,flowNodeInfoId){
	var preUrl = CONTEXT_PATCH + 'spreq/attachment!download.action';
	var links = "";
	if(list && list.length > 0){
		var flen = list.length;
		for(var i=0;i<flen;i++){
			var item = list[i];
			var fileId = item.fileId;
			var fileName = item.fileName;
		  
			var durl = appendExtraParams(preUrl+"?attachFileId="+fileId);
			var itemUrl = "<iframe name='excel' frameborder=0 height=0 width=0></iframe><span class='downloadspan'>&nbsp;&nbsp;&nbsp;&nbsp;<a href='"+durl+"' target='excel'>"+fileName+"</a>&nbsp;</span>";
		//	itemUrl+= "<input name='replyAttachFileCB' type='hidden' workOrderTargetId='"+fileId+"' /> ";
			if(null!=flowNodeInfoId){
			itemUrl+= "<input name='replyAttachFileCB' type='hidden' workOrderTargetId='"+flowNodeInfoId+"' /> ";
			}
			links += itemUrl;
			if(i<flen-1){
				links += "&nbsp;&nbsp;";
			}
		}
	}
	$('#'+htmlId).empty().html(links);
};

/*var createAttachLogo = function(htmlId,list){
	var preUrl = CONTEXT_PATCH + 'spreq/attachment!view.action';
	var _default = {
		width :100,
		height:100
	};
	var links = "";
	var flen = list.length;
	if(flen>0){
		for(var i=0;i<flen;i++){
			var item = list[i];
			var fileId = item.fileId;
			var fileName = item.fileName;
		  
			var durl = appendExtraParams(preUrl+"?attachFileId="+fileId);
			var itemUrl = '<a href="'+durl+'" target="excel"><img src="' + durl + '" width="'+_default.width+'px" height="'+_default.height+'px"/></a>';
			links += itemUrl;
			if(i<flen-1){
				links += "&nbsp;&nbsp;";
			}
		}
	}
	$('#'+htmlId).empty().html(links);
};*/
//


 
/*
 * params:value为增加的数字
 * 日期转化为字符串
 * example:当前时间为：Thu May 14 2015 14:14:18 GMT+0800 (中国标准时间)
 * 
 * new Date().addDay(-3)
 * =>Mon May 11 2015 14:13:15 GMT+0800 (中国标准时间)
 * 
 */
Date.prototype.addYear = function(value){
	if(value && typeof value == "number"){
		var year = this.getFullYear();
		this.setFullYear(year +	value);
	}
	return this;
 };
 Date.prototype.addMonth = function(value){
	if(value && typeof value == "number"){
		var month = this.getMonth();
		this.setMonth(month + value);
	}
	return this;
 };
 Date.prototype.addDay	= function(value){
	if(value && typeof value == "number"){
		var date = this.getDate();
		this.setDate(date + value);
	}
	return this;
 };
 Date.prototype.addHour = function(value){
	if(value && typeof value == "number"){
		var hour = this.getHours();
		this.setHours(hour + value);
	}
	return this;
 };
 Date.prototype.addMinute = function(value){
	if(value && typeof value == "number"){
		var minute = this.getMinutes();
		this.setMinutes(minute + value);
	}
	return this;
 };
 Date.prototype.addSecond = function(value){
	if(value && typeof value == "number"){
		var second = this.getSeconds();
		this.setSeconds(second + value);
	}
	return this;
 };
 /*
  * params:pattern为转化后的字符串格式
  * 日期转化为字符串
  * example:
  * new Date().format("yyyy-MM-dd hh:mm:ss")
  * =>"2015-5-14 14:6:38"
  */
 Date.prototype.format = function(pattern){
 	if(pattern && typeof pattern == "string"){
 		pattern = pattern.replace('yyyy', this.getFullYear());
 		pattern = pattern.replace('MM', this.getMonth() + 1);
 		pattern = pattern.replace('dd', this.getDate());
 		pattern = pattern.replace('hh', this.getHours());
 		pattern = pattern.replace('mm', this.getMinutes());
 		pattern = pattern.replace('ss', this.getSeconds());
 	}
 	return pattern;
 };
 /*
  * params:pattern为转化前的字符串格式
  * example:
  * 	"2015/05/14 13:22:21".toDate("yyyy/MM/dd hh:mm:ss") 
  * 	=>Wed May 14 2014 13:22:21 GMT+0800 (中国标准时间)
  * 日期转化为字符串
  * 
  */
 String.prototype.toDate = function(pattern){
	var year;
	var month;
	var day;
	var hour;
	var minute;
	var second;
	var timeDate;
 	if(pattern && typeof pattern == "string"){
 		if(pattern.indexOf("yyyy") != -1){
 			year = parseInt(this.substr(pattern.indexOf("yyyy"), 4), 10);
 		}else{
 			year = 0;
 		}
 		if(pattern.indexOf("M") != -1){
 			month = parseInt(this.substring(pattern.indexOf("M"), pattern.lastIndexOf("M")+1), 10) -1;
 		}else{
 			month = 0;
 		}
 		if(pattern.indexOf("d") != -1){
 			day = parseInt(this.substring(pattern.indexOf("d"), pattern.lastIndexOf("d")+1), 10);
 		}else{
 			day = 0;
 		}
 		if(pattern.indexOf("h") != -1){
 			hour = parseInt(this.substring(pattern.indexOf("h"), pattern.lastIndexOf("h")+1), 10);
 		}else{
 			hour = 0;
 		}
 		if(pattern.indexOf("m") != -1){
 			minute = parseInt(this.substring(pattern.indexOf("m"), pattern.lastIndexOf("m")+1), 10);
 		}else{
 			minute = 0;
 		}
 		if(pattern.indexOf("s") != -1){
 			second = parseInt(this.substring(pattern.indexOf("s"), pattern.lastIndexOf("s")+1), 10);
 		}else{
 			second = 0;
 		}
 		timeDate = new Date(year, month, day, hour, minute, second);
 	}
 	return timeDate;
 };
 
 //验证为0或者全是数字
 String.prototype.isNumber = function () {
 	var reg= /^(0|[1-9][0-9]*)$/;
 	return reg.test(this);
 };
 
 +function($){
		var Flychess = function(element, options){
			this.$element = $(element);
			this.options = options;
		}
		Flychess.VERSION = '1.0';
		Flychess.DEFAULTS = {
			
		};
		Flychess.prototype.clickEvent = function(){
			$(this.$element).find('div.icon a').bind('click',function(){
				if(!$(this).is('.active')){
					$(this).parents('.fly_nav').find('.active').removeClass('active');
					$(this).addClass('active');
					$(this).parent().prev().addClass('active');
					
				}
				$(this).parents('li').data("datas").callback();
			});
		};
		
		
		Flychess.prototype.refresh = function(){
			var _this = this;
			var items = _this.options.items;
			var self = _this.$element;
			self.empty();
			//ajax获取待办信息
			//var url = window.BIZCTX_PATH + '/pendTask!list.action?category=' + categroy;
			var url = _this.options.url;
			var divArray = [];
			$.ajax({
				url : url,
				type : 'POST',
				dataType : 'json',
				//async : true,
				success : function(data) {	
					for(var i = 0; i < items.length; i++){
						self.append('<ul class="nav_hd"></ul>');
						for(var j = 0; j < items[i].length; j++){
							var item = items[i][j]; //获取每个单元格配置参数
							var $step = $(_createItemSimple(item, data.list[i])).data('datas', item);
							//添加hover事件
							var $arrow = _createArrowSimple(item);
							self.children().eq(i).append( $step); //创建列单元格
							if(j != items[i].length-1){
								self.children().eq(i).append($arrow);
							}
						}
					}
					_this.clickEvent();
				},
				error : function(jqXHR, errorMsg) {
					
				}
			});
		};

		/* 创建单元格-简易风格 */
		function _createItemSimple(item, data){
			var _value = item.value; //单元格值
			var _displayCount = 'none';
			var _count;
			var liArray=[];
			if(_value){
				var count = data[_value];
				if(count && typeof parseInt(count) == 'number' && parseInt(count) != 0){
					_displayCount  = 'block';
					_count = parseInt(count);
				}
			}

			liArray.push('<li>');
			liArray.push('<div class="info">'+item['title']);
			liArray.push('<span class="count" data-key="'+_value+'" style="display:'+_displayCount+'">'+_count+'</span>');
			liArray.push('</div>');
			liArray.push('<div class="icon">');
			if($.isArray(item.secondmenu)){
				var hoverArray=['<ul><li>'];
				item.secondmenu.forEach(function(e){
					hoverArray.push(e);
				});
				hoverArray.push('</li></ul>');
				liArray.push('<a hover-tip="up" hover-msg="'+hoverArray.join('<li></li>')+'" href="#" class="nav_link"></a>');
			}else{
				liArray.push('<a href="#" class="nav_link"></a>');
			}
			
			liArray.push('</div>');
			liArray.push('</li>');
			
			var liHtml ='<li>'+
						'<div class="info">'+item['title']+
							'<span class="count" data-key="'+_value+'" style="display:'+_displayCount+'">'+_count+'</span>'+
						'</div>'+
						'<div class="icon">'+
							'<a hover-msg="" href="#" class="nav_link"></a>'+
						'</div>	'+
					'</li>';
			return liArray.join('');
		};
		var _createArrowSimple = function(item){
			if(item['isAddArrow'] != 'N'){
				return '<li><div class="info">&nbsp;</div><div class="arrow"><span></span></div></li>';			
			}else{
				return '<li style="width:50px;height:1px;"></li>';
			}
		};
		function Plugin(option, _relatedTarget) {
			return this.each(function () {
				var $this   = $(this);
				var data    = $this.data('bs.flychess');
				var options = $.extend({}, Flychess.DEFAULTS, $this.data(), typeof option == 'object' && option);
				
				if(!data){
					$this.data('bs.flychess', (data = new Flychess(this, options)))
				}
				
				if (typeof option == 'string'){
					data[option](_relatedTarget);
				}else{
					data.refresh();
				}
				
			})
		};
		
		var old = $.fn.flychess;
		
		$.fn.flychess = Plugin;
		$.fn.flychess.Constructor = Flychess;
		
		$.fn.flychess.noConflict = function(){
			$.fn.flychess = old;
			return this;
		}
	}(jQuery);

	//仅仅展示时转换左右尖括号，提交数据时转化须谨慎
	var _transfer = function(dataStr){
		return dataStr.replace(/</g, '＜').replace(/>/g, '＞');
	}; 
	
	var openContentPage = function(url){
		if(typeof url === 'string'){
			if(getParamter("roleType")==='0'){
				window.location.replace(window.location.protocol+'//'+ window.location.host+'/qm/'+ url);
				return;
			}
			var _pOriginParam = window.location.protocol + "//" + window.location.host;
			if(url.indexOf('pOrigin') === -1){
				if(url.indexOf('?') === -1){
					url += "?pOrigin="+ encodeURIComponent(_pOriginParam);
				}else{
					url += "&pOrigin="+ encodeURIComponent(_pOriginParam);
				}
			}
			window.location.replace(window.location.href.split('#!')[0] + '#!' + url);
			var iframeId = 'test1';
			$("#PageBody").html('<iframe id="'+iframeId+'" class="dial_iframe" name="test1" src="'+url+'" marginwidth=0 frameBorder=0 width="1128px" scrolling="auto"></iframe>');
			var iframe = document.getElementById(iframeId);
			iframe.height = $(window).height() - 82 - 46;
			//$('#main_home').hide();
			$('#caozuoqu').remove();
			$('.caozuoqu').remove();
			$('#shouqi').hide();
			$('#zhexiantu').hide();
			$('#lineChart').hide();
			$('.zhexiantu_line').hide();
			
		}
	};
	//基本的一些验证
	(function($){
		var validateMaxLength = function (obj){
			var len = 0,
			_len = obj.attr('maxlength'),
			text="";
			//把换行和中文替换成..
			len = obj.val().replace(/\r|\n|(\r\n)|[^\x00-\xff]/g, '..').length;
			if (_len){
				if(obj.next().is('.Validform_checktip')){
					obj.next().remove();
				}
				if (len > _len){
					text = '长度不能超过' + _len + '个字符或'+ _len/2 + '个汉字'
					obj.append('<span class="Validform_checktip Validform_wrong">'+ text +'</span>');
				}else{
					obj.append('<span class="Validform_checktip Validform_right">'+ text +'</span>');
				}
			}
		};
		$(document).on('blur', '[validateMaxLength]', function(){
			var _this = this;
			validateMaxLength($(_this));
		});
	})(jQuery);
	
	(function ($) {
		var setScore = function ($element) {
			var length = $element.parent().find('.selected').length;
			$element.parent().next().text((length-1)+'分');
			$element.parent().nextAll('input[name$=".score"]').val((length-1)+'');
			var $allScore = $element.parents('.grade_demo').find('.score');
			var score = 0;
			$allScore.each(function(){
				var $this = $(this);
				var _score_int = parseInt($this.text());
				isNaN(_score_int) ? '' : score += _score_int;
			});
			$element.parents('.grade_demo').find('.totle_score').text(score+'分');
			$element.parents('.grade_demo').find('input.final_score').val(score+'');
		};
		$(document).on('click','.grade_demo .level>i', 
			function(event){
					var event = event || window.event || {};
					event.preventDefault();
					event.stopPropagation();
					
					var $this = $(this);
					$this.addClass('selected');
					$this.prevAll().addClass('selected');
					$this.nextAll().removeClass('selected');

					setScore($this);
			});
			$(document).on('mouseover','.grade_demo .level>i', 
			function(event){
					var event = event || window.event || {};
					event.preventDefault();
					event.stopPropagation();
					
					var $this = $(this);
					$this.addClass('selected');
					$this.prevAll().addClass('selected');
					$this.nextAll().removeClass('selected');
					$this.addClass('hover_mark');

			});
			$(document).on('mouseout','.grade_demo .level>i', 
			function(event){
					var event = event || window.event || {};
					event.preventDefault();
					event.stopPropagation();
					
					var $this = $(this);
					var actual = parseInt($this.parent().next().text(),10);
					$this.parent().children(':lt('+(actual+1)+')').addClass('selected');
					$this.parent().children(':gt('+actual+')').removeClass('selected');
					$this.removeClass('hover_mark');
			});
			$.fn.initGrade = function (dataArray,status){
				var contentStr = "";
				var contentArray = [];		
				var allDataRow = 0;
				contentArray.push('<div class="grade_demo grade_mod" ><table width="100%" border="1" style="border-collapse: collapse;">');
				for(var i =0;i< dataArray.length;i++){
					var contentDataRow = 0;
					contentArray.push('<tr><td>');
					contentArray.push(dataArray[i].name);
					contentArray.push('</td>');
					contentArray.push('<td><ul>');
					var array1 = dataArray[i].data;
					for(var y=0; y<array1.length;y++){				
						contentArray.push('<li>');
						contentArray.push('<span class="revtit">'+array1[y].name+'</span>');
						contentArray.push('<span class="level">');
						contentArray.push('<i class="selected"><span class="title_mark">0分</span></i>');
						var _totle_score = array1[y].totleScore;
						for(var z = 1; z <= _totle_score; z++){
							var selected_class = ''
							var everyScore = array1[y].score;
							if(z%2){
								selected_class = ' icon_left';
							}else{
								selected_class = ' icon_right';
							}
							if(z <= everyScore){
								selected_class += ' selected' ;
							}
							contentArray.push('<i class="icon'+selected_class+'"><span class="title_mark">'+z+'分</span></i>');
						}
						
						contentArray.push('</span>');
						contentArray.push('<span class="score">'+everyScore+'分</span>');
						contentArray.push('<input type="hidden" name="scoreList['+allDataRow+'].score" value="'+everyScore+'" />');
						contentArray.push('<input type="hidden" name="scoreList['+allDataRow+'].situationContent" value="'+array1[y]["contentKey"]+'" />');
						contentArray.push('<input type="hidden" name="scoreList['+allDataRow+'].situationType" value="'+array1[y]["typeKey"]+'" />');
						contentArray.push('</li>');
						contentDataRow++;
						allDataRow++;
					}
					
					contentArray.push('</ul></td></tr>');
				}
				contentArray.push('<tr>');
				contentArray.push('<td>满意度得分</td>');
				contentArray.push('<td><ul><li>');
				contentArray.push('<span class="revtit">总分</span>');
				contentArray.push('<span class="totle_score" style="float:right">100分</span>');
				contentArray.push('<input type="hidden" class="final_score" value="100" />');
				contentArray.push('</li></ul></td>');
				contentArray.push('</tr></table></div>');
				
				contentStr = contentArray.join('');
				$(this).append(contentStr);
				setScore($(this).find('.grade_demo .level>i:first'));
				if(status == '999'){
					$(this).find('.grade_demo').removeClass('grade_demo');
				}			
			};
	}(jQuery));
	
	