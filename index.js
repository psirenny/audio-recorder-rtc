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
  this.data.rec.startRecording();
  callback(null);
};

Strategy.prototype.stop = function (callback) {
  var self = this;
  this.data.rec.stopRecording(function (url) {
    self.data.rec.url = url;
    callback(null, {type: 'wav', url: url});
  });
};

module.exports = function () {
  return new Strategy();
};
