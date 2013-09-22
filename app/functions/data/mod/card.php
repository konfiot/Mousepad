<?php 
include "../functions/data/get.php";
include "../functions/database/patch/add.php";
include_once "../functions/diff_match_patch.php";


function mod_card($data) {
    $content = htmlspecialchars($data["content"]);

    $old = get_card($data);
    
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