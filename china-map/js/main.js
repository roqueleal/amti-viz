/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "5b2ba9366d4b18bc2da0";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/index.js")(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./src/scss/main.scss":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader??ref--5-2!./node_modules/postcss-loader/src??postcss!./node_modules/sass-loader/lib/loader.js??ref--5-4!./src/scss/main.scss ***!
  \********************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./src/index.js":
/*!**********************************!*\
  !*** ./src/index.js + 1 modules ***!
  \**********************************/
/*! no exports provided */
/*! all exports used */
/*! ModuleConcatenation bailout: Cannot concat with ./src/js/helpers.js because of ./src/js/initWithSpreadsheet.js */
/*! ModuleConcatenation bailout: Cannot concat with ./src/js/parsers.js because of ./src/js/initWithSpreadsheet.js */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/scss/main.scss
var main = __webpack_require__("./src/scss/main.scss");

// EXTERNAL MODULE: ./node_modules/regenerator-runtime/runtime.js
var runtime = __webpack_require__("./node_modules/regenerator-runtime/runtime.js");

// EXTERNAL MODULE: ./src/js/parsers.js
var parsers = __webpack_require__("./src/js/parsers.js");

// CONCATENATED MODULE: ./src/js/makeMap.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


var url = window.location != window.parent.location ? document.referrer : document.location.href;
var href = /lang=([^&]+)/.exec(url);
window.lang = href ? href[1] : null;
var leafletLoaded = 0;
var primaryJsFiles = ['https://unpkg.com/leaflet@1.3.1/dist/leaflet.js', 'https://unpkg.com/whatwg-fetch@3.0.0/dist/fetch.umd.js'];
var secondaryJsFiles = ['https://unpkg.com/leaflet.zoomslider@0.7.1/src/L.Control.Zoomslider.js', 'https://unpkg.com/leaflet-fullscreen@1.0.2/dist/Leaflet.fullscreen.min.js', 'https://unpkg.com/chroma-js@2.0.3/chroma.min.js', 'https://csis-ilab.github.io/map-templates/dist/js/vendor/A11y-Dialog.js', 'https://unpkg.com/choices.js@7.0.0/public/assets/scripts/choices.min.js', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js', 'https://csis-ilab.github.io/map-templates/dist/js/vendor/patterns.js', 'https://csis-ilab.github.io/map-templates/dist/js/vendor/latinize.js'];

function handleLoadLeaflet() {
  return new Promise(function (resolve, reject) {
    secondaryJsFiles.forEach(function (file) {
      var head = document.head;
      var jsLink = document.createElement('script');
      jsLink.src = file;
      head.appendChild(jsLink);

      jsLink.onload = function () {
        leafletLoaded++;

        if (leafletLoaded === secondaryJsFiles.length + primaryJsFiles.length) {
          resolve(leafletLoaded);
          return leafletLoaded;
        }
      };
    });
  });
}

function importFiles() {
  return _importFiles.apply(this, arguments);
}

function _importFiles() {
  _importFiles = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              primaryJsFiles.forEach(function (file) {
                var head = document.head;
                var jsLink = document.createElement('script');
                jsLink.src = file;

                jsLink.onload = function () {
                  leafletLoaded++;

                  if (leafletLoaded === primaryJsFiles.length) {
                    handleLoadLeaflet();
                    resolve(leafletLoaded);
                    return leafletLoaded;
                  }
                };

                head.appendChild(jsLink);
              });
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _importFiles.apply(this, arguments);
}

function makeMap(_x) {
  return _makeMap.apply(this, arguments);
}

function _makeMap() {
  _makeMap = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(options) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (leafletLoaded) {
              _context3.next = 6;
              break;
            }

            _context3.next = 3;
            return importFiles().then(
            /*#__PURE__*/
            function () {
              var _ref = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(scriptsLoaded) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return init(options);

                      case 2:
                        return _context2.abrupt("return", _context2.sent);

                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x3) {
                return _ref.apply(this, arguments);
              };
            }());

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 6:
            _context3.next = 8;
            return init(options);

          case 8:
            return _context3.abrupt("return", _context3.sent);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _makeMap.apply(this, arguments);
}

function init(_x2) {
  return _init.apply(this, arguments);
}

function _init() {
  _init = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(options) {
    var dataURL, translations, initWithSpreadsheet, initWithoutSpreadsheet;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            dataURL = 'https://spreadsheets.google.com/feeds/list/';
            window.defaultColor = options.oceancolor || options.oceanColor || options['ocean color'];

            if (!lang) {
              _context5.next = 6;
              break;
            }

            fetch(dataURL + options.googleSheet + '/' + 3 + '/public/values?alt=json').then(function (response) {
              return response.json();
            }).then(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee4(json) {
                var initWithSpreadsheet;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        translations = Object(parsers["a" /* parseLanguageData */])(json.feed.entry);
                        initWithSpreadsheet = __webpack_require__(/*! ./initWithSpreadsheet.js */ "./src/js/initWithSpreadsheet.js").default;
                        _context4.next = 4;
                        return initWithSpreadsheet(dataURL, options, translations);

                      case 4:
                        return _context4.abrupt("return", _context4.sent);

                      case 5:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }());
            _context5.next = 17;
            break;

          case 6:
            if (!options.googleSheet) {
              _context5.next = 13;
              break;
            }

            initWithSpreadsheet = __webpack_require__(/*! ./initWithSpreadsheet.js */ "./src/js/initWithSpreadsheet.js").default;
            _context5.next = 10;
            return initWithSpreadsheet(dataURL, options);

          case 10:
            return _context5.abrupt("return", _context5.sent);

          case 13:
            initWithoutSpreadsheet = __webpack_require__(/*! ./initWithSpreadsheet.js */ "./src/js/initWithSpreadsheet.js").default;
            _context5.next = 16;
            return initWithoutSpreadsheet(options);

          case 16:
            return _context5.abrupt("return", _context5.sent);

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _init.apply(this, arguments);
}
// EXTERNAL MODULE: ./src/js/helpers.js
var helpers = __webpack_require__("./src/js/helpers.js");

// CONCATENATED MODULE: ./src/index.js




window.externalLink = helpers["d" /* externalLink */];
window.makeMap = makeMap; // ;(async function() {
//   var map = await makeMap({
//     googleSheet: '1R9J3haGLDsRPhtT1P1JvQL_XzaPZZsa33vBFO6xs6g4',
//     mapID: 'chinapower',
//     mapboxStyle:
//       lang && lang.indexOf('zh-') > -1
//         ? 'citui3waw00162jo1zcsf1urj'
//         : 'cj84s9bet10f52ro2lrna50yg',
//     onEachFeature: {
//       mouseover: function(e) {
//         var layer = this._map._layers[this._leaflet_id]
//
//         this.openPopup(e.latlng)
//
//         window.handleLayerClick(this.feature, layer, this._map)
//       },
//       mouseout: function(e) {
//         this.closePopup()
//       }
//     },
//     formatPopupContent: function(feature, map) {
//       var prefix = lang ? '_' + lang : ''
//
//       var name = feature.properties['name' + prefix]
//
//       // var description = feature.properties['description' + prefix]
//       //   .replace(/<a href=/gi, '<a target="_blank" href=')
//       //   .replace(/<\/a>/gi, externalLink + '</a>')
//
//       var outpost = feature.properties.chinese_outposts
//       return (
//         '<div class="popupEntryStyle">' +
//         outpost +
//         (name && outpost ? '<br/>' : '') +
//         (name !== outpost ? name : '') +
//         (feature.properties.observed
//           ? '<br/>(expected)'
//           : feature.properties.observed === false
//             ? '<br />(observed)'
//             : '') +
//         '</div>' +
//         '<div class="popupEntryStyle">' +
//         'description' +
//         '</div>'
//       )
//     }
//   })
// })()
// var maps = [
//   // {
//   //   id: 'claims-map',
//   //   sheet: '14MvucMac-lYCu0-2vD5tcxfCUqIJog2h4-REFkpH3Kw',
//   //   'popup headers': [
//   //     window.lang ? 'name_' + window.lang : 'name',
//   //     window.lang ? 'description_' + window.lang : 'description',
//   //     'link'
//   //   ]
//   // }
//   // ,
//   {
//     id: 'venezuela',
//     sheet: '13tvoxc7kB8BzSKO67c6kf949kqte_o-WFF5W21h5O98'
//   },
//   {
//     id: 'features-map',
//     sheet: '1REFNJ8WZ9fOzShYC8SpUJ7pZQEMkWlqzC2KpMb-wSyc'
//   },
//   {
//     id: 'resources-map',
//     sheet: '11rUaoISSkqakEKZ6hi4xeVbbiEnfPi1qsRoq4r0SrPA',
//     'popup headers': [
//       lang ? 'name_' + lang : 'name',
//       lang ? 'description_' + lang : 'description',
//       'link'
//     ]
//   },
//   {
//     id: 'aegis',
//     sheet: '15oJSmk0KW3_5D8Uj1eSiz-e-PpW51e9N-XSgLIQtZIk'
//   },
//   {
//     id: 'wbi-terrorism',
//     sheet: '1d4Ee65KT_S46x0mk62sV6CYDpMZ40c2oYJ6BQs9a_10'
//   }
// ]
//
// maps.reverse().forEach((map, i) => {
//   var mapboxStyle =
//     lang && lang.indexOf('zh-') > -1
//       ? (mapboxStyle = 'citui3waw00162jo1zcsf1urj')
//       : (mapboxStyle = 'cj84s9bet10f52ro2lrna50yg')
//
//   setTimeout(() => {
//     console.log('another one')
//     makeMap({
//       mapID: map.id,
//       externalLinkText: 'yo, click here',
//       googleSheet: map.sheet,
//       fullScreen: true,
//       'mapbox style':
//         map.id === 'aegis'
//           ? 'cjoiv6dmo29kh2rsd2z5qda2p'
//           : map.id === 'venezuela' || map.id === 'wbi-terrorism'
//             ? 'cjrawc1zs2bzc2sq3y9wvt22t'
//             : mapboxStyle,
//       'ocean color': '#cad2d3',
//       'popup headers': map['popup headers'], // Array
//       // "popup content": [],
//       // pointStyle: function(feature,latlng){},
//       // nonPointStyle: function(feature){},
//       // onEachFeature: {
//       // click: function(feature, layer){}
//       // dbclick: function(feature, layer, map){},
//       // mousedown: function(feature, layer, map){},
//       // mouseenter: function(feature, layer, map){},
//       // mouseout: function(feature, layer, map){}
//       // },
//       formatPopupContent:
//         map.id === 'aegis'
//           ? function(feature, map) {
//             return `<div class="popupTitleStyle">${
//               feature.properties.name
//             }</div>
//
//         ${
//   feature.properties.total_guided_missile_cruisers
//     ? `<div class="popupHeaderStyle">Guided Missile Cruisers: ${
//       feature.properties.total_guided_missile_cruisers
//     }</div>
//         <div><span class='popupEntryStyle'>BMD-Capable:</span>
//         <span class='popupEntryStyle'>${
//   feature.properties.bmd_capable_gmc
// }</span></div>`
//     : ''
// }
//     ${
//   feature.properties.total_guided_missile_destroyers
//     ? `<div class="popupHeaderStyle">Guided Missile Destroyers: ${
//       feature.properties.total_guided_missile_destroyers
//     }</div>
//     <div><span class='popupEntryStyle'>BMD-Capable:</span>
//     <span class='popupEntryStyle'>${
//   feature.properties.total_guided_missile_destroyers
// }</span></div>`
//     : ''
// }`
//           }
//           : map.id === 'venezuela'
//             ? function(feature, map) {
//               return (
//                 '<div class="popupHeaderStyle">' +
//                   feature.properties.country +
//                   '</div><div class="popupEntryStyle">' +
//                   (feature.properties.recognition.toLowerCase() === 'y'
//                     ? feature.properties.country +
//                       ' recognizes Juan Guaid\xF3 as President of Venezuela'
//                     : feature.properties.country +
//                       ' recognizes Nicol\xE1s Maduro as President of Venezuela</div>') +
//                   '</div>'
//               )
//             }
//             : null
//     })
//   }, 2000 * i)
// })

if (typeof window.CustomEvent !== 'function') {
  var CustomEvent = function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}

Array.prototype.groupBy = function (property1, property2) {
  return property2 ? this.reduce(function (groups, item) {
    var val = item[property2][property1];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {}) : this.reduce(function (groups, item) {
    var val = item[property1];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
};

RegExp.escape = function (s) {
  return s.replace(/[\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/***/ }),

/***/ "./src/js/helpers.js":
/*!***************************!*\
  !*** ./src/js/helpers.js ***!
  \***************************/
/*! exports provided: createColorScale, lineWeights, lineDashArrays, externalLink, remove, convertType, capitalize, load, makeDropdownOptions */
/*! exports used: capitalize, convertType, createColorScale, externalLink, lineDashArrays, lineWeights, load, makeDropdownOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return createColorScale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return lineWeights; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return lineDashArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return externalLink; });
/* unused harmony export remove */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return convertType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return load; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return makeDropdownOptions; });
function createColorScale(count, index) {
  var scaleOne = chroma.cubehelix().hue(0.5).lightness([0.4, 0.6]).scale().colors(count * 2);
  var scaleTwo = chroma.cubehelix().hue(1).gamma(0.5).scale().colors(count * 2).reverse();
  var scale = [];

  for (var i = 0; i < count; i++) {
    var color = i % 2 === 0 ? scaleOne[i * 2] : scaleTwo[i * 2];
    color = chroma(color).saturate().hex();
    scale.push(color);
  }

  return scale;
}
var lineWeights = [[3, 3], [5, 2], [4, 3.5], [7, 3], [4, 4]];
var lineDashArrays = [[null, '6,9'], [null, null], [null, '6,12'], [null, null], ['18,24', '18,24']];
var externalLink = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path d="M7.49,0V1.67H1.68V13.32H13.32V7.52H15v5.72a1.76,1.76,0,0,1-.42,1.19,1.64,1.64,0,0,1-1.13.56H1.74a1.67,1.67,0,0,1-1.16-.41A1.61,1.61,0,0,1,0,13.48v-.27C0,9.4,0,5.6,0,1.8A1.83,1.83,0,0,1,.58.4a1.53,1.53,0,0,1,1-.39h6Z" transform="translate(0 0)"/><path d="M9.17,1.67V0H15V5.84H13.34v-3h0c-.05.05-.11.1-.16.16l-.45.46-1.3,1.29-.84.84-.89.9-.88.87-.89.9c-.28.29-.57.57-.86.86L6.16,10l-.88.87a1.83,1.83,0,0,1-.13.16L4,9.86l0,0L5.36,8.47l.95-1,.75-.75,1-1L8.87,5l1-.94.85-.86.92-.91.56-.58Z" transform="translate(0 0)"/></svg>';
var remove = '<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="evenodd"><path d="M2.592.044l18.364 18.364-2.548 2.548L.044 2.592z"/><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/></g></svg>';
function convertType(value) {
  var v = Number(value);
  return !isNaN(v) ? v : value.toLowerCase() === 'undefined' ? undefined : value.toLowerCase() === 'null' ? null : value.toLowerCase() === 'true' ? true : value.toLowerCase() === 'false' ? false : value;
}
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function load(url, element) {
  var req = new XMLHttpRequest();
  req.open('GET', url, false);
  req.send(null);
  element.innerHTML = req.responseText;
}
function makeDropdownOptions(options, x) {
  var groups = options.widgets[x].keys.groupBy('group');
  var choices = Object.keys(groups).map(function (g, z) {
    return {
      id: z,
      label: g.trim() && parseInt(g, 10) === NaN ? g : '',
      disabled: false,
      choices: groups[g]
    };
  });
  return {
    choices: choices,
    removeItemButton: true,
    maxItemCount: options.widgets[x].maximum,
    callbackOnCreateTemplates: function callbackOnCreateTemplates(template) {
      var _this = this;

      return {
        item: function item(classNames, data) {
          var key = options.widgets[x].keys.find(function (v) {
            return v.value.toLowerCase() === data.value.toLowerCase();
          });
          var keyStyle;

          switch (options.widgets[x].type) {
            case 'form':
              var forms = options.widgets[x].keys.map(function (k) {
                return k.value.toLowerCase();
              });
              var i = forms.indexOf(key.value.toLowerCase());
              var styleOptions = {
                key: key,
                index: i,
                forms: forms,
                map: options
              };
              keyStyle = styleKey(styleOptions);
              break;

            case 'color':
              var styleOptions = {
                key: key,
                map: options
              };
              keyStyle = styleKey(styleOptions);
              break;
          }

          var markup = '<div style="border-color:' + key.color + '" class="' + classNames.item + '" data-item data-id="' + data.id + '" data-value="' + data.value + '" ' + (data.active ? 'aria-selected="true"' : '') + ' ' + (data.disabled ? 'aria-disabled="true"' : '') + '><span class="' + keyStyle.class + 'Key" ' + 'style="background-image: url(\'' + keyStyle.svg + '")></span> ' + capitalize(data.label) + '<button style="border-left: 1px solid ' + key.color + '; background-image: url(\'data:image/svg+xml;base64,' + window.btoa(remove) + '\')" type="button" class="choices__button" data-button="" aria-label="Remove item">Remove item</button></div>';
          return template(markup);
        },
        choice: function choice(classNames, data) {
          var key = options.widgets[x].keys.find(function (v) {
            return v.value.toLowerCase() === data.value.toLowerCase();
          });
          var keyStyle;

          switch (options.widgets[x].type) {
            case 'form':
              var forms = options.widgets[x].keys.map(function (k) {
                return k.value.toLowerCase();
              });
              var styleOptions = {
                key: key,
                // index: i,
                forms: forms,
                map: options
              };
              keyStyle = styleKey(styleOptions);
              break;

            case 'color':
              var styleOptions = {
                key: key,
                map: options
              };
              keyStyle = styleKey(styleOptions);
              break;
          }

          var markup = ' <div class="' + classNames.item + ' ' + classNames.itemChoice + ' ' + (data.disabled ? classNames.itemDisabled : classNames.itemSelectable) + '" data-select-text="' + _this.config.itemSelectText + '" data-choice ' + (data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable') + ' data-id="' + data.id + '" data-value="' + data.value + '" ' + (data.groupId > 0 ? 'role="treeitem"' : 'role="option"') + '> <span class="' + keyStyle.class + 'Key" ' + 'style="background-image: url(\'' + keyStyle.svg + '")></span> ' + capitalize(data.label) + ' </div> ';
          return template(markup);
        }
      };
    }
  };
}

/***/ }),

/***/ "./src/js/initWithSpreadsheet.js":
/*!****************************************************!*\
  !*** ./src/js/initWithSpreadsheet.js + 10 modules ***!
  \****************************************************/
/*! exports provided: default */
/*! all exports used */
/*! ModuleConcatenation bailout: Cannot concat with ./src/js/helpers.js because of ./src/index.js */
/*! ModuleConcatenation bailout: Cannot concat with ./src/js/parsers.js because of ./src/index.js */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/js/parsers.js
var parsers = __webpack_require__("./src/js/parsers.js");

// EXTERNAL MODULE: ./src/js/helpers.js
var helpers = __webpack_require__("./src/js/helpers.js");

// CONCATENATED MODULE: ./src/js/styleKey.js

function styleKey(options) {
  var map = options.map,
      feature = options.feature,
      group = options.group,
      key = options.key,
      index = options.index,
      forms = options.forms;
  var keyColor;
  var dashArray;
  var colors;
  var key = group ? group[0] : key;
  var formKeyWidget = map.widgets.find(function (w) {
    return w.type === 'form';
  });
  var colorKeyWidget = map.widgets.find(function (w) {
    return w.type === 'color';
  });
  if (colorKeyWidget && colorKeyWidget.keys && feature) colorKey = colorKeyWidget.keys.find(function (k) {
    return k.value.toLowerCase() === feature.properties[colorKeyWidget.field].toLowerCase();
  });
  if (colorKey) keyColor = colorKey.color;
  key.color = group && group.every(function (g) {
    return g.color;
  }) ? chroma.average(group.map(function (g) {
    return g.color;
  })) : key.color;

  switch (key.form) {
    case 'line':
      keyColor = key.color ? key.color : options.map.oceancolor ? options.map.oceancolor : null;

      if (forms) {
        var svg;

        switch (index) {
          case 0:
            colors = [keyColor ? keyColor : chroma(defaultColor).darken(), keyColor ? keyColor : chroma(defaultColor).darken()];
            break;

          case 1:
            colors = [keyColor ? keyColor : chroma(defaultColor).darken(), '#ffffff'];
            break;

          case 2:
            colors = ['#000000', keyColor ? keyColor : defaultColor];
            break;

          case 3:
            colors = ['#ffffff', keyColor ? keyColor : chroma(defaultColor).darken()];
            break;

          default:
            colors = [keyColor ? keyColor : chroma(defaultColor).darken(), keyColor ? keyColor : chroma(defaultColor).darken()];
            break;
        }

        svg = '<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 48 12\'><line x1=\'0\' x2=\'48\' y1=\'50%\' y2=\'50%\' stroke=\'' + colors[0] + '\' stroke-width=\'' + helpers["f" /* lineWeights */][index][0] + '\' stroke-linecap=\'square\' stroke-dasharray=\'' + (index === 4 ? '18,12' : helpers["e" /* lineDashArrays */][index][0]) + '\'/><line x1=\'0\' x2=\'48\' y1=\'50%\' y2=\'50%\' stroke=\'' + colors[1] + '\' stroke-width=\'' + helpers["f" /* lineWeights */][index][1] + '\' stroke-linecap=\'square\' stroke-dasharray=\'' + (index === 4 ? '18,12' : helpers["e" /* lineDashArrays */][index][1]) + '\'/></svg>';
      } else {
        svg = '<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 48 12\'><line x1=\'0\' x2=\'48\' y1=\'50%\' y2=\'50%\' stroke=\'' + keyColor + '\' stroke-width=\'' + 3 + '\' stroke-linecap=\'square\' stroke-dasharray=\'' + '3,7' + '\'/></svg>';
      }

      return {
        svg: 'data:image/svg+xml;base64,' + window.btoa(svg),
        class: 'line'
      };

    case 'icon':
      if (key.icon) {
        var slug = key.value.replace(/ /g, '-');
        Object(helpers["g" /* load */])(key.icon, document.querySelector('.hidden'));
        var svgContent = document.querySelector('.hidden').innerHTML;

        if (colorKeyWidget && keyColor) {
          svgContent = svgContent.replace(/((\bfill="#)(([0-a-fA-F]{2}){3}|([0-9a-fA-F]){3})")/gi, '');
          svgContent = svgContent.replace(/(<circle |<rectangle |<ellipse |<polygon |<path )/g, function (match, p1, p2, p3) {
            return match.replace(match, match + 'fill="' + keyColor + '" ');
          });
        }

        svg = 'data:image/svg+xml;base64,' + window.btoa(svgContent);
      } else {
        svg = 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg"><circle cx="' + map.iconsize[0] / 2 + '" cy="' + map.iconsize[1] / 2 + '" r="' + (map.iconsize[0] + map.iconsize[1]) / 4 + '" fill="' + (keyColor || key.color) + '"/></svg>');
      }

      return {
        svg: svg,
        class: key.icon ? 'icon' : 'color'
      };

    case 'pattern':
      keyColor = key.color;
      var svg;

      switch (true) {
        case key.pattern[0].indexOf('stripe') > -1:
          var colorTwo = key.pattern[1];
          var colorOne = key.pattern[key.pattern.length - 1];
          svg = 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><polygon points="5.73 0 4.67 0 0 4.66 0 5.71 5.73 0" fill="' + colorOne + '"/><polygon points="2.28 0 1.22 0 0 1.22 0 2.27 2.28 0" fill="' + colorTwo + '"/><polygon points="8.85 0 7.79 0 0 7.77 0 8.82 8.85 0" fill="' + colorTwo + '"/><polygon points="12 0 11.24 0 0 11.2 0 12 0.26 12 12 0.3 12 0" fill="' + colorOne + '"/><polygon points="12 10.12 12 9.06 9.05 12 10.11 12 12 10.12" fill="' + colorTwo + '"/><polygon points="12 3.52 12 2.46 2.43 12 3.49 12 12 3.52" fill="' + colorTwo + '"/><polygon points="12 6.96 12 5.9 5.88 12 6.94 12 12 6.96" fill="' + colorOne + '"/></svg>');
          break;

        case key.pattern[0].indexOf('dot') > -1:
          svg = 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg" width="13.06" height="15.1" viewBox="0 0 12 12"><title>stripes</title><path d="M5.49,1A1.16,1.16,0,1,1,4.33-.16,1.16,1.16,0,0,1,5.49,1ZM4.33,3.77A1.16,1.16,0,1,0,5.49,4.93,1.15,1.15,0,0,0,4.33,3.77Zm0,3.93A1.16,1.16,0,1,0,5.49,8.86,1.15,1.15,0,0,0,4.33,7.7Zm0,3.93a1.16,1.16,0,1,0,1.16,1.16A1.15,1.15,0,0,0,4.33,11.63ZM11.5-.16A1.16,1.16,0,1,0,12.66,1,1.16,1.16,0,0,0,11.5-.16Zm0,3.93a1.16,1.16,0,1,0,1.16,1.16A1.16,1.16,0,0,0,11.5,3.77Zm0,3.93a1.16,1.16,0,1,0,1.16,1.16A1.16,1.16,0,0,0,11.5,7.7Zm0,3.93a1.16,1.16,0,1,0,1.16,1.16A1.16,1.16,0,0,0,11.5,11.63ZM7.92-1.16A1.16,1.16,0,0,0,6.76,0,1.16,1.16,0,0,0,7.92,1.16,1.16,1.16,0,0,0,9.07,0,1.16,1.16,0,0,0,7.92-1.16Zm0,3.93A1.16,1.16,0,1,0,9.07,3.93,1.16,1.16,0,0,0,7.92,2.77Zm0,3.93A1.16,1.16,0,1,0,9.07,7.86,1.16,1.16,0,0,0,7.92,6.7Zm0,3.93a1.16,1.16,0,1,0,1.15,1.16A1.16,1.16,0,0,0,7.92,10.63ZM.75-1.16A1.16,1.16,0,0,0-.41,0,1.16,1.16,0,0,0,.75,1.16,1.16,1.16,0,0,0,1.91,0,1.16,1.16,0,0,0,.75-1.16Zm0,3.93A1.16,1.16,0,1,0,1.91,3.93,1.16,1.16,0,0,0,.75,2.77Zm0,3.93A1.16,1.16,0,0,0-.41,7.86,1.15,1.15,0,0,0,.75,9,1.15,1.15,0,0,0,1.91,7.86,1.16,1.16,0,0,0,.75,6.7Zm0,3.93a1.16,1.16,0,1,0,1.16,1.16A1.16,1.16,0,0,0,.75,10.63Z" transform="translate(0.7 2)" fill="' + colorOne + '"/></svg>');
          break;

        default:
          svg = 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' + keyColor + '"/></svg>');
      }

      return {
        svg: svg,
        class: key.pattern ? 'pattern' : 'color'
      };

    case 'shape':
      if (feature) {
        var colorKeyWidget = map.widgets.find(function (w) {
          return w.type === 'color';
        });
        var colorKey = colorKeyWidget.keys.find(function (k) {
          return k.value.toLowerCase() === feature.properties[colorKeyWidget.field].toLowerCase();
        });
        keyColor = colorKey ? colorKey.color : color ? color : null;
      }

      var svg;

      switch (index) {
        case 0:
          svg = '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow"  y1="4.5" x2="9" y2="4.5" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.5 -4.5) rotate(135)"><stop offset="0" stop-color="#7f3c8d"/><stop offset="0.325" stop-color="#e73f74"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#11a579"/><stop offset="1" stop-color="#3969ac"/></linearGradient></defs><rect x="3.25" y="1.75" width="9" height="9" transform="translate(4.5 -4.5) rotate(45)" ' + (keyColor ? 'paint-order="stroke" stroke="#ffffff"' : '') + ' fill="' + (keyColor ? keyColor : 'url(#rainbow)') + '" /></svg>';
          break;

        case 1:
          svg = '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><rect width="10" height="10" ' + (keyColor ? 'stroke="#ffffff"' : '') + ' fill="' + (keyColor ? keyColor : 'url(#rainbow)') + '"/></svg>';
          break;

        case 2:
          svg = '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.325" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><polygon points="6 10.39 0 10.39 3 5.2 6 0 9 5.2 12 10.39 6 10.39" ' + (keyColor ? 'paint-order="stroke" stroke="#ffffff"' : '') + ' fill="' + (keyColor ? keyColor : 'url(#rainbow)') + '" /></svg>';
          break;

        default:
          svg = '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><circle cx="6" cy="6" r="5" ' + (keyColor ? 'stroke="#ffffff"' : '') + ' fill="' + (keyColor ? keyColor : 'url(#rainbow)') + '"/></svg>';
      }

      return {
        svg: 'data:image/svg+xml;base64,' + window.btoa(svg),
        class: 'shape'
      };

    default:
      keyColor = key.color;
      var svg = 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' + keyColor + '"/></svg>');
      return {
        svg: svg,
        class: 'color'
      };
  }
}
// CONCATENATED MODULE: ./src/js/CustomMap.js
var mapId = 0;
function CustomMap_CustomMap(container, properties) {
  this.id = mapId++;
  this.filters = [];
  this.groups = [];
  this.json = [];
  this.leaflet;

  var _this = this;

  Object.keys(properties).forEach(function (property) {
    _this[property.toLowerCase().replace(/ /g, '')] = properties[property];
  });
  _this.popupcontent = _this.popupcontent && typeof _this.popupcontent === 'string' ? _this.popupcontent.split(',') : _this.popupcontent && this.popupcontent === 'object' ? _this.popupcontent : [];
  _this.popupheaders = _this.popupheaders && typeof _this.popupheaders === 'string' ? _this.popupheaders.split(',') : _this.popupheaders && _this.popupheaders === 'object' ? _this.popupheaders : [];
  CustomMap_CustomMap.all = CustomMap_CustomMap.all || [];
  CustomMap_CustomMap.all.push(this);

  _this.resetFilters = function () {
    _this.filters = [];
  };

  _this.removeGroups = function () {
    _this.groups.forEach(function (group) {
      _this.leaflet.removeLayer(group);
    });

    _this.groups = [];
  };

  this.render = function () {
    _this.leaflet = L.map(container, {
      minZoom: _this.minzoom || null,
      maxZoom: _this.maxzoom || 20,
      maxBounds: _this.maxbounds || [_this.swbounds, _this.nebounds],
      scrollWheelZoom: window.innerWidth < 768 ? false : true,
      zoomControl: !_this.hasOwnProperty('zoomslider') || _this.zoomslider ? false : true,
      attributionControl: false
    });
    if (_this.loadEvent) _this.leaflet.on('load', _this.loadevent);
    if (_this.addEvent) _this.leaflet.on('layeradd', _this.addevent);
    this.leaflet.setView(_this.center, _this.zoom || 2);
    L.tileLayer('https://api.mapbox.com/styles/v1/ilabmedia/' + _this.mapboxstyle + '/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw', {}).addTo(_this.leaflet);

    if (!_this.hasOwnProperty('zoomslider') || _this.zoomslider) {
      L.control.zoomslider().addTo(_this.leaflet);
    }

    if (!_this.hasOwnProperty('fullscreen') || _this.fullscreen) {
      window.fullscreen = new L.Control.Fullscreen();

      _this.leaflet.addControl(window.fullscreen);
    }

    L.control.attribution({
      position: 'bottomleft'
    }).setPrefix(_this.attribution).addTo(_this.leaflet);

    _this.resetFilters();

    return _this;
  };
}
// CONCATENATED MODULE: ./src/js/handleFeatureEvents.js

function handleFeatureEvents(feature, layer, map) {
  var eventOptions = map.oneachfeature ? map.oneachfeature : {
    click: function click() {
      handleLayerClick(feature, layer, map.leaflet);
    }
  };
  Object.keys(eventOptions).forEach(function (listener) {
    layer.on(listener, eventOptions[listener]);
  });
  var popupContent = typeof map.formatpopupcontent === 'function' ? map.formatpopupcontent(feature, map) : formatPopupContent(feature, map);
  layer.bindPopup(popupContent);
}

function formatPopupContent(feature, map) {
  var content;
  content = Object.keys(feature.properties).map(function (p) {
    if (feature.properties[p]) {
      if (map.popupheaders.length && map.popupcontent.length) {
        return map.popupheaders.indexOf(p) > -1 && map.popupcontent.indexOf(p) > -1 ? '<div class="popupHeaderStyle">' + p.toUpperCase().replace(/_/g, ' ') + '</div><div class="popupEntryStyle">' + feature.properties[p] + '</div>' : map.popupcontent.indexOf(p) > -1 ? '<div class="popupEntryStyle">' + feature.properties[p] + '</div>' : '';
      } else if (map.popupheaders.length) {
        return map.popupheaders.indexOf(p) > -1 ? '<div class="popupHeaderStyle">' + p.toUpperCase().replace(/_/g, ' ') + '</div><div class="popupEntryStyle">' + feature.properties[p] + '</div>' : '';
      } else if (map.popupcontent.length) {
        return map.popupcontent.indexOf(p) > -1 ? '<div class="popupEntryStyle">' + feature.properties[p] + '</div>' : '';
      } else {
        return '<div class="popupHeaderStyle">' + p.toUpperCase().replace(/_/g, ' ') + '</div><div class="popupEntryStyle">' + feature.properties[p] + '</div>';
      }
    }
  }).filter(function (p) {
    return p;
  }).join('');
  var link = feature.properties.hyperlink || feature.properties.link;
  var externalLinkContent = link && link.trim() ? '<div class="separator"></div><div class="hyperlink popupEntryStyle"><a class="translate" href=' + link.trim() + ' target="_blank">' + map.externalLinkText + '</a>' + helpers["d" /* externalLink */] + '</div>' : '';
  content += externalLinkContent;

  if (lang) {
    var translatableStrings = Object.keys(map.translations).sort(function (a, b) {
      return b.length - a.length;
    });
    translatableStrings.forEach(function (t) {
      var re = new RegExp('\\b(' + RegExp.escape(t) + ')', 'gi');
      content = content.replace(re, map.translations[t]);
    });
  }

  return content;
}

window.handleLayerClick = function (feature, layer, leaflet) {
  var isSpiderfied = false;

  if (!layer._preSpiderfyLatlng) {
    Object.keys(leaflet._layers).forEach(function (l, i) {
      if (leaflet._layers[l].unspiderfy) leaflet._layers[l].unspiderfy();
    });

    if (layer.__parent) {
      Object.values(layer.__parent._group._featureGroup._layers).forEach(function (v) {
        if (v._group && v._group._spiderfied) isSpiderfied = true;
      });
      Array.from(document.querySelectorAll('div.leaflet-marker-icon')).forEach(function (d) {
        return d.style.opacity = isSpiderfied ? 0.33 : 1;
      });
      Array.from(document.querySelectorAll('img.leaflet-marker-icon')).forEach(function (d) {
        return d.style.opacity = isSpiderfied ? 0.33 : 1;
      });
    }
  }
};
// CONCATENATED MODULE: ./src/js/stylePoint.js

function stylePoint(feature, latlng, map, colorKeyWidget, formKeyWidget) {
  var CustomIcon = L.Icon.extend({
    options: {
      iconSize: map.iconsize || [20, 20],
      iconAnchor: map.iconsize ? map.iconsize / 4 : map.iconanchor ? map.iconanchor : [5, 5]
    }
  });
  var pointStyle;
  var key, styleOptions;

  if (formKeyWidget && feature.properties[formKeyWidget.field]) {
    var forms = formKeyWidget.keys.map(function (k) {
      return k.value.toLowerCase();
    });
    var i = forms.indexOf(feature.properties[formKeyWidget.field].toLowerCase());
    key = formKeyWidget.keys.find(function (k) {
      return k.value.toLowerCase() === feature.properties[formKeyWidget.field].toLowerCase();
    });
    styleOptions = key ? {
      key: key,
      index: i,
      forms: forms,
      color: key.color,
      map: map,
      feature: feature
    } : null;
  } else if (colorKeyWidget && feature.properties[colorKeyWidget.field]) {
    var key = colorKeyWidget.keys.find(function (k) {
      return k.value.toLowerCase() === feature.properties[colorKeyWidget.field].toLowerCase();
    });
    styleOptions = key ? {
      key: key,
      color: key.color,
      map: map,
      feature: feature
    } : null;
  }

  if (styleOptions) {
    pointStyle = styleKey(styleOptions);
  } else {
    var colorKeyWidget2 = map.widgets.filter(function (w) {
      return w.type === 'color';
    })[1];
    var formKeyWidget2 = map.widgets.filter(function (w) {
      return w.type === 'form';
    })[1];

    if (formKeyWidget2 && feature.properties[formKeyWidget2.field]) {
      var forms = formKeyWidget2.keys.map(function (k) {
        return k.value.toLowerCase();
      });
      var i = forms.indexOf(feature.properties[formKeyWidget2.field].toLowerCase());
      key = formKeyWidget2.keys.find(function (k) {
        return k.value.toLowerCase() === feature.properties[formKeyWidget2.field].toLowerCase();
      });
      styleOptions = key ? {
        key: key,
        index: i,
        forms: forms,
        color: key.color,
        map: map,
        feature: feature
      } : null;
    } else if (colorKeyWidget2 && feature.properties[colorKeyWidget2.field]) {
      var key = colorKeyWidget2.keys.find(function (k) {
        return k.value.toLowerCase() === feature.properties[colorKeyWidget2.field].toLowerCase();
      });
      styleOptions = key ? {
        key: key,
        color: key.color,
        map: map,
        feature: feature
      } : null;
    }

    if (styleOptions) {
      pointStyle = styleKey(styleOptions);
    } else {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' + '#38f' + '"/></svg>';
      pointStyle = {
        class: 'default',
        svg: encodeURI('data:image/svg+xml;base64,' + window.btoa(svg))
      };
    }
  }

  var iconUrl = pointStyle.svg;
  var icon = new CustomIcon({
    iconUrl: iconUrl
  });
  return L.marker(latlng, {
    icon: icon
  });
}
// CONCATENATED MODULE: ./src/js/styleNonPoint.js


function styleNonPoint(feature, options, index) {
  var leaflet = options.leaflet,
      formKeyWidget = options.formKeyWidget,
      colorKeyWidget = options.colorKeyWidget,
      colors = options.colors,
      forms = options.forms;
  var colorKey = colorKeyWidget ? colorKeyWidget.keys.find(function (k) {
    return k.value.toLowerCase() === feature.properties[colorKeyWidget.field].toLowerCase();
  }) : null;
  var formKey = formKeyWidget ? formKeyWidget.keys.find(function (k) {
    return k.value.toLowerCase() === feature.properties[formKeyWidget.field].toLowerCase();
  }) : null;

  if (!colorKey && !formKey) {
    return {
      opacity: 1,
      fillOpacity: 1,
      color: 'red'
    };
  }

  var color = colorKey ? colorKey.color : formKey ? formKey.color : null;
  var formKeyForm = formKeyWidget ? formKeyWidget.keys.reduce(function (a, c) {
    return c.form;
  }) : null;
  var colorKeyForm = colorKeyWidget ? colorKeyWidget.keys.reduce(function (a, c) {
    return c.form;
  }) : null;

  if (forms && formKeyForm === 'line' || forms && colorKeyForm === 'line') {
    var i = forms.indexOf(feature.properties[formKeyWidget.field]);

    if (i > -1) {
      return {
        color: colors[i][index] === undefined ? '#cad2d3' : colors[i][index] !== null ? colors[i][index] : color,
        weight: helpers["f" /* lineWeights */][i][index],
        lineCap: 'square',
        dashArray: helpers["e" /* lineDashArrays */][i] ? helpers["e" /* lineDashArrays */][i][index] : null
      };
    }
  } else if (formKeyForm === 'line' || colorKeyForm === 'line') {
    return {
      color: color,
      weight: 2,
      lineCap: 'square',
      dashArray: '3,7'
    };
  } else {
    if (colorKey && colorKey.form === 'pattern') {
      var pattern;

      switch (true) {
        case colorKey.pattern[0].indexOf('stripe') > -1:
          var patternOptions = {
            weight: 3,
            spaceWeight: 3,
            color: colorKey.pattern[1],
            spaceColor: colorKey.pattern[colorKey.pattern.length - 1],
            spaceOpacity: 1,
            angle: 45
          };
          pattern = new L.StripePattern(patternOptions);
          break;

        case colorKey.pattern[0].indexOf('dot') > -1:
          var shapeOptions = {
            x: 4,
            y: 4,
            radius: 2,
            fill: true,
            stroke: false,
            fillColor: colorKey.pattern[colorKey.pattern.length - 1],
            fillOpacity: 1
          };
          var shape = new L.PatternCircle(shapeOptions);
          var patternOptions = {
            width: 8,
            height: 8
          };
          pattern = new L.Pattern(patternOptions);
          pattern.addShape(shape);
          break;
      }

      pattern.addTo(options.map.leaflet);
      return {
        fillPattern: pattern ? pattern : null,
        fillColor: color,
        color: defaultColor,
        fillOpacity: 0.7,
        opacity: 0.5,
        weight: 2,
        lineCap: 'square'
      };
    }

    var lineColor;
    var lineWeight;
    var lineOpacity;

    switch (true) {
      case feature.geometry.type.toLowerCase().indexOf('line') > -1:
        lineColor = chroma(color).brighten().hex();
        lineOpacity = 1;
        lineWeight = 4;
        break;

      case feature.geometry.type.toLowerCase().indexOf('polygon') > -1:
        lineColor = defaultColor;
        lineOpacity = 0.5;
        lineWeight = 2;
        break;
    }

    return {
      fillPattern: pattern,
      fillColor: color,
      color: lineColor,
      fillOpacity: 0.7,
      opacity: lineOpacity,
      weight: lineWeight
    };
  }
}
// CONCATENATED MODULE: ./src/js/makeGeoJsonOptions.js



function makeGeoJsonOptions(map, colorKeyWidget, formKeyWidget) {
  function filter(feature) {
    return map.filters.map(function (f) {
      return f(feature);
    }).every(function (f) {
      return f !== false;
    });
  }

  function onEachFeature(feature, layer) {
    handleFeatureEvents(feature, layer, map);
  }

  var form = formKeyWidget ? formKeyWidget.keys.reduce(function (a, c) {
    return c.form;
  }) : null;

  if (formKeyWidget && form === 'line') {
    var colors = [];
    var forms = [];
    forms = formKeyWidget.keys.map(function (f) {
      return f.value;
    });
    forms.forEach(function (f, i) {
      switch (i) {
        case 0:
          colors.push(['transparent', null]);
          break;

        case 1:
          colors.push([null, defaultColor]);
          break;

        case 2:
          colors.push(['#000000', null]);
          break;

        case 3:
          colors.push(['#ffffff', null]);
          break;

        default:
          colors.push([null, null]);
          break;
      }
    });
    var styleOptions = {
      map: map,
      formKeyWidget: formKeyWidget,
      colorKeyWidget: colorKeyWidget,
      colors: colors,
      forms: forms
    };
    var backgroundOptions = {
      filter: filter,
      onEachFeature: onEachFeature,
      pointToLayer: map.pointStyle || function (feature, latlng) {
        return stylePoint(feature, latlng, map, colorKeyWidget, formKeyWidget);
      },
      style: map.nonPointStyle || function (feature) {
        return styleNonPoint(feature, styleOptions, 0);
      }
    };
    var foregroundOptions = {
      filter: filter,
      onEachFeature: onEachFeature,
      pointToLayer: map.pointStyle || function (feature, latlng) {
        return stylePoint(feature, latlng, map, colorKeyWidget, formKeyWidget);
      },
      style: map.nonPointStyle || function (feature) {
        return styleNonPoint(feature, styleOptions, 1);
      }
    };
    return [backgroundOptions, foregroundOptions];
  } else {
    var styleOptions = {
      map: map,
      formKeyWidget: formKeyWidget,
      colorKeyWidget: colorKeyWidget
    };
    return [{
      filter: filter,
      onEachFeature: onEachFeature,
      pointToLayer: map.pointStyle || function (feature, latlng) {
        return stylePoint(feature, latlng, map, colorKeyWidget, formKeyWidget);
      },
      style: map.nonPointStyle || function (feature) {
        return styleNonPoint(feature, styleOptions);
      }
    }];
  }
}
// CONCATENATED MODULE: ./src/js/makeLayers.js

function makeLayers_makeLayers(map) {
  var colorKeyWidget, formKeyWidget;

  if (map.widgets) {
    colorKeyWidget = map.widgets.find(function (w) {
      return w.type === 'color';
    });
    formKeyWidget = map.widgets.find(function (w) {
      return w.type === 'form';
    });
  }

  var geoJsonOptions = map.geoJsonOptions ? map.geoJsonOptions(map, colorKeyWidget, formKeyWidget) : makeGeoJsonOptions(map, colorKeyWidget, formKeyWidget);
  map.json.forEach(function (json, i) {
    var color;

    if (colorKeyWidget) {
      var collectionName = json.features[0].properties[colorKeyWidget.field];
      var colorKey = colorKeyWidget.keys.find(function (key) {
        return key.value.toLowerCase() === collectionName.toLowerCase();
      });
      color = colorKey ? colorKey.color : '#000000';
    } else {
      color = '#000000';
    }

    var allPoints = json.features.every(function (feature) {
      return feature.geometry && feature.geometry.type.toLowerCase() === 'point';
    });
    map.groups.push(new L.MarkerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      maxClusterRadius: allPoints && map.clusterdistance ? map.clusterdistance : NaN,
      iconCreateFunction: function iconCreateFunction(cluster) {
        return L.divIcon({
          className: 'icon-group',
          html: '<span class="text" style="border: 2px solid' + color + '; color:' + color + '">' + cluster.getChildCount() + '</span>'
        });
      }
    }));
    geoJsonOptions.forEach(function (option) {
      if (colorKeyWidget) {
        json.features = json.features.sort(function (a, b) {
          return b.properties[colorKeyWidget.field].localeCompare(a.properties[colorKeyWidget.field]);
        });
      }

      var geoJson = L.geoJson(json, option);
      map.groups[i].addLayer(geoJson);
    });
    map.leaflet.addLayer(map.groups[i]);
    map.groups[i].on('clusterclick', function (e) {
      handleClusterClick(e, map, i);
    });
  });
}

function handleClusterClick(e, map, i) {
  map.leaflet._layers[e.layer._leaflet_id].spiderfy();

  Object.keys(map.leaflet._layers).forEach(function (layer, i) {
    if (parseInt(layer, 10) !== e.layer._leaflet_id) {
      if (map.leaflet._layers[layer].unspiderfy) map.leaflet._layers[layer].unspiderfy();
    }
  });
  var isSpiderfied = false;
  Object.values(map.groups[i]._featureGroup._layers).forEach(function (v) {
    if (v._group && v._group._spiderfied) isSpiderfied = true;
  });
  Array.from(document.querySelectorAll('div.leaflet-marker-icon')).forEach(function (d) {
    return d.style.opacity = isSpiderfied ? 0.33 : 1;
  });
  Array.from(document.querySelectorAll('img.leaflet-marker-icon')).forEach(function (d) {
    return d.style.opacity = isSpiderfied ? 0.33 : 1;
  });
  Object.values(map.groups[i]._featureGroup._layers).filter(function (v) {
    e.layer.getAllChildMarkers().map(function (m) {
      return m.getElement();
    }).filter(function (m) {
      return m;
    }).forEach(function (m) {
      return m.style.opacity = 1;
    });
  });
}
// CONCATENATED MODULE: ./src/js/mapWidgetsToState.js


function mapWidgetsToState(options) {
  var container = document.querySelector('#' + options.slug + ' .map');
  var map = new CustomMap_CustomMap(container, options).render();
  return new Promise(function (resolve, reject) {
    return fetch('https://csis.carto.com/api/v2/sql?api_key=' + map.apikey + '&format=geojson&q=SELECT%20*%20FROM%20' + map.table).then(function (resp) {
      return resp.json();
    }).then(function (json) {
      var colorKeyWidget = map.widgets.find(function (w) {
        return w.type === 'color';
      });
      map.json = [json];

      if (colorKeyWidget) {
        map.json = [];
        var featureGroups = json.features.groupBy(colorKeyWidget.field, 'properties');
        Object.keys(featureGroups).sort(function (a, b) {
          return featureGroups[b][0].properties[colorKeyWidget.field].localeCompare(featureGroups[a][0].properties[colorKeyWidget.field]);
        }).map(function (feature) {
          map.json.push({
            type: 'FeatureCollection',
            features: featureGroups[feature]
          });
        });
      }

      if (!options.widgets.length) {
        makeLayers_makeLayers(map);
        var box = document.querySelector('#' + options.slug + ' #controls');
        box.innerHTML = '';
      }

      options.widgets.forEach(function (w, x) {
        var element = document.querySelector('#' + options.slug + ' .widget.' + options.widgets[x].field);

        if (element.querySelector('select') && widgetContent[x].options) {
          new Choices(element.querySelector('select'), widgetContent[x].options);
        }

        if (element.querySelector('input[id^=\'search\']')) {
          element.querySelector('#resetButton').addEventListener('click', function () {
            handleReset(element, map, x);
          });
        }

        var selects = Array.from(element.querySelectorAll('select'));
        var checks = Array.from(element.querySelectorAll('input[type=\'checkbox\']'));
        var search = Array.from(element.querySelectorAll('input[type=\'text\']:not(.choices__input)'));
        var toggle = Array.from(element.querySelectorAll('input[type=\'radio\']'));
        var inputs = selects.concat(checks).concat(search).concat(toggle); // if (!inputs.length) makeLayers(map)

        var initialized = 0;
        var count = inputs.length;
        inputs.forEach(function (input) {
          if (input.type === 'text') {
            input.addEventListener('keyup', function () {
              handleChange(map, element, options.widgets, x, count, ++initialized);
            });
          } else {
            input.addEventListener('change', function () {
              handleChange(map, element, options.widgets, x, count, ++initialized);
            });
          }

          if ('createEvent' in document) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            input.dispatchEvent(evt);
          } else {
            input.fireEvent('onchange');
          }

          w.map_id = map.id;
        });
      });

      if (map.translations) {
        var translatableNodes = Array.from(document.querySelectorAll('.translate'));
        var translatableStrings = Object.keys(map.translations).sort(function (a, b) {
          return b.length - a.length;
        });
        translatableNodes.forEach(function (el, i) {
          translatableStrings.forEach(function (t) {
            if (Object.keys(map.translations[t]).length) {
              var re = new RegExp('\\b(' + RegExp.escape(t) + ')', 'gi');
              el.innerHTML = el.innerHTML.replace(re, map.translations[t]);
            }
          });
        });
      }

      resolve(map);
    });
  });
}

function handleReset(element, map, x) {
  element.querySelector('input[type=\'text\']').value = '';
  if (map.groups.length) map.removeGroups();

  map.filters[x] = function () {
    return true;
  };

  makeLayers_makeLayers(map);
}

function handleChange(map, element, widgets, x, count, initialized) {
  var options = element.querySelector('select') ? Array.from(element.querySelector('select').options) : element.querySelector('input[type=\'text\']') ? Array.from(element.querySelectorAll('input[type=\'text\']')) : Array.from(element.querySelectorAll('input'));
  var selections = element.querySelector('select') ? Array.from(element.querySelector('select').options) : element.querySelector('input[type=\'text\']') ? Array.from(element.querySelectorAll('input[type=\'text\']')) : Array.from(element.querySelectorAll('input:checked'));
  var possibleChecks = Array.from(element.querySelectorAll('input')).map(function (o) {
    return o.name.toLowerCase();
  });
  var possibleOptions = widgets[x].keys.map(function (key) {
    return key.value.toLowerCase();
  });
  var possibleQueries = possibleChecks.concat(possibleOptions);
  var query = Array.from(selections).map(function (o) {
    return element.querySelector('input[type=\'checkbox\']') ? o.name.toLowerCase() : o.value.toLowerCase();
  });
  map.filters[widgets[x].id] = widgets[x].input === 'toggle' ? function (feature) {
    var bool = true;

    if (feature.properties.toggle) {
      bool = convertType(query[0]) ? true : false;
    } else {
      bool = true;
    }

    return bool;
  } : widgets[x].field === 'all' ? function (feature) {
    var bool = true;
    var withDiacritics = Object.values(feature.properties).join('').toLowerCase();
    var withoutDiacritics = Object.values(feature.properties).join('').toLowerCase().latinise();

    if (withDiacritics.indexOf(query[0]) < 0 && withoutDiacritics.indexOf(query[0]) < 0) {
      bool = false;
    }

    return bool;
  } : function (feature, layers) {
    var bool = true;
    var field = widgets[x].grouping ? widgets[x].grouping : widgets[x].field;

    if (possibleQueries.indexOf(feature.properties[field].toLowerCase()) > -1 && query.indexOf(feature.properties[field].toLowerCase()) < 0) {
      bool = false;
    }

    return bool;
  };
  if (initialized >= count) map.removeGroups();
  if (widgets.length >= x + 1 && initialized >= count) makeLayers_makeLayers(map);
}
// CONCATENATED MODULE: ./src/js/makeWidgets.js




function makeWidgets(jsons, options, boxContent) {
  var widgetContent = [];
  options.widgets.forEach(function (w, x) {
    if (!w.hasOwnProperty('id')) w.id = x;
    var legendData = w.reference ? Object(parsers["b" /* parseLegendData */])(options, jsons[x].feed.entry, w.type) : w.keys;
    options.widgets[x].keys = legendData;
    widgetContent.push(formatWidgets(options, x));
    boxContent += '<section class="widget ' + options.widgets[x].field + '"><h3 class="translate">' + widgetContent[x].title + '</h3>';
    boxContent += widgetContent[x].nodes;
    boxContent += '</section>';
    var box = document.querySelector('#' + options.slug + ' #controls');
    box.innerHTML = boxContent;
    var labelText = document.querySelectorAll('#' + options.slug + ' .itemText');
    Array.from(labelText).forEach(function (itemText) {
      var height = itemText.offsetHeight;
      var fontSize = window.getComputedStyle(itemText)['font-size'];
      var offset = height / parseInt(fontSize.replace('px', ''), 10);
      itemText.style.transform = 'translateY(' + offset * 10 + '%)';
    });
  });
  mapWidgetsToState(options);
}

function formatWidgets(options, x) {
  var widgetNodes = '';
  var dropdownOptions;

  switch (options.widgets[x].input) {
    case 'toggle':
      widgetNodes += '<label for="toggle_' + options.widgets[x].field + '" class="translate"><input type="radio" name="' + options.widgets[x].field + '" id="toggle_' + options.widgets[x].field + '"  value="1" checked>Show</label>';
      widgetNodes += '<label for="$toggle_' + options.widgets[x].field + '" class="translate"><input type="radio" name="' + options.widgets[x].field + '" id="toggle_' + options.widgets[x].field + '" value="0" >Hide</label>';
      break;

    case 'search':
      widgetNodes += '<input type="text" id="search_' + options.widgets[x].field + '" placeholder="' + options.widgets[x].instructions + '" size="10" />';
      widgetNodes += '<button type="button" id="resetButton" class="translate">Reset</button>';
      break;

    case 'dropdown':
      widgetNodes += '<select id="dropdown_' + options.widgets[x].field + '" placeholder="' + options.widgets[x].instructions + '" multiple=""></select>';
      dropdownOptions = Object(helpers["h" /* makeDropdownOptions */])(options, x);
      break;

    case 'checkbox':
      widgetNodes += '<ul>';
      var keyStyle;
      var legendItems = options.widgets[x].grouping ? options.widgets[x].keys.groupBy('group') : options.widgets[x].keys.groupBy('label');
      Object.keys(legendItems).forEach(function (group, i) {
        switch (options.widgets[x].type) {
          case 'form':
            var forms = options.widgets[x].keys.map(function (f) {
              return f.value;
            });
            var styleOptions = {
              group: legendItems[group],
              index: i,
              forms: forms,
              map: options
            };
            keyStyle = styleKey(styleOptions);
            break;

          case 'color':
            var styleOptions = {
              map: options,
              group: legendItems[group]
            };
            keyStyle = styleKey(styleOptions);
            break;
        }

        widgetNodes += '<li><label for="' + group + '"><input class="widget ' + options.widgets[x].input + '" type="checkbox" name="' + (options.widgets[x].grouping ? group : legendItems[group][0].value) + '" id="' + group + '" ' + (legendItems[group][0].selected ? 'checked' : '') + ' ><span class="' + keyStyle.class + 'Key" ' + 'style="background-image: url(\'' + keyStyle.svg + '")></span><span class="itemText">' + Object(helpers["a" /* capitalize */])(group) + '</span></label></li>';
      });
      widgetNodes += '</ul>';
      break;

    default:
      widgetNodes += '<ul>';
      var keyStyle;
      var legendItems = options.widgets[x].grouping ? options.widgets[x].keys.groupBy('group') : options.widgets[x].keys.groupBy('label');
      Object.keys(legendItems).forEach(function (group, i) {
        switch (options.widgets[x].type) {
          case 'form':
            var forms = options.widgets[x].keys.map(function (f) {
              return f.value;
            });
            var styleOptions = {
              group: legendItems[group],
              index: i,
              forms: forms,
              map: options
            };
            keyStyle = styleKey(styleOptions);
            break;

          case 'color':
            var styleOptions = {
              map: options,
              group: legendItems[group]
            };
            keyStyle = styleKey(styleOptions);
            break;
        }

        widgetNodes += '<li><span class="' + keyStyle.class + 'Key" ' + 'style="background-image: url(\'' + keyStyle.svg + '")></span><span class="itemText">' + Object(helpers["a" /* capitalize */])(group) + '</span></li>';
      });
      widgetNodes += '</ul>';
      break;
  }

  var widgetTitle = options.widgets[x].field === 'all' ? 'Search' : options.widgets[x].field.replace(/_/g, ' ');
  return {
    nodes: widgetNodes,
    title: widgetTitle,
    options: dropdownOptions
  };
}
// CONCATENATED MODULE: ./src/js/makeDocumentNodes.js
function makeDocumentNodes(options) {
  var newSectionHTML = '';
  newSectionHTML += '<section id="' + options.slug + '">';
  newSectionHTML += '<div id="' + options.slug + '__map" class="map"></div>';
  newSectionHTML += '<aside class="toolbox">';
  newSectionHTML += options.title ? '<input type="checkbox" checked class="ui mobile-only"><div class="hamburger mobile-only"><div class="icon"> <span></span> <span></span> <span></span></div><div class="menu translate"></div></div>' : '';
  newSectionHTML += '<div class="box">';
  newSectionHTML += options.title || options.logo || options.description ? '<header  class="translate"> <h1><a target="_blank" id="logo"></a></h1>  <p class="translate"></p></header>' : '';
  newSectionHTML += (options.instructions ? '<p class="translate">' + options.instructions + '</p>' : '') + '<div id="controls"><div class="loader"></div></div><footer><div class="hidden"></div></footer></div></aside>';
  newSectionHTML += options.titlecardcontent ? '<button id="' + options.slug + '__about" class="about-trigger">ABOUT THIS MAP</button>' : '';
  newSectionHTML += '</section>';
  document.body.innerHTML += newSectionHTML;

  if (options.titlecardcontent) {
    var newDialogHTML = '';
    newDialogHTML += '<div class="dialog" id="' + options.slug + '__dialog">';
    newDialogHTML += '<div class="dialog-overlay" tabindex="-1" data-a11y-dialog-hide></div>';
    newDialogHTML += '<dialog class="dialog-content" aria-labelledby="dialogTitle" aria-describedby="dialogContent">';
    newDialogHTML += '<button data-a11y-dialog-hide class="dialog-close" aria-label="Close this dialog window">&times;</button>';
    newDialogHTML += options.titlecardtitle ? '<h1 id="dialogTitle">' + options.titlecardtitle + '</h1>' : '';
    newDialogHTML += '<div id="dialogContent">' + options.titlecardcontent + '</div>';
    newDialogHTML += '</dialog>';
    newDialogHTML += '</div>';
    document.body.innerHTML += newDialogHTML;
    document.body.style.overflow = 'hidden';
    var dialogEl = document.getElementById(options.slug + '__dialog');
    var mainEl = document.getElementById('options.slug');
    var dialogTrigger = document.getElementById(options.slug + '__about');
    var dialogBox = new A11yDialog(dialogEl, mainEl);
    var dialog = dialogBox.dialog;
    dialogBox.show();
    dialogBox.on('hide', function (dialogEl) {
      dialogTrigger.style.display = 'block';
    });
    dialogBox.on('show', function (dialogEl) {
      dialogTrigger.style.display = 'none';
    });
    dialogTrigger.addEventListener('click', function () {
      dialogBox.show();
    });
  }

  document.title = options.title + ' | CSIS ' + options.program;
  var metaLocaleOG = document.createElement('meta');
  metaLocaleOG.setAttribute('property', 'og:locale');
  metaLocaleOG.setAttribute('content', 'en_US');
  document.head.appendChild(metaLocaleOG);
  var metaTypeOG = document.createElement('meta');
  metaTypeOG.setAttribute('property', 'og:type');
  metaTypeOG.setAttribute('content', 'article');
  document.head.appendChild(metaTypeOG);
  var metaWidthOG = document.createElement('meta');
  metaWidthOG.setAttribute('property', 'og:image:width');
  metaWidthOG.setAttribute('content', '2000');
  document.head.appendChild(metaWidthOG);
  var metaHeightOG = document.createElement('meta');
  metaHeightOG.setAttribute('property', 'og:image:height');
  metaHeightOG.setAttribute('content', '1333');
  document.head.appendChild(metaHeightOG);
  var metaTwitterCardOG = document.createElement('meta');
  metaTwitterCardOG.setAttribute('property', 'twitter:card');
  metaTwitterCardOG.setAttribute('content', 'summary');
  document.head.appendChild(metaTwitterCardOG);
  var metaTitleOG = document.createElement('meta');
  metaTitleOG.setAttribute('property', 'og:title');
  metaTitleOG.setAttribute('content', options.title + ' | CSIS ' + options.program);
  document.head.appendChild(metaTitleOG);
  var metaTitleTwitter = document.createElement('meta');
  metaTitleTwitter.setAttribute('property', 'twitter:title');
  metaTitleTwitter.setAttribute('content', options.title + ' | CSIS ' + options.program);
  document.head.appendChild(metaTitleTwitter);
  var metaDescriptionOG = document.createElement('meta');
  metaDescriptionOG.setAttribute('property', 'og:description');
  metaDescriptionOG.setAttribute('content', options.description);
  document.head.appendChild(metaDescriptionOG);
  var metaDescriptionTwitter = document.createElement('meta');
  metaDescriptionTwitter.setAttribute('property', 'twitter:description');
  metaDescriptionTwitter.setAttribute('content', options.description);
  document.head.appendChild(metaDescriptionTwitter);
  var metaImageOG = document.createElement('meta');
  metaImageOG.setAttribute('property', 'og:image');
  metaImageOG.setAttribute('content', options.screenshot);
  document.head.appendChild(metaImageOG);
  var metaImageTwitter = document.createElement('meta');
  metaImageTwitter.setAttribute('property', 'twitter:image');
  metaImageTwitter.setAttribute('content', options.screenshot);
  document.head.appendChild(metaImageTwitter);

  if (document.querySelector('#' + options.slug + ' header')) {
    document.querySelector('#' + options.slug + ' .menu').innerText = options.title;
    document.querySelector('#' + options.slug + ' header h1').innerHTML += options.title;
    document.querySelector('#' + options.slug + ' header a').style.backgroundImage = options.logo ? 'url(' + options.logo + ')' : '';
    document.querySelector('#' + options.slug + ' header a').href = options.website ? options.website : '';
    document.querySelector('#' + options.slug + ' header p').innerText = options.description ? options.description : '';
  }
}
// CONCATENATED MODULE: ./src/js/initWithSpreadsheet.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return initWithSpreadsheet; });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }




function initWithSpreadsheet(_x, _x2, _x3) {
  return _initWithSpreadsheet.apply(this, arguments);
}

function _initWithSpreadsheet() {
  _initWithSpreadsheet = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(dataURL, options, translations) {
    var map;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              return fetch(dataURL + options.googleSheet + '/' + 2 + '/public/values?alt=json').then(function (response) {
                return response.json();
              }).then(function (json) {
                var metaData = Object(parsers["c" /* parseMetaData */])(json.feed.entry);
                var widgets = Object(parsers["d" /* parseWidgetData */])(metaData);
                var properties = {};
                Object.keys(metaData).forEach(function (data) {
                  properties[data] = metaData[data];
                });
                Object.keys(options).forEach(function (data) {
                  properties[data] = options[data];
                });
                var twoD_properites = [{
                  name: 'center',
                  default: [0, 0]
                }, {
                  name: 'iconsize',
                  default: [20, 20]
                }, {
                  name: 'iconanchor',
                  default: [5, 5]
                }, {
                  name: 'swbounds',
                  default: [-90, -180]
                }, {
                  name: 'nebounds',
                  default: [90, 180]
                }];
                twoD_properites.forEach(function (property) {
                  properties[property.name] = typeof properties[property.name] === 'string' ? properties[property.name].split(',').map(function (v) {
                    return parseInt(v, 10);
                  }) : properties[property.name] ? properties[property.name] : property.default;
                });
                properties.slug = properties.mapID.toLowerCase().replace(/ /g, '-');
                properties.translations = translations;
                properties.widgets = widgets;
                makeDocumentNodes(properties);
                var referenceSheets = widgets.filter(function (w) {
                  return w.reference;
                });

                if (referenceSheets) {
                  var boxContent = '';
                  var referenceSheetURLS = widgets.map(function (w) {
                    if (w.reference) {
                      return dataURL + options.googleSheet + '/' + w.reference + '/public/values?alt=json';
                    }
                  }).filter(function (u) {
                    return u;
                  });
                  Promise.all(referenceSheetURLS.map(function (url) {
                    return fetch(url);
                  })).then(function (responses) {
                    return Promise.all(responses.map(function (response) {
                      return response.json();
                    }));
                  }).then(
                  /*#__PURE__*/
                  function () {
                    var _ref = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee(jsons) {
                      var footerNode, penUltimateNode;
                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return makeWidgets(jsons, properties, boxContent);

                            case 2:
                              map = _context.sent;

                              if (properties.footer && properties.footer.trim()) {
                                footerNode = document.createElement('footer');
                                footerNode.innerHTML = properties.footer + '  <div class="hidden"></div>';
                                penUltimateNode = document.querySelector('#' + properties.slug + ' #controls') || document.querySelector('#' + properties.slug + 'header');
                                penUltimateNode.parentNode.insertBefore(footerNode, penUltimateNode.nextSibling);
                              }

                              resolve(map);

                            case 5:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }));

                    return function (_x4) {
                      return _ref.apply(this, arguments);
                    };
                  }());
                } else {
                  var map = new CustomMap(container, options).render();
                  makeLayers(map);
                  var box = document.querySelector('#' + options.slug + ' #controls');
                }

                if (properties.footer && properties.footer.trim()) {
                  var footerNode = document.createElement('footer');
                  footerNode.innerHTML = properties.footer + '  <div class="hidden"></div>';
                  var penUltimateNode = document.querySelector('#' + properties.slug + ' #controls') || document.querySelector('#' + properties.slug + 'header');
                  penUltimateNode.parentNode.insertBefore(footerNode, penUltimateNode.nextSibling);
                }
              });
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _initWithSpreadsheet.apply(this, arguments);
}

/***/ }),

/***/ "./src/js/parsers.js":
/*!***************************!*\
  !*** ./src/js/parsers.js ***!
  \***************************/
/*! exports provided: parseLanguageData, parseLegendData, parseMetaData, parseWidgetData */
/*! exports used: parseLanguageData, parseLegendData, parseMetaData, parseWidgetData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return parseLanguageData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return parseLegendData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return parseMetaData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return parseWidgetData; });
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers.js */ "./src/js/helpers.js");

function parseLanguageData(data) {
  var languageData = {};
  data.forEach(function (row) {
    var key;
    Object.keys(row).forEach(function (column, i) {
      if (column.indexOf('gsx$') > -1) {
        var columnName = column.replace('gsx$', '');

        if (columnName === 'en') {
          key = row[column]['$t'];
          languageData[key] = {};
        }

        if (columnName === lang) {
          languageData[key] = row[column]['$t'];
        }
      }
    });
  });
  return languageData;
}
function parseLegendData(options, json, style) {
  var colorScale = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__[/* createColorScale */ "c"])(json.length);
  var legendItems = [];
  json.forEach(function (row, x) {
    var data = {};
    Object.keys(row).forEach(function (column, y) {
      if (column.indexOf('gsx$') > -1) {
        var columnName = column.replace('gsx$', '');

        if (columnName === 'label') {
          var key = row[column]['$t'].toLowerCase();
          data.key = key;
          data.label = row[Object.keys(row)[y + 0]]['$t'];
          data.value = row[Object.keys(row)[y + 1]]['$t'];
          data.group = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__[/* convertType */ "b"])(row[Object.keys(row)[y + 2]]['$t']);
          data.selected = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__[/* convertType */ "b"])(row[Object.keys(row)[y + 3]]['$t']);
          var colorVal = row[Object.keys(row)[y + 4]]['$t'];
          data.form = row[Object.keys(row)[y + 5]]['$t'];
          data.color = colorVal ? colorVal : data.form === 'line' ? defaultColor : colorScale[x];
          data.icon = row[Object.keys(row)[y + 6]]['$t'];
          data.pattern = row[Object.keys(row)[y + 7]]['$t'].split(',');

          if (options.translations) {
            data.label = options.translations[data.label];
            data.group = options.translations[data.group];
          }

          legendItems.push(data);
        }
      }
    });
  });
  return legendItems;
}
function parseMetaData(json) {
  var data = {};
  json.forEach(function (row, x) {
    Object.keys(row).forEach(function (column, y) {
      if (column.indexOf('gsx$') > -1) {
        var columnName = column.replace('gsx$', '');

        if (columnName === 'property') {
          var key = row[column]['$t'].toLowerCase().replace(/ /g, '');
          data[key] = data[key] || {};
          data[key] = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__[/* convertType */ "b"])(row[Object.keys(row)[y + 1]]['$t']);
        }
      }
    });
  });
  return data;
}
function parseWidgetData(metaData) {
  var widgets = [];

  function process(k, index, property) {
    if (k.toLowerCase().indexOf(property) > -1) widgets[index - 1][property] = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__[/* convertType */ "b"])(metaData[k]);
  }

  var properties = ['input', 'field', 'grouping', 'instructions', 'maximum', 'type', 'reference', 'style'];
  Object.keys(metaData).filter(function (k) {
    return k.toLowerCase().indexOf('widget') > -1;
  }).forEach(function (k) {
    var index = k.match(/\d+/)[0];
    widgets[index - 1] = widgets[index - 1] || {};
    properties.forEach(function (property) {
      process(k, index, property);
    });
  });
  widgets.forEach(function (w, i) {
    w.field = w.field.replace(/ /g, '_');
    w.id = i;
  });
  return widgets;
}

/***/ }),

/***/ "./src/scss/main.scss":
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader??ref--5-2!../../node_modules/postcss-loader/src??postcss!../../node_modules/sass-loader/lib/loader.js??ref--5-4!./main.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./src/scss/main.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader??ref--5-2!../../node_modules/postcss-loader/src??postcss!../../node_modules/sass-loader/lib/loader.js??ref--5-4!./main.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./src/scss/main.scss", function() {
		var newContent = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader??ref--5-2!../../node_modules/postcss-loader/src??postcss!../../node_modules/sass-loader/lib/loader.js??ref--5-4!./main.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./src/scss/main.scss");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Njc3MvbWFpbi5zY3NzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21ha2VNYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9oZWxwZXJzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9zdHlsZUtleS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvQ3VzdG9tTWFwLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9oYW5kbGVGZWF0dXJlRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9zdHlsZVBvaW50LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9zdHlsZU5vblBvaW50LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tYWtlR2VvSnNvbk9wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21ha2VMYXllcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21hcFdpZGdldHNUb1N0YXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tYWtlV2lkZ2V0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFrZURvY3VtZW50Tm9kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luaXRXaXRoU3ByZWFkc2hlZXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3BhcnNlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Njc3MvbWFpbi5zY3NzPzEyOTciXSwibmFtZXMiOlsidXJsIiwid2luZG93IiwibG9jYXRpb24iLCJwYXJlbnQiLCJkb2N1bWVudCIsInJlZmVycmVyIiwiaHJlZiIsImV4ZWMiLCJsYW5nIiwibGVhZmxldExvYWRlZCIsInByaW1hcnlKc0ZpbGVzIiwic2Vjb25kYXJ5SnNGaWxlcyIsImhhbmRsZUxvYWRMZWFmbGV0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmb3JFYWNoIiwiZmlsZSIsImhlYWQiLCJqc0xpbmsiLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwiYXBwZW5kQ2hpbGQiLCJvbmxvYWQiLCJsZW5ndGgiLCJpbXBvcnRGaWxlcyIsIm1ha2VNYXAiLCJvcHRpb25zIiwidGhlbiIsInNjcmlwdHNMb2FkZWQiLCJpbml0IiwiZGF0YVVSTCIsImRlZmF1bHRDb2xvciIsIm9jZWFuY29sb3IiLCJvY2VhbkNvbG9yIiwiZmV0Y2giLCJnb29nbGVTaGVldCIsInJlc3BvbnNlIiwianNvbiIsInRyYW5zbGF0aW9ucyIsInBhcnNlTGFuZ3VhZ2VEYXRhIiwiZmVlZCIsImVudHJ5IiwiaW5pdFdpdGhTcHJlYWRzaGVldCIsInJlcXVpcmUiLCJkZWZhdWx0IiwiaW5pdFdpdGhvdXRTcHJlYWRzaGVldCIsImV4dGVybmFsTGluayIsIkN1c3RvbUV2ZW50IiwiZXZlbnQiLCJwYXJhbXMiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRldGFpbCIsInVuZGVmaW5lZCIsImV2dCIsImNyZWF0ZUV2ZW50IiwiaW5pdEN1c3RvbUV2ZW50IiwicHJvdG90eXBlIiwiRXZlbnQiLCJBcnJheSIsImdyb3VwQnkiLCJwcm9wZXJ0eTEiLCJwcm9wZXJ0eTIiLCJyZWR1Y2UiLCJncm91cHMiLCJpdGVtIiwidmFsIiwicHVzaCIsIlJlZ0V4cCIsImVzY2FwZSIsInMiLCJyZXBsYWNlIiwiY3JlYXRlQ29sb3JTY2FsZSIsImNvdW50IiwiaW5kZXgiLCJzY2FsZU9uZSIsImNocm9tYSIsImN1YmVoZWxpeCIsImh1ZSIsImxpZ2h0bmVzcyIsInNjYWxlIiwiY29sb3JzIiwic2NhbGVUd28iLCJnYW1tYSIsInJldmVyc2UiLCJpIiwiY29sb3IiLCJzYXR1cmF0ZSIsImhleCIsImxpbmVXZWlnaHRzIiwibGluZURhc2hBcnJheXMiLCJyZW1vdmUiLCJjb252ZXJ0VHlwZSIsInZhbHVlIiwidiIsIk51bWJlciIsImlzTmFOIiwidG9Mb3dlckNhc2UiLCJjYXBpdGFsaXplIiwic3RyaW5nIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImxvYWQiLCJlbGVtZW50IiwicmVxIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwic2VuZCIsImlubmVySFRNTCIsInJlc3BvbnNlVGV4dCIsIm1ha2VEcm9wZG93bk9wdGlvbnMiLCJ4Iiwid2lkZ2V0cyIsImtleXMiLCJjaG9pY2VzIiwiT2JqZWN0IiwibWFwIiwiZyIsInoiLCJpZCIsImxhYmVsIiwidHJpbSIsInBhcnNlSW50IiwiTmFOIiwiZGlzYWJsZWQiLCJyZW1vdmVJdGVtQnV0dG9uIiwibWF4SXRlbUNvdW50IiwibWF4aW11bSIsImNhbGxiYWNrT25DcmVhdGVUZW1wbGF0ZXMiLCJ0ZW1wbGF0ZSIsIl90aGlzIiwiY2xhc3NOYW1lcyIsImRhdGEiLCJrZXkiLCJmaW5kIiwia2V5U3R5bGUiLCJ0eXBlIiwiZm9ybXMiLCJrIiwiaW5kZXhPZiIsInN0eWxlT3B0aW9ucyIsInN0eWxlS2V5IiwibWFya3VwIiwiYWN0aXZlIiwiY2xhc3MiLCJzdmciLCJidG9hIiwiY2hvaWNlIiwiaXRlbUNob2ljZSIsIml0ZW1EaXNhYmxlZCIsIml0ZW1TZWxlY3RhYmxlIiwiY29uZmlnIiwiaXRlbVNlbGVjdFRleHQiLCJncm91cElkIiwiZmVhdHVyZSIsImdyb3VwIiwia2V5Q29sb3IiLCJkYXNoQXJyYXkiLCJmb3JtS2V5V2lkZ2V0IiwidyIsImNvbG9yS2V5V2lkZ2V0IiwiY29sb3JLZXkiLCJwcm9wZXJ0aWVzIiwiZmllbGQiLCJldmVyeSIsImF2ZXJhZ2UiLCJmb3JtIiwiZGFya2VuIiwiaWNvbiIsInNsdWciLCJxdWVyeVNlbGVjdG9yIiwic3ZnQ29udGVudCIsIm1hdGNoIiwicDEiLCJwMiIsInAzIiwiaWNvbnNpemUiLCJwYXR0ZXJuIiwiY29sb3JUd28iLCJjb2xvck9uZSIsIm1hcElkIiwiQ3VzdG9tTWFwIiwiY29udGFpbmVyIiwiZmlsdGVycyIsImxlYWZsZXQiLCJwcm9wZXJ0eSIsInBvcHVwY29udGVudCIsInNwbGl0IiwicG9wdXBoZWFkZXJzIiwiYWxsIiwicmVzZXRGaWx0ZXJzIiwicmVtb3ZlR3JvdXBzIiwicmVtb3ZlTGF5ZXIiLCJyZW5kZXIiLCJMIiwibWluWm9vbSIsIm1pbnpvb20iLCJtYXhab29tIiwibWF4em9vbSIsIm1heEJvdW5kcyIsIm1heGJvdW5kcyIsInN3Ym91bmRzIiwibmVib3VuZHMiLCJzY3JvbGxXaGVlbFpvb20iLCJpbm5lcldpZHRoIiwiem9vbUNvbnRyb2wiLCJoYXNPd25Qcm9wZXJ0eSIsInpvb21zbGlkZXIiLCJhdHRyaWJ1dGlvbkNvbnRyb2wiLCJsb2FkRXZlbnQiLCJvbiIsImxvYWRldmVudCIsImFkZEV2ZW50IiwiYWRkZXZlbnQiLCJzZXRWaWV3IiwiY2VudGVyIiwiem9vbSIsInRpbGVMYXllciIsIm1hcGJveHN0eWxlIiwiYWRkVG8iLCJjb250cm9sIiwiZnVsbHNjcmVlbiIsIkNvbnRyb2wiLCJGdWxsc2NyZWVuIiwiYWRkQ29udHJvbCIsImF0dHJpYnV0aW9uIiwicG9zaXRpb24iLCJzZXRQcmVmaXgiLCJoYW5kbGVGZWF0dXJlRXZlbnRzIiwibGF5ZXIiLCJldmVudE9wdGlvbnMiLCJvbmVhY2hmZWF0dXJlIiwiY2xpY2siLCJoYW5kbGVMYXllckNsaWNrIiwibGlzdGVuZXIiLCJwb3B1cENvbnRlbnQiLCJmb3JtYXRwb3B1cGNvbnRlbnQiLCJmb3JtYXRQb3B1cENvbnRlbnQiLCJiaW5kUG9wdXAiLCJjb250ZW50IiwicCIsImZpbHRlciIsImpvaW4iLCJsaW5rIiwiaHlwZXJsaW5rIiwiZXh0ZXJuYWxMaW5rQ29udGVudCIsImV4dGVybmFsTGlua1RleHQiLCJ0cmFuc2xhdGFibGVTdHJpbmdzIiwic29ydCIsImEiLCJiIiwidCIsInJlIiwiaXNTcGlkZXJmaWVkIiwiX3ByZVNwaWRlcmZ5TGF0bG5nIiwiX2xheWVycyIsImwiLCJ1bnNwaWRlcmZ5IiwiX19wYXJlbnQiLCJ2YWx1ZXMiLCJfZ3JvdXAiLCJfZmVhdHVyZUdyb3VwIiwiX3NwaWRlcmZpZWQiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsImQiLCJzdHlsZSIsIm9wYWNpdHkiLCJzdHlsZVBvaW50IiwibGF0bG5nIiwiQ3VzdG9tSWNvbiIsIkljb24iLCJleHRlbmQiLCJpY29uU2l6ZSIsImljb25BbmNob3IiLCJpY29uYW5jaG9yIiwicG9pbnRTdHlsZSIsImNvbG9yS2V5V2lkZ2V0MiIsImZvcm1LZXlXaWRnZXQyIiwiZW5jb2RlVVJJIiwiaWNvblVybCIsIm1hcmtlciIsInN0eWxlTm9uUG9pbnQiLCJmb3JtS2V5IiwiZmlsbE9wYWNpdHkiLCJmb3JtS2V5Rm9ybSIsImMiLCJjb2xvcktleUZvcm0iLCJ3ZWlnaHQiLCJsaW5lQ2FwIiwicGF0dGVybk9wdGlvbnMiLCJzcGFjZVdlaWdodCIsInNwYWNlQ29sb3IiLCJzcGFjZU9wYWNpdHkiLCJhbmdsZSIsIlN0cmlwZVBhdHRlcm4iLCJzaGFwZU9wdGlvbnMiLCJ5IiwicmFkaXVzIiwiZmlsbCIsInN0cm9rZSIsImZpbGxDb2xvciIsInNoYXBlIiwiUGF0dGVybkNpcmNsZSIsIndpZHRoIiwiaGVpZ2h0IiwiUGF0dGVybiIsImFkZFNoYXBlIiwiZmlsbFBhdHRlcm4iLCJsaW5lQ29sb3IiLCJsaW5lV2VpZ2h0IiwibGluZU9wYWNpdHkiLCJnZW9tZXRyeSIsImJyaWdodGVuIiwibWFrZUdlb0pzb25PcHRpb25zIiwiZiIsIm9uRWFjaEZlYXR1cmUiLCJiYWNrZ3JvdW5kT3B0aW9ucyIsInBvaW50VG9MYXllciIsIm5vblBvaW50U3R5bGUiLCJmb3JlZ3JvdW5kT3B0aW9ucyIsIm1ha2VMYXllcnMiLCJnZW9Kc29uT3B0aW9ucyIsImNvbGxlY3Rpb25OYW1lIiwiZmVhdHVyZXMiLCJhbGxQb2ludHMiLCJNYXJrZXJDbHVzdGVyR3JvdXAiLCJzaG93Q292ZXJhZ2VPbkhvdmVyIiwiem9vbVRvQm91bmRzT25DbGljayIsIm1heENsdXN0ZXJSYWRpdXMiLCJjbHVzdGVyZGlzdGFuY2UiLCJpY29uQ3JlYXRlRnVuY3Rpb24iLCJjbHVzdGVyIiwiZGl2SWNvbiIsImNsYXNzTmFtZSIsImh0bWwiLCJnZXRDaGlsZENvdW50Iiwib3B0aW9uIiwibG9jYWxlQ29tcGFyZSIsImdlb0pzb24iLCJhZGRMYXllciIsImUiLCJoYW5kbGVDbHVzdGVyQ2xpY2siLCJfbGVhZmxldF9pZCIsInNwaWRlcmZ5IiwiZ2V0QWxsQ2hpbGRNYXJrZXJzIiwibSIsImdldEVsZW1lbnQiLCJtYXBXaWRnZXRzVG9TdGF0ZSIsImFwaWtleSIsInRhYmxlIiwicmVzcCIsImZlYXR1cmVHcm91cHMiLCJib3giLCJ3aWRnZXRDb250ZW50IiwiQ2hvaWNlcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVSZXNldCIsInNlbGVjdHMiLCJjaGVja3MiLCJzZWFyY2giLCJ0b2dnbGUiLCJpbnB1dHMiLCJjb25jYXQiLCJpbml0aWFsaXplZCIsImlucHV0IiwiaGFuZGxlQ2hhbmdlIiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsImZpcmVFdmVudCIsIm1hcF9pZCIsInRyYW5zbGF0YWJsZU5vZGVzIiwiZWwiLCJzZWxlY3Rpb25zIiwicG9zc2libGVDaGVja3MiLCJvIiwibmFtZSIsInBvc3NpYmxlT3B0aW9ucyIsInBvc3NpYmxlUXVlcmllcyIsInF1ZXJ5IiwiYm9vbCIsIndpdGhEaWFjcml0aWNzIiwid2l0aG91dERpYWNyaXRpY3MiLCJsYXRpbmlzZSIsImxheWVycyIsImdyb3VwaW5nIiwibWFrZVdpZGdldHMiLCJqc29ucyIsImJveENvbnRlbnQiLCJsZWdlbmREYXRhIiwicmVmZXJlbmNlIiwicGFyc2VMZWdlbmREYXRhIiwiZm9ybWF0V2lkZ2V0cyIsInRpdGxlIiwibm9kZXMiLCJsYWJlbFRleHQiLCJpdGVtVGV4dCIsIm9mZnNldEhlaWdodCIsImZvbnRTaXplIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsIm9mZnNldCIsInRyYW5zZm9ybSIsIndpZGdldE5vZGVzIiwiZHJvcGRvd25PcHRpb25zIiwiaW5zdHJ1Y3Rpb25zIiwibGVnZW5kSXRlbXMiLCJzZWxlY3RlZCIsIndpZGdldFRpdGxlIiwibWFrZURvY3VtZW50Tm9kZXMiLCJuZXdTZWN0aW9uSFRNTCIsImxvZ28iLCJkZXNjcmlwdGlvbiIsInRpdGxlY2FyZGNvbnRlbnQiLCJib2R5IiwibmV3RGlhbG9nSFRNTCIsInRpdGxlY2FyZHRpdGxlIiwib3ZlcmZsb3ciLCJkaWFsb2dFbCIsImdldEVsZW1lbnRCeUlkIiwibWFpbkVsIiwiZGlhbG9nVHJpZ2dlciIsImRpYWxvZ0JveCIsIkExMXlEaWFsb2ciLCJkaWFsb2ciLCJzaG93IiwiZGlzcGxheSIsInByb2dyYW0iLCJtZXRhTG9jYWxlT0ciLCJzZXRBdHRyaWJ1dGUiLCJtZXRhVHlwZU9HIiwibWV0YVdpZHRoT0ciLCJtZXRhSGVpZ2h0T0ciLCJtZXRhVHdpdHRlckNhcmRPRyIsIm1ldGFUaXRsZU9HIiwibWV0YVRpdGxlVHdpdHRlciIsIm1ldGFEZXNjcmlwdGlvbk9HIiwibWV0YURlc2NyaXB0aW9uVHdpdHRlciIsIm1ldGFJbWFnZU9HIiwic2NyZWVuc2hvdCIsIm1ldGFJbWFnZVR3aXR0ZXIiLCJpbm5lclRleHQiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJ3ZWJzaXRlIiwibWV0YURhdGEiLCJwYXJzZU1ldGFEYXRhIiwicGFyc2VXaWRnZXREYXRhIiwidHdvRF9wcm9wZXJpdGVzIiwibWFwSUQiLCJyZWZlcmVuY2VTaGVldHMiLCJyZWZlcmVuY2VTaGVldFVSTFMiLCJ1IiwicmVzcG9uc2VzIiwiZm9vdGVyIiwiZm9vdGVyTm9kZSIsInBlblVsdGltYXRlTm9kZSIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJuZXh0U2libGluZyIsImxhbmd1YWdlRGF0YSIsInJvdyIsImNvbHVtbiIsImNvbHVtbk5hbWUiLCJj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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQyxjQUFjO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxrQkFBa0I7QUFDbkQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsS0FBMEIsb0JBQW9CLFNBQUU7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ3J0QkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQSxjQUFjLG1CQUFPLENBQUMsdURBQVE7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixzQkFBc0I7QUFDdkM7O0FBRUE7QUFDQSxtQkFBbUIsMkJBQTJCOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLG1CQUFtQjtBQUNuQztBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLDJCQUEyQjtBQUM1QztBQUNBOztBQUVBLFFBQVEsdUJBQXVCO0FBQy9CO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUEsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQsa0RBQWtELHNCQUFzQjtBQUN4RTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBLEtBQUssS0FBd0MsRUFBRSxFQUU3Qzs7QUFFRixRQUFRLHNCQUFpQjtBQUN6Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7O0FBRUEsNkJBQTZCLG1CQUFtQjs7QUFFaEQ7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDOVlBO0FBQ0E7QUFD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QyxDQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLE9BQU96QixNQUFNLENBQUMrQyxXQUFkLEtBQThCLFVBQWxDLEVBQThDO0FBQUEsTUFDbkNBLFdBRG1DLEdB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QUFFO0FBQzVDLEMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB3aW5kb3dbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0d2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gd2VicGFja0hvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcbiBcdFx0aWYgKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XG4gXHR9IDtcblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xuIFx0XHRpZiAobnVsbCkgc2NyaXB0LmNyb3NzT3JpZ2luID0gbnVsbDtcbiBcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QocmVxdWVzdFRpbWVvdXQpIHtcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpIHtcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcbiBcdFx0XHR9XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcbiBcdFx0XHRcdGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XG4gXHRcdFx0XHRcdHJlamVjdChcbiBcdFx0XHRcdFx0XHRuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpXG4gXHRcdFx0XHRcdCk7XG4gXHRcdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XG4gXHRcdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjViMmJhOTM2NmQ0YjE4YmMyZGEwXCI7XG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTtcblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRpZiAoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xuIFx0XHRcdGlmIChtZS5ob3QuYWN0aXZlKSB7XG4gXHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xuIFx0XHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpID09PSAtMSkge1xuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgK1xuIFx0XHRcdFx0XHRcdHJlcXVlc3QgK1xuIFx0XHRcdFx0XHRcdFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdCk7XG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcbiBcdFx0fTtcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xuIFx0XHRcdFx0fSxcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH07XG4gXHRcdH07XG4gXHRcdGZvciAodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJlXCIgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwidFwiXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicmVhZHlcIikgaG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcbiBcdFx0XHRcdHRocm93IGVycjtcbiBcdFx0XHR9KTtcblxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcbiBcdFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XG4gXHRcdFx0XHRcdGlmICghaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9O1xuIFx0XHRmbi50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0XHRpZiAobW9kZSAmIDEpIHZhbHVlID0gZm4odmFsdWUpO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLnQodmFsdWUsIG1vZGUgJiB+MSk7XG4gXHRcdH07XG4gXHRcdHJldHVybiBmbjtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIGhvdCA9IHtcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxuXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcbiBcdFx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0XHRlbHNlIGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0fSxcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcbiBcdFx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGlmICghbCkgcmV0dXJuIGhvdFN0YXR1cztcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cbiBcdFx0fTtcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xuIFx0XHRyZXR1cm4gaG90O1xuIFx0fVxuXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcblxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XG4gXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xuIFx0fVxuXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdERlZmVycmVkO1xuXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcbiBcdFx0dmFyIGlzTnVtYmVyID0gK2lkICsgXCJcIiA9PT0gaWQ7XG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcImlkbGVcIikge1xuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuIFx0XHR9XG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xuIFx0XHRcdGlmICghdXBkYXRlKSB7XG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRcdFx0cmV0dXJuIG51bGw7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XG5cbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0aG90VXBkYXRlID0ge307XG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xuIFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdHtcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJlxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJlxuIFx0XHRcdFx0aG90V2FpdGluZ0ZpbGVzID09PSAwXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcbiBcdFx0XHRyZXR1cm47XG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XG4gXHRcdGZvciAodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZiAoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xuIFx0XHRpZiAoIWRlZmVycmVkKSByZXR1cm47XG4gXHRcdGlmIChob3RBcHBseU9uVXBkYXRlKSB7XG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKClcbiBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XG4gXHRcdFx0XHR9KVxuIFx0XHRcdFx0LnRoZW4oXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiBcdFx0XHRcdFx0fSxcbiBcdFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdCk7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwicmVhZHlcIilcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gXHRcdHZhciBjYjtcbiBcdFx0dmFyIGk7XG4gXHRcdHZhciBqO1xuIFx0XHR2YXIgbW9kdWxlO1xuIFx0XHR2YXIgbW9kdWxlSWQ7XG5cbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLm1hcChmdW5jdGlvbihpZCkge1xuIFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXG4gXHRcdFx0XHRcdGlkOiBpZFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9tYWluKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRpZiAoIXBhcmVudCkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHRcdH07XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuXG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXG4gXHRcdFx0fTtcbiBcdFx0fVxuXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcbiBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcbiBcdFx0XHRcdGlmIChhLmluZGV4T2YoaXRlbSkgPT09IC0xKSBhLnB1c2goaXRlbSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xuXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XG4gXHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCJcbiBcdFx0XHQpO1xuIFx0XHR9O1xuXG4gXHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XG4gXHRcdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRcdFx0aWYgKGhvdFVwZGF0ZVtpZF0pIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG4gXHRcdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGRlZmF1bHQ6XG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9BcHBseSkge1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0XHRcdFx0aWYgKFxuIFx0XHRcdFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHRcdFx0XHQpXG4gXHRcdFx0XHRcdFx0KSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJlxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQgJiZcbiBcdFx0XHRcdC8vIHJlbW92ZWQgc2VsZi1hY2NlcHRlZCBtb2R1bGVzIHNob3VsZCBub3QgYmUgcmVxdWlyZWRcbiBcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdICE9PSB3YXJuVW5leHBlY3RlZFJlcXVpcmVcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxuIFx0XHRcdFx0fSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHR9KTtcblxuIFx0XHR2YXIgaWR4O1xuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcbiBcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuIFx0XHRcdHZhciBkYXRhID0ge307XG5cbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xuIFx0XHRcdFx0Y2IoZGF0YSk7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XG5cbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XG5cbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuIFx0XHRcdFx0aWYgKCFjaGlsZCkgY29udGludWU7XG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cbiBcdFx0dmFyIGRlcGVuZGVuY3k7XG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcbiBcdFx0XHRcdFx0XHRpZiAoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImFwcGx5XCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxuIFx0XHRmb3IgKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcbiBcdFx0XHRcdFx0XHRpZiAoY2IpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MuaW5kZXhPZihjYikgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xuIFx0XHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG4gXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuIFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyMjtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuIFx0XHRpZiAoZXJyb3IpIHtcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gXHRcdH1cblxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoXCIuL3NyYy9pbmRleC5qc1wiKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG59XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0VGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCwgcGFyZW50KSB7XG4gIGlmIChwYXJlbnQpe1xuICAgIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICB9XG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG59O1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBwYXNzaW5nIGZ1bmN0aW9uIGluIG9wdGlvbnMsIHRoZW4gdXNlIGl0IGZvciByZXNvbHZlIFwiaGVhZFwiIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgLy8gVXNlZnVsIGZvciBTaGFkb3cgUm9vdCBzdHlsZSBpLmVcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICBpbnNlcnRJbnRvOiBmdW5jdGlvbiAoKSB7IHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Zvb1wiKS5zaGFkb3dSb290IH1cbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHZhciBzdHlsZVRhcmdldCA9IGdldFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCwgcGFyZW50KTtcblx0XHRcdC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cdFx0XHRpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcblx0XHRcdFx0XHQvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG5cdFx0fVxuXHRcdHJldHVybiBtZW1vW3RhcmdldF1cblx0fTtcbn0pKCk7XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyXHRzaW5nbGV0b25Db3VudGVyID0gMDtcbnZhclx0c3R5bGVzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXJcdGZpeFVybHMgPSByZXF1aXJlKFwiLi91cmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYgKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAoIW9wdGlvbnMuc2luZ2xldG9uICYmIHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiAhPT0gXCJib29sZWFuXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG4gICAgICAgIGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJvYmplY3RcIiAmJiBvcHRpb25zLmluc2VydEF0LmJlZm9yZSkge1xuXHRcdHZhciBuZXh0U2libGluZyA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUsIHRhcmdldCk7XG5cdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbmV4dFNpYmxpbmcpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIltTdHlsZSBMb2FkZXJdXFxuXFxuIEludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnICgnb3B0aW9ucy5pbnNlcnRBdCcpIGZvdW5kLlxcbiBNdXN0IGJlICd0b3AnLCAnYm90dG9tJywgb3IgT2JqZWN0LlxcbiAoaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIjaW5zZXJ0YXQpXFxuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudCAoc3R5bGUpIHtcblx0aWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0c3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG5cblx0dmFyIGlkeCA9IHN0eWxlc0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZSk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG5cdGlmKG9wdGlvbnMuYXR0cnMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHR9XG5cblx0aWYob3B0aW9ucy5hdHRycy5ub25jZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFyIG5vbmNlID0gZ2V0Tm9uY2UoKTtcblx0XHRpZiAobm9uY2UpIHtcblx0XHRcdG9wdGlvbnMuYXR0cnMubm9uY2UgPSBub25jZTtcblx0XHR9XG5cdH1cblxuXHRhZGRBdHRycyhzdHlsZSwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZSk7XG5cblx0cmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdGlmKG9wdGlvbnMuYXR0cnMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHR9XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YWRkQXR0cnMobGluaywgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rKTtcblxuXHRyZXR1cm4gbGluaztcbn1cblxuZnVuY3Rpb24gYWRkQXR0cnMgKGVsLCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBnZXROb25jZSgpIHtcblx0aWYgKHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJldHVybiBfX3dlYnBhY2tfbm9uY2VfXztcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSB0eXBlb2Ygb3B0aW9ucy50cmFuc2Zvcm0gPT09ICdmdW5jdGlvbidcblx0XHQgPyBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKSBcblx0XHQgOiBvcHRpb25zLnRyYW5zZm9ybS5kZWZhdWx0KG9iai5jc3MpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXG5cdFx0c3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuXG5cdH0gZWxzZSBpZiAoXG5cdFx0b2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCJcblx0KSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cblx0XHRcdGlmKHN0eWxlLmhyZWYpIFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGUuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZSA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqKSB7XG5cdFx0aWYgKG5ld09iaikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG5cdFx0XHRcdG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmXG5cdFx0XHRcdG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXBcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyAoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnIChzdHlsZSwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayAobGluaywgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKlxuXHRcdElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRcdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdFx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdFx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKSB7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmsuaHJlZjtcblxuXHRsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYykgVVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuIiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC98XFxzKiQpL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG4iLCJpbXBvcnQgeyBwYXJzZUxhbmd1YWdlRGF0YSB9IGZyb20gJy4vcGFyc2Vycy5qcydcblxudmFyIHVybCA9XG4gIHdpbmRvdy5sb2NhdGlvbiAhPSB3aW5kb3cucGFyZW50LmxvY2F0aW9uXG4gICAgPyBkb2N1bWVudC5yZWZlcnJlclxuICAgIDogZG9jdW1lbnQubG9jYXRpb24uaHJlZlxudmFyIGhyZWYgPSAvbGFuZz0oW14mXSspLy5leGVjKHVybClcbndpbmRvdy5sYW5nID0gaHJlZiA/IGhyZWZbMV0gOiBudWxsXG5cbnZhciBsZWFmbGV0TG9hZGVkID0gMFxuXG52YXIgcHJpbWFyeUpzRmlsZXMgPSBbXG4gICdodHRwczovL3VucGtnLmNvbS9sZWFmbGV0QDEuMy4xL2Rpc3QvbGVhZmxldC5qcycsXG4gICdodHRwczovL3VucGtnLmNvbS93aGF0d2ctZmV0Y2hAMy4wLjAvZGlzdC9mZXRjaC51bWQuanMnXG5dXG5cbnZhciBzZWNvbmRhcnlKc0ZpbGVzID0gW1xuICAnaHR0cHM6Ly91bnBrZy5jb20vbGVhZmxldC56b29tc2xpZGVyQDAuNy4xL3NyYy9MLkNvbnRyb2wuWm9vbXNsaWRlci5qcycsXG4gICdodHRwczovL3VucGtnLmNvbS9sZWFmbGV0LWZ1bGxzY3JlZW5AMS4wLjIvZGlzdC9MZWFmbGV0LmZ1bGxzY3JlZW4ubWluLmpzJyxcbiAgJ2h0dHBzOi8vdW5wa2cuY29tL2Nocm9tYS1qc0AyLjAuMy9jaHJvbWEubWluLmpzJyxcbiAgJ2h0dHBzOi8vY3Npcy1pbGFiLmdpdGh1Yi5pby9tYXAtdGVtcGxhdGVzL2Rpc3QvanMvdmVuZG9yL0ExMXktRGlhbG9nLmpzJyxcbiAgJ2h0dHBzOi8vdW5wa2cuY29tL2Nob2ljZXMuanNANy4wLjAvcHVibGljL2Fzc2V0cy9zY3JpcHRzL2Nob2ljZXMubWluLmpzJyxcbiAgJ2h0dHBzOi8vdW5wa2cuY29tL2xlYWZsZXQubWFya2VyY2x1c3RlckAxLjQuMS9kaXN0L2xlYWZsZXQubWFya2VyY2x1c3Rlci5qcycsXG4gICdodHRwczovL2NzaXMtaWxhYi5naXRodWIuaW8vbWFwLXRlbXBsYXRlcy9kaXN0L2pzL3ZlbmRvci9wYXR0ZXJucy5qcycsXG4gICdodHRwczovL2NzaXMtaWxhYi5naXRodWIuaW8vbWFwLXRlbXBsYXRlcy9kaXN0L2pzL3ZlbmRvci9sYXRpbml6ZS5qcydcbl1cblxuZnVuY3Rpb24gaGFuZGxlTG9hZExlYWZsZXQoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBzZWNvbmRhcnlKc0ZpbGVzLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkXG4gICAgICB2YXIganNMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgIGpzTGluay5zcmMgPSBmaWxlXG4gICAgICBoZWFkLmFwcGVuZENoaWxkKGpzTGluaylcblxuICAgICAganNMaW5rLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZWFmbGV0TG9hZGVkKytcblxuICAgICAgICBpZiAobGVhZmxldExvYWRlZCA9PT0gc2Vjb25kYXJ5SnNGaWxlcy5sZW5ndGggKyBwcmltYXJ5SnNGaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICByZXNvbHZlKGxlYWZsZXRMb2FkZWQpXG4gICAgICAgICAgcmV0dXJuIGxlYWZsZXRMb2FkZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGltcG9ydEZpbGVzKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcHJpbWFyeUpzRmlsZXMuZm9yRWFjaChmdW5jdGlvbihmaWxlKSB7XG4gICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWRcbiAgICAgIHZhciBqc0xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAganNMaW5rLnNyYyA9IGZpbGVcbiAgICAgIGpzTGluay5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGVhZmxldExvYWRlZCsrXG5cbiAgICAgICAgaWYgKGxlYWZsZXRMb2FkZWQgPT09IHByaW1hcnlKc0ZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgIGhhbmRsZUxvYWRMZWFmbGV0KClcbiAgICAgICAgICByZXNvbHZlKGxlYWZsZXRMb2FkZWQpXG4gICAgICAgICAgcmV0dXJuIGxlYWZsZXRMb2FkZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaGVhZC5hcHBlbmRDaGlsZChqc0xpbmspXG4gICAgfSlcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VNYXAob3B0aW9ucykge1xuICBpZiAoIWxlYWZsZXRMb2FkZWQpIHtcbiAgICByZXR1cm4gYXdhaXQgaW1wb3J0RmlsZXMoKS50aGVuKGFzeW5jIGZ1bmN0aW9uKHNjcmlwdHNMb2FkZWQpIHtcbiAgICAgIHJldHVybiBhd2FpdCBpbml0KG9wdGlvbnMpXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYXdhaXQgaW5pdChvcHRpb25zKVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXQob3B0aW9ucykge1xuICB2YXIgZGF0YVVSTCA9ICdodHRwczovL3NwcmVhZHNoZWV0cy5nb29nbGUuY29tL2ZlZWRzL2xpc3QvJ1xuICB3aW5kb3cuZGVmYXVsdENvbG9yID1cbiAgICBvcHRpb25zLm9jZWFuY29sb3IgfHwgb3B0aW9ucy5vY2VhbkNvbG9yIHx8IG9wdGlvbnNbJ29jZWFuIGNvbG9yJ11cbiAgdmFyIHRyYW5zbGF0aW9uc1xuXG4gIGlmIChsYW5nKSB7XG4gICAgZmV0Y2goZGF0YVVSTCArIG9wdGlvbnMuZ29vZ2xlU2hlZXQgKyAnLycgKyAzICsgJy9wdWJsaWMvdmFsdWVzP2FsdD1qc29uJylcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICAgIH0pXG4gICAgICAudGhlbihhc3luYyBmdW5jdGlvbihqc29uKSB7XG4gICAgICAgIHRyYW5zbGF0aW9ucyA9IHBhcnNlTGFuZ3VhZ2VEYXRhKGpzb24uZmVlZC5lbnRyeSlcblxuICAgICAgICBjb25zdCBpbml0V2l0aFNwcmVhZHNoZWV0ID0gcmVxdWlyZSgnLi9pbml0V2l0aFNwcmVhZHNoZWV0LmpzJykuZGVmYXVsdFxuICAgICAgICByZXR1cm4gYXdhaXQgaW5pdFdpdGhTcHJlYWRzaGVldChkYXRhVVJMLCBvcHRpb25zLCB0cmFuc2xhdGlvbnMpXG4gICAgICB9KVxuICB9IGVsc2UgaWYgKG9wdGlvbnMuZ29vZ2xlU2hlZXQpIHtcbiAgICBjb25zdCBpbml0V2l0aFNwcmVhZHNoZWV0ID0gcmVxdWlyZSgnLi9pbml0V2l0aFNwcmVhZHNoZWV0LmpzJykuZGVmYXVsdFxuICAgIHJldHVybiBhd2FpdCBpbml0V2l0aFNwcmVhZHNoZWV0KGRhdGFVUkwsIG9wdGlvbnMpXG4gIH0gZWxzZSB7XG4gICAgY29uc3QgaW5pdFdpdGhvdXRTcHJlYWRzaGVldCA9IHJlcXVpcmUoJy4vaW5pdFdpdGhTcHJlYWRzaGVldC5qcycpLmRlZmF1bHRcbiAgICByZXR1cm4gYXdhaXQgaW5pdFdpdGhvdXRTcHJlYWRzaGVldChvcHRpb25zKVxuICB9XG59XG4iLCJpbXBvcnQgJy4vc2Nzcy9tYWluLnNjc3MnXG5pbXBvcnQgJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZSdcbmltcG9ydCB7IG1ha2VNYXAgfSBmcm9tICcuL2pzL21ha2VNYXAnXG5pbXBvcnQgeyBleHRlcm5hbExpbmsgfSBmcm9tICcuL2pzL2hlbHBlcnMuanMnXG53aW5kb3cuZXh0ZXJuYWxMaW5rID0gZXh0ZXJuYWxMaW5rXG53aW5kb3cubWFrZU1hcCA9IG1ha2VNYXBcbi8vIDsoYXN5bmMgZnVuY3Rpb24oKSB7XG4vLyAgIHZhciBtYXAgPSBhd2FpdCBtYWtlTWFwKHtcbi8vICAgICBnb29nbGVTaGVldDogJzFSOUozaGFHTERzUlBodFQxUDFKdlFMX1h6YVBaWnNhMzN2QkZPNnhzNmc0Jyxcbi8vICAgICBtYXBJRDogJ2NoaW5hcG93ZXInLFxuLy8gICAgIG1hcGJveFN0eWxlOlxuLy8gICAgICAgbGFuZyAmJiBsYW5nLmluZGV4T2YoJ3poLScpID4gLTFcbi8vICAgICAgICAgPyAnY2l0dWkzd2F3MDAxNjJqbzF6Y3NmMXVyaidcbi8vICAgICAgICAgOiAnY2o4NHM5YmV0MTBmNTJybzJscm5hNTB5ZycsXG4vLyAgICAgb25FYWNoRmVhdHVyZToge1xuLy8gICAgICAgbW91c2VvdmVyOiBmdW5jdGlvbihlKSB7XG4vLyAgICAgICAgIHZhciBsYXllciA9IHRoaXMuX21hcC5fbGF5ZXJzW3RoaXMuX2xlYWZsZXRfaWRdXG4vL1xuLy8gICAgICAgICB0aGlzLm9wZW5Qb3B1cChlLmxhdGxuZylcbi8vXG4vLyAgICAgICAgIHdpbmRvdy5oYW5kbGVMYXllckNsaWNrKHRoaXMuZmVhdHVyZSwgbGF5ZXIsIHRoaXMuX21hcClcbi8vICAgICAgIH0sXG4vLyAgICAgICBtb3VzZW91dDogZnVuY3Rpb24oZSkge1xuLy8gICAgICAgICB0aGlzLmNsb3NlUG9wdXAoKVxuLy8gICAgICAgfVxuLy8gICAgIH0sXG4vLyAgICAgZm9ybWF0UG9wdXBDb250ZW50OiBmdW5jdGlvbihmZWF0dXJlLCBtYXApIHtcbi8vICAgICAgIHZhciBwcmVmaXggPSBsYW5nID8gJ18nICsgbGFuZyA6ICcnXG4vL1xuLy8gICAgICAgdmFyIG5hbWUgPSBmZWF0dXJlLnByb3BlcnRpZXNbJ25hbWUnICsgcHJlZml4XVxuLy9cbi8vICAgICAgIC8vIHZhciBkZXNjcmlwdGlvbiA9IGZlYXR1cmUucHJvcGVydGllc1snZGVzY3JpcHRpb24nICsgcHJlZml4XVxuLy8gICAgICAgLy8gICAucmVwbGFjZSgvPGEgaHJlZj0vZ2ksICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPScpXG4vLyAgICAgICAvLyAgIC5yZXBsYWNlKC88XFwvYT4vZ2ksIGV4dGVybmFsTGluayArICc8L2E+Jylcbi8vXG4vLyAgICAgICB2YXIgb3V0cG9zdCA9IGZlYXR1cmUucHJvcGVydGllcy5jaGluZXNlX291dHBvc3RzXG4vLyAgICAgICByZXR1cm4gKFxuLy8gICAgICAgICAnPGRpdiBjbGFzcz1cInBvcHVwRW50cnlTdHlsZVwiPicgK1xuLy8gICAgICAgICBvdXRwb3N0ICtcbi8vICAgICAgICAgKG5hbWUgJiYgb3V0cG9zdCA/ICc8YnIvPicgOiAnJykgK1xuLy8gICAgICAgICAobmFtZSAhPT0gb3V0cG9zdCA/IG5hbWUgOiAnJykgK1xuLy8gICAgICAgICAoZmVhdHVyZS5wcm9wZXJ0aWVzLm9ic2VydmVkXG4vLyAgICAgICAgICAgPyAnPGJyLz4oZXhwZWN0ZWQpJ1xuLy8gICAgICAgICAgIDogZmVhdHVyZS5wcm9wZXJ0aWVzLm9ic2VydmVkID09PSBmYWxzZVxuLy8gICAgICAgICAgICAgPyAnPGJyIC8+KG9ic2VydmVkKSdcbi8vICAgICAgICAgICAgIDogJycpICtcbi8vICAgICAgICAgJzwvZGl2PicgK1xuLy8gICAgICAgICAnPGRpdiBjbGFzcz1cInBvcHVwRW50cnlTdHlsZVwiPicgK1xuLy8gICAgICAgICAnZGVzY3JpcHRpb24nICtcbi8vICAgICAgICAgJzwvZGl2Pidcbi8vICAgICAgIClcbi8vICAgICB9XG4vLyAgIH0pXG4vLyB9KSgpXG5cbi8vIHZhciBtYXBzID0gW1xuLy8gICAvLyB7XG4vLyAgIC8vICAgaWQ6ICdjbGFpbXMtbWFwJyxcbi8vICAgLy8gICBzaGVldDogJzE0TXZ1Y01hYy1sWUN1MC0ydkQ1dGN4ZkNVcUlKb2cyaDQtUkVGa3BIM0t3Jyxcbi8vICAgLy8gICAncG9wdXAgaGVhZGVycyc6IFtcbi8vICAgLy8gICAgIHdpbmRvdy5sYW5nID8gJ25hbWVfJyArIHdpbmRvdy5sYW5nIDogJ25hbWUnLFxuLy8gICAvLyAgICAgd2luZG93LmxhbmcgPyAnZGVzY3JpcHRpb25fJyArIHdpbmRvdy5sYW5nIDogJ2Rlc2NyaXB0aW9uJyxcbi8vICAgLy8gICAgICdsaW5rJ1xuLy8gICAvLyAgIF1cbi8vICAgLy8gfVxuLy8gICAvLyAsXG4vLyAgIHtcbi8vICAgICBpZDogJ3ZlbmV6dWVsYScsXG4vLyAgICAgc2hlZXQ6ICcxM3R2b3hjN2tCOEJ6U0tPNjdjNmtmOTQ5a3F0ZV9vLVdGRjVXMjFoNU85OCdcbi8vICAgfSxcbi8vICAge1xuLy8gICAgIGlkOiAnZmVhdHVyZXMtbWFwJyxcbi8vICAgICBzaGVldDogJzFSRUZOSjhXWjlmT3pTaFlDOFNwVUo3cFpRRU1rV2xxekMyS3BNYi13U3ljJ1xuLy8gICB9LFxuLy8gICB7XG4vLyAgICAgaWQ6ICdyZXNvdXJjZXMtbWFwJyxcbi8vICAgICBzaGVldDogJzExclVhb0lTU2txYWtFS1o2aGk0eGVWYmJpRW5mUGkxcXNSb3E0cjBTclBBJyxcbi8vICAgICAncG9wdXAgaGVhZGVycyc6IFtcbi8vICAgICAgIGxhbmcgPyAnbmFtZV8nICsgbGFuZyA6ICduYW1lJyxcbi8vICAgICAgIGxhbmcgPyAnZGVzY3JpcHRpb25fJyArIGxhbmcgOiAnZGVzY3JpcHRpb24nLFxuLy8gICAgICAgJ2xpbmsnXG4vLyAgICAgXVxuLy8gICB9LFxuLy8gICB7XG4vLyAgICAgaWQ6ICdhZWdpcycsXG4vLyAgICAgc2hlZXQ6ICcxNW9KU21rMEtXM181RDhVajFlU2l6LWUtUHBXNTFlOU4tWFNnTElRdFpJaydcbi8vICAgfSxcbi8vICAge1xuLy8gICAgIGlkOiAnd2JpLXRlcnJvcmlzbScsXG4vLyAgICAgc2hlZXQ6ICcxZDRFZTY1S1RfUzQ2eDBtazYyc1Y2Q1lEcE1aNDBjMm9ZSjZCUXM5YV8xMCdcbi8vICAgfVxuLy8gXVxuLy9cbi8vIG1hcHMucmV2ZXJzZSgpLmZvckVhY2goKG1hcCwgaSkgPT4ge1xuLy8gICB2YXIgbWFwYm94U3R5bGUgPVxuLy8gICAgIGxhbmcgJiYgbGFuZy5pbmRleE9mKCd6aC0nKSA+IC0xXG4vLyAgICAgICA/IChtYXBib3hTdHlsZSA9ICdjaXR1aTN3YXcwMDE2MmpvMXpjc2YxdXJqJylcbi8vICAgICAgIDogKG1hcGJveFN0eWxlID0gJ2NqODRzOWJldDEwZjUycm8ybHJuYTUweWcnKVxuLy9cbi8vICAgc2V0VGltZW91dCgoKSA9PiB7XG4vLyAgICAgY29uc29sZS5sb2coJ2Fub3RoZXIgb25lJylcbi8vICAgICBtYWtlTWFwKHtcbi8vICAgICAgIG1hcElEOiBtYXAuaWQsXG4vLyAgICAgICBleHRlcm5hbExpbmtUZXh0OiAneW8sIGNsaWNrIGhlcmUnLFxuLy8gICAgICAgZ29vZ2xlU2hlZXQ6IG1hcC5zaGVldCxcbi8vICAgICAgIGZ1bGxTY3JlZW46IHRydWUsXG4vLyAgICAgICAnbWFwYm94IHN0eWxlJzpcbi8vICAgICAgICAgbWFwLmlkID09PSAnYWVnaXMnXG4vLyAgICAgICAgICAgPyAnY2pvaXY2ZG1vMjlraDJyc2QyejVxZGEycCdcbi8vICAgICAgICAgICA6IG1hcC5pZCA9PT0gJ3ZlbmV6dWVsYScgfHwgbWFwLmlkID09PSAnd2JpLXRlcnJvcmlzbSdcbi8vICAgICAgICAgICAgID8gJ2NqcmF3YzF6czJiemMyc3EzeTl3dnQyMnQnXG4vLyAgICAgICAgICAgICA6IG1hcGJveFN0eWxlLFxuLy8gICAgICAgJ29jZWFuIGNvbG9yJzogJyNjYWQyZDMnLFxuLy8gICAgICAgJ3BvcHVwIGhlYWRlcnMnOiBtYXBbJ3BvcHVwIGhlYWRlcnMnXSwgLy8gQXJyYXlcbi8vICAgICAgIC8vIFwicG9wdXAgY29udGVudFwiOiBbXSxcbi8vICAgICAgIC8vIHBvaW50U3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUsbGF0bG5nKXt9LFxuLy8gICAgICAgLy8gbm9uUG9pbnRTdHlsZTogZnVuY3Rpb24oZmVhdHVyZSl7fSxcbi8vICAgICAgIC8vIG9uRWFjaEZlYXR1cmU6IHtcbi8vICAgICAgIC8vIGNsaWNrOiBmdW5jdGlvbihmZWF0dXJlLCBsYXllcil7fVxuLy8gICAgICAgLy8gZGJjbGljazogZnVuY3Rpb24oZmVhdHVyZSwgbGF5ZXIsIG1hcCl7fSxcbi8vICAgICAgIC8vIG1vdXNlZG93bjogZnVuY3Rpb24oZmVhdHVyZSwgbGF5ZXIsIG1hcCl7fSxcbi8vICAgICAgIC8vIG1vdXNlZW50ZXI6IGZ1bmN0aW9uKGZlYXR1cmUsIGxheWVyLCBtYXApe30sXG4vLyAgICAgICAvLyBtb3VzZW91dDogZnVuY3Rpb24oZmVhdHVyZSwgbGF5ZXIsIG1hcCl7fVxuLy8gICAgICAgLy8gfSxcbi8vICAgICAgIGZvcm1hdFBvcHVwQ29udGVudDpcbi8vICAgICAgICAgbWFwLmlkID09PSAnYWVnaXMnXG4vLyAgICAgICAgICAgPyBmdW5jdGlvbihmZWF0dXJlLCBtYXApIHtcbi8vICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cInBvcHVwVGl0bGVTdHlsZVwiPiR7XG4vLyAgICAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllcy5uYW1lXG4vLyAgICAgICAgICAgICB9PC9kaXY+XG4vL1xuLy8gICAgICAgICAke1xuLy8gICBmZWF0dXJlLnByb3BlcnRpZXMudG90YWxfZ3VpZGVkX21pc3NpbGVfY3J1aXNlcnNcbi8vICAgICA/IGA8ZGl2IGNsYXNzPVwicG9wdXBIZWFkZXJTdHlsZVwiPkd1aWRlZCBNaXNzaWxlIENydWlzZXJzOiAke1xuLy8gICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzLnRvdGFsX2d1aWRlZF9taXNzaWxlX2NydWlzZXJzXG4vLyAgICAgfTwvZGl2PlxuLy8gICAgICAgICA8ZGl2PjxzcGFuIGNsYXNzPSdwb3B1cEVudHJ5U3R5bGUnPkJNRC1DYXBhYmxlOjwvc3Bhbj5cbi8vICAgICAgICAgPHNwYW4gY2xhc3M9J3BvcHVwRW50cnlTdHlsZSc+JHtcbi8vICAgZmVhdHVyZS5wcm9wZXJ0aWVzLmJtZF9jYXBhYmxlX2dtY1xuLy8gfTwvc3Bhbj48L2Rpdj5gXG4vLyAgICAgOiAnJ1xuLy8gfVxuLy8gICAgICR7XG4vLyAgIGZlYXR1cmUucHJvcGVydGllcy50b3RhbF9ndWlkZWRfbWlzc2lsZV9kZXN0cm95ZXJzXG4vLyAgICAgPyBgPGRpdiBjbGFzcz1cInBvcHVwSGVhZGVyU3R5bGVcIj5HdWlkZWQgTWlzc2lsZSBEZXN0cm95ZXJzOiAke1xuLy8gICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzLnRvdGFsX2d1aWRlZF9taXNzaWxlX2Rlc3Ryb3llcnNcbi8vICAgICB9PC9kaXY+XG4vLyAgICAgPGRpdj48c3BhbiBjbGFzcz0ncG9wdXBFbnRyeVN0eWxlJz5CTUQtQ2FwYWJsZTo8L3NwYW4+XG4vLyAgICAgPHNwYW4gY2xhc3M9J3BvcHVwRW50cnlTdHlsZSc+JHtcbi8vICAgZmVhdHVyZS5wcm9wZXJ0aWVzLnRvdGFsX2d1aWRlZF9taXNzaWxlX2Rlc3Ryb3llcnNcbi8vIH08L3NwYW4+PC9kaXY+YFxuLy8gICAgIDogJydcbi8vIH1gXG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICAgIDogbWFwLmlkID09PSAndmVuZXp1ZWxhJ1xuLy8gICAgICAgICAgICAgPyBmdW5jdGlvbihmZWF0dXJlLCBtYXApIHtcbi8vICAgICAgICAgICAgICAgcmV0dXJuIChcbi8vICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBvcHVwSGVhZGVyU3R5bGVcIj4nICtcbi8vICAgICAgICAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllcy5jb3VudHJ5ICtcbi8vICAgICAgICAgICAgICAgICAgICc8L2Rpdj48ZGl2IGNsYXNzPVwicG9wdXBFbnRyeVN0eWxlXCI+JyArXG4vLyAgICAgICAgICAgICAgICAgICAoZmVhdHVyZS5wcm9wZXJ0aWVzLnJlY29nbml0aW9uLnRvTG93ZXJDYXNlKCkgPT09ICd5J1xuLy8gICAgICAgICAgICAgICAgICAgICA/IGZlYXR1cmUucHJvcGVydGllcy5jb3VudHJ5ICtcbi8vICAgICAgICAgICAgICAgICAgICAgICAnIHJlY29nbml6ZXMgSnVhbiBHdWFpZFxceEYzIGFzIFByZXNpZGVudCBvZiBWZW5lenVlbGEnXG4vLyAgICAgICAgICAgICAgICAgICAgIDogZmVhdHVyZS5wcm9wZXJ0aWVzLmNvdW50cnkgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgICcgcmVjb2duaXplcyBOaWNvbFxceEUxcyBNYWR1cm8gYXMgUHJlc2lkZW50IG9mIFZlbmV6dWVsYTwvZGl2PicpICtcbi8vICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4vLyAgICAgICAgICAgICAgIClcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIDogbnVsbFxuLy8gICAgIH0pXG4vLyAgIH0sIDIwMDAgKiBpKVxuLy8gfSlcblxuaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWQgfVxuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKVxuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbClcbiAgICByZXR1cm4gZXZ0XG4gIH1cblxuICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlXG5cbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnRcbn1cblxuQXJyYXkucHJvdG90eXBlLmdyb3VwQnkgPSBmdW5jdGlvbihwcm9wZXJ0eTEsIHByb3BlcnR5Mikge1xuICByZXR1cm4gcHJvcGVydHkyXG4gICAgPyB0aGlzLnJlZHVjZShmdW5jdGlvbihncm91cHMsIGl0ZW0pIHtcbiAgICAgIHZhciB2YWwgPSBpdGVtW3Byb3BlcnR5Ml1bcHJvcGVydHkxXVxuICAgICAgZ3JvdXBzW3ZhbF0gPSBncm91cHNbdmFsXSB8fCBbXVxuICAgICAgZ3JvdXBzW3ZhbF0ucHVzaChpdGVtKVxuICAgICAgcmV0dXJuIGdyb3Vwc1xuICAgIH0sIHt9KVxuICAgIDogdGhpcy5yZWR1Y2UoZnVuY3Rpb24oZ3JvdXBzLCBpdGVtKSB7XG4gICAgICB2YXIgdmFsID0gaXRlbVtwcm9wZXJ0eTFdXG4gICAgICBncm91cHNbdmFsXSA9IGdyb3Vwc1t2YWxdIHx8IFtdXG4gICAgICBncm91cHNbdmFsXS5wdXNoKGl0ZW0pXG4gICAgICByZXR1cm4gZ3JvdXBzXG4gICAgfSwge30pXG59XG5cblJlZ0V4cC5lc2NhcGUgPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1tcXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJylcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb2xvclNjYWxlKGNvdW50LCBpbmRleCkge1xuICB2YXIgc2NhbGVPbmUgPSBjaHJvbWFcbiAgICAuY3ViZWhlbGl4KClcbiAgICAuaHVlKDAuNSlcbiAgICAubGlnaHRuZXNzKFswLjQsIDAuNl0pXG4gICAgLnNjYWxlKClcbiAgICAuY29sb3JzKGNvdW50ICogMilcbiAgdmFyIHNjYWxlVHdvID0gY2hyb21hXG4gICAgLmN1YmVoZWxpeCgpXG4gICAgLmh1ZSgxKVxuICAgIC5nYW1tYSgwLjUpXG4gICAgLnNjYWxlKClcbiAgICAuY29sb3JzKGNvdW50ICogMilcbiAgICAucmV2ZXJzZSgpXG4gIHZhciBzY2FsZSA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgdmFyIGNvbG9yID0gaSAlIDIgPT09IDAgPyBzY2FsZU9uZVtpICogMl0gOiBzY2FsZVR3b1tpICogMl1cbiAgICBjb2xvciA9IGNocm9tYShjb2xvcilcbiAgICAgIC5zYXR1cmF0ZSgpXG4gICAgICAuaGV4KClcbiAgICBzY2FsZS5wdXNoKGNvbG9yKVxuICB9XG5cbiAgcmV0dXJuIHNjYWxlXG59XG5cbmV4cG9ydCB2YXIgbGluZVdlaWdodHMgPSBbWzMsIDNdLCBbNSwgMl0sIFs0LCAzLjVdLCBbNywgM10sIFs0LCA0XV1cbmV4cG9ydCB2YXIgbGluZURhc2hBcnJheXMgPSBbXG4gIFtudWxsLCAnNiw5J10sXG4gIFtudWxsLCBudWxsXSxcbiAgW251bGwsICc2LDEyJ10sXG4gIFtudWxsLCBudWxsXSxcbiAgWycxOCwyNCcsICcxOCwyNCddXG5dXG5leHBvcnQgdmFyIGV4dGVybmFsTGluayA9XG4gICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE1XCIgaGVpZ2h0PVwiMTVcIiB2aWV3Qm94PVwiMCAwIDE1IDE1XCI+PHBhdGggZD1cIk03LjQ5LDBWMS42N0gxLjY4VjEzLjMySDEzLjMyVjcuNTJIMTV2NS43MmExLjc2LDEuNzYsMCwwLDEtLjQyLDEuMTksMS42NCwxLjY0LDAsMCwxLTEuMTMuNTZIMS43NGExLjY3LDEuNjcsMCwwLDEtMS4xNi0uNDFBMS42MSwxLjYxLDAsMCwxLDAsMTMuNDh2LS4yN0MwLDkuNCwwLDUuNiwwLDEuOEExLjgzLDEuODMsMCwwLDEsLjU4LjRhMS41MywxLjUzLDAsMCwxLDEtLjM5aDZaXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAgMClcIi8+PHBhdGggZD1cIk05LjE3LDEuNjdWMEgxNVY1Ljg0SDEzLjM0di0zaDBjLS4wNS4wNS0uMTEuMS0uMTYuMTZsLS40NS40Ni0xLjMsMS4yOS0uODQuODQtLjg5LjktLjg4Ljg3LS44OS45Yy0uMjguMjktLjU3LjU3LS44Ni44Nkw2LjE2LDEwbC0uODguODdhMS44MywxLjgzLDAsMCwxLS4xMy4xNkw0LDkuODZsMCwwTDUuMzYsOC40N2wuOTUtMSwuNzUtLjc1LDEtMUw4Ljg3LDVsMS0uOTQuODUtLjg2LjkyLS45MS41Ni0uNThaXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAgMClcIi8+PC9zdmc+J1xuZXhwb3J0IHZhciByZW1vdmUgPVxuICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDIxIDIxXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxnIGZpbGw9XCIjMDAwXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPjxwYXRoIGQ9XCJNMi41OTIuMDQ0bDE4LjM2NCAxOC4zNjQtMi41NDggMi41NDhMLjA0NCAyLjU5MnpcIi8+PHBhdGggZD1cIk0wIDE4LjM2NEwxOC4zNjQgMGwyLjU0OCAyLjU0OEwyLjU0OCAyMC45MTJ6XCIvPjwvZz48L3N2Zz4nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VHlwZSh2YWx1ZSkge1xuICB2YXIgdiA9IE51bWJlcih2YWx1ZSlcbiAgcmV0dXJuICFpc05hTih2KVxuICAgID8gdlxuICAgIDogdmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICdudWxsJ1xuICAgICAgICA/IG51bGxcbiAgICAgICAgOiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSdcbiAgICAgICAgICA/IHRydWVcbiAgICAgICAgICA6IHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICdmYWxzZSdcbiAgICAgICAgICAgID8gZmFsc2VcbiAgICAgICAgICAgIDogdmFsdWVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWQodXJsLCBlbGVtZW50KSB7XG4gIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICByZXEub3BlbignR0VUJywgdXJsLCBmYWxzZSlcbiAgcmVxLnNlbmQobnVsbClcbiAgZWxlbWVudC5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRHJvcGRvd25PcHRpb25zKG9wdGlvbnMsIHgpIHtcbiAgdmFyIGdyb3VwcyA9IG9wdGlvbnMud2lkZ2V0c1t4XS5rZXlzLmdyb3VwQnkoJ2dyb3VwJylcbiAgdmFyIGNob2ljZXMgPSBPYmplY3Qua2V5cyhncm91cHMpLm1hcChmdW5jdGlvbihnLCB6KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB6LFxuICAgICAgbGFiZWw6IGcudHJpbSgpICYmIHBhcnNlSW50KGcsIDEwKSA9PT0gTmFOID8gZyA6ICcnLFxuICAgICAgZGlzYWJsZWQ6IGZhbHNlLFxuICAgICAgY2hvaWNlczogZ3JvdXBzW2ddXG4gICAgfVxuICB9KVxuICByZXR1cm4ge1xuICAgIGNob2ljZXM6IGNob2ljZXMsXG4gICAgcmVtb3ZlSXRlbUJ1dHRvbjogdHJ1ZSxcbiAgICBtYXhJdGVtQ291bnQ6IG9wdGlvbnMud2lkZ2V0c1t4XS5tYXhpbXVtLFxuICAgIGNhbGxiYWNrT25DcmVhdGVUZW1wbGF0ZXM6IGZ1bmN0aW9uIGNhbGxiYWNrT25DcmVhdGVUZW1wbGF0ZXModGVtcGxhdGUpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXNcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXRlbTogZnVuY3Rpb24gaXRlbShjbGFzc05hbWVzLCBkYXRhKSB7XG4gICAgICAgICAgdmFyIGtleSA9IG9wdGlvbnMud2lkZ2V0c1t4XS5rZXlzLmZpbmQoZnVuY3Rpb24odikge1xuICAgICAgICAgICAgcmV0dXJuIHYudmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gZGF0YS52YWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgfSlcbiAgICAgICAgICB2YXIga2V5U3R5bGVcblxuICAgICAgICAgIHN3aXRjaCAob3B0aW9ucy53aWRnZXRzW3hdLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdmb3JtJzpcbiAgICAgICAgICAgIHZhciBmb3JtcyA9IG9wdGlvbnMud2lkZ2V0c1t4XS5rZXlzLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICAgIHJldHVybiBrLnZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHZhciBpID0gZm9ybXMuaW5kZXhPZihrZXkudmFsdWUudG9Mb3dlckNhc2UoKSlcblxuICAgICAgICAgICAgdmFyIHN0eWxlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgICBmb3JtczogZm9ybXMsXG4gICAgICAgICAgICAgIG1hcDogb3B0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5U3R5bGUgPSBzdHlsZUtleShzdHlsZU9wdGlvbnMpXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgY2FzZSAnY29sb3InOlxuICAgICAgICAgICAgdmFyIHN0eWxlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgIG1hcDogb3B0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5U3R5bGUgPSBzdHlsZUtleShzdHlsZU9wdGlvbnMpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBtYXJrdXAgPVxuICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJib3JkZXItY29sb3I6JyArXG4gICAgICAgICAgICBrZXkuY29sb3IgK1xuICAgICAgICAgICAgJ1wiIGNsYXNzPVwiJyArXG4gICAgICAgICAgICBjbGFzc05hbWVzLml0ZW0gK1xuICAgICAgICAgICAgJ1wiIGRhdGEtaXRlbSBkYXRhLWlkPVwiJyArXG4gICAgICAgICAgICBkYXRhLmlkICtcbiAgICAgICAgICAgICdcIiBkYXRhLXZhbHVlPVwiJyArXG4gICAgICAgICAgICBkYXRhLnZhbHVlICtcbiAgICAgICAgICAgICdcIiAnICtcbiAgICAgICAgICAgIChkYXRhLmFjdGl2ZSA/ICdhcmlhLXNlbGVjdGVkPVwidHJ1ZVwiJyA6ICcnKSArXG4gICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgKGRhdGEuZGlzYWJsZWQgPyAnYXJpYS1kaXNhYmxlZD1cInRydWVcIicgOiAnJykgK1xuICAgICAgICAgICAgJz48c3BhbiBjbGFzcz1cIicgK1xuICAgICAgICAgICAga2V5U3R5bGUuY2xhc3MgK1xuICAgICAgICAgICAgJ0tleVwiICcgK1xuICAgICAgICAgICAgJ3N0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcJycgK1xuICAgICAgICAgICAga2V5U3R5bGUuc3ZnICtcbiAgICAgICAgICAgICdcIik+PC9zcGFuPiAnICtcbiAgICAgICAgICAgIGNhcGl0YWxpemUoZGF0YS5sYWJlbCkgK1xuICAgICAgICAgICAgJzxidXR0b24gc3R5bGU9XCJib3JkZXItbGVmdDogMXB4IHNvbGlkICcgK1xuICAgICAgICAgICAga2V5LmNvbG9yICtcbiAgICAgICAgICAgICc7IGJhY2tncm91bmQtaW1hZ2U6IHVybChcXCdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCcgK1xuICAgICAgICAgICAgd2luZG93LmJ0b2EocmVtb3ZlKSArXG4gICAgICAgICAgICAnXFwnKVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNob2ljZXNfX2J1dHRvblwiIGRhdGEtYnV0dG9uPVwiXCIgYXJpYS1sYWJlbD1cIlJlbW92ZSBpdGVtXCI+UmVtb3ZlIGl0ZW08L2J1dHRvbj48L2Rpdj4nXG4gICAgICAgICAgcmV0dXJuIHRlbXBsYXRlKG1hcmt1cClcbiAgICAgICAgfSxcbiAgICAgICAgY2hvaWNlOiBmdW5jdGlvbiBjaG9pY2UoY2xhc3NOYW1lcywgZGF0YSkge1xuICAgICAgICAgIHZhciBrZXkgPSBvcHRpb25zLndpZGdldHNbeF0ua2V5cy5maW5kKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgIHJldHVybiB2LnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IGRhdGEudmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdmFyIGtleVN0eWxlXG5cbiAgICAgICAgICBzd2l0Y2ggKG9wdGlvbnMud2lkZ2V0c1t4XS50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnZm9ybSc6XG4gICAgICAgICAgICB2YXIgZm9ybXMgPSBvcHRpb25zLndpZGdldHNbeF0ua2V5cy5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgICByZXR1cm4gay52YWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdmFyIHN0eWxlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgIC8vIGluZGV4OiBpLFxuICAgICAgICAgICAgICBmb3JtczogZm9ybXMsXG4gICAgICAgICAgICAgIG1hcDogb3B0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5U3R5bGUgPSBzdHlsZUtleShzdHlsZU9wdGlvbnMpXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgY2FzZSAnY29sb3InOlxuICAgICAgICAgICAgdmFyIHN0eWxlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgIG1hcDogb3B0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5U3R5bGUgPSBzdHlsZUtleShzdHlsZU9wdGlvbnMpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBtYXJrdXAgPVxuICAgICAgICAgICAgJyA8ZGl2IGNsYXNzPVwiJyArXG4gICAgICAgICAgICBjbGFzc05hbWVzLml0ZW0gK1xuICAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgIGNsYXNzTmFtZXMuaXRlbUNob2ljZSArXG4gICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgKGRhdGEuZGlzYWJsZWRcbiAgICAgICAgICAgICAgPyBjbGFzc05hbWVzLml0ZW1EaXNhYmxlZFxuICAgICAgICAgICAgICA6IGNsYXNzTmFtZXMuaXRlbVNlbGVjdGFibGUpICtcbiAgICAgICAgICAgICdcIiBkYXRhLXNlbGVjdC10ZXh0PVwiJyArXG4gICAgICAgICAgICBfdGhpcy5jb25maWcuaXRlbVNlbGVjdFRleHQgK1xuICAgICAgICAgICAgJ1wiIGRhdGEtY2hvaWNlICcgK1xuICAgICAgICAgICAgKGRhdGEuZGlzYWJsZWRcbiAgICAgICAgICAgICAgPyAnZGF0YS1jaG9pY2UtZGlzYWJsZWQgYXJpYS1kaXNhYmxlZD1cInRydWVcIidcbiAgICAgICAgICAgICAgOiAnZGF0YS1jaG9pY2Utc2VsZWN0YWJsZScpICtcbiAgICAgICAgICAgICcgZGF0YS1pZD1cIicgK1xuICAgICAgICAgICAgZGF0YS5pZCArXG4gICAgICAgICAgICAnXCIgZGF0YS12YWx1ZT1cIicgK1xuICAgICAgICAgICAgZGF0YS52YWx1ZSArXG4gICAgICAgICAgICAnXCIgJyArXG4gICAgICAgICAgICAoZGF0YS5ncm91cElkID4gMCA/ICdyb2xlPVwidHJlZWl0ZW1cIicgOiAncm9sZT1cIm9wdGlvblwiJykgK1xuICAgICAgICAgICAgJz4gPHNwYW4gY2xhc3M9XCInICtcbiAgICAgICAgICAgIGtleVN0eWxlLmNsYXNzICtcbiAgICAgICAgICAgICdLZXlcIiAnICtcbiAgICAgICAgICAgICdzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybChcXCcnICtcbiAgICAgICAgICAgIGtleVN0eWxlLnN2ZyArXG4gICAgICAgICAgICAnXCIpPjwvc3Bhbj4gJyArXG4gICAgICAgICAgICBjYXBpdGFsaXplKGRhdGEubGFiZWwpICtcbiAgICAgICAgICAgICcgPC9kaXY+ICdcbiAgICAgICAgICByZXR1cm4gdGVtcGxhdGUobWFya3VwKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBjYXBpdGFsaXplLCBsb2FkLCBsaW5lV2VpZ2h0cywgbGluZURhc2hBcnJheXMgfSBmcm9tICcuL2hlbHBlcnMuanMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0eWxlS2V5KG9wdGlvbnMpIHtcbiAgdmFyIG1hcCA9IG9wdGlvbnMubWFwLFxuICAgIGZlYXR1cmUgPSBvcHRpb25zLmZlYXR1cmUsXG4gICAgZ3JvdXAgPSBvcHRpb25zLmdyb3VwLFxuICAgIGtleSA9IG9wdGlvbnMua2V5LFxuICAgIGluZGV4ID0gb3B0aW9ucy5pbmRleCxcbiAgICBmb3JtcyA9IG9wdGlvbnMuZm9ybXNcbiAgdmFyIGtleUNvbG9yXG4gIHZhciBkYXNoQXJyYXlcbiAgdmFyIGNvbG9yc1xuICB2YXIga2V5ID0gZ3JvdXAgPyBncm91cFswXSA6IGtleVxuXG4gIHZhciBmb3JtS2V5V2lkZ2V0ID0gbWFwLndpZGdldHMuZmluZChmdW5jdGlvbih3KSB7XG4gICAgcmV0dXJuIHcudHlwZSA9PT0gJ2Zvcm0nXG4gIH0pXG5cbiAgdmFyIGNvbG9yS2V5V2lkZ2V0ID0gbWFwLndpZGdldHMuZmluZChmdW5jdGlvbih3KSB7XG4gICAgcmV0dXJuIHcudHlwZSA9PT0gJ2NvbG9yJ1xuICB9KVxuICBpZiAoY29sb3JLZXlXaWRnZXQgJiYgY29sb3JLZXlXaWRnZXQua2V5cyAmJiBmZWF0dXJlKVxuICAgIGNvbG9yS2V5ID0gY29sb3JLZXlXaWRnZXQua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGsudmFsdWUudG9Mb3dlckNhc2UoKSA9PT1cbiAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW2NvbG9yS2V5V2lkZ2V0LmZpZWxkXS50b0xvd2VyQ2FzZSgpXG4gICAgICApXG4gICAgfSlcbiAgaWYgKGNvbG9yS2V5KSBrZXlDb2xvciA9IGNvbG9yS2V5LmNvbG9yXG5cbiAga2V5LmNvbG9yID1cbiAgICBncm91cCAmJlxuICAgIGdyb3VwLmV2ZXJ5KGZ1bmN0aW9uKGcpIHtcbiAgICAgIHJldHVybiBnLmNvbG9yXG4gICAgfSlcbiAgICAgID8gY2hyb21hLmF2ZXJhZ2UoXG4gICAgICAgIGdyb3VwLm1hcChmdW5jdGlvbihnKSB7XG4gICAgICAgICAgcmV0dXJuIGcuY29sb3JcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIDoga2V5LmNvbG9yXG5cbiAgc3dpdGNoIChrZXkuZm9ybSkge1xuICBjYXNlICdsaW5lJzpcbiAgICBrZXlDb2xvciA9IGtleS5jb2xvclxuICAgICAgPyBrZXkuY29sb3JcbiAgICAgIDogb3B0aW9ucy5tYXAub2NlYW5jb2xvclxuICAgICAgICA/IG9wdGlvbnMubWFwLm9jZWFuY29sb3JcbiAgICAgICAgOiBudWxsXG5cbiAgICBpZiAoZm9ybXMpIHtcbiAgICAgIHZhciBzdmdcbiAgICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgY29sb3JzID0gW1xuICAgICAgICAgIGtleUNvbG9yID8ga2V5Q29sb3IgOiBjaHJvbWEoZGVmYXVsdENvbG9yKS5kYXJrZW4oKSxcbiAgICAgICAgICBrZXlDb2xvciA/IGtleUNvbG9yIDogY2hyb21hKGRlZmF1bHRDb2xvcikuZGFya2VuKClcbiAgICAgICAgXVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGNvbG9ycyA9IFtcbiAgICAgICAgICBrZXlDb2xvciA/IGtleUNvbG9yIDogY2hyb21hKGRlZmF1bHRDb2xvcikuZGFya2VuKCksXG4gICAgICAgICAgJyNmZmZmZmYnXG4gICAgICAgIF1cbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAyOlxuICAgICAgICBjb2xvcnMgPSBbJyMwMDAwMDAnLCBrZXlDb2xvciA/IGtleUNvbG9yIDogZGVmYXVsdENvbG9yXVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlIDM6XG4gICAgICAgIGNvbG9ycyA9IFtcbiAgICAgICAgICAnI2ZmZmZmZicsXG4gICAgICAgICAga2V5Q29sb3IgPyBrZXlDb2xvciA6IGNocm9tYShkZWZhdWx0Q29sb3IpLmRhcmtlbigpXG4gICAgICAgIF1cbiAgICAgICAgYnJlYWtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29sb3JzID0gW1xuICAgICAgICAgIGtleUNvbG9yID8ga2V5Q29sb3IgOiBjaHJvbWEoZGVmYXVsdENvbG9yKS5kYXJrZW4oKSxcbiAgICAgICAgICBrZXlDb2xvciA/IGtleUNvbG9yIDogY2hyb21hKGRlZmF1bHRDb2xvcikuZGFya2VuKClcbiAgICAgICAgXVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBzdmcgPVxuICAgICAgICAgICc8c3ZnIHhtbG5zPVxcJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFwnIHZpZXdCb3g9XFwnMCAwIDQ4IDEyXFwnPjxsaW5lIHgxPVxcJzBcXCcgeDI9XFwnNDhcXCcgeTE9XFwnNTAlXFwnIHkyPVxcJzUwJVxcJyBzdHJva2U9XFwnJyArXG4gICAgICAgICAgY29sb3JzWzBdICtcbiAgICAgICAgICAnXFwnIHN0cm9rZS13aWR0aD1cXCcnICtcbiAgICAgICAgICBsaW5lV2VpZ2h0c1tpbmRleF1bMF0gK1xuICAgICAgICAgICdcXCcgc3Ryb2tlLWxpbmVjYXA9XFwnc3F1YXJlXFwnIHN0cm9rZS1kYXNoYXJyYXk9XFwnJyArXG4gICAgICAgICAgKGluZGV4ID09PSA0ID8gJzE4LDEyJyA6IGxpbmVEYXNoQXJyYXlzW2luZGV4XVswXSkgK1xuICAgICAgICAgICdcXCcvPjxsaW5lIHgxPVxcJzBcXCcgeDI9XFwnNDhcXCcgeTE9XFwnNTAlXFwnIHkyPVxcJzUwJVxcJyBzdHJva2U9XFwnJyArXG4gICAgICAgICAgY29sb3JzWzFdICtcbiAgICAgICAgICAnXFwnIHN0cm9rZS13aWR0aD1cXCcnICtcbiAgICAgICAgICBsaW5lV2VpZ2h0c1tpbmRleF1bMV0gK1xuICAgICAgICAgICdcXCcgc3Ryb2tlLWxpbmVjYXA9XFwnc3F1YXJlXFwnIHN0cm9rZS1kYXNoYXJyYXk9XFwnJyArXG4gICAgICAgICAgKGluZGV4ID09PSA0ID8gJzE4LDEyJyA6IGxpbmVEYXNoQXJyYXlzW2luZGV4XVsxXSkgK1xuICAgICAgICAgICdcXCcvPjwvc3ZnPidcbiAgICB9IGVsc2Uge1xuICAgICAgc3ZnID1cbiAgICAgICAgICAnPHN2ZyB4bWxucz1cXCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcJyB2aWV3Qm94PVxcJzAgMCA0OCAxMlxcJz48bGluZSB4MT1cXCcwXFwnIHgyPVxcJzQ4XFwnIHkxPVxcJzUwJVxcJyB5Mj1cXCc1MCVcXCcgc3Ryb2tlPVxcJycgK1xuICAgICAgICAgIGtleUNvbG9yICtcbiAgICAgICAgICAnXFwnIHN0cm9rZS13aWR0aD1cXCcnICtcbiAgICAgICAgICAzICtcbiAgICAgICAgICAnXFwnIHN0cm9rZS1saW5lY2FwPVxcJ3NxdWFyZVxcJyBzdHJva2UtZGFzaGFycmF5PVxcJycgK1xuICAgICAgICAgICczLDcnICtcbiAgICAgICAgICAnXFwnLz48L3N2Zz4nXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN2ZzogJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIHdpbmRvdy5idG9hKHN2ZyksXG4gICAgICBjbGFzczogJ2xpbmUnXG4gICAgfVxuXG4gIGNhc2UgJ2ljb24nOlxuICAgIGlmIChrZXkuaWNvbikge1xuICAgICAgdmFyIHNsdWcgPSBrZXkudmFsdWUucmVwbGFjZSgvIC9nLCAnLScpXG4gICAgICBsb2FkKGtleS5pY29uLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGlkZGVuJykpXG4gICAgICB2YXIgc3ZnQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oaWRkZW4nKS5pbm5lckhUTUxcblxuICAgICAgaWYgKGNvbG9yS2V5V2lkZ2V0ICYmIGtleUNvbG9yKSB7XG4gICAgICAgIHN2Z0NvbnRlbnQgPSBzdmdDb250ZW50LnJlcGxhY2UoXG4gICAgICAgICAgLygoXFxiZmlsbD1cIiMpKChbMC1hLWZBLUZdezJ9KXszfXwoWzAtOWEtZkEtRl0pezN9KVwiKS9naSxcbiAgICAgICAgICAnJ1xuICAgICAgICApXG4gICAgICAgIHN2Z0NvbnRlbnQgPSBzdmdDb250ZW50LnJlcGxhY2UoXG4gICAgICAgICAgLyg8Y2lyY2xlIHw8cmVjdGFuZ2xlIHw8ZWxsaXBzZSB8PHBvbHlnb24gfDxwYXRoICkvZyxcbiAgICAgICAgICBmdW5jdGlvbihtYXRjaCwgcDEsIHAyLCBwMykge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoLnJlcGxhY2UobWF0Y2gsIG1hdGNoICsgJ2ZpbGw9XCInICsga2V5Q29sb3IgKyAnXCIgJylcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgc3ZnID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIHdpbmRvdy5idG9hKHN2Z0NvbnRlbnQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHN2ZyA9XG4gICAgICAgICAgJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArXG4gICAgICAgICAgd2luZG93LmJ0b2EoXG4gICAgICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PGNpcmNsZSBjeD1cIicgK1xuICAgICAgICAgICAgICBtYXAuaWNvbnNpemVbMF0gLyAyICtcbiAgICAgICAgICAgICAgJ1wiIGN5PVwiJyArXG4gICAgICAgICAgICAgIG1hcC5pY29uc2l6ZVsxXSAvIDIgK1xuICAgICAgICAgICAgICAnXCIgcj1cIicgK1xuICAgICAgICAgICAgICAobWFwLmljb25zaXplWzBdICsgbWFwLmljb25zaXplWzFdKSAvIDQgK1xuICAgICAgICAgICAgICAnXCIgZmlsbD1cIicgK1xuICAgICAgICAgICAgICAoa2V5Q29sb3IgfHwga2V5LmNvbG9yKSArXG4gICAgICAgICAgICAgICdcIi8+PC9zdmc+J1xuICAgICAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3ZnOiBzdmcsXG4gICAgICBjbGFzczoga2V5Lmljb24gPyAnaWNvbicgOiAnY29sb3InXG4gICAgfVxuXG4gIGNhc2UgJ3BhdHRlcm4nOlxuICAgIGtleUNvbG9yID0ga2V5LmNvbG9yXG4gICAgdmFyIHN2Z1xuXG4gICAgc3dpdGNoICh0cnVlKSB7XG4gICAgY2FzZSBrZXkucGF0dGVyblswXS5pbmRleE9mKCdzdHJpcGUnKSA+IC0xOlxuICAgICAgdmFyIGNvbG9yVHdvID0ga2V5LnBhdHRlcm5bMV1cbiAgICAgIHZhciBjb2xvck9uZSA9IGtleS5wYXR0ZXJuW2tleS5wYXR0ZXJuLmxlbmd0aCAtIDFdXG4gICAgICBzdmcgPVxuICAgICAgICAgICAgJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArXG4gICAgICAgICAgICB3aW5kb3cuYnRvYShcbiAgICAgICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTJcIiBoZWlnaHQ9XCIxMlwiIHZpZXdCb3g9XCIwIDAgMTIgMTJcIj48cG9seWdvbiBwb2ludHM9XCI1LjczIDAgNC42NyAwIDAgNC42NiAwIDUuNzEgNS43MyAwXCIgZmlsbD1cIicgK1xuICAgICAgICAgICAgICAgIGNvbG9yT25lICtcbiAgICAgICAgICAgICAgICAnXCIvPjxwb2x5Z29uIHBvaW50cz1cIjIuMjggMCAxLjIyIDAgMCAxLjIyIDAgMi4yNyAyLjI4IDBcIiBmaWxsPVwiJyArXG4gICAgICAgICAgICAgICAgY29sb3JUd28gK1xuICAgICAgICAgICAgICAgICdcIi8+PHBvbHlnb24gcG9pbnRzPVwiOC44NSAwIDcuNzkgMCAwIDcuNzcgMCA4LjgyIDguODUgMFwiIGZpbGw9XCInICtcbiAgICAgICAgICAgICAgICBjb2xvclR3byArXG4gICAgICAgICAgICAgICAgJ1wiLz48cG9seWdvbiBwb2ludHM9XCIxMiAwIDExLjI0IDAgMCAxMS4yIDAgMTIgMC4yNiAxMiAxMiAwLjMgMTIgMFwiIGZpbGw9XCInICtcbiAgICAgICAgICAgICAgICBjb2xvck9uZSArXG4gICAgICAgICAgICAgICAgJ1wiLz48cG9seWdvbiBwb2ludHM9XCIxMiAxMC4xMiAxMiA5LjA2IDkuMDUgMTIgMTAuMTEgMTIgMTIgMTAuMTJcIiBmaWxsPVwiJyArXG4gICAgICAgICAgICAgICAgY29sb3JUd28gK1xuICAgICAgICAgICAgICAgICdcIi8+PHBvbHlnb24gcG9pbnRzPVwiMTIgMy41MiAxMiAyLjQ2IDIuNDMgMTIgMy40OSAxMiAxMiAzLjUyXCIgZmlsbD1cIicgK1xuICAgICAgICAgICAgICAgIGNvbG9yVHdvICtcbiAgICAgICAgICAgICAgICAnXCIvPjxwb2x5Z29uIHBvaW50cz1cIjEyIDYuOTYgMTIgNS45IDUuODggMTIgNi45NCAxMiAxMiA2Ljk2XCIgZmlsbD1cIicgK1xuICAgICAgICAgICAgICAgIGNvbG9yT25lICtcbiAgICAgICAgICAgICAgICAnXCIvPjwvc3ZnPidcbiAgICAgICAgICAgIClcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlIGtleS5wYXR0ZXJuWzBdLmluZGV4T2YoJ2RvdCcpID4gLTE6XG4gICAgICBzdmcgPVxuICAgICAgICAgICAgJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArXG4gICAgICAgICAgICB3aW5kb3cuYnRvYShcbiAgICAgICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTMuMDZcIiBoZWlnaHQ9XCIxNS4xXCIgdmlld0JveD1cIjAgMCAxMiAxMlwiPjx0aXRsZT5zdHJpcGVzPC90aXRsZT48cGF0aCBkPVwiTTUuNDksMUExLjE2LDEuMTYsMCwxLDEsNC4zMy0uMTYsMS4xNiwxLjE2LDAsMCwxLDUuNDksMVpNNC4zMywzLjc3QTEuMTYsMS4xNiwwLDEsMCw1LjQ5LDQuOTMsMS4xNSwxLjE1LDAsMCwwLDQuMzMsMy43N1ptMCwzLjkzQTEuMTYsMS4xNiwwLDEsMCw1LjQ5LDguODYsMS4xNSwxLjE1LDAsMCwwLDQuMzMsNy43Wm0wLDMuOTNhMS4xNiwxLjE2LDAsMSwwLDEuMTYsMS4xNkExLjE1LDEuMTUsMCwwLDAsNC4zMywxMS42M1pNMTEuNS0uMTZBMS4xNiwxLjE2LDAsMSwwLDEyLjY2LDEsMS4xNiwxLjE2LDAsMCwwLDExLjUtLjE2Wm0wLDMuOTNhMS4xNiwxLjE2LDAsMSwwLDEuMTYsMS4xNkExLjE2LDEuMTYsMCwwLDAsMTEuNSwzLjc3Wm0wLDMuOTNhMS4xNiwxLjE2LDAsMSwwLDEuMTYsMS4xNkExLjE2LDEuMTYsMCwwLDAsMTEuNSw3LjdabTAsMy45M2ExLjE2LDEuMTYsMCwxLDAsMS4xNiwxLjE2QTEuMTYsMS4xNiwwLDAsMCwxMS41LDExLjYzWk03LjkyLTEuMTZBMS4xNiwxLjE2LDAsMCwwLDYuNzYsMCwxLjE2LDEuMTYsMCwwLDAsNy45MiwxLjE2LDEuMTYsMS4xNiwwLDAsMCw5LjA3LDAsMS4xNiwxLjE2LDAsMCwwLDcuOTItMS4xNlptMCwzLjkzQTEuMTYsMS4xNiwwLDEsMCw5LjA3LDMuOTMsMS4xNiwxLjE2LDAsMCwwLDcuOTIsMi43N1ptMCwzLjkzQTEuMTYsMS4xNiwwLDEsMCw5LjA3LDcuODYsMS4xNiwxLjE2LDAsMCwwLDcuOTIsNi43Wm0wLDMuOTNhMS4xNiwxLjE2LDAsMSwwLDEuMTUsMS4xNkExLjE2LDEuMTYsMCwwLDAsNy45MiwxMC42M1pNLjc1LTEuMTZBMS4xNiwxLjE2LDAsMCwwLS40MSwwLDEuMTYsMS4xNiwwLDAsMCwuNzUsMS4xNiwxLjE2LDEuMTYsMCwwLDAsMS45MSwwLDEuMTYsMS4xNiwwLDAsMCwuNzUtMS4xNlptMCwzLjkzQTEuMTYsMS4xNiwwLDEsMCwxLjkxLDMuOTMsMS4xNiwxLjE2LDAsMCwwLC43NSwyLjc3Wm0wLDMuOTNBMS4xNiwxLjE2LDAsMCwwLS40MSw3Ljg2LDEuMTUsMS4xNSwwLDAsMCwuNzUsOSwxLjE1LDEuMTUsMCwwLDAsMS45MSw3Ljg2LDEuMTYsMS4xNiwwLDAsMCwuNzUsNi43Wm0wLDMuOTNhMS4xNiwxLjE2LDAsMSwwLDEuMTYsMS4xNkExLjE2LDEuMTYsMCwwLDAsLjc1LDEwLjYzWlwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwLjcgMilcIiBmaWxsPVwiJyArXG4gICAgICAgICAgICAgICAgY29sb3JPbmUgK1xuICAgICAgICAgICAgICAgICdcIi8+PC9zdmc+J1xuICAgICAgICAgICAgKVxuICAgICAgYnJlYWtcblxuICAgIGRlZmF1bHQ6XG4gICAgICBzdmcgPVxuICAgICAgICAgICAgJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArXG4gICAgICAgICAgICB3aW5kb3cuYnRvYShcbiAgICAgICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxjaXJjbGUgY3g9XCI2XCIgY3k9XCI2XCIgcj1cIjVcIiBmaWxsPVwiJyArXG4gICAgICAgICAgICAgICAga2V5Q29sb3IgK1xuICAgICAgICAgICAgICAgICdcIi8+PC9zdmc+J1xuICAgICAgICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzdmc6IHN2ZyxcbiAgICAgIGNsYXNzOiBrZXkucGF0dGVybiA/ICdwYXR0ZXJuJyA6ICdjb2xvcidcbiAgICB9XG5cbiAgY2FzZSAnc2hhcGUnOlxuICAgIGlmIChmZWF0dXJlKSB7XG4gICAgICB2YXIgY29sb3JLZXlXaWRnZXQgPSBtYXAud2lkZ2V0cy5maW5kKGZ1bmN0aW9uKHcpIHtcbiAgICAgICAgcmV0dXJuIHcudHlwZSA9PT0gJ2NvbG9yJ1xuICAgICAgfSlcbiAgICAgIHZhciBjb2xvcktleSA9IGNvbG9yS2V5V2lkZ2V0LmtleXMuZmluZChmdW5jdGlvbihrKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgay52YWx1ZS50b0xvd2VyQ2FzZSgpID09PVxuICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW2NvbG9yS2V5V2lkZ2V0LmZpZWxkXS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgICBrZXlDb2xvciA9IGNvbG9yS2V5ID8gY29sb3JLZXkuY29sb3IgOiBjb2xvciA/IGNvbG9yIDogbnVsbFxuICAgIH1cblxuICAgIHZhciBzdmdcblxuICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICBjYXNlIDA6XG4gICAgICBzdmcgPVxuICAgICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD1cInJhaW5ib3dcIiAgeTE9XCI0LjVcIiB4Mj1cIjlcIiB5Mj1cIjQuNVwiIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiIGdyYWRpZW50VHJhbnNmb3JtPVwidHJhbnNsYXRlKDQuNSAtNC41KSByb3RhdGUoMTM1KVwiPjxzdG9wIG9mZnNldD1cIjBcIiBzdG9wLWNvbG9yPVwiIzdmM2M4ZFwiLz48c3RvcCBvZmZzZXQ9XCIwLjMyNVwiIHN0b3AtY29sb3I9XCIjZTczZjc0XCIvPjxzdG9wIG9mZnNldD1cIjAuNVwiIHN0b3AtY29sb3I9XCIjZjJiNzAxXCIvPjxzdG9wIG9mZnNldD1cIjAuNjc1XCIgc3RvcC1jb2xvcj1cIiMxMWE1NzlcIi8+PHN0b3Agb2Zmc2V0PVwiMVwiIHN0b3AtY29sb3I9XCIjMzk2OWFjXCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9XCIzLjI1XCIgeT1cIjEuNzVcIiB3aWR0aD1cIjlcIiBoZWlnaHQ9XCI5XCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDQuNSAtNC41KSByb3RhdGUoNDUpXCIgJyArXG4gICAgICAgICAgICAoa2V5Q29sb3IgPyAncGFpbnQtb3JkZXI9XCJzdHJva2VcIiBzdHJva2U9XCIjZmZmZmZmXCInIDogJycpICtcbiAgICAgICAgICAgICcgZmlsbD1cIicgK1xuICAgICAgICAgICAgKGtleUNvbG9yID8ga2V5Q29sb3IgOiAndXJsKCNyYWluYm93KScpICtcbiAgICAgICAgICAgICdcIiAvPjwvc3ZnPidcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlIDE6XG4gICAgICBzdmcgPVxuICAgICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD1cInJhaW5ib3dcIiB5MT1cIjVcIiB4Mj1cIjEwXCIgeTI9XCI1XCIgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+PHN0b3Agb2Zmc2V0PVwiMFwiIHN0b3AtY29sb3I9XCIjMzk2OWFjXCIvPjxzdG9wIG9mZnNldD1cIjAuMjVcIiBzdG9wLWNvbG9yPVwiIzExYTU3OVwiLz48c3RvcCBvZmZzZXQ9XCIwLjVcIiBzdG9wLWNvbG9yPVwiI2YyYjcwMVwiLz48c3RvcCBvZmZzZXQ9XCIwLjc1XCIgc3RvcC1jb2xvcj1cIiNlNzNmNzRcIi8+PHN0b3Agb2Zmc2V0PVwiMVwiIHN0b3AtY29sb3I9XCIjN2YzYzhkXCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPVwiMTBcIiBoZWlnaHQ9XCIxMFwiICcgK1xuICAgICAgICAgICAgKGtleUNvbG9yID8gJ3N0cm9rZT1cIiNmZmZmZmZcIicgOiAnJykgK1xuICAgICAgICAgICAgJyBmaWxsPVwiJyArXG4gICAgICAgICAgICAoa2V5Q29sb3IgPyBrZXlDb2xvciA6ICd1cmwoI3JhaW5ib3cpJykgK1xuICAgICAgICAgICAgJ1wiLz48L3N2Zz4nXG4gICAgICBicmVha1xuXG4gICAgY2FzZSAyOlxuICAgICAgc3ZnID1cbiAgICAgICAgICAgICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9XCJyYWluYm93XCIgeTE9XCI1XCIgeDI9XCIxMFwiIHkyPVwiNVwiIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPjxzdG9wIG9mZnNldD1cIjBcIiBzdG9wLWNvbG9yPVwiIzM5NjlhY1wiLz48c3RvcCBvZmZzZXQ9XCIwLjMyNVwiIHN0b3AtY29sb3I9XCIjMTFhNTc5XCIvPjxzdG9wIG9mZnNldD1cIjAuNVwiIHN0b3AtY29sb3I9XCIjZjJiNzAxXCIvPjxzdG9wIG9mZnNldD1cIjAuNjc1XCIgc3RvcC1jb2xvcj1cIiNlNzNmNzRcIi8+PHN0b3Agb2Zmc2V0PVwiMVwiIHN0b3AtY29sb3I9XCIjN2YzYzhkXCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwb2x5Z29uIHBvaW50cz1cIjYgMTAuMzkgMCAxMC4zOSAzIDUuMiA2IDAgOSA1LjIgMTIgMTAuMzkgNiAxMC4zOVwiICcgK1xuICAgICAgICAgICAgKGtleUNvbG9yID8gJ3BhaW50LW9yZGVyPVwic3Ryb2tlXCIgc3Ryb2tlPVwiI2ZmZmZmZlwiJyA6ICcnKSArXG4gICAgICAgICAgICAnIGZpbGw9XCInICtcbiAgICAgICAgICAgIChrZXlDb2xvciA/IGtleUNvbG9yIDogJ3VybCgjcmFpbmJvdyknKSArXG4gICAgICAgICAgICAnXCIgLz48L3N2Zz4nXG4gICAgICBicmVha1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHN2ZyA9XG4gICAgICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPVwicmFpbmJvd1wiIHkxPVwiNVwiIHgyPVwiMTBcIiB5Mj1cIjVcIiBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj48c3RvcCBvZmZzZXQ9XCIwXCIgc3RvcC1jb2xvcj1cIiMzOTY5YWNcIi8+PHN0b3Agb2Zmc2V0PVwiMC4yNVwiIHN0b3AtY29sb3I9XCIjMTFhNTc5XCIvPjxzdG9wIG9mZnNldD1cIjAuNVwiIHN0b3AtY29sb3I9XCIjZjJiNzAxXCIvPjxzdG9wIG9mZnNldD1cIjAuNzVcIiBzdG9wLWNvbG9yPVwiI2U3M2Y3NFwiLz48c3RvcCBvZmZzZXQ9XCIxXCIgc3RvcC1jb2xvcj1cIiM3ZjNjOGRcIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD1cIjZcIiBjeT1cIjZcIiByPVwiNVwiICcgK1xuICAgICAgICAgICAgKGtleUNvbG9yID8gJ3N0cm9rZT1cIiNmZmZmZmZcIicgOiAnJykgK1xuICAgICAgICAgICAgJyBmaWxsPVwiJyArXG4gICAgICAgICAgICAoa2V5Q29sb3IgPyBrZXlDb2xvciA6ICd1cmwoI3JhaW5ib3cpJykgK1xuICAgICAgICAgICAgJ1wiLz48L3N2Zz4nXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN2ZzogJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIHdpbmRvdy5idG9hKHN2ZyksXG4gICAgICBjbGFzczogJ3NoYXBlJ1xuICAgIH1cblxuICBkZWZhdWx0OlxuICAgIGtleUNvbG9yID0ga2V5LmNvbG9yXG4gICAgdmFyIHN2ZyA9XG4gICAgICAgICdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCcgK1xuICAgICAgICB3aW5kb3cuYnRvYShcbiAgICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PGNpcmNsZSBjeD1cIjZcIiBjeT1cIjZcIiByPVwiNVwiIGZpbGw9XCInICtcbiAgICAgICAgICAgIGtleUNvbG9yICtcbiAgICAgICAgICAgICdcIi8+PC9zdmc+J1xuICAgICAgICApXG4gICAgcmV0dXJuIHtcbiAgICAgIHN2Zzogc3ZnLFxuICAgICAgY2xhc3M6ICdjb2xvcidcbiAgICB9XG4gIH1cbn1cbiIsInZhciBtYXBJZCA9IDBcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ3VzdG9tTWFwKGNvbnRhaW5lciwgcHJvcGVydGllcykge1xuICB0aGlzLmlkID0gbWFwSWQrK1xuICB0aGlzLmZpbHRlcnMgPSBbXVxuICB0aGlzLmdyb3VwcyA9IFtdXG4gIHRoaXMuanNvbiA9IFtdXG4gIHRoaXMubGVhZmxldFxuXG4gIHZhciBfdGhpcyA9IHRoaXNcblxuICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgX3RoaXNbcHJvcGVydHkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8gL2csICcnKV0gPSBwcm9wZXJ0aWVzW3Byb3BlcnR5XVxuICB9KVxuICBfdGhpcy5wb3B1cGNvbnRlbnQgPVxuICAgIF90aGlzLnBvcHVwY29udGVudCAmJiB0eXBlb2YgX3RoaXMucG9wdXBjb250ZW50ID09PSAnc3RyaW5nJ1xuICAgICAgPyBfdGhpcy5wb3B1cGNvbnRlbnQuc3BsaXQoJywnKVxuICAgICAgOiBfdGhpcy5wb3B1cGNvbnRlbnQgJiYgdGhpcy5wb3B1cGNvbnRlbnQgPT09ICdvYmplY3QnXG4gICAgICAgID8gX3RoaXMucG9wdXBjb250ZW50XG4gICAgICAgIDogW11cbiAgX3RoaXMucG9wdXBoZWFkZXJzID1cbiAgICBfdGhpcy5wb3B1cGhlYWRlcnMgJiYgdHlwZW9mIF90aGlzLnBvcHVwaGVhZGVycyA9PT0gJ3N0cmluZydcbiAgICAgID8gX3RoaXMucG9wdXBoZWFkZXJzLnNwbGl0KCcsJylcbiAgICAgIDogX3RoaXMucG9wdXBoZWFkZXJzICYmIF90aGlzLnBvcHVwaGVhZGVycyA9PT0gJ29iamVjdCdcbiAgICAgICAgPyBfdGhpcy5wb3B1cGhlYWRlcnNcbiAgICAgICAgOiBbXVxuICBDdXN0b21NYXAuYWxsID0gQ3VzdG9tTWFwLmFsbCB8fCBbXVxuICBDdXN0b21NYXAuYWxsLnB1c2godGhpcylcblxuICBfdGhpcy5yZXNldEZpbHRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICBfdGhpcy5maWx0ZXJzID0gW11cbiAgfVxuXG4gIF90aGlzLnJlbW92ZUdyb3VwcyA9IGZ1bmN0aW9uKCkge1xuICAgIF90aGlzLmdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICBfdGhpcy5sZWFmbGV0LnJlbW92ZUxheWVyKGdyb3VwKVxuICAgIH0pXG5cbiAgICBfdGhpcy5ncm91cHMgPSBbXVxuICB9XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBfdGhpcy5sZWFmbGV0ID0gTC5tYXAoY29udGFpbmVyLCB7XG4gICAgICBtaW5ab29tOiBfdGhpcy5taW56b29tIHx8IG51bGwsXG4gICAgICBtYXhab29tOiBfdGhpcy5tYXh6b29tIHx8IDIwLFxuICAgICAgbWF4Qm91bmRzOiBfdGhpcy5tYXhib3VuZHMgfHwgW190aGlzLnN3Ym91bmRzLCBfdGhpcy5uZWJvdW5kc10sXG4gICAgICBzY3JvbGxXaGVlbFpvb206IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4ID8gZmFsc2UgOiB0cnVlLFxuICAgICAgem9vbUNvbnRyb2w6XG4gICAgICAgICFfdGhpcy5oYXNPd25Qcm9wZXJ0eSgnem9vbXNsaWRlcicpIHx8IF90aGlzLnpvb21zbGlkZXIgPyBmYWxzZSA6IHRydWUsXG4gICAgICBhdHRyaWJ1dGlvbkNvbnRyb2w6IGZhbHNlXG4gICAgfSlcblxuICAgIGlmIChfdGhpcy5sb2FkRXZlbnQpIF90aGlzLmxlYWZsZXQub24oJ2xvYWQnLCBfdGhpcy5sb2FkZXZlbnQpXG4gICAgaWYgKF90aGlzLmFkZEV2ZW50KSBfdGhpcy5sZWFmbGV0Lm9uKCdsYXllcmFkZCcsIF90aGlzLmFkZGV2ZW50KVxuICAgIHRoaXMubGVhZmxldC5zZXRWaWV3KF90aGlzLmNlbnRlciwgX3RoaXMuem9vbSB8fCAyKVxuICAgIEwudGlsZUxheWVyKFxuICAgICAgJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL2lsYWJtZWRpYS8nICtcbiAgICAgICAgX3RoaXMubWFwYm94c3R5bGUgK1xuICAgICAgICAnL3RpbGVzLzI1Ni97en0ve3h9L3t5fT9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2lhV3hoWW0xbFpHbGhJaXdpWVNJNkltTnBiSFl5Y1haMmJUQXhhaloxYzJ0emRXVTFiM2d5ZG5ZaWZRLkFIeGw4cFBac2pzcW96OTUtNjA0bncnLFxuICAgICAge31cbiAgICApLmFkZFRvKF90aGlzLmxlYWZsZXQpXG5cbiAgICBpZiAoIV90aGlzLmhhc093blByb3BlcnR5KCd6b29tc2xpZGVyJykgfHwgX3RoaXMuem9vbXNsaWRlcikge1xuICAgICAgTC5jb250cm9sLnpvb21zbGlkZXIoKS5hZGRUbyhfdGhpcy5sZWFmbGV0KVxuICAgIH1cblxuICAgIGlmICghX3RoaXMuaGFzT3duUHJvcGVydHkoJ2Z1bGxzY3JlZW4nKSB8fCBfdGhpcy5mdWxsc2NyZWVuKSB7XG4gICAgICB3aW5kb3cuZnVsbHNjcmVlbiA9IG5ldyBMLkNvbnRyb2wuRnVsbHNjcmVlbigpXG5cbiAgICAgIF90aGlzLmxlYWZsZXQuYWRkQ29udHJvbCh3aW5kb3cuZnVsbHNjcmVlbilcbiAgICB9XG5cbiAgICBMLmNvbnRyb2xcbiAgICAgIC5hdHRyaWJ1dGlvbih7XG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tbGVmdCdcbiAgICAgIH0pXG4gICAgICAuc2V0UHJlZml4KF90aGlzLmF0dHJpYnV0aW9uKVxuICAgICAgLmFkZFRvKF90aGlzLmxlYWZsZXQpXG5cbiAgICBfdGhpcy5yZXNldEZpbHRlcnMoKVxuXG4gICAgcmV0dXJuIF90aGlzXG4gIH1cbn1cbiIsImltcG9ydCB7IGV4dGVybmFsTGluayB9IGZyb20gJy4vaGVscGVycy5qcydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGFuZGxlRmVhdHVyZUV2ZW50cyhmZWF0dXJlLCBsYXllciwgbWFwKSB7XG4gIHZhciBldmVudE9wdGlvbnMgPSBtYXAub25lYWNoZmVhdHVyZVxuICAgID8gbWFwLm9uZWFjaGZlYXR1cmVcbiAgICA6IHtcbiAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgaGFuZGxlTGF5ZXJDbGljayhmZWF0dXJlLCBsYXllciwgbWFwLmxlYWZsZXQpXG4gICAgICB9XG4gICAgfVxuXG4gIE9iamVjdC5rZXlzKGV2ZW50T3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgIGxheWVyLm9uKGxpc3RlbmVyLCBldmVudE9wdGlvbnNbbGlzdGVuZXJdKVxuICB9KVxuXG4gIHZhciBwb3B1cENvbnRlbnQgPVxuICAgIHR5cGVvZiBtYXAuZm9ybWF0cG9wdXBjb250ZW50ID09PSAnZnVuY3Rpb24nXG4gICAgICA/IG1hcC5mb3JtYXRwb3B1cGNvbnRlbnQoZmVhdHVyZSwgbWFwKVxuICAgICAgOiBmb3JtYXRQb3B1cENvbnRlbnQoZmVhdHVyZSwgbWFwKVxuICBsYXllci5iaW5kUG9wdXAocG9wdXBDb250ZW50KVxufVxuXG5mdW5jdGlvbiBmb3JtYXRQb3B1cENvbnRlbnQoZmVhdHVyZSwgbWFwKSB7XG4gIHZhciBjb250ZW50XG4gIGNvbnRlbnQgPSBPYmplY3Qua2V5cyhmZWF0dXJlLnByb3BlcnRpZXMpXG4gICAgLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICBpZiAoZmVhdHVyZS5wcm9wZXJ0aWVzW3BdKSB7XG4gICAgICAgIGlmIChtYXAucG9wdXBoZWFkZXJzLmxlbmd0aCAmJiBtYXAucG9wdXBjb250ZW50Lmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBtYXAucG9wdXBoZWFkZXJzLmluZGV4T2YocCkgPiAtMSAmJlxuICAgICAgICAgICAgbWFwLnBvcHVwY29udGVudC5pbmRleE9mKHApID4gLTFcbiAgICAgICAgICAgID8gJzxkaXYgY2xhc3M9XCJwb3B1cEhlYWRlclN0eWxlXCI+JyArXG4gICAgICAgICAgICAgICAgcC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL18vZywgJyAnKSArXG4gICAgICAgICAgICAgICAgJzwvZGl2PjxkaXYgY2xhc3M9XCJwb3B1cEVudHJ5U3R5bGVcIj4nICtcbiAgICAgICAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXNbcF0gK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICA6IG1hcC5wb3B1cGNvbnRlbnQuaW5kZXhPZihwKSA+IC0xXG4gICAgICAgICAgICAgID8gJzxkaXYgY2xhc3M9XCJwb3B1cEVudHJ5U3R5bGVcIj4nICtcbiAgICAgICAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXNbcF0gK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICAgIDogJydcbiAgICAgICAgfSBlbHNlIGlmIChtYXAucG9wdXBoZWFkZXJzLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBtYXAucG9wdXBoZWFkZXJzLmluZGV4T2YocCkgPiAtMVxuICAgICAgICAgICAgPyAnPGRpdiBjbGFzcz1cInBvcHVwSGVhZGVyU3R5bGVcIj4nICtcbiAgICAgICAgICAgICAgICBwLnRvVXBwZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnICcpICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+PGRpdiBjbGFzcz1cInBvcHVwRW50cnlTdHlsZVwiPicgK1xuICAgICAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllc1twXSArXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgIDogJydcbiAgICAgICAgfSBlbHNlIGlmIChtYXAucG9wdXBjb250ZW50Lmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBtYXAucG9wdXBjb250ZW50LmluZGV4T2YocCkgPiAtMVxuICAgICAgICAgICAgPyAnPGRpdiBjbGFzcz1cInBvcHVwRW50cnlTdHlsZVwiPicgKyBmZWF0dXJlLnByb3BlcnRpZXNbcF0gKyAnPC9kaXY+J1xuICAgICAgICAgICAgOiAnJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBvcHVwSGVhZGVyU3R5bGVcIj4nICtcbiAgICAgICAgICAgIHAudG9VcHBlckNhc2UoKS5yZXBsYWNlKC9fL2csICcgJykgK1xuICAgICAgICAgICAgJzwvZGl2PjxkaXYgY2xhc3M9XCJwb3B1cEVudHJ5U3R5bGVcIj4nICtcbiAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllc1twXSArXG4gICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLmZpbHRlcihmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcFxuICAgIH0pXG4gICAgLmpvaW4oJycpXG4gIHZhciBsaW5rID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmh5cGVybGluayB8fCBmZWF0dXJlLnByb3BlcnRpZXMubGlua1xuICB2YXIgZXh0ZXJuYWxMaW5rQ29udGVudCA9XG4gICAgbGluayAmJiBsaW5rLnRyaW0oKVxuICAgICAgPyAnPGRpdiBjbGFzcz1cInNlcGFyYXRvclwiPjwvZGl2PjxkaXYgY2xhc3M9XCJoeXBlcmxpbmsgcG9wdXBFbnRyeVN0eWxlXCI+PGEgY2xhc3M9XCJ0cmFuc2xhdGVcIiBocmVmPScgK1xuICAgICAgICBsaW5rLnRyaW0oKSArXG4gICAgICAgICcgdGFyZ2V0PVwiX2JsYW5rXCI+JyArXG4gICAgICAgIG1hcC5leHRlcm5hbExpbmtUZXh0ICtcbiAgICAgICAgJzwvYT4nICtcbiAgICAgICAgZXh0ZXJuYWxMaW5rICtcbiAgICAgICAgJzwvZGl2PidcbiAgICAgIDogJydcbiAgY29udGVudCArPSBleHRlcm5hbExpbmtDb250ZW50XG5cbiAgaWYgKGxhbmcpIHtcbiAgICB2YXIgdHJhbnNsYXRhYmxlU3RyaW5ncyA9IE9iamVjdC5rZXlzKG1hcC50cmFuc2xhdGlvbnMpLnNvcnQoZnVuY3Rpb24oXG4gICAgICBhLFxuICAgICAgYlxuICAgICkge1xuICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGhcbiAgICB9KVxuICAgIHRyYW5zbGF0YWJsZVN0cmluZ3MuZm9yRWFjaChmdW5jdGlvbih0KSB7XG4gICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKCdcXFxcYignICsgUmVnRXhwLmVzY2FwZSh0KSArICcpJywgJ2dpJylcbiAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UocmUsIG1hcC50cmFuc2xhdGlvbnNbdF0pXG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBjb250ZW50XG59XG5cbndpbmRvdy5oYW5kbGVMYXllckNsaWNrID0gZnVuY3Rpb24oZmVhdHVyZSwgbGF5ZXIsIGxlYWZsZXQpIHtcbiAgdmFyIGlzU3BpZGVyZmllZCA9IGZhbHNlXG5cbiAgaWYgKCFsYXllci5fcHJlU3BpZGVyZnlMYXRsbmcpIHtcbiAgICBPYmplY3Qua2V5cyhsZWFmbGV0Ll9sYXllcnMpLmZvckVhY2goZnVuY3Rpb24obCwgaSkge1xuICAgICAgaWYgKGxlYWZsZXQuX2xheWVyc1tsXS51bnNwaWRlcmZ5KSBsZWFmbGV0Ll9sYXllcnNbbF0udW5zcGlkZXJmeSgpXG4gICAgfSlcblxuICAgIGlmIChsYXllci5fX3BhcmVudCkge1xuICAgICAgT2JqZWN0LnZhbHVlcyhsYXllci5fX3BhcmVudC5fZ3JvdXAuX2ZlYXR1cmVHcm91cC5fbGF5ZXJzKS5mb3JFYWNoKFxuICAgICAgICBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgaWYgKHYuX2dyb3VwICYmIHYuX2dyb3VwLl9zcGlkZXJmaWVkKSBpc1NwaWRlcmZpZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZGl2LmxlYWZsZXQtbWFya2VyLWljb24nKSkuZm9yRWFjaChcbiAgICAgICAgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiAoZC5zdHlsZS5vcGFjaXR5ID0gaXNTcGlkZXJmaWVkID8gMC4zMyA6IDEpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nLmxlYWZsZXQtbWFya2VyLWljb24nKSkuZm9yRWFjaChcbiAgICAgICAgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiAoZC5zdHlsZS5vcGFjaXR5ID0gaXNTcGlkZXJmaWVkID8gMC4zMyA6IDEpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBzdHlsZUtleSBmcm9tICcuL3N0eWxlS2V5LmpzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHlsZVBvaW50KFxuICBmZWF0dXJlLFxuICBsYXRsbmcsXG4gIG1hcCxcbiAgY29sb3JLZXlXaWRnZXQsXG4gIGZvcm1LZXlXaWRnZXRcbikge1xuICB2YXIgQ3VzdG9tSWNvbiA9IEwuSWNvbi5leHRlbmQoe1xuICAgIG9wdGlvbnM6IHtcbiAgICAgIGljb25TaXplOiBtYXAuaWNvbnNpemUgfHwgWzIwLCAyMF0sXG4gICAgICBpY29uQW5jaG9yOiBtYXAuaWNvbnNpemVcbiAgICAgICAgPyBtYXAuaWNvbnNpemUgLyA0XG4gICAgICAgIDogbWFwLmljb25hbmNob3JcbiAgICAgICAgICA/IG1hcC5pY29uYW5jaG9yXG4gICAgICAgICAgOiBbNSwgNV1cbiAgICB9XG4gIH0pXG4gIHZhciBwb2ludFN0eWxlXG5cbiAgdmFyIGtleSwgc3R5bGVPcHRpb25zXG5cbiAgaWYgKGZvcm1LZXlXaWRnZXQgJiYgZmVhdHVyZS5wcm9wZXJ0aWVzW2Zvcm1LZXlXaWRnZXQuZmllbGRdKSB7XG4gICAgdmFyIGZvcm1zID0gZm9ybUtleVdpZGdldC5rZXlzLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gay52YWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgfSlcbiAgICB2YXIgaSA9IGZvcm1zLmluZGV4T2YoZmVhdHVyZS5wcm9wZXJ0aWVzW2Zvcm1LZXlXaWRnZXQuZmllbGRdLnRvTG93ZXJDYXNlKCkpXG5cbiAgICBrZXkgPSBmb3JtS2V5V2lkZ2V0LmtleXMuZmluZChmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBrLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgIGZlYXR1cmUucHJvcGVydGllc1tmb3JtS2V5V2lkZ2V0LmZpZWxkXS50b0xvd2VyQ2FzZSgpXG4gICAgICApXG4gICAgfSlcblxuICAgIHN0eWxlT3B0aW9ucyA9IGtleVxuICAgICAgPyB7XG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBpbmRleDogaSxcbiAgICAgICAgZm9ybXM6IGZvcm1zLFxuICAgICAgICBjb2xvcjoga2V5LmNvbG9yLFxuICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgZmVhdHVyZTogZmVhdHVyZVxuICAgICAgfVxuICAgICAgOiBudWxsXG4gIH0gZWxzZSBpZiAoY29sb3JLZXlXaWRnZXQgJiYgZmVhdHVyZS5wcm9wZXJ0aWVzW2NvbG9yS2V5V2lkZ2V0LmZpZWxkXSkge1xuICAgIHZhciBrZXkgPSBjb2xvcktleVdpZGdldC5rZXlzLmZpbmQoZnVuY3Rpb24oaykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgay52YWx1ZS50b0xvd2VyQ2FzZSgpID09PVxuICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXNbY29sb3JLZXlXaWRnZXQuZmllbGRdLnRvTG93ZXJDYXNlKClcbiAgICAgIClcbiAgICB9KVxuICAgIHN0eWxlT3B0aW9ucyA9IGtleVxuICAgICAgPyB7XG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBjb2xvcjoga2V5LmNvbG9yLFxuICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgZmVhdHVyZTogZmVhdHVyZVxuICAgICAgfVxuICAgICAgOiBudWxsXG4gIH1cblxuICBpZiAoc3R5bGVPcHRpb25zKSB7XG4gICAgcG9pbnRTdHlsZSA9IHN0eWxlS2V5KHN0eWxlT3B0aW9ucylcbiAgfSBlbHNlIHtcbiAgICB2YXIgY29sb3JLZXlXaWRnZXQyID0gbWFwLndpZGdldHMuZmlsdGVyKGZ1bmN0aW9uKHcpIHtcbiAgICAgIHJldHVybiB3LnR5cGUgPT09ICdjb2xvcidcbiAgICB9KVsxXVxuXG4gICAgdmFyIGZvcm1LZXlXaWRnZXQyID0gbWFwLndpZGdldHMuZmlsdGVyKGZ1bmN0aW9uKHcpIHtcbiAgICAgIHJldHVybiB3LnR5cGUgPT09ICdmb3JtJ1xuICAgIH0pWzFdXG5cbiAgICBpZiAoZm9ybUtleVdpZGdldDIgJiYgZmVhdHVyZS5wcm9wZXJ0aWVzW2Zvcm1LZXlXaWRnZXQyLmZpZWxkXSkge1xuICAgICAgdmFyIGZvcm1zID0gZm9ybUtleVdpZGdldDIua2V5cy5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICByZXR1cm4gay52YWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICB9KVxuICAgICAgdmFyIGkgPSBmb3Jtcy5pbmRleE9mKFxuICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXNbZm9ybUtleVdpZGdldDIuZmllbGRdLnRvTG93ZXJDYXNlKClcbiAgICAgIClcblxuICAgICAga2V5ID0gZm9ybUtleVdpZGdldDIua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBrLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW2Zvcm1LZXlXaWRnZXQyLmZpZWxkXS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIClcbiAgICAgIH0pXG5cbiAgICAgIHN0eWxlT3B0aW9ucyA9IGtleVxuICAgICAgICA/IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICBmb3JtczogZm9ybXMsXG4gICAgICAgICAgY29sb3I6IGtleS5jb2xvcixcbiAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICBmZWF0dXJlOiBmZWF0dXJlXG4gICAgICAgIH1cbiAgICAgICAgOiBudWxsXG4gICAgfSBlbHNlIGlmIChjb2xvcktleVdpZGdldDIgJiYgZmVhdHVyZS5wcm9wZXJ0aWVzW2NvbG9yS2V5V2lkZ2V0Mi5maWVsZF0pIHtcbiAgICAgIHZhciBrZXkgPSBjb2xvcktleVdpZGdldDIua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBrLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW2NvbG9yS2V5V2lkZ2V0Mi5maWVsZF0udG9Mb3dlckNhc2UoKVxuICAgICAgICApXG4gICAgICB9KVxuICAgICAgc3R5bGVPcHRpb25zID0ga2V5XG4gICAgICAgID8ge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIGNvbG9yOiBrZXkuY29sb3IsXG4gICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgZmVhdHVyZTogZmVhdHVyZVxuICAgICAgICB9XG4gICAgICAgIDogbnVsbFxuICAgIH1cblxuICAgIGlmIChzdHlsZU9wdGlvbnMpIHtcbiAgICAgIHBvaW50U3R5bGUgPSBzdHlsZUtleShzdHlsZU9wdGlvbnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdmcgPVxuICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PGNpcmNsZSBjeD1cIjZcIiBjeT1cIjZcIiByPVwiNVwiIGZpbGw9XCInICtcbiAgICAgICAgJyMzOGYnICtcbiAgICAgICAgJ1wiLz48L3N2Zz4nXG4gICAgICBwb2ludFN0eWxlID0ge1xuICAgICAgICBjbGFzczogJ2RlZmF1bHQnLFxuICAgICAgICBzdmc6IGVuY29kZVVSSSgnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICsgd2luZG93LmJ0b2Eoc3ZnKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgaWNvblVybCA9IHBvaW50U3R5bGUuc3ZnXG4gIHZhciBpY29uID0gbmV3IEN1c3RvbUljb24oe1xuICAgIGljb25Vcmw6IGljb25VcmxcbiAgfSlcbiAgcmV0dXJuIEwubWFya2VyKGxhdGxuZywge1xuICAgIGljb246IGljb25cbiAgfSlcbn1cbiIsImltcG9ydCBzdHlsZUtleSBmcm9tICcuL3N0eWxlS2V5LmpzJ1xuaW1wb3J0IHsgbGluZVdlaWdodHMsIGxpbmVEYXNoQXJyYXlzIH0gZnJvbSAnLi9oZWxwZXJzLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHlsZU5vblBvaW50KGZlYXR1cmUsIG9wdGlvbnMsIGluZGV4KSB7XG4gIHZhciBsZWFmbGV0ID0gb3B0aW9ucy5sZWFmbGV0LFxuICAgIGZvcm1LZXlXaWRnZXQgPSBvcHRpb25zLmZvcm1LZXlXaWRnZXQsXG4gICAgY29sb3JLZXlXaWRnZXQgPSBvcHRpb25zLmNvbG9yS2V5V2lkZ2V0LFxuICAgIGNvbG9ycyA9IG9wdGlvbnMuY29sb3JzLFxuICAgIGZvcm1zID0gb3B0aW9ucy5mb3Jtc1xuICB2YXIgY29sb3JLZXkgPSBjb2xvcktleVdpZGdldFxuICAgID8gY29sb3JLZXlXaWRnZXQua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGsudmFsdWUudG9Mb3dlckNhc2UoKSA9PT1cbiAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXNbY29sb3JLZXlXaWRnZXQuZmllbGRdLnRvTG93ZXJDYXNlKClcbiAgICAgIClcbiAgICB9KVxuICAgIDogbnVsbFxuICB2YXIgZm9ybUtleSA9IGZvcm1LZXlXaWRnZXRcbiAgICA/IGZvcm1LZXlXaWRnZXQua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGsudmFsdWUudG9Mb3dlckNhc2UoKSA9PT1cbiAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXNbZm9ybUtleVdpZGdldC5maWVsZF0udG9Mb3dlckNhc2UoKVxuICAgICAgKVxuICAgIH0pXG4gICAgOiBudWxsXG5cbiAgaWYgKCFjb2xvcktleSAmJiAhZm9ybUtleSkge1xuICAgIHJldHVybiB7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZmlsbE9wYWNpdHk6IDEsXG4gICAgICBjb2xvcjogJ3JlZCdcbiAgICB9XG4gIH1cblxuICB2YXIgY29sb3IgPSBjb2xvcktleSA/IGNvbG9yS2V5LmNvbG9yIDogZm9ybUtleSA/IGZvcm1LZXkuY29sb3IgOiBudWxsXG4gIHZhciBmb3JtS2V5Rm9ybSA9IGZvcm1LZXlXaWRnZXRcbiAgICA/IGZvcm1LZXlXaWRnZXQua2V5cy5yZWR1Y2UoZnVuY3Rpb24oYSwgYykge1xuICAgICAgcmV0dXJuIGMuZm9ybVxuICAgIH0pXG4gICAgOiBudWxsXG4gIHZhciBjb2xvcktleUZvcm0gPSBjb2xvcktleVdpZGdldFxuICAgID8gY29sb3JLZXlXaWRnZXQua2V5cy5yZWR1Y2UoZnVuY3Rpb24oYSwgYykge1xuICAgICAgcmV0dXJuIGMuZm9ybVxuICAgIH0pXG4gICAgOiBudWxsXG5cbiAgaWYgKChmb3JtcyAmJiBmb3JtS2V5Rm9ybSA9PT0gJ2xpbmUnKSB8fCAoZm9ybXMgJiYgY29sb3JLZXlGb3JtID09PSAnbGluZScpKSB7XG4gICAgdmFyIGkgPSBmb3Jtcy5pbmRleE9mKGZlYXR1cmUucHJvcGVydGllc1tmb3JtS2V5V2lkZ2V0LmZpZWxkXSlcblxuICAgIGlmIChpID4gLTEpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbG9yOlxuICAgICAgICAgIGNvbG9yc1tpXVtpbmRleF0gPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyAnI2NhZDJkMydcbiAgICAgICAgICAgIDogY29sb3JzW2ldW2luZGV4XSAhPT0gbnVsbFxuICAgICAgICAgICAgICA/IGNvbG9yc1tpXVtpbmRleF1cbiAgICAgICAgICAgICAgOiBjb2xvcixcbiAgICAgICAgd2VpZ2h0OiBsaW5lV2VpZ2h0c1tpXVtpbmRleF0sXG4gICAgICAgIGxpbmVDYXA6ICdzcXVhcmUnLFxuICAgICAgICBkYXNoQXJyYXk6IGxpbmVEYXNoQXJyYXlzW2ldID8gbGluZURhc2hBcnJheXNbaV1baW5kZXhdIDogbnVsbFxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChmb3JtS2V5Rm9ybSA9PT0gJ2xpbmUnIHx8IGNvbG9yS2V5Rm9ybSA9PT0gJ2xpbmUnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgIHdlaWdodDogMixcbiAgICAgIGxpbmVDYXA6ICdzcXVhcmUnLFxuICAgICAgZGFzaEFycmF5OiAnMyw3J1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoY29sb3JLZXkgJiYgY29sb3JLZXkuZm9ybSA9PT0gJ3BhdHRlcm4nKSB7XG4gICAgICB2YXIgcGF0dGVyblxuXG4gICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgIGNhc2UgY29sb3JLZXkucGF0dGVyblswXS5pbmRleE9mKCdzdHJpcGUnKSA+IC0xOlxuICAgICAgICB2YXIgcGF0dGVybk9wdGlvbnMgPSB7XG4gICAgICAgICAgd2VpZ2h0OiAzLFxuICAgICAgICAgIHNwYWNlV2VpZ2h0OiAzLFxuICAgICAgICAgIGNvbG9yOiBjb2xvcktleS5wYXR0ZXJuWzFdLFxuICAgICAgICAgIHNwYWNlQ29sb3I6IGNvbG9yS2V5LnBhdHRlcm5bY29sb3JLZXkucGF0dGVybi5sZW5ndGggLSAxXSxcbiAgICAgICAgICBzcGFjZU9wYWNpdHk6IDEsXG4gICAgICAgICAgYW5nbGU6IDQ1XG4gICAgICAgIH1cbiAgICAgICAgcGF0dGVybiA9IG5ldyBMLlN0cmlwZVBhdHRlcm4ocGF0dGVybk9wdGlvbnMpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgY29sb3JLZXkucGF0dGVyblswXS5pbmRleE9mKCdkb3QnKSA+IC0xOlxuICAgICAgICB2YXIgc2hhcGVPcHRpb25zID0ge1xuICAgICAgICAgIHg6IDQsXG4gICAgICAgICAgeTogNCxcbiAgICAgICAgICByYWRpdXM6IDIsXG4gICAgICAgICAgZmlsbDogdHJ1ZSxcbiAgICAgICAgICBzdHJva2U6IGZhbHNlLFxuICAgICAgICAgIGZpbGxDb2xvcjogY29sb3JLZXkucGF0dGVybltjb2xvcktleS5wYXR0ZXJuLmxlbmd0aCAtIDFdLFxuICAgICAgICAgIGZpbGxPcGFjaXR5OiAxXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNoYXBlID0gbmV3IEwuUGF0dGVybkNpcmNsZShzaGFwZU9wdGlvbnMpXG4gICAgICAgIHZhciBwYXR0ZXJuT3B0aW9ucyA9IHtcbiAgICAgICAgICB3aWR0aDogOCxcbiAgICAgICAgICBoZWlnaHQ6IDhcbiAgICAgICAgfVxuICAgICAgICBwYXR0ZXJuID0gbmV3IEwuUGF0dGVybihwYXR0ZXJuT3B0aW9ucylcbiAgICAgICAgcGF0dGVybi5hZGRTaGFwZShzaGFwZSlcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgcGF0dGVybi5hZGRUbyhvcHRpb25zLm1hcC5sZWFmbGV0KVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZmlsbFBhdHRlcm46IHBhdHRlcm4gPyBwYXR0ZXJuIDogbnVsbCxcbiAgICAgICAgZmlsbENvbG9yOiBjb2xvcixcbiAgICAgICAgY29sb3I6IGRlZmF1bHRDb2xvcixcbiAgICAgICAgZmlsbE9wYWNpdHk6IDAuNyxcbiAgICAgICAgb3BhY2l0eTogMC41LFxuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGxpbmVDYXA6ICdzcXVhcmUnXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpbmVDb2xvclxuICAgIHZhciBsaW5lV2VpZ2h0XG4gICAgdmFyIGxpbmVPcGFjaXR5XG5cbiAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICBjYXNlIGZlYXR1cmUuZ2VvbWV0cnkudHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2xpbmUnKSA+IC0xOlxuICAgICAgbGluZUNvbG9yID0gY2hyb21hKGNvbG9yKVxuICAgICAgICAuYnJpZ2h0ZW4oKVxuICAgICAgICAuaGV4KClcbiAgICAgIGxpbmVPcGFjaXR5ID0gMVxuICAgICAgbGluZVdlaWdodCA9IDRcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlIGZlYXR1cmUuZ2VvbWV0cnkudHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3BvbHlnb24nKSA+IC0xOlxuICAgICAgbGluZUNvbG9yID0gZGVmYXVsdENvbG9yXG4gICAgICBsaW5lT3BhY2l0eSA9IDAuNVxuICAgICAgbGluZVdlaWdodCA9IDJcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGxQYXR0ZXJuOiBwYXR0ZXJuLFxuICAgICAgZmlsbENvbG9yOiBjb2xvcixcbiAgICAgIGNvbG9yOiBsaW5lQ29sb3IsXG4gICAgICBmaWxsT3BhY2l0eTogMC43LFxuICAgICAgb3BhY2l0eTogbGluZU9wYWNpdHksXG4gICAgICB3ZWlnaHQ6IGxpbmVXZWlnaHRcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBoYW5kbGVGZWF0dXJlRXZlbnRzIGZyb20gJy4vaGFuZGxlRmVhdHVyZUV2ZW50cy5qcydcbmltcG9ydCBzdHlsZVBvaW50IGZyb20gJy4vc3R5bGVQb2ludC5qcydcbmltcG9ydCBzdHlsZU5vblBvaW50IGZyb20gJy4vc3R5bGVOb25Qb2ludC5qcydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZUdlb0pzb25PcHRpb25zKG1hcCwgY29sb3JLZXlXaWRnZXQsIGZvcm1LZXlXaWRnZXQpIHtcbiAgZnVuY3Rpb24gZmlsdGVyKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gbWFwLmZpbHRlcnNcbiAgICAgIC5tYXAoZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZihmZWF0dXJlKVxuICAgICAgfSlcbiAgICAgIC5ldmVyeShmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmICE9PSBmYWxzZVxuICAgICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uRWFjaEZlYXR1cmUoZmVhdHVyZSwgbGF5ZXIpIHtcbiAgICBoYW5kbGVGZWF0dXJlRXZlbnRzKGZlYXR1cmUsIGxheWVyLCBtYXApXG4gIH1cblxuICB2YXIgZm9ybSA9IGZvcm1LZXlXaWRnZXRcbiAgICA/IGZvcm1LZXlXaWRnZXQua2V5cy5yZWR1Y2UoZnVuY3Rpb24oYSwgYykge1xuICAgICAgcmV0dXJuIGMuZm9ybVxuICAgIH0pXG4gICAgOiBudWxsXG5cbiAgaWYgKGZvcm1LZXlXaWRnZXQgJiYgZm9ybSA9PT0gJ2xpbmUnKSB7XG4gICAgdmFyIGNvbG9ycyA9IFtdXG4gICAgdmFyIGZvcm1zID0gW11cbiAgICBmb3JtcyA9IGZvcm1LZXlXaWRnZXQua2V5cy5tYXAoZnVuY3Rpb24oZikge1xuICAgICAgcmV0dXJuIGYudmFsdWVcbiAgICB9KVxuICAgIGZvcm1zLmZvckVhY2goZnVuY3Rpb24oZiwgaSkge1xuICAgICAgc3dpdGNoIChpKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGNvbG9ycy5wdXNoKFsndHJhbnNwYXJlbnQnLCBudWxsXSlcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAxOlxuICAgICAgICBjb2xvcnMucHVzaChbbnVsbCwgZGVmYXVsdENvbG9yXSlcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAyOlxuICAgICAgICBjb2xvcnMucHVzaChbJyMwMDAwMDAnLCBudWxsXSlcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAzOlxuICAgICAgICBjb2xvcnMucHVzaChbJyNmZmZmZmYnLCBudWxsXSlcbiAgICAgICAgYnJlYWtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29sb3JzLnB1c2goW251bGwsIG51bGxdKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0pXG4gICAgdmFyIHN0eWxlT3B0aW9ucyA9IHtcbiAgICAgIG1hcDogbWFwLFxuICAgICAgZm9ybUtleVdpZGdldDogZm9ybUtleVdpZGdldCxcbiAgICAgIGNvbG9yS2V5V2lkZ2V0OiBjb2xvcktleVdpZGdldCxcbiAgICAgIGNvbG9yczogY29sb3JzLFxuICAgICAgZm9ybXM6IGZvcm1zXG4gICAgfVxuICAgIHZhciBiYWNrZ3JvdW5kT3B0aW9ucyA9IHtcbiAgICAgIGZpbHRlcjogZmlsdGVyLFxuICAgICAgb25FYWNoRmVhdHVyZTogb25FYWNoRmVhdHVyZSxcbiAgICAgIHBvaW50VG9MYXllcjpcbiAgICAgICAgbWFwLnBvaW50U3R5bGUgfHxcbiAgICAgICAgZnVuY3Rpb24oZmVhdHVyZSwgbGF0bG5nKSB7XG4gICAgICAgICAgcmV0dXJuIHN0eWxlUG9pbnQoZmVhdHVyZSwgbGF0bG5nLCBtYXAsIGNvbG9yS2V5V2lkZ2V0LCBmb3JtS2V5V2lkZ2V0KVxuICAgICAgICB9LFxuICAgICAgc3R5bGU6XG4gICAgICAgIG1hcC5ub25Qb2ludFN0eWxlIHx8XG4gICAgICAgIGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICAgICAgICByZXR1cm4gc3R5bGVOb25Qb2ludChmZWF0dXJlLCBzdHlsZU9wdGlvbnMsIDApXG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIGZvcmVncm91bmRPcHRpb25zID0ge1xuICAgICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgICBvbkVhY2hGZWF0dXJlOiBvbkVhY2hGZWF0dXJlLFxuICAgICAgcG9pbnRUb0xheWVyOlxuICAgICAgICBtYXAucG9pbnRTdHlsZSB8fFxuICAgICAgICBmdW5jdGlvbihmZWF0dXJlLCBsYXRsbmcpIHtcbiAgICAgICAgICByZXR1cm4gc3R5bGVQb2ludChmZWF0dXJlLCBsYXRsbmcsIG1hcCwgY29sb3JLZXlXaWRnZXQsIGZvcm1LZXlXaWRnZXQpXG4gICAgICAgIH0sXG4gICAgICBzdHlsZTpcbiAgICAgICAgbWFwLm5vblBvaW50U3R5bGUgfHxcbiAgICAgICAgZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgICAgICAgIHJldHVybiBzdHlsZU5vblBvaW50KGZlYXR1cmUsIHN0eWxlT3B0aW9ucywgMSlcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2JhY2tncm91bmRPcHRpb25zLCBmb3JlZ3JvdW5kT3B0aW9uc11cbiAgfSBlbHNlIHtcbiAgICB2YXIgc3R5bGVPcHRpb25zID0ge1xuICAgICAgbWFwOiBtYXAsXG4gICAgICBmb3JtS2V5V2lkZ2V0OiBmb3JtS2V5V2lkZ2V0LFxuICAgICAgY29sb3JLZXlXaWRnZXQ6IGNvbG9yS2V5V2lkZ2V0XG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIGZpbHRlcjogZmlsdGVyLFxuICAgICAgICBvbkVhY2hGZWF0dXJlOiBvbkVhY2hGZWF0dXJlLFxuICAgICAgICBwb2ludFRvTGF5ZXI6XG4gICAgICAgICAgbWFwLnBvaW50U3R5bGUgfHxcbiAgICAgICAgICBmdW5jdGlvbihmZWF0dXJlLCBsYXRsbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHlsZVBvaW50KFxuICAgICAgICAgICAgICBmZWF0dXJlLFxuICAgICAgICAgICAgICBsYXRsbmcsXG4gICAgICAgICAgICAgIG1hcCxcbiAgICAgICAgICAgICAgY29sb3JLZXlXaWRnZXQsXG4gICAgICAgICAgICAgIGZvcm1LZXlXaWRnZXRcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9LFxuICAgICAgICBzdHlsZTpcbiAgICAgICAgICBtYXAubm9uUG9pbnRTdHlsZSB8fFxuICAgICAgICAgIGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHlsZU5vblBvaW50KGZlYXR1cmUsIHN0eWxlT3B0aW9ucylcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9XG59XG4iLCJpbXBvcnQgbWFrZUdlb0pzb25PcHRpb25zIGZyb20gJy4vbWFrZUdlb0pzb25PcHRpb25zLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWtlTGF5ZXJzKG1hcCkge1xuICB2YXIgY29sb3JLZXlXaWRnZXQsIGZvcm1LZXlXaWRnZXRcblxuICBpZiAobWFwLndpZGdldHMpIHtcbiAgICBjb2xvcktleVdpZGdldCA9IG1hcC53aWRnZXRzLmZpbmQoZnVuY3Rpb24odykge1xuICAgICAgcmV0dXJuIHcudHlwZSA9PT0gJ2NvbG9yJ1xuICAgIH0pXG4gICAgZm9ybUtleVdpZGdldCA9IG1hcC53aWRnZXRzLmZpbmQoZnVuY3Rpb24odykge1xuICAgICAgcmV0dXJuIHcudHlwZSA9PT0gJ2Zvcm0nXG4gICAgfSlcbiAgfVxuXG4gIHZhciBnZW9Kc29uT3B0aW9ucyA9IG1hcC5nZW9Kc29uT3B0aW9uc1xuICAgID8gbWFwLmdlb0pzb25PcHRpb25zKG1hcCwgY29sb3JLZXlXaWRnZXQsIGZvcm1LZXlXaWRnZXQpXG4gICAgOiBtYWtlR2VvSnNvbk9wdGlvbnMobWFwLCBjb2xvcktleVdpZGdldCwgZm9ybUtleVdpZGdldClcbiAgbWFwLmpzb24uZm9yRWFjaChmdW5jdGlvbihqc29uLCBpKSB7XG4gICAgdmFyIGNvbG9yXG5cbiAgICBpZiAoY29sb3JLZXlXaWRnZXQpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uTmFtZSA9IGpzb24uZmVhdHVyZXNbMF0ucHJvcGVydGllc1tjb2xvcktleVdpZGdldC5maWVsZF1cbiAgICAgIHZhciBjb2xvcktleSA9IGNvbG9yS2V5V2lkZ2V0LmtleXMuZmluZChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS52YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBjb2xsZWN0aW9uTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICB9KVxuICAgICAgY29sb3IgPSBjb2xvcktleSA/IGNvbG9yS2V5LmNvbG9yIDogJyMwMDAwMDAnXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbG9yID0gJyMwMDAwMDAnXG4gICAgfVxuXG4gICAgdmFyIGFsbFBvaW50cyA9IGpzb24uZmVhdHVyZXMuZXZlcnkoZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgICAgcmV0dXJuIGZlYXR1cmUuZ2VvbWV0cnkgJiYgZmVhdHVyZS5nZW9tZXRyeS50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdwb2ludCdcbiAgICB9KVxuXG4gICAgbWFwLmdyb3Vwcy5wdXNoKFxuICAgICAgbmV3IEwuTWFya2VyQ2x1c3Rlckdyb3VwKHtcbiAgICAgICAgc2hvd0NvdmVyYWdlT25Ib3ZlcjogZmFsc2UsXG4gICAgICAgIHpvb21Ub0JvdW5kc09uQ2xpY2s6IGZhbHNlLFxuICAgICAgICBtYXhDbHVzdGVyUmFkaXVzOlxuICAgICAgICAgIGFsbFBvaW50cyAmJiBtYXAuY2x1c3RlcmRpc3RhbmNlID8gbWFwLmNsdXN0ZXJkaXN0YW5jZSA6IE5hTixcbiAgICAgICAgaWNvbkNyZWF0ZUZ1bmN0aW9uOiBmdW5jdGlvbiBpY29uQ3JlYXRlRnVuY3Rpb24oY2x1c3Rlcikge1xuICAgICAgICAgIHJldHVybiBMLmRpdkljb24oe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnaWNvbi1ncm91cCcsXG4gICAgICAgICAgICBodG1sOlxuICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ0ZXh0XCIgc3R5bGU9XCJib3JkZXI6IDJweCBzb2xpZCcgK1xuICAgICAgICAgICAgICBjb2xvciArXG4gICAgICAgICAgICAgICc7IGNvbG9yOicgK1xuICAgICAgICAgICAgICBjb2xvciArXG4gICAgICAgICAgICAgICdcIj4nICtcbiAgICAgICAgICAgICAgY2x1c3Rlci5nZXRDaGlsZENvdW50KCkgK1xuICAgICAgICAgICAgICAnPC9zcGFuPidcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIClcbiAgICBnZW9Kc29uT3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgaWYgKGNvbG9yS2V5V2lkZ2V0KSB7XG4gICAgICAgIGpzb24uZmVhdHVyZXMgPSBqc29uLmZlYXR1cmVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgIHJldHVybiBiLnByb3BlcnRpZXNbY29sb3JLZXlXaWRnZXQuZmllbGRdLmxvY2FsZUNvbXBhcmUoXG4gICAgICAgICAgICBhLnByb3BlcnRpZXNbY29sb3JLZXlXaWRnZXQuZmllbGRdXG4gICAgICAgICAgKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB2YXIgZ2VvSnNvbiA9IEwuZ2VvSnNvbihqc29uLCBvcHRpb24pXG4gICAgICBtYXAuZ3JvdXBzW2ldLmFkZExheWVyKGdlb0pzb24pXG4gICAgfSlcbiAgICBtYXAubGVhZmxldC5hZGRMYXllcihtYXAuZ3JvdXBzW2ldKVxuICAgIG1hcC5ncm91cHNbaV0ub24oJ2NsdXN0ZXJjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGhhbmRsZUNsdXN0ZXJDbGljayhlLCBtYXAsIGkpXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2x1c3RlckNsaWNrKGUsIG1hcCwgaSkge1xuICBtYXAubGVhZmxldC5fbGF5ZXJzW2UubGF5ZXIuX2xlYWZsZXRfaWRdLnNwaWRlcmZ5KClcblxuICBPYmplY3Qua2V5cyhtYXAubGVhZmxldC5fbGF5ZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKGxheWVyLCBpKSB7XG4gICAgaWYgKHBhcnNlSW50KGxheWVyLCAxMCkgIT09IGUubGF5ZXIuX2xlYWZsZXRfaWQpIHtcbiAgICAgIGlmIChtYXAubGVhZmxldC5fbGF5ZXJzW2xheWVyXS51bnNwaWRlcmZ5KVxuICAgICAgICBtYXAubGVhZmxldC5fbGF5ZXJzW2xheWVyXS51bnNwaWRlcmZ5KClcbiAgICB9XG4gIH0pXG4gIHZhciBpc1NwaWRlcmZpZWQgPSBmYWxzZVxuICBPYmplY3QudmFsdWVzKG1hcC5ncm91cHNbaV0uX2ZlYXR1cmVHcm91cC5fbGF5ZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICBpZiAodi5fZ3JvdXAgJiYgdi5fZ3JvdXAuX3NwaWRlcmZpZWQpIGlzU3BpZGVyZmllZCA9IHRydWVcbiAgfSlcbiAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdkaXYubGVhZmxldC1tYXJrZXItaWNvbicpKS5mb3JFYWNoKFxuICAgIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiAoZC5zdHlsZS5vcGFjaXR5ID0gaXNTcGlkZXJmaWVkID8gMC4zMyA6IDEpXG4gICAgfVxuICApXG4gIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nLmxlYWZsZXQtbWFya2VyLWljb24nKSkuZm9yRWFjaChcbiAgICBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gKGQuc3R5bGUub3BhY2l0eSA9IGlzU3BpZGVyZmllZCA/IDAuMzMgOiAxKVxuICAgIH1cbiAgKVxuICBPYmplY3QudmFsdWVzKG1hcC5ncm91cHNbaV0uX2ZlYXR1cmVHcm91cC5fbGF5ZXJzKS5maWx0ZXIoZnVuY3Rpb24odikge1xuICAgIGUubGF5ZXJcbiAgICAgIC5nZXRBbGxDaGlsZE1hcmtlcnMoKVxuICAgICAgLm1hcChmdW5jdGlvbihtKSB7XG4gICAgICAgIHJldHVybiBtLmdldEVsZW1lbnQoKVxuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24obSkge1xuICAgICAgICByZXR1cm4gbVxuICAgICAgfSlcbiAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgcmV0dXJuIChtLnN0eWxlLm9wYWNpdHkgPSAxKVxuICAgICAgfSlcbiAgfSlcbn1cbiIsImltcG9ydCBDdXN0b21NYXAgZnJvbSAnLi9DdXN0b21NYXAuanMnXG5pbXBvcnQgbWFrZUxheWVycyBmcm9tICcuL21ha2VMYXllcnMuanMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hcFdpZGdldHNUb1N0YXRlKG9wdGlvbnMpIHtcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgb3B0aW9ucy5zbHVnICsgJyAubWFwJylcblxuICB2YXIgbWFwID0gbmV3IEN1c3RvbU1hcChjb250YWluZXIsIG9wdGlvbnMpLnJlbmRlcigpXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZXR1cm4gZmV0Y2goXG4gICAgICAnaHR0cHM6Ly9jc2lzLmNhcnRvLmNvbS9hcGkvdjIvc3FsP2FwaV9rZXk9JyArXG4gICAgICAgIG1hcC5hcGlrZXkgK1xuICAgICAgICAnJmZvcm1hdD1nZW9qc29uJnE9U0VMRUNUJTIwKiUyMEZST00lMjAnICtcbiAgICAgICAgbWFwLnRhYmxlXG4gICAgKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICByZXR1cm4gcmVzcC5qc29uKClcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgIHZhciBjb2xvcktleVdpZGdldCA9IG1hcC53aWRnZXRzLmZpbmQoZnVuY3Rpb24odykge1xuICAgICAgICAgIHJldHVybiB3LnR5cGUgPT09ICdjb2xvcidcbiAgICAgICAgfSlcbiAgICAgICAgbWFwLmpzb24gPSBbanNvbl1cblxuICAgICAgICBpZiAoY29sb3JLZXlXaWRnZXQpIHtcbiAgICAgICAgICBtYXAuanNvbiA9IFtdXG4gICAgICAgICAgdmFyIGZlYXR1cmVHcm91cHMgPSBqc29uLmZlYXR1cmVzLmdyb3VwQnkoXG4gICAgICAgICAgICBjb2xvcktleVdpZGdldC5maWVsZCxcbiAgICAgICAgICAgICdwcm9wZXJ0aWVzJ1xuICAgICAgICAgIClcbiAgICAgICAgICBPYmplY3Qua2V5cyhmZWF0dXJlR3JvdXBzKVxuICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICByZXR1cm4gZmVhdHVyZUdyb3Vwc1tiXVswXS5wcm9wZXJ0aWVzW1xuICAgICAgICAgICAgICAgIGNvbG9yS2V5V2lkZ2V0LmZpZWxkXG4gICAgICAgICAgICAgIF0ubG9jYWxlQ29tcGFyZShcbiAgICAgICAgICAgICAgICBmZWF0dXJlR3JvdXBzW2FdWzBdLnByb3BlcnRpZXNbY29sb3JLZXlXaWRnZXQuZmllbGRdXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICAgICAgICAgICAgbWFwLmpzb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgICAgICAgICAgICBmZWF0dXJlczogZmVhdHVyZUdyb3Vwc1tmZWF0dXJlXVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb3B0aW9ucy53aWRnZXRzLmxlbmd0aCkge1xuICAgICAgICAgIG1ha2VMYXllcnMobWFwKVxuICAgICAgICAgIHZhciBib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIG9wdGlvbnMuc2x1ZyArICcgI2NvbnRyb2xzJylcbiAgICAgICAgICBib3guaW5uZXJIVE1MID0gJydcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMud2lkZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uKHcsIHgpIHtcbiAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAnIycgKyBvcHRpb25zLnNsdWcgKyAnIC53aWRnZXQuJyArIG9wdGlvbnMud2lkZ2V0c1t4XS5maWVsZFxuICAgICAgICAgIClcblxuICAgICAgICAgIGlmIChlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpICYmIHdpZGdldENvbnRlbnRbeF0ub3B0aW9ucykge1xuICAgICAgICAgICAgbmV3IENob2ljZXMoXG4gICAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3Rvcignc2VsZWN0JyksXG4gICAgICAgICAgICAgIHdpZGdldENvbnRlbnRbeF0ub3B0aW9uc1xuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W2lkXj1cXCdzZWFyY2hcXCddJykpIHtcbiAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJyNyZXNldEJ1dHRvbicpXG4gICAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGhhbmRsZVJlc2V0KGVsZW1lbnQsIG1hcCwgeClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc2VsZWN0cyA9IEFycmF5LmZyb20oZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzZWxlY3QnKSlcbiAgICAgICAgICB2YXIgY2hlY2tzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cXCdjaGVja2JveFxcJ10nKVxuICAgICAgICAgIClcbiAgICAgICAgICB2YXIgc2VhcmNoID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cXCd0ZXh0XFwnXTpub3QoLmNob2ljZXNfX2lucHV0KScpXG4gICAgICAgICAgKVxuICAgICAgICAgIHZhciB0b2dnbGUgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVxcJ3JhZGlvXFwnXScpXG4gICAgICAgICAgKVxuICAgICAgICAgIHZhciBpbnB1dHMgPSBzZWxlY3RzXG4gICAgICAgICAgICAuY29uY2F0KGNoZWNrcylcbiAgICAgICAgICAgIC5jb25jYXQoc2VhcmNoKVxuICAgICAgICAgICAgLmNvbmNhdCh0b2dnbGUpIC8vIGlmICghaW5wdXRzLmxlbmd0aCkgbWFrZUxheWVycyhtYXApXG5cbiAgICAgICAgICB2YXIgaW5pdGlhbGl6ZWQgPSAwXG5cbiAgICAgICAgICB2YXIgY291bnQgPSBpbnB1dHMubGVuZ3RoXG4gICAgICAgICAgaW5wdXRzLmZvckVhY2goZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVDaGFuZ2UoXG4gICAgICAgICAgICAgICAgICBtYXAsXG4gICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgb3B0aW9ucy53aWRnZXRzLFxuICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgIGNvdW50LFxuICAgICAgICAgICAgICAgICAgKytpbml0aWFsaXplZFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGhhbmRsZUNoYW5nZShcbiAgICAgICAgICAgICAgICAgIG1hcCxcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICBvcHRpb25zLndpZGdldHMsXG4gICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICAgICAgICArK2luaXRpYWxpemVkXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJ2NyZWF0ZUV2ZW50JyBpbiBkb2N1bWVudCkge1xuICAgICAgICAgICAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKVxuICAgICAgICAgICAgICBldnQuaW5pdEV2ZW50KCdjaGFuZ2UnLCBmYWxzZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgaW5wdXQuZGlzcGF0Y2hFdmVudChldnQpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpbnB1dC5maXJlRXZlbnQoJ29uY2hhbmdlJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdy5tYXBfaWQgPSBtYXAuaWRcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChtYXAudHJhbnNsYXRpb25zKSB7XG4gICAgICAgICAgdmFyIHRyYW5zbGF0YWJsZU5vZGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmFuc2xhdGUnKVxuICAgICAgICAgIClcbiAgICAgICAgICB2YXIgdHJhbnNsYXRhYmxlU3RyaW5ncyA9IE9iamVjdC5rZXlzKG1hcC50cmFuc2xhdGlvbnMpLnNvcnQoZnVuY3Rpb24oXG4gICAgICAgICAgICBhLFxuICAgICAgICAgICAgYlxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGhcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRyYW5zbGF0YWJsZU5vZGVzLmZvckVhY2goZnVuY3Rpb24oZWwsIGkpIHtcbiAgICAgICAgICAgIHRyYW5zbGF0YWJsZVN0cmluZ3MuZm9yRWFjaChmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhtYXAudHJhbnNsYXRpb25zW3RdKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKCdcXFxcYignICsgUmVnRXhwLmVzY2FwZSh0KSArICcpJywgJ2dpJylcbiAgICAgICAgICAgICAgICBlbC5pbm5lckhUTUwgPSBlbC5pbm5lckhUTUwucmVwbGFjZShyZSwgbWFwLnRyYW5zbGF0aW9uc1t0XSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZShtYXApXG4gICAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBoYW5kbGVSZXNldChlbGVtZW50LCBtYXAsIHgpIHtcbiAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVxcJ3RleHRcXCddJykudmFsdWUgPSAnJ1xuICBpZiAobWFwLmdyb3Vwcy5sZW5ndGgpIG1hcC5yZW1vdmVHcm91cHMoKVxuXG4gIG1hcC5maWx0ZXJzW3hdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIG1ha2VMYXllcnMobWFwKVxufVxuXG5mdW5jdGlvbiBoYW5kbGVDaGFuZ2UobWFwLCBlbGVtZW50LCB3aWRnZXRzLCB4LCBjb3VudCwgaW5pdGlhbGl6ZWQpIHtcbiAgdmFyIG9wdGlvbnMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpXG4gICAgPyBBcnJheS5mcm9tKGVsZW1lbnQucXVlcnlTZWxlY3Rvcignc2VsZWN0Jykub3B0aW9ucylcbiAgICA6IGVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cXCd0ZXh0XFwnXScpXG4gICAgICA/IEFycmF5LmZyb20oZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVxcJ3RleHRcXCddJykpXG4gICAgICA6IEFycmF5LmZyb20oZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpKVxuICB2YXIgc2VsZWN0aW9ucyA9IGVsZW1lbnQucXVlcnlTZWxlY3Rvcignc2VsZWN0JylcbiAgICA/IEFycmF5LmZyb20oZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKS5vcHRpb25zKVxuICAgIDogZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVxcJ3RleHRcXCddJylcbiAgICAgID8gQXJyYXkuZnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XFwndGV4dFxcJ10nKSlcbiAgICAgIDogQXJyYXkuZnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKSlcbiAgdmFyIHBvc3NpYmxlQ2hlY2tzID0gQXJyYXkuZnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0JykpLm1hcChcbiAgICBmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5uYW1lLnRvTG93ZXJDYXNlKClcbiAgICB9XG4gIClcbiAgdmFyIHBvc3NpYmxlT3B0aW9ucyA9IHdpZGdldHNbeF0ua2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGtleS52YWx1ZS50b0xvd2VyQ2FzZSgpXG4gIH0pXG5cbiAgdmFyIHBvc3NpYmxlUXVlcmllcyA9IHBvc3NpYmxlQ2hlY2tzLmNvbmNhdChwb3NzaWJsZU9wdGlvbnMpXG4gIHZhciBxdWVyeSA9IEFycmF5LmZyb20oc2VsZWN0aW9ucykubWFwKGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVxcJ2NoZWNrYm94XFwnXScpXG4gICAgICA/IG8ubmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICA6IG8udmFsdWUudG9Mb3dlckNhc2UoKVxuICB9KVxuXG4gIG1hcC5maWx0ZXJzW3dpZGdldHNbeF0uaWRdID1cbiAgICB3aWRnZXRzW3hdLmlucHV0ID09PSAndG9nZ2xlJ1xuICAgICAgPyBmdW5jdGlvbihmZWF0dXJlKSB7XG4gICAgICAgIHZhciBib29sID0gdHJ1ZVxuXG4gICAgICAgIGlmIChmZWF0dXJlLnByb3BlcnRpZXMudG9nZ2xlKSB7XG4gICAgICAgICAgYm9vbCA9IGNvbnZlcnRUeXBlKHF1ZXJ5WzBdKSA/IHRydWUgOiBmYWxzZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvb2wgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYm9vbFxuICAgICAgfVxuICAgICAgOiB3aWRnZXRzW3hdLmZpZWxkID09PSAnYWxsJ1xuICAgICAgICA/IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICAgICAgICB2YXIgYm9vbCA9IHRydWVcbiAgICAgICAgICB2YXIgd2l0aERpYWNyaXRpY3MgPSBPYmplY3QudmFsdWVzKGZlYXR1cmUucHJvcGVydGllcylcbiAgICAgICAgICAgIC5qb2luKCcnKVxuICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgd2l0aG91dERpYWNyaXRpY3MgPSBPYmplY3QudmFsdWVzKGZlYXR1cmUucHJvcGVydGllcylcbiAgICAgICAgICAgIC5qb2luKCcnKVxuICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIC5sYXRpbmlzZSgpXG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB3aXRoRGlhY3JpdGljcy5pbmRleE9mKHF1ZXJ5WzBdKSA8IDAgJiZcbiAgICAgICAgICAgICAgd2l0aG91dERpYWNyaXRpY3MuaW5kZXhPZihxdWVyeVswXSkgPCAwXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBib29sID0gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gYm9vbFxuICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24oZmVhdHVyZSwgbGF5ZXJzKSB7XG4gICAgICAgICAgdmFyIGJvb2wgPSB0cnVlXG4gICAgICAgICAgdmFyIGZpZWxkID0gd2lkZ2V0c1t4XS5ncm91cGluZ1xuICAgICAgICAgICAgPyB3aWRnZXRzW3hdLmdyb3VwaW5nXG4gICAgICAgICAgICA6IHdpZGdldHNbeF0uZmllbGRcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHBvc3NpYmxlUXVlcmllcy5pbmRleE9mKGZlYXR1cmUucHJvcGVydGllc1tmaWVsZF0udG9Mb3dlckNhc2UoKSkgPlxuICAgICAgICAgICAgICAgIC0xICYmXG4gICAgICAgICAgICAgIHF1ZXJ5LmluZGV4T2YoZmVhdHVyZS5wcm9wZXJ0aWVzW2ZpZWxkXS50b0xvd2VyQ2FzZSgpKSA8IDBcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJvb2wgPSBmYWxzZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBib29sXG4gICAgICAgIH1cblxuICBpZiAoaW5pdGlhbGl6ZWQgPj0gY291bnQpIG1hcC5yZW1vdmVHcm91cHMoKVxuICBpZiAod2lkZ2V0cy5sZW5ndGggPj0geCArIDEgJiYgaW5pdGlhbGl6ZWQgPj0gY291bnQpIG1ha2VMYXllcnMobWFwKVxufVxuIiwiaW1wb3J0IHN0eWxlS2V5IGZyb20gJy4vc3R5bGVLZXkuanMnXG5pbXBvcnQgbWFwV2lkZ2V0c1RvU3RhdGUgZnJvbSAnLi9tYXBXaWRnZXRzVG9TdGF0ZS5qcydcbmltcG9ydCB7IGNhcGl0YWxpemUsIG1ha2VEcm9wZG93bk9wdGlvbnMgfSBmcm9tICcuL2hlbHBlcnMuanMnXG5pbXBvcnQgeyBwYXJzZUxlZ2VuZERhdGEgfSBmcm9tICcuL3BhcnNlcnMuanMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VXaWRnZXRzKGpzb25zLCBvcHRpb25zLCBib3hDb250ZW50KSB7XG4gIHZhciB3aWRnZXRDb250ZW50ID0gW11cbiAgb3B0aW9ucy53aWRnZXRzLmZvckVhY2goZnVuY3Rpb24odywgeCkge1xuICAgIGlmICghdy5oYXNPd25Qcm9wZXJ0eSgnaWQnKSkgdy5pZCA9IHhcbiAgICB2YXIgbGVnZW5kRGF0YSA9IHcucmVmZXJlbmNlXG4gICAgICA/IHBhcnNlTGVnZW5kRGF0YShvcHRpb25zLCBqc29uc1t4XS5mZWVkLmVudHJ5LCB3LnR5cGUpXG4gICAgICA6IHcua2V5c1xuICAgIG9wdGlvbnMud2lkZ2V0c1t4XS5rZXlzID0gbGVnZW5kRGF0YVxuICAgIHdpZGdldENvbnRlbnQucHVzaChmb3JtYXRXaWRnZXRzKG9wdGlvbnMsIHgpKVxuICAgIGJveENvbnRlbnQgKz1cbiAgICAgICc8c2VjdGlvbiBjbGFzcz1cIndpZGdldCAnICtcbiAgICAgIG9wdGlvbnMud2lkZ2V0c1t4XS5maWVsZCArXG4gICAgICAnXCI+PGgzIGNsYXNzPVwidHJhbnNsYXRlXCI+JyArXG4gICAgICB3aWRnZXRDb250ZW50W3hdLnRpdGxlICtcbiAgICAgICc8L2gzPidcbiAgICBib3hDb250ZW50ICs9IHdpZGdldENvbnRlbnRbeF0ubm9kZXNcbiAgICBib3hDb250ZW50ICs9ICc8L3NlY3Rpb24+J1xuICAgIHZhciBib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIG9wdGlvbnMuc2x1ZyArICcgI2NvbnRyb2xzJylcbiAgICBib3guaW5uZXJIVE1MID0gYm94Q29udGVudFxuICAgIHZhciBsYWJlbFRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjJyArIG9wdGlvbnMuc2x1ZyArICcgLml0ZW1UZXh0JylcbiAgICBBcnJheS5mcm9tKGxhYmVsVGV4dCkuZm9yRWFjaChmdW5jdGlvbihpdGVtVGV4dCkge1xuICAgICAgdmFyIGhlaWdodCA9IGl0ZW1UZXh0Lm9mZnNldEhlaWdodFxuICAgICAgdmFyIGZvbnRTaXplID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoaXRlbVRleHQpWydmb250LXNpemUnXVxuICAgICAgdmFyIG9mZnNldCA9IGhlaWdodCAvIHBhcnNlSW50KGZvbnRTaXplLnJlcGxhY2UoJ3B4JywgJycpLCAxMClcbiAgICAgIGl0ZW1UZXh0LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVZKCcgKyBvZmZzZXQgKiAxMCArICclKSdcbiAgICB9KVxuICB9KVxuXG4gIG1hcFdpZGdldHNUb1N0YXRlKG9wdGlvbnMpXG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdpZGdldHMob3B0aW9ucywgeCkge1xuICB2YXIgd2lkZ2V0Tm9kZXMgPSAnJ1xuICB2YXIgZHJvcGRvd25PcHRpb25zXG5cbiAgc3dpdGNoIChvcHRpb25zLndpZGdldHNbeF0uaW5wdXQpIHtcbiAgY2FzZSAndG9nZ2xlJzpcbiAgICB3aWRnZXROb2RlcyArPVxuICAgICAgICAnPGxhYmVsIGZvcj1cInRvZ2dsZV8nICtcbiAgICAgICAgb3B0aW9ucy53aWRnZXRzW3hdLmZpZWxkICtcbiAgICAgICAgJ1wiIGNsYXNzPVwidHJhbnNsYXRlXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCInICtcbiAgICAgICAgb3B0aW9ucy53aWRnZXRzW3hdLmZpZWxkICtcbiAgICAgICAgJ1wiIGlkPVwidG9nZ2xlXycgK1xuICAgICAgICBvcHRpb25zLndpZGdldHNbeF0uZmllbGQgK1xuICAgICAgICAnXCIgIHZhbHVlPVwiMVwiIGNoZWNrZWQ+U2hvdzwvbGFiZWw+J1xuICAgIHdpZGdldE5vZGVzICs9XG4gICAgICAgICc8bGFiZWwgZm9yPVwiJHRvZ2dsZV8nICtcbiAgICAgICAgb3B0aW9ucy53aWRnZXRzW3hdLmZpZWxkICtcbiAgICAgICAgJ1wiIGNsYXNzPVwidHJhbnNsYXRlXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCInICtcbiAgICAgICAgb3B0aW9ucy53aWRnZXRzW3hdLmZpZWxkICtcbiAgICAgICAgJ1wiIGlkPVwidG9nZ2xlXycgK1xuICAgICAgICBvcHRpb25zLndpZGdldHNbeF0uZmllbGQgK1xuICAgICAgICAnXCIgdmFsdWU9XCIwXCIgPkhpZGU8L2xhYmVsPidcbiAgICBicmVha1xuXG4gIGNhc2UgJ3NlYXJjaCc6XG4gICAgd2lkZ2V0Tm9kZXMgKz1cbiAgICAgICAgJzxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwic2VhcmNoXycgK1xuICAgICAgICBvcHRpb25zLndpZGdldHNbeF0uZmllbGQgK1xuICAgICAgICAnXCIgcGxhY2Vob2xkZXI9XCInICtcbiAgICAgICAgb3B0aW9ucy53aWRnZXRzW3hdLmluc3RydWN0aW9ucyArXG4gICAgICAgICdcIiBzaXplPVwiMTBcIiAvPidcbiAgICB3aWRnZXROb2RlcyArPVxuICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJyZXNldEJ1dHRvblwiIGNsYXNzPVwidHJhbnNsYXRlXCI+UmVzZXQ8L2J1dHRvbj4nXG4gICAgYnJlYWtcblxuICBjYXNlICdkcm9wZG93bic6XG4gICAgd2lkZ2V0Tm9kZXMgKz1cbiAgICAgICAgJzxzZWxlY3QgaWQ9XCJkcm9wZG93bl8nICtcbiAgICAgICAgb3B0aW9ucy53aWRnZXRzW3hdLmZpZWxkICtcbiAgICAgICAgJ1wiIHBsYWNlaG9sZGVyPVwiJyArXG4gICAgICAgIG9wdGlvbnMud2lkZ2V0c1t4XS5pbnN0cnVjdGlvbnMgK1xuICAgICAgICAnXCIgbXVsdGlwbGU9XCJcIj48L3NlbGVjdD4nXG4gICAgZHJvcGRvd25PcHRpb25zID0gbWFrZURyb3Bkb3duT3B0aW9ucyhvcHRpb25zLCB4KVxuICAgIGJyZWFrXG5cbiAgY2FzZSAnY2hlY2tib3gnOlxuICAgIHdpZGdldE5vZGVzICs9ICc8dWw+J1xuICAgIHZhciBrZXlTdHlsZVxuICAgIHZhciBsZWdlbmRJdGVtcyA9IG9wdGlvbnMud2lkZ2V0c1t4XS5ncm91cGluZ1xuICAgICAgPyBvcHRpb25zLndpZGdldHNbeF0ua2V5cy5ncm91cEJ5KCdncm91cCcpXG4gICAgICA6IG9wdGlvbnMud2lkZ2V0c1t4XS5rZXlzLmdyb3VwQnkoJ2xhYmVsJylcbiAgICBPYmplY3Qua2V5cyhsZWdlbmRJdGVtcykuZm9yRWFjaChmdW5jdGlvbihncm91cCwgaSkge1xuICAgICAgc3dpdGNoIChvcHRpb25zLndpZGdldHNbeF0udHlwZSkge1xuICAgICAgY2FzZSAnZm9ybSc6XG4gICAgICAgIHZhciBmb3JtcyA9IG9wdGlvbnMud2lkZ2V0c1t4XS5rZXlzLm1hcChmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIGYudmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgdmFyIHN0eWxlT3B0aW9ucyA9IHtcbiAgICAgICAgICBncm91cDogbGVnZW5kSXRlbXNbZ3JvdXBdLFxuICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgIGZvcm1zOiBmb3JtcyxcbiAgICAgICAgICBtYXA6IG9wdGlvbnNcbiAgICAgICAgfVxuICAgICAgICBrZXlTdHlsZSA9IHN0eWxlS2V5KHN0eWxlT3B0aW9ucylcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAnY29sb3InOlxuICAgICAgICB2YXIgc3R5bGVPcHRpb25zID0ge1xuICAgICAgICAgIG1hcDogb3B0aW9ucyxcbiAgICAgICAgICBncm91cDogbGVnZW5kSXRlbXNbZ3JvdXBdXG4gICAgICAgIH1cbiAgICAgICAga2V5U3R5bGUgPSBzdHlsZUtleShzdHlsZU9wdGlvbnMpXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIHdpZGdldE5vZGVzICs9XG4gICAgICAgICAgJzxsaT48bGFiZWwgZm9yPVwiJyArXG4gICAgICAgICAgZ3JvdXAgK1xuICAgICAgICAgICdcIj48aW5wdXQgY2xhc3M9XCJ3aWRnZXQgJyArXG4gICAgICAgICAgb3B0aW9ucy53aWRnZXRzW3hdLmlucHV0ICtcbiAgICAgICAgICAnXCIgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cIicgK1xuICAgICAgICAgIChvcHRpb25zLndpZGdldHNbeF0uZ3JvdXBpbmcgPyBncm91cCA6IGxlZ2VuZEl0ZW1zW2dyb3VwXVswXS52YWx1ZSkgK1xuICAgICAgICAgICdcIiBpZD1cIicgK1xuICAgICAgICAgIGdyb3VwICtcbiAgICAgICAgICAnXCIgJyArXG4gICAgICAgICAgKGxlZ2VuZEl0ZW1zW2dyb3VwXVswXS5zZWxlY3RlZCA/ICdjaGVja2VkJyA6ICcnKSArXG4gICAgICAgICAgJyA+PHNwYW4gY2xhc3M9XCInICtcbiAgICAgICAgICBrZXlTdHlsZS5jbGFzcyArXG4gICAgICAgICAgJ0tleVwiICcgK1xuICAgICAgICAgICdzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybChcXCcnICtcbiAgICAgICAgICBrZXlTdHlsZS5zdmcgK1xuICAgICAgICAgICdcIik+PC9zcGFuPjxzcGFuIGNsYXNzPVwiaXRlbVRleHRcIj4nICtcbiAgICAgICAgICBjYXBpdGFsaXplKGdyb3VwKSArXG4gICAgICAgICAgJzwvc3Bhbj48L2xhYmVsPjwvbGk+J1xuICAgIH0pXG4gICAgd2lkZ2V0Tm9kZXMgKz0gJzwvdWw+J1xuICAgIGJyZWFrXG5cbiAgZGVmYXVsdDpcbiAgICB3aWRnZXROb2RlcyArPSAnPHVsPidcbiAgICB2YXIga2V5U3R5bGVcbiAgICB2YXIgbGVnZW5kSXRlbXMgPSBvcHRpb25zLndpZGdldHNbeF0uZ3JvdXBpbmdcbiAgICAgID8gb3B0aW9ucy53aWRnZXRzW3hdLmtleXMuZ3JvdXBCeSgnZ3JvdXAnKVxuICAgICAgOiBvcHRpb25zLndpZGdldHNbeF0ua2V5cy5ncm91cEJ5KCdsYWJlbCcpXG4gICAgT2JqZWN0LmtleXMobGVnZW5kSXRlbXMpLmZvckVhY2goZnVuY3Rpb24oZ3JvdXAsIGkpIHtcbiAgICAgIHN3aXRjaCAob3B0aW9ucy53aWRnZXRzW3hdLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2Zvcm0nOlxuICAgICAgICB2YXIgZm9ybXMgPSBvcHRpb25zLndpZGdldHNbeF0ua2V5cy5tYXAoZnVuY3Rpb24oZikge1xuICAgICAgICAgIHJldHVybiBmLnZhbHVlXG4gICAgICAgIH0pXG4gICAgICAgIHZhciBzdHlsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgZ3JvdXA6IGxlZ2VuZEl0ZW1zW2dyb3VwXSxcbiAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICBmb3JtczogZm9ybXMsXG4gICAgICAgICAgbWFwOiBvcHRpb25zXG4gICAgICAgIH1cbiAgICAgICAga2V5U3R5bGUgPSBzdHlsZUtleShzdHlsZU9wdGlvbnMpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgJ2NvbG9yJzpcbiAgICAgICAgdmFyIHN0eWxlT3B0aW9ucyA9IHtcbiAgICAgICAgICBtYXA6IG9wdGlvbnMsXG4gICAgICAgICAgZ3JvdXA6IGxlZ2VuZEl0ZW1zW2dyb3VwXVxuICAgICAgICB9XG4gICAgICAgIGtleVN0eWxlID0gc3R5bGVLZXkoc3R5bGVPcHRpb25zKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICB3aWRnZXROb2RlcyArPVxuICAgICAgICAgICc8bGk+PHNwYW4gY2xhc3M9XCInICtcbiAgICAgICAgICBrZXlTdHlsZS5jbGFzcyArXG4gICAgICAgICAgJ0tleVwiICcgK1xuICAgICAgICAgICdzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybChcXCcnICtcbiAgICAgICAgICBrZXlTdHlsZS5zdmcgK1xuICAgICAgICAgICdcIik+PC9zcGFuPjxzcGFuIGNsYXNzPVwiaXRlbVRleHRcIj4nICtcbiAgICAgICAgICBjYXBpdGFsaXplKGdyb3VwKSArXG4gICAgICAgICAgJzwvc3Bhbj48L2xpPidcbiAgICB9KVxuICAgIHdpZGdldE5vZGVzICs9ICc8L3VsPidcbiAgICBicmVha1xuICB9XG5cbiAgdmFyIHdpZGdldFRpdGxlID1cbiAgICBvcHRpb25zLndpZGdldHNbeF0uZmllbGQgPT09ICdhbGwnXG4gICAgICA/ICdTZWFyY2gnXG4gICAgICA6IG9wdGlvbnMud2lkZ2V0c1t4XS5maWVsZC5yZXBsYWNlKC9fL2csICcgJylcbiAgcmV0dXJuIHtcbiAgICBub2Rlczogd2lkZ2V0Tm9kZXMsXG4gICAgdGl0bGU6IHdpZGdldFRpdGxlLFxuICAgIG9wdGlvbnM6IGRyb3Bkb3duT3B0aW9uc1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWtlRG9jdW1lbnROb2RlcyhvcHRpb25zKSB7XG4gIHZhciBuZXdTZWN0aW9uSFRNTCA9ICcnXG4gIG5ld1NlY3Rpb25IVE1MICs9ICc8c2VjdGlvbiBpZD1cIicgKyBvcHRpb25zLnNsdWcgKyAnXCI+J1xuICBuZXdTZWN0aW9uSFRNTCArPSAnPGRpdiBpZD1cIicgKyBvcHRpb25zLnNsdWcgKyAnX19tYXBcIiBjbGFzcz1cIm1hcFwiPjwvZGl2PidcbiAgbmV3U2VjdGlvbkhUTUwgKz0gJzxhc2lkZSBjbGFzcz1cInRvb2xib3hcIj4nXG4gIG5ld1NlY3Rpb25IVE1MICs9IG9wdGlvbnMudGl0bGVcbiAgICA/ICc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZCBjbGFzcz1cInVpIG1vYmlsZS1vbmx5XCI+PGRpdiBjbGFzcz1cImhhbWJ1cmdlciBtb2JpbGUtb25seVwiPjxkaXYgY2xhc3M9XCJpY29uXCI+IDxzcGFuPjwvc3Bhbj4gPHNwYW4+PC9zcGFuPiA8c3Bhbj48L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz1cIm1lbnUgdHJhbnNsYXRlXCI+PC9kaXY+PC9kaXY+J1xuICAgIDogJydcbiAgbmV3U2VjdGlvbkhUTUwgKz0gJzxkaXYgY2xhc3M9XCJib3hcIj4nXG4gIG5ld1NlY3Rpb25IVE1MICs9XG4gICAgb3B0aW9ucy50aXRsZSB8fCBvcHRpb25zLmxvZ28gfHwgb3B0aW9ucy5kZXNjcmlwdGlvblxuICAgICAgPyAnPGhlYWRlciAgY2xhc3M9XCJ0cmFuc2xhdGVcIj4gPGgxPjxhIHRhcmdldD1cIl9ibGFua1wiIGlkPVwibG9nb1wiPjwvYT48L2gxPiAgPHAgY2xhc3M9XCJ0cmFuc2xhdGVcIj48L3A+PC9oZWFkZXI+J1xuICAgICAgOiAnJ1xuICBuZXdTZWN0aW9uSFRNTCArPVxuICAgIChvcHRpb25zLmluc3RydWN0aW9uc1xuICAgICAgPyAnPHAgY2xhc3M9XCJ0cmFuc2xhdGVcIj4nICsgb3B0aW9ucy5pbnN0cnVjdGlvbnMgKyAnPC9wPidcbiAgICAgIDogJycpICtcbiAgICAnPGRpdiBpZD1cImNvbnRyb2xzXCI+PGRpdiBjbGFzcz1cImxvYWRlclwiPjwvZGl2PjwvZGl2Pjxmb290ZXI+PGRpdiBjbGFzcz1cImhpZGRlblwiPjwvZGl2PjwvZm9vdGVyPjwvZGl2PjwvYXNpZGU+J1xuICBuZXdTZWN0aW9uSFRNTCArPSBvcHRpb25zLnRpdGxlY2FyZGNvbnRlbnRcbiAgICA/ICc8YnV0dG9uIGlkPVwiJyArXG4gICAgICBvcHRpb25zLnNsdWcgK1xuICAgICAgJ19fYWJvdXRcIiBjbGFzcz1cImFib3V0LXRyaWdnZXJcIj5BQk9VVCBUSElTIE1BUDwvYnV0dG9uPidcbiAgICA6ICcnXG4gIG5ld1NlY3Rpb25IVE1MICs9ICc8L3NlY3Rpb24+J1xuICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCArPSBuZXdTZWN0aW9uSFRNTFxuXG4gIGlmIChvcHRpb25zLnRpdGxlY2FyZGNvbnRlbnQpIHtcbiAgICB2YXIgbmV3RGlhbG9nSFRNTCA9ICcnXG4gICAgbmV3RGlhbG9nSFRNTCArPSAnPGRpdiBjbGFzcz1cImRpYWxvZ1wiIGlkPVwiJyArIG9wdGlvbnMuc2x1ZyArICdfX2RpYWxvZ1wiPidcbiAgICBuZXdEaWFsb2dIVE1MICs9XG4gICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1vdmVybGF5XCIgdGFiaW5kZXg9XCItMVwiIGRhdGEtYTExeS1kaWFsb2ctaGlkZT48L2Rpdj4nXG4gICAgbmV3RGlhbG9nSFRNTCArPVxuICAgICAgJzxkaWFsb2cgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiIGFyaWEtbGFiZWxsZWRieT1cImRpYWxvZ1RpdGxlXCIgYXJpYS1kZXNjcmliZWRieT1cImRpYWxvZ0NvbnRlbnRcIj4nXG4gICAgbmV3RGlhbG9nSFRNTCArPVxuICAgICAgJzxidXR0b24gZGF0YS1hMTF5LWRpYWxvZy1oaWRlIGNsYXNzPVwiZGlhbG9nLWNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlIHRoaXMgZGlhbG9nIHdpbmRvd1wiPiZ0aW1lczs8L2J1dHRvbj4nXG4gICAgbmV3RGlhbG9nSFRNTCArPSBvcHRpb25zLnRpdGxlY2FyZHRpdGxlXG4gICAgICA/ICc8aDEgaWQ9XCJkaWFsb2dUaXRsZVwiPicgKyBvcHRpb25zLnRpdGxlY2FyZHRpdGxlICsgJzwvaDE+J1xuICAgICAgOiAnJ1xuICAgIG5ld0RpYWxvZ0hUTUwgKz1cbiAgICAgICc8ZGl2IGlkPVwiZGlhbG9nQ29udGVudFwiPicgKyBvcHRpb25zLnRpdGxlY2FyZGNvbnRlbnQgKyAnPC9kaXY+J1xuICAgIG5ld0RpYWxvZ0hUTUwgKz0gJzwvZGlhbG9nPidcbiAgICBuZXdEaWFsb2dIVE1MICs9ICc8L2Rpdj4nXG4gICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgKz0gbmV3RGlhbG9nSFRNTFxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgIHZhciBkaWFsb2dFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuc2x1ZyArICdfX2RpYWxvZycpXG4gICAgdmFyIG1haW5FbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcHRpb25zLnNsdWcnKVxuICAgIHZhciBkaWFsb2dUcmlnZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3B0aW9ucy5zbHVnICsgJ19fYWJvdXQnKVxuXG4gICAgdmFyIGRpYWxvZ0JveCA9IG5ldyBBMTF5RGlhbG9nKGRpYWxvZ0VsLCBtYWluRWwpXG4gICAgdmFyIGRpYWxvZyA9IGRpYWxvZ0JveC5kaWFsb2dcbiAgICBkaWFsb2dCb3guc2hvdygpXG4gICAgZGlhbG9nQm94Lm9uKCdoaWRlJywgZnVuY3Rpb24oZGlhbG9nRWwpIHtcbiAgICAgIGRpYWxvZ1RyaWdnZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICB9KVxuICAgIGRpYWxvZ0JveC5vbignc2hvdycsIGZ1bmN0aW9uKGRpYWxvZ0VsKSB7XG4gICAgICBkaWFsb2dUcmlnZ2VyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9KVxuICAgIGRpYWxvZ1RyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGRpYWxvZ0JveC5zaG93KClcbiAgICB9KVxuICB9XG5cbiAgZG9jdW1lbnQudGl0bGUgPSBvcHRpb25zLnRpdGxlICsgJyB8IENTSVMgJyArIG9wdGlvbnMucHJvZ3JhbVxuICB2YXIgbWV0YUxvY2FsZU9HID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWV0YScpXG4gIG1ldGFMb2NhbGVPRy5zZXRBdHRyaWJ1dGUoJ3Byb3BlcnR5JywgJ29nOmxvY2FsZScpXG4gIG1ldGFMb2NhbGVPRy5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCAnZW5fVVMnKVxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGFMb2NhbGVPRylcbiAgdmFyIG1ldGFUeXBlT0cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJylcbiAgbWV0YVR5cGVPRy5zZXRBdHRyaWJ1dGUoJ3Byb3BlcnR5JywgJ29nOnR5cGUnKVxuICBtZXRhVHlwZU9HLnNldEF0dHJpYnV0ZSgnY29udGVudCcsICdhcnRpY2xlJylcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChtZXRhVHlwZU9HKVxuICB2YXIgbWV0YVdpZHRoT0cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJylcbiAgbWV0YVdpZHRoT0cuc2V0QXR0cmlidXRlKCdwcm9wZXJ0eScsICdvZzppbWFnZTp3aWR0aCcpXG4gIG1ldGFXaWR0aE9HLnNldEF0dHJpYnV0ZSgnY29udGVudCcsICcyMDAwJylcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChtZXRhV2lkdGhPRylcbiAgdmFyIG1ldGFIZWlnaHRPRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21ldGEnKVxuICBtZXRhSGVpZ2h0T0cuc2V0QXR0cmlidXRlKCdwcm9wZXJ0eScsICdvZzppbWFnZTpoZWlnaHQnKVxuICBtZXRhSGVpZ2h0T0cuc2V0QXR0cmlidXRlKCdjb250ZW50JywgJzEzMzMnKVxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGFIZWlnaHRPRylcbiAgdmFyIG1ldGFUd2l0dGVyQ2FyZE9HID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWV0YScpXG4gIG1ldGFUd2l0dGVyQ2FyZE9HLnNldEF0dHJpYnV0ZSgncHJvcGVydHknLCAndHdpdHRlcjpjYXJkJylcbiAgbWV0YVR3aXR0ZXJDYXJkT0cuc2V0QXR0cmlidXRlKCdjb250ZW50JywgJ3N1bW1hcnknKVxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGFUd2l0dGVyQ2FyZE9HKVxuICB2YXIgbWV0YVRpdGxlT0cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJylcbiAgbWV0YVRpdGxlT0cuc2V0QXR0cmlidXRlKCdwcm9wZXJ0eScsICdvZzp0aXRsZScpXG4gIG1ldGFUaXRsZU9HLnNldEF0dHJpYnV0ZShcbiAgICAnY29udGVudCcsXG4gICAgb3B0aW9ucy50aXRsZSArICcgfCBDU0lTICcgKyBvcHRpb25zLnByb2dyYW1cbiAgKVxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGFUaXRsZU9HKVxuICB2YXIgbWV0YVRpdGxlVHdpdHRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21ldGEnKVxuICBtZXRhVGl0bGVUd2l0dGVyLnNldEF0dHJpYnV0ZSgncHJvcGVydHknLCAndHdpdHRlcjp0aXRsZScpXG4gIG1ldGFUaXRsZVR3aXR0ZXIuc2V0QXR0cmlidXRlKFxuICAgICdjb250ZW50JyxcbiAgICBvcHRpb25zLnRpdGxlICsgJyB8IENTSVMgJyArIG9wdGlvbnMucHJvZ3JhbVxuICApXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobWV0YVRpdGxlVHdpdHRlcilcbiAgdmFyIG1ldGFEZXNjcmlwdGlvbk9HID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWV0YScpXG4gIG1ldGFEZXNjcmlwdGlvbk9HLnNldEF0dHJpYnV0ZSgncHJvcGVydHknLCAnb2c6ZGVzY3JpcHRpb24nKVxuICBtZXRhRGVzY3JpcHRpb25PRy5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCBvcHRpb25zLmRlc2NyaXB0aW9uKVxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGFEZXNjcmlwdGlvbk9HKVxuICB2YXIgbWV0YURlc2NyaXB0aW9uVHdpdHRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21ldGEnKVxuICBtZXRhRGVzY3JpcHRpb25Ud2l0dGVyLnNldEF0dHJpYnV0ZSgncHJvcGVydHknLCAndHdpdHRlcjpkZXNjcmlwdGlvbicpXG4gIG1ldGFEZXNjcmlwdGlvblR3aXR0ZXIuc2V0QXR0cmlidXRlKCdjb250ZW50Jywgb3B0aW9ucy5kZXNjcmlwdGlvbilcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChtZXRhRGVzY3JpcHRpb25Ud2l0dGVyKVxuICB2YXIgbWV0YUltYWdlT0cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJylcbiAgbWV0YUltYWdlT0cuc2V0QXR0cmlidXRlKCdwcm9wZXJ0eScsICdvZzppbWFnZScpXG4gIG1ldGFJbWFnZU9HLnNldEF0dHJpYnV0ZSgnY29udGVudCcsIG9wdGlvbnMuc2NyZWVuc2hvdClcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChtZXRhSW1hZ2VPRylcbiAgdmFyIG1ldGFJbWFnZVR3aXR0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJylcbiAgbWV0YUltYWdlVHdpdHRlci5zZXRBdHRyaWJ1dGUoJ3Byb3BlcnR5JywgJ3R3aXR0ZXI6aW1hZ2UnKVxuICBtZXRhSW1hZ2VUd2l0dGVyLnNldEF0dHJpYnV0ZSgnY29udGVudCcsIG9wdGlvbnMuc2NyZWVuc2hvdClcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChtZXRhSW1hZ2VUd2l0dGVyKVxuXG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIG9wdGlvbnMuc2x1ZyArICcgaGVhZGVyJykpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIG9wdGlvbnMuc2x1ZyArICcgLm1lbnUnKS5pbm5lclRleHQgPVxuICAgICAgb3B0aW9ucy50aXRsZVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgb3B0aW9ucy5zbHVnICsgJyBoZWFkZXIgaDEnKS5pbm5lckhUTUwgKz1cbiAgICAgIG9wdGlvbnMudGl0bGVcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgJyMnICsgb3B0aW9ucy5zbHVnICsgJyBoZWFkZXIgYSdcbiAgICApLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IG9wdGlvbnMubG9nbyA/ICd1cmwoJyArIG9wdGlvbnMubG9nbyArICcpJyA6ICcnXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICcjJyArIG9wdGlvbnMuc2x1ZyArICcgaGVhZGVyIGEnXG4gICAgKS5ocmVmID0gb3B0aW9ucy53ZWJzaXRlID8gb3B0aW9ucy53ZWJzaXRlIDogJydcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgJyMnICsgb3B0aW9ucy5zbHVnICsgJyBoZWFkZXIgcCdcbiAgICApLmlubmVyVGV4dCA9IG9wdGlvbnMuZGVzY3JpcHRpb24gPyBvcHRpb25zLmRlc2NyaXB0aW9uIDogJydcbiAgfVxufVxuIiwiaW1wb3J0IHsgcGFyc2VNZXRhRGF0YSwgcGFyc2VXaWRnZXREYXRhIH0gZnJvbSAnLi9wYXJzZXJzLmpzJ1xuaW1wb3J0IG1ha2VXaWRnZXRzIGZyb20gJy4vbWFrZVdpZGdldHMuanMnXG5pbXBvcnQgbWFrZURvY3VtZW50Tm9kZXMgZnJvbSAnLi9tYWtlRG9jdW1lbnROb2Rlcy5qcydcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaW5pdFdpdGhTcHJlYWRzaGVldChcbiAgZGF0YVVSTCxcbiAgb3B0aW9ucyxcbiAgdHJhbnNsYXRpb25zXG4pIHtcbiAgdmFyIG1hcFxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmV0dXJuIGZldGNoKFxuICAgICAgZGF0YVVSTCArIG9wdGlvbnMuZ29vZ2xlU2hlZXQgKyAnLycgKyAyICsgJy9wdWJsaWMvdmFsdWVzP2FsdD1qc29uJ1xuICAgIClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgIHZhciBtZXRhRGF0YSA9IHBhcnNlTWV0YURhdGEoanNvbi5mZWVkLmVudHJ5KVxuICAgICAgICB2YXIgd2lkZ2V0cyA9IHBhcnNlV2lkZ2V0RGF0YShtZXRhRGF0YSlcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB7fVxuICAgICAgICBPYmplY3Qua2V5cyhtZXRhRGF0YSkuZm9yRWFjaChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgcHJvcGVydGllc1tkYXRhXSA9IG1ldGFEYXRhW2RhdGFdXG4gICAgICAgIH0pXG4gICAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHByb3BlcnRpZXNbZGF0YV0gPSBvcHRpb25zW2RhdGFdXG4gICAgICAgIH0pXG5cbiAgICAgICAgdmFyIHR3b0RfcHJvcGVyaXRlcyA9IFtcbiAgICAgICAgICB7IG5hbWU6ICdjZW50ZXInLCBkZWZhdWx0OiBbMCwgMF0gfSxcbiAgICAgICAgICB7IG5hbWU6ICdpY29uc2l6ZScsIGRlZmF1bHQ6IFsyMCwgMjBdIH0sXG4gICAgICAgICAgeyBuYW1lOiAnaWNvbmFuY2hvcicsIGRlZmF1bHQ6IFs1LCA1XSB9LFxuICAgICAgICAgIHsgbmFtZTogJ3N3Ym91bmRzJywgZGVmYXVsdDogWy05MCwgLTE4MF0gfSxcbiAgICAgICAgICB7IG5hbWU6ICduZWJvdW5kcycsIGRlZmF1bHQ6IFs5MCwgMTgwXSB9XG4gICAgICAgIF1cblxuICAgICAgICB0d29EX3Byb3Blcml0ZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAgIHByb3BlcnRpZXNbcHJvcGVydHkubmFtZV0gPVxuICAgICAgICAgICAgdHlwZW9mIHByb3BlcnRpZXNbcHJvcGVydHkubmFtZV0gPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgID8gcHJvcGVydGllc1twcm9wZXJ0eS5uYW1lXS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHYsIDEwKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICA6IHByb3BlcnRpZXNbcHJvcGVydHkubmFtZV1cbiAgICAgICAgICAgICAgICA/IHByb3BlcnRpZXNbcHJvcGVydHkubmFtZV1cbiAgICAgICAgICAgICAgICA6IHByb3BlcnR5LmRlZmF1bHRcbiAgICAgICAgfSlcbiAgICAgICAgcHJvcGVydGllcy5zbHVnID0gcHJvcGVydGllcy5tYXBJRC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgJy0nKVxuICAgICAgICBwcm9wZXJ0aWVzLnRyYW5zbGF0aW9ucyA9IHRyYW5zbGF0aW9uc1xuICAgICAgICBwcm9wZXJ0aWVzLndpZGdldHMgPSB3aWRnZXRzXG4gICAgICAgIG1ha2VEb2N1bWVudE5vZGVzKHByb3BlcnRpZXMpXG4gICAgICAgIHZhciByZWZlcmVuY2VTaGVldHMgPSB3aWRnZXRzLmZpbHRlcihmdW5jdGlvbih3KSB7XG4gICAgICAgICAgcmV0dXJuIHcucmVmZXJlbmNlXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHJlZmVyZW5jZVNoZWV0cykge1xuICAgICAgICAgIHZhciBib3hDb250ZW50ID0gJydcbiAgICAgICAgICB2YXIgcmVmZXJlbmNlU2hlZXRVUkxTID0gd2lkZ2V0c1xuICAgICAgICAgICAgLm1hcChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgICAgIGlmICh3LnJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICBkYXRhVVJMICtcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZ29vZ2xlU2hlZXQgK1xuICAgICAgICAgICAgICAgICAgJy8nICtcbiAgICAgICAgICAgICAgICAgIHcucmVmZXJlbmNlICtcbiAgICAgICAgICAgICAgICAgICcvcHVibGljL3ZhbHVlcz9hbHQ9anNvbidcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKHUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICByZWZlcmVuY2VTaGVldFVSTFMubWFwKGZ1bmN0aW9uKHVybCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmV0Y2godXJsKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oYXN5bmMgZnVuY3Rpb24oanNvbnMpIHtcbiAgICAgICAgICAgICAgbWFwID0gYXdhaXQgbWFrZVdpZGdldHMoanNvbnMsIHByb3BlcnRpZXMsIGJveENvbnRlbnQpXG5cbiAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMuZm9vdGVyICYmIHByb3BlcnRpZXMuZm9vdGVyLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgIHZhciBmb290ZXJOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9vdGVyJylcbiAgICAgICAgICAgICAgICBmb290ZXJOb2RlLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmZvb3RlciArICcgIDxkaXYgY2xhc3M9XCJoaWRkZW5cIj48L2Rpdj4nXG4gICAgICAgICAgICAgICAgdmFyIHBlblVsdGltYXRlTm9kZSA9XG4gICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICAnIycgKyBwcm9wZXJ0aWVzLnNsdWcgKyAnICNjb250cm9scydcbiAgICAgICAgICAgICAgICAgICkgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBwcm9wZXJ0aWVzLnNsdWcgKyAnaGVhZGVyJylcbiAgICAgICAgICAgICAgICBwZW5VbHRpbWF0ZU5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICBmb290ZXJOb2RlLFxuICAgICAgICAgICAgICAgICAgcGVuVWx0aW1hdGVOb2RlLm5leHRTaWJsaW5nXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmVzb2x2ZShtYXApXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBtYXAgPSBuZXcgQ3VzdG9tTWFwKGNvbnRhaW5lciwgb3B0aW9ucykucmVuZGVyKClcbiAgICAgICAgICBtYWtlTGF5ZXJzKG1hcClcbiAgICAgICAgICB2YXIgYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBvcHRpb25zLnNsdWcgKyAnICNjb250cm9scycpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcGVydGllcy5mb290ZXIgJiYgcHJvcGVydGllcy5mb290ZXIudHJpbSgpKSB7XG4gICAgICAgICAgdmFyIGZvb3Rlck5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb290ZXInKVxuICAgICAgICAgIGZvb3Rlck5vZGUuaW5uZXJIVE1MID1cbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9vdGVyICsgJyAgPGRpdiBjbGFzcz1cImhpZGRlblwiPjwvZGl2PidcbiAgICAgICAgICB2YXIgcGVuVWx0aW1hdGVOb2RlID1cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgcHJvcGVydGllcy5zbHVnICsgJyAjY29udHJvbHMnKSB8fFxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBwcm9wZXJ0aWVzLnNsdWcgKyAnaGVhZGVyJylcbiAgICAgICAgICBwZW5VbHRpbWF0ZU5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICBmb290ZXJOb2RlLFxuICAgICAgICAgICAgcGVuVWx0aW1hdGVOb2RlLm5leHRTaWJsaW5nXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICB9KVxufVxuIiwiaW1wb3J0IHsgY29udmVydFR5cGUsIGNyZWF0ZUNvbG9yU2NhbGUgfSBmcm9tICcuL2hlbHBlcnMuanMnXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUxhbmd1YWdlRGF0YShkYXRhKSB7XG4gIHZhciBsYW5ndWFnZURhdGEgPSB7fVxuICBkYXRhLmZvckVhY2goZnVuY3Rpb24ocm93KSB7XG4gICAgdmFyIGtleVxuICAgIE9iamVjdC5rZXlzKHJvdykuZm9yRWFjaChmdW5jdGlvbihjb2x1bW4sIGkpIHtcbiAgICAgIGlmIChjb2x1bW4uaW5kZXhPZignZ3N4JCcpID4gLTEpIHtcbiAgICAgICAgdmFyIGNvbHVtbk5hbWUgPSBjb2x1bW4ucmVwbGFjZSgnZ3N4JCcsICcnKVxuXG4gICAgICAgIGlmIChjb2x1bW5OYW1lID09PSAnZW4nKSB7XG4gICAgICAgICAga2V5ID0gcm93W2NvbHVtbl1bJyR0J11cbiAgICAgICAgICBsYW5ndWFnZURhdGFba2V5XSA9IHt9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29sdW1uTmFtZSA9PT0gbGFuZykge1xuICAgICAgICAgIGxhbmd1YWdlRGF0YVtrZXldID0gcm93W2NvbHVtbl1bJyR0J11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG4gIHJldHVybiBsYW5ndWFnZURhdGFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTGVnZW5kRGF0YShvcHRpb25zLCBqc29uLCBzdHlsZSkge1xuICB2YXIgY29sb3JTY2FsZSA9IGNyZWF0ZUNvbG9yU2NhbGUoanNvbi5sZW5ndGgpXG4gIHZhciBsZWdlbmRJdGVtcyA9IFtdXG4gIGpzb24uZm9yRWFjaChmdW5jdGlvbihyb3csIHgpIHtcbiAgICB2YXIgZGF0YSA9IHt9XG4gICAgT2JqZWN0LmtleXMocm93KS5mb3JFYWNoKGZ1bmN0aW9uKGNvbHVtbiwgeSkge1xuICAgICAgaWYgKGNvbHVtbi5pbmRleE9mKCdnc3gkJykgPiAtMSkge1xuICAgICAgICB2YXIgY29sdW1uTmFtZSA9IGNvbHVtbi5yZXBsYWNlKCdnc3gkJywgJycpXG5cbiAgICAgICAgaWYgKGNvbHVtbk5hbWUgPT09ICdsYWJlbCcpIHtcbiAgICAgICAgICB2YXIga2V5ID0gcm93W2NvbHVtbl1bJyR0J10udG9Mb3dlckNhc2UoKVxuICAgICAgICAgIGRhdGEua2V5ID0ga2V5XG4gICAgICAgICAgZGF0YS5sYWJlbCA9IHJvd1tPYmplY3Qua2V5cyhyb3cpW3kgKyAwXV1bJyR0J11cbiAgICAgICAgICBkYXRhLnZhbHVlID0gcm93W09iamVjdC5rZXlzKHJvdylbeSArIDFdXVsnJHQnXVxuICAgICAgICAgIGRhdGEuZ3JvdXAgPSBjb252ZXJ0VHlwZShyb3dbT2JqZWN0LmtleXMocm93KVt5ICsgMl1dWyckdCddKVxuICAgICAgICAgIGRhdGEuc2VsZWN0ZWQgPSBjb252ZXJ0VHlwZShyb3dbT2JqZWN0LmtleXMocm93KVt5ICsgM11dWyckdCddKVxuICAgICAgICAgIHZhciBjb2xvclZhbCA9IHJvd1tPYmplY3Qua2V5cyhyb3cpW3kgKyA0XV1bJyR0J11cbiAgICAgICAgICBkYXRhLmZvcm0gPSByb3dbT2JqZWN0LmtleXMocm93KVt5ICsgNV1dWyckdCddXG4gICAgICAgICAgZGF0YS5jb2xvciA9IGNvbG9yVmFsXG4gICAgICAgICAgICA/IGNvbG9yVmFsXG4gICAgICAgICAgICA6IGRhdGEuZm9ybSA9PT0gJ2xpbmUnXG4gICAgICAgICAgICAgID8gZGVmYXVsdENvbG9yXG4gICAgICAgICAgICAgIDogY29sb3JTY2FsZVt4XVxuICAgICAgICAgIGRhdGEuaWNvbiA9IHJvd1tPYmplY3Qua2V5cyhyb3cpW3kgKyA2XV1bJyR0J11cbiAgICAgICAgICBkYXRhLnBhdHRlcm4gPSByb3dbT2JqZWN0LmtleXMocm93KVt5ICsgN11dWyckdCddLnNwbGl0KCcsJylcblxuICAgICAgICAgIGlmIChvcHRpb25zLnRyYW5zbGF0aW9ucykge1xuICAgICAgICAgICAgZGF0YS5sYWJlbCA9IG9wdGlvbnMudHJhbnNsYXRpb25zW2RhdGEubGFiZWxdXG4gICAgICAgICAgICBkYXRhLmdyb3VwID0gb3B0aW9ucy50cmFuc2xhdGlvbnNbZGF0YS5ncm91cF1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZWdlbmRJdGVtcy5wdXNoKGRhdGEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9KVxuICByZXR1cm4gbGVnZW5kSXRlbXNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWV0YURhdGEoanNvbikge1xuICB2YXIgZGF0YSA9IHt9XG4gIGpzb24uZm9yRWFjaChmdW5jdGlvbihyb3csIHgpIHtcbiAgICBPYmplY3Qua2V5cyhyb3cpLmZvckVhY2goZnVuY3Rpb24oY29sdW1uLCB5KSB7XG4gICAgICBpZiAoY29sdW1uLmluZGV4T2YoJ2dzeCQnKSA+IC0xKSB7XG4gICAgICAgIHZhciBjb2x1bW5OYW1lID0gY29sdW1uLnJlcGxhY2UoJ2dzeCQnLCAnJylcblxuICAgICAgICBpZiAoY29sdW1uTmFtZSA9PT0gJ3Byb3BlcnR5Jykge1xuICAgICAgICAgIHZhciBrZXkgPSByb3dbY29sdW1uXVsnJHQnXS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgJycpXG4gICAgICAgICAgZGF0YVtrZXldID0gZGF0YVtrZXldIHx8IHt9XG4gICAgICAgICAgZGF0YVtrZXldID0gY29udmVydFR5cGUocm93W09iamVjdC5rZXlzKHJvdylbeSArIDFdXVsnJHQnXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG4gIHJldHVybiBkYXRhXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVdpZGdldERhdGEobWV0YURhdGEpIHtcbiAgdmFyIHdpZGdldHMgPSBbXVxuXG4gIGZ1bmN0aW9uIHByb2Nlc3MoaywgaW5kZXgsIHByb3BlcnR5KSB7XG4gICAgaWYgKGsudG9Mb3dlckNhc2UoKS5pbmRleE9mKHByb3BlcnR5KSA+IC0xKVxuICAgICAgd2lkZ2V0c1tpbmRleCAtIDFdW3Byb3BlcnR5XSA9IGNvbnZlcnRUeXBlKG1ldGFEYXRhW2tdKVxuICB9XG5cbiAgdmFyIHByb3BlcnRpZXMgPSBbXG4gICAgJ2lucHV0JyxcbiAgICAnZmllbGQnLFxuICAgICdncm91cGluZycsXG4gICAgJ2luc3RydWN0aW9ucycsXG4gICAgJ21heGltdW0nLFxuICAgICd0eXBlJyxcbiAgICAncmVmZXJlbmNlJyxcbiAgICAnc3R5bGUnXG4gIF1cbiAgT2JqZWN0LmtleXMobWV0YURhdGEpXG4gICAgLmZpbHRlcihmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gay50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3dpZGdldCcpID4gLTFcbiAgICB9KVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBpbmRleCA9IGsubWF0Y2goL1xcZCsvKVswXVxuICAgICAgd2lkZ2V0c1tpbmRleCAtIDFdID0gd2lkZ2V0c1tpbmRleCAtIDFdIHx8IHt9XG4gICAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgcHJvY2VzcyhrLCBpbmRleCwgcHJvcGVydHkpXG4gICAgICB9KVxuICAgIH0pXG4gIHdpZGdldHMuZm9yRWFjaChmdW5jdGlvbih3LCBpKSB7XG4gICAgdy5maWVsZCA9IHcuZmllbGQucmVwbGFjZSgvIC9nLCAnXycpXG4gICAgdy5pZCA9IGlcbiAgfSlcbiAgcmV0dXJuIHdpZGdldHNcbn1cbiIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4vZGlzdC9sb2FkZXIuanMhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tNS0yIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9zcmMvaW5kZXguanM/P3Bvc3Rjc3MhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNS00IS4vbWFpbi5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4vZGlzdC9sb2FkZXIuanMhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tNS0yIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9zcmMvaW5kZXguanM/P3Bvc3Rjc3MhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNS00IS4vbWFpbi5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL21pbmktY3NzLWV4dHJhY3QtcGx1Z2luL2Rpc3QvbG9hZGVyLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTUtMiEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvc3JjL2luZGV4LmpzPz9wb3N0Y3NzIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTUtNCEuL21haW4uc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJzb3VyY2VSb290IjoiIn0=