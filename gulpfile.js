const gulp = require('gulp');
const gulpRename = require('gulp-rename');
const gulpSass = require('gulp-sass');
const gulpUglify = require('gulp-uglify');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpAutoprefixer = require('gulp-autoprefixer');
const gulpConcat = require('gulp-concat');
const gulpCleanCSS = require('gulp-clean-css');

const srcScssPath = './src/scss/';
const srcJsPath = './src/js/';
const mapPath = './';

const v = '1.5.1';

let scssList = [
    'base.scss', 'alert.scss', 'alertblock.scss',
    'autocomplete.scss', 'bbcodes.scss', 'bbpanel.scss',
    'breadcrumbs.scss', 'button.scss', 'colors.scss',
    'confirm.scss', 'dropdown.scss', 'form.scss',
    'formvalidator.scss', 'grid.scss', 'modal.scss',
    'navbar.scss', 'navmenu.scss', 'pagination.scss',
    'poplight.scss', 'popup.scss', 'progress.scss',
    'slider.scss', 'spoiler.scss', 'table.scss',
    'tabs.scss', 'textarea.scss', 'tooltip.scss',
    'tagselector.scss', 'datepicker.scss',
    'size.scss', 'padding.scss'
];

scssList = scssList.map(function(v){
    return srcScssPath+v;
});

let scssListResponsive = [
    'base-responsive.scss', 'alert-responsive.scss', 'button-responsive.scss',
    'confirm-responsive.scss', 'datepicker-responsive.scss', 'grid-responsive.scss',
    'modal-responsive.scss', 'navbar-responsive.scss', 'navmenu-responsive.scss',
    'table-responsive.scss', 'tabs-responsive.scss', 'breakpoint-responsive.scss'
];

scssListResponsive = scssListResponsive.map(function(v){
    return srcScssPath+'responsive/'+v;
});

let jsList = [
    'base.js', 'navbar.js', 'modal.js', 'alert.js', 'confirm.js',
    'tabs.js', 'spoiler.js', 'textarea.js', 'bbpanel.js', 'bbcodes.js',
    'formvalidator.js', 'dropdown.js', 'toggle.js', 'tabindex.js', 'pagination.js',
    'navmenu.js', 'autocomplete.js', 'poplight.js', 'popup.js', 'slider.js',
    'tooltip.js', 'alertblock.js', 'tagselector.js', 'anchor.js', 'datepicker.js',
    'progress.js'
];

jsList = jsList.map(function(v){
    return srcJsPath+v;
});

// Build css
gulp.task('build:css', function(){
    return gulp.src(scssList)
        .pipe(gulpSass({ outputStyle: 'expanded' }))
        .pipe(gulpAutoprefixer())
        .pipe(gulpConcat('./pipui.css'))
        .pipe(gulp.dest('./build/'+v+'/css/bundles/'));
});


// Build css without concatination
gulp.task('build:css:files', function(){
    return gulp.src(scssList)
        .pipe(gulpSass({ outputStyle: 'expanded' }))
        .pipe(gulpAutoprefixer())
        .pipe(gulp.dest('./build/'+v+'/css/'));
});


// Build css responsive
gulp.task('build:responsive', function(){
    return gulp.src(scssListResponsive)
        .pipe(gulpSass({ outputStyle: 'expanded' }))
        .pipe(gulpAutoprefixer())
        .pipe(gulpConcat('./pipui-responsive.css'))
        .pipe(gulp.dest('./build/'+v+'/css/bundles/'));
});


// Build css responsive files without concatination
gulp.task('build:responsive:files', function(){
    return gulp.src(scssListResponsive)
        .pipe(gulpSass({ outputStyle: 'expanded' }))
        .pipe(gulpAutoprefixer())
        .pipe(gulp.dest('./build/'+v+'/css/'));
});


// Build js
gulp.task('build:js', function(){
    return gulp.src(jsList)
        .pipe(gulpConcat('./pipui.js'))
        .pipe(gulp.dest('./build/'+v+'/js/bundles/'));
});


// Build js files without concatination
gulp.task('build:js:files', function(){
    return gulp.src(jsList)
        .pipe(gulp.dest('./build/'+v+'/js/'));
});


// Build all files without concatination
gulp.task('build:files', gulp.series(gulp.parallel('build:css:files', 'build:responsive:files', 'build:js:files')));


// Build all
gulp.task('build', gulp.series(gulp.parallel('build:css', 'build:responsive', 'build:js', 'build:files')));





// Dist css
gulp.task('dist:css', gulp.series('build:css', function(){
    return gulp.src('./build/'+v+'/css/bundles/pipui.css')
        .pipe(gulpSourcemaps.init())
        .pipe(gulpCleanCSS())
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'+v+'/css/bundles/'));
}));


// Dist css without concatination
gulp.task('dist:css:files', gulp.series('build:css:files', function(){
    return gulp.src(['./build/'+v+'/css/*.css', '!./build/'+v+'/css/*-responsive.css'])
        .pipe(gulpSourcemaps.init())
        .pipe(gulpCleanCSS())
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'+v+'/css/'));
}));


// Dist css responsive
gulp.task('dist:responsive', gulp.series('build:responsive', function(){
    return gulp.src('./build/'+v+'/css/bundles/pipui-responsive.css')
        .pipe(gulpSourcemaps.init())
        .pipe(gulpCleanCSS())
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'+v+'/css/bundles/'));
}));


// Dist css responsive files without concatination
gulp.task('dist:responsive:files', gulp.series('build:responsive:files', function(){
    return gulp.src('./build/'+v+'/css/*-responsive.css')
        .pipe(gulpSourcemaps.init())
        .pipe(gulpCleanCSS())
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'+v+'/css/'));
}));


// Dist js
gulp.task('dist:js', gulp.series('build:js', function(){
    return gulp.src('./build/'+v+'/js/bundles/pipui.js')
        .pipe(gulpSourcemaps.init())
        .pipe(gulpUglify())
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'+v+'/js/bundles/'));
}));


// Dist js files without concatination
gulp.task('dist:js:files', function(){
    return gulp.src(jsList)
        .pipe(gulpSourcemaps.init())
        .pipe(gulpUglify())
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'+v+'/js/'));
});


// Dist all files without concatination
gulp.task('dist:files', gulp.series(gulp.parallel('dist:css:files', 'dist:responsive:files', 'dist:js:files')));


// Dist all
gulp.task('dist', gulp.series(gulp.parallel('dist:files', 'dist:css', 'dist:responsive', 'dist:js', 'dist:files')));