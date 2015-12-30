<div class="element-list-wrapper">
	<i class="fa fa-plus-circle blue js-trigger-elementlist"></i>
	<div id="{{element_block_id}}" class="carousel slide" data-ride="carousel">
		<ol class="carousel-indicators">
			{{#each elements}}
			    <li data-target="#{{../element_block_id}}" data-slide-to="{{@index}}"></li>
		    {{/each}}
		</ol>
		
		<div class="carousel-inner" role="listbox">
			{{#each elements}}
		    <div class="item">
		      	<img src="{{this.src}}">
		      	<div class="carousel-caption">
			        {{this.name}}
			    </div>
		    </div>
		    {{/each}}
		</div>
	</div>
</div>
