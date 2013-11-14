<?php 
include INCPATH.'/app/functions/database/card/list.php';
include INCPATH.'/app/functions/data/get/card.php';
include INCPATH.'/app/functions/database/patch/list.php';


function list_cards($data, $username) {
    $cards = db_list_cards($username);
    if ($data["verbose"] == true){
        $out = array();
        foreach ($cards as $key => $value){
            $out[$key] = get_card(array("id" => $key), $username);
        }
        return $out;
    } else {
        return $cards;
    }
}
?>