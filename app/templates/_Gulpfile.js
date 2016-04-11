var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var rewriteCSS = require('gulp-rewrite-css');
var autoprefixer = require('gulp-autoprefixer');


/** Variable to edit **/
var vars = {
  theme: 'default',

  //Include only the CSS from vendors or uncomment the needed lines
  //Do not include minified files
  lib_css: [
    './web/lib/font-awesome/css/font-awesome.css',
    './web/lib/ionicons/css/ionicons.css',
    // './web/lib/bootstrap/dist/css/bootstrap.css',
    // './web/lib/flexslider/flexslider.css',
    // './web/lib/fancybox/source/jquery.fancybox.js',
  ],

  //Include only the JS from vendors or uncomment the needed lines
  //Do not include minified files
  lib_js: [
    './web/lib/jquery/dist/jquery.js',
    './web/lib/bootstrap/dist/js/bootstrap.js',
    './web/lib/fastclick/lib/fastclick.js',
    // './web/lib/wow/dist/wow.js',
    // './web/lib/jquery.scrollTo/jquery.scrollTo.js',
    // './web/lib/flexslider/jquery.flexslider.js',
    // './web/lib/backstretch/jquery.backstretch.js',
    // './web/lib/fancybox/source/jquery.fancybox.js',
  ]
};

/** Please do not edit this vars **/
var path = {
  theme_dir: 'app/Resources/themes/'+vars.theme
}

gulp.task('app_less', function() {
  gulp.src(path.theme_dir + '/less/front.less')
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(cssnano({
        'postcss-minify-font-values': true
      }))
      .pipe(autoprefixer("last 2 versions"))
      .pipe(sourcemaps.write())
      .pipe(rename({basename: 'app', suffix: '.min'}))
      .pipe(sourcemaps.write('maps', {addComment: false}))
      .pipe(gulp.dest('web/css/'));
});

/**
* gulp-concat && gulp-uglify
* @see https://www.npmjs.com/package/gulp-concat
* @see https://www.npmjs.com/package/gulp-uglify
*
* Compile and minify js vendor (bower_components).
*/
gulp.task('vendor_css', function() {
  gulp.src(vars.lib_css)
  .pipe(sourcemaps.init())
  .pipe(rewriteCSS({destination: './web/css'}))
  .pipe(concat('vendor.css'))
  .pipe(cssnano({
    'postcss-minify-font-values': true
  }))
  .pipe(rename({suffix: '.min'}))
  .pipe(autoprefixer("last 2 versions"))
  .pipe(sourcemaps.write('maps', {addComment: false}))
  .pipe(gulp.dest('web/css/'));
});


/**
* gulp-concat && gulp-uglify
* @see https://www.npmjs.com/package/gulp-concat
* @see https://www.npmjs.com/package/gulp-uglify
*
* Compile and minify js App (app/Resources/js).
*/
gulp.task('app_js', function() {
  gulp.src(path.theme_dir + '/js/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(concat('app.js'))
  .pipe(uglify({mangle: true}).on('error', gutil.log))
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('web/js/'));
});

/**
* gulp-concat && gulp-uglify
* @see https://www.npmjs.com/package/gulp-concat
* @see https://www.npmjs.com/package/gulp-uglify
*
* Compile and minify js vendor (bower_components).
*/
gulp.task('vendor_js', function() {
  gulp.src(vars.lib_js)
  .pipe(sourcemaps.init())
  .pipe(concat('vendor.js'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('web/js/'));
});


gulp.task('imagemin', function() {
  return gulp.src('web/img/**/*')
      .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}]
      }))
      .pipe(gulp.dest('web/img'));
});

gulp.task('watch', function() {
    gulp.watch(path.theme_dir + '/less/**/*.less', ['app_less']);
    gulp.watch(path.theme_dir + '/js/**/*.js', ['app_js']);
});

gulp.task('default', [
  'vendor_css',
  'vendor_js',
  'app_js',
  'app_less',
  'imagemin'
]);
