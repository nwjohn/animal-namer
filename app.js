// Generated by CoffeeScript 1.8.0
var AnimalNamer, Promise, WP, capitalize, defaultPath, fs, path, wp, _;

WP = require('wordpos');

wp = new WP();

Promise = require('bluebird');

fs = require('fs');

_ = require('lodash');

path = require('path');

defaultPath = path.join(__dirname, 'animals.json');

Promise.promisifyAll(fs);

capitalize = function(s) {
  return s[0].toUpperCase() + s.slice(1, +s.length + 1 || 9e9);
};

AnimalNamer = (function() {
  function AnimalNamer(animalPath) {
    this.path = animalPath || defaultPath;
    this.animals = [];
    this.indexed = {};
  }

  AnimalNamer.prototype.animal = function(letter) {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        if (letter != null) {
          return resolve(_.sample(_this.indexed[letter.toLowerCase()]));
        } else {
          return resolve(_.sample(_this.animals));
        }
      };
    })(this));
  };

  AnimalNamer.prototype.adj = function(letter) {
    var promise;
    promise = new Promise(function(resolve, reject) {
      if (letter != null) {
        return wp.randAdjective({
          startsWith: letter.toLowerCase()
        }, resolve);
      } else {
        return wp.randAdjective(resolve);
      }
    });
    return promise.get(0).then(capitalize);
  };

  AnimalNamer.prototype.adjective = function(letter) {
    return this.adj(letter);
  };

  AnimalNamer.prototype.name = function(letter) {
    var animal;
    animal = '';
    return this.animal(letter).then((function(_this) {
      return function(result) {
        animal = result;
        return _this.adj(animal[0]);
      };
    })(this)).then(function(adjective) {
      return "" + adjective + " " + animal;
    });
  };

  AnimalNamer.prototype.index = function(animals) {
    return _.groupBy(animals, function(s) {
      return s[0].toLowerCase();
    });
  };

  AnimalNamer.prototype.load = function(filePath) {
    return fs.readFileAsync(filePath || this.path, 'utf8').then(JSON.parse).then((function(_this) {
      return function(data) {
        _this.animals = data;
        _this.indexed = _this.index(data);
        return _this;
      };
    })(this));
  };

  return AnimalNamer;

})();

module.exports = AnimalNamer;
