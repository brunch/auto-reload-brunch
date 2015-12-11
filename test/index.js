var expect = require('chai').expect;
var extend = require('util')._extend;
var path = require('path');

var Plugin = require('../index');

describe('Plugin', function() {

  beforeEach(function() {
    this.subject = function(config) {
      return new Plugin({ persistent: true, plugins: { autoReload: config || {} } })
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
});
