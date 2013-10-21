<?php

include '../defines/database.php';
include '../functions/database/init.php';
include '../functions/database/users/add.php';

if (isset($_POST["username"], $_POST["password"], $_POST["password_confirm"], $_POST["dbtype"])){
    if ($_POST["password"] === $_POST["password_confirm"]){
        $username = htmlspecialchars($_POST["username"]);
        $hash = crypt(htmlspecialchars($_POST["password"]), '$2y$12$'. substr(strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.'), 0, 22));
        if (db_init($_POST["dbtype"])){
            db_add_user($username, $hash);
            echo "Allright";
        } else {
            echo "Prolem DB";
        }
    } else {
        echo "Passwords do not match";
    }
} else {
    echo "Fill everything";
}
?>