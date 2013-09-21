<?php
include '../functions/data/get.php';

header("Content-Type: application/json");

if (isset($_POST["data"])){
    $data = json_decode($_POST["data"], true);
    if (isset($data["id"])){
        $result = get_card($data);
    } else {
        exit(json_encode(array("error" => "unset_id")));
    }
    echo json_encode($result);
} else {
    echo json_encode(array("error" => "unset_data"));
}
?>