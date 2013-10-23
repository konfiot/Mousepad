<?php
session_start();
header("Content-Type: application/json");


date_default_timezone_set("UTC");
include "../defines/timezone.php";
date_default_timezone_set(TIMEZONE);

include '../defines/database.php';
include '../functions/data/login.php';

if (!(is_logged())){
    echo json_encode(array("error" => "Not logged in or bad credentials provided"));
} else {
    session_destroy();
    echo json_encode(array("success" => "You have been successfully disconnected"));
}
?>