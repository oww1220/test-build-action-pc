'use strict';

// Plugin
const gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileInclude = require('gulp-file-include'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  del = require('del'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  imageMin = require('gulp-imagemin'),
  changed = require('gulp-changed'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano');

  /*타입스크립트*/
const ts = require('gulp-typescript');
const path = require('path');

/*webpack*/
const webpack = require('webpack-stream');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Folder
const root = './webapp/',
  src = root + 'src/',
  dist = root + 'dist/';

const dir = {
  src: {
    html: src + 'html/',
    sass: src + 'sass/',
    js: src + 'js/',
    ts: src + 'ts/',
    images: src + 'images/',
    bundle: src + 'bundle/'
  },
  dist: {
    html: dist + 'html/',
    css: dist + 'css/',
    js: dist + 'js/',
    images: dist + 'images/',
    library: dist + 'library/',
	  bundle: dist + 'bundle/',
    build: dist + 'build/',
  }
};

/**
 * =======================================================+
 * @task : File Include
 * =======================================================+
 */
gulp.task('fileInclude', () => {
  return new Promise(resolve => {
    gulp
      .src([dir.src.html + '**/*.html', '!' + dir.src.html + 'include/*.html'])
      .pipe(
        fileInclude({
          prefix: '@@',
          basepath: '@file'
        })
      )
      .pipe(gulp.dest(dir.dist.html))
      .pipe(
        browsersync.reload({
          // 실시간 reload
          stream: true
        })
      );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : Sass Options
 * =======================================================+
 */

const sassOptions = {
  /**
   * outputStyle (Type : String , Default : nested)
   * CSS의 컴파일 결과 코드스타일 지정 * Values : nested, expanded, compact, compressed
   */
  outputStyle: 'compact',
  /**
   * indentType (>= v3.0.0 , Type : String , Default : space)
   * 컴파일 된 CSS의 "들여쓰기" 의 타입 * Values : space , tab
   */
  indentType: 'space',
  /**
   * indentWidth (>= v3.0.0, Type : Integer , Default : 2)
   * 컴파일 된 CSS의 "들여쓰기" 의 갯수
   */
  indentWidth: 1, // outputStyle 이 nested, expanded 인 경우에 사용
  /**
   * precision (Type : Integer , Default : 5)
   * 컴파일 된 CSS 의 소수점 자리수.
   */
  precision: 6,
  /**
   * sourceComments (Type : Boolean , Default : false)
   * 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
   */
  sourceComments: false
};

/**
 * =======================================================+
 * @task : Sass Build & autoprefixer & Sass Sourcemaps
 * =======================================================+
 */
gulp.task('sass', () => {
  return new Promise(resolve => {
    gulp
      .src([
		  dir.src.sass + '*.sass',
		  dir.src.sass + '*.scss'
		], {
        sourcemaps: true
      })
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(
        gulp.dest(dir.dist.css, {
          sourcemaps: './maps'
        })
      )
      .pipe(
        browsersync.reload({
          // 실시간 reload
          stream: true
        })
      );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : Sass .min file Build & autoprefixer & Sass .min file Sourcemaps
 * =======================================================+
 */
gulp.task('sassMin', () => {
  return new Promise(resolve => {
    gulp
      .src([
		  dir.src.sass + '*.sass',
		  dir.src.sass + '*.scss'
	  ], {
        sourcemaps: true
      })
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(cssnano())
      .pipe(
        rename({
          suffix: '.min'
        })
      )
      .pipe(
        gulp.dest(dir.dist.css, {
          sourcemaps: './maps'
        })
      )
	  .pipe(
        browsersync.reload({
          // 실시간 reload
          stream: true
        })
      );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : babel & Sourcemaps
 * =======================================================+
 */
gulp.task('babel', () => {
  return new Promise(resolve => {
    gulp
      .src(dir.src.js + '**/*.js', {
        sourcemaps: true
      })
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(
        babel({
          presets: ['@babel/env']
        })
      )
      .pipe(
        gulp.dest(dir.dist.js, {
          sourcemaps: './maps'
        })
      )
      .pipe(
        browsersync.reload({
          // 실시간 reload
          stream: true
        })
      );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : babel & uglify & Sourcemaps
 * =======================================================+
 */
gulp.task('babelMin', () => {
  return new Promise(resolve => {
    gulp
      .src(dir.src.js + '**/*.js', {
        sourcemaps: true
      })
      .pipe(
        babel({
          presets: ['@babel/env']
        })
      )
      .pipe(
        uglify({
          mangle: {
            toplevel: true
          },
          output: {
            beautify: false,
            comments: false
          }
        })
      )
      .pipe(
        rename({
          suffix: '.min'
        })
      )
      .pipe(
        gulp.dest(dir.dist.js, {
          sourcemaps: './maps'
        })
      );
    resolve();
  });
});


/**
 * =======================================================+
 * @task : ts & webpack
 * =======================================================+
 */
gulp.task('ts', ()=> {
  const tsProject = ts.createProject('tsconfig.json');
  return gulp
    .src(dir.src.ts + '**/*.ts'
        , {allowEmpty: true}
    )
    .pipe(tsProject())
    .pipe(gulp.dest(dir.dist.build))
});

gulp.task('webpack', ()=>
    gulp
    .src(dir.dist.build + '**/*.js', {allowEmpty: true})
    .pipe(webpack({
        mode: 'production',
        // 파일 다중으로 내보내기 가능
        /*
        entry: {
            //CommonUI: [`${TASK_BASE_URL}/scripts/build/dist/CommonUI.js`, `${TASK_BASE_URL}/scripts/build/dist/browser.js`],
            //UI: `${TASK_BASE_URL}/scripts/build/dist/UI/Datepicker.js`,
        },
        output: {filename: '[name].bundle.js'},
        */
        output: {
            filename: '[name].chunk.js',
            //chunkFilename: '[name].chunk.[chunkhash].js',
        },
        resolve: {
            //별칭으로 절대경로 설정
            alias: {
                [`@src`]: path.resolve(__dirname, dir.dist.build)
            },
            /*
            //모듈 절대경로 설정: 배열 첫번째 항목은 로컬(사용자)모듈, 두번째 항목은 node모듈
            modules: [
                path.join(__dirname, 'wwwroot/pc/assets/scripts/build'),
                'node_modules'
            ],*/

            //웹팩이 모듈을 찾을때 확장자가 없을시 해당 배열에 있는 확장자를 붙여서 찾게하는기능!
            extensions: ['.js']
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                  vendors: {
                      test: /[\\/]node_modules[\\/]/,
                      name: 'vendors',
                      priority: 1,
                      reuseExistingChunk: true,
                  },
                  jquery: {
                      test: /[\\/]node_modules[\\/](jquery)[\\/]/,
                      name: 'jquery',
                      priority: 2,
                      reuseExistingChunk: true,
                  },
                  three: {
                      test: /[\\/]node_modules[\\/](three)[\\/]/,
                      name: 'three',
                      priority: 2,
                      reuseExistingChunk: true,
                  },
              }
            }
        },
        //devtool: 'source-map',
        module: {   
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules\/(?!bullets-js)/,
                    use: ['babel-loader'],
                }
            ]
        },
        plugins: [
            // new BundleAnalyzerPlugin({
            //     analyzerMode: 'static',               // 분석결과를 파일로 저장
            //     reportFilename: 'docs/size_dev.html', // 분설결과 파일을 저장할 경로와 파일명 지정
            //     defaultSizes: 'parsed',
            //     openAnalyzer: false,                   // 웹팩 빌드 후 보고서파일을 자동으로 열지 여부
            //     generateStatsFile: true,              // 웹팩 stats.json 파일 자동생성
            //     statsFilename: 'docs/stats_dev.json', // stats.json 파일명 rename
            // })
        ]
    }))
    .pipe(gulp.dest(dir.dist.bundle))
    .pipe(
      browsersync.reload({
        // 실시간 reload
        stream: true
      })
    )
);

gulp.task(
  'tsBundle',
  gulp.series('ts', 'webpack')
);


/**
 * =======================================================+
 * @task : image min
 * =======================================================+
 */
gulp.task('imgMin', () => {
  return new Promise(resolve => {
    gulp
      .src([
        dir.src.images + '**/*.jpg',
        dir.src.images + '**/*.gif',
        dir.src.images + '**/*.png'
      ])
      .pipe(changed(dir.dist.images))
      .pipe(imageMin())
      .pipe(gulp.dest(dir.dist.images))
	  /*
      .pipe(
        browsersync.reload({
          // 실시간 reload
          stream: true
        })
      );
	  */
    resolve();
  });
});

/**
 * =======================================================+
 * @task : DIST Folder Clean
 * =======================================================+
 */
gulp.task('clean', () => {
  return new Promise(resolve => {
    del.sync(
      [
        dir.dist.html,
        dir.dist.css,
        dir.dist.js,
        dir.dist.images,
        dir.dist.library,
        dir.dist.bundle,
        dir.dist.build,
      ],
      {
        force: true
      }
    );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : Was
 * =======================================================+
 */
gulp.task('browserSync', () => {
  return new Promise(resolve => {
    browsersync.init({
      server: {
        baseDir: dist
      },
      port: 80
    });
    resolve();
  });
});

gulp.task('fileMove', () => {
  return new Promise(resolve => {
    gulp.src([src + 'index.html']).pipe(gulp.dest(dist));
    resolve();
  });
});

gulp.task('bundleFileMove', ()=> {
  return gulp
    .src(dir.src.bundle + '**/*')
    .pipe(gulp.dest(dir.dist.bundle))
});
  
/**
 * =======================================================+
 * @task : watch
 * =======================================================+
 */
gulp.task('watch', () => {
  return new Promise(resolve => {
    gulp.watch(dir.src.html + '**/*.html', gulp.series('fileInclude'));
    gulp.watch([
		dir.src.sass + '**/*.sass',
		dir.src.sass + '**/*.scss'
	], gulp.series(['sass', 'sassMin']));

    // watch ts
    gulp.watch(
        dir.src.ts + '**/*.ts',
        gulp.series('tsBundle')
    );

    gulp.watch(dir.src.js + '**/*.js', gulp.series(['babel', 'babelMin']));
    gulp.watch(dir.src.images, gulp.series('imgMin'));
    gulp.watch(src + 'index.html', gulp.series('fileMove'));
    resolve();
  });
});

gulp.task('library', () => {
  return new Promise(resolve => {
    gulp
      .src(['./node_modules/smoothscroll-polyfill/dist/*.js'])
      .pipe(gulp.dest(dir.dist.js + 'smoothscroll-polyfill/'));

    gulp
      .src('./node_modules/swiper/swiper.min.css')
      .pipe((gulp.dest(dir.dist.css)));

    gulp
      .src([
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/swiper/swiper-bundle.min.js'        
      ])
      .pipe((gulp.dest(dir.dist.js)));

    gulp
      .src(src + 'coding_list/**/*.*')
      .pipe((gulp.dest(dist + 'coding_list/')));

    gulp
      .src(src + 'font/**/*.*')
      .pipe((gulp.dest(dist + 'font/')));

    gulp
      .src(src + 'json/**/*.*')
      .pipe((gulp.dest(dir.dist.bundle + 'json/')));

    gulp
      .src(src + 'lib/**/*.js')
      .pipe((gulp.dest(dir.dist.js)));
    
    resolve();
  });
});

gulp.task(
  'default',
  gulp.parallel(
    'clean',
    'fileInclude',
    'sass',
    'sassMin',
    'babel',
    'babelMin',
    'imgMin',
    //'fileMove',
	  //'bundleFileMove',
    'tsBundle',
    'library',
    'watch',
    'browserSync'
  )
);

gulp.task(
  'build',
  gulp.parallel(
    'clean',
    'fileInclude',
    'sass',
    'sassMin',
    'babel',
    'babelMin',
    'imgMin',
    'tsBundle',
    'library',
	//'bundleFileMove'
  )
);
