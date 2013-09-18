<?php 

include "../../database/card/add.php";
include "../../database/patch/add.php";

function add_card($data) {
    $title = htmlspecialchars($data["title"]);
    $content = htmlspecialchars($data["content"]);

if (function_exists('xdiff_string_diff')) {
    echo "IMAP functions are available.<br />\n";
} else {
    echo "IMAP functions are not available.<br />\n";
}
    $diff = xdiff_string_diff("", $content);
    
    echo $diff;
    
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