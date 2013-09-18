<?php
define(DBTYPE, "json");
define(JSONFILE, "diffs.json");

function db_add_diff($diff, $parent){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILE);
            
            $file = fopen(JSONFILE, "w");
            while (flock($file, LOCK_EX) === false);
            $contents = fread($file, filesize(JSONTYPE));
            
            $uuid = uniqid()
            $json = json_decode($contents, true);
            $json[$uuid] = array("content" => $diff, "parent" => $parent, "timestamp" => time());
            
            fwrite($file, json_encode($json));
            flock($file, LOCK_UN);
            fclose($file);
            
            return $uuid

        break;
        default :
            return false;
        break;
    }
}
?>