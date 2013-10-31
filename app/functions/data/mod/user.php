<?php

include '../functions/database/users/set.php';

function set_user($data, $username) {
    $out = array();
    $allowed_keys = array('username', 'timezone', 'locale', 'email');
    
    foreach ($data as $key => $value){
        if (array_search($key, $allowed_keys) !== false){
            $out[$key] = strip_tags($value, ENT_NOQUOTES);
        }
    }

    return (db_set_user($out, $username)) ? array("success" => "User data successfully modified") : array("error" => "database error");
}
?>