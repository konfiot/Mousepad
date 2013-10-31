<?php

function db_add_user($username, $hash){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILEUSERS);
            
            $file = fopen(JSONFILEUSERS, "a+");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_EX) === false);
            $contents = (filesize(JSONFILEUSERS) > 0) ? fread($file, filesize(JSONFILEUSERS)) : "{}";
            
            $json = json_decode($contents, true);
            $uuid = uniqid();
            $json[$uuid] = array("username" => $username, "hash" => $hash);
            
            ftruncate($file, 0);
            fwrite($file, json_encode($json));
            flock($file, LOCK_UN);
            fclose($file);
            
            return true;

        break;
        default :
            return false;
        break;
    }
}
?>