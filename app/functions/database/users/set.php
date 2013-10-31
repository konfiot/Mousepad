<?php

function db_set_user($data, $username){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILEUSERS);
            
            $file = fopen(JSONFILEUSERS, "a+");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_EX) === false);
            $contents = (filesize(JSONFILEUSERS) > 0) ? fread($file, filesize(JSONFILEUSERS)) : "{}";
            
            $json = json_decode($contents, true);
            
            foreach ($data as $key => $value){
                $json[$username][$key] = $value;
            }
            
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