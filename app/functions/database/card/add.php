<?php

function db_add_card($type, $title, $tags, $dir){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILECARDS);
            
            $file = fopen(JSONFILECARDS, "a+");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_EX) === false);
            $contents = fread($file, filesize(JSONFILECARDS));
            
            $json = json_decode($contents, true);
            $uuid = uniqid();
            $json[$uuid] = array("type" => $type, "title" => $title, "tags" => $tags, "dir" => $dir);
            
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