<?php

function db_list_cards($username){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILECARDS);
            
            $file = fopen(JSONFILECARDS, "r");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_SH) === false);
            $contents = (filesize(JSONFILECARDS) > 0) ? fread($file, filesize(JSONFILECARDS)) : "{}";
            
            $json = json_decode($contents, true);
            flock($file, LOCK_UN);
            fclose($file);
            
            return (isset($json[$username])) ? $json[$username] : array();

        break;
        default :
            return false;
        break;
    }
}
?>