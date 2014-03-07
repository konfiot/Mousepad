var fs = require("fs");

var css_url_rewrite = function(url, options, dataURI) {
    var path = url.replace(options.baseDir, '');
    var hash = require('crypto').createHash('md5').update(dataURI).digest('hex');
    return '/v-' + hash + '/' + path;
};

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
                src: ["bower_components/jquery/dist/jquery.js", "bower_components/bootstrap/dist/js/bootstrap.js", "bower_components/nprogress/nprogress.js",  "bower_components/typeahead.js/dist/typeahead.js", "bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.js", "bower_components/alertify.js/lib/alertify.js", "bower_components/hogan/web/builds/2.0.0/hogan-2.0.0.js", "bower_components/requirejs/require.js", "static/js/editors.js", "static/js/edit.js", "static/js/feedback.js", "static/js/utils.js"],
                dest: "dist/js/edit.js"
            },
            list: {
                src: ["bower_components/jquery/dist/jquery.js", "bower_components/bootstrap/dist/js/bootstrap.js", "bower_components/jquery-qrcode/jquery.qrcode.min.js", "bower_components/nprogress/nprogress.js", "bower_components/alertify.js/lib/alertify.js", "bower_components/leaflet-dist/leaflet.js", "bower_components/hogan/web/builds/2.0.0/hogan-2.0.0.js", "static/js/list.js", "static/js/feedback.js", "static/js/utils.js"],
                dest: "dist/js/list.js"
            },
            install: {
                src: ["bower_components/jquery/dist/jquery.js", "bower_components/bootstrap/dist/js/bootstrap.js", "bower_components/jsTimezoneDetect/jstz.js", "bower_components/zxcvbn/zxcvbn.js", "static/js/install.js"],
                dest: "dist/js/install.js"
            },
            login: {
                src: ["bower_components/jquery/dist/jquery.js", "bower_components/nprogress/nprogress.js", "bower_components/alertify.js/lib/alertify.js", "static/js/login.js", "static/js/feedback.js"],
                dest: "dist/js/login.js"
            },
            settings: {
                src: ["bower_components/jquery/dist/jquery.js", "bower_components/bootstrap/dist/js/bootstrap.js", "bower_components/nprogress/nprogress.js", "bower_components/alertify.js/lib/alertify.js", "bower_components/jsTimezoneDetect/jstz.js", "bower_components/zxcvbn/zxcvbn.js", "bower_components/hogan/web/builds/2.0.0/hogan-2.0.0.js", "static/js/settings.js", "static/js/feedback.js", "static/js/utils.js"],
                dest: "dist/js/settings.js"
            },
            list_css : {
                src: ["bower_components/font-awesome/css/font-awesome.min.css", "bower_components/bootstrap/dist/css/bootstrap.min.css", "bower_components/nprogress/nprogress.css", "bower_components/alertify.js/themes/alertify.default.css", "bower_components/alertify.js/themes/alertify.core.css", "bower_components/leaflet-dist/leaflet.css", "bower_components/leaflet-dist/leaflet.css"],
                dest: "dist/css/list.css"
            },
            install_css : {
                src: ["bower_components/font-awesome/css/font-awesome.min.css", "bower_components/bootstrap/dist/css/bootstrap.min.css"],
                dest: "dist/css/install.css"
            },
            login_css : {
                src: ["bower_components/font-awesome/css/font-awesome.min.css", "bower_components/bootstrap/dist/css/bootstrap.min.css", "bower_components/nprogress/nprogress.css", "bower_components/alertify.js/themes/alertify.default.css", "bower_components/alertify.js/themes/alertify.core.css"],
                dest: "dist/css/login.css"
            },
            settings_css : {
                src: ["bower_components/font-awesome/css/font-awesome.min.css", "bower_components/bootstrap/dist/css/bootstrap.min.css", "bower_components/nprogress/nprogress.css", "bower_components/alertify.js/themes/alertify.default.css", "bower_components/alertify.js/themes/alertify.core.css"],
                dest: "dist/css/settings.css"
            },
            edit_css : {
                src: ["bower_components/font-awesome/css/font-awesome.min.css", "bower_components/bootstrap/dist/css/bootstrap.min.css", "bower_components/nprogress/nprogress.css", "bower_components/alertify.js/themes/alertify.default.css", "bower_components/alertify.js/themes/alertify.core.css", "tmp/pen_rewrited.css", "bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.css", "bower_components/bootstrap3-datetimepicker/build/css/bootstrap-datetimepicker.min.css", "bower_components/leaflet-dist/leaflet.css", "bower_components/L.GeoSearch/src/css/l.geosearch.css", "bower_components/literallycanvas/css/literally.css", "bower_components/codemirror/lib/codemirror.css"],
                dest: "dist/css/edit.css"
            },
            pen : {
                src : ["bower_components/pen/src/pen.js", "bower_components/pen/src/markdown.js"],
                dest: "dist/js/vendor/pen.js"
            },
            md : {
                src : ["bower_components/html-md/lib/md.js"],
                dest: "dist/js/vendor/md.js"
            },
            marked : {
                src : ["bower_components/marked/lib/marked.js"],
                dest: "dist/js/vendor/marked.js"
            },
            leaflet : {
                src : ["bower_components/leaflet-dist/leaflet.js", "bower_components/L.GeoSearch/src/js/l.control.geosearch.js", "bower_components/L.GeoSearch/src/js/l.geosearch.provider.openstreetmap.js"],
                dest: "dist/js/vendor/leaflet.js"
            },
            datetimepicker : {
                src : ["bower_components/bootstrap3-datetimepicker/build/js/bootstrap-datetimepicker.min.js"],
                dest: "dist/js/vendor/datetime.js"
            },
            literallycanvas : {
                src : ["bower_components/literallycanvas/js/literallycanvas.jquery.js"],
                dest: "dist/js/vendor/literallycanvas.js"
            },
            codemirror : {
                src : ["bower_components/codemirror/lib/codemirror.js", "bower_components/codemirror/keymap/emacs.js", "bower_components/codemirror/keymap/vim.js"],
                dest: "dist/js/vendor/codemirror.js"
            }
		},
		uglify : { 
            main : {
                expand: true,
                cwd: "dist/js",
                src : "*.js",
                dest: "dist/js",
            },
            vendor : {
                expand: true,
                cwd: "dist/js/vendor/",
                src : "*.js",
                dest: "dist/js/vendor/",
            },
            templates : {
                expand: true,
                cwd: "static/themes/",
                src : "*/*.js",
                dest: "static/themes/",
            }
		},
		copy: {
            font_awesome: {
                expand: true,
                cwd: "bower_components/font-awesome/fonts/",
                src: '*',
                dest: 'dist/fonts/',
            },
            pen: {
                expand: true,
                cwd: "bower_components/pen/src/font/",
                src: '*',
                dest: 'dist/fonts',
            },
            img_literallycanvas: {
                expand: true,
                cwd: "bower_components/literallycanvas/img/",
                src: '*',
                dest: 'dist/img/literallycanvas',
            }
		},
		csso : {
            main : {
                expand: true,
                cwd: "dist/css",
                src: "*.css",
                dest: "dist/css",
            },
		},
        cssUrlRewrite: {
            pen : {
                src: "bower_components/pen/src/pen.css",
                dest: "tmp/pen_rewrited.css",
                options: {
                    skipExternal: true,
                    rewriteUrl: function(url, options, dataURI){
                        console.log(url);
                        return url.replace("bower_components/pen/src/font/fontello", "../fonts/fontello");
                    }
                }
            }
        }
	});
	
	grunt.loadNpmTasks('grunt-hogan');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-css-url-rewrite');
	
	grunt.registerTask('default', ['hogan', 'cssUrlRewrite', 'concat', 'copy', 'uglify', 'csso']);
	grunt.registerTask('dev', ['hogan', 'cssUrlRewrite', 'concat', 'copy']);
};