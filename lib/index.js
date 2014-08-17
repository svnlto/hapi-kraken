var handler = require('./handler');

module.exports = function (plugin, options, next) {

  plugin.bind({
    options: options,
    Hapi: plugin.hapi
  });

  plugin.route([
    {
      path: options.endpoint || '/upload',
      method: 'POST',
      config: handler.upload
    }
  ]);

  next();

};

module.exports.attributes = {
  name: 'hapi-kraken',
  pkg: require('../package.json')
};

