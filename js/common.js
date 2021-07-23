jQuery(function($) {

	let wind = $(window);

	function stickyHeader(){
		let windowWidth = wind.width();
		let h_hght = 32;
		let h_mrg = 0;
		let elem = $('#header');
		let top = elem.scrollTop();

		if (windowWidth < 992)
			h_hght = 78;          

		if (windowWidth > 575){
			if(top > h_hght){
				elem.css('top', h_mrg);
			}else {
				elem.css('top', h_hght);
			}
			wind.scroll(function(){
				top = $(this).scrollTop();
				if (top+h_mrg < h_hght) {
					elem.css('top', (h_hght-top));
				} else {
					elem.css('top', h_mrg);
				}
			});
		}else{
			elem.css('top', h_mrg);
			wind.scroll(function(){
				elem.css('top', h_mrg);
			});
		}		
	}

	stickyHeader();
	wind.on('resize', function(){stickyHeader()});

	$('.top').click(function() {
		$('html, body').stop().animate({scrollTop: 0}, 'slow', 'swing');
	});
	$(window).scroll(function() {
		if ($(this).scrollTop() > $(window).height()) {
			$('.top').addClass("active");
		} else {
			$('.top').removeClass("active");
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