/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: [
          '<banner:meta.banner>',
          'src/app.js',
          'src/utils/**/*.js',
          'src/services/models/**/*.js',
          'src/services/collections/**/*.js',
          'src/view.js',
          'src/bootstrap.js'
        ],
        dest: 'dist/main.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/main.min.js'
      }
    },
    compass: {
      dev: {
        src: 'sass',
        dest: 'css',
        outputstyle: 'expanded',
        linecomments: true,
//        debugsass: true,
        images: '/img',
        relativeassets: true
      },
      prod: {
        src: 'sass',
        dest: 'css',
        outputstyle: 'compressed',
        linecomments: false,
        images: '/img',
        relativeassets: true
      }
    },
    growl: {
      compileMessage: {
        message: 'Compiled sources!!',
        title: 'Grunt compile'
      }
    },
    reload: {
      port: 35729,
      liveReload: {}
    },
    watch: {
      files: ['<config:lint.files>', 'sass/*.scss'],
      tasks: 'default reload growl:compileMessage'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-growl');
  grunt.loadNpmTasks('grunt-reload');

  // Default task.
  grunt.registerTask('default', 'concat min compass:dev');

};
