<?php
session_start();
function is_logged(){
    if (isset($_SESSION["user"])){
        return true;
    } else if (isset($_POST["user"], $_POST["password"])) {
        return check_login($_POST["user"], $_POST["password"]);
    } else {
        return false;
    }
}

if (!(file_exists('app/defines/database.php'))){
    header("Location: static/templates/default/install.html");
} else if (is_logged()){
    header("Location: static/templates/default/list.html");
} else {
    header("Location: static/templates/default/login.html");
}
?>