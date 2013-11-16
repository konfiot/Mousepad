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
                src: ["static/js/list.js", "static/js/feedback.js", "static/js/utils.js"],
                dest: "dist/list.js"
            },
            install: {
                src: ["static/js/install.js"],
                dest: "dist/install.js"
            },
            login: {
                src: ["static/js/login.js", "static/js/feedback.js"],
                dest: "dist/login.js"
            },
            settings: {
                src: ["static/js/settings.js", "static/js/feedback.js"],
                dest: "dist/settings.js"
            }
		},
		uglify : { 
            target : {
                expand: true,
                cwd: "dist",
                src : "*.js",
                dest: "dist/min"
            }
		}
	});
	
	grunt.loadNpmTasks('grunt-hogan');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['hogan', 'concat', 'uglify']);
};