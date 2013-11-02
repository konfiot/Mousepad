function getAnchor() {
    var currentUrl = document.URL,
        urlParts = currentUrl.split('#');
    return (urlParts.length > 1) ? urlParts[1] : undefined;
}

var anchor, type, id;
var editor;
var mode = "WYSIWYG";
var to_delete;
var types = ["note", "reminder", "checklist", "sketch"];

$(function(){
    anchor = getAnchor();
    if ((typeof(anchor) === "string") && (anchor !== "") && (types.indexOf(anchor) === -1)){
        id = anchor;
        $.post("/app/api/get.php", {data: JSON.stringify({id: id})}, function(data){
            type = data["meta"]["type"];
            switch (data["meta"]["type"]){
                case "note" : 
                    editor = new Note("#note");
                break;
                case "reminder" :
                    editor = new Reminder("#note");
                break;
                case "checklist" :
                    editor = new Checklist("#note");
                break;
                case "sketch" :
                    editor = new Sketch("#note");
                break;
            }
            editor.init();
            editor.setValue(data["content"]);
            $("#title").html(data["meta"]["title"]);
            for (i in data["meta"]["tags"]){
                $('#tags').tagsinput('add', data["meta"]["tags"][i]);
            }
            init();
        }, "json");
    } else if (types.indexOf(anchor) !== -1){
        type = anchor;
        switch (type){
            case "note" : 
                editor = new Note("#note");
            break;
            case "reminder" :
                editor = new Reminder("#note");
            break;
            case "checklist" :
                editor = new Checklist("#note");
            break;
            case "sketch" :
                editor = new Sketch("#note");
            break;
        }
        $("#title").html("Title");
        editor.init();
        init();
    } else {
        type = "note";
        editor = new Note("#note");
        $("#title").html("Title");
        editor.init();
        init();
    }
});

function save(){
    if ((typeof(id) === "string") && (id !== "") && (types.indexOf(id) === -1)){
        $.post("/app/api/mod.php", {data: JSON.stringify({id: id, content: editor.getValue(), title: $("#title").html(), tags: $("#tags").val().split(",")})}, function(data){}, "json");
    } else {
        $.post("/app/api/add.php", {data: JSON.stringify({type: type, content: editor.getValue(), title: $("#title").html(), tags: $("#tags").val().split(",")})}, function(data){
            id = data["id"];
        }, "json");
    }
}

function trash(){
    $.post("/app/api/remove.php", {data: JSON.stringify({id: id})}, function(data){
        editor.destroy();
        $(location).attr('href',"list.html");
    }, "json");
}

function init(){
    $.post("/app/api/list.php", function(data){
        list = data;
        refresh_shortcuts();
        var tags = [];
        for (var i in list) {
            for (var j in list[i]["tags"]) {
                if ((tags.indexOf(list[i]["tags"][j]) === -1) && (list[i]["tags"][j] !== "")) {
                    tags.push(list[i]["tags"][j]);
                }
            }
        }
        $("#tags").tagsinput('input').typeahead({
            name: 'Tags',
            local: tags
        }).bind('typeahead:selected', $.proxy(function(obj, datum) {
            this.tagsinput('add', datum.value);
            this.tagsinput('input').typeahead('setQuery', '');
        }, $('#tags')));
        
        $("#tags").change(function(){
            if ((typeof(id) === "string") && (id !== "") && (types.indexOf(id) === -1)){
                $.post("/app/api/mod.php", {data: JSON.stringify({id: id, tags: $("#tags").val().split(",")})}, function(data){console.log(data)}, "json");
            }
        });
        
    }, "json");
    var modes = editor.getModes();
    if (modes.length >1){
        for (var i in modes){
            $("#sidebar").prepend("<li id='mode_" + modes[i] + "' class='mode " + ((i == (modes.length-1)) ? "active" : "") + "'><a href='#' onclick='editor.switch(\""  + modes[i] + "\");$(\".mode\").attr(\"class\", \"mode\");$(\"#mode_"+ modes[i] + "\").attr(\"class\", \"mode active\");'>" + modes[i] + "</a></li>");
        }
        $("#sidebar").prepend("<li>Edit With</li>");
    }
}