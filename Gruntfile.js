module.exports = function (grunt) {

    'use strict';

    // 작업시간 표시
    require('time-grunt')(grunt);

    // 자동으로 grunt 태스크를 로드합니다. grunt.loadNpmTasks 를 생략한다.
    // require('jit-grunt')(grunt);
    require('jit-grunt')(grunt, {
        usebanner: 'grunt-banner'
    });
    
    var config = {
        // src: 'src',
        src: 'src',
        dest: 'publish3',
        bower: 'bower_components'
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,
        banner: '/*!\n' +
                ' ======================================================================== \n' +
                ' * Project   : <%= pkg.name %>(<%= pkg.description %>) v<%= pkg.version %>\n' +
                ' * Publisher : <%= pkg.author %> (<%= pkg.email %>)\n' +
                ' * Build     : <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' ======================================================================== \n' +
                ' */\n',

        // usebanner: {
        //     html: {
        //         options: {
        //             // position: 'top',
        //             banner: '<!-- <%= banner %> -->'
        //         },
        //         files: {
        //             src: [ '<%= config.dest %>/**/*.html' ]
        //         },
        //     },
        //     css: {
        //         options: {
        //             banner: '<%= banner %>'
        //         },
        //         files: {
        //             src: [ '<%= config.dest %>/css/**/*.css' ]
        //         },
        //     },
        //     js: {
        //         options: {
        //             banner: '<%= banner %>'
        //         },
        //         files: {
        //             src: [ '<%= config.dest %>/js/**/*.js' ]
        //         },
        //     }
        // },
        bake: {
            options: {
                content: '<%= config.src %>/docs/config/config.json'
            },
            dist: {
                expand: true,
                cwd: '<%= config.src %>/docs/',
                src: ['html/**/*.html'],
                dest: '<%= config.dest %>'
            },
        },
        htmlhint: {
            options: {
                htmlhintrc: 'grunt/.htmlhintrc'
            },
            dist: [
                '<%= config.dest %>/html/**/*.html',
            ]
        },
        prettify: {
            options: {
                'indent': 4,
                'condense': true,
                'indent_inner_html': false, // body, head 섹션 들여쓰지 않기
                'unformatted': [
                    'a',
                    'pre'
                ]
            },
            dist: {
                expand: true,
                cwd: '<%= config.dest %>/',
                src: ['html/**/*.html'],
                dest: '<%= config.dest %>'
            },

        },
        wiredep: {
            html: {
                src: [
                    '<%= config.src %>/docs/includes/head.html',
                    '<%= config.src %>/docs/includes/js.html'
                ]
            },
            js: {
                devDependencies: true,
                src: '<%= config.src %>/js/library/*.js'
            },
            sass: {
                src: ['<%= config.src %>/scss/plugins/{,*/}*.{scss,sass}'],
                block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                detect: {
                    css: /@import\s['"](.+css)['"]/gi
                }
            }
        },
        sass: {
            options: {
                sourceComments: false,
                sourceMap: false,
                indentWidth: 4,
                // sourceMap: true,
                outputStyle: 'expanded' // nested, expanded, compact, compressed
            },
            dist: {
                expand: true,
                cwd: '<%= config.src %>/scss/',
                src: ['**/*.{sass,scss}'],
                dest: '<%= config.dest %>/css/',
                ext: '.css'
            }
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: [
                            'Android 2.3',
                            'Android >= 4',
                            'Chrome >= 20',
                            'Firefox >= 24',
                            'Explorer >= 8',
                            'iOS >= 6',
                            'Opera >= 12',
                            'Safari >= 6'
                        ]
                    })
                ]
            },
            dist: {
                src: '<%= config.dest %>/css/*.css',
            }
        },
        cssmin: {
            options: {
                // noAdvanced: true
                compatibility: 'ie9',
                keepSpecialComments: '*', // * 기본값 유지, 0 모든주석제거, 1 첫번째유지, 
                keepBreaks: false, // 줄바꿈 유지여부 default: false
                sourceMap: true,
                advanced: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dest %>/css',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= config.dest %>/css',
                    ext: '.min.css'
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: 'grunt/.jshintrc',
                // force: true, // error 검출시 task를 fail 시키지 않고 계속 진단
                reporter: require('jshint-stylish') // output을 수정 할 수 있는 옵션
            },
            grunt: {
                src: ['Gruntfile.js']
            },
            dist: {
                src: '<%= config.src %>/js/site/site.js'
            }
        },
        concat: {
            options: {
                // separator: ';',
                stripBanners: false
            },
            dist: {
                src: '<%= config.src %>/js/site/*.js',
                dest: '<%= config.dest %>/js/site.js'
            }
        },
        uglify: {
            dist: {
                src: '<%= config.dest %>/js/site.js',
                dest: '<%= config.dest %>/js/site.min.js'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    nonull: true,
                    src: [
                        '<%= config.dest %>'
                    ]
                }]
            },
        },
        copy: {
            dist: {
                files: [ 
                    // js
                    {
                        expand: true,
                        cwd: '<%= config.src %>/js/',
                        src: '**/*.js',
                        dest: '<%= config.dest %>/js/'
                    },
                ]
            },
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/img/',
                    src: '**/*.{png,jpeg,jpg,gif}',
                    dest: '<%= config.dest %>/img/'
                }]
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dist: [
                'copy',
                'imagemin'
            ]
        },
        watch: {
            options: { livereload: true },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:grunt'],
            },
            html: {
                files: ['<%= config.src %>/docs/**/*.html'],
                tasks: ['bake','htmlhint','prettify'],
                // tasks: ['bake','htmlhint','usebanner:html'],
            },
            sass: {
                files: ['<%= config.src %>/scss/**/*.{sass,scss}'],
                tasks: ['sass','postcss','cssmin'],
            },
            jsnt: {
                files: ['<%= config.src %>/js/**/*.js'],
                tasks: ['jshint','copy:dist'],
                // tasks: ['jshint','copy:js','usebanner:js'],
                // tasks: ['jshint','concat','uglify','usebanner:js'],
            },
            img: {
                files: ['<%= config.src %>/img/**/*.{gif,jpeg,jpg,png}'],
                tasks: ['newer:imagemin'],
            },
            // fonts: {
            //     files: ['<%= config.src %>/fonts/**/*'],
            //     tasks: ['newer:copy'],
            // }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    livereload: 35729,
                    // keepalive: true,
                    base: '<%= config.dest %>',
                    open: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>/html/index.html'
                }
            }
        },
    });

    grunt.registerTask('serve', function (target) {
      if (target === 'dist') {
          return grunt.task.run(['connect', 'watch']);
      }

      grunt.task.run([
        'default',
        'connect',
        'watch'
      ]);

    });

    // html task
    grunt.registerTask('html', [
            'bake',
            'htmlhint',
            'prettify'
        ]
    );

    // css task
    grunt.registerTask('css', [
            // 'clean',
            'sass',
            'postcss',
            'cssmin'
        ]
    );

    // javascript task
    grunt.registerTask('jsnt', [
            // 'copy:bower',
            'jshint',
            'copy:dist'
        ]
    );

    grunt.registerTask('default', [
        'clean',
        'html',
        'css',
        'jsnt',
        'concurrent',
    ]);

};
