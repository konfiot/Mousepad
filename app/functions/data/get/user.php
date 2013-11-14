<?php

include '../functions/database/users/get.php';

function get_user($username) {
    $user = db_get_user($username);
    $out = array();
    $allowed_keys = array("username", "timezone", "locale", "email", "theme");
    
    foreach ($user as $key => $value){
        if (array_search($key, $allowed_keys) !== false){
            $out[$key] = $value;
        }
    }
    
    return $out;
}
?>