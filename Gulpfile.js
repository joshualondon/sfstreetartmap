var gulp = require('gulp'),

  // browserSync
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,

	// CSS
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	sourcemaps = require('gulp-sourcemaps'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	atImport = require('postcss-import'),

  rename = require('gulp-rename'),
  gutil = require('gulp-util'),
	cp = require('child_process'),
	notify = require('gulp-notify');

const sourceRoot = '_src/';
const siteRoot = '_dist/';




// ------------------------------------------------------
// CSS
gulp.task('css', function() {
    return gulp.src([sourceRoot + 'assets/_sass/sfstreetartmap.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
		autoprefixer({
			browsers: ['last 3 versions', 'iOS 8']
		})
	]))
    .pipe(rename('sfstreetartmap.min.css'))
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(siteRoot + 'assets/css/'))
    .pipe(browserSync.stream({ match: '**/*.css' })) // 'match' is used to prevent reload with sourcemaps file
    .pipe(notify({ message: '✓ Main CSS complete' }));
});





// ------------------------------------------------------
// Jekyll
const child = require('child_process');
gulp.task('jekyll', () => {
  const jekyll = child
	.spawn('jekyll', ['build', '--incremental']);

    const jekyllLogger = (buffer) => {
        buffer.toString()
            .split(/\n/)
            .forEach((message) => gutil.log('Jekyll: ' + message));
    };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);

});





// ------------------------------------------------------
// Reload
gulp.task('reload', function() {
	browserSync.reload();
});




// ------------------------------------------------------
// Serve - browserSync
gulp.task('serve', function() {

    browserSync.init({
        port: 7483,
    		notify: false,
        server: {
            baseDir: siteRoot
        }
    });

	// watch the CSS
	gulp.watch([sourceRoot + 'assets/_sass/**/*.scss'], ['css']);

	// watch the critical css and reload the browser (because it's injected into the html head)
	//gulp.watch(sourceRoot + 'assets/_criticalcss/criticalcss.scss', ['criticalcss', 'jekyll']);

	// watch html and markdown to run jekyll
	gulp.watch([
		sourceRoot + '**/*.html',
		sourceRoot + '**/*.md'
	], ['jekyll']);

  // watch the html in the dist folder to refresh browser
  // waits for jekyll to finish building
  gulp.watch([
    siteRoot + '**/*.html'
  ], ['reload']);

    // gulp.watch([
	// 	'_dist/*.html',
	//
	// ]).on('change', reload);
});





gulp.task('default', ['css', 'jekyll', 'serve']);
