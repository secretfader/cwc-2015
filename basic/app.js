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
app.set('view engine', 'html');
app.engine('html', require('consolidate').nunjucks);

/**
 * Middleware
 */
if (config.get('logging')) app.use(require('morgan')('combined'));
app.use(express.static(app.get('root')));
app.use(require('./routes'));

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
  'gulp-basic listening on port ' + config.get('port') + '...\n'
);
