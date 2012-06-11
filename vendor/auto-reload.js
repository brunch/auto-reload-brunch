(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch;
  if (!WebSocket || !br || !br['auto-reload'] || !br['auto-reload'].enabled) return;

  var cacheBuster = function(url){
      var date = Math.round(+new Date()/1000).toString();
      url = url.replace(/(\&|\\?)cacheBuster=\d*/,'');
      return url + ( url.indexOf('?') >=0 ? '&':'?') +'cacheBuster=' + date;
  }

  var reloaders = {
    page: function(){
      window.location.reload(true);
    },
    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel="stylesheet"]'))
        .filter(function(link){
          return (link != null && link.href != null);
        })
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });
    }
  }

  var connection = new WebSocket('ws://' + window.location.hostname + ':9485');
  connection.onmessage = function(event) {
    var message = event.data;
    var b = window.brunch;
    if(!b || !b['auto-reload'] || !b['auto-reload'].enabled) return;
    if(reloaders[message] != null){ reloaders[message](); }
    else{ reloaders.page(); }
  };
})();
