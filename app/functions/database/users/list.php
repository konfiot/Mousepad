<?php
define(DBTYPE, "json");
define(JSONFILECARDS, "users.json");

function list_users(){
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