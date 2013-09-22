<?php
define(DBTYPE, "json");
define(JSONFILECARDS, "cards.json");

function db_set_tags($id, $tags){
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
            
            $json[$id]["tags"] = $tags;
            
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