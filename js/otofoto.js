window.onload = function() {
	var photosContainer = document.querySelector('.photos');
	// use image card template
	var imgId = 0;
	if ('content' in document.createElement('template')) {
		var templateElement = document.querySelector('#photo-card'),
		imgHolder = templateElement.content.querySelector('img'),
		labelHolder = templateElement.content.querySelector('label'),
		imageWrapperElement = templateElement.content.querySelector('.image-wrapper');
		files.forEach(function(file) {
			var img = document.createElement('img');
			img.src = dir + "/thumbs/" + file;
			imgHolder.src = img.src;
			imgHolder.className = "js_" + file;
			imgHolder.alt = file;
			labelHolder.innerHTML = file;
			imageWrapperElement.dataset.imgId = imgId;
			imageWrapperElement.className = "image-wrapper col s12 m6 l3 " + "img-wrapper-" + imgId;
			var clone = document.importNode(templateElement.content, true);
			photosContainer.appendChild(clone);
			imgId++;
		});
	}
	else {
		alert('Using Internet Explorer much?');
	}
}
var album = location.pathname.split("/").pop();
var albumName = album.substring(0, album.indexOf('.html'));

// Event listeners
$('.js-action--add').on('click', function() {
	var imageWrapperElement = $(this).parents('.image-wrapper');
	var photoId = imageWrapperElement.data().imgId;
	imageWrapperElement.addClass('selected');

	// immediately update selected photos number count, and verify once server respond with success / fail
	selectedPhotos.push(photoId);
	updateNumberSelectedPhotos();
	triggerIndexUpdate('add');
	$.ajax({
		url: "includes/set_photo_selection.php",
		data: { 'action': 'add', 'albumid' : albumId, 'photoid': photoId },
		method: "POST"
	}).done(function ( response ) {
		console.log(response.message);
		
		if (debugging) {
			// add check animation to verify completeness
			imageWrapperElement.find('.notify-check').addClass('animation');
			setTimeout(function() {
				imageWrapperElement.find('.notify-check').removeClass('animation');
			}, 1000);
		}
	}).fail(function ( response ) {
		console.log('photo add failed: ' + response.message);
		if (debugging) {
			imageWrapperElement.find('.notify-error').addClass('animation');
			setTimeout(function() {
				imageWrapperElement.find('.notify-error').removeClass('animation');
			}, 2000);
		}
		imageWrapperElement.removeClass('selected');
		// get the counter back to previous number if server failed to add the photo
		selectedPhotos.splice($.inArray(photoId, selectedPhotos), 1);
		updateNumberSelectedPhotos();
		triggerIndexUpdate('error');
	}).always(function() {
		if (!!callback && !!callback.func) {
			callback.func();
			callback = {};
		}
		updateNumberSelectedPhotos();
	});
});
$('.js-action--remove').on('click', function() {
	var imageWrapperElement = $(this).parents('.image-wrapper');
	var photoId = imageWrapperElement.data().imgId;
	imageWrapperElement.removeClass('selected');
	selectedPhotos.splice($.inArray(photoId, selectedPhotos), 1);
	updateNumberSelectedPhotos();
	triggerIndexUpdate('remove');			
	$.ajax({
		url: "includes/set_photo_selection.php",
		data: { 'action': 'remove', 'albumid': albumId, "photoid": photoId },
		method: "POST"
	}).done(function ( response ) {
		console.log(response.message);
		if (debugging) {
			imageWrapperElement.find('.notify-check').addClass('animation');
			setTimeout(function() {
				imageWrapperElement.find('.notify-check').removeClass('animation');
			}, 2000);
		}
	}).fail(function ( response ) {
		console.log('photo remove failed: ' + response.message);
		imageWrapperElement.find('.notify-error').addClass('animation');
		setTimeout(function() {
			imageWrapperElement.find('.notify-error').removeClass('animation');
		}, 2000);
		imageWrapperElement.addClass('selected');
		// get the counter back to previous number if server failed to remove the photo
		selectedPhotos.push(photoId);
		updateNumberSelectedPhotos();
		triggerIndexUpdate('error');				
	}).always(function() {
		if (!!callback && !!callback.func) {
			callback.func();
			callback = {};
		}
	});
});


$('.selection-gallery-wrapper .js-gallery-add').on('click', function() {
	var imgId = $(this).parents('.selection-gallery-wrapper').find('img').data('img-id');
	var imageWrapperElement = $('.img-wrapper' + imgId);
	callback = {
		func: function() {
			openSelectionGallery(97, currentImagePosition);
		}
	};
	$('.selection-gallery-wrapper').addClass('selected');
	imageWrapperElement.find('.js-action--add').click();
});
$('.selection-gallery-wrapper .js-gallery-remove').on('click', function() {
	var imgId = $(this).parents('.selection-gallery-wrapper').find('img').data('img-id');
	var imageWrapperElement = $('.img-wrapper' + imgId);
	callback = {
		func: function() {
			openSelectionGallery(97, currentImagePosition);
		}
	};
	$('.selection-gallery-wrapper').removeClass('selected');
	imageWrapperElement.find('.js-action--remove').click();
});
