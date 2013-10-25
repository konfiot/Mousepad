<?php

function db_touch($id, $username){
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
            
            $json[$username][$id]["last_viewed"] = time();
            (gettype($json[$username][$id]["times_viewed"]) === "integer") ? $json[$username][$id]["times_viewed"]++ : $json[$username][$id]["times_viewed"] = 1;

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