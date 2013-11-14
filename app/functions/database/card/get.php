<?php
include INCPATH."/app/functions/database/card/list.php";

function db_get_card($id, $username){
    $list = db_list_cards($username);
    return (isset($list[$id])) ? $list[$id] : array();
}
?>