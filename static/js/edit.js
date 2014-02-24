function getAnchor() {
    var currentUrl = document.URL,
        urlParts = currentUrl.split('#');
    return (urlParts.length > 1) ? urlParts[1] : undefined;
}

var editor, id;
var types = ["note", "reminder", "checklist", "sketch", "snippet"];

$(function(){
    var anchor;
    anchor = getAnchor();
    if ((typeof(anchor) === "string") && (anchor !== "") && (types.indexOf(anchor) === -1)){
        id = anchor;
        $.ajax({
            url: "../../../app/api/get.php",
            method: "POST",
            data: {
                data: JSON.stringify({
                    id: id
                })
            },
            success: function(data) {
                window.type = data.meta.type;
                window.title = data.meta.title;
                window.content = data.content;
            },
            dataType: "json",
            async: false
        });
    } else if (types.indexOf(anchor) !== -1){
        window.type = anchor;
        window.title = "Title";
    } else {
        window.type = "note";
        window.title = "Title";
    }
    require([window.type], function(Editor){
        editor = new Editor("#note");
        $("#title").html(window.title);
        editor.init();
        if (typeof window.content !== "undefined") {
            editor.setValue(window.content);
        } 
        init();
    });
});

function save(){
    if ((typeof(id) === "string") && (id !== "") && (types.indexOf(id) === -1)){
        $.post("../../../app/api/mod.php", {data: JSON.stringify({id: id, content: editor.getValue(), title: $("#title").html(), tags: $("#tags").val().split(",")})}, function(data){
            window.alertify.success("Saved");
        }, "json");
    } else {
        $.post("../../../app/api/add.php", {data: JSON.stringify({type: window.type, content: editor.getValue(), title: $("#title").html(), tags: $("#tags").val().split(",")})}, function(data){
            id = data.id;
            window.alertify.success("Saved");
        }, "json");
    }
}

function trash(){
    $.post("../../../app/api/remove.php", {data: JSON.stringify({id: id})}, function(data){
        editor.destroy();
        $(location).attr('href',"list.html");
    }, "json");
}

function init(){
    $.post("../../../app/api/list.php", function(data){
        window.list = data;
        window.refresh_shortcuts();
        var tags = [];
        for (var i in window.list) {
            for (var j in window.list[i].tags) {
                if ((tags.indexOf(window.list[i].tags[j]) === -1) && (window.list[i].tags[j] !== "")) {
                    tags.push(window.list[i].tags[j]);
                }
            }
        }
        
        $("#search").typeahead({
            local: (function(){
                var array = [];
                for (var i in window.list){
                    if (window.list[i].type !== "directory") {
                        array.push({name: i, value: window.list[i].title});
                    }
                }
                return array;
            })(),
        });
        $("#search").on("typeahead:selected", function (event, item) {
            $("#search").val("");
            $(location).attr('href',"edit.html#" + item.name);
            location.reload();
        });
        
        $("#tags").tagsinput('input').typeahead({
            name: 'Tags',
            local: tags
        }).bind('typeahead:selected', $.proxy(function(obj, datum) {
            this.tagsinput('add', datum.value);
            this.tagsinput('input').typeahead('setQuery', '');
        }, $('#tags')));
        
        $("#tags").change(function(){
            if ((typeof(id) === "string") && (id !== "") && (types.indexOf(id) === -1)){
                $.post("../../../app/api/mod.php", {data: JSON.stringify({id: id, tags: $("#tags").val().split(",")})}, function(data){console.log(data)}, "json");
            }
        });
        
    }, "json");
    var modes = editor.getModes();
    if (modes.length >1){
        $("#sidebar").prepend(window.templates.editors_list.render({modes: modes}));
        $("#mode_" + modes[0]).attr("class", "mode active");
    }
}