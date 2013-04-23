module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: ['source/Class.js'],
				dest: 'build/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* <%= pkg.homepage %>/\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>; Licensed <%= pkg.license %> */\n'
			},
			dist: {
				files: {
					'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		jshint: {
			files: ['gruntfile.js', 'source/**/*.js'],
			options: {
				globals: {
					eqeqeq: true
				}
			}
		},
		mochacov: {
			test: {}, // Run with the spec testrunner
			coverage: {
				options: {
					coveralls: {
						serviceName: 'travis-ci'
					}
				}
			},
			options: {
				reporter: 'spec',
				ignoreLeaks: false,
				files: 'test/*.js'
			}
		},
		watch: {
			files: ['source/**', 'test/**'],
			tasks: ['jshint', 'test']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-mocha-cov');
	
	grunt.registerTask('travis', [ 'jshint', 'mochacov:coverage']);
	grunt.registerTask('test', [ 'jshint', 'mochacov:test']);
	grunt.registerTask('default', [ 'jshint','test', 'concat', 'uglify']);
};
