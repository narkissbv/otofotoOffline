window.onload = function() {
	var photosContainer = document.querySelector('.photos');
	files.forEach(function(file) {
		var img = document.createElement('img');
		img.src = dir + "/" + file;
		photosContainer.appendChild(img);
	});
}
var album = location.pathname.split("/").pop();
var albumName = album.substring(0, album.indexOf('.html'));