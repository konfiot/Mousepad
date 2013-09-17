<?php 
function add_file($data) {
    if ($data["type"] != "file"){
        return json_encode(array("error" => "expected file, but saw " . $data["type"]. " instead" ));
    }
    
    $title = htmlspecialchars($data["title"]);
    $path = htmlspecialchars($data["path"]);
    $parent = htmlspecialchars($data["parent"])
    
    $id = db_add_file($title, $path, $parent);
    
    if ($id === false){
        return json_encode(array("error" => "Database error" ));
    }
}
?>