<?php
include "./KeywordSampleManager.php";

$KSW = new KeywordSampleManager();

$result = $KSW->load();

echo $result;

?>
