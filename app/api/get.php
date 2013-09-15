<?php
if (isset($_POST["data"])){
    $data["sent"] = json_decode($_POST["data"]);
    if (isset($data["sent"]["type"])){
        switch ($data["sent"]["type"]){
            case "todo" : 
                $result = get_todo($data);
            break;
            case "note" : 
                $result = get_note($data);
            break;
            case "file" :
                $result = get_file($data);
            break;
            case "snippet" :
                $result = get_snippet($data);
            break;
            case "checklist" :
                $result = get_checklist($data);
            break;
            default :
                exit(json_encode(array("error" => "unknown_type")));
        }
    } else {
        $result = get_all();
    }
    echo json_encode($result);
} else {
    echo json_encode(array("error" => "unset_data"));
}
?>