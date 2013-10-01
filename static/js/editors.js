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
    this.modes = ["Time", "Place"];
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
        this.switch("time");
        $("#calendar").val(data["date"]);
        $("#addinfo").val(data["addinfo"]);
    }
}

Reminder.prototype.getValue = function () {
    if (this.current_editor === "Time") {
        return JSON.stringify({
            type: "time",
            date: $("#calendar").val(),
            addinfo: $("#addinfo").val()
        });
    }
}