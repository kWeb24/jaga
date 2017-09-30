<?php

class KeywordSampleManager {
  private $baseDir;

  public function __construct() {
    $this->baseDir = '../../assets/audio/keywordSamples/';
  }

  public function save($name, $buffer) {
    $date = date('Y-m-d-G-i-s-');
    $fullName = $date . $name;
    $result = file_put_contents($this->baseDir . $fullName . '.json', $buffer);
    if ($result) {
      $payload = [
        'filename' => $fullName
      ];
      return $this->buildResponse(true, $payload, 0, 'OK');
    } else {
      return $this->buildResponse(false, false, 500, 'Failed');
    }
  }

  public function delete($name) {
    $result = unlink($this->baseDir . $name . '.json');
    if ($result) {
      return $this->buildResponse(true, null, 0, 'OK');
    } else {
      return $this->buildResponse(false, false, 500, 'Failed');
    }
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
