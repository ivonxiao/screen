var CONTEXT_PATCH = '';
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
		addUrl: CONTEXT_PATCH + '',
		mutilAddUrl : CONTEXT_PATCH + '',
		delUrl: CONTEXT_PATCH + '',
		downloadUrl: CONTEXT_PATCH + '',
		viewUrl: CONTEXT_PATCH + '',
		viewTypeUrl: CONTEXT_PATCH,
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