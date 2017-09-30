<?php

class KeywordSampleManager {
  private $baseDir;

  public function __construct() {
    $this->baseDir = '../../assets/audio/keywordSamples/';
  }

  public function save($name, $buffer) {
    $date = date('Y-m-d-G-i-s-');
    $result = file_put_contents($this->baseDir . $date . $name . '.json', $buffer);
    if ($result) {
      return $this->buildResponse(true, false, 0, 'OK');
    } else {
      return $this->buildResponse(false, false, 500, 'Failed');
    }
  }

  public function delete() {

  }

  public function load() {

  }

  public function checkoutSample() {

  }

  public function checkoutDir() {

  }

  public function buildResponse($success, $payload, $error, $msg) {
    if (!$payload) {
      $pl = ['Empty' => true];
    } else {
      $pl = $payload;
    }

    $response = [
      'success' => $success,
      'payload'=> $pl,
      'error' => [
        'code' => $error,
        'message' => $msg
      ]
    ];

    return json_encode($response);
  }
}

?>
