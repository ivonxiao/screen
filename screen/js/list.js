$(function() {
	var REQUEST_URL = {
		'edit_screen_by_id' : '',
		'get_list' : 'http://ivonxiao.github.io/screen/screen/model/splitscreen.list.json'
	}
	$('.js-date-widget').datetimepicker({
    	format: "yyyy-mm-dd hh:ii"
    });
    $('#splitscreen_table').bsTableInit({
		url: REQUEST_URL.get_list,
		spanPageCheck: false,
		uniqueId: 'screen_id',
		columns:[
		{
			field: 'screen_id',
			title: '分屏ID'
		},{
			field: 'screen_name',
			title: '分屏名称'
		},
		{
			field: 'state',
			title: '屏幕状态'
		},{
			field: 'operate_time',
			title: '屏幕操作时间'
		},
		{
			field: 'release_time',
			title: '屏幕发布时间'
		},
		{
			title: '操作',
			formatter: function(value,row,index) {
				var arr = [];
				arr.push('<i class="fa fa-info-circle" title="详情"></i>');
				arr.push('<i class="fa fa-check-square" title="审核"></i>');
				arr.push('<i class="fa fa-clipboard" title="复制"></i>');
				arr.push('<i class="fa fa-pencil-square" title="编辑"></i>');
				arr.push('<i class="fa fa-eye" title="预览"></i>');
				return arr.join('');

			}
		}]
	});
	var $table = $('#splitscreen_table');
	// 编辑分屏
	$table.on('click','.fa-pencil-square',function() {
		var screenId = $(this).closest('tr').data('uniqueid');
		var url = 'http://ivonxiao.github.io/screen/screen/screen_manage.html';
		$('#main_content').load(url,function() {
			renderScreenById(screenId);
		});	
	});
});