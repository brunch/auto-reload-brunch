sysPath = require 'path'
WebSocketServer = (require 'ws').Server
{isWorker} = require 'cluster'

isCss = (file) ->
  sysPath.extname(file.path) is '.css'

module.exports = class AutoReloader
  brunchPlugin: yes

  constructor: (@config) ->
    if 'autoReload' of @config
      console.warn 'Warning: config.autoReload is deprecated, please move it to config.plugins.autoReload'
    cfg = @config.plugins?.autoReload ? @config.autoReload ? {}
    @enabled = cfg.enabled ? true if @config.persistent
    @connections = []
    @port = cfg.port ? 9485
    if @enabled and not isWorker
      @server = new WebSocketServer {host: '0.0.0.0', @port}
      @server.on 'connection', (connection) =>
        @connections.push connection
        connection.on 'close', =>
          @connections.splice connection, 1
      @server.on 'error', (error) ->
        console.error 'AutoReload ' +
          if error.toString().match /EADDRINUSE/
            "cannot start because port #{port} is in use"
          else error

  onCompile: (changedFiles) ->
    return unless @enabled
    didCompile = changedFiles.length > 0
    allCss = didCompile and changedFiles.every(isCss)
    if '[object Object]' is toString.call @enabled
      return unless didCompile or @enabled.assets
      if allCss
        return unless @enabled.css
      else if didCompile
        changedExts = changedFiles.map (_) ->
          sysPath.extname(_.path).slice(1)
        return unless Object.keys(@enabled).some (_) =>
          @enabled[_] and _ in changedExts
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

  # act as a compiler to automatically set ws port on client side
  type: 'javascript'
  extension: 'js'
  compile: (params, callback) ->
    if @enabled and @port isnt 9485 and 'auto-reload.js' is sysPath.basename params.path
      params.data = params.data.replace 9485, @port
    callback null, params
