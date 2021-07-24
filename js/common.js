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

	$('.modal-link').magnificPopup({
		type: 'inline',
		fixedContentPos: true,
		preloader: false,
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