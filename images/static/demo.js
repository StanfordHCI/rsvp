totalPositives = 0;
var data = JSON.parse($('#data').val());
for (var url in data) {
  elem = data[url];
  if (elem['class'] == positiveClass) {
    totalPositives++;
  }
}

// Removes spacebar making page go down.
window.onkeydown = function(e) { 
  return !(e.keyCode == 32);
};

// Rendering Functions
step();

$('body').jpreLoader();

$('#slideShow').slideShow({
  loopSpeed : imageSpeed,
  imagesSelector : '.slideImages > img',
  initActiveImage : 0,
  activeClass : 'active',
  onSlideEnd : function(slideShow){
    slideShow.element.fadeOut();
  }
});

$('#togglePlay').click(function(e){
  e.preventDefault();
  widget.helFuns.activeSpaceData();
  var slideShow = $('#slideShow').data('slideShow');
  $(this).addClass('disable');
  slideShow.runSlideShow();
});

