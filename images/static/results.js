var main = function(data) {
  totalPositives = 0;
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
  sortedKeys = getSortedKeys(data);
  renderImages(sortedKeys, totalPositives);
  precisionData = [];
  recalldata = []
  renderGraph(precisionData, recallData, 0, positiveClass, data, sortedKeys, totalPositives);
  //$('.redundancy-count').text(redundancy);
  $('.totalPositives').text(totalPositives);
  $('.current-precision').text(precisionData[0][totalPositives-1])
  $('.current-recall').text(recallData[0][totalPositives-1])
}

var update = function() {
  console.log('updating');
  $.ajax({
    type: "get",
    url: "/data",
    dataType: 'json',
    success: function(data) {
      main(data);
    }
  });
}

var data = JSON.parse($('#data').val());
main(data);
setInterval('update()', 10000);
