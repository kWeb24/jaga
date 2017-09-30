SpeechRecognition = function() {
  this.final_transcript = '';
  this.recognizing = false;
  this.ignore_onend = null;
  this.start_timestamp = null;
  this.recognition = null;

  if (!('webkitSpeechRecognition' in window)) {
    $(document).trigger('srmessage', ['info_upgrade']);
  } else {
    $(document).trigger('srmessage', ['info_start']);
    $(document).trigger('status', 'waiting');
    this.init();
  }
};

SpeechRecognition.prototype = Object.create(SpeechRecognition);
SpeechRecognition.prototype.constructor = SpeechRecognition;

SpeechRecognition.prototype.init = function() {
  var self = this;
  this.recognition = new webkitSpeechRecognition();
  this.recognition.continuous = true;
  this.recognition.interimResults = true;

  this.recognition.onstart = function() {
    self.recognizing = true;
    $(document).trigger('srmessage', ['info_speak_now']);
    $(document).trigger('status', 'listening');
  };

  this.recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      $(document).trigger('srmessage', ['info_no_speech']);
      self.ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      $(document).trigger('srmessage', ['info_no_microphone']);
      self.ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        $(document).trigger('srmessage', ['info_blocked']);
      } else {
        $(document).trigger('srmessage', ['info_denied']);
      }
      self.ignore_onend = true;
    }
  };

  this.recognition.onend = function() {
    self.recognizing = false;
    if (self.ignore_onend) {
      return;
    }
    if (!self.final_transcript) {
      $(document).trigger('srmessage', ['info_start']);
      return;
    }
    $(document).trigger('status', 'waiting');
    $(document).trigger('srmessage', ['info_start']);
    $(document).trigger('transcript_finished', [self.lineBreak(self.final_transcript)]);
  };

  this.recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        self.final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    self.final_transcript = self.capitalize(self.final_transcript);
    $('#interim_span').html(self.lineBreak(interim_transcript));
  };
};

SpeechRecognition.prototype.lineBreak = function(s) {
  var two_line = /\n\n/g;
  var one_line = /\n/g;
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
};

SpeechRecognition.prototype.capitalize = function(s) {
  var first_char = /\S/;
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
};

SpeechRecognition.prototype.start = function(e) {
  if (this.recognizing) {
    this.recognition.stop();
    $(document).trigger('status', 'waiting');
    return;
  }

  this.final_transcript = '';
  this.recognition.lang = 'pl-PL';
  this.recognition.start();
  this.ignore_onend = false;
  this.start_timestamp = event.timeStamp;
  $('#interim_span').html('');
  $(document).trigger('srmessage', ['info_allow']);
};
