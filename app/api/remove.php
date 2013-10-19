<?php
session_start();
header("Content-Type: application/json");

include '../functions/data/remove.php';


if (!(is_logged())){
    echo json_encode(array("error" => "Not logged in or bad credentials provided"));
} else {
    if (isset($_POST["data"])){
        $data = json_decode($_POST["data"], true);
        $result = remove_card($data);
        echo json_encode($result);
    } else {
        echo json_encode(array("error" => "unset_data"));
    }
}
?>