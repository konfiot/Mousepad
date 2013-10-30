<?php

include '../functions/database/users/set.php';

function get_user($username, $data) {
    $out = array();
    $allowed_keys = array("username", "timezone", "locale");
    
    foreach ($data as $key => $value){
        if (array_search($key, $allowed_keys) !== false){
            $out[$key] = $value;
        }
    }

    return db_set_user($username, $out);
}
?>