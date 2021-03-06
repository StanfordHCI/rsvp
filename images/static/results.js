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
  $('.metrics-at').text(metricsAt);
  $('.current-precision').text(precisionData[0][metricsAt-1])
  $('.current-recall').text(recallData[0][metricsAt-1])
}

var update = function() {
  console.log('updating');
  augmented = $('#augmented').val();
  $.ajax({
    type: "get",
    url: "/data",
    dataType: 'json',
    data:{'augmented': augmented},
    success: function(data) {
      main(data);
    }
  });
}

var data = JSON.parse($('#data').val());
main(data);
setInterval('update()', 10000);
