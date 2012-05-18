(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch;
  if (!WebSocket || !br || !br['auto-reload'] || !br['auto-reload'].enabled) return;

  var connection = new WebSocket('ws://' + window.location.hostname + ':9485');
  connection.onmessage = function(event) {
    var message = event.data;
    var b = window.brunch;
    var reloadEnabled = !!(b && b['auto-reload'] && b['auto-reload'].enabled);
    if (message === 'compile' && reloadEnabled) window.location.reload();
  };
})();
