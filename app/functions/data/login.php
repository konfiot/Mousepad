<?php

include "../functions/database/users/list.php";

function check_login($user, $pwd){
    $users = list_users();
    $hash = crypt($pwd, $users[$user]["hash"]);
    if ($users[$user]["hash"] === $hash){
        return true;
    } else {
        return false;
    }
}
?>