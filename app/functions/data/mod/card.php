<?php 
include "../functions/data/get.php";
include "../functions/database/patch/add.php";
include "../functions/database/card/set_title.php";
include_once "../functions/diff_match_patch.php";


function mod_card($data) {
    $content = htmlspecialchars($data["content"]);
    $title = htmlspecialchars($data["title"]);
    
    $old = get_card($data);

    db_set_title($data["id"], $title);
    
    if ($old["content"] === $content){
        return json_encode(array("success" => "not modified" ));
    }
    
    $patcher = new diff_match_patch();    
    
    $patch = $patcher->patch_make($old["content"], $content);
    $diff = $patcher->patch_toText($patch);

    if (db_add_diff($diff, $data["id"]) === false){
        return json_encode(array("error" => "Database error" ));
    } else {
        return json_encode(array("succes" => "note successfully modified"));
    }
}
?>