
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
function addUrlParam(url, name, value) {
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
}
/**
 * 扩展checkbox方法values，多选获取选中值的方法，多个以逗号分隔
 * @class jquery扩展checkbox添加values方法，多选获取选中值的方法，多个以逗号分隔
 */
;
(function($) {
    jQuery.extend(jQuery.fn, {
        values: function(datas) {
            if ($(this).not(':checkbox').length > 0) return [];
            var chkValue = [];
            if (datas){
                chkValue = datas.split(','); 
                for (var i = 0; i < chkValue.length; i++){
                    $(this).each(function(){
                        if($(this).val() == chkValue[i]){
                            $(this).prop('checked',true);
                        }
                     });
                }
            }else{
                $(this).each(function(){
                    if(!$(this).prop('disabled') && $(this).is(":checked")){
                        chkValue.push($(this).val());  
                    }
                 });
                return chkValue.join(',');
            }
            
        }
    });
})(jQuery);
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
    } else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}
/**
 * 将form属性转化为JSON对象，支持复选框和select多选
 * @param {Object} $
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
;
(function($){
    $.fn.serializeJson = function(){
        var serializeObj = {};
        var array = this.serializeArray();
        $(array).each(function(){
            if(serializeObj[this.name]){
                if($.isArray(serializeObj[this.name])){
                    serializeObj[this.name].push(this.value);
                }else{
                    serializeObj[this.name]=[serializeObj[this.name],this.value];
                }
            }else{
                serializeObj[this.name]=this.value;
            }
        });
        return serializeObj;
    };
    $.fn.json2Form = function(json) {
        var _this = this;
        jQuery.each(jQuery(_this).serializeArray(),function(index) {
            var name = this['name'];
            for (var a in json) {
                var key = "";
                var val = "";
                if (name.indexOf('.') != -1) {
                    key = name.split('.')[0];
                    var getval = name.split('.')[1];
                    val = json[a][getval];
                } else {
                    key = name;
                    val = json[a];
                }
                if (jQuery.trim(key) == jQuery.trim(a)) {
                    var eve = jQuery(_this).find("[name='" + name + "']");
                    if (jQuery(eve).length > 1) {
                        for (var i = 0; i < jQuery(eve).length; i++) {
                            //判断单选按钮  
                            if (jQuery(jQuery(eve)[i]).attr("type") == 'radio') {
                                if (jQuery(jQuery(eve)[i]).val() == val) {
                                    jQuery(jQuery(eve)[i]).prop("checked", true);
                                }
                            }
                        }
                    } else {
                        jQuery(eve).val(val);
                    }
                }
            }
        });
    };
    jQuery.fn.getHTML = function(url) {
        var xhr,
            _self = this;
        xhr = $.ajax({
            url: url,
            type: 'get',
            dataType: 'html',
            cache: false
        });
        xhr.done(function(res) {
            _self.html(res);
        });
        return xhr;
    };
})(jQuery);

/**
 * 浮层。
 * @namespace jQuery扩展浮层封装
 * @return void
 */
;
(function() {
    jQuery.extend(jQuery.fn, {
        _createMask: function() {
            var divMaskId = "_maskDivId";
            if (!document.getElementById(divMaskId)) {
                $('<div id="' + divMaskId + '" style="display:none;"></div>').appendTo('body');
            }
            this._mask = $('#' + divMaskId);
            this._mask.css({
                background: '#ccc',
                filter: 'alpha(opacity=60)',
                '-moz-opacity': 0.6,
                opacity: 0.6,
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                'z-index': 999
            });
            this._mask.show();
            return this._mask;
        },
        hideMask: function() {
            $('#_maskDivId').hide();
        },
        floatDiv: function(options) {
            var defaults = {};
            this._YQ = $.extend(defaults, options);
            var show = this._YQ.show;
            var _this = this;
            if (this._YQ && !show) {
                $(_this).slideUp(200);
                return;
            }
            $(this).slideDown(200);
        }
    });
})(jQuery);
/**
 * 显示进度条
 */
var showLoading = function(){
    if (!document.getElementById('_loading')){
        $('body').append('<div id="_loading" style="position: fixed; top: 40%;left:50%;margin-left: -100px;margin-top:-15px;width:200px;height:30px;background-color: #f5f5f5;text-align:center;z-index:1000;"><div style="margin-top:5px;"><img src="../../images/loading.gif"/><span style="margin-left:10px;">正在处理,请稍候...</span></div></div>');
    }
    $('#_loading').floatDiv({show:true});
}
/**
 * 隐藏进度条
 */
var hideLoading = function(){
    $('#_loading').floatDiv({show:false});
}
var ajaxSubmit = function(options) {
    return $.ajax({
        type: 'post',
        data: options.data,
        dataType: 'json',
        url: options.url
    });
};
$(document).ajaxComplete(function(event, xhr, settings){
    hideLoading();
    try{
        var result = jQuery.parseJSON(xhr.responseText);
        /* 用户会话失效或为登录，重定向至登录页面 */
        if(result && result.data && result.data.sessionInvalid && result.data.redirectUrl) {
            window.location.replace(result.data.redirectUrl);
        }
    }catch(e){}
});
$(document).ajaxStart(function(event, jqxhr, settings){
    showLoading();
});
/**
弹出框及提示
 */
(function(win) {
    if(!win.bootbox) {
        return;
    }
    win.Q_Alert = function(content,callback) {
        bootbox.alert(content,callback);
    };
    win.Q_Confirm = function(content,callback){
        bootbox.setDefaults({
            locale : 'zh_CN'
        });
        var _defaults = {
            message: content,
            buttons: {
              confirm: {
                 label: "确定",
                 className: "btn-danger btn-sm",
              },
              cancel: {
                 label: "取消",
                 className: "btn-sm",
              }
            },
            callback: function(result) {
                callback.call(this,result);
            }
          };
        bootbox.confirm(_defaults);
    };
    win.Q_Prompt =  function(content,callback){
        bootbox.setDefaults({
            locale : 'zh_CN'
        });
        bootbox.prompt(content, function(result) {
            if (typeof callback === 'function'){
                callback.call(this,result);
            }
        });
    };
    win._baseTip = function(options) {
        var defaults = {
            content: '操作完成',
            'class': 'jk-alert-tip',
            type: 1,
            close: false,
            autoClose: false,
            autoTime: 1500
        };
        defaults= $.extend(defaults,options);
        var ret = [];
        switch(defaults.type) {
            case 1:
                // 通知
                ret.push('<div class="' + defaults['class'] + ' alert alert-info alert-dismissible fade in" role="alert">');
                break;
            case 2:
                //成功
                ret.push('<div class="' + defaults['class'] + ' alert alert-success alert-dismissible fade in" role="alert">');
                break;
            case 3:
                ret.push('<div class="' + defaults['class'] + ' alert alert-danger alert-dismissible fade in" role="alert">');
                break;
        }
        if(defaults.close) {
            ret.push('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
        };
        ret.push(defaults.content);
        ret.push('</div>')
        var $elem = $(ret.join('')).appendTo('body');
        console.log($elem)
        if(defaults.autoClose) {
            setTimeout(function() {
                $elem.alert('close');
            },defaults.autoTime);
        }
        if(defaults.callback) {
            $elem.on('closed.bs.alert',defaults.callback);
        }
    };
    win.TipInfo = function(options) {
        var options = $.extend({},{close: true},options);
        win._baseTip(options);
    };
    win.TipSuccess = function(options) {
        var options = $.extend({},{type:2,autoClose: true},options);
        win._baseTip(options);
    };
    win.TipFail = function(options) {
        var options = $.extend({},{type:3,close: true,'class': 'jk-alert-fail'},options);
        win._baseTip(options);
    };
})(window);
/*$.fn.createKindEditor = function(options) {
    var width = this.width(),
        height = this.height();
}*/
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
/*bs table实例化*/
(function($) {
    $.fn.bsTableInit = function(options) {
        var defOptions = {
            pageSize: 25,
            cache: false,
            striped: true, 
            sidePagination: 'server',
            pagination: true,
            idField: 'id', //记录键
            uniqueId: 'id', //表格行的唯一键
            spanPageCheck: false, //支持跨页选择
            spanPageSavedKey: 'selected-item-datas',
            selectItemName: 'btSelectItem'
        };
        var _self = this;
        $.fn.bootstrapTable.locales['zh-CN'] = {
            formatLoadingMessage: function () {
                return '正在努力地加载数据中，请稍候……';
            },
            formatRecordsPerPage: function (pageNumber) {
                return '每页显示 ' + pageNumber + ' 条';
            },
            formatShowingRows: function (pageFrom, pageTo, totalRows) {
                return '第 ' + pageFrom + ' 到第 ' + pageTo + ' 条，共 ' + totalRows + ' 条';
            },
            formatSearch: function () {
                return '搜索';
            },
            formatNoMatches: function () {
                return '没有找到匹配的记录';
            },
            formatPaginationSwitch: function () {
                return '隐藏/显示分页';
            },
            formatRefresh: function () {
                return '刷新';
            },
            formatToggle: function () {
                return '切换';
            },
            formatColumns: function () {
                return '列';
            }
        };
        $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);


        this.getSelections = function() {
            return _self.data(defOptions.spanPageSavedKey) || _self.bootstrapTable('getSelections');
        };
        this.refresh = function(url,params) {
            var argLen =arguments.length;
            if(argLen ===0) {
                _self.bootstrapTable('refresh');
            }
            else if(argLen ===1 && typeof url === 'string') {
                _self.bootstrapTable('refresh',{url: url});
            }
            else if(argLen === 2 && $.isPlainObject(params)) {
                _self.bootstrapTable('refresh',{url: url,query: params});
            }
            _self.data(defOptions.spanPageSavedKey,[]);
        };
        function initEvent() {
            _self.bootstrapTable($.extend(defOptions,defOptions,options));
            _self.data(defOptions.spanPageSavedKey,[]);
             if(defOptions.spanPageCheck) {
            // 假设删除与增加记录后会刷新列表
                _self.on('check.bs.table',function(e,row,$e) {
                   saveOneItem(row);
                })
                .on('uncheck.bs.table',function(e,row,$e) {
                    delOneItem(row);
                })
                .on('check-all.bs.table',function(e,rows) {
                    $.each(rows,function() {
                        saveOneItem(this);
                    });
                })
                .on('uncheck-all.bs.table',function(e,rows) {
                    $.each(rows,function() {
                        delOneItem(this);
                    });
                })
                .on('post-body.bs.table',function() {
                    checkedSelectedItem();
                });
            } 
        } 
        function itemInSavedArray(item) {
            var ret = -1,
                arr = _self.data(defOptions.spanPageSavedKey),
                key = defOptions.idField;

            $.each(arr,function(index) {
                if(this[key] === item[key]) {
                    ret = index;
                    return false;
                }
            });
            return ret;
        }
        function saveOneItem(item) {
            if(itemInSavedArray(item) === -1) {
                var old = _self.data(defOptions.spanPageSavedKey);
                old.push(item);
                _self.data(defOptions.spanPageSavedKey,old);
            }
        }
        function delOneItem(item) {
            var index =itemInSavedArray(item);   
            if(index !== -1) {
                var old = _self.data(defOptions.spanPageSavedKey);
                old.splice(index,1);
                _self.data(defOptions.spanPageSavedKey,old);
            }
        }
        function checkedSelectedItem() {
            var curPageData = _self.bootstrapTable('getData',true),
                selectedData = _self.data(defOptions.spanPageSavedKey),
                key = defOptions.uniqueId;
            $.each(curPageData,function(){
                var tmp = this;
                $.each(selectedData,function() {
                    if(tmp[key] == this[key]) {
                        var checkInput = _self.find('[data-uniqueid='+this[key]+']').find('[name=' + defOptions.selectItemName +']');
                        checkInput.prop('checked',true);
                        return false;
                    }
                });
            });
        }
        initEvent();
        return this;
    }
})(jQuery);

(function(){
    //placeholder简单处理
    var isInputSupported = 'placeholder' in document.createElement('input');
    if(isInputSupported) return;
    $(document).on('focus','input[placeholder],textarea[placeholder]',function(){
        var placeholderText = $(this).attr('placeholder'),
            val = this.value;
        if(placeholderText == val) {
            this.value = '';
        }
    })
    .on('blur','input[placeholder],textarea[placeholder]',function(){
        var placeholderText = $(this).attr('placeholder'),
            val = this.value;
        if('' === $.trim(val)) {
            this.value = placeholderText;
        }
    });
})();