
var gulp = require('gulp');

var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var watch = require('gulp-watch');

var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

var imagemin = require('gulp-imagemin');

var path = {
  app: 'app/Resources/themes',
  bower_components: './bower_components'
};

gulp.task('sass', function() {
  return sass(path.app + '/scss', { compass: true, style: 'compressed', sourcemap: true })
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(minifyCss({keepSpecialComments:0}))
    .pipe(sourcemaps.write())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('web/css/'));
});

gulp.task('imagemin', function() {
    return gulp.src('web/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('web/img'));
});


/**
* gulp-concat && gulp-uglify
* @see https://www.npmjs.com/package/gulp-concat
* @see https://www.npmjs.com/package/gulp-uglify
*
* Compile and minify js vendor (bower_components).
*/
gulp.task('vendor', function() {
    gulp.src([
        './web/lib/chuck/dist/chuck.min.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(uglify({mangle: true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('web/js/'));
});

/**
* gulp-concat && gulp-uglify
* @see https://www.npmjs.com/package/gulp-concat
* @see https://www.npmjs.com/package/gulp-uglify
*
* Compile and minify js App (app/Resources/js).
*/
gulp.task('app', function() {
    gulp.src([
        path.app + '/**/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify({mangle: true}).on('error', gutil.log))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('web/js/'));
});

gulp.task('default', [
'vendor',
'app',
'sass'
]);
