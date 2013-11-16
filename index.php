<?php
date_default_timezone_set("UTC");
include "app/defines/timezone.php";
date_default_timezone_set(TIMEZONE);
session_start();

include 'app/defines/misc.php';
include 'app/defines/admin.php';
include 'app/defines/database.php';
include 'app/functions/data/login.php';
include 'app/functions/data/get/user.php';

if (!(file_exists('app/defines/database.php'))){
    header("Location: static/themes/default/install.html");
} else if (is_logged()){
    $data = get_user(is_logged());
    $theme = $data["theme"];
    header("Location: static/themes/$theme/list.html");
} else {
    $data = get_user(ADMIN);
    $theme = $data["theme"];
    header("Location: static/themes/$theme/login.html");
}
?>