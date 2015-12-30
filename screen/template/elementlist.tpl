<div class="listcarousel-setting-container">
	<div class="operate-icon-container">
		<i class="fa fa-cog" title="设置列表轮播属性" class="" data-toggle="modal" data-target="#elementListSettingModal"></i>
		<i class="fa fa-times-circle-o" title="关闭"></i>
	</div>
	<ul>
	{{#each elements}}
		<li>
			<img src="{{this.thumbnail_src}}" class="element-thumbnailimg">
			<span class="element-name">{{this.element_name}}</span>
		</li>
	{{/each}}
	</ul>
</div>