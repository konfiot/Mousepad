<?php

function db_list_cards(){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILECARDS);
            
            $file = fopen(JSONFILECARDS, "r");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_SH) === false);
            $contents = fread($file, filesize(JSONFILECARDS));
            
            $json = json_decode($contents, true);
            flock($file, LOCK_UN);
            fclose($file);
            
            return $json;

        break;
        default :
            return false;
        break;
    }
}
?>