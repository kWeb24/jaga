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
      return $this->buildResponse(true, $payload, 200, 'OK');
    } else {
      return $this->buildResponse(false, false, 500, 'Failed');
    }
  }

  public function delete($name) {
    $result = unlink($this->baseDir . $name . '.json');
    if ($result) {
      return $this->buildResponse(true, null, 200, 'OK');
    } else {
      return $this->buildResponse(false, false, 500, 'Failed');
    }
  }

  public function load() {
    $files = $this->checkoutDir();
    if (!empty($files)) {
      $samples = [];
      foreach ($files as $file) {
        $content = file_get_contents($this->baseDir . $file);
        if ($content) {
          array_push($samples, $content);
        }
      }
      if (!empty($samples)) {
        return $this->buildResponse(true, $samples, 200, 'OK');
      } else {
        return $this->buildResponse(false, false, 500, 'Failed');
      }
    } else {
      return $this->buildResponse(true, null, 204, 'Empty');
    }
  }

  public function checkoutSample() {

  }

  public function checkoutDir() {
    $dirContent = scandir($this->baseDir);
    $finalArray = [];
    foreach ($dirContent as $fileName) {
      $path = pathinfo($fileName);
      if ($path['extension'] == 'json') {
        array_push($finalArray, $fileName);
      }
    }
    return $finalArray;
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
