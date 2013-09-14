<?php
if (isset($_POST["data"])){
    $data["sent"] = json_decode($_POST["data"]);
    if (isset($data["sent"]["type"])){
        switch ($data["sent"]["type"]){
            case "todo" : 
                $result = add_todo($data);
            break;
            case "note" : 
                $result = add_note($data);
            break;
            case "file" :
                $result = add_file($data);
            break;
            case "snippet" :
                $result = add_snippet($data);
            break;
            case "checklist" :
                $result = add_checklist($data);
            break;
            default :
                exit(json_encode(array("error" => "unknown_type")));
        }
    }
    echo json_encode($result);
} else {
    echo json_encode(array("error" => "unset_data"));
}
?>