jQuery(function($) {

	// $('.top').click(function() {
	// 	$('html, body').stop().animate({scrollTop: 0}, 'slow', 'swing');
	// });

	if ($(window).scrollTop() > $(window).height() - 300) {
		$('header').css('box-shadow', '0 25px 50px rgba(0,0,0, .3)');
	}

	$(window).scroll(function() {
		if ($(this).scrollTop() > $(window).height() - 300) {
			$('header').css('box-shadow', '0 25px 50px rgba(0,0,0, .3)');
			// $('.top').addClass("active");
		} else {
			// $('.top').removeClass("active");
			$('header').css('box-shadow', 'none');
		};
	});

	$('a.scroll').on("click", function(e){
		let anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $(anchor.attr('href')).offset().top - 80
		}, 100);
		return false;
	});

	$('.modal-link').on('click', function(){

		$('.error-message, .success-message').hide();

		let id    = $(this).attr('href'),
			title   = $(this).data('title');

		$(id).find('h2').html(title);

		if (id == '#service_popup') {
			let service = $(this).closest('.service-item').find('h3').text() || $(this).attr('title');
			$(id).find('#type_form').val('Запись на сервис');
			$(id).find('#form_srvice').val(title+'. '+service);

			if (typeof(service) == 'undefined') {
				$(id).find('#form_srvice').val('');
			}

			if ($(this).attr('title')) {
				$(id).find('h2').html('Онлайн расчет - '+$(this).attr('title'));
				$(id).find('#type_form').val('Онлайн расчет');
			}

			if ($(this).attr('data-form')) {
				$(id).find('#type_form').val($(this).attr('data-form'));
			}

		}

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

	// $('.lazyload').lazyload();

});