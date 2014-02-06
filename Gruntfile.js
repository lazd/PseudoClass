module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: 'build/'
		},
		copy: {
			js: {
				expand: true,
				flatten: true,
				isFile: true,
				src: ['source/*.js'],
				dest: 'build/'
			},
			examples: {
				expand: true,
				cwd: 'source/examples/',
				src: ['**'],
				dest: 'build/examples/'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* <%= pkg.homepage %>/\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>; Licensed <%= pkg.license %> */\n',
				mangle: {
					except: ['_super']
				}
			},
			dist: {
				files: {
					'build/Class.min.js': ['build/Class.js']
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'source/**/*.js'],
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
		},
		bench: {
			all: {
				src: ['benchmarks/*.js'],
				dest: 'build/results/benchmark.csv'
			},
			creation: {
				src: ['benchmarks/creation.js'],
				dest: 'build/results/benchmark_creation.csv'
			},
			definition: {
				src: ['benchmarks/definition.js'],
				dest: 'build/results/benchmark_definition.csv'
			},
			extension: {
				src: ['benchmarks/extension.js'],
				dest: 'build/results/benchmark_extension.csv'
			},
			super: {
				src: ['benchmarks/super.js'],
				dest: 'build/results/benchmark_super.csv'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-mocha-cov');
	grunt.loadNpmTasks('grunt-benchmark');
	
	grunt.renameTask('benchmark', 'bench');
	grunt.registerTask('benchmark', 'bench:all');

	grunt.registerTask('travis', [ 'jshint', 'mochacov:coverage' ]);
	grunt.registerTask('test', [ 'jshint', 'mochacov:test' ]);
	grunt.registerTask('default', [ 'clean', 'test', 'copy', 'uglify' ]);
};
