'use strict';

function Changelog() {}

var KeyPath = require('key-path');
Changelog.prototype = {
  __proto__: [], // jshint ignore:line

  reset: function() {
    this.length = 0;
  },

  view: function () {
    var revealPaths =  KeyPath.getAll.apply(KeyPath, arguments);

    return this.filter(function (change) {

      if (change.hidden) {
        for (var i = 0; i < revealPaths.length; i++) {
          if (revealPaths[i] === KeyPath.get(change.payload[0])) {
            // hidden and revealed
            return true;
          }
        }
        // hidden
        return false;
      } else {
        // not hidden
        return true;
      }
    });
  }
};
Changelog.prototype.constructor = Changelog;

var changeNames = [
  'setPrimitiveValue' // keyPath, newValue
];

changeNames.forEach(function (changeName) {
  Changelog.prototype[changeName] = function() {
    var change = {
      type: changeName,
      payload: [].slice.call(arguments, 1) // (converts arguments into an array
    };
    if (arguments[0]) {
      change.hidden = true;
    }
    this.push(change);
  };
});

module.exports = Changelog;
//
//var Master = require('..')
//var o = Master.newInstance({
//  n: Number,
//  s: {$type: String, $hidden: true},
//  b: Boolean
//});
//
//o.n = 2;
//o.s = 'some value';
//o.b = true;
//
//var cv = o.$changelog.view();
