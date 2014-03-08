function getAnchor() {
    var currentUrl = document.URL,
        urlParts = currentUrl.split('#');
    return (urlParts.length > 1) ? urlParts[1] : undefined;
}

var editor, id;
var types = ["note", "reminder", "checklist", "sketch", "snippet", "place"];

$(function(){
    var anchor;
    anchor = getAnchor();
    $("#tags").html("");
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
                for (var i in data.meta.tags){
                    $("#tags").tagsinput('add', data.meta.tags[i]);
                }
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
        editor.change(function () {
            clearTimeout(window.timeout);
            window.onbeforeunload = function() {
                return "You have unsaved changes. You sure you wanna quit ?";
            };
            window.timeout = setTimeout(function() {
                window.onbeforeunload = undefined;
                save();
            }, 5000);
        });
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
                    tags.push({tag: window.list[i].tags[j]});
                }
            }
        }
        
        var tagsearch = new window.Bloodhound({
            datumTokenizer: function(d) {
                return window.Bloodhound.tokenizers.whitespace(d.tag);
            },
            queryTokenizer: window.Bloodhound.tokenizers.whitespace,
            local: tags
         });
        
        tagsearch.initialize();

        var search = new window.Bloodhound({
            datumTokenizer: function(d) {
                return window.Bloodhound.tokenizers.whitespace(d.title);
            },
            queryTokenizer: window.Bloodhound.tokenizers.whitespace,
            local: (function(){
                var array = [];
                for (var i in window.list){
                    if (window.list[i].type !== "directory") {
                        array.push({title: window.list[i].title});
                    }
                }
                console.log(array);
                return array;
            })()
         });
        
        search.initialize();

        $("#search").typeahead(null, {
            displayKey: 'title',
            source: search.ttAdapter()
        });
        $("#search").on("typeahead:selected", function (event, item) {
            $("#search").val("");
            $(location).attr('href',"edit.html#" + item.name);
            location.reload();
        });
        $("#tags").tagsinput('input').typeahead(null, {
            displayKey: 'tag',
            source: tagsearch.ttAdapter()
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

    $(function(){

    });
