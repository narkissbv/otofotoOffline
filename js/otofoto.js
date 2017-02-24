window.onload = function() {
	var photosContainer = document.querySelector('.photos');
	// use image card template
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
		imgId = 0;
	}
	else {
		alert('Using Internet Explorer much?');
	}
}
var album = location.pathname.split("/").pop();
var albumName = album.substring(0, album.indexOf('.html'));
var imgId = 0;
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

	// add event listener to gallery modal action buttons
	$('.selection-gallery-wrapper .js-gallery-next').on('click', function() {
		openSelectionGallery(++imgId, files);
	});
	$('.selection-gallery-wrapper .js-gallery-prev').on('click', function() {
		openSelectionGallery(--imgId, files);
	});
	$('.selection-gallery-wrapper .js-gallery-add').on('click', function() {
		var imageWrapperElement = $('.img-wrapper-' + imgId);
		$('.selection-gallery-wrapper').addClass('selected');
		imageWrapperElement.find('.js-action--add').click();
	});
	$('.selection-gallery-wrapper .js-gallery-remove').on('click', function() {
		var imgId = $(this).parents('.selection-gallery-wrapper').find('img').data('img-id');
		var imageWrapperElement = $('.img-wrapper-' + imgId);
		callback = {
			func: function() {
				openSelectionGallery(imgId, files);
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
	$('.selection-gallery-wrapper').removeClass('selected');
	// check whether the current image is selected or not
	if (selectedPhotos.indexOf(imagePosition) > 0) {
		$('.selection-gallery-wrapper').addClass('selected');
	}

	// set carousel logic
	if (imagePosition < 0) {
		imagePosition = photosList.length -1;
	}
	else if (imagePosition > photosList.length - 1) {
		imagePosition = 0;
	}

	// set the gallery image properties
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
	imgId = imagePosition;
}

function closeSelectionGallery() {
	$('#screen-block').hide();
	$('.selection-gallery-wrapper').hide();
	$('.selection-gallery-wrapper img.selection-image').attr({
		src: ''
	});
}

document.onkeydown = function(e) {
	e = e || window.event;
	if (e.keyCode == 37) {
		//prev
		$('.selection-gallery-wrapper .prev-arrow').click();
	}
	else if (e.keyCode == 39) {
		// next
		$('.selection-gallery-wrapper .next-arrow').click();
	}
	else if (e.keyCode == 27) {
		// esc
		closeSelectionGallery();
	}
	else if (e.keyCode == 32) {
		// space (select photo)
		if (currentPage == "select_photos2") {
			if ($('.selection-gallery-wrapper').hasClass('selected')) {
				$('.js-gallery-remove').click();
			}
			else {
				$('.js-gallery-add').click();
			}
		}
		return false;
	}
}

function download () {
	// prepare text
	var resultText = '';
	selectedPhotos.forEach(function(i) {
		resultText += files[i] + "\n";
	});

	// Set up the link
	var link = document.createElement("a");
	link.setAttribute("target","_blank");
	if(Blob !== undefined) {
		var blob = new Blob([resultText], {type: "text/plain"});
		link.setAttribute("href", URL.createObjectURL(blob));
	} else {
		link.setAttribute("href","data:text/plain," + encodeURIComponent(resultText));
	}
	link.setAttribute("download", albumName + ".txt");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}