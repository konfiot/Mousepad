<?php 
include "../functions/database/card/get.php";
include "../functions/database/card/remove.php";


function remove_card($data) {
    if(!(isset($data["id"]))){
        return array("error" => "Unset id");
    }
    $card = db_get_card($data["id"]);
    if(!(isset($card))){
        return array("error" => "Card not found");
    }
    
    if(db_remove_card($data["id"])){
        return array("success" => "Note succesfully deleted");
    } else {
        return array("error" => "Database error");
    }
}
?>