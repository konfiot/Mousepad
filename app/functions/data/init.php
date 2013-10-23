<?php
include '../functions/database/init.php';

function init($dbtype, $timezone){
    if(!(db_init($dbtype))){
        return false;
    }
    return ((bool) file_put_contents("../defines/timezone.php", "<?php define('TIMEZONE', '" . $timezone . "');?>"));
}
?>