var expect = require('chai').expect;
var Plugin = require('./index');

describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #onCompile method', function() {
    expect(plugin.onCompile).to.be.an.instanceof(Function);
  });
});
