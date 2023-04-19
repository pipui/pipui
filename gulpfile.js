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

const v = '2.0.0';

let scssList = [
    'Base.scss',
    'Alert.scss',
    'Alertblock.scss',
    'Pagination.scss',
    'Tabs.scss',
    'Breadcrumbs.scss',
    'Navbar.scss',
    'Padding.scss',
    'Colors.scss',
    'Dropdown.scss',
    'Table.scss',
    'Grid.scss',
    'Forms.scss',
    'Size.scss',
    'Autocomplete.scss',
    'BBPanel.scss',
    'BBCodes.scss',
    'Buttons.scss',
    'Confirm.scss',
    'Modal.scss',
    'Gallery.scss',
    'Image.scss',
    'Navmenu.scss',
    'Popup.scss',
    'Progress.scss',
    'Slider.scss',
    'Collapse.scss',
    'Tooltip.scss',
    'Textarea.scss',
    'Tagselector.scss',
    'Datepicker.scss',
    'Validator.scss',

];

scssList = scssList.map(function(v){
    return srcScssPath+v;
});

let scssListResponsive = [
    'Base-responsive.scss',
    'Alert-responsive.scss',
    'Buttons-responsive.scss',
    'Confirm-responsive.scss',
    'Datepicker-responsive.scss',
    'Grid-responsive.scss',
    'Modal-responsive.scss',
    'Navbar-responsive.scss',
    'Navmenu-responsive.scss',
    'Table-responsive.scss',
    'Slider-responsive.scss',
    'Tabs-responsive.scss',
    'Gallery-responsive.scss',
    'Breakpoint-responsive.scss'
];

scssListResponsive = scssListResponsive.map(function(v){
    return srcScssPath+'responsive/'+v;
});

let jsList = [
    'Base.js',
    'DateComponent.js',
    'LoggerComponent.js',
    'StorageComponent.js',
    'AnimationComponent.js',
    'AnimationsComponent.js',
    'TabsComponent.js',
    'AlertblockComponent.js',
    'TooltipComponent.js',
    'NavbarComponent.js',
    'DropdownComponent.js',
    'AnchorComponent.js',
    'PaginationComponent.js',
    'FormsComponent.js',
    'ProgressComponent.js',
    'CollapseComponent.js',
    'ModalComponent.js',
    'AlertComponent.js',
    'ConfirmComponent.js',
    'BBPanelComponent.js',
    'DatepickerComponent.js',
    'ImageComponent.js',
    'GalleryComponent.js',
    'PopupComponent.js',
    'TagselectorComponent.js',
    'SliderComponent.js',
    'AutocompleteComponent.js',
    'TextareaComponent.js',
    'ValidatorComponent.js',
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
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulp.dest('./dist/'+v+'/css/bundles/'));
}));


// Dist css without concatination
gulp.task('dist:css:files', gulp.series('build:css:files', function(){
    return gulp.src(['./build/'+v+'/css/*.css', '!./build/'+v+'/css/*-responsive.css'])
        .pipe(gulpSourcemaps.init())
        .pipe(gulpCleanCSS())
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulp.dest('./dist/'+v+'/css/'));
}));


// Dist css responsive
gulp.task('dist:responsive', gulp.series('build:responsive', function(){
    return gulp.src('./build/'+v+'/css/bundles/pipui-responsive.css')
        .pipe(gulpSourcemaps.init())
        .pipe(gulpCleanCSS())
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulp.dest('./dist/'+v+'/css/bundles/'));
}));


// Dist css responsive files without concatination
gulp.task('dist:responsive:files', gulp.series('build:responsive:files', function(){
    return gulp.src('./build/'+v+'/css/*-responsive.css')
        .pipe(gulpSourcemaps.init())
        .pipe(gulpCleanCSS())
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulp.dest('./dist/'+v+'/css/'));
}));


// Dist js
gulp.task('dist:js', gulp.series('build:js', function(){
    return gulp.src('./build/'+v+'/js/bundles/pipui.js')
        .pipe(gulpSourcemaps.init())
        .pipe(gulpUglify())
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulp.dest('./dist/'+v+'/js/bundles/'));
}));


// Dist js files without concatination
gulp.task('dist:js:files', function(){
    return gulp.src(jsList)
        .pipe(gulpSourcemaps.init())
        .pipe(gulpUglify())
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpSourcemaps.write(mapPath))
        .pipe(gulp.dest('./dist/'+v+'/js/'));
});


// Dist all files without concatination
gulp.task('dist:files', gulp.series(gulp.parallel('dist:css:files', 'dist:responsive:files', 'dist:js:files')));


// Dist all
gulp.task('dist', gulp.series(gulp.parallel('dist:files', 'dist:css', 'dist:responsive', 'dist:js', 'dist:files')));