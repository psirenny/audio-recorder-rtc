function Strategy () {}

Strategy.prototype.available = function (callback) {
  if (typeof navigator === 'undefined') return callback(null, false);
  callback(null, !!navigator.getUserMedia);
};

Strategy.prototype.create = function (callback) {
  this.data = {};
  callback(null);
};

Strategy.prototype.destroy = function (callback) {
  this.data = {};
  callback(null);
};

Strategy.prototype.permission = function (callback) {
  var self = this;

  if (this.data.rec) {
    return callback(null, true);
  }

  function success(mediaStream) {
    self.data.rec = RecordRTC(mediaStream);
    callback(null, true);
  }

  function failure() {
    callback(null, false);
  }

  navigator.getUserMedia({audio: true}, success, failure);
};

Strategy.prototype.start = function (callback) {
  console.log('start');
  this.data.rec.startRecording();
  console.log('callback');
  callback(null);
};

Strategy.prototype.stop = function (callback) {
  var self = this;
  this.data.rec.stopRecording(function (url) {
    self.data.rec.url = url;
    callback(null, url);
  });
};

module.exports = function () {
  return new Strategy();
};

/*
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

      function success(mediaStream) {
        self.rec = RecordRTC(mediaStream);
        callback();
      }

      navigator.getUserMedia(
        {audio: true}, success, callback
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
};*/
