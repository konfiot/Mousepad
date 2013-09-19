<?php
header("Content-Type: application/json");

include '../functions/data/list.php';

$result = list_cards($_POST["data"]);
echo json_encode($result);

?>