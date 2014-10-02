'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var objectAssign = require('object-assign');
var rework = require('rework');
var reworkFunction = require('rework-plugin-function');

module.exports = function (options) {
	options = options || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-hsv2hex', 'Streaming not supported'));
			return;
		}

		options = objectAssign({}, options, {source: file.path});

		try {
			file.contents = new Buffer(
				rework(file.contents.toString())
					.use(reworkFunction({
						hsv: function(h, s, v) {
							s = s.replace('%', '');
							v = v.replace('%', '');
							if (s > 1) { s /= 100; }
							if (v > 1) { v /= 100; }
						  var rgb, i, data = [];
						  if (s === 0) {
						    rgb = [v,v,v];
						  } else {
						    h = h / 60;
						    i = Math.floor(h);
						    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
						    switch(i) {
						      case 0:
						        rgb = [v, data[2], data[0]];
						        break;
						      case 1:
						        rgb = [data[1], v, data[0]];
						        break;
						      case 2:
						        rgb = [data[0], v, data[2]];
						        break;
						      case 3:
						        rgb = [data[0], data[1], v];
						        break;
						      case 4:
						        rgb = [data[2], data[0], v];
						        break;
						      default:
						        rgb = [v, data[0], data[1]];
						        break;
						    }
						  }
						  return '#' + rgb.map(function(x){ 
					    	return ("0" + Math.round(x*255).toString(16)).slice(-2);
						  }).join('');
						}
					}))
					.toString()
			);

			cb(null, file);
		} catch (err) {
			cb(new gutil.PluginError('gulp-hsv2hex', err, {fileName: file.path}));
		}
	});
};
