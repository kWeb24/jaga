<?php
include "./KeywordSampleManager.php";

$KSW = new KeywordSampleManager();
$name = $_POST['name'];

$result = $KSW->delete($name);

echo $result;

?>
