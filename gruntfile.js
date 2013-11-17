var hogan = require("hogan.js");
var glob = require("glob");
var fs = require("fs");

module.exports = function(grunt){
    var themes = [];
    var themes_dir = fs.readdirSync("static/themes/");
    for (var i in themes_dir){
        themes.push({
            templates: "static/themes/"+themes_dir[i]+"/templates/*.html",
            output: "static/themes/"+themes_dir[i]+"/template.js",
            binderName: "hulk"
        });
    }
    
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		hogan: themes,
		concat: {
            edit: {
                src: ["static/js/editors.js", "static/js/edit.js", "static/js/feedback.js", "static/js/utils.js"],
                dest: "dist/edit.js"
            },
            list: {
                src: ["bower_components/jquery/jquery.js", "bower_components/bootstrap/dist/js/bootstrap.js", "bower_components/jquery-qrcode/jquery.qrcode.min.js", "bower_components/nprogress/nprogress.js", "bower_components/alertify.js/lib/alertify.js", "bower_components/leaflet-dist/leaflet.js", "bower_components/hogan/web/builds/2.0.0/hogan-2.0.0.js", "static/js/list.js", "static/js/feedback.js", "static/js/utils.js"],
                dest: "dist/list.js"
            },
            install: {
                src: ["bower_components/jquery/jquery.js", "bower_components/bootstrap/dist/js/bootstrap.js", "bower_components/jsTimezoneDetect/jstz.js", "bower_components/zxcvbn/zxcvbn-async.js", "static/js/install.js"],
                dest: "dist/install.js"
            },
            login: {
                src: ["bower_components/jquery/jquery.js", "bower_components/nprogress/nprogress.js", "bower_components/alertify.js/lib/alertify.js", "static/js/login.js", "static/js/feedback.js"],
                dest: "dist/login.js"
            },
            settings: {
                src: ["bower_components/jquery/jquery.js", "bower_components/bootstrap/dist/js/bootstrap.js", "bower_components/nprogress/nprogress.js", "bower_components/alertify.js/lib/alertify.js", "bower_components/jsTimezoneDetect/jstz.js", "bower_components/zxcvbn/zxcvbn-async.js", "bower_components/hogan/web/builds/2.0.0/hogan-2.0.0.js", "static/js/settings.js", "static/js/feedback.js"],
                dest: "dist/settings.js"
            }
		},
		uglify : { 
            main : {
                expand: true,
                cwd: "dist",
                src : "*.js",
                dest: "dist",
            },
            templates : {
                expand: true,
                cwd: "static/themes/",
                src : "*/*.js",
                dest: "static/themes/",
            }
		}
	});
	
	grunt.loadNpmTasks('grunt-hogan');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['hogan', 'concat', 'uglify']);
	grunt.registerTask('dev', ['hogan', 'concat'])
};