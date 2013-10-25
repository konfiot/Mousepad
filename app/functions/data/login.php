<?php

include "../functions/database/users/list.php";

function check_login($user, $pwd){
    $users = list_users();
    $hash = crypt($pwd, $users[$user]["hash"]);
    if ($users[$user]["hash"] === $hash){
        return $user;
    } else {
        return false;
    }
}

function is_logged(){
    if (isset($_SESSION["user"])){
        return $_SESSION["user"];
    } else if (isset($_POST["user"], $_POST["password"])) {
        return check_login($_POST["user"], $_POST["password"]);
    } else {
        return false;
    }
}
?>