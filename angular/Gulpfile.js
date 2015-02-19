/**
 * Setup Environment
 */
process.title = 'gulp';

/**
 * Dependencies
 */
var config  = require('config')
,   gulp    = require('gulp')
,   queue   = require('streamqueue')
,   stream  = require('event-stream')
,   del     = require('del')
,   bower   = require('main-bower-files')()
,   $       = require('gulp-load-plugins')();

/**
 * Tasks
 */
gulp.task('test', function () {
  return gulp.src('test/*.test.js')
    .pipe($.mocha());
});

gulp.task('clean', function (done) {
  del('dist/**/*', done);
});

gulp.task('js', function () {
  var lib, app;

  lib = gulp.src(bower);
  app = gulp.src([
    'src/js/app.js',
    'src/js/controllers/*.js'
  ])
  .pipe($.ngAnnotate());

  return queue({ objectMode: true }, lib, app)
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  return gulp.src('src/css/app.styl')
    .pipe($.stylus({
      include: ['src/css', 'vendor/css']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('src/img/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('templates', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('rev', ['js', 'css', 'images', 'fonts', 'templates'], function () {
  var assets = gulp.src([
    'dist/**/*',
    '!dist/**/*.html',
    '!dist/**/*.css',
    '!dist/**/*.js'
  ])
    .pipe($.rev());

  var css = gulp.src('dist/**/*.css')
    .pipe($.rev())
    .pipe($.csso());

  var js = gulp.src('dist/**/*.js')
    .pipe($.rev())
    .pipe($.uglify());

  var templates = gulp.src('dist/**/*.html');

  return stream.merge(assets, css, js, templates)
    .pipe($.revReplace())
    .pipe(gulp.dest('dist'))
    .pipe($.cleanup())
    .pipe($.rev.manifest())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  $.livereload.listen();

  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/css/**/*.styl', ['css']);
  gulp.watch('src/img/*', ['images']);
  gulp.watch('src/fonts/*', ['fonts']);
  gulp.watch('src/**/*.html', ['templates']);

  gulp.watch('dist/**/*').on('change', $.livereload.changed);

  require('./app').listen(config.get('port'));
});

gulp.task('build', [
  'js',
  'css',
  'images',
  'fonts',
  'templates',
  'rev'
]);

gulp.task('default', [
  'watch', 'js', 'css', 'images', 'fonts', 'templates'
]);
