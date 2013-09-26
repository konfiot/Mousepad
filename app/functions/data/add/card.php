<?php 
include "../functions/database/card/add.php";
include "../functions/database/patch/add.php";
include "../functions/diff_match_patch.php";


function add_card($data) {
    $title = htmlspecialchars($data["title"]);
    $content = htmlspecialchars($data["content"]);
    $tags = $data["tags"];
    
    $patcher = new diff_match_patch();    
    
    $patch = $patcher->patch_make("", $content);
    $diff = $patcher->patch_toText($patch);

    $id = db_add_card($data["type"], $title, $tags);
    
    if ($id === false){
        return json_encode(array("error" => "Database error" ));
    }
    
    if (db_add_diff($diff, $id) === false){
        return json_encode(array("error" => "Database error" ));
    } else {
        return json_encode(array("id" => $id));
    }
}
?>