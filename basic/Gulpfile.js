/**
 * Setup Environment
 */
process.title = 'gulp';

/**
 * Dependencies
 */
var config  = require('config')
,   gulp    = require('gulp')
,   stream  = require('event-stream')
,   del     = require('del')
,   $       = require('gulp-load-plugins')();

/**
 * Tasks
 */
gulp.task('clean', function (done) {
  del('dist/**/*', done);
});

gulp.task('js', function () {
  return gulp.src('src/js/app.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  return gulp.src('src/css/app.styl')
    .pipe($.stylus())
    .pipe(gulp.dest('dist'));
});

gulp.task('rev', ['js', 'css'], function () {
  var css = gulp.src('dist/**/*.css')
    .pipe($.rev())
    .pipe($.csso());

  var js = gulp.src('dist/**/*.js')
    .pipe($.rev())
    .pipe($.uglify());

  return stream.merge(css, js)
    .pipe($.revReplace())
    .pipe(gulp.dest('dist'))
    .pipe($.cleanup())
    .pipe($.rev.manifest())
    .pipe(gulp.dest('dist'));
});

gulp.task('replace', ['js', 'css', 'rev'], function () {
  return gulp.src('views/**/*.html')
    .pipe($.revManifestReplace({
      base: __dirname,
      manifest: require('./dist/rev-manifest.json')
    }))
    .pipe(gulp.dest('views'));
});

gulp.task('watch', function () {
  $.livereload.listen();

  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/css/**/*.styl', ['css']);

  gulp.watch('dist/**/*').on('change', $.livereload.changed);

  require('./app').listen(config.get('port'));
});

gulp.task('build', [
  'js',
  'css',
  'rev',
  'replace'
]);

gulp.task('default', [
  'watch', 'js', 'css'
]);
