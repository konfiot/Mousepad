<?php

function db_set_dir($id, $dir, $username){
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
            
            if ($dir === ""){
                unset($json[$username][$id]["dir"]);
            } else {
                $json[$username][$id]["dir"] = $dir;
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