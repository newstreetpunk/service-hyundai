jQuery(function($) {


	$('.top').click(function() {
		$('html, body').stop().animate({scrollTop: 0}, 'slow', 'swing');
	});

	if ($(window).scrollTop() > $(window).height()) {
		$('header').css('box-shadow', '0 25px 50px rgba(0,0,0, .3)');
	}

	$(window).scroll(function() {
		if ($(this).scrollTop() > $(window).height()) {
			$('header').css('box-shadow', '0 25px 50px rgba(0,0,0, .3)');
			$('.top').addClass("active");
		} else {
			$('.top').removeClass("active");
			$('header').css('box-shadow', 'none');
		};
	});

	$('a.scroll').on("click", function(e){
		var anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $(anchor.attr('href')).offset().top - 80
		}, 100);
		return false;
	});

	$('.modal-link').on('click', function(){
		let id    = $(this).attr('href'),
			title = $(this).data('title');

		$(id).find('h2').text(title);

		$.magnificPopup.open({
			items: {
				src: id,
				type: 'inline',
				fixedContentPos: true,
				preloader: false,
			}			
		});
		return false;
	});

	$('a[href="#popup"]').on('click', function(){
		$('.overlay').show();
		$('.privacy-wrap').show();
		$('html').css({
			'margin-right': '17px',
			'overflow': 'hidden'
		});
		return false;
	});
	$('.overlay, .privacy-close').on('click', function(){
		$('.overlay').hide();
		$('.privacy-wrap').hide();
		$('html').removeAttr('style');
	});

	$('.lazyload').lazyload();

});