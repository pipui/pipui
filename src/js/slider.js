(function($){

	var slider_methods = {
		'setControl': function(num, slider){

			slider.find('.slider-control .slider-control-label.active').removeClass('active');

			slider.find('.slider-control .slider-control-label:nth-child('+(num+1)+')').addClass('active');

			return slider;
		},

		'prev': function(slider){

			if(typeof slider == 'undefined' || !slider.length){ return slider; }

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			var prev = options.current <= 0 ? options.slides.length-1 : options.current-1;

			return this.setSlide(prev, slider);
		},

		'next': function(slider){

			if(typeof slider == 'undefined' || !slider.length){ return slider; }

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			var next = options.current+1 >= options.slides.length ? 0 : options.current+1;

			return this.setSlide(next, slider);
		},

		'auto': function(slider, id){
			var self = this;

			var options = slider_options[id];

			if(typeof options.timeout != 'undefined'){
				clearTimeout(slider_options[id].timeout);
			}

			if(!slider.hasClass('paused') && options.auto && options.autoSpeed){
				slider_options[id].timeout = setTimeout(function(){
					self.next(slider);
				}, options.autoSpeed);
			}
		},

		'setSlide': function(num, slider){
			var self = this;

			if(typeof slider == 'undefined' || !slider.length){ return slider; }

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			if(options.locked){ return slider; }

			slider.trigger('slider.change');

			slider_options[id].locked = true;

			var current = slider.find('.slider-wrapper > .slider-slide.active');

			current.removeClass('active');

			var next = slider.find('.slider-wrapper > .slider-slide:nth-child('+(num+1)+')');

			if(!next.length){ return; }

			if(options.current < num){
				next.css({'right': 'auto', 'left': '100%', 'z-index': '2'});
				current.css({'left': 'auto', 'right': '0', 'z-index': '1'});

				next.animate({
					'left': '0'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).addClass('active').trigger('slider.change.complete');
						self.auto(slider, id);
					}
				});

				current.animate({
					'right': '100%'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).removeClass('active').trigger('slider.change.complete');
						slider_options[id].locked = false;
						self.auto(slider, id);
					}
				});
			}else if(options.current > num){
				next.css({'left': 'auto', 'right': '100%', 'z-index': '2'});
				current.css({'right': 'auto', 'left': '0', 'z-index': '1'});

				next.animate({
					'right': '0'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).addClass('active').trigger('slider.change.complete');
						self.auto(slider, id);
					}
				});

				current.animate({
					'left': '100%'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).removeClass('active').trigger('slider.change.complete');
						slider_options[id].locked = false;
						self.auto(slider, id);
					}
				});
			}else{
				slider_options[id].locked = false;
				slider.trigger('slider.change.complete');
			}

			slider_options[id].current = num;

			return this.setControl(num, slider);
		}
	};

	var slider_options = {};

	$.fn.slider = function(options){

		var slider = this;

		var id = Math.random();

		slider_options[id] = $.extend({}, {
			'id': id,
			'height': '280px',
			'width': '100%',
			'slides': [],
			'control': 'default',
			'auto': true,
			'autoSpeed': 5000,
			'pauseOnHover': true,
			'timeout': undefined,
			'current': 0,
			'speed': 800,
			'easing': 'easeInOutQuint',
			'locked': false
		}, options);

		slider.setHeight = function(value){
			slider_options[id].height = value;
			return this;
		};

		slider.setWidth = function(value){
			slider_options[id].width = value;
			return this;
		};

		slider.setSlides = function(list){
			slider_options[id].slides = list;
			return this;
		};

		slider.setControl = function(type){
			slider_options[id].control = type;
			return this;
		};

		slider.setAuto = function(type){
			slider_options[id].auto = type;
			return this;
		};

		slider.setAutoSpeed = function(speed){
			slider_options[id].autoSpeed = speed;
			return this;
		};

		slider.setPauseOnHover = function(type){
			slider_options[id].pauseOnHover = type;
			return this;
		};

		slider.setSpeed = function(duration){
			slider_options[id].speed = duration;
			return this;
		};

		slider.setEasing = function(easing){
			slider_options[id].easing = easing;
			return this;
		};

		slider.setSlide = function(num){
			slider_methods.setSlide(num, this);
			return this;
		};

		slider.next = function(){
			slider_methods.next(this);
			return this;
		};

		slider.prev = function(){
			slider_methods.prev(this);
			return this;
		};

		slider.restoreControl = function(){
			var self = this;

			self.find('.slider-control').remove();

			self.append('<div class="slider-control"></div>');

			var control = self.children('.slider-control');

			var label = '';

			for(var i = 0; i < slider_options[id].slides.length; i++){
				label = $('<a href="#" class="slider-control-label"></a>');

				if(slider_options[id].current == i){ label.addClass('active'); }
				control.append(label);
			}

			return self;
		};

		slider.update = function(){
			var self = this;

			self.html('');

			self.addClass('slider active').attr('data-slider-id', slider_options[id].id).html('<div class="slider-wrapper" style="width: '+slider_options[id].width+'; height: '+slider_options[id].height+';"></div>');

			if(typeof slider_options[id].slides != 'object'){ return self; }

			var len = slider_options[id].slides.length;

			if(!len){ return self; }

			var slide = '';

			var wrapper = self.children('.slider-wrapper');

			for(var i = 0; i < len; i++){
				slide = slider_options[id].slides[i];

				if(typeof slide != 'string' || !slide.length){ continue; }

				slide = $(slide);

				if(i == slider_options[id].current){
					slide.addClass('active');
				}

				wrapper.append(slide);
			}

			if(typeof slider_options[id].timeout != 'undefined'){
				clearTimeout(slider_options[id].timeout);
			}

			if(slider_options[id].auto && slider_options[id].autoSpeed){
				slider_options[id].timeout = setTimeout(function(){
					self.next();
				}, slider_options[id].autoSpeed);
			}

			return self.restoreControl();
		};

		return slider.update();
	};

	$(function(){
		$('body').on('click', '.slider > .slider-control > .slider-control-label', function(e){
			e.preventDefault();

			var that = $(this);

			var id = that.closest('.slider').attr('data-slider-id');

			var slider = $('.slider[data-slider-id="'+id+'"]');

			if(typeof slider_options[id] == 'undefined'){ return; }

			var index = that.closest('.slider-control').find('.slider-control-label').index(that);

			slider_methods.setSlide(index, slider, slider_options[id]);
		}).on('mouseenter', '.slider', function(){

			var that = $(this);

			var slider = that.closest('.slider');

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			if(options.pauseOnHover && typeof options.timeout != 'undefined'){
				if(options.auto && options.autoSpeed) {
					slider.addClass('paused');
				}

				clearTimeout(slider_options[id].timeout);
			}
		}).on('mouseleave', '.slider', function(){
			var that = $(this);

			var id = that.attr('data-slider-id');

			if(slider_options[id].pauseOnHover){
				that.removeClass('paused');
				slider_methods.auto(that, id);
			}
		});
	});
}(jQuery));