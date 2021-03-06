'use strict';

if (process.browser) {
  var RecordRTC = require('recordrtc');
}

function Strategy() {}

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
    self.data.mediaStream = mediaStream;
    callback(null, true);
  }

  function failure() {
    callback(null, false);
  }

  navigator.getUserMedia({audio: true}, success, failure);
};

Strategy.prototype.start = function (callback) {
  var opts = {disableLogs: true, numberOfAudioChannels: 1, type: 'audio'};
  this.data.rec = RecordRTC(this.data.mediaStream, opts);
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
