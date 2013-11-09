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
    
    for (var i in list){
        if (list[i]["last_viewed"] - Math.round(new Date().getTime() / 1000) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            dates_to_display[0] = true;
        } else if (list[i]["last_viewed"] - (Math.round(new Date().getTime() / 1000)) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            dates_to_display[1] = true;
        } else if (list[i]["last_viewed"] - (Math.round(new Date().getTime() / 1000)) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()- new Date().getDay()).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            dates_to_display[2] = true;
        } else if (list[i]["last_viewed"] - (Math.round(new Date().getTime() / 1000)) >= Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            dates_to_display[3] = true;
        } else if (list[i]["last_viewed"] - (Math.round(new Date().getTime() / 1000)) < Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() / 1000) - Math.round(new Date().getTime() / 1000)){
            dates_to_display[4] = true;
        }
    }
    
    $("#tags").html("");
    $("#tags").append("<li><a href='#' onclick='filter_tags(\"\")'>All</a></li><li>Tags</li>");
    for (var i in tags){
        $("#tags").append("<li><a href='#' onclick=\"filter_tags('" + tags[i] + "')\">" + tags[i] + "</a></li>");
    }
    
    $("#tags").append("<li>Last edited</li>");
    
    for (var i in dates_to_display){
        if (dates_to_display[i]){
            var date;
            switch (i){
                case '0' :
                    date = "Today";
                break;
                case '1' :
                    date = "Yesterday";
                break;
                case '2' :
                    date = "Last Week";
                break;
                case '3' :
                    date = "Last Month";
                break;
                case '4' :
                    date = "More than one month ago";
                break;
            }
            $("#tags").append("<li><a href='#' onclick=\"filter_date(" + i + ")\">" + date + "</a></li>");
        }
    }
    
    $("#tags").append("<li>Type</li>");
    
    for (var i in types){
        $("#tags").append("<li style='text-transform: capitalize'><a href='#' onclick=\"filter_types('" + types[i] + "')\">" + types[i] + "</a></li>");
    }
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
    $("#path").html("");
    var finished;
    do {
        finished = (typeof(current_dir) === "undefined") ? true : false;
        var output = '<li class="active dropdown"><a class="dropdown-toggle" href="#" data-toggle="dropdown">' + ((typeof(current_dir) === "undefined") ? "Home" : list_all[current_dir]["title"]) + '</a><b class="caret"></b><ul  class="dropdown-menu">';
        output += '<li><a tabindex="-1" onclick="filter_dir(' + ((typeof(current_dir) === "undefined") ? '' : "\'" + current_dir + "\'") + ')" href="#' + i + '">Roll Back to this directory</a></li>';
        for (var i in list_all){
            if(list_all[i].dir === null) list_all[i].dir = undefined;
            if ((list_all[i].type === "directory") && (list_all[i].dir === current_dir)){
                output += '<li><a tabindex="-1" onclick="filter_dir(\'' + i + '\')" href="#' + i + '">' + list_all[i].title + '</a></li>';
            }
        }
        output += '<li><a tabindex="-1" onclick="pop_creation_dir_modal(\'' +  ((typeof(current_dir) === "undefined") ? "" :  current_dir) + '\')" href="#">Add a new directory</a></li>';
        output += '</ul></li>';
        $("#path").prepend(output);
        if (typeof(current_dir) !== "undefined"){
            current_dir = (typeof(list_all[current_dir]["dir"]) === "undefined") ? undefined : list_all[current_dir]["dir"];
        }
    } while (!finished);
    refresh_filters();
    filter_tags("");
}

function pop_creation_dir_modal(id){
    $("#dir").modal('show');
    to_create = id;
}

function pop_change_dir_modal(id){
    $("#cd").modal('show');
    var tree = "";
    tree = (function(id){
        var array = [];
        var tree = ((typeof(id) === "undefined") ? '<div class="tree"><ul role="tree"><li class="parent_li" role="treeitem"><label><input style="display: none" type="radio" value="undefined" name="radio_dir"/><span>Home</span></label><ul role="group">' : '<ul role="group">');
        for (var i in list_all){
            if(list_all[i].type === "directory"){
                if ((typeof (list_all[i].dir) === "undefined") && (typeof(id) === "undefined")){
                    tree += '<li ' + ((typeof(id) !== "undefined") ? 'style="display: none;"' : '') + ' class="parent_li" role="treeitem"><label><input style="display: none" type="radio" value="' + i + '" name="radio_dir"/><span>' + list_all[i].title + '</span></label>';
                    tree += arguments.callee(i);
                    tree += '</li>';
                    array.push(i);
                } else if (list_all[i].dir === id){
                    tree += '<li ' + ((typeof(id) !== "undefined") ? 'style="display: none;"' : '') + ' class="parent_li" role="treeitem"><label><input style="display: none" type="radio" value="' + i + '" name="radio_dir"/><span>' + list_all[i].title + '</span></label>';
                    tree += arguments.callee(i);
                    tree += '</li>';
                    array.push(i);
                }
            }
        }
        tree += ((typeof(id) === "undefined") ? '</ul></li></ul></div>' : '</ul>');
        if(array.join("") === ""){
            return "";
        } else {
            return tree;
        }
    })();
    $("#cdlist").html(tree);
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
    $.post("../../app/api/mod.php", {data: JSON.stringify({id: to_change, dir: val})}, function(data){}, "json");
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
    $.post("../../app/api/mod.php", {data: JSON.stringify({id: id, star: star})}, function(data){}, "json");

}

function pop_confirmation_modal(id){
    $("#delete").modal('show');
    to_delete = id;
}


function init(){
    $.post("../../app/api/list.php", {data : JSON.stringify({verbose: true})}, function(data){
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
    var template = Hogan.compile('<div class="col-md-4"><div class="panel panel-default"><div class="panel-heading"><a href="edit.html#{{id}}" class=""><h4 style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden" >{{title}}</h4></a></div><div class="panel-body" style="padding: 0; overflow: hidden;"><div class="box"><div class="content" id="{{id}}"></div></div></div><div class="panel-footer" style="margin: 0; padding: 0px ;"><p class="btn-group btn-group-justified" style="margin: 0; border-left: none ; border-bottom: none;"><a class="btn btn-default btn-warning actionbar" href="#" onclick="toogle_star(\'{{id}}\')"><i id="star{{id}}" class="fa fa-star" style="color: {{#star}} grey {{/star}} {{^star}} "white" {{/star}})"></i></a><a class="btn btn-default btn-info actionbar" onclick="qrcode(\'{{id}}\')" href="#"><i class="fa fa-qrcode"></i></a><a class="btn btn-primary btn-default actionbar" onclick="pop_change_dir_modal(\'{{id}}\')" href="#"><i class="fa fa-folder"></i></a><a onclick="pop_confirmation_modal(\'{{id}}\')" class="btn btn-default btn-danger actionbar" ><i class="fa fa-times"></i></a> <a class="btn btn-default btn-success actionbar" href="#"><i class="fa fa-plus"></i></a></p></div></div></div>');
    $("#list").append(template.render({
        id: id,
        star: item["star"],
        title: item["title"]
    }));
    get_preview(list_all[id], list_content[id], id)
}

function trash(){
    $.post("../../app/api/remove.php", {data: JSON.stringify({id: to_delete})}, function(data){
        init();
    }, "json");
    to_delete = "";
}

function create_dir(){
    $.post("../../app/api/add.php", {data: JSON.stringify({type: "directory", dir: ((to_create === '') ? undefined : to_create), title: $("#dirname").val()})}, function(data){
        init();
    }, "json");
    ("#dirname").val("");
    to_create = "";
}

function get_preview(meta, content, id){
    switch (meta.type) {
        case 'note' : 
            var template = Hogan.compile("<p style='margin: 10px'>{{content}}</p>")
            $("#" + id).html(template.render({content: content}));
        break;
        case 'sketch' :
            var template = Hogan.compile("<img src='{{content}}' />")
            $("#" + id).html(template.render({content: content}));
        break;
        case 'checklist' : 
            var json = JSON.parse(content);
            var template = Hogan.compile("<form>{{#values}}<div class='input-group'><span style='border-radius: 0 ; border-top: none; border-left: none' class='input-group-addon'><input class='checkbox_checklist' type='checkbox' {{#done}} checked {{/done}}></span><input style='border-radius: 0 ; border-top: none ; border-right: none' type='text' class='form-control checkbox_checklist' value='{{value}}'><span style='border-radius: 0 ; border-top: none' class='input-group-btn'><button style='border-radius: 0 ; border-top: none'  class='btn btn-default' type='button'><i class='fa fa-times'></i></button></span></div>{{/values}}</form>");
            $("#" + id).html(template.render({values: json}));
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
                $.post("../../app/api/mod.php", {data: JSON.stringify({id: id, content: JSON.stringify(json)})}, function(data){}, "json");

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
                $.post("../../app/api/mod.php", {data: JSON.stringify({id: id, content: JSON.stringify(json)})}, function(data){}, "json");
            });
        break;
        case 'reminder' :
            var json = JSON.parse(content);
            if (json["type"] === "Time"){
                var template = Hogan.compile("<div style='margin: 10px;'><div class='well well-sm'><i class='fa fa-calendar'></i>  {{date}}</div><p>{{addinfo}}</p></div>")
                $("#" + id).html(template.render({date: json.date, addinfo: json.addinfo}));
            } else if (json["type"] === "Place"){
                var map = L.map(id).setView(json.coords, 13);
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                L.marker(json.coords, {draggable: true}).addTo(map).on("dragend", function(){
                    $.post("../../app/api/mod.php", {data: JSON.stringify({id: id, content: JSON.stringify({type: "Place", coords: this.getLatLng()})})}, function(data){}, "json");
                });
            }
        break;
    }
}

$(function(){
    init();
});