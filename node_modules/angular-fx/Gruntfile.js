/*global module*/
(function setUp(module) {
  'use strict';

  var banner = ['/*!',
      ' * Angular Fx v<%= pkg.version %>',
      ' *',
      ' * <%= pkg.description %>',
      ' *',
      ' * Released under the MIT license',
      ' * www.opensource.org/licenses/MIT',
      ' *',
      ' * Brought to you by 720kb.net',
      ' *',
      ' * <%= grunt.template.today("yyyy-mm-dd") %>',
      ' */\n\n'].join('\n');

  module.exports = function doGrunt(grunt) {

    grunt.initConfig({
      'pkg': grunt.file.readJSON('package.json'),
      'confs': {
        'dist': 'dist',
        'config': 'config',
        'css': 'src/css',
        'js': 'src/js',
        'serverPort': 8000
      },
      'csslint': {
        'options': {
          'csslintrc': '<%= confs.config %>/csslintrc.json'
        },
        'strict': {
          'src': [
            '<%= confs.css %>/**/*.css'
          ]
        }
      },
      'eslint': {
        'options': {
          'config': '<%= confs.config %>/eslint.json'
        },
        'target': [
          'Gruntfile.js',
          '<%= confs.js %>/**/*.js'
        ]
      },
      'uglify': {
        'options': {
          'sourceMap': true,
          'preserveComments': false,
          'report': 'gzip',
          'banner': banner
        },
        'minifyTarget': {
          'files': {
            '<%= confs.dist %>/<%= pkg.name %>.min.js': [
              '<%= confs.js %>/<%= pkg.name %>.js'
            ]
          }
        }
      },
      'cssmin': {
        'options': {
          'report': 'gzip'
        },
        'minifyTarget': {
          'files': {
            '<%= confs.dist %>/<%= pkg.name %>.min.css': [
              '<%= confs.css %>/<%= pkg.name %>.css'
            ]
          }
        }
      },
      'header': {
        'dist': {
          'options': {
            'text': banner
          },
          'files': {
            '<%= confs.dist %>/<%= pkg.name %>.min.css': '<%= confs.dist %>/<%= pkg.name %>.min.css'
          }
        }
      },
      'connect': {
        'server': {
          'options': {
            'port': '<%= confs.serverPort %>',
            'base': '.',
            'keepalive': true
          }
        }
      },
      'watch': {
        'dev': {
          'files': [
            'Gruntfile.js',
            '<%= confs.css %>/**/*.css',
            '<%= confs.js %>/**/*.js'
          ],
          'tasks': [
            'csslint',
            'eslint'
          ],
          'options': {
            'spawn': false
          }
        }
      },
      'concurrent': {
        'dev': {
          'tasks': [
            'connect:server',
            'watch:dev'
          ],
          'options': {
            'limit': '<%= concurrent.dev.tasks.length %>',
            'logConcurrentOutput': true
          }
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-header');

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [
      'csslint',
      'eslint',
      'concurrent:dev'
    ]);

    grunt.registerTask('prod', [
      'csslint',
      'eslint',
      'cssmin',
      'uglify',
      'header'
    ]);
  };
}(module));
