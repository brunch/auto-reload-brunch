var expect = require('chai').expect;
var extend = require('util')._extend;
var path = require('path');

var Plugin = require('../index');

describe('Plugin', function() {

  beforeEach(function() {
    this.subject = function(config) {
      return new Plugin({ persistent: true, hot: config && config.hot, plugins: { autoReload: config || {} } })
    };
  });

  it('should be an object', function() {
    expect(this.subject()).to.be.ok;
  });

  it('should has #onCompile method', function() {
    expect(this.subject().onCompile).to.be.an.instanceof(Function);
  });

  describe('SSL support', function() {
    it('should not start an HTTPS server', function() {
      var plugin = this.subject();
      expect(plugin.ssl).to.not.be.ok;
      expect(plugin.httpsServer).to.be.undefined;
    });

    context('keyPath and certPath present', function() {
      var sslOptions = {
        enabled: true,
        keyPath: path.join(__dirname, './lvh.me.key'),
        certPath: path.join(__dirname, './lvh.me.cert')
      };

      it('should start an HTTPS server', function() {
        var plugin = this.subject(sslOptions);
        expect(plugin).to.be.ok;
        expect(plugin.ssl).to.be.true;
        expect(plugin.httpsServer).to.be.ok;
      });

      context('plugin disabled', function() {
        it('should not start an HTTPS server', function() {
          var plugin = this.subject(extend(sslOptions, { enabled: false }));
          expect(plugin.ssl).to.be.true;
          expect(plugin.httpsServer).to.be.undefined;
        });
      });
    });
  });

  describe('with match option', function () {
    it('matches "stylesheet" by default', function() {
      var messages = [];
      var plugin = this.subject();
      plugin.connections = [ mockConnection(msg => messages.push(msg)) ];
      plugin.onCompile([ { path: 'public/abc.css' } ]);
      expect(messages).to.eql([ 'stylesheet' ]);
    });

    it('matches "javascript" by default', function() {
      var messages = [];
      var plugin = this.subject({ hot: true });
      plugin.connections = [ mockConnection(msg => messages.push(msg)) ];
      plugin.onCompile([ { path: 'public/abc.js' } ]);
      expect(messages).to.eql([ 'javascript', 'stylesheet' ]);
    });

    it('matches "page" for unknowns', function() {
      var messages = [];
      var plugin = this.subject();
      plugin.connections = [ mockConnection(msg => messages.push(msg)) ];
      plugin.onCompile([ { path: 'public/abc.xyz' } ]);
      expect(messages).to.eql([ 'page' ]);
    });

    it('honors match.stylesheets', function() {
      var messages = [];
      var plugin = this.subject({ match: { stylesheets: /.scss$/ } });
      plugin.connections = [ mockConnection(msg => messages.push(msg)) ];
      plugin.onCompile([ { path: 'public/abc.scss' } ]);
      expect(messages).to.eql([ 'stylesheet' ]);
    });

    it('honors match.javascripts', function() {
      var messages = [];
      var plugin = this.subject({ match: { javascripts: /.jsx$/ }, hot: true });
      plugin.connections = [ mockConnection(msg => messages.push(msg)) ];
      plugin.onCompile([ { path: 'public/abc.jsx' } ]);
      expect(messages).to.eql([ 'javascript', 'stylesheet' ]);
    });

    function mockConnection (fn) {
      return { readyState: 1, send: fn };
    }
  });
});
