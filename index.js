var sysPath = require('path');
var fs = require('fs');
var https = require('https');
var WebSocketServer = require('ws').Server;
var isWorker = require('cluster').isWorker;
var isCss = function(file) {
  return sysPath.extname(file.path) === '.css';
};
var startingPort = 9485;

function AutoReloader(config) {
  if (config == null) config = {};
  this.config = config;
  if (config.autoReload) {
    throw new Error('Warning: config.autoReload is no longer supported, please move it to config.plugins.autoReload');
  }
  var plugins = config.plugins || {};
  var cfg = plugins.autoReload || {};
  var ports = [];

  if (cfg.port == null) {
    for (var i = 0; i < 11; i++) ports.push(startingPort + i);
  } else {
    ports = Array.isArray(cfg.port) ? cfg.port.slice() : [cfg.port];
  }

  if (this.config.persistent) {
    this.enabled = (cfg.enabled == null) ? true : cfg.enabled;
  }
  this.delay = cfg.delay;

  var conns = this.connections = [];
  var host = cfg.host || '0.0.0.0';
  var port = this.port = ports.shift();

  var key, cert;
  if (cfg.keyPath && cfg.certPath) {
    this.ssl = true;
    key = fs.readFileSync(cfg.keyPath);
    cert = fs.readFileSync(cfg.certPath);
    if (key && cert) {
      this.httpsServer = https.createServer({key: key, cert: cert}).listen(port, host);
    }
  }

  var startServer = (function() {
    this.port = port;
    var args = this.httpsServer ? {server: this.httpsServer} : {host: host, port: port}
    var server = this.server = new WebSocketServer(args);
    server.on('connection', function(conn) {
      conns.push(conn);
      conn.on('close', function() {
        conns.splice(conn, 1);
      });
    });
    server.on('error', function(error) {
      if (error.toString().match(/EADDRINUSE/)) {
        if (ports.length) {
          port = ports.shift();
          startServer();
        } else {
          error = "cannot start because port " + port + " is in use";
        }
      }
      // console.error("AutoReload " + error);
    });
  }).bind(this);

  if (this.enabled && !isWorker) startServer();
}

AutoReloader.prototype.brunchPlugin = true;
AutoReloader.prototype.type = 'javascript';
AutoReloader.prototype.extension = 'js';

AutoReloader.prototype.onCompile = function(changedFiles) {
  var enabled = this.enabled;
  var conns = this.connections;
  if (!enabled) return;

  var didCompile = changedFiles.length > 0;
  var allCss = didCompile && changedFiles.every(isCss);

  if (toString.call(enabled) === '[object Object]') {
    if (!(didCompile || enabled.assets)) return;
    if (allCss) {
      if (!enabled.css) return;
    } else if (didCompile) {
      var changedExts = changedFiles.map(function(_) {
        return sysPath.extname(_.path).slice(1);
      });
      var wasChanged = !Object.keys(enabled).some(function(_) {
        return enabled[_] && changedExts.indexOf(_) !== -1;
      });
      if (wasChanged) return;
    }
  }

  var message = allCss ? 'stylesheet' : 'page';
  var sendMessage = function() {
    conns
      .filter(function(connection) {
        return connection.readyState === 1;
      })
      .forEach(function(connection) {
        return connection.send(message);
      });
  };

  this.delay ? setTimeout(sendMessage, this.delay) : sendMessage();
};

var fileName = 'auto-reload.js';
AutoReloader.prototype.include = function() {
  return this.enabled ?
    [sysPath.join(__dirname, 'vendor', fileName)] : [];
};

AutoReloader.prototype.teardown = function() {
  if (this.server) this.server.close();
  if (this.httpsServer) this.httpsServer.close();
};

AutoReloader.prototype.compile = function(params, callback) {
  if (this.enabled &&
      this.port !== startingPort &&
      sysPath.basename(params.path) === fileName) {
    params.data = params.data.replace(startingPort, this.port);
  }
  if (this.enabled && this.ssl) {
    params.data = params.data.replace('ws://', 'wss://');
  }
  return callback(null, params);
};

module.exports = AutoReloader
