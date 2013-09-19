<?php
header("Content-Type: application/json");

include '../functions/data/add/card.php';



if (isset($_POST["data"])){
    $data = json_decode($_POST["data"], true);
    
    if (isset($data["type"])){
        $result = add_card($data);
        echo json_encode($result);
    } else {
        echo json_encode(array("error" => "unset_type"));
    }
} else {
    echo json_encode(array("error" => "unset_data"));
}

?>