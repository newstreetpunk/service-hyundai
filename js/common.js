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

	let dropzoneError = $('.error-message');
	let dropzoneSuccess = $('.success-message');

	var dropzone = new Dropzone('#file-upload', {
		url: 'upload.php',
		addRemoveLinks: true,
		parallelUploads: 1,
		// thumbnailHeight: 60,
		// thumbnailWidth: 60,
		//filesizeBase: 1000,
			//uploadMultiple: true,
		// acceptedFiles: '.jpg,.jpeg,.png',
		maxFiles: 10,
		maxFilesize: 10,
		dictDefaultMessage: '<div class="dz-message needsclick">Вы можете приложить фотографию</div>',
		dictFallbackMessage: "Ваш браузер не поддерживает загрузку перетаскиванием",
		dictFallbackText: "Пожалуйста, используйте резервную форму ниже, чтобы загрузить свои файлы, как в старые добрые времена)",
		dictFileTooBig: "Слишком большой файл ({{filesize}}Мб). Максимальный размер: {{maxFilesize}}Мб.",
		dictInvalidFileType: "Вы не можете загрузить файлы этого типа.",
		dictResponseError: "Сервер вернул ответ {{statusCode}}.",
		dictCancelUpload: "Отменить загрузку",
		dictUploadCanceled: "Загрузка завершена.",
		dictCancelUploadConfirmation: "Вы уверены, что хотите отменить?",
		dictRemoveFile: "Удалить файл",
		dictRemoveFileConfirmation: "Хотите удалить файл?",
		dictMaxFilesExceeded: 'Привышен лимит изображений',
		dictFileSizeUnits: {
			tb: "Тб",
			gb: "Гб",
			mb: "Мб",
			kb: "Кб",
			b: "байт"
		},
		init: function(){
			$(this.element).html(this.options.dictDefaultMessage);
		},
		thumbnail: function(file, dataUrl) {
			if (file.previewElement) {
				file.previewElement.classList.remove("dz-file-preview");
				var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
				for (var i = 0; i < images.length; i++) {
					var thumbnailElement = images[i];
					thumbnailElement.alt = file.name;
					thumbnailElement.src = dataUrl;
					url = dataUrl;
				}
				setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
			}
		},
		success: function(file, response){
			var res = JSON.parse(response);
			if (res.answer == 'error') {
				dropzoneSuccess.hide();
				dropzoneError.text(res.error);
				dropzoneError.show();
				dropzone.removeFile(file);
			}else{
				dropzoneError.hide();
				dropzoneSuccess.text(res.answer);
				dropzoneSuccess.show();
				this.defaultOptions.success(file);
			}
			console.log(res);
		}
	});

	//E-mail Ajax Send
	$("form").submit(function() { //Change
		var th = $(this);
		var btnSubmit = th.find('.btn');
		btnSubmit.attr("disabled", true);
		var url = window.location.href;
		var replUrl = url.replace('?', '&');
		$.ajax({
			type: "POST",
			url: "/mail.php", //Change
			data: th.serialize() +'&referer=' + replUrl
		}).done(function( data ) {
			var res = JSON.parse(data);
			console.log(res);

			if(res.error) 
				$('.error-message').html(res.error);
			else
				$('.error-message').html("");

			setTimeout(function() {
				$.magnificPopup.close();
				$.magnificPopup.open({
					items: {
						src: (res.answer == 'ok') ? '.thanks' : '.error',
						type: 'inline'
					}
				});
				if(res.answer == 'ok') {
					dropzone.removeAllFiles(true);
					th.trigger("reset");
				}
				btnSubmit.removeAttr("disabled");
			}, 100);
		}).fail(function( jqXHR, textStatus ) {
			console.log(jqXHR);
			$('.error-message').html("Request failed: " + textStatus);
			setTimeout(function() {
				$.magnificPopup.close();
				$.magnificPopup.open({
					items: {
						src: '.error',
						type: 'inline'
					}
				});
				btnSubmit.removeAttr("disabled");
			}, 100);
		});
		return false;
	});

});