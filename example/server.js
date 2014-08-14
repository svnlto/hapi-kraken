var Hapi = require('hapi');
var port = process.env.PORT || 8080;
var server = new Hapi.Server(port, '0.0.0.0');
var fs = require('fs');

server.pack.register([
  {
    plugin: require('../'),
    options: {
      kraken_api_key: '',
      kraken_api_secret: '',
      kraken_options: {
      }
    }
  }
], function (err) {
  if (err) {
    throw err;
  }

  server.route([
    {
    path: '/',
    method: 'GET',
    handler: function(request, reply) {
      fs.readFile(__dirname + '/index.html', 'utf8', function(err, html) {
        reply(html);
      });
    }
  },
  {
    path: '/{param*}',
    method: 'GET',
    handler: {
      directory: {
        path: '.'
      }
    }
  }
  ]);

  server.start(function() {
    console.log('Hapi server started @', server.info.uri);
  });

});

