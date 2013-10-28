<?php

function list_users(){ // TODO : Refactorer le nom en db_list_users
    switch (DBTYPE){
        case "json" :
            touch(JSONFILEUSERS);
            
            $file = fopen(JSONFILEUSERS, "r");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_SH) === false);
            $contents = fread($file, filesize(JSONFILEUSERS));
            
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