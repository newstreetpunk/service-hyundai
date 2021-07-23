$(function(){

	slideWrapper = $(".main-slider");

	let iframes = slideWrapper.find('.embed-player'),
	lazyImages = slideWrapper.find('.slide-image'),
	lazyCounter = 0;

	// POST commands to YouTube or Vimeo API
	function postMessageToPlayer(player, command){
		if (player == null || command == null) return;
		player.contentWindow.postMessage(JSON.stringify(command), "*");
	}

	// When the slide is changing
	function playPauseVideo(slick, control){
		var currentSlide, slideType, startTime, player, video;

		currentSlide = slick.find(".slick-current");
		slideType = currentSlide.attr("class").split(" ")[1];
		player = currentSlide.find("iframe").get(0);
		startTime = currentSlide.data("video-start");

		if (slideType === "vimeo") {
			switch (control) {
				case "play":
				if ((startTime != null && startTime > 0 ) && !currentSlide.hasClass('started')) {
					currentSlide.addClass('started');
					postMessageToPlayer(player, {
						"method": "setCurrentTime",
						"value" : startTime
					});
				}
				postMessageToPlayer(player, {
					"method": "play",
					"value" : 1
				});
				break;
				case "pause":
				postMessageToPlayer(player, {
					"method": "pause",
					"value": 1
				});
				break;
			}
		} else if (slideType === "youtube") {
			switch (control) {
				case "play":
				postMessageToPlayer(player, {
					"event": "command",
					"func": "mute"
				});
				postMessageToPlayer(player, {
					"event": "command",
					"func": "playVideo"
				});
				break;
				case "pause":
				postMessageToPlayer(player, {
					"event": "command",
					"func": "pauseVideo"
				});
				break;
			}
		} else if (slideType === "video") {
			video = currentSlide.children("video").get(0);
			if (video != null) {
				if (control === "play"){
					video.play();
				} else {
					video.pause();
				}
			}
		}
	}

	// Resize player
	function resizePlayer(iframes, ratio) {
		if (!iframes[0]) return;
		var win = $(".main-slider"),
		width = win.width(),
		playerWidth,
		height = win.height(),
		playerHeight,
		ratio = ratio || 16/9;

		iframes.each(function(){
			var current = $(this);
			if (width / ratio < height) {
				playerWidth = Math.ceil(height * ratio);
				current.width(playerWidth).height(height).css({
					left: (width - playerWidth) / 2,
					top: 0
				});
			} else {
				playerHeight = Math.ceil(width / ratio);
				current.width(width).height(playerHeight).css({
					left: 0,
					top: (height - playerHeight) / 2
				});
			}
		});
	}

	// Функция видимости слайда с data-src-background-image-set, чтобы перезапускать слайдер только, когда слайд в виден
	function currentSet(){
		let currentSet = slideWrapper.find(".slick-active");

		if (currentSet.find('.image-set').length > 0) {
			onRefresh = true; //если виден
		}else{
			onRefresh = false; //если не виден
		}
	}

	// Функция разбора атрибута data-src-background-image-set
	function lazyloadFromSet() {
		item = $('.image-set');
		item.each(function(){
			let th = $(this);
			let attr = th.data('src-background-image-set');
			let imageSetLinks = attr.split(',');
			let desktopImg = imageSetLinks[0];
			let mobileImg = imageSetLinks[1].split('|')[1];
			brackpoint = parseInt(imageSetLinks[1].split('|')[0].replace(/\D+/g,''));
			let screenWidth = $(window).width();
			let urlImg = '';

			if (screenWidth <= brackpoint) {
				urlImg = mobileImg;
			}else{
				urlImg = desktopImg;
			}

			th.append('<img data-lazy="'+urlImg+'" class="image-entity">'); // img для Slick LazyLoad
			
		});

	}

	lazyloadFromSet();

	//проверка в каком положении мобильный девайз, чтобы при скролле не считался resize
	if ($(window).width() > $(window).height()) {
		res = false; //горизонтально
	}else{
		res = true; //вертикально
	}	

	// DOM Ready
	$(function() {
		// Initialize
		slideWrapper.on("init", function(slick){
			slick = $(slick.currentTarget);
			setTimeout(function(){
				playPauseVideo(slick,"play");
			}, 1000);
			resizePlayer(iframes, 16/9);
			currentSet();
		});
		slideWrapper.on("beforeChange", function(event, slick) {
			slick = $(slick.$slider);
			playPauseVideo(slick,"pause");
		});
		slideWrapper.on("afterChange", function(event, slick) {
			slick = $(slick.$slider);
			playPauseVideo(slick,"play");
			currentSet();
		});
		slideWrapper.on("lazyLoaded", function(event, slick, image, imageSource) {
			image.closest('.slide-image').css('background-image', 'url("' + imageSource + '")'); 
			image.closest('.slide-image').addClass('show');
			image.remove();
			lazyCounter++;
			if (lazyCounter === lazyImages.length){
				lazyImages.addClass('show');
			}
		});


		var arrow = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225 c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></svg>';

		//start the slider
		slideWrapper.slick({
			rows: 0,
			// fade:true,
			autoplaySpeed: 4000,
			//lazyLoad: "progressive",
			// infinite: false, 
			lazyLoad: "ondemand",
			speed: 600,
			arrows: true,
			dots: true,
			cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)",
			prevArrow: '<button class="arrow prev-arrow">'+arrow+'</button>',
			nextArrow: '<button class="arrow next-arrow">'+arrow+'</button>',
		});
	});

	//ресайз
	if (item.length > 0 ) { //если вообще есть слайды с атрибутом data-src-background-image-set
		$(window).on('resize', function(){
			let screenWidth = $(window).width();
			if (screenWidth <= brackpoint && res == false) {
				if (onRefresh) { //перезапускаем слайдер, если слайд с data-src-background-image-set в зоне видимости
					slideWrapper.slick('unslick');
					lazyloadFromSet();
					slideWrapper.slick('refresh');
					res = true;
				}
				
			}
			if (screenWidth > brackpoint && res == true) {
				if (onRefresh) { //перезапускаем слайдер, если слайд с data-src-background-image-set в зоне видимости
					slideWrapper.slick('unslick');
					lazyloadFromSet();
					slideWrapper.slick('refresh');
					res = false;
				}
				
			}
		});
	}

	// Resize event
	$(window).resize(function(){  
		resizePlayer(iframes, 16/9);
	});

	// Прослушка события смены ориентации
	window.addEventListener("orientationchange", function() {
		setTimeout(function(){
			resizePlayer(iframes, 16/9);
		}, 500);
		// alert(window.orientation);
	}, false);

	lazyload();

});