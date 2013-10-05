function Editor(selector){
    this.selector = selector;
}

Editor.prototype.getModes = function(){
    return this.modes;
}

function Note(selector){
    this.selector = selector;
    this.modes = ["Classic", "WYSIWYG"];
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
    this.modes = ["Place", "Time"];
    this.current_editor = "Time";
}

Reminder.prototype = Object.create(Editor.prototype);

Reminder.prototype.init = function(){
    $(this.selector).html('<div class="well"><form><div class="form-group"><label>Date</label><div class=\'input-group date\' id="datetimepicker1"><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span><input id="calendar" type=\'text\' class="form-control" /></div></div><div class="form-group"><label>Additional Information</label><textarea id="addinfo" style="resize: vertical" class="form-control" rows="3"></textarea></div></form></div>');
    $('#datetimepicker1').datetimepicker({
        language: 'fr',
        pickSeconds: false,
        maskInput: false
    });
}

Reminder.prototype.setValue = function (value) {
    var data = JSON.parse(value);
    if (data["type"] === "Time"){
        //this.switch("Time");
        this.init();
        $("#calendar").val(data["date"]);
        $("#addinfo").val(data["addinfo"]);
    }
}

Reminder.prototype.getValue = function () {
    if (this.current_editor === "Time") {
        return JSON.stringify({
            type: "Time",
            date: $("#calendar").val(),
            addinfo: $("#addinfo").val()
        });
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
            var map = L.map('map').setView([51.505, - 0.09], 13);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            new L.Control.GeoSearch({
                provider: new L.GeoSearch.Provider.OpenStreetMap(),
                showMarker: false
            }).addTo(map);
        }
    }
}

function Checklist(selector){
    this.selector = selector;
    this.modes = ["WYSIWYG"];
    this.current_editor = "Time";
}

Checklist.prototype = Object.create(Editor.prototype);

Checklist.prototype.init = function () {
    $(this.selector).html("<form id='checklist'><div class='input-group'><span style='border-radius: 0' class='input-group-addon'><input type='checkbox'></span><input style='border-radius: 0' type='text' class='form-control'></div><!-- /input-group --></form>");
    bind();
}

function bind(){
    $("#checklist > .input-group:last > input").bind("input", function (data) {
        if ($("#checklist > .input-group:last > input").val() !== ""){
            $("#checklist > .input-group:last > input").unbind();
            $("#checklist > .input-group:last").css('opacity', '1.0');
            $("#checklist").append("<div style='opacity: 0.5;' class='input-group'><span style='border-radius: 0 ; border-top: none' class='input-group-addon'><input type='checkbox'></span><input style='border-radius: 0 ; border-top: none' type='text' class='form-control'></div><!-- /input-group -->");
            bind();
        }
        
    });    
}

Checklist.prototype.getValue = function () {
    var json = [];
    for (var i in $("#checklist > .input-group > input")){
        if(($("#checklist > .input-group > input")[i].value !== "") && (typeof($("#checklist > .input-group > input")[i].value) !== "undefined")){
            json.push({
                value: $("#checklist > .input-group > input")[i].value,
                done: $("#checklist > .input-group > .input-group-addon > input")[i].checked
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
        $("#checklist").append("<div class='input-group'><span style='border-radius: 0 ; " + ((!(first)) ? "border-top: none" : "") + "' class='input-group-addon'><input type='checkbox' "  + (json[i].done ? "checked" : "") + "></span><input style='border-radius: 0 ; " + ((!(first)) ? "border-top: none" : "") + "' type='text' class='form-control' value='" + json[i].value + "'></div><!-- /input-group -->");
        first = false;
    }
}
