var gulp = require('gulp');
var gulpSass = require('gulp-Sass');

gulp.task('transformCss',function(){
	gulp.src('./src/sass/*.scss')
		.pipe(gulpSass())
		.pipe(gulp.dest('./src/css'))
})


gulp.watch('./src/sass/*.scss',['transformCss']);