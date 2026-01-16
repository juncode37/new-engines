let gulp = require("gulp");
let browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
let cleanCss = require("gulp-clean-css");


gulp.task("server", function () {
  browserSync.init({
    server: {
      baseDir: "src",
    },
  });
});

gulp.task("styles", function () {
  return gulp.src("src/sass/*.+(scss|sass)")
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(rename({
      prefix: '',
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: true
    }))
    .pipe(cleanCss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});


gulp.task('build', function(done) {
 
  gulp.src("src/*.html").pipe(gulp.dest("dist"));
  
 
  gulp.src("src/css/**/*.css").pipe(gulp.dest("dist/css"));
  

  gulp.src("src/js/**/*.js").pipe(gulp.dest("dist/js"));
  

  gulp.src("src/img/**/*", {encoding: false}).pipe(gulp.dest("dist/img"));
  

  gulp.src("src/video/**/*", {encoding: false}).pipe(gulp.dest("dist/video"));
  
 
  gulp.src("src/icon/**/*", {encoding: false}).pipe(gulp.dest("dist/icon"));

  gulp.src("src/fonts/**/*", {encoding: false}).pipe(gulp.dest("dist/fonts"));
  
  done();
});

gulp.task('watch', function () {
  gulp.watch('src/sass/*.+(scss|sass)', gulp.parallel('styles'));
  gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles'));