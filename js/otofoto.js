window.onload = function() {
	var photosContainer = document.querySelector('.photos');
	// use image card template
	var imgId = 0;
	if ('content' in document.createElement('template')) {
		var templateElement = document.querySelector('#photo-card'),
		cardImage = templateElement.content.querySelector('card-image'),
		imgHolder = templateElement.content.querySelector('img'),
		labelHolder = templateElement.content.querySelector('label'),
		imageWrapperElement = templateElement.content.querySelector('.image-wrapper');
		files.forEach(function(file) {
			imgHolder.src = dir + "/thumbs/" + file;
			imgHolder.className = "js-photo-" + imgId;
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

localStorage[albumName] = localStorage[albumName] || '[]';
selectedPhotos = JSON.parse(localStorage[albumName]);

$(document).ready(function() {
	// Event listeners
	$('.js-action--add').on('click', function() {
		var imageWrapperElement = $(this).parents('.image-wrapper');
		var photoId = imageWrapperElement.data().imgId;
		imageWrapperElement.addClass('selected');
		selectedPhotos.push(photoId);
		localStorage[albumName] = JSON.stringify(selectedPhotos);
	});

	$('.js-action--remove').on('click', function() {
		var imageWrapperElement = $(this).parents('.image-wrapper');
		var photoId = imageWrapperElement.data().imgId;
		imageWrapperElement.removeClass('selected');
		selectedPhotos.splice($.inArray(photoId, selectedPhotos), 1);
		localStorage[albumName] = JSON.stringify(selectedPhotos);
	});

	// initialize selected images
	var wrapperElement = '';
	selectedPhotos.forEach(function(index) {
		wrapperElement = $('.img-wrapper-' + index);
		$(wrapperElement).addClass('selected');
	});

	// Gallery event listeners
	for (var i = 0 ; i < files.length ; i++) {
		$('.js-photo-' + i).on('click', ((function(i) {
			openSelectionGallery(i, files);
		}).bind(null,i)));
	}

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
	$('.selection-gallery-wrapper .js-gallery-close').on('click', function() {
		closeSelectionGallery();
	})
});

function openSelectionGallery(imagePosition, photosList) {
	$('#screen-block').show();
	$('.selection-gallery-wrapper').show();
	if (imagePosition < 0) {
		imagePosition = photosList.length -1;
	}
	else if (imagePosition > photosList.length - 1) {
		imagePosition = 0;
	}
	// set the gallery image
	$('.selection-gallery-wrapper img.selection-image').attr({
		src: 'photos/' + photosList[imagePosition],
		title: photosList[imagePosition],
		alt: photosList[imagePosition]
	}).data({
		"img-id": imagePosition
	}).css({
		'max-height': $(window).height(),
		'max-width': $(window).width()
	});
	console.log(imagePosition);
}

function closeSelectionGallery() {
	$('#screen-block').hide();
	$('.selection-gallery-wrapper').hide();
}