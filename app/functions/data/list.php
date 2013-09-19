<?php 
include "../functions/database/card/list.php";
include "../functions/database/patch/list.php";
include "../functions/diff_match_patch.php";


function list_cards($data) {
    $cards = db_list_cards();
    if ($data["verbose"] === true){
        // TODO Appliquer les patches et renvoyer le résultat 
    } else {
        return $cards;
    }
}
?>