<?php
include "../functions/data/get.php";
include "../functions/database/patch/add.php";
include "../functions/database/card/set_title.php";
include "../functions/database/card/set_tags.php";
include "../functions/database/card/set_star.php";
include_once "../functions/diff_match_patch.php";



function mod_card($data) {
    
    $content = htmlspecialchars($data["content"], ENT_NOQUOTES);
    $title = htmlspecialchars($data["title"]);
    $tags = $data["tags"];
    $star = $data["star"];

    if (isset($data["title"])){
        if(db_set_title($data["id"], $title) === false){
            return array("error" => "Database error" );
        }
    }
    
    if (isset($data["tags"])){
        if(db_set_tags($data["id"], $tags) === false){
            return array("error" => "Database error" );
        }
    }
    
    if (isset($data["star"])){
        if(db_set_star($data["id"], $star) === false){
            return array("error" => "Database error");
        }
    }


    if (isset($data["content"])){
        $old = get_card($data);
        
        if ($old["content"] === $content){
            return array("success" => "not modified" );
        }
        
        $patcher = new diff_match_patch();    
        
        $patch = $patcher->patch_make($old["content"], $content);
        $diff = $patcher->patch_toText($patch);
    
        if (db_add_diff($diff, $data["id"]) === false){
            return array("error" => "Database error" );
        }
    }

    return array("success" => "note successfully modified" );

}
?>