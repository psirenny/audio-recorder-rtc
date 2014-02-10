module.exports = function () {
  return {
    available: function (callback) {
      if (typeof navigator === 'undefined') return callback(false);
      return callback(!!(navigator || {}).getUserMedia);
    },
    permission: function (callback) {
      var self = this;
      navigator.getUserMedia({audio: true},
        function (mediaStream) {
          self.rtc = RecordRTC(mediaStream);
          callback();
        }
      );
    },
    start: function (callback) {
      this.rtc.startRecording();
      callback();
    },
    stop: function (callback) {
      this.rtc.stopRecording(function (audioUrl) {
        callback(audioUrl);
      });
    }
  };
};