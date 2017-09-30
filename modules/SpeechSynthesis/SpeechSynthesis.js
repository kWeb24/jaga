SpeechSynthesis = function() {
  this.synth = null;
  this.rate = null; /* 0.5 - 2 */
  this.pitch = null; /* 0 - 2 */
  this.voice = null;
  this.voiceName = null;
  this.selectedVoice = null;
  this.voices = [];
  this.voicesCreated = null;
  this.init();
};

SpeechSynthesis.prototype = Object.create(SpeechSynthesis);
SpeechSynthesis.prototype.constructor = SpeechSynthesis;

SpeechSynthesis.prototype.init = function() {
  var self = this;

  self.synth = window.speechSynthesis;
  self.rate = 1;
  self.pitch = 1;
  self.voiceName = 'Google polski';
  self.voicesCreated = false;

  if ('onvoiceschanged' in self.synth) {
    self.synth.onvoiceschanged = function(e) {
      self.populateVoiceList();
    };
  } else {
    self.populateVoiceList();
  }

};

SpeechSynthesis.prototype.populateVoiceList = function() {
  var self = this;
  var tmpVoices = self.synth.getVoices();
  if (tmpVoices.length && !self.voicesCreated) {
    tmpVoices.forEach(function(voice) {
      self.voices.push(voice);
    });
    self.voicesCreated = true;
    for(i = 0; i < self.voices.length; i++) {
      if(self.voices[i].name === self.voiceName) {
        self.selectedVoice = self.voices[i];
      }
    }
  }
};

SpeechSynthesis.prototype.speak = function(msg) {
  var self = this;
  var utterThis = new SpeechSynthesisUtterance(msg);
  utterThis.voice = self.selectedVoice;
  utterThis.pitch = self.pitch;
  utterThis.rate = self.rate;
  self.synth.speak(utterThis);
};
