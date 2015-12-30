requirejs.config({
	baseUrl: 'js/static',
	paths: {
		app: '../app'
	}
});

requirejs(['jquery.sparkline'],function(sparkline) {
	console.log(sparkline);
	$('.inlinesparkline').sparkline(); 
	var myvalues = [10,8,5,7,4,4,1];
	$('.dynamicbar').sparkline(myvalues, {type: 'bar', barColor: 'green'} );
});