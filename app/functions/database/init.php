<?php
function db_init($dbtype){
    $define = "<?php define('DBTYPE', '$dbtype');";
    switch ($dbtype){
        case 'json' : 
            $define .= "define('JSONFILECARDS', INCPATH.'/data/cards.json');define('JSONFILEDIFFS', INCPATH.'/data/diffs.json');define('JSONFILEUSERS', INCPATH.'/data/users.json');";
        break;
        default :
            return false;
    }
    $define .= "?>";
    file_put_contents(INCPATH."/app/defines/database.php", $define);
    return true;
}
?>