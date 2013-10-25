<?php

include "../functions/database/users/list.php";

function check_login($user, $pwd){
    $users = list_users();
    $id = false;
    
    foreach ($users as $key => $value){
        if ($value["username"] === $user){
            $id = $key;
        }
    }
    
    if ($id === false){
        return false;
    }

    $hash = crypt($pwd, $users[$id]["hash"]);
    if ($users[$id]["hash"] === $hash){
        return $id;
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