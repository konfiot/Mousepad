<?php
include INCPATH."/app/functions/database/users/list.php";

function db_get_user($username){
    $list = list_users();
    return (isset($list[$username])) ? $list[$username] : array();

}
?>