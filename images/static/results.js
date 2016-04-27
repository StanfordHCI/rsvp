totalPositives = 0;
var data = $('#data').val();
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
