require.config({
    shim: {
        'pen': {
            exports: 'Pen'
        },
        'md': {
            exports: 'md'
        },
        'marked': {
            exports: 'marked'
        },
        'codemirror': {
            exports: "CodeMirror"
        },
        'leaflet': {
            exports: "L"
        }
        
    }
});


define('editor', function(){
    function Editor(selector){
        this.selector = selector;
    }
    
    Editor.prototype.getModes = function(){
        return this.modes;
    };
    
    return Editor;
});    


define("note", ["editor", "pen", "marked", "md"], function (Editor, Pen, marked, md) {
    function Note(selector){
        this.selector = selector;
        this.modes = ["WYSIWYG", "Classic"];
        this.current_editor = "WYSIWYG";
    }
    
    Note.prototype = Object.create(Editor.prototype);
    
    Note.prototype.setValue = function (value) {
        (this.current_editor === "WYSIWYG") ? $(this.selector).html(marked(value)) : $("#input").val(value);
    };
    
    Note.prototype.getValue = function(){
        return (this.current_editor === "WYSIWYG") ? md($(this.selector).html()) : $("#input").val();
    };
    
    Note.prototype.switch = function (editor){
        var content;
        if (editor === "WYSIWYG"){
            if (this.current_editor === "Classic"){
                this.current_editor = "WYSIWYG";
                $("#input").unbind();
                content = marked($("#input").val());
                $(this.selector).html(content);
                this.editor.rebuild();
            }
        } else if (editor === "Classic"){
            if (this.current_editor === "WYSIWYG"){
                this.current_editor = "Classic";
                content = md($(this.selector).html());
                this.editor.destroy();
                $(this.selector).html("<textarea id='input' rows='" + content.split(/\r\n|\r|\n/).length + "'>" + content + "</textarea>");
                $(this.selector).css("height", "100%");
                $("#input").bind('input', function(){
                    $("#input").attr('rows', $("#input").val().split(/\r\n|\r|\n/).length);
                });
            }
        }
    };

    Note.prototype.init = function () {
        this.editor = new Pen({
            editor: $(this.selector)[0],
            stay: false,
            debug: false
        });
        $(this.selector).html("Content");
    };
    
    Note.prototype.change = function (cb) {
        $(this.selector).on("DOMSubtreeModified", function(){
            cb();
        });
    };
    
    return Note;
});

define("reminder", ["editor", "datetime"], function (Editor) {
    function Reminder(selector){
        this.selector = selector;
        this.modes = ["Time"];
        this.current_editor = "Time";
    }
    
    Reminder.prototype = Object.create(Editor.prototype);
    
    Reminder.prototype.init = function(){
        $(this.selector).html('<div class="well"><form><div class="form-group"><label>Date</label><div class=\'input-group date\' id="datetimepicker1"><span class="input-group-addon"><span class="glyphicon glyphfa-calendar"></span></span><input id="calendar" type=\'text\' class="form-control" /></div></div><div class="form-group"><label>Additional Information</label><textarea id="addinfo" style="resize: vertical" class="form-control" rows="3"></textarea></div></form></div>');
        $('#datetimepicker1').datetimepicker({
            language: 'fr',
            pickSeconds: false,
            maskInput: false
        });
    };
    
    Reminder.prototype.setValue = function (value) {
        var data = JSON.parse(value);
        $("#calendar").val(data.date);
        $("#addinfo").val(data.addinfo);
    };
    
    Reminder.prototype.getValue = function () {
        return JSON.stringify({
            date: $("#calendar").val(),
            addinfo: $("#addinfo").val()
        });
    };
    
    Reminder.prototype.change = function (cb) {
        $("#calendar").on("change", function(){
            cb();
        });
        $("#calendar").on("input", function(){
            cb();
        });
        $("#addinfo").on("input", function(){
            cb();
        });
    };
    
    return Reminder;
});

define("checklist", ["editor"], function (Editor) {
    function Checklist(selector){
        this.selector = selector;
        this.modes = ["WYSIWYG"];
        this.current_editor = "WYSIWYG";
    }
    
    Checklist.prototype = Object.create(Editor.prototype);
    
    Checklist.prototype.init = function () {
        $(this.selector).html("<form id='checklist'><div class='input-group'><span style='border-radius: 0' class='input-group-addon'><input type='checkbox'></span><input style='border-radius: 0' type='text' class='form-control'><span style='border-radius: 0 ; border-top: none' class='input-group-btn'><button style='border-radius: 0 ; border-top: none'  class='btn btn-default' type='button'><i class='fa fa-times'></i></button></span></div><!-- /input-group --></form>");
        bind();
    };
    
    function bind(cb){
        $("#checklist > .input-group:not(.hid) > input").unbind();
        $("#checklist > .input-group:not(.hid) > button").unbind();
        $("#checklist > .input-group:not(.hid) > .input-group-addon > input").unbind();
        
        $("#checklist > .input-group:last > input").bind("input", function (data) {
            if ($("#checklist > .input-group:last > input").val() !== ""){
                $("#checklist > .input-group:last > input").unbind();
                $("#checklist > .input-group:last").css('opacity', '1.0');
                $("#checklist > .input-group:last").attr('class', 'input-group');
                $("#checklist").append("<div style='opacity: 0.5;' class='hid input-group'><span style='border-radius: 0 ; border-top: none' class='input-group-addon'><input type='checkbox'></span><input style='border-radius: 0 ; border-top: none' type='text' class='form-control'><span style='border-radius: 0 ; border-top: none' class='input-group-btn'><button style='border-radius: 0 ; border-top: none'  class='btn btn-default' type='button'><i class='fa fa-times'></i></button></span></div><!-- /input-group -->");
                bind(cb);
            }
            
        });
        $("#checklist > .input-group:not(.hid) > .input-group-btn > button").bind("click", function () {
            cb();
            $(this).parent().parent().remove();
        });
        $("#checklist > .input-group:not(.hid) > input").on("input", function () {
            cb();
        });
        $("#checklist > .input-group:not(.hid) > input").keypress(function (event) {
            switch (event.keyCode){
                case 13 :    
                case 40 :    
                case 9 :    
                    $(this).parent().next().children("input").focus();
                break;
                case 38 :
                    $(this).parent().prev().children("input").focus();
                break;
            }
        });
        $("#checklist > .input-group:not(.hid) > .input-group-addon > input").on("change", function () {
            cb();
        });
    }
    
    Checklist.prototype.getValue = function () {
        var json = [];
        for (var i in $("#checklist > .input-group:not(.hid) > input")){
            if(($("#checklist > .input-group:not(.hid) > input")[i].value !== "") && (typeof($("#checklist > .input-group:not(.hid) > input")[i].value) !== "undefined")){
                json.push({
                    value: $("#checklist > .input-group:not(.hid) > input")[i].value,
                    done: $("#checklist > .input-group:not(.hid) > .input-group-addon > input")[i].checked
                });
            }
        }
        return JSON.stringify(json);
    };
    
    Checklist.prototype.setValue = function (value) {
        var json = JSON.parse(value);
        $(this.selector).html("<form id='checklist'></form>");
        var first = true;
        for (var i in json){
            $("#checklist").append("<div class='input-group'><span style='border-radius: 0 ; " + ((!(first)) ? "border-top: none" : "") + "' class='input-group-addon'><input type='checkbox' "  + (json[i].done ? "checked" : "") + "></span><input style='border-radius: 0 ; " + ((!(first)) ? "border-top: none" : "") + "' type='text' class='form-control' value='" + json[i].value + "'><span style='border-radius: 0 ; " + ((!(first)) ? "border-top: none" : "") + "' class='input-group-btn'><button style='border-radius: 0 ; " + ((!(first)) ? "border-top: none" : "") + "'  class='btn btn-default' type='button'><i class='fa fa-times'></i></button></span></div><!-- /input-group -->");
            first = false;
        }
        $("#checklist").append("<div class='input-group' style='opacity:0.5'><span style='border-radius: 0 ; border-top: none' class='input-group-addon'><input type='checkbox'></span><input style='border-radius: 0; border-top: none' type='text' class='form-control' ><span style='border-radius: 0 ;border-top: none;' class='input-group-btn'><button style='border-radius: 0;border-top: none;'  class='btn btn-default' type='button'><i class='fa fa-times'></i></button></span></div><!-- /input-group -->");
        bind(this.cb);
    };
    
    Checklist.prototype.change = function (cb) {
        bind(cb);
    };
    return Checklist;
});

define("sketch", ["editor", "literallycanvas"], function (Editor) {
    function Sketch(selector){
        this.selector = selector;
        this.modes = ["WYSIWYG"];
        this.current_editor = "WYSIWYG";
    }
    
    Sketch.prototype = Object.create(Editor.prototype);
    
    Sketch.prototype.init = function () {
        if (typeof(window.innerHeight) == 'number') this.height = window.innerHeight;
        else if (document.documentElement && document.documentElement.clientHeight) this.height = document.documentElement.clientHeight;
        this.height -= 250;
        $(this.selector).html("<div id='sketch' style='height: " +  this.height + "px;width: 100%'><canvas id='canvas' style='width: 100%'></canvas></div>");
        var that = this;
        $("#sketch").literallycanvas({
            imageURLPrefix : "../../../dist/img/literallycanvas/",
            onInit: function(lc) {
                that.lc = lc;
            }
        });
    };
    
    Sketch.prototype.getValue = function () {
        return this.lc.getSnapshotJSON();
    };
    
    Sketch.prototype.setValue = function (value){
        this.lc.loadSnapshotJSON(value);
    };
    
    Sketch.prototype.change = function (cb) {
        this.lc.on("drawContinue", function () {
            cb();
        });
    };
    return Sketch;
});

define("snippet", ["editor", "codemirror"], function (Editor, CodeMirror) {
    function Snippet(selector){
        this.selector = selector;
        this.modes = ["default", "emacs", "vim"];
        this.current_editor = "Normal";
        CodeMirror.defaults.lineNumbers = true;
        CodeMirror.defaults.indentWithTabs = true;
    }
    
    Snippet.prototype = Object.create(Editor.prototype);
    
    Snippet.prototype.init = function () {
        this.editor = CodeMirror($(this.selector)[0]);
    };
    
    Snippet.prototype.getValue = function () {
        return this.editor.getValue();
    };
    
    Snippet.prototype.setValue = function (value){
        this.editor.setValue(value); 
    };
    
    Snippet.prototype.switch = function (editor){
        this.editor.setOption("keyMap", editor);
    };
    
    Snippet.prototype.change = function (cb) {
        this.editor.on("change", function () {
            cb();
        });
    };
    return Snippet;
});

define("place", ["editor", "leaflet"], function (Editor, L) {
    function Place(selector){
        this.selector = selector;
        this.modes = ["Place"];
        this.current_editor = "Place";
    }
    
    Place.prototype = Object.create(Editor.prototype);
    
    Place.prototype.init = function(){
        var height;
        
        if (typeof(window.innerHeight) == 'number') height = window.innerHeight;
        else if (document.documentElement && document.documentElement.clientHeight) height = document.documentElement.clientHeight;
        height -= 250;
        
        this.current_editor = "Place";
        $("#note").html("<div id='map' style='height: " +  height + "px'></div>");
        
        this.map = L.map('map').setView([51.505, - 0.09], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        new L.Control.GeoSearch({
            provider: new L.GeoSearch.Provider.OpenStreetMap(),
            showMarker: false
        }).addTo(this.map);
        
        var that = this;
        this.map.on('geosearch_foundlocations', function(location){
            if (typeof(that.marker) !== "undefined"){
                that.map.removeLayer(that.marker);
            }
            that.marker = L.marker([location.Locations[0].Y, location.Locations[0].X], {draggable: true}).addTo(that.map);
            var cb = that.cb;
            cb();
            that.marker.on("drag", function () {
                cb();
            });
        });
    };
    
    Place.prototype.setValue = function (value) {
        var data = JSON.parse(value);
        if (typeof(this.marker) !== "undefined"){
            this.map.removeLayer(this.marker);
        }
        this.marker = L.marker(data.coords, {draggable: true}).addTo(this.map);
        var cb = this.cb;
        this.marker.on("drag", function(){
            cb();
        });
        this.map.setView(data.coords, 13);
    };
    
    Place.prototype.getValue = function () {
        return JSON.stringify({coords: this.marker.getLatLng()});
    };
    
    Place.prototype.change = function (cb) {
        this.cb = cb;
    }
    
    return Place;
});