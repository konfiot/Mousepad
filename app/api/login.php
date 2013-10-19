<?php
include '../functions/data/login.php';

session_start();
if (isset($_POST["user"], $_POST["password"])){
    $user = $_POST["user"];
    $password = $_POST["password"];
    if (check_login($user, $password)){
        $_SESSION["user"] = $user;
        echo json_encode(array("success" => "Yaaay, successfully logged in"));
    } else {
        echo json_encode(array("error" => "Bad pwd, stop tryin to pwn me or just enter the good pwd"));
    }
}
?>