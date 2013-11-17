var to_delete, list_all = {}, to_create, to_change, list_content = {}, list;

function qrcode(id){
    $("#modal").modal("show");
    $("#qrcode").html("");
    $('#modal').on('shown.bs.modal', function () {
        $('#qrcode').qrcode({text: document.location.href.replace(/list.html#(.*)$/, "edit.html#" + id), width: parseInt($("#modalcontent").width()-50), height: parseInt($("#modalcontent").width()-50)});
        $("#modal").unbind('shown.bs.modal');
    });
}

function refresh_filters(){
    var tags = [], types = [], timestamps = [], dates_to_display = [false, false, false, false, false];
    
    for (var i in list){
        timestamps.push(list[i]["last_viewed"]);
        for (var j in list[i]["tags"]){
            if ((tags.indexOf(list[i]["tags"][j]) === -1) && (list[i]["tags"][j] !== "")){
                tags.push(list[i]["tags"][j]);
            }
        }
        
        if ((types.indexOf(list[i]["type"]) === -1) && (list[i]["type"] !== "")){
                types.push(list[i]["type"]);
        }
    }
    
    for (i in list){
        if (list[i]["last_viewed"] - Math.round(new Date().getTime() / 1000) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            dates_to_display[0] = {display: true, value: 0, text: "Today"};
        } else if (list[i]["last_viewed"] - (Math.round(new Date().getTime() / 1000)) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            dates_to_display[1] = {display: true, value: 1, text: "Yesterday"};
        } else if (list[i]["last_viewed"] - (Math.round(new Date().getTime() / 1000)) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()- new Date().getDay()).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            dates_to_display[2] = {display: true, value: 2, text: "Last Week"};
        } else if (list[i]["last_viewed"] - (Math.round(new Date().getTime() / 1000)) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            dates_to_display[3] = {display: true, value: 3, text: "Last Month"};
        } else if (list[i]["last_viewed"] - (Math.round(new Date().getTime() / 1000)) < Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            dates_to_display[4] = {display: true, value: 4, text: "More than a month ago"};
        }
    }
    
    $("#tags").html(window.templates["filters"].render({
        tags: tags,
        dates: dates_to_display,
        types: types
    }));
}

function filter_tags(tag){
    $("#list").html("");
    var data = list;
    for (var i in data){
        if (data[i]["type"] !== "directory"){
            if (typeof(data[i]["tags"]) === "undefined"){
                if(tag === ""){
                    list_append(i, data[i]);
                }
            } else  if ((data[i]["tags"].indexOf(tag) !== -1) || (tag === "")){
                list_append(i, data[i]);
            }
        }
    }
}

function filter_types(type){
    $("#list").html("");
    var data = list;
    for (var i in data){
        if ((data[i]["type"] === type) || (type === "")){
            list_append(i, data[i]);
        }
    }
}

function filter_date(date){
    $("#list").html("");
    var data = list;
    for (var i in data){
        var cat = -1;
        if (data[i]["last_viewed"] - Math.round(new Date().getTime() / 1000) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            cat = 0;
        } else if (data[i]["last_viewed"] - Math.round(new Date().getTime() / 1000) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            cat = 1;
        } else if (data[i]["last_viewed"] - Math.round(new Date().getTime() / 1000) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()- new Date().getDay()).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            cat = 2;
        } else if (data[i]["last_viewed"] - Math.round(new Date().getTime() / 1000) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            cat = 3;
        } else if (data[i]["last_viewed"] - Math.round(new Date().getTime() / 1000) < Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            cat = 4;
        } 
        
        if (cat === date){
            list_append(i, data[i]);
        }
    }
}

function filter_dir(dir){
    if(dir === ""){
        dir = undefined;
    }
    var old_list = list_all;
    list = {};
    for (var i in old_list){
        if (typeof(dir) !== "undefined"){
            if (typeof(old_list[i].dir) !== "undefined"){
                if (old_list[i].dir === dir && old_list[i].type !== "directory"){
                    list[i] = old_list[i];
                }
            } else if (old_list[i].dir !== null) {
                if (old_list[i].dir === dir && old_list[i].type !== "directory"){
                    list[i] = old_list[i];
                }
            }
        } else {
            if (typeof(old_list[i].dir) === "undefined"){
                if(old_list[i].type !== "directory"){
                    list[i] = old_list[i];
                }
            } else if (old_list[i].dir === null) {
                if (old_list[i].type !== "directory"){
                    list[i] = old_list[i];
                }
            }
        }
    }
    var current_dir = (typeof(dir) === "undefined") ? undefined : dir;
    var finished, folders = [];
    do {
        finished = (typeof(current_dir) === "undefined") ? true : false;
        folders.unshift({id: ((typeof(current_dir) === "undefined") ? '' : current_dir), name: ((typeof(current_dir) === "undefined") ? "Home" : list_all[current_dir]["title"]), childs: []})
        for (var i in list_all){
            if(list_all[i].dir === null) list_all[i].dir = undefined;
            if ((list_all[i].type === "directory") && (list_all[i].dir === current_dir)){
                folders[0].childs.push({id: i, name: list_all[i].title})
            }
            
        }
        if (typeof(current_dir) !== "undefined"){
            current_dir = (typeof(list_all[current_dir]["dir"]) === "undefined") ? undefined : list_all[current_dir]["dir"];
        }
    } while (!finished);
    $("#path").html(window.templates["breadcumb"].render({
        folders: folders
    }));
    refresh_filters();
    filter_tags("");
}

function pop_creation_dir_modal(id){
    $("#dir").modal('show');
    to_create = id;
}

function pop_change_dir_modal(id){
    $("#cd").modal('show');
    
    var tree = (function(id){
        var tree = {};
        var array = [];
        tree.childrens = [];
        tree.id = id;
        tree.name = ((typeof(id) === "undefined") ? "Home" : list_all[id].title);
        tree.root = ((typeof(id) === "undefined") ? true : false);
        for (var i in list_all){
            if(list_all[i].type === "directory"){
                if ((typeof (list_all[i].dir) === "undefined") && (typeof(id) === "undefined")){
                    tree.childrens.push(arguments.callee(i));
                    array.push(i);
                } else if (list_all[i].dir === id){
                    tree.childrens.push(arguments.callee(i));
                    array.push(i);
                }
            }
        }
        return tree;
    })();
    $("#cdlist").html(window.templates["tree"].render({data: tree}, {tree: templates["tree_partial"]}));
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    $('.tree li.parent_li > label > span').on('click', function(e) {
        var children = $(this).parent().parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).attr('title', 'Expand this branch').find(' > i').addClass('fa fa-plus-sign').removeClass('fa fa-minus-sign');
        }
        else {
            children.show('fast');
            $(this).attr('title', 'Collapse this branch').find(' > i').addClass('fa fa-minus-sign').removeClass('fa fa-plus-sign');
        }
        e.stopPropagation();
    });
    to_change = id;
}

function change_dir(){
    var val = (($("input:radio[name='radio_dir']:checked").val() === "undefined") ? "" : $("input:radio[name='radio_dir']:checked").val());
    $.post("../../../app/api/mod.php", {data: JSON.stringify({id: to_change, dir: val})}, function(data){}, "json");
    to_change="";
    init();
}

function toogle_star(id){
    var star;
    if (list[id]["star"] === true){
        list[id]["star"] = false;
        star = false;
        $("#star" + id).css("color", "white");
    } else {
        list[id]["star"] = true;
        star = true;
        $("#star" + id).css("color", "grey");
    }
    $.post("../../../app/api/mod.php", {data: JSON.stringify({id: id, star: star})}, function(data){}, "json");

}

function pop_confirmation_modal(id){
    $("#delete").modal('show');
    to_delete = id;
}


function init(){
    $.post("../../../app/api/list.php", {data : JSON.stringify({verbose: true})}, function(data){
        for (var i in data){
            list_all[i] = data[i]["meta"];
            list_content[i] = data[i]["content"];
        }
        filter_dir();
        refresh_shortcuts();
        $("#search").bind("input", function(){
            $("#list").html("");
            for (var i in list){
                if (list[i]["title"].search($("#search").val()) !== -1){
                    list_append(i, list[i]);
                }
            }
        });
    }, "json");
}

function list_append(id, item){
    $("#list").append(window.templates["item"].render({
        id: id,
        star: item["star"],
        title: item["title"]
    }));
    get_preview(list_all[id], list_content[id], id)
}

function trash(){
    $.post("../../../app/api/remove.php", {data: JSON.stringify({id: to_delete})}, function(data){
        init();
    }, "json");
    to_delete = "";
}

function create_dir(){
    $.post("../../../app/api/add.php", {data: JSON.stringify({type: "directory", dir: ((to_create === '') ? undefined : to_create), title: $("#dirname").val()})}, function(data){
        init();
    }, "json");
    ("#dirname").val("");
    to_create = "";
}

function get_preview(meta, content, id){
    switch (meta.type) {
        case 'note' : 
            $("#" + id).html(window.templates.preview_note.render({content: content}));
        break;
        case 'sketch' :
            $("#" + id).html(window.templates.preview_sketch.render({content: content}));
        break;
        case 'checklist' : 
            var json = JSON.parse(content);
            $("#" + id).html(window.templates.preview_checklist.render({values: json}));
            $("#" + id + " > form > .input-group > .input-group-btn > button").bind("click", function () {
                $(this).parent().parent().remove();
                var json = [];
                for (var i in $("#" + id + " > form > .input-group > input")){
                    if(($("#" + id + " > form > .input-group > input")[i].value !== "") && (typeof($("#" + id + " > form > .input-group > input")[i].value) !== "undefined")){
                        json.push({
                            value: $("#" + id + " > form > .input-group > input")[i].value,
                            done: $("#" + id + " > form > .input-group > .input-group-addon > input")[i].checked
                        });
                    }
                }
                $.post("../../../app/api/mod.php", {data: JSON.stringify({id: id, content: JSON.stringify(json)})}, function(data){}, "json");

            });
            $("#" + id +" * .checkbox_checklist").on("change", function(){
                var json = [];
                for (var i in $("#" + id + " > form > .input-group > input")){
                    if(($("#" + id + " > form > .input-group > input")[i].value !== "") && (typeof($("#" + id + " > form > .input-group > input")[i].value) !== "undefined")){
                        json.push({
                            value: $("#" + id + " > form > .input-group > input")[i].value,
                            done: $("#" + id + " > form > .input-group > .input-group-addon > input")[i].checked
                        });
                    }
                }
                $.post("../../../app/api/mod.php", {data: JSON.stringify({id: id, content: JSON.stringify(json)})}, function(data){}, "json");
            });
        break;
        case 'reminder' :
            var json = JSON.parse(content);
            if (json["type"] === "Time"){
                $("#" + id).html(window.templates.preview_reminder.render({date: json.date, addinfo: json.addinfo}));
            } else if (json["type"] === "Place"){
                var map = L.map(id).setView(json.coords, 13);
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                L.marker(json.coords, {draggable: true}).addTo(map).on("dragend", function(){
                    $.post("../../../app/api/mod.php", {data: JSON.stringify({id: id, content: JSON.stringify({type: "Place", coords: this.getLatLng()})})}, function(data){}, "json");
                });
            }
        break;
    }
}

$(function(){
    init();
});