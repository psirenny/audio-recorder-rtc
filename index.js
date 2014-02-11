module.exports = function () {
  return {
    available: function (callback) {
      if (typeof navigator === 'undefined') return callback(false);
      return callback(!!navigator.getUserMedia);
    },
    permission: function (callback) {
      var self = this;
      navigator.getUserMedia({audio: true},
        function (mediaStream) {
          self.rec = RecordRTC(mediaStream);
          callback();
        }
      );
    },
    start: function (callback) {
      this.rec.startRecording();
      callback();
    },
    stop: function (callback) {
      this.rec.stopRecording(function (audioUrl) {
        callback(audioUrl);
      });
    }
  };
};