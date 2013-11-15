<?php
include '../defines/misc.php';
include INCPATH.'/app/functions/database/init.php';

function init($dbtype, $timezone, $admin){
    if(!(db_init($dbtype))){
        return false;
    }
    return ((bool) file_put_contents(INCPATH.'/app/defines/timezone.php', '<?php define(\'TIMEZONE\', \'' . $timezone . '\');?>'));
}
?>