<?php

error_reporting(0);

if(isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message_title']) && isset($_POST['message'])) {
    /* здесь вставить вашу функцию отправки письма (function.mail) из вашего старого файла index.php, затем замените файл index.php на этот index.php, предварительно создав копию */
}

$ruri_parts = explode('/', $_SERVER['REQUEST_URI']);

$page = 'index.html';

if(!empty($ruri_parts[1]) && $ruri_parts[1] == 'en') {
    $page = 'index_en.html';
}

echo file_get_contents($page);