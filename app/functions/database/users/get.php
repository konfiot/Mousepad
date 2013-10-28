<?php
include "../functions/database/users/list.php";

function db_get_user($username){
    $list = list_users();
    return $list[$username];

}
?>