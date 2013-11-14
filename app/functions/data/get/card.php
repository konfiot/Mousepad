<?php 
include INCPATH.'/app/functions/database/card/get.php';
include INCPATH.'/app/functions/database/card/touch.php';
include INCPATH.'/app/functions/database/patch/list.php';
include INCPATH.'/app/functions/diff_match_patch.php';

function cmp($c, $d)
{
    $a = $c["timestamp"];
    $b = $d["timestamp"];
    if ($a == $b) {
        return 0;
    }
    return ($a < $b) ? -1 : 1;
}

function get_card($data, $username) {
    $cards = db_get_card($data["id"], $username);
    
    //TODO Gerer le cas ou la carte existe pas
    
    $json_out = array("meta" => $cards);
    
    
    $patches = db_list_diffs($data["id"], $username);
    
    usort($patches, "cmp");

    $patcher = new diff_match_patch();
    $content = "";
    
    foreach ($patches as $key => $value){
        $diff = $patcher->patch_fromText($value["content"]);
        $tmp = $patcher->patch_apply($diff, $content);
        $content = $tmp[0];
    }
    db_touch($data["id"], $username);
    $json_out["content"] = $content;
    return $json_out;
}
?>