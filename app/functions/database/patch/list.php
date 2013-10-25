<?php

function db_list_diffs($id, $username){
    switch (DBTYPE){
        case "json" :
            touch(JSONFILEDIFFS);
            
            $file = fopen(JSONFILEDIFFS, "r");
            if(!$file){
                return false;
            }
            while (flock($file, LOCK_SH) === false);
            $contents = fread($file, filesize(JSONFILEDIFFS));
            $json = json_decode($contents, true);

            flock($file, LOCK_UN);
            fclose($file);
            
            $json_out = array();
            
            foreach ($json[$username] as $key => $value){
                if ($value["parent"] ==  $id){
                    $json_out[$key] = $value;
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