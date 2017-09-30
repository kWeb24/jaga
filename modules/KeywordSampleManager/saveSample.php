<?php
include "./KeywordSampleManager.php";

$KSW = new KeywordSampleManager();
$buffer = $_POST['buffer'];
$name = $_POST['name'];

$result = $KSW->save($name, $buffer);

echo $result;

?>
