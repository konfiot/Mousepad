<?php

function db_remove_card($id, $username){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILECARDS);
            
            $file = fopen(JSONFILECARDS, "a+");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_EX) === false);
            $contents = (filesize(JSONFILECARDS) > 0) ? fread($file, filesize(JSONFILECARDS)) : "{}";
            
            $json = json_decode($contents, true);
            
            unset($json[$username][$id]);
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