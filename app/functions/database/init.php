<?php
function db_init($dbtype){
    $define = "<?php define('DBTYPE', '$dbtype');";
    switch ($dbtype){
        case 'json' : 
            $define .= "define('JSONFILECARDS', '../../data/cards.json');define('JSONFILEDIFFS', '../../data/diffs.json');define('JSONFILEUSERS', '../../data/users.json');";
        break;
        default :
            return false;
    }
    $define .= "?>";
    file_put_contents("../defines/database.php", $define);
    return true;
}
?>