var Kraken = require('kraken');
var Joi = require('joi');
var fs = require('fs');
var uuid = require('uuid');
var extend = require('util')._extend;

exports.upload = {

  payload: {
    output: 'file'
  },

  validate: {
    payload: {
      file: Joi.any().required()
    }
  },

  handler: function (request, reply) {

    var self = this;
    var file = request.payload.file;

    // return tmp file path
    var getFileKey = function (filename) {
      return '/tmp/' + uuid.v4() + '-' + filename;
    };

    self.realNamePath = getFileKey(file.filename);

    fs.renameSync(file.path, self.realNamePath);

    var kraken = new Kraken({
      api_key: self.options.kraken_api_key,
      api_secret: self.options.kraken_api_secret
    });

    var opts = {
      file: self.realNamePath,
      wait: true
    };

    extend(opts, self.options.kraken_options);

    kraken.upload(opts, function (data) {
      if (data.success) {
        // remove tmp file after successful upload
        fs.unlinkSync(self.realNamePath);
        reply(data);
      } else {
        reply(data.error);
      }
    });

  }

};

