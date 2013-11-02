var list;

function refresh_shortcuts(){
    var max_keys = [], max_keys_last = [], max_val = 0, max_key, max_val_last = 0, max_key_last;
    for (var i = 0 ; i < 5 ; i++){
        for (var j in list){
            if ((list[j]["times_viewed"] > max_val) && (max_keys.indexOf(j) === -1)){
                max_key = j;
                max_val = list[j]["times_viewed"];
            }
            
            if ((list[j]["last_viewed"] > max_val_last) && (max_keys_last.indexOf(j) === -1)){
                max_key_last = j;
                max_val_last = list[j]["last_viewed"];
            }
        }
        
        if(max_key !== max_keys[max_keys.length-1]){
            max_keys.push(max_key);
        }
        max_val = 0;
        
        if(max_key_last !== max_keys_last[max_keys_last.length-1]){
            max_keys_last.push(max_key_last);
        }
        max_val_last = 0;
    }
    
    $("#most_viewed").html("");
    $("#last_viewed").html("");
    
    for (i in max_keys){
        $("#most_viewed").append("<li><a href='edit.html#" + max_keys[i] + "'>" + list[max_keys[i]]["title"] + "</a></li>");
    }
    
    
    for (i in max_keys_last){
        $("#last_viewed").append("<li><a href='edit.html#" + max_keys_last[i] + "'>" + list[max_keys_last[i]]["title"] + "</a></li>");
    }
    
}

function logout(){
    $.post("/app/api/logout.php", function(data){
        document.location.href = '/';
    }, "json");
}