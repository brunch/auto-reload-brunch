(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  if (!WebSocket) return;

  var connection = new WebSocket('ws://' + window.location.hostname + ':9485');
  connection.onmessage = function(event) {
    var message = event.data;
    var b = window.brunch;
    var reloadEnabled = !!(b && b['auto-reload'] && b['auto-reload'].enabled);
    if (message === 'compile' && reloadEnabled) window.location.reload();
  };
})();
