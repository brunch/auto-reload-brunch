## auto-reload-brunch
Adds automatic browser reloading support to
[brunch](http://brunch.io).

The plugin uses WebSocket technology to pass `compile` events to browser.

## Usage
Add `"auto-reload-brunch": "x.y.z"` to `package.json` of your brunch app.

Pick a plugin version that corresponds to your minor (y) brunch version.

If you want to use git version of plugin, add
`"auto-reload-brunch": "git+ssh://git@github.com:brunch/auto-reload-brunch.git"`.

Because auto reload is often used only for html / style development
(because for scripts it would most of the time be quite annoying),
by default plugin is disabled. You can enable it by adding a simple script
to your page **before the other scripts on the page**.

    <script>
      window.brunch = window.brunch || {};
      window.brunch['auto-reload'] = {enabled: true};
    </script>

Additionally, if your `brunch watch` is running on a different machine than your
preview screen, you can add `server` config variable to connect to a brunch/websocket server running
another ip address. 

	window.brunch['server'] = 'xxx.xxx.xxx.xxx';

To use auto reload on a specific port, such as when multiple apps are running
on the same domain, configure the following.  On the client:

  	window.brunch['auto-reload'].port = 1234

In config.coffee

	autoReload:
	  port: 1234
