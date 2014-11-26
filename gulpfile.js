// gulpfile.js

// REQUIRED MODULES
// =============================================================================

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

// CLEAN
// =============================================================================
gulp.task('clean', function() {
  del(['dist']);
})

// CLIENT BUILD
// =============================================================================

// Build js and depenencies into file and copy to dist dir
gulp.task('browserify', function() {
  if (uglify == null) {
    gulp.src('src/client/js/main.js')
    .pipe(browserify({transform: 'reactify'})
    .on('error', function(e) {console.log(e)}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/client/js'));
  }
  else {
    gulp.src('src/client/js/main.js')
    .pipe(browserify({transform: 'reactify'})
    .on('error', function(e) {console.log(e)}))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/client/js'));
  }
});

// Copy html to dist dir
gulp.task('copy_html', function() {
  gulp.src('src/client/index.html')
    .pipe(gulp.dest('dist/client'));
});


// SERVER BUILD
// =============================================================================

var serverFiles = [
  "./server/*.*"
]

// copy server files to dist dir
gulp.task('copy_server', function() {
  gulp.src('src/server/**')
  .pipe(gulp.dest('dist'));
});


// COMPLETE BUILD TASKS
// =============================================================================

// Run browserify and copy task
gulp.task('default', ['browserify', 'copy_html', 'copy_server']);

// Run default build on changes
gulp.task('watch', function() {
  gulp.watch('src/**/*.*', ['default']);
});
