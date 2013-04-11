sysPath = require 'path'
WebSocketServer = (require 'ws').Server

module.exports = class AutoReloader
  brunchPlugin: yes

  constructor: (@config) ->
    if @config.autoReload
      console.warn 'Warning: config.autoReload is deprecated, please move it to config.plugins.autoReload'
    @enabled = @config.persistent and not @config.optimize
    @connections = []
    if @enabled
      cfg = @config.plugins?.autoReload ? @config.autoReload ? {}
      port = cfg.port ? 9485
      @server = new WebSocketServer host: '0.0.0.0', port: port
      @server.on 'connection', (connection) =>
        @connections.push connection
        connection.on 'close', =>
          @connections.splice connection, 1

  onCompile: (changedFiles) =>
    return unless @enabled
    allCss = (changedFiles.length > 0) and (changedFiles.every (file) -> file.type is 'stylesheet')
    message = if allCss then 'stylesheet' else 'page'
    @connections
      .filter (connection) =>
        connection.readyState is 1
      .forEach (connection) =>
        connection.send message

  include: ->
    if @enabled
      [(sysPath.join __dirname, '..', 'vendor', 'auto-reload.js')]
    else
      []
