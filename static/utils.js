function getSortedKeys(data) {
  var keys = Object.keys(data).sort(function keyOrder(k1, k2) {
    if (data[k1].score < data[k2].score) return 1;
    else if (data[k1].score > data[k2].score) return -1;
    else return 0;
  });
  return keys;
}

function renderImages(sortedKeys, totalPositives) {
  $('#images').html('');
  for (var i = 0; i < sortedKeys.length; i++) {
    if (i == totalPositives) {
      $('#images').append($('<hr>'));
    }
    var img = $("<img class='' style='width:70px; height:70px;' src='" + sortedKeys[i] + "'>");
    $('#images').append(img);
  }
}

function renderGraph(precisionData, recallData, redundancy, positiveClass, data, sortedKeys, totalPositives) {
  currentPositives = 0;
  if (!(redundancy in precisionData)) {
    precisionData[redundancy] = [];
    recallData[redundancy] = [];
  }
  for (var i = 0; i < sortedKeys.length; i++) {
    if (data[sortedKeys[i]].class == positiveClass) {
      currentPositives++;
    }
    precisionData[redundancy].push(currentPositives/(i+1));
    recallData[redundancy].push(currentPositives/totalPositives);
  }
  $('#precision').html('');
  $('#recall').html('');
  plotGraph(precisionData, 'precision', $('#precision').width());
  plotGraph(recallData, 'recall', $('#recall').width());
}

function getRandomImageSubset(sortedKeys, numImages) {
  return _.sample(sortedKeys, numImages);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function addImagesRandomly(elem, sortedKeys, numImages){
  var subset = getRandomImageSubset(sortedKeys, numImages);
  var sortedImages = [];
  var imageOrder = new Array(subset.length);
  for (var i=0; i < subset.length; i++){
    imageOrder[i] = i;
  }
  imageOrder = shuffle(imageOrder);
  html = '';
  for (var i = 9; i >= 0; i--) {
    c_url = "https://visualgenome.org/static/images/countdown/countdown_" + i + ".jpg";
    sortedImages.push(c_url);
    html = html + "<img class='countdown slider-images' src=\""+c_url+"\" alt=\"slide image\" height='100%' width='auto'>"
  }
  for (var i=0; i < imageOrder.length; i++){
    html = html + "<img class='slider-images' src=\""+subset[imageOrder[i]]+"\" alt=\"slide image\">";
    sortedImages.push(subset[imageOrder[i]]);
  }
  document.getElementById(elem).innerHTML =html;
  return sortedImages
}

function gaussian(mean, variance, x) {
  return Math.exp(-Math.pow(x-mean,2)/(2*variance*variance))/(Math.sqrt(2*22/7)*variance);
}

function updateScores(data, sortedImages, spaceTimeArr, imageTimeArr) {
  var images_index = 0;
  var clicked_index = 0;
  while (images_index < imageTimeArr.length && clicked_index < spaceTimeArr.length) {
    if (spaceTimeArr[clicked_index] > imageTimeArr[images_index]) {
      images_index++;
    } else {
      for (var back = 1; back < 5; back++) {
        if (images_index-back >= 0) {
          url = sortedImages[images_index-back+10];
          data[url].score += gaussian(mean, variance, spaceTimeArr[clicked_index]-imageTimeArr[images_index-back]);
        }
      }
      clicked_index++;
    }
  }
}

function step() {
  sortedKeys = getSortedKeys(data);
  renderImages(sortedKeys, totalPositives);
  renderGraph(precisionData, recallData, redundancy, positiveClass, data, sortedKeys, totalPositives);
  sortedImages = addImagesRandomly('slideImagesID', sortedKeys, numImagesPerTask);
  $('.redundancy-count').text(redundancy);
  $('.totalPositives').text(totalPositives);
  $('.current-precision').text(precisionData[redundancy][totalPositives-1])
  $('.current-recall').text(recallData[redundancy][totalPositives-1])
}

// SLIDESHOW CODE
var defaults = {
  keyCode : 32,                               // ( Number ) Keycode of spacebar.
  loopSpeed : imageSpeed,                            // ( Number ) Loop speed of slideshow as milisecond.
  initActiveImage : 0,                       // ( Number ) It will show 0 number image in intial slideshow.
  activeClass : 'active',                     // ( String ) Active class of current image.
  imagesSelector : '.slideImages > img',      // ( String ) Image selector.
  onSlideEnd : function(){}                  // ( Function ) Call back function when the slide show is done.
};

function SlideShow( $element, options ){
  widget = this;
  widget.config = $.extend( {}, defaults, options );
  widget.element = $element;
  widget.images = widget.element.find(widget.config.imagesSelector);
  widget.slideShowActive = undefined;
  widget.slideEnd = undefined;
  widget.currentImgNumb = undefined;
  widget.currentTimestamp = undefined;
  widget.currentImg = undefined;
  widget.slideData = [];
  widget.spaceData = [];
  widget.init()
}

SlideShow.prototype.init = function(){
  widget = this;
  widget.helFuns = {
    isExistImages : function(){
      if ( !widget.images.length > 0 ){
        return false;
      } else {
        return true;
      }
    },

    getCurrentImage : function(currentImgNumb){
      if ( currentImgNumb ) {
        widget.currentImgNumb = currentImgNumb;
        widget.currentImg = widget.images.eq(widget.currentImgNumb);
      } else {
        widget.currentImg = widget.element.find(widget.config.imagesSelector +'.'+ widget.config.activeClass);
        widget.currentImgNumb = widget.currentImg.index();
      }
    },

    setCurrentImage : function(currentImgNumb){
      var currentImgNumb = ( currentImgNumb ) ? currentImgNumb : widget.config.initActiveImage;

      widget.images.removeClass(widget.config.activeClass).eq(currentImgNumb).addClass(widget.config.activeClass);
      widget.currentImgNumb = currentImgNumb;
      widget.currentImg = widget.images.eq(currentImgNumb);
    },

    validateCurrent : function(low, heigh, current){
      widget.slideEnd = ( current === heigh ) ? true : false;
      current =  ( current < low ) ? heigh : ( current > heigh ) ? low : current;
      return current;
    },

    goToNextImage : function(nextImageNumb){
      var updateImageNumb = ( nextImageNumb ) ? nextImageNumb : widget.helFuns.validateCurrent( 0, (widget.images.length-1), ++widget.currentImgNumb );
      widget.currentImg.removeClass(widget.config.activeClass);
      widget.currentImg = widget.images.eq(updateImageNumb).addClass(widget.config.activeClass);
      widget.currentImgNumb = updateImageNumb;
      widget.helFuns.setCurrentTimestamp();
    },

    setCurrentTimestamp : function(){
      widget.currentTimestamp = Date.now();
    },

    addSlideData : function(){
      yodata = widget.currentTimestamp;
      widget.slideData.push(yodata);
    },

    activeSpaceData : function(){
      var keyPressEvent = function(event) {
        if (event.type == 'touchend' || event.keyCode == widget.config.keyCode) {
          if (widget.currentImgNumb < 10)
            return;
          yodata = Date.now();
          widget.spaceData.push(yodata);
          // make background flash for visual indicator
          $('#captured_images').html('');
          LAST_TIME = 500;
          $('#film_strip').css('border', "solid 5px Chartreuse");
          setTimeout(function(){ $('#captured_images').html("")}, LAST_TIME);
          setTimeout(function(){ $('#film_strip').css('border','solid 5px white') }, LAST_TIME);
          NUM_IMAGES_SHOWN = 4;
          var index = widget.currentImgNumb - 10 - NUM_IMAGES_SHOWN;
          for (var cur = 0; cur < NUM_IMAGES_SHOWN; cur++) {
            index++;
            if (index < 0)
              continue;
            var img = $('<img>');
            img.css({'height': '100%', 'margin-right': '10px'});
            img.attr('src', sortedImages[index + 10]);
            $('#captured_images').append(img);
          }                            
        }    
      };
      document.getElementById('body').addEventListener("touchend", keyPressEvent, false);
      $('body').keydown(function(event) {
        keyPressEvent(event);
      });
    }
  };

  if ( widget.helFuns.isExistImages() ) {
    widget.helFuns.setCurrentImage();
    widget.helFuns.setCurrentTimestamp();
    widget.helFuns.addSlideData();
    widget.slideShowActive = false;
    widget.slideEnd = false;
  }
}

SlideShow.prototype.runSlideShow = function(){
  widget = this;
  if ( widget.slideShowActive ) {
    return false;
  }
  widget.slideShowActive = true;
  slideIntervalHndlr = setInterval(function(){
    curr_time = Date.now();
    if (curr_time >= widget.slideData[widget.slideData.length - 1] + widget.config.loopSpeed) {
      if (!checkSlideEnd())
         widget.nextImage( widget );
      }
  }, 50);

  function checkSlideEnd(){
    if (!widget.slideEnd) {
      return false;
    } 
    $('body').off();
    window.onkeydown = null;
    clearInterval(slideIntervalHndlr);
    $('#captured_images').css('height', '0px');

    function reset_data() {
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
        window.onkeydown = function(e) { 
          return !(e.keyCode == 32);
        };
        $('#captured_images').css('height', '100%');
        var slideShow = $('#slideShow').data('slideShow');
        $(this).addClass('disable');
      });
    }

    var play = $('#togglePlay');
    play.html('Start Another Round');
    play.removeClass('disable');
    spaceTimeArr = widget.spaceData;
    imageTimeArr = widget.slideData.slice(10);
    redundancy++;
    updateScores(data, sortedImages, spaceTimeArr, imageTimeArr);
    step();
    reset_data();
    return true;
  }
}
    

SlideShow.prototype.nextImage = function(){
  widget = this;
  if ( !widget.slideEnd ) {
    widget.helFuns.goToNextImage();
    widget.helFuns.addSlideData();
  } else {
    widget.config.onSlideEnd(widget);
  }
}

SlideShow.prototype.getSlidesData = function(){
  return JSON.stringify(widget.slideData);
}

SlideShow.prototype.getSpaceData = function(){
  return widget.spaceData;
}

$.fn.slideShow = function( options ){
  $element = this.first();
  var slideShow = new SlideShow( $element, options );
  $element.data('slideShow', slideShow);
  return slideShow;
};
