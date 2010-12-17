<?php

if ($_GET['action'] == 'POST') {
    if (get_magic_quotes_gpc() ) {
        $_POST['content'] = stripslashes($_POST['content']);
    }
    file_put_contents("clipboard.xml",$_POST['content']);
} else {
    header("Content-type: text/xml");
    print '<?xml version="1.0" encoding="utf-8" ?>';
    print file_get_contents("clipboard.xml");
}

/*
$content = file_get_contents("php://input");

print $content;
*/
?>
