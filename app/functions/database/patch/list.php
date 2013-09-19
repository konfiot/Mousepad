<?php
define(DBTYPE, "json");
define(JSONFILEDIFFS, "diffs.json");

function db_list_diffs($id){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILEDIFFS);
            
            $file = fopen(JSONFILEDIFFS, "r");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_SH) === false);
            $contents = fread($file, filesize(JSONFILEDIFFS));
            
            $uuid = uniqid();
            $json = json_decode($contents, true);

            flock($file, LOCK_UN);
            fclose($file);
            
            $json_out = array();
            
            foreach ($json as $key => $value){
                if ($key ==  $id){
                    $json[$key] = $value;
                }
            } 
            
            return $json_out;
        break;
        default :
            return false;
        break;
    }
}
?>