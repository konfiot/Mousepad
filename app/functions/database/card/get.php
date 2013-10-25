<?php
include "../functions/database/card/list.php";

function db_get_card($id, $username){
    $list = db_list_cards($username);
    return $list[$id];

}
?>