(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('argon2-wasm')) :
	typeof define === 'function' && define.amd ? define(['argon2-wasm'], factory) :
	(factory(global.argon2Wasm));
}(this, (function (argon2Wasm) { 'use strict';

const Crypto = require('./Crypto');
module.exports = new Crypto();


var crypto$1 = Object.freeze({

});

var childSeedFromSeed = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(seed, type, revision, ship, password // Uint8Array, string, ...
  ) {
    var salt;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            salt = type + '-' + revision;

            if (typeof ship === 'number') salt = salt + '-' + ship;
            //TODO the Buffer.from is needed for ArrayBuffer seeds, but... why?
            //     we already to Buffer.from within hash()...
            _context.next = 4;
            return hash(Buffer.from(seed), salt, password || '');

          case 4:
            _context.t0 = seed.length || seed.byteLength;
            return _context.abrupt('return', _context.sent.slice(0, _context.t0));

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function childSeedFromSeed(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

var walletFromSeed = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(seed, password) {
    var wallet;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = bip32;
            _context2.t1 = Buffer;
            _context2.next = 4;
            return hash(Buffer.from(seed), password || '');

          case 4:
            _context2.t2 = _context2.sent;
            _context2.t3 = _context2.t1.from.call(_context2.t1, _context2.t2);
            wallet = _context2.t0.fromSeed.call(_context2.t0, _context2.t3);
            return _context2.abrupt('return', {
              public: buf2hex(wallet.publicKey),
              private: buf2hex(wallet.privateKey),
              chain: buf2hex(wallet.chainCode)
            });

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function walletFromSeed(_x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}();

// matches ++pit:nu:crub:crypto


var childNodeFromSeed = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(seed, type, revision, ship, password) {
    var result, childSeed;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            result = {};

            revision = revision || 0;

            result.meta = { type: type, revision: revision };
            if (typeof ship !== 'undefined' && ship !== null) result.meta.ship = ship;
            _context3.next = 6;
            return childSeedFromSeed(seed, type, revision, ship, password);

          case 6:
            childSeed = _context3.sent;

            result.seed = buf2hex(childSeed);
            _context3.next = 10;
            return walletFromSeed(childSeed, password);

          case 10:
            result.keys = _context3.sent;
            return _context3.abrupt('return', result);

          case 12:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function childNodeFromSeed(_x8, _x9, _x10, _x11, _x12) {
    return _ref3.apply(this, arguments);
  };
}();

var fullWalletFromTicket = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ticket, seedSize, ships, password, revs) {
    var ownerSeed;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.t0 = Buffer;
            _context4.next = 3;
            return argon2u(ticket, seedSize);

          case 3:
            _context4.t1 = _context4.sent.hash;
            ownerSeed = _context4.t0.from.call(_context4.t0, _context4.t1);
            return _context4.abrupt('return', fullWalletFromSeed(ownerSeed, ships, password, revs));

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function fullWalletFromTicket(_x13, _x14, _x15, _x16, _x17) {
    return _ref4.apply(this, arguments);
  };
}();

var fullWalletFromSeed = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ownerSeed, ships, password, revisions) {
    var result, seedSize, ownerPromise, delegatePromise, manageSeed, managePromise, transferPromises, spawnPromises, networkPromises, ship, networkSeed;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            result = {};
            

            revisions = revisions || {};
            revisions.transfer = revisions.transfer || 0;
            revisions.spawn = revisions.spawn || 0;
            revisions.delegate = revisions.delegate || 0;
            revisions.manage = revisions.manage || 0;
            revisions.network = revisions.network || 0;

            result.owner = {};
            result.owner.seed = buf2hex(ownerSeed);
            ownerPromise = walletFromSeed(ownerSeed, password);
            delegatePromise = childNodeFromSeed(ownerSeed, 'delegate', revisions.delegate, null, password);
            _context5.next = 14;
            return childSeedFromSeed(ownerSeed, 'manage', revisions.manage, null, password);

          case 14:
            manageSeed = _context5.sent;

            result.manage = {};
            result.manage.meta = { type: 'manage', revision: revisions.manage };
            result.manage.seed = buf2hex(manageSeed);
            managePromise = walletFromSeed(manageSeed, password);


            result.transfer = [];
            result.spawn = [];
            result.network = [];
            transferPromises = [];
            spawnPromises = [];
            networkPromises = [];

            for (i = 0; i < ships.length; i++) {
              ship = ships[i];


              transferPromises[i] = childNodeFromSeed(ownerSeed, 'transfer', revisions.transfer, ship, password);

              spawnPromises[i] = childNodeFromSeed(ownerSeed, 'spawn', revisions.spawn, ship, password);

              result.network[i] = {};
              result.network[i].meta = {
                type: 'network',
                revision: revisions.network,
                ship: ship
              };
              networkPromises[i] = childSeedFromSeed(manageSeed, 'network', revisions.network, ship, password);
            }

            _context5.next = 28;
            return ownerPromise;

          case 28:
            result.owner.keys = _context5.sent;
            _context5.next = 31;
            return delegatePromise;

          case 31:
            result.delegate = _context5.sent;
            _context5.next = 34;
            return managePromise;

          case 34:
            result.manage.keys = _context5.sent;
            i = 0;

          case 36:
            if (!(i < ships.length)) {
              _context5.next = 51;
              break;
            }

            _context5.next = 39;
            return transferPromises[i];

          case 39:
            result.transfer[i] = _context5.sent;
            _context5.next = 42;
            return spawnPromises[i];

          case 42:
            result.spawn[i] = _context5.sent;
            _context5.next = 45;
            return networkPromises[i];

          case 45:
            networkSeed = _context5.sent;

            result.network[i].seed = buf2hex(networkSeed);
            result.network[i].keys = urbitKeysFromSeed(Buffer.from(networkSeed), password);

          case 48:
            i++;
            _context5.next = 36;
            break;

          case 51:
            return _context5.abrupt('return', result);

          case 52:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function fullWalletFromSeed(_x18, _x19, _x20, _x21) {
    return _ref5.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import {bip32} from 'bip32'
var bip32 = require('bip32');
var nacl = require('tweetnacl');

var buf2hex = function buf2hex(buffer) {
  return Array.from(new Uint8Array(buffer)).map(function (b) {
    return b.toString(16).padStart(2, '0');
  }).join('');
};

function hash() {
  // any number of arguments
  return crypto$1.subtle.digest({ name: 'SHA-512' }, Buffer.concat(Array.from(arguments).map(Buffer.from)));
}

function argon2u(entropy, ticketSize) {
  return argon2Wasm.argon2({
    pass: entropy, // string or Uint8Array
    salt: 'urbitkeygen',
    type: 10, // argon2.ArgonType.Argon2u,
    hashLen: +ticketSize,
    distPath: 'node_modules/argon2-wasm/dist',
    parallelism: +4,
    mem: +512000,
    time: +1
  });
}

function urbitKeysFromSeed(seed, password) {
  seed = Buffer.concat([seed, Buffer.from(password || '')]);
  var hash = [];
  nacl.lowlevel.crypto_hash(hash, seed.reverse(), seed.length);
  var c = hash.slice(32);
  var a = hash.slice(0, 32);
  var crypt = nacl.sign.keyPair.fromSeed(Buffer.from(c));
  var auth = nacl.sign.keyPair.fromSeed(Buffer.from(a));
  return {
    crypt: {
      private: buf2hex(c.reverse()),
      public: buf2hex(crypt.publicKey.reverse())
    },
    auth: {
      private: buf2hex(a.reverse()),
      public: buf2hex(auth.publicKey.reverse())
    }
  };
}

module.exports = {
  fullWalletFromTicket: fullWalletFromTicket,
  fullWalletFromSeed: fullWalletFromSeed,
  childNodeFromSeed: childNodeFromSeed,
  childSeedFromSeed: childSeedFromSeed,
  walletFromSeed: walletFromSeed,
  urbitKeysFromSeed: urbitKeysFromSeed
};

})));
