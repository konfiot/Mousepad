<?php
session_start();
header("Content-Type: application/json");


date_default_timezone_set("UTC");
include "../defines/timezone.php";
date_default_timezone_set(TIMEZONE);

include '../defines/misc.php';
include '../defines/database.php';
include '../functions/data/mod/card.php';
include '../functions/data/login.php';

$username = is_logged();

if (!($username)){
    echo json_encode(array("error" => "Not logged in or bad credentials provided"));
} else {
    if (isset($_POST["data"])){
        $data = json_decode($_POST["data"], true);
        $result = mod_card($data, $username);
        echo json_encode($result);
    } else {
        echo json_encode(array("error" => "unset_data"));
    }
}
?>