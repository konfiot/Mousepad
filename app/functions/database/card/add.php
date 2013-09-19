<?php
define(DBTYPE, "json");
define(JSONFILECARDS, "cards.json");

function db_add_card($type, $title, $tags){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILECARDS);
            
            $file = fopen(JSONFILECARDS, "w");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_EX) === false);
            $contents = fread($file, filesize(JSONFILECARDS));
            
            $json = json_decode($contents, true);
            $uuid = uniqid();
            $json[$uuid] = array("type" => $type, "title" => $title, "tags" => $tags);
            
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