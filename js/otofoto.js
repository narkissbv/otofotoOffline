var album = location.pathname.split("/").pop();
var albumName = album.substring(0, album.indexOf('.html')),
	perPage = 10,
	dir = "photos",
	currentPage = localStorage['currentPage'] || 1;
	currentPage = JSON.parse(currentPage);
localStorage[albumName] = localStorage[albumName] || '[]';
selectedPhotos = JSON.parse(localStorage[albumName]);

$(document).ready(function() {
	renderPage();
});

function renderPage() {
	triggerIndexUpdate();
	var photosContainer = $('.photos');
	photosContainer.html('');
	if ('content' in document.createElement('template')) {
		// Build image cards
		var templateElement = document.querySelector('#photo-card'),
		cardImage = templateElement.content.querySelector('.card-image'),
		imgHolder = templateElement.content.querySelector('img'),
		labelHolder = templateElement.content.querySelector('label'),
		imageWrapperElement = templateElement.content.querySelector('.image-wrapper'),
		offset = (currentPage - 1) * perPage,
		i = 0;
		pageFiles = files.slice((currentPage - 1) * perPage, (currentPage) * perPage);
		pageFiles.forEach(function(file) {
			imgHolder.src = dir + "/" + file;
			imgHolder.className = "js-photo-" + (offset + i);
			imgHolder.alt = file;
			labelHolder.innerHTML = file;
			imageWrapperElement.dataset.imgId = offset + i;
			imageWrapperElement.className = "image-wrapper col s12 m6 l3 " + "img-wrapper-" + (offset + i);
			var clone = document.importNode(templateElement.content, true);
			photosContainer.append(clone);
			i++;
		});

		// Build pagination
		templateElement = document.querySelector('#pagination-item');
		var listItem = templateElement.content.querySelector('li'),
		paginationContainer = $('ul.pagination'),
		anchorElement = templateElement.content.querySelector('a');
		paginationContainer.html('');
		var totalNumberOfPhotos = files.length,
		totalPages = totalNumberOfPhotos / perPage;
		for (var i = 0 ; i < totalPages ; i++) {
			anchorElement.innerHTML = i + 1;
			anchorElement.dataset.pageId = i + 1;
			var clone = document.importNode(templateElement.content, true);
			paginationContainer.append(clone);
		}
		// set active pagination page
		$('ul.pagination a[data-page-id="' + currentPage + '"]').parent().addClass('active');

		// Register pagination event listeners
		document.querySelectorAll('.pagination a').forEach(function(anchorElement) {
			$(anchorElement).on('click', function() {
				localStorage['currentPage'] = anchorElement.dataset.pageId;
				currentPage = JSON.parse(anchorElement.dataset.pageId);
				renderPage();
			});
		});

		// Event listeners
		$('.js-action--add').on('click', function() {
			var imageWrapperElement = $(this).parents('.image-wrapper');
			var photoId = imageWrapperElement.data().imgId;
			imageWrapperElement.addClass('selected');
			selectedPhotos.push(photoId);
			localStorage[albumName] = JSON.stringify(selectedPhotos);
			//updateNumberSelectedPhotos();
			triggerIndexUpdate('add');
		});

		$('.js-action--remove').on('click', function() {
			var imageWrapperElement = $(this).parents('.image-wrapper');
			var photoId = imageWrapperElement.data().imgId;
			imageWrapperElement.removeClass('selected');
			selectedPhotos.splice($.inArray(photoId, selectedPhotos), 1);
			localStorage[albumName] = JSON.stringify(selectedPhotos);
			//updateNumberSelectedPhotos();
			triggerIndexUpdate('remove');
		});

		$('.selection-download a').on('click', function() {
			download();
		});

		$('.js-theme-switch').on('change', function() {
			$('body').removeClass('light dark');
			if ($(this).is(':checked'))
				$('body').addClass('dark');
			else {
				$('body').addClass('light');
			}
		});
		// initialize selected images
		var wrapperElement = '';
		selectedPhotos.forEach(function(index) {
			wrapperElement = $('.img-wrapper-' + index);
			$(wrapperElement).addClass('selected');
		});

		// Gallery event listeners
		for (var i = 0 ; i < pageFiles.length ; i++) {
			var index = ((currentPage - 1) * perPage) + i;
			$('.js-photo-' + index).on('click', ((function(i) {
				openSelectionGallery(i, pageFiles);
			}).bind(null,i)));
		}

		// add event listener to gallery modal action buttons
		$('.selection-gallery-wrapper .js-gallery-next').on('click', function() {
			var imgId = $('img.selection-image').data('img-id');
			imgId -= (currentPage - 1) * perPage;
			openSelectionGallery(++imgId, pageFiles);
		});
		$('.selection-gallery-wrapper .js-gallery-prev').on('click', function() {
			var imgId = $('img.selection-image').data('img-id');
			imgId -= (currentPage - 1) * perPage;
			openSelectionGallery(--imgId, pageFiles);
		});
		$('.selection-gallery-wrapper .js-gallery-add').on('click', function() {
			var imgId = $('img.selection-image').data('img-id');
			var imageWrapperElement = $('.img-wrapper-' + imgId);
			$('.selection-gallery-wrapper').addClass('selected');
			imageWrapperElement.find('.js-action--add').click();
		});
		$('.selection-gallery-wrapper .js-gallery-remove').on('click', function() {
			var imgId = $('img.selection-image').data('img-id');
			var imageWrapperElement = $('.img-wrapper-' + imgId);
			$('.selection-gallery-wrapper').removeClass('selected');
			imageWrapperElement.find('.js-action--remove').click();
		});
		$('.selection-gallery-wrapper .js-gallery-close').on('click', function() {
			closeSelectionGallery();
		});
	}
	else {
		alert('Using Internet Explorer much?');
	}
}

function openSelectionGallery(imagePosition, photosList) {
	$('#screen-block').show();
	$('.selection-gallery-wrapper').show();
	$('.selection-gallery-wrapper').removeClass('selected');
	// check whether the current image is selected or not
	if (selectedPhotos.indexOf(imagePosition) > -1) {
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
		"img-id": (currentPage - 1) * perPage + imagePosition
	}).css({
		'max-height': $(window).height(),
		'max-width': $(window).width()
	});
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
		if ($('.selection-gallery-wrapper').hasClass('selected')) {
			$('.js-gallery-remove').click();
		}
		else {
			$('.js-gallery-add').click();
		}
		return false;
	}
}

function download () {
	// prepare text
	var resultText = albumName + "\r\n";
	selectedPhotos.forEach(function(i) {
		resultText += files[i] + "\r\n";
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

// Selection index
function triggerIndexUpdate(action) {
	$('.js-num-selected-photos').html(selectedPhotos.length);
	$('.js-total-album-size').html(albumSize);
	if (action == "add") {
		$('.selection-index').addClass('add');
	}
	else if (action == "remove") {
		$('.selection-index').addClass('remove');
	}
	else if (action == "error") {
		$('.selection-index').addClass('error');
	}
	setTimeout(function() {
		$('.selection-index').removeClass('add remove error');
	}, 500);
	$('.selection-index .determinate').css({
		'width': Math.floor(selectedPhotos.length / albumSize * 100) + "%"
	});
	$('.selection-index .progress').attr({
		'title': 'selected ' + Math.floor(selectedPhotos.length / albumSize * 100) + "%"
	});
}