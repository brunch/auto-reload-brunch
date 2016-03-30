## auto-reload-brunch
Adds automatic browser reloading support to
[brunch](http://brunch.io) when using the `brunch watch` command.

The plugin uses WebSocket technology to pass `compile` events to browser.

## Installation
Install the plugin via npm with `npm install --save auto-reload-brunch`.

Or, do manual install:

* Add `"auto-reload-brunch": "x.y.z"` to `package.json` of your brunch app.
  Pick a plugin version that corresponds to your minor (y) brunch version.
* If you want to use git version of plugin, add
`"auto-reload-brunch": "git+ssh://git@github.com:brunch/auto-reload-brunch.git"`.

## Usage
In most cases, auto-reload-brunch works out of the box without any further
configuration. Stylesheet changes will be applied seamlessly, and any other
changes will trigger a page refresh. To prevent a stylesheet from being reloaded
automatically, set the ```data-autoreload="false"``` attribute on the stylesheet's
link tag.

### Brunch plugin settings
If customization is needed or desired, settings can be modified in your brunch
config file (such as `brunch-config.coffee`):

* __enabled__: _(Boolean or Object)_ Defaults to `true`
    * As a boolean, turn on Auto-Reloading for any change in your project, or
      off entirely.
    * As an object, enable Auto-Reloading for specific types of changes. Keys
      are the file extensions of compiled files (`js` or `css`) or `assets` to
      cover any other watched files that do not get compiled. When an object is
      used, only the types explicitly set to `true` will trigger an Auto-Reload.
* __port__: _(Integer or Array of Integers)_ Defaults to `[9485..9495]`
    * The port to run the WebSocket server on. It will be applied automatically
      on the server and the client.
    * If an array, it will use the first value, but automatically fail over to
      the next value in the array if the attempted port is already in use on the
      system. This allows multiple instances to run without conflict.
* __delay__: _(Integer, in milliseconds)_ Optional, no default
    * If your system is having race-condition type problems when the browser
      tries to reload immediately after a compile, use this to set a delay
      before the reload signal is sent.
* __host__: (Default: '0.0.0.0') Server's host address.
* __forceRepaint__: (Default: false) forcefully repaint the page after stylesheets
      refresh. Enabled in Chrome by default to mitigate the issue when it doesn't
      always update styles.
* __keyPath__: Optional, no default.
  * Path to private key used for SSL.
* __certPath__: Optional, no default.
  * Path to public x509 certificate.
* __liveJs__: An experimental option to live-reload JS. See the section below on more details.

**Example:**
```coffeescript
exports.config =
  ...
  # Every setting is optional.
  plugins:
    autoReload:
      enabled:
        css: on
        js: on
        assets: off
      port: [1234, 2345, 3456]
      delay: 200 if require('os').platform() is 'win32'
      keyPath: 'path/to/ssl.key'
      certPath: 'path/to/ssl.crt'
```

### Client-side settings
If your `brunch watch` is running on a different machine than your
preview screen, you can set `server` config variable to connect to a
brunch/websocket server running at another ip address.

```html
<script>
  window.brunch = window.brunch || {};
  window.brunch.server = '192.168.1.2';
</script>
```

You can also set the port (single integer only) and/or disable auto-reload
via client-side scripting, although generally it's a better idea to use
brunch config for this:

```javascript
window.brunch['auto-reload'].port = 1234
window.brunch['auto-reload'].disabled = true;
```

### Live JS reload

Starting `<unreleased>`, auto-reload-brunch can try to reload JS without reloading the page. For that to work, you need to be using CommonJS modules with Brunch `<unreleased>`, or if you don't use modules, with any Brunch 2 version.

To enable it, set `plugins.autoReload.liveJs` to `true` in your config:

```javascript
module.exports = {
  ...
  plugins: {
    autoReload: {
      liveJs: true
    }
  }
};
```

It works by loading your updated scripts. Without proper handling this can break your app due to state stored in your modules.

Until Hot Module Replacement is implemented by Brunch (and it is a complex API, but [a discussion is open](https://github.com/brunch/brunch/issues/1097)), that means using a global to store the state that needs to be transferred to the updated module, however "bad practice" that might seem. For example, if you are using React with Redux, you'll probably want to save your store globally, and upon module update, replace the reducers with the newer ones:

```javascript
if (!window.store) {
  window.store = createStore(counterApp, 0);
} else {
  window.store.replaceReducer(counterApp);
}
```

*(https://github.com/goshakkk/brunch-livejs-reload-stage1)*

### Custom file extensions

Starting `<unreleased>`, you can configure what extensions count as stylesheet and javascript reloads. By default, any compile file with an extension other than `.css` or `.js` will do a full page reload. The `match` option allows you to issue efficient stylesheet-only reloads for other file extensions as well.

The value of `match.stylesheets` and `match.javascripts` is an [anymatch](https://www.npmjs.com/package/anymatch) set, and so can be a wildcard, regexp, function, or an array thereof.

```javascript
module.exports = {
  ...
  plugins: {
    autoReload: {
      match: {
        stylesheets: ['*.css', '*.jpg', '*.png'],
        javascripts: ['*.js']
      }
    }
  }
};
```

## License

The MIT License (MIT)

Copyright (c) 2012-2013 Paul Miller (http://paulmillr.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
