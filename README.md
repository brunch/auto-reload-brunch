## auto-reload-brunch
Adds automatic browser reloading support to
[brunch](http://brunch.io).

The plugin uses WebSocket technology to pass `compile` events to browser.

## Usage
Install the plugin via npm with `npm install --save auto-reload-brunch`.

Or, do manual install:

* Add `"auto-reload-brunch": "x.y.z"` to `package.json` of your brunch app.
  Pick a plugin version that corresponds to your minor (y) brunch version.
* If you want to use git version of plugin, add
`"auto-reload-brunch": "git+ssh://git@github.com:brunch/auto-reload-brunch.git"`.

Auto-reload-brunch can be disabled with this command:

    <script>
      window.brunch = window.brunch || {};
      window.brunch['auto-reload'] = {disabled: true};
    </script>

Additionally, if your `brunch watch` is running on a different machine than your
preview screen, you can add `server` config variable to connect to a brunch/websocket server running
another ip address.

	window.brunch['server'] = 'xxx.xxx.xxx.xxx';

To use auto reload on a specific port, such as when multiple apps are running
on the same domain, configure the following.  On the client:

  	window.brunch['auto-reload'].port = 1234

In config.coffee

	plugins:
	  autoReload:
	    port: 1234
