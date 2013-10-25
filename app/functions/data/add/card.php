<?php 
include "../functions/database/card/add.php";
include "../functions/database/patch/add.php";
include "../functions/diff_match_patch.php";


function add_card($data, $username) {
    $title = (isset($data["title"]) ? htmlspecialchars($data["title"]): null);
    $content = (isset($data["content"]) ? htmlspecialchars($data["content"], ENT_NOQUOTES) : null);
    $tags = (isset($data["tags"]) ? $data["tags"] : null);
    $dir = (isset($data["dir"]) ? $data["dir"] : null);
    
    
    $id = db_add_card($data["type"], $title, $tags, $dir, $username);
    
    if ($id === false){
        return array("error" => "Database error" );
    }
    
    if($content !== null){
        $patcher = new diff_match_patch();    
    
        $patch = $patcher->patch_make("", $content);
        $diff = $patcher->patch_toText($patch);
        if (db_add_diff($diff, $id, $username) === false){
            return array("error" => "Database error" );
        }
    }
    
    return array("id" => $id);
}
?>