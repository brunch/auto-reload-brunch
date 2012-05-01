sysPath = require 'path'
WebSocketServer = (require 'ws').Server

module.exports = class AutoReloader
  brunchPlugin: yes

  constructor: (@config) ->
    if @config.persistent
      @server = new WebSocketServer port: 9485
      @server.on 'connection', (ws) =>
        @ws = ws

  onCompile: (changedFiles) ->
    return unless @config.persistent
    @ws?.send 'compile'

  include: [
    (sysPath.join __dirname, '..', 'vendor', 'auto-reload.js')
  ]
