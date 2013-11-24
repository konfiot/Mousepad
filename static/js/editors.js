function Editor(selector){
    this.selector = selector;
}

Editor.prototype.getModes = function(){
    return this.modes;
}

function Note(selector){
    this.selector = selector;
    this.modes = ["WYSIWYG", "Classic"];
    this.current_editor = "WYSIWYG";
}

Note.prototype = Object.create(Editor.prototype);

Note.prototype.setValue = function (value) {
    (this.current_editor === "WYSIWYG") ? $(this.selector).html(marked(value)) : $("#input").val(value);
}

Note.prototype.getValue = function(){
    return (this.current_editor === "WYSIWYG") ? md($(this.selector).html()) : $("#input").val();
}

Note.prototype.switch = function (editor){
    if (editor === "WYSIWYG"){
        if (this.current_editor === "Classic"){
            this.current_editor = "WYSIWYG";
            $("#input").unbind();
            var content = marked($("#input").val());
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
}

Note.prototype.init = function () {
    this.editor = new Pen(this.selector);
    $(this.selector).html("Content");
}

function Reminder(selector){
    this.selector = selector;
    this.modes = ["Time", "Place"];
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
}

Reminder.prototype.setValue = function (value) {
    var data = JSON.parse(value);
    if (data["type"] === "Time"){
        this.switch("Time");
        $("#calendar").val(data["date"]);
        $("#addinfo").val(data["addinfo"]);
    } else if (data["type"] === "Place") {
        this.switch("Place");

        if (typeof(this.marker) !== "undefined"){
            this.map.removeLayer(this.marker);
        }
        this.marker = L.marker(data.coords, {draggable: true}).addTo(this.map);
        this.map.setView(data.coords, 13);
    }
}

Reminder.prototype.getValue = function () {
    if (this.current_editor === "Time") {
        return JSON.stringify({
            type: "Time",
            date: $("#calendar").val(),
            addinfo: $("#addinfo").val()
        });
    } else if (this.current_editor === "Place"){
        return JSON.stringify({type: "Place", coords: this.marker.getLatLng()});
    }
}

Reminder.prototype.switch = function (editor) {
    if (editor === "Time"){
        if (this.current_editor === "Place"){
            this.current_editor = "Time";
            this.init();
        }
    } else if (editor === "Place"){
        if (this.current_editor === "Time"){
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
            }).addTo(this.map)
            
            var that = this;
            this.map.on('geosearch_foundlocations', function(location){
                if (typeof(that.marker) !== "undefined"){
                    that.map.removeLayer(that.marker);
                }
                that.marker = L.marker([location.Locations[0].Y, location.Locations[0].X], {draggable: true}).addTo(that.map);
            });
        }
    }
}

function Checklist(selector){
    this.selector = selector;
    this.modes = ["WYSIWYG"];
    this.current_editor = "WYSIWYG";
}

Checklist.prototype = Object.create(Editor.prototype);

Checklist.prototype.init = function () {
    $(this.selector).html("<form id='checklist'><div class='input-group'><span style='border-radius: 0' class='input-group-addon'><input type='checkbox'></span><input style='border-radius: 0' type='text' class='form-control'><span style='border-radius: 0 ; border-top: none' class='input-group-btn'><button style='border-radius: 0 ; border-top: none'  class='btn btn-default' type='button'><i class='fa fa-times'></i></button></span></div><!-- /input-group --></form>");
    bind();
}

function bind(){
    $("#checklist > .input-group:last > input").bind("input", function (data) {
        if ($("#checklist > .input-group:last > input").val() !== ""){
            $("#checklist > .input-group:last > input").unbind();
            $("#checklist > .input-group:last").css('opacity', '1.0');
            $("#checklist > .input-group:last").attr('class', 'input-group');
            $("#checklist").append("<div style='opacity: 0.5;' class='hid input-group'><span style='border-radius: 0 ; border-top: none' class='input-group-addon'><input type='checkbox'></span><input style='border-radius: 0 ; border-top: none' type='text' class='form-control'><span style='border-radius: 0 ; border-top: none' class='input-group-btn'><button style='border-radius: 0 ; border-top: none'  class='btn btn-default' type='button'><i class='fa fa-times'></i></button></span></div><!-- /input-group -->");
            bind();
        }
        
    });
    $("#checklist > .input-group:not(.hid) > .input-group-btn > button").bind("click", function () {
        $(this).parent().parent().remove();
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
}

Checklist.prototype.setValue = function (value) {
    var json = JSON.parse(value);
    $(this.selector).html("<form id='checklist'></form>");
    var first = true;
    for (var i in json){
        $("#checklist").append("<div class='input-group'><span style='border-radius: 0 ; " + ((!(first)) ? "border-top: none" : "") + "' class='input-group-addon'><input type='checkbox' "  + (json[i].done ? "checked" : "") + "></span><input style='border-radius: 0 ; " + ((!(first)) ? "border-top: none" : "") + "' type='text' class='form-control' value='" + json[i].value + "'><span style='border-radius: 0 ; " + ((!(first)) ? "border-top: none" : "") + "' class='input-group-btn'><button style='border-radius: 0 ; " + ((!(first)) ? "border-top: none" : "") + "'  class='btn btn-default' type='button'><i class='fa fa-times'></i></button></span></div><!-- /input-group -->");
        first = false;
    }
    bind();
}


function Sketch(selector){
    this.selector = selector;
    this.modes = ["WYSIWYG"];
    this.current_editor = "WYSIWYG";
}

Sketch.prototype = Object.create(Editor.prototype);

Sketch.prototype.init = function () {
    var height;
    
    if (typeof(window.innerHeight) == 'number') height = window.innerHeight;
    else if (document.documentElement && document.documentElement.clientHeight) height = document.documentElement.clientHeight;
    height -= 250;
    
    $(this.selector).html("<div id='sketch' style='height: " +  height + "px; width: 100%'><canvas style='width: 100%' id='canvas'></canvas></div>");

    /*$("#sketch").literallycanvas({
        imageURLPrefix : "../../../bower_components/literallycanvas/lib/img/",
        preserveCanvasContents: true
    });*/
}

Sketch.prototype.getValue = function () {
    return $('#sketch').canvasForExport().toDataURL();
}

Sketch.prototype.setValue = function (value){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0); // Or at whatever offset you like
        /*$("#sketch").literallycanvas({
            imageURLPrefix : "../../../bower_components/literallycanvas/lib/img/",
            preserveCanvasContents: true
        });*/
    };
    img.src = value;
    setTimeout(function(){
        
    }, 100);
}

function Snippet(selector){
    this.selector = selector;
    this.modes = ["default", "emacs", "vim"];
    this.current_editor = "Normal";
    window.CodeMirror.defaults.lineNumbers = true;
    window.CodeMirror.defaults.indentWithTabs = true;
}

Snippet.prototype = Object.create(Editor.prototype);

Snippet.prototype.init = function () {
    this.editor = window.CodeMirror($(this.selector)[0]);
}

Snippet.prototype.getValue = function () {
    return this.editor.getValue();
}

Snippet.prototype.setValue = function (value){
    this.editor.setValue(value); 
}

Snippet.prototype.switch = function (editor){
    this.editor.setOption("keyMap", editor);
}