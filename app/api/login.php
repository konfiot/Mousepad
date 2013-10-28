<?php
session_start();
header("Content-Type: application/json");

date_default_timezone_set("UTC");
include "../defines/timezone.php";
date_default_timezone_set(TIMEZONE);

include '../defines/database.php';
include '../functions/data/login.php';

if (isset($_POST["user"], $_POST["password"])){
    $user = $_POST["user"];
    $password = $_POST["password"];
    $id = check_login($user, $password);
    if ($id){
        $_SESSION["user"] = $id;
        echo json_encode(array("success" => "Yaaay, successfully logged in"));
    } else {
        echo json_encode(array("error" => "Bad pwd, stop tryin to pwn me or just enter the good pwd"));
    }
}
session_write_close();
?>