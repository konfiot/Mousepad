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
                src: ["bower_components/jquery/jquery.js", "bower_components/bootstrap/dist/js/bootstrap.js", "bower_components/nprogress/nprogress.js",  "bower_components/typeahead.js/dist/typeahead.js", "bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.js", "bower_components/alertify.js/lib/alertify.js", "bower_components/hogan/web/builds/2.0.0/hogan-2.0.0.js", "bower_components/requirejs/require.js", "static/js/editors.js", "static/js/edit.js", "static/js/feedback.js", "static/js/utils.js"],
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
            },
            list_css : {
                src: ["bower_components/nprogress/nprogress.css", "bower_components/alertify.js/themes/alertify.default.css", "bower_components/alertify.js/themes/alertify.core.css", "bower_components/leaflet-dist/leaflet.css"],
                dest: "dist/list.css"
            },
            install_css : {
                src: [],
                dest: "dist/install.css"
            },
            login_css : {
                src: ["bower_components/nprogress/nprogress.css", "bower_components/alertify.js/themes/alertify.default.css", "bower_components/alertify.js/themes/alertify.core.css"],
                dest: "dist/login.css"
            },
            settings_css : {
                src: ["bower_components/nprogress/nprogress.css", "bower_components/alertify.js/themes/alertify.default.css", "bower_components/alertify.js/themes/alertify.core.css"],
                dest: "dist/settings.css"
            },
            pen : {
                src : ["bower_components/pen/src/pen.js", "bower_components/pen/src/markdown.js"],
                dest: "dist/vendor/pen.js"
            },
            md : {
                src : ["bower_components/html-md/lib/md.js"],
                dest: "dist/vendor/md.js"
            },
            marked : {
                src : ["bower_components/marked/lib/marked.js"],
                dest: "dist/vendor/marked.js"
            },
            leaflet : {
                src : ["bower_components/leaflet-dist/leaflet.js", "bower_components/L.GeoSearch/src/js/l.control.geosearch.js", "bower_components/L.GeoSearch/src/js/l.geosearch.provider.openstreetmap.js"],
                dest: "dist/vendor/leaflet.js"
            },
            datetimepicker : {
                src : ["bower_components/bootstrap3-datetimepicker/build/js/bootstrap-datetimepicker.min.js"],
                dest: "dist/vendor/datetime.js"
            },
            literallycanvas : {
                src : ["bower_components/literallycanvas/lib/js/literallycanvas.jquery.js"],
                dest: "dist/vendor/literallycanvas.js"
            },
            codemirror : {
                src : ["bower_components/codemirror/lib/codemirror.js", "bower_components/codemirror/keymap/emacs.js", "bower_components/codemirror/keymap/vim.js"],
                dest: "dist/vendor/codemirror.js"
            }
		},
		uglify : { 
            main : {
                expand: true,
                cwd: "dist",
                src : "*.js",
                dest: "dist",
            },
            vendor : {
                expand: true,
                cwd: "dist/vendor/",
                src : "*.js",
                dest: "dist/vendor/",
            },
            templates : {
                expand: true,
                cwd: "static/themes/",
                src : "*/*.js",
                dest: "static/themes/",
            }
		},
	});
	
	grunt.loadNpmTasks('grunt-hogan');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['hogan', 'concat', 'uglify']);
	grunt.registerTask('dev', ['hogan', 'concat']);
};