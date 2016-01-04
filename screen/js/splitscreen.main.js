define(function(require,exports,module){	
	function init() {
		/*require([__uri('../template/element2.cmd.js'),__uri('../template/elementlist.cmd.js')],function() {
			var splitscreen = require(__uri('./create_splitscreen.cmd.js'));
			splitscreen.init();
		});*/
		var splitscreen = require('http://ivonxiao.github.io/screen/screen/js/create_splitscreen.cmd.js');
			splitscreen.init();
	}
	exports.init = init;
});