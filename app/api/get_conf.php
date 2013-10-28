<?php

session_start();
header("Content-Type: application/json");

date_default_timezone_set("UTC");
include "../defines/timezone.php";
date_default_timezone_set(TIMEZONE);

include '../defines/database.php';
include '../functions/data/get/user.php';
include '../functions/data/login.php';

$username = is_logged();

if (!($username)){
    echo json_encode(array("error" => "Not logged in or bad credentials provided"));
} else {
    $result = get_user($username);
    echo json_encode($result);
}
?>