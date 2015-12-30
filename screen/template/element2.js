(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['element2.tpl'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=container.escapeExpression;

  return "			    <li data-target=\"#"
    + alias1(container.lambda((depths[1] != null ? depths[1].element_block_id : depths[1]), depth0))
    + "\" data-slide-to=\""
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"index","hash":{},"data":data}) : helper)))
    + "\"></li>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "		    <div class=\"item\">\r\n		      	<img src=\""
    + alias2(alias1((depth0 != null ? depth0.src : depth0), depth0))
    + "\">\r\n		      	<div class=\"carousel-caption\">\r\n			        "
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\r\n			    </div>\r\n		    </div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"element-list-wrapper\">\r\n	<i class=\"fa fa-plus-circle blue js-trigger-elementlist\"></i>\r\n	<div id=\""
    + container.escapeExpression(((helper = (helper = helpers.element_block_id || (depth0 != null ? depth0.element_block_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"element_block_id","hash":{},"data":data}) : helper)))
    + "\" class=\"carousel slide\" data-ride=\"carousel\">\r\n		<ol class=\"carousel-indicators\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.elements : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</ol>\r\n		\r\n		<div class=\"carousel-inner\" role=\"listbox\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.elements : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</div>\r\n	</div>\r\n</div>\r\n";
},"useData":true,"useDepths":true});
})();