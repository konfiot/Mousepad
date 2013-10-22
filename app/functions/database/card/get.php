<?php
include "../functions/database/card/list.php";

function db_get_card($id){
    $list = db_list_cards();
    return $list[$id];

}
?>