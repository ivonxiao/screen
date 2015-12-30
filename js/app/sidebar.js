$(function() {
	$('#sidebar').on('click','.js-nav-link',function() {
		var url = this.href;
		$('#main_content').load(url);
		return false;
	});
});