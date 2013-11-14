<?php

include INCPATH.'/app/functions/database/users/list.php';

function check_login($user, $pwd){
    $users = list_users();
    $id = false;
    
    foreach ($users as $key => $value){
        if ($value["username"] === $user){
            $id = $key;
        }
    }
    
    $hash = crypt($pwd, isset($users[$id]["hash"]) ? $users[$id]["hash"] : '$2y$12$'. substr(strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.'), 0, 22));
    
    if ($id === false){
        return false;
    }

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