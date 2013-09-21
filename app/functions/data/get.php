<?php 
include "../functions/database/card/get.php";
include "../functions/database/patch/list.php";
include "../functions/diff_match_patch.php";

function cmp($c, $d)
{
    $a = $c["timestamp"];
    $b = $d["timestamp"];
    if ($a == $b) {
        return 0;
    }
    return ($a < $b) ? -1 : 1;
}

function get_card($data) {
    $cards = db_get_card($data["id"]);
    $json_out = array("meta" => $cards);
    
    
    $patches = db_list_diffs($data["id"]);
    usort($patches, "cmp"); 

    $patcher = new diff_match_patch();    
    $content = "";
    
    foreach ($patches as $key => $value){
        $diff = $patcher->patch_fromText($value["content"]);
        $tmp = $patcher->patch_apply($diff, $content);
        $content = $tmp[0];
    }
    
    $json_out["content"] = $content;
    return $json_out;
}
?>