<?php 
function add_card($data) {
    $title = htmlspecialchars($data["title"]);
    $content = htmlspecialchars($data["content"]);
    
    $diff = xdiff_string_diff("", $content);

    $id = db_add_card($data["type"], $title);
    
    if ($id === false){
        return json_encode(array("error" => "Database error" ));
    }
    
    if (db_add_diff($diff, $id) === false){
        return json_encode(array("error" => "Database error" ));
    } else {
        return json_encode(array("succes" => "note successfully added"));
    }
}
?>