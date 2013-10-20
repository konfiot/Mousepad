<?php
session_start();
header("Content-Type: application/json");
include '../functions/data/login.php';
include '../defines/database.php';

if (!(is_logged())){
    echo json_encode(array("error" => "Not logged in or bad credentials provided"));
} else {
    session_destroy();
    echo json_encode(array("success" => "You have been successfully disconnected"));
}
?>