var $$$ = function (name) { return document.querySelector(name) },
$$ = function (name) { return document.querySelectorAll(name) };

function maskphone(e) {
	var num = this.value.replace('+7', '').replace(/\D/g, '').split(/(?=.)/), i = num.length;
	if (0 <= i) num.unshift('+7');
	if (1 <= i) num.splice(1, 0, ' ');
	if (4 <= i) num.splice(5, 0, ' ');
	if (7 <= i) num.splice(9, 0, '-');
	if (9 <= i) num.splice(12, 0, '-');
	if (11 <= i) num.splice(15, num.length - 15);
	this.value = num.join('');
};

$$("input[name=phone]").forEach(function (element) {
	element.addEventListener('focus', maskphone);
	element.addEventListener('input', maskphone);
});

let dropzoneError = $('.error-message');
let dropzoneSuccess = $('.success-message');

let uploadFields = document.querySelectorAll('#file-upload');

uploadFields.forEach(function(elem){
	dropzone = new Dropzone(elem, {
		url: 'upload.php',
		addRemoveLinks: true,
		parallelUploads: 1,
		acceptedFiles: '.jpg,.jpeg,.png',
		maxFiles: 10,
		maxFilesize: 10,
		dictDefaultMessage: '<div class="dz-message needsclick">Вы можете приложить фотографии, не более 10</div>',
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
				let images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
				for (let i = 0; i < images.length; i++) {
					let thumbnailElement = images[i];
					thumbnailElement.alt = file.name;
					thumbnailElement.src = dataUrl;
					url = dataUrl;
				}
				setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
			}
		},
		success: function(file, response){
			let res = JSON.parse(response);
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
});

$('input').not('input[name=agree]').on('change', function(){
	$(this).next().text('').hide();
})

$('input[name=agree]').on('change', function(){
	$(this).closest('div').next().text('').hide();
})

function checkingRequiredFields(form, errors) {
	let valid = true;
	for (key in errors) {
		let field = form.find('.error-mes#'+key);
		field.text(errors[key]).show();
		valid = false;
	}
	return valid;
}

//E-mail Ajax Send
$("form").submit(function() { //Change
	let th = $(this);
	let btnSubmit = th.find('.btn');
	let url = window.location.href;
	let replUrl = url.replace('?', '&');
	btnSubmit.attr("disabled", true);

	dropzoneError.hide();
	dropzoneSuccess.hide();

	$.ajax({
		type: "POST",
		url: "/mail.php", //Change
		data: th.serialize() +'&referer=' + replUrl
	}).done(function( data ) {
		let res = JSON.parse(data);
		console.log(res);

		if (!res.validation && !checkingRequiredFields(th, res.massages)) {
			btnSubmit.removeAttr("disabled");
			return false;
		}

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
				th.trigger("reset");
				$('.dz-preview').remove();
				$('.file-upload').removeClass('dz-started');
			}
			btnSubmit.removeAttr("disabled");
		}, 100);
		
		dropzone.removeAllFiles(true);

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