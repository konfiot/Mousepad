<?php
include "../functions/database/card/list.php";

define(JSONFILECARDS, "cards.json");

function db_get_card($id){
    $list = db_list_cards();
    return $list[$id];

}
?>