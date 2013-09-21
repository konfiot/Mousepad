<?php
header("Content-Type: application/json");

include '../functions/data/mod/card.php';



if (isset($_POST["data"])){
    $data = json_decode($_POST["data"], true);
    $result = mod_card($data);
    echo json_encode($result);
} else {
    echo json_encode(array("error" => "unset_data"));
}

?>