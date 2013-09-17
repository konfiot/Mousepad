<?php
if (isset($_POST["data"])){
    $data["sent"] = json_decode($_POST["data"]);
    if (isset($data["sent"]["type"])){
        get_card($data);
    } else {
        $result = get_all();
    }
    echo json_encode($result);
} else {
    echo json_encode(array("error" => "unset_data"));
}
?>