<?php

define(JSONFILECARDS, "cards.json");

function db_touch($id){
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
            
            $json[$id]["last_viewed"] = time();
            (gettype($json[$id]["times_viewed"]) === "integer") ? $json[$id]["times_viewed"]++ : $json[$id]["times_viewed"] = 1;

            ftruncate($file, 0);
            fwrite($file, json_encode($json));
            clearstatcache();
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