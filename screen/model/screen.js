$(function() {
	var Screen = Backbone.Model.extend({
		defaults: {
			name: '',
			id: '',
			title: '',
			description: '',
			resolution: '1080P',
			category: [0,0], //分两类
			min_version: 1, // 数字
			grid_rows: 3,
			grid_cols: 5,
			extra_col: 0,
			logo_image: [], //多张logo
			background_image: '',
			elements: ElementList
		}
	});
});