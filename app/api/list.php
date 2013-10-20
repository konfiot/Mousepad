<?php

session_start();
header("Content-Type: application/json");

include '../functions/data/list.php';
include '../functions/data/login.php';
include '../defines/database.php';


if (!(is_logged())){
    echo json_encode(array("error" => "Not logged in or bad credentials provided"));
} else {
    $result = list_cards($_POST["data"]);
    echo json_encode($result);
}
?>