# otofotoOffline
An offline version of otoFoto that uses nothing but a modern web-browser, to select photos for albums.

# Getting started
For each album, copy and rename the `.html` file to the name of the album. Avoid using spaces for now. For example `wedding.html`, `brideparents.html`, `groomparents.html` and so on...
For each album, edit the `.html` file and set the desired number of photos for that album after `var albumSize`. **DO NOT CHANGE ANYTHING OTHER THAN THE NUMBER!**
```javascript
<script>
  /* *******************************************************
   *	USER VARIABLES
   * *******************************************************/
  var albumSize = 100;
</script>
```
Copy all the relevant photos (resized to fit viewing on a computer) to the `photos` folder. Once done, make sure the app loads all of the photos properly but simply running the `.html` file (it doesn't matter which you load if you have more than one).

# Selecting photos
To add a photo to the album, click on the empty checkbox that is on the bottom of the relevant photo. Clicking the checkbox again will remove the photo from the album. The index on the bottom will indicate your selection progress. You may select more or less than set by the photographer. The indication is only for notifying on your progress, and will not block you from selecting.

Once selection is completed, click on the download icon on the bottom, to download a list of selected photos, which you will need to hand the photographer.

By Matan Narkiss https://github.com/narkissbv/otofotoOffline
