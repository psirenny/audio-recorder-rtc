module.exports = function () {
  return {
    available: function (callback) {
      if (typeof navigator === 'undefined') return callback(false);
      return callback(!!navigator.getUserMedia);
    },
    clear: function (callback) {
      this.rec.url = null;
      callback();
    },
    name: 'rtc',
    permission: function (callback) {
      var self = this;
      if (this.rec) return callback();
      navigator.getUserMedia({audio: true},
        function (mediaStream) {
          self.rec = RecordRTC(mediaStream);
          callback();
        }
      );
    },
    send: function (url, callback) {
      var data = new FormData();
      var req = new XMLHttpRequest();
      data.append('audio', this.rec.getBlob());
      req.open('POST', url, true);
      req.onload = function (e) {
        var res = JSON.parse(e.target.response);
        var success = e.target.status === 200;
        callback(success ? null : res, res);
      };
      req.send(data);
    },
    start: function (callback) {
      this.rec.startRecording();
      callback();
    },
    stop: function (callback) {
      var self = this;
      this.rec.stopRecording(function (url) {
        self.rec.url = url;
        callback();
      });
    }
  };
};
