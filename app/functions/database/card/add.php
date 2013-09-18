<?php
define(DBTYPE, "json");
define(JSONFILE, "cards.json");

function db_add_card($type, $title){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILE);
            
            $file = fopen(JSONFILE, "w");
            while (flock($file, LOCK_EX) === false);
            $contents = fread($file, filesize(JSONTYPE));
            
            $json = json_decode($contents, true);
            $uuid = uniqid();
            $json[$uuid] = array("type" => $type, "title" => $title);
            
            fwrite($file, json_encode($json));
            flock($file, LOCK_UN);
            fclose($file);
            
            return $uuid;

        break;
        default :
            return false;
        break;
    }
}
?>