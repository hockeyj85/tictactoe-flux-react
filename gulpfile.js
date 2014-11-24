var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
try {
  uglify = require('gulp-uglify');
}
catch (e){
  uglify = null;
  console.log("[\033[31mWarning\033[0m] uglify package not found, continuing without js minification.")
}

// Build js and depenencies into file and copy to dist dir
gulp.task('browserify', function() {
  if (uglify == null) {
    gulp.src('src/js/main.js')
    .pipe(browserify({transform: 'reactify'})
    .on('error', function(e) {console.log(e)}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'));
  }
  else {
    gulp.src('src/js/main.js')
    .pipe(browserify({transform: 'reactify'})
    .on('error', function(e) {console.log(e)}))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
  }
});

// Copy html to build dir
gulp.task('copy', function() {
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
});

// Run browserify and copy task
gulp.task('default', ['browserify', 'copy']);

// Run default build on changes
gulp.task('watch', function() {
  gulp.watch('src/**/*.*', ['default']);
});
