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

if (is_logged()){
    header("Location: static/html/list.html");
} else {
    header("Location: static/html/login.html");
}
?>