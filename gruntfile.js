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
		hogan: themes
	});
	
	grunt.loadNpmTasks('grunt-hogan');
	
	grunt.registerTask('default', ['hogan']);
};