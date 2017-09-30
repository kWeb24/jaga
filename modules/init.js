$(document).ready(function() {
  initAnimations();
  initSREvents();
  var _SR = initSpeechRecognition();
  initSRUtils(_SR);
  var _SS = initSpeechSynthesis();
  initSSUtils(_SS);
  var _KS = initKeywordSpotting();
  initKSUtils(_KS);
});

function initAnimations() {
  var animation = bodymovin.loadAnimation({
    container: document.getElementById('listening'),
    path: 'assets/animations/volume_indicator.json',
    renderer: 'svg',
    loop: true,
    autoplay: true,
    name: "Hello World",
  });

  var animation2 = bodymovin.loadAnimation({
    container: document.getElementById('waiting'),
    path: 'assets/animations/infinite_rainbow.json',
    renderer: 'svg',
    loop: true,
    autoplay: true,
    name: "Hello World2",
  });
}

function initSpeechRecognition() {
  return new SpeechRecognition();
}

function initSpeechSynthesis() {
  return new SpeechSynthesis();
}

function initKeywordSpotting() {
  return new KeywordSpotter();
}

function initSREvents() {
  $(document).on('srmessage', function(e, type) {
    $('#info p').removeClass('visible');
    $('#' + type).addClass('visible');
  });

  $(document).on('status', function(e, type) {
    $('.status-animation').removeClass('visible');
    $('#' + type).addClass('visible');
  });

  $(document).on('transcript_finished', function(e, msg) {
    $('#convo-box').append('<p class="me"><span>Ja: </span><br />' + msg + '</p>');
    $("#convo-box").animate({ scrollTop: $('#convo-box').prop("scrollHeight")}, 100);
    requestCleverbot(msg);
  });

  $(document).on('response_ready', function(e, msg) {
    $('#convo-box').append('<p class="res"><span>Jaga: </span><br />' + msg + '</p>');
    $("#convo-box").animate({ scrollTop: $('#convo-box').prop("scrollHeight")}, 100);
  });
}

function initSRUtils(_SR) {
  $('.microphone img').on('click', function(e) {
    _SR.start(e);
  });
}

function initSSUtils(_SS) {
  $(document).on('response_speak', function(e, msg) {
      _SS.speak(msg);
  });
}

var cs = null;
function requestCleverbot(input) {
  $.ajax({
      type: 'GET',
      url: 'http://www.cleverbot.com/getreply',
      data: {
          key: apiKeys.cleverbot,
          input: input,
          cs: cs,
          //callback: 'ProcessReply',
      },
      success: function (data) {
          cs = data.cs;
          $(document).trigger('response_ready', [data.output]);
          $(document).trigger('response_speak', [data.output]);
      },
      error: function (e) {
      }
  });
}

function initKSUtils(_KS) {
  _KS.listen();

  $.ajax({
      type: 'GET',
      url: 'modules/KeywordSampleManager/loadSamples.php',
      success: function (data) {
        var result = JSON.parse(data);
        if (result.success) {
          if (result.error.code == 200) {
            var payload = result.payload.samples;
            var filenames = result.payload.filenames;
            $(payload).each(function(i, el) {
              var buf = JSON.parse(el);
              var fn = filenames[i];
              var sampleId = _KS.addAudioSample(buf) - 1;
            });
            $(document).trigger('response_speak', 'Próbki audio załadowane.');
          } else if (result.error.code == 204) {
            $(document).trigger('response_speak', 'Brak próbek audio.');
          }
        } else {
          $(document).trigger('response_speak', 'Błąd ładowania próbek audio.');
        }
      },
      error: function (e) {
        $(document).trigger('response_speak', 'Błąd ładowania próbek audio.');
      }
  });

  $("#toggleTraining").on('click', function(e) {
    e.preventDefault();
    var btn = $(this);
    var word = $("#currentWord").val();
    if (!_KS.isRecording()) {
      _KS.startTraining(word);
      $(btn).addClass('active');
      $("#toggleTesting").attr('disabled', 'true');
    } else {
      var sampleId = _KS.stopRecording() - 1;
      $(btn).removeClass('active');
      $("#toggleTesting").removeAttr('disabled');

      var sampleDivId = "sample-" + sampleId;
      var playButtonId = "play-sample-" + sampleId;
      var deleteButtonId = "delete-sample-" + sampleId;
      var saveButtonId = "save-sample-" + sampleId;
      var removeButtonId = "remove-sample-" + sampleId;

      var resultEl = '<div class="sample" id="' + sampleDivId + '">';
          resultEl += 'Sample #' + sampleId + ' ' + word;
          resultEl += '<span><a id="' + playButtonId + '" href="#" class="fa fa-play"></a> <a id="' + deleteButtonId + '" href="#" class="fa fa-times"></a> <a id="' + saveButtonId + '" href="#" class="fa fa-floppy-o"></a> <a id="' + removeButtonId + '" href="#" class="fa fa-chain-broken"></a></span>';
          resultEl += '</div>';

      $("#training-samples").append(resultEl);

      $('#' + playButtonId).on('click', function(e) {
        e.preventDefault();
        _KS.playTrainingBuffer(sampleId);
      });

      $('#' + deleteButtonId).on('click', function(e) {
        e.preventDefault();
        _KS.deleteTrainingBuffer(sampleId);
        _KS.generateModel();
        $('#' + sampleDivId).remove();
      });

      $('#' + saveButtonId).on('click', function(e) {
        e.preventDefault();
        var btn = $(this);
        var buffer = _KS.getAudioBuffer(sampleId);
        var name = "sample_" + word + "_" + sampleId;
        var json = JSON.stringify(buffer);
        $.ajax({
            type: 'POST',
            url: 'modules/KeywordSampleManager/saveSample.php',
            data: {
              'name': name,
              'buffer': json
            },
            success: function (data) {
              var result = JSON.parse(data);
              if (result.success) {
                $(document).trigger('response_speak', 'Próbka audio zapisana.');
                $(btn).closest('.sample').removeClass('error');
                $(btn).closest('.sample').removeClass('deleted');
                $(btn).closest('.sample').addClass('saved');
                $(btn).closest('.sample').attr('data-filename', result.payload.filename);
              } else {
                $(document).trigger('response_speak', 'Błąd zapisu próbki audio.');
                $(btn).closest('.sample').addClass('error');
              }
            },
            error: function (e) {
              $(document).trigger('response_speak', 'Błąd zapisu próbki audio.');
              $(btn).closest('.sample').addClass('error');
            }
        });
      });

      $('#' + removeButtonId).on('click', function(e) {
        e.preventDefault();
        var btn = $(this);
        var name = $(btn).closest('.sample').attr('data-filename');
        $.ajax({
            type: 'POST',
            url: 'modules/KeywordSampleManager/deleteSample.php',
            data: {
              'name': name
            },
            success: function (data) {
              var result = JSON.parse(data);
              if (result.success) {
                $(document).trigger('response_speak', 'Próbka audio usunięta.');
                $(btn).closest('.sample').removeClass('saved');
                $(btn).closest('.sample').removeClass('error');
                $(btn).closest('.sample').addClass('deleted');
                $(btn).closest('.sample').attr('data-filename', '');
              } else {
                $(document).trigger('response_speak', 'Błąd usuwania próbki audio.');
                $(btn).closest('.sample').addClass('error');
              }
            },
            error: function (e) {
              $(document).trigger('response_speak', 'Błąd usuwania próbki audio.');
              $(btn).closest('.sample').addClass('error');
            }
        });
      });

      _KS.generateModel();
    }
  });

  $("#toggleTesting").on('click', function(e) {
    e.preventDefault();
    var btn = $(this);
    if (!_KS.isRecording()) {
      $(btn).addClass('active');
      $("#toggleTraining").attr('disabled', 'true');
      _KS.startSpotting();
    } else {
      $(btn).removeClass('active');
      $("#toggleTraining").removeAttr('disabled');
      _KS.stopRecording();
    }
    $("#confidenceThreshold").val(_KS.keywordSpottingMinConfidence);
    $("#confidenceThresholdOutput").val(_KS.keywordSpottingMinConfidence);

    $("#confidenceThreshold").on('change', function() {
      $("#confidenceThresholdOutput").val($("#confidenceThreshold").val());
      _KS.setKeywordSpottingMinConfidence($("#confidenceThreshold").val());
    });
  });

  var updateKeywordSpotting = function(result) {
    console.log(result);
  };

  _KS.setCallback(updateKeywordSpotting);
}
