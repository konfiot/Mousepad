<?php
define(DBTYPE, "json");
define(JSONFILE, "cards.json");
function db_add_card($type, $title){
    switch (DBTYPE){
        "json" :
            touch(JSONFILE);
            
            $file = fopen(JSONFILE, "r")
            while (flock($file, LOCK_EX) === false);
            $contents = fread($file, filesize(JSONTYPE));
            
            $json = json_decode($contents);
            $uuid = uniqid();
            $json[$uuid] = array("type" => $type, "title" => $title);
            
            fwrite($file, json_encode($json));
            flock($file, LOCK_UN);
            fclose($file);

        break;
        default :
            return false
        break;
    }
}
?>