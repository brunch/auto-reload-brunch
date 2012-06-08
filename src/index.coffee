sysPath = require 'path'
WebSocketServer = (require 'ws').Server

module.exports = class AutoReloader
  brunchPlugin: yes

  constructor: (@config) ->
    @connections = []
    if @config.persistent
      @server = new WebSocketServer host: '0.0.0.0', port: 9485
      @server.on 'connection', (connection) =>
        @connections.push connection
        connection.on 'close', =>
          @connections.splice connection, 1

  onCompile: (changedFiles) ->
    return unless @config.persistent
    @connections
      .filter (connection) =>
        connection.readyState is 1
      .forEach (connection) =>
        connection.send 'compile'

  include: [
    (sysPath.join __dirname, '..', 'vendor', 'auto-reload.js')
  ]
