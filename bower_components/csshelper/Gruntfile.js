(function (module) {
  'use strict';
  var banner = ['/*!',
      ' * css helper v<%= pkg.version %>',
      ' *',
      ' * Released by 720kb.net under the MIT license',
      ' * www.opensource.org/licenses/MIT',
      ' *',
      ' * <%= grunt.template.today("yyyy-mm-dd") %>',
      ' */\n\n'].join('\n')

  module.exports = function (grunt) {

    grunt.initConfig({
      'pkg': grunt.file.readJSON('package.json'),
      'csslint': {
        'options': {
          'csslintrc': '.csslintrc'
        },
        'strict': {
          'src': ['src/**/*.css']
        }
      },
      'cssmin': {
        'options': {
          'report': 'gzip'
        },
        'minifyTarget': {
          'files': {
            'dist/helper.min.css': [
              'src/helper.css'
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
            'dist/helper.min.css': 'dist/helper.min.css'
          }
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-header');

    grunt.registerTask('default', [
      'csslint',
      'cssmin',
      'header'
    ]);
  };
})(module);
