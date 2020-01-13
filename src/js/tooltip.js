pipui.tooltip = {
	'margin': 2,

	'trigger': 'data-tooltip',

	'fadeInSpeed': 'fast',

	'fadeOutSpeed': 'fast',

	'getPosition': function(that){
		if(typeof that.attr(pipui.tooltip.trigger) != 'undefined'){
			return '';
		}

		if(typeof that.attr(pipui.tooltip.trigger+'-left') != 'undefined'){
			return '-left';
		}

		if(typeof that.attr(pipui.tooltip.trigger+'-right') != 'undefined'){
			return '-right';
		}

		if(typeof that.attr(pipui.tooltip.trigger+'-top') != 'undefined'){
			return '-top';
		}

		return '-bottom';
	},

	'setPosition': function(e, tooltip, position){

		var top = -9999;
		var left = -9999;

		tooltip.css({'top': top+'px', 'left': left+'px'});

		var pos = e.offset();

		var width = e.outerWidth();
		var height = e.outerHeight();

		var t_width = tooltip.outerWidth();
		var t_height = tooltip.outerHeight();

		if(position == '-left'){
			top = pos.top + (height / 2) - (t_height / 2);
			left = pos.left - t_width - 4 - pipui.tooltip.margin;
		}else if(position == '-right'){
			top = pos.top + (height / 2) - (t_height / 2);
			left = pos.left + width + 4 + pipui.tooltip.margin;
		}else if(position == '-bottom'){
			top = pos.top + height + 4 + pipui.tooltip.margin;
			left = pos.left + (width / 2) - (t_width / 2);
		}else{
			top = pos.top - t_height - 4 - pipui.tooltip.margin;
			left = pos.left + (width / 2) - (t_width / 2);
		}

		tooltip.css({'top': top+'px', 'left': left+'px'});
	}
};

$(function(){
	$('body').on('mouseenter', '['+pipui.tooltip.trigger+'], ['+pipui.tooltip.trigger+'-left], ['+pipui.tooltip.trigger+'-right],['+pipui.tooltip.trigger+'-top], ['+pipui.tooltip.trigger+'-bottom]', function(){
		var that = $(this);

		var id = that.attr('data-tooltip-id');

		var position = pipui.tooltip.getPosition(that);

		var trigger = pipui.tooltip.trigger+position;

		var text = that.attr(trigger);

		if(typeof id == 'undefined'){
			id = Math.random();
			that.attr('data-tooltip-id', id);
			var append = $('<div class="tooltip" data-tooltip-id="'+id+'">'+text+'</div>');

			$('body').append(append);
		}

		var tooltip = $('.tooltip[data-tooltip-id="'+id+'"]');

		tooltip.removeClass('tooltip-pos tooltip-pos-left tooltip-pos-right tooltip-pos-bottom tooltip-pos-top').addClass('tooltip-pos'+position);

		pipui.tooltip.setPosition(that, tooltip, position);

		tooltip.addClass('show');
	}).on('mouseleave', '['+pipui.tooltip.trigger+'], ['+pipui.tooltip.trigger+'-left], ['+pipui.tooltip.trigger+'-right],['+pipui.tooltip.trigger+'-top], ['+pipui.tooltip.trigger+'-bottom]', function(){
		var tooltip = $('.tooltip.show');

		if(tooltip.length){
			tooltip.removeClass('show');
		}

	});
});