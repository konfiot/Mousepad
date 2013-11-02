<?php

if (isset($_POST["username"], $_POST["password"], $_POST["password_confirm"], $_POST["dbtype"], $_POST["timezone"])){
    if ($_POST["password"] === $_POST["password_confirm"]){
        if (date_default_timezone_set($_POST["timezone"])){
            include '../functions/database/users/add.php';
            include '../functions/data/init.php';
            
            $username = htmlspecialchars($_POST["username"]);
            $hash = crypt(htmlspecialchars($_POST["password"]), '$2y$12$'. substr(strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.'), 0, 22));
            if (init($_POST["dbtype"], $_POST["timezone"])){
                include '../defines/database.php';
                db_add_user($username, $hash);
                unlink("../functions/data/init.php");
                unlink("../functions/database/init.php");
                unlink("./install.php");
                echo "Allright";
            } else {
                echo "Prolem DB";
            }
        } else {
            echo "Bad Timezone";
        }
    } else {
        echo "Passwords do not match";
    }
} else {
    echo "Fill everything";
}
?>