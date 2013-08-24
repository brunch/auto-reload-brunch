sysPath = require 'path'
WebSocketServer = (require 'ws').Server

isCss = (file) ->
  sysPath.extname(file.path) is '.css'

module.exports = class AutoReloader
  brunchPlugin: yes

  constructor: (@config) ->
    if @config.autoReload
      console.warn 'Warning: config.autoReload is deprecated, please move it to config.plugins.autoReload'
    cfg = @config.plugins?.autoReload ? @config.autoReload ? {}
    @enabled = @config.persistent and cfg.enabled isnt false
    @connections = []
    if @enabled
      port = cfg.port ? 9485
      @server = new WebSocketServer host: '0.0.0.0', port: port
      @server.on 'connection', (connection) =>
        @connections.push connection
        connection.on 'close', =>
          @connections.splice connection, 1
      @server.on 'error', (error) ->
        console.error 'AutoReload ' +
          if error.toString().match /EADDRINUSE/
            "cannot start because port #{port} is in use"
          else error
      
  onCompile: (changedFiles) =>
    return unless @enabled
    allCss = (changedFiles.length > 0) and changedFiles.every(isCss)
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

  teardown: -> @server?.close()
