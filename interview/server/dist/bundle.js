/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nError: Plugin/Preset files are not allowed to export objects, only functions. In C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\babel-preset-react\\\\lib\\\\index.js\\n    at createDescriptor (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\config-descriptors.js:178:11)\\n    at C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\config-descriptors.js:109:50\\n    at Array.map (<anonymous>)\\n    at createDescriptors (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\config-descriptors.js:109:29)\\n    at createPresetDescriptors (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\config-descriptors.js:101:10)\\n    at C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\config-descriptors.js:58:104\\n    at cachedFunction (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\caching.js:62:27)\\n    at cachedFunction.next (<anonymous>)\\n    at evaluateSync (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\gensync\\\\index.js:244:28)\\n    at sync (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\gensync\\\\index.js:84:14)\\n    at presets (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\config-descriptors.js:29:84)\\n    at mergeChainOpts (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\config-chain.js:319:26)\\n    at C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\config-chain.js:282:7\\n    at Generator.next (<anonymous>)\\n    at buildRootChain (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\config-chain.js:67:36)\\n    at buildRootChain.next (<anonymous>)\\n    at loadPrivatePartialConfig (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\partial.js:95:62)\\n    at loadPrivatePartialConfig.next (<anonymous>)\\n    at Function.<anonymous> (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\partial.js:120:25)\\n    at Generator.next (<anonymous>)\\n    at evaluateSync (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\gensync\\\\index.js:244:28)\\n    at Function.sync (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\gensync\\\\index.js:84:14)\\n    at Object.<anonymous> (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\@babel\\\\core\\\\lib\\\\config\\\\index.js:43:61)\\n    at Object.<anonymous> (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\babel-loader\\\\lib\\\\index.js:151:26)\\n    at Generator.next (<anonymous>)\\n    at asyncGeneratorStep (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\babel-loader\\\\lib\\\\index.js:3:103)\\n    at _next (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\babel-loader\\\\lib\\\\index.js:5:194)\\n    at C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\babel-loader\\\\lib\\\\index.js:5:364\\n    at new Promise (<anonymous>)\\n    at Object.<anonymous> (C:\\\\Users\\\\alput\\\\roodeoo\\\\oostaoo-coding-adventure\\\\Interview3\\\\server\\\\node_modules\\\\babel-loader\\\\lib\\\\index.js:5:97)\");\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });