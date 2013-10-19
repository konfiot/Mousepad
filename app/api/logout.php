<?php
    session_destroy();
    echo json_encode(array("success" => "You have been successfully disconnected"));
?>