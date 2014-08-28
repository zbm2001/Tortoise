var t = (function(){
  var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __modulo = function(a, b) { return (a % b + +b) % b; };

  %output%
  return [agentmodel, engine, shim, util, nashorn, test, agents, cljs.core.clj__GT_js];
}).call(this);

var agentmodel = t[0];
var tortoise_engine = t[1];
var shim    = t[2];
var util    = t[3];
var nashorn = t[4];
var test    = t[5];
var agents  = t[6];
var js      = t[7];
