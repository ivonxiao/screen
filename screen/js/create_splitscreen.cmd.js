define(function(require,exports,module) {
	require('http://ivonxiao.github.io/screen/screen/template/element2.cmd.js');
	require('http://ivonxiao.github.io/screen/screen/template/elementlist.cmd.js');
var SPLITSCREEN_REQUEST_URL = {
	'add_splitscreen_prop' : '/splitscreen/addprop',
	'get_screen_info': 'http://ivonxiao.github.io/screen/screen/model/splitscreen.info.json',
	'get_image_modal' : 'http://ivonxiao.github.io/screen/screen/element.img.html',
	'get_video_modal' : 'http://ivonxiao.github.io/screen/screen/element.video.html',
	'get_webpage_modal' : 'http://ivonxiao.github.io/screen/screen/element.webpage.html',
	'get_subscreen_modal' :　'http://ivonxiao.github.io/screen/screen/element.subscreen.html'
};
var CONSTVAL = {
	'list_content_text' : 1,
	'list_content_image' : 2,
	'list_direction_vertical' : 2,
	'list_direction_horizontal': 1
}
function renderScreenById(screen_id) {
	$.ajax({
		url: SPLITSCREEN_REQUEST_URL.get_screen_info,
		data: screen_id,
		type: 'get',
		dataType: 'json',
		cache: false
	}).done(function(res) {
		console.log(res);
		$.extend(res,{
			container: $('#screen_oprate_wrapper')
		});	
		var screen1 = new SplitScreen(res);
		screen1.gridster.data('screen',screen1);
		setForm(res);
		setGridster(res);
	});
}
// 参数映射关系
var SPLITSCREEN_ARGMAP = {
	'screenId' : 'splitscreen_id',
	'extra_cols' : 'splitscreen_extracol',
	"rows": 'splitscreen_gridrow',
	"cols": 'splitscreen_gridcol',
	"title": "splitscreen_title",
	"name": "splitscreen_name",
	"description": "splitscreen_description",
	"category1": 'splitscreen_category1',
	"category2": 'splitscreen_category2',
	"min_version": 'splitscreen_version',
	"resolution": "splitscreen_resolution",
	"logo": "splitscreen_logo",
	"bglogo": "splitscreen_bglogo"
};
function setForm(data) {
	var input;
	var bgGrid = $('.base-bg-gridster');
	for(var key in SPLITSCREEN_ARGMAP) {
		input = $('#' + SPLITSCREEN_ARGMAP[key]);
		if(input.is(':file')) {
			if(key === 'bglogo') {
				//console.log(data[key])
				bgGrid.css('background','url(' + data[key] + ')');
			}
		}
		else {
			input.val(data[key]);
		}
	}
}
function setGridster(data) {
	var $grid = $('.js-oprate-grid');
	var gridster = $grid.data('gridster'),
		screen = $grid.data('screen'),
		item,
		type;
	$.each(data.layout,function(idx,val){
		gridster.add_widget('<li></li>',this.size_x,this.size_y,this.col,this.row);
		item = $grid.find('.gs-w:last-child');
		type = data.elements[idx].type;
		//显示操作图标
		screen.addActionIcon();
		//显示元素栅格内容
		screen.renderItemAction(item,type);
	});
	screen.makeItemAcceptDrop();
}
var initScreenBaseGrid = function(row,col) {
	var i,
		j,
		arr = [];
	arr.push('<div class="gridster"><ul class="base-bg-gridster">');
	for(i=1;i<=row;i++) {
		for(j=1;j<=col;j++) {
			arr.push('<li data-row="' + i + '" data-col="' + j + '" data-sizex="1" data-sizey="1"></li>');
		}
	}
	arr.push('</ul></div>');
	return arr.join('');
};

var Element = function(options) {
	this.type = 1;
	this.name = '';
	this.src = 'http://ivonxiao.github.io/screen/images/default.png';
	this.thumbnail_src = this.src;
	this.init(options);
}
Element.prototype.init = function(options) {
	$.extend(this,options);
}



var SplitScreen = function(options) {
	this.splitscreen_extracol = 0;
	this.splitscreen_gridrow =  3;
	this.splitscreen_gridcol =  5;
	this.baseHtml = '<div class="gridster"><ul class="js-oprate-grid"></ul></div>';
	this.widget_margins = [10,10];
	this.widget_base_dimensions = [140,140];
	this.elements = [];
	this.init(options);
}
SplitScreen.prototype.init = function(options) {
	$.extend(this,options);
	this.initGridster();
	this.container.css('position','relative');
	this.initEvent();
}
SplitScreen.formatter = function(data) {
	return data;
};
//初始化栅格
SplitScreen.prototype.initGridster = function() {
	var html;
	var height = (this.widget_base_dimensions[1] + this.widget_margins[1]) * this.splitscreen_gridrow + 50;
	//初始化栅格背景
	html =initScreenBaseGrid(this.splitscreen_gridrow,this.splitscreen_gridcol + this.splitscreen_extracol);
	this.container.append(html);
	this.container.height(height+ 'px');
	this.makeGridster($('.base-bg-gridster'));
	$('.base-bg-gridster').css({
		'position': 'absolute',
		'z-index': 1
	});
	this.screen_width = $('.base-bg-gridster').width();
	this.screen_height = $('.base-bg-gridster').height();
	//初始化操作栅格
	this.initOperateGrid();		
}
SplitScreen.prototype.makeGridster = function(container) {
	container.gridster({
		widget_margins: this.widget_margins,
        widget_base_dimensions: this.widget_base_dimensions,
       	resize: {
       		enabled: true
       	},
       	max_cols: this.splitscreen_gridcol + this.splitscreen_extracol,
       	max_rows: this.splitscreen_gridrow
	});
}
//生成栅格操作区
SplitScreen.prototype.initOperateGrid = function() {
	var screenOpt = $(this.baseHtml);
	screenOpt.attr('id','').css({
		'position': 'absolute',
		'z-index': 2,
		'width': this.screen_width,
		'height': this.screen_height
	});
	this.container.append(screenOpt);
	this.makeGridster(screenOpt.find('ul'));
	this.gridster = screenOpt.find('ul');
}
//初始化轮询列表
SplitScreen.prototype.initCausourlList = function() {
	$.each(this.elements,function(idx,val){
		if(this.type == 1 || this.type == 2) {
			this.list_direction = CONSTVAL.list_direction_horizontal;
			this.list_content = CONSTVAL.list_content_text;
		}
	});
}
// 添加元素到指定的容器块
SplitScreen.prototype.addElement2Container = function(idx,type) {
	/*
	type
	1: 图片, 2: 视频, 3: 网页, 4: 二级屏幕
	 */
	/*var element = new Element({type: type});
	switch(element.type) {
		case 1:
		case 2:
			if(this.elements[idx]) {
				this.elements[idx].push(element);
			}
			else {
				this.elements[idx] = [element];
			}
			break;
		case 3:
		case 4:

			this.elements[idx] = element;
			break;
	}
	if(!this.elements[idx].type) {
		this.elements[idx].type = type;
	}*/
	var element = new Element({type: type});
	if(!this.elements[idx]) {
		this.elements[idx] = {type: type,list:[]};
	}
	switch(element.type) {
		case 1:
		case 2:
			this.elements[idx].list.push(element);
			break;
		case 3:
		case 4:
			this.elements[idx].list = [element];
			break;
	}
}
SplitScreen.prototype.makeItemAcceptDrop = function() {
	var self = this;
	this.gridster.find('li').droppable({
		drop: function(event,ui) {
			var targetGrid = $(this),
				idx = targetGrid.index(),
				type = +ui.helper.data('type');
			//元素类型不同则不处理
			if(self.elements[idx] && self.elements[idx].type !== type) return;
			//网页及二级屏幕元素拖放添加时，当已存在一个元素时不处理
			if((type == 3 || type == 4) && self.elements[idx]) return;
			self.addElement2Container(idx,type);
			self.renderItemAction(targetGrid,type);
			self.initCausourlList();
		}
	});
};
SplitScreen.prototype.renderItemAction = function(item,type) {
	var index = item.index();
	var arr = [];
	item.find('.element-list-wrapper').remove();

	switch(type) {
		case 1:
		case 2:

			//if(this.elements[index] && this.elements[index].length) {
			if(this.elements[index] && this.elements[index].list.length) {
				var templateFunc = Handlebars.templates['element2.tpl'];
				var html = templateFunc({
					element_block_id: uniqueID(),
					elements: this.elements[index].list
				});
				item.find('.gs-resize-handle').before(html);
				item.find('li').eq(0).addClass('active');
				item.find('.item').eq(0).addClass('active');
				//显示元素操作按钮
				item.find('.hidden').removeClass('hidden');
			}
			break;
		case 3:
		case 4:
			if(this.elements[index]) {
				arr.push('<div class="element-list-wrapper"><img src="');
				arr.push(this.elements[index].list[0].src);
				arr.push('"></div>');
				item.find('.gs-resize-handle').before(arr.join(''));
				//显示元素操作按钮
				item.find('.hidden').removeClass('hidden');
			}
			break;
	}
}
SplitScreen.prototype.addActionIcon = function() {
	var arr = [];
	var item = this.gridster.find('.gs-w:last-child');
	arr.push('<div class="element-operate-icons">');
	arr.push('<i class="fa fa-cog hidden js-element-seticon" title="当前元素属性" data-toggle="modal"></i>');
	arr.push('<i class="fa fa-bars" title="设置元素全局属性" data-toggle="modal" data-target="#elementGlobalPropModal"></i>');
	arr.push('<i class="fa fa-times-circle hidden" title="删除当前元素"></i>');
	arr.push('<i class="fa fa-trash-o" title="删除元素容器"></i>');
	arr.push('</div>');
	item.append(arr.join(''));
}

function uniqueID() {
	return Math.floor(Math.random() * 10000).toString(10) + (new Date()).getTime().toString();
}
SplitScreen.prototype.initEvent = function() {
	var self = this;
	var grid_instance = this.gridster.data('gridster');
	this.gridster.on('add_element',function() {
		self.makeItemAcceptDrop();
		self.addActionIcon();
	});

};

function saveLayoutAndElement() {
	var grid = $('.js-oprate-grid');
	var layoutObj = grid.data('gridster').serialize();
	var screen = grid.data('screen');
	$.extend(screen,{
		layout: layoutObj
	});
}
/**
 * [getCurrentElementIndex description]
 * @param  {[type jqObj]} item [栅格单元格元素]
 * @return {[type 数组]}      [description 第一个元素是所在单元格的位置，第二个元素是元素所在列表的序号]
 */
function getCurrentElementIndex(item) {
	var currentElementBlock = item.closest('.gs-w'),
		blockIndex = currentElementBlock.index();
	var currentElementIndex = 0;
	var screen = $('.js-oprate-grid').data('screen');
	var type = screen.elements[blockIndex].type;
	if(type == 1 || type == 2) {
		currentElementIndex = currentElementBlock.find('.carousel-indicators').find('li.active').index();
	}
	return [blockIndex,currentElementIndex];
}
function renderElementContent(blockIndex,elementIndex,form) {
	var screen = $('.js-oprate-grid').data('screen');
	form.trigger('reset');
	form.json2Form(screen.elements[blockIndex].list[elementIndex]);
}


function domInit() {
	var $pageContent = $('#page_inner_content');


	//$(function() {
		var $screenContainer = $('#screen_oprate_wrapper');
		//var template = Handlebars.compile($('#template_screen_widget').html());

		//页面事件处理
		//初始化文件上传控件
		$('input[type=file]').ace_file_input({

		});
		//添加画布
		$('.js-add-canvas').on('click',function() {
			var grid = $('.js-oprate-grid');
			var grider_instance = grid.data('gridster');
			var newgrid = grider_instance.add_widget('<li></li>');
			newgrid && grid.trigger('add_element');
		});
		//设置元素拖动操作
		$('.element-list li').draggable({
			helper: function() {
				return $(this).find('img').clone();
			},
			revert: 'invalid',
			cursor: 'move',
			containment: $('.page-content'),
			zIndex: 100,
			stack: '.gridster'
		});
		//保存分屏属性
		$('#next2element').on('click',function() {
			var $form = $(this).closest('form');
			var serializeJson = $form.serializeJson();
			var logoURL= '';
			var bgLogoURL = '';
			$.extend(serializeJson,{
				logo: logoURL,
				bglogo: bgLogoURL
			});
			if($('#splitscreen_id').val() != '') {
				$.extend(serializeJson,{
					scrennId:$('#splitscreen_id').val()
				});
			}
			//console.log(serializeJson);
			ajaxSubmit({
				url : SPLITSCREEN_REQUEST_URL.add_splitscreen_prop,
				data: serializeJson
			}).done(function(data) {
				//首次添加时由后台返回屏幕ID
				var options = SplitScreen.formatter(data);
				$.extend(options,{
					container: $screenContainer
				});
				if($('.js-oprate-grid').data('screen') === undefined) {
					var screen1 = new SplitScreen(options);
					screen1.gridster.data('screen',screen1);
				}
				$('.wizard').wizard('next');
			});
		});

		//点击弹出轮播列表
		$pageContent.on('click','.js-trigger-elementlist',function() {
			var $target = $(this),
				$gridster = $('.js-oprate-grid');
			var screen = $gridster.data('screen');
			var $item = $target.parents('.gs-w');
			var index = $item.index();
			var templateFunc = Handlebars.templates['elementlist.tpl'];
			var html = templateFunc({
				elements: screen.elements[index].list
			});

			var listContainer = $('.listcarousel-setting-container');
			listContainer.remove();
			$(html).appendTo('body');
			listContainer = $('.listcarousel-setting-container');

			var direction = screen.elements[index].list_direction,
				content_type = screen.elements[index].list_content;
			toggleElementList(direction,content_type,listContainer,$item);
		})
		
		.on('shown.bs.modal',function(e) {
			//元素编辑弹出框中设置元素的位置信息
			var target = $(e.target);
			var relatedTarget = $(e.relatedTarget);
			var pos;
			
			if(!relatedTarget.hasClass('js-element-seticon')) return;
			pos = getCurrentElementIndex(relatedTarget);
			target.data('grid-index',pos[0]);
			target.data('item-index',pos[1]);
			//渲染元素内容
			renderElementContent(pos[0],pos[1],target.find('form'));
		})
		.on('click','#modal_apply_image_info',function() {
			//保存图片信息
			var outerWrapper = $(this).closest('.modal');
			var $form = outerWrapper.find('form');
			var json = $form.serializeJson();
			var screen = $('.js-oprate-grid').data('screen');
			var gridIndex = outerWrapper.data('grid-index'),
				itemIndex = outerWrapper.data('item-index');
			var element = new Element(json);
			screen.elements[gridIndex].list[itemIndex] = element;
		})
		.on('click','#modal_apply_subscreen_info',function(){
			//保存二级屏幕信息
			var outerWrapper = $(this).closest('.modal');
			var $form = outerWrapper.find('form');
			var json = $form.serializeJson();
			var screen = $('.js-oprate-grid').data('screen');
			var gridIndex = outerWrapper.data('grid-index');
			var element = new Element(json);
			screen.elements[gridIndex] = element;
		})
		.on('click','#next_to_authorize',function() {
			//进入分屏授权页面
			$('.wizard').wizard('next');
		})
		.on('click','.btn_wizard_back',function() {
			//返回上一级向导页面
			$('.wizard').wizard('previous');
		})
		.on('click','.element-operate-icons .fa-cog',function() {
			//配置元素
			function loadModal(modal,url,callback) {
				var xhr;
				if(modal.length === 0) {
					xhr = $.ajax({
						url: url,
						dataType: 'html',
					}).done(function(data) {
						$(data).appendTo($pageContent);
						$.isFunction(callback) && callback();
					});
				}
				return xhr;
			}
			var target = $(this);
			var modal;
			var currentElementBlock = $(this).parents('li'),
				blockIndex = currentElementBlock.index();
			var screen = $('.js-oprate-grid').data('screen');
			var type = screen.elements[blockIndex].type;
			var xhr;
			switch(type) {
				case 1:
					target.attr('data-target','#elementImageModal');
					modal = $('#elementImageModal');
					xhr = loadModal(modal,SPLITSCREEN_REQUEST_URL.get_image_modal,function(){
						target.trigger('click');
					});
					break;
				case 2:
					target.attr('data-target','#elementVideoModal');
					modal = $('#elementVideoModal');
					xhr = loadModal(modal,SPLITSCREEN_REQUEST_URL.get_video_modal,function(){
						target.trigger('click');
					});
					break;
				case 3:
					target.attr('data-target','#elementWebpageModal');
					modal = $('#elementWebpageModal');
					xhr = loadModal(modal,SPLITSCREEN_REQUEST_URL.get_webpage_modal,function(){
						target.trigger('click');
					});
					break;
				case 4:
					target.attr('data-target','#elementSubscreenModal');
					modal = $('#elementSubscreenModal');
					xhr = loadModal(modal,SPLITSCREEN_REQUEST_URL.get_subscreen_modal,function(){
						target.trigger('click');
					});
					break;
			}
		})
		.on('click','.listcarousel-setting-container .fa-times-circle-o',function() {
			$('.listcarousel-setting-container').hide();
		})
		.on('click','.element-operate-icons .fa-times-circle',function() {
			//删除元素
			
			var currentElementBlock = $(this).parents('li'),
				blockIndex = currentElementBlock.index();
			var screen = $('.js-oprate-grid').data('screen');
			var type = screen.elements[blockIndex].type;
			if(type == 1 || type == 2) {
				var currentElementIndex = currentElementBlock.find('.carousel-indicators').find('li.active').index();
				screen.elements[blockIndex].list.splice(currentElementIndex,1);			
				//元素个数是零时，隐藏元素操作图标
				if(screen.elements[blockIndex].list.length === 0) {
					screen.elements.splice(blockIndex,1,undefined);
					currentElementBlock.find('.fa-cog,.fa-times-circle').addClass('hidden');
				}
			}
			else {
				screen.elements.splice(blockIndex,1,undefined);
				currentElementBlock.find('.fa-cog,.fa-times-circle').addClass('hidden');
			}
			screen.renderItemAction(currentElementBlock,type);	
		})
		.on('click','.element-operate-icons .fa-trash-o',function() {
			//删除元素容器
			var currentElementBlock = $(this).parents('li'),
				blockIndex = currentElementBlock.index(),
				gridster = $('.js-oprate-grid').data('gridster');
			var screen = $('.js-oprate-grid').data('screen');

			gridster.remove_widget(currentElementBlock);
			screen.elements.splice(blockIndex,1);

		})
		.on('click','#save_screen_btn',function() {
			//保存屏幕
			var screen = $('.js-oprate-grid').data('screen');
			saveLayoutAndElement();

		});
		/**
		 * [toggleElementList 元素列表]
		 * @param  {[Number]} direction [1:水平,2:垂直]
		 * @param  {[Number]} content   [1: 文字, 2: 图片]
		 * @param  {[jqObj]} container  [元素列表容器]
		 * @param  {[jqObj]} canvas  [当前操作栅格块]
		 * @return {[type]}           [description]
		 */
		function toggleElementList(direction,content,container,canvas) {
			var posLeft,
				posTop,
				texts = container.find('.element-name'),
				imgs =  container.find('.element-thumbnailimg'),
				items = container.find('li'),
				items_len = items.length,
				offset = canvas.offset(),
				baseWidth = canvas.width(),
				baseHeight = canvas.height();
			if(content === 1) {
				texts.show();
				imgs.hide();
			}else {
				texts.hide();
				imgs.show();
			}
			if(direction === 1) {
				posTop = (offset.top + baseHeight + 10) + 'px';
				container.css({
					'top' : posTop,
					'left': offset.left + 'px',
					'height': '140px',
					'min-width': '140px',
					'max-width' : '480px'
				}).addClass('horizontal').removeClass('vertical');
				var itemWidth = Math.floor(container.width() / items_len);
				items.width(itemWidth);
			}
			else {
				posLeft = (offset.left + baseWidth + 10) + 'px';
				container.css({
					'top' : offset.top + 'px',
					'left': posLeft,
					'width': '140px',
					'min-height': '140px',
					'max-height' : '480px'
				}).addClass('vertical').removeClass('horizontal');
				var itemHeight = Math.floor(container.height() / items_len);
				items.height(itemHeight);
			}
		}
		//向导切换
		$('.wizard').on('changed.fu.wizard',function() {
			var selectedIndex = $(this).wizard('selectedItem').step;
		});
		$('body').off('click.close_modal')
		.on('click.close_modal','.listcarousel-setting-container .fa-times-circle-o',function() {
			var container = $(this).closest('.listcarousel-setting-container');
			container.hide();
		});
}
(function() {
	var $pageContent = $('#page_inner_content');


	//$(function() {
		var $screenContainer = $('#screen_oprate_wrapper');
		//var template = Handlebars.compile($('#template_screen_widget').html());

		//页面事件处理
		//初始化文件上传控件
		$('input[type=file]').ace_file_input({

		});
		//添加画布
		$('.js-add-canvas').on('click',function() {
			var grid = $('.js-oprate-grid');
			var grider_instance = grid.data('gridster');
			var newgrid = grider_instance.add_widget('<li></li>');
			newgrid && grid.trigger('add_element');
		});
		//设置元素拖动操作
		$('.element-list li').draggable({
			helper: function() {
				return $(this).find('img').clone();
			},
			revert: 'invalid',
			cursor: 'move',
			containment: $('.page-content'),
			zIndex: 100,
			stack: '.gridster'
		});
		//保存分屏属性
		$('#next2element').on('click',function() {
			var $form = $(this).closest('form');
			var serializeJson = $form.serializeJson();
			var logoURL= '';
			var bgLogoURL = '';
			$.extend(serializeJson,{
				logo: logoURL,
				bglogo: bgLogoURL
			});
			if($('#splitscreen_id').val() != '') {
				$.extend(serializeJson,{
					scrennId:$('#splitscreen_id').val()
				});
			}
			//console.log(serializeJson);
			ajaxSubmit({
				url : SPLITSCREEN_REQUEST_URL.add_splitscreen_prop,
				data: serializeJson
			}).done(function(data) {
				//首次添加时由后台返回屏幕ID
				var options = SplitScreen.formatter(data);
				$.extend(options,{
					container: $screenContainer
				});
				if($('.js-oprate-grid').data('screen') === undefined) {
					var screen1 = new SplitScreen(options);
					screen1.gridster.data('screen',screen1);
				}
				$('.wizard').wizard('next');
			});
		});

		//点击弹出轮播列表
		$pageContent.on('click','.js-trigger-elementlist',function() {
			var $target = $(this),
				$gridster = $('.js-oprate-grid');
			var screen = $gridster.data('screen');
			var $item = $target.parents('.gs-w');
			var index = $item.index();
			var templateFunc = Handlebars.templates['elementlist.tpl'];
			var html = templateFunc({
				elements: screen.elements[index].list
			});

			var listContainer = $('.listcarousel-setting-container');
			listContainer.remove();
			$(html).appendTo('body');
			listContainer = $('.listcarousel-setting-container');

			var direction = screen.elements[index].list_direction,
				content_type = screen.elements[index].list_content;
			toggleElementList(direction,content_type,listContainer,$item);
		})
		
		.on('shown.bs.modal',function(e) {
			//元素编辑弹出框中设置元素的位置信息
			var target = $(e.target);
			var relatedTarget = $(e.relatedTarget);
			var pos;
			
			if(!relatedTarget.hasClass('js-element-seticon')) return;
			pos = getCurrentElementIndex(relatedTarget);
			target.data('grid-index',pos[0]);
			target.data('item-index',pos[1]);
			//渲染元素内容
			renderElementContent(pos[0],pos[1],target.find('form'));
		})
		.on('click','#modal_apply_image_info',function() {
			//保存图片信息
			var outerWrapper = $(this).closest('.modal');
			var $form = outerWrapper.find('form');
			var json = $form.serializeJson();
			var screen = $('.js-oprate-grid').data('screen');
			var gridIndex = outerWrapper.data('grid-index'),
				itemIndex = outerWrapper.data('item-index');
			var element = new Element(json);
			screen.elements[gridIndex].list[itemIndex] = element;
		})
		.on('click','#modal_apply_subscreen_info',function(){
			//保存二级屏幕信息
			var outerWrapper = $(this).closest('.modal');
			var $form = outerWrapper.find('form');
			var json = $form.serializeJson();
			var screen = $('.js-oprate-grid').data('screen');
			var gridIndex = outerWrapper.data('grid-index');
			var element = new Element(json);
			screen.elements[gridIndex] = element;
		})
		.on('click','#next_to_authorize',function() {
			//进入分屏授权页面
			$('.wizard').wizard('next');
		})
		.on('click','.btn_wizard_back',function() {
			//返回上一级向导页面
			$('.wizard').wizard('previous');
		})
		.on('click','.element-operate-icons .fa-cog',function() {
			//配置元素
			function loadModal(modal,url,callback) {
				var xhr;
				if(modal.length === 0) {
					xhr = $.ajax({
						url: url,
						dataType: 'html',
					}).done(function(data) {
						$(data).appendTo($pageContent);
						$.isFunction(callback) && callback();
					});
				}
				return xhr;
			}
			var target = $(this);
			var modal;
			var currentElementBlock = $(this).parents('li'),
				blockIndex = currentElementBlock.index();
			var screen = $('.js-oprate-grid').data('screen');
			var type = screen.elements[blockIndex].type;
			var xhr;
			switch(type) {
				case 1:
					target.attr('data-target','#elementImageModal');
					modal = $('#elementImageModal');
					xhr = loadModal(modal,SPLITSCREEN_REQUEST_URL.get_image_modal,function(){
						target.trigger('click');
					});
					break;
				case 2:
					target.attr('data-target','#elementVideoModal');
					modal = $('#elementVideoModal');
					xhr = loadModal(modal,SPLITSCREEN_REQUEST_URL.get_video_modal,function(){
						target.trigger('click');
					});
					break;
				case 3:
					target.attr('data-target','#elementWebpageModal');
					modal = $('#elementWebpageModal');
					xhr = loadModal(modal,SPLITSCREEN_REQUEST_URL.get_webpage_modal,function(){
						target.trigger('click');
					});
					break;
				case 4:
					target.attr('data-target','#elementSubscreenModal');
					modal = $('#elementSubscreenModal');
					xhr = loadModal(modal,SPLITSCREEN_REQUEST_URL.get_subscreen_modal,function(){
						target.trigger('click');
					});
					break;
			}
		})
		.on('click','.listcarousel-setting-container .fa-times-circle-o',function() {
			$('.listcarousel-setting-container').hide();
		})
		.on('click','.element-operate-icons .fa-times-circle',function() {
			//删除元素
			
			var currentElementBlock = $(this).parents('li'),
				blockIndex = currentElementBlock.index();
			var screen = $('.js-oprate-grid').data('screen');
			var type = screen.elements[blockIndex].type;
			if(type == 1 || type == 2) {
				var currentElementIndex = currentElementBlock.find('.carousel-indicators').find('li.active').index();
				screen.elements[blockIndex].list.splice(currentElementIndex,1);			
				//元素个数是零时，隐藏元素操作图标
				if(screen.elements[blockIndex].list.length === 0) {
					screen.elements.splice(blockIndex,1,undefined);
					currentElementBlock.find('.fa-cog,.fa-times-circle').addClass('hidden');
				}
			}
			else {
				screen.elements.splice(blockIndex,1,undefined);
				currentElementBlock.find('.fa-cog,.fa-times-circle').addClass('hidden');
			}
			screen.renderItemAction(currentElementBlock,type);	
		})
		.on('click','.element-operate-icons .fa-trash-o',function() {
			//删除元素容器
			var currentElementBlock = $(this).parents('li'),
				blockIndex = currentElementBlock.index(),
				gridster = $('.js-oprate-grid').data('gridster');
			var screen = $('.js-oprate-grid').data('screen');

			gridster.remove_widget(currentElementBlock);
			screen.elements.splice(blockIndex,1);

		})
		.on('click','#save_screen_btn',function() {
			//保存屏幕
			var screen = $('.js-oprate-grid').data('screen');
			saveLayoutAndElement();

		});
		/**
		 * [toggleElementList 元素列表]
		 * @param  {[Number]} direction [1:水平,2:垂直]
		 * @param  {[Number]} content   [1: 文字, 2: 图片]
		 * @param  {[jqObj]} container  [元素列表容器]
		 * @param  {[jqObj]} canvas  [当前操作栅格块]
		 * @return {[type]}           [description]
		 */
		function toggleElementList(direction,content,container,canvas) {
			var posLeft,
				posTop,
				texts = container.find('.element-name'),
				imgs =  container.find('.element-thumbnailimg'),
				items = container.find('li'),
				items_len = items.length,
				offset = canvas.offset(),
				baseWidth = canvas.width(),
				baseHeight = canvas.height();
			if(content === 1) {
				texts.show();
				imgs.hide();
			}else {
				texts.hide();
				imgs.show();
			}
			if(direction === 1) {
				posTop = (offset.top + baseHeight + 10) + 'px';
				container.css({
					'top' : posTop,
					'left': offset.left + 'px',
					'height': '140px',
					'min-width': '140px',
					'max-width' : '480px'
				}).addClass('horizontal').removeClass('vertical');
				var itemWidth = Math.floor(container.width() / items_len);
				items.width(itemWidth);
			}
			else {
				posLeft = (offset.left + baseWidth + 10) + 'px';
				container.css({
					'top' : offset.top + 'px',
					'left': posLeft,
					'width': '140px',
					'min-height': '140px',
					'max-height' : '480px'
				}).addClass('vertical').removeClass('horizontal');
				var itemHeight = Math.floor(container.height() / items_len);
				items.height(itemHeight);
			}
		}
		//向导切换
		$('.wizard').on('changed.fu.wizard',function() {
			var selectedIndex = $(this).wizard('selectedItem').step;
		});
		$('body').off('click.close_modal')
		.on('click.close_modal','.listcarousel-setting-container .fa-times-circle-o',function() {
			var container = $(this).closest('.listcarousel-setting-container');
			container.hide();
		});
	//}); 
})();
	module.exports = {
		init : function() {
			domInit();
		},
		renderScreenById : function(screenId) {
			renderScreenById(screenId);
		}
	};	
})