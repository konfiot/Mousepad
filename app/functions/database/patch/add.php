<?php

function db_add_diff($diff, $parent, $username){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILEDIFFS);
            
            $file = fopen(JSONFILEDIFFS, "a+");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_EX) === false);
            $content = (filesize(JSONFILEDIFFS) > 0) ? fread($file, filesize(JSONFILEDIFFS)) : "{}";
            $uuid = uniqid();
            $json = json_decode($content, true);
            $json[$username][$uuid] = array("content" => $diff, "parent" => $parent, "timestamp" => time());
            
            ftruncate($file, 0);
            fwrite($file, json_encode($json));
            flock($file, LOCK_UN);
            fclose($file);
            
            return $uuid;
        break;
        default :
            return false;
        break;
    }
}
?>