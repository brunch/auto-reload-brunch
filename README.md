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
```html
<script>
	window.brunch = window.brunch || {};
	window.brunch['auto-reload'] = {disabled: true};
</script>
```

Additionally, if your `brunch watch` is running on a different machine than your
preview screen, you can add `server` config variable to connect to a brunch/websocket server running
another ip address.
```javascript
window.brunch['server'] = 'xxx.xxx.xxx.xxx';
```

To use auto reload on a specific port, such as when multiple apps are running
on the same domain, configure the following.  On the client:
```javascript
window.brunch['auto-reload'].port = 1234
```

In config.coffee 
```coffeescript
plugins:
  autoReload:
    port: 1234
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
