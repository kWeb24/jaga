KeywordSpotter = function() {
  this.SR = null;
  this.init();
};

KeywordSpotter.prototype = Object.create(KeywordSpotter);
KeywordSpotter.prototype.constructor = KeywordSpotter;

KeywordSpotter.prototype.init = function() {
  this.SR = new JsSpeechRecognizer();
  this.SR.numGroups = 60;
  this.SR.groupSize = 5;
  //this.SR.keywordSpottingMinConfidence = 0.7;
};


KeywordSpotter.prototype.listen = function() {
  this.SR.openMic();
};

KeywordSpotter.prototype.stopListening = function() {
};

KeywordSpotter.prototype.isRecording = function() {
  return this.SR.isRecording();
};

KeywordSpotter.prototype.stopRecording = function() {
  return this.SR.stopRecording();
};

KeywordSpotter.prototype.startTraining = function(word) {
  this.SR.startTrainingRecording(word);
};

KeywordSpotter.prototype.playTrainingBuffer = function(id) {
  this.SR.playTrainingBuffer(id);
};

KeywordSpotter.prototype.deleteTrainingBuffer = function(id) {
  this.SR.deleteTrainingBuffer(id);
};

KeywordSpotter.prototype.startSpotting = function() {
  this.SR.startKeywordSpottingRecording();
};

KeywordSpotter.prototype.generateModel = function() {
  this.SR.generateModel();
};

KeywordSpotter.prototype.playMonoAudio = function(audio) {
  this.SR.playMonoAudio(audio);
};

KeywordSpotter.prototype.startRecognition = function() {
  this.SR.startRecognitionRecording();
};

KeywordSpotter.prototype.getTopRecognitionHypotheses = function() {
  this.SR.getTopRecognitionHypotheses(1);
};

KeywordSpotter.prototype.startSpottingNoisy = function() {
  this.SR.startKeywordSpottingNoisyRecording();
};

KeywordSpotter.prototype.setKeywordSpottingMinConfidence = function(val) {
  this.SR.keywordSpottingMinConfidence = val;
};

KeywordSpotter.prototype.setCallback = function(obj) {
  this.SR.keywordSpottedCallback = obj;
};
