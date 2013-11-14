<?php
include INCPATH.'/app/functions/data/get/card.php';
include INCPATH.'/app/functions/database/patch/add.php';
include INCPATH.'/app/functions/database/card/set_title.php';
include INCPATH.'/app/functions/database/card/set_tags.php';
include INCPATH.'/app/functions/database/card/set_star.php';
include INCPATH.'/app/functions/database/card/set_dir.php';
include_once INCPATH.'/app/functions/diff_match_patch.php';



function mod_card($data, $username) {
    
    $content = (isset($data["content"]) ? htmlspecialchars($data["content"], ENT_NOQUOTES) : null);
    $title = (isset($data["title"]) ? htmlspecialchars($data["title"]) : null);
    $tags = (isset($data["tags"]) ? $data["tags"] : null);
    $star = (isset($data["star"]) ? $data["star"] : null);
    $dir = (isset($data["dir"]) ? $data["dir"] : null);

    if (isset($data["title"])){
        if(db_set_title($data["id"], $title, $username) === false){
            return array("error" => "Database error" );
        }
    }
    
    if (isset($data["tags"])){
        if(db_set_tags($data["id"], $tags, $username) === false){
            return array("error" => "Database error" );
        }
    }
    
    if (isset($data["dir"])){
        if(db_set_dir($data["id"], $dir, $username) === false){
            return array("error" => "Database error" );
        }
    }
    
    if (isset($data["star"])){
        if(db_set_star($data["id"], $star, $username) === false){
            return array("error" => "Database error");
        }
    }


    if (isset($data["content"])){
        $old = get_card($data, $username);
        
        if ($old["content"] === $content){
            return array("success" => "not modified" );
        }
        
        $patcher = new diff_match_patch();    
        
        $patch = $patcher->patch_make($old["content"], $content);
        $diff = $patcher->patch_toText($patch);
    
        if (db_add_diff($diff, $data["id"], $username) === false){
            return array("error" => "Database error" );
        }
    }

    return array("success" => "note successfully modified" );

}
?>