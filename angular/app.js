var path    = require('path')
,   express = require('express')
,   cluster = require('cluster')
,   os      = require('os')
,   config  = require('config')
,   app     = module.exports = express();

/**
 * Configuration
 */
app.set('root', path.join(__dirname, 'dist'));

/**
 * Middleware
 */
if (config.get('logging')) app.use(require('morgan')('combined'));
app.use(express.static(app.get('root')));
app.use(function (req, res) {
  res.sendFile(path.join(app.get('root'), 'index.html'));
});

/**
 * Boot HTTP Server
 */
if (cluster.isMaster && 'production' === config.util.getEnv('NODE_ENV')) {
  if ('gulp' !== process.title) {
    for (var i = 0; i < os.cpus().length; i++) { cluster.fork(); }
  }
} else {
  if (null === module.parent) app.listen(config.get('port'));
}

if (cluster.isMaster) process.stdout.write(
  'gulp-angular listening on port ' + config.get('port') + '...\n'
);
