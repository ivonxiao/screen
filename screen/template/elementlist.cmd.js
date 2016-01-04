define(function(require) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['elementlist.tpl'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "		<li>\r\n			<img src=\""
    + alias2(alias1((depth0 != null ? depth0.thumbnail_src : depth0), depth0))
    + "\" class=\"element-thumbnailimg\">\r\n			<span class=\"element-name\">"
    + alias2(alias1((depth0 != null ? depth0.element_name : depth0), depth0))
    + "</span>\r\n		</li>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"listcarousel-setting-container\">\r\n	<div class=\"operate-icon-container\">\r\n		<i class=\"fa fa-cog\" title=\"设置列表轮播属性\" class=\"\" data-toggle=\"modal\" data-target=\"#elementListSettingModal\"></i>\r\n		<i class=\"fa fa-times-circle-o\" title=\"关闭\"></i>\r\n	</div>\r\n	<ul>\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.elements : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</ul>\r\n</div>";
},"useData":true});
});