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
/******/ 	var hotCurrentHash = "8bd3091e99290203a015";
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




window.makeMap = makeMap;
window.externalLink = helpers["d" /* externalLink */]; // ;(async function() {
//   var newMap = await makeMap({
//     googleSheet: '1R9J3haGLDsRPhtT1P1JvQL_XzaPZZsa33vBFO6xs6g4',
//     mapID: 'chinapower',
//     mapboxStyle:
//       lang && lang.indexOf('zh-') > -1
//         ? 'citui3waw00162jo1zcsf1urj'
//         : 'cj84s9bet10f52ro2lrna50yg',
//     onEachFeature: {
//       mouseover: function mouseover(e) {
//         this.openPopup(e.latlng)
//       },
//       mouseout: function mouseover(e) {
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
// makeMap({
//   googleSheet: '1gG0m4xRVeBQ7eTypfZ0SQev_RxUK0uj_9IlyUqSev7c',
//   mapID: 'aid-terrorism',
//   formatPopupContent: function(feature, map) {
//     var jsons = map.json
//       .reduce(function(a, b) {
//         return {
//           type: 'FeatureCollection',
//           features: a.features.concat(b.features)
//         }
//       })
//       .features.map(function(f) {
//         return f.properties
//       })
//
//     var countryData = jsons
//       .filter(function(f) {
//         return f.country === feature.properties.country
//       })
//       .reduce(function(a, b) {
//         return {
//           terrorism: a.terrorism ? a.terrorism : b.terrorism,
//           foreign_assistance: a.foreign_assistance
//             ? a.foreign_assistance
//             : b.foreign_assistance
//         }
//       })
//
//     var groups = '',
//       assistance,
//       terrorism = countryData.terrorism,
//       aid = {
//         e: '$100,000,000-$1,500,000,000',
//         d: '$30,000,000-$99,000,000',
//         c: '$2,000,000-$29,999,000',
//         b: '$10,000-$1,999,000',
//         a: '$0-$10,000'
//       }
//
//     if (terrorism.length) {
//       groups = `<br><div class="popupHeaderStyle">Terrorist Groups</div>
//       <ul>${terrorism
//     .split('~')
//     .map(function(group) {
//       return `<li class='popupEntryStyle'>${group}</li>`
//     })
//     .join('')}</ul>`
//     }
//
//     assistance = aid[countryData.foreign_assistance]
//       ? `<div class="popupHeaderStyle">Foreign Assistance: ${(assistance =
//           aid[countryData.foreign_assistance])}</div>`
//       : ''
//
//     return `<div class="popupTitleStyle">${feature.properties.country}</div>
//       ${assistance}      ${groups}`
//   }
// })
// makeMap({
//   googleSheet: '1R9J3haGLDsRPhtT1P1JvQL_XzaPZZsa33vBFO6xs6g4',
//   mapID: 'chinapower',
//   mapboxStyle:
//     lang && lang.indexOf('zh-') > -1
//       ? 'citui3waw00162jo1zcsf1urj'
//       : 'cj84s9bet10f52ro2lrna50yg',
//   onEachFeature: {
//     mouseover: function mouseover(e) {
//       this.openPopup(e.latlng)
//     },
//     mouseout: function mouseover(e) {
//       this.closePopup()
//     }
//   },
//   formatPopupContent: function(feature, map) {
//     var prefix = lang ? '_' + lang : ''
//
//     var name = feature.properties['name' + prefix]
//
//     // var description = feature.properties['description' + prefix]
//     //   .replace(/<a href=/gi, '<a target="_blank" href=')
//     //   .replace(/<\/a>/gi, externalLink + '</a>')
//
//     var outpost = feature.properties.chinese_outposts
//     return (
//       '<div class="popupEntryStyle">' +
//       outpost +
//       (name && outpost ? '<br/>' : '') +
//       (name !== outpost ? name : '') +
//       (feature.properties.observed
//         ? '<br/>(expected)'
//         : feature.properties.observed === false
//           ? '<br />(observed)'
//           : '') +
//       '</div>' +
//       '<div class="popupEntryStyle">' +
//       'description' +
//       '</div>'
//     )
//   }
// })
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
  var colors, keyColor;
  var key = group ? group[0] : key;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = map.widgets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var w = _step.value;
      var formKeyWidget = w.type === 'form' ? w : null;
      var colorKeyWidget = w.type === 'color' ? w : null;

      if (feature) {
        var colorKey = colorKeyWidget ? colorKeyWidget.keys.find(function (k) {
          return !k.value ? true : k.value.toLowerCase() === feature.properties[colorKeyWidget.field].toLowerCase();
        }) : null;
        var formKey = formKeyWidget ? formKeyWidget.keys.find(function (k) {
          return !k.value ? true : k.value.toLowerCase() === feature.properties[formKeyWidget.field].toLowerCase();
        }) : null;
        keyColor = colorKey ? colorKey.color : formKey ? formKey.color : null;
      }

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
            keyColor = colorKey ? colorKey.color : keyColor ? keyColor : null;
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
          svg = 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg"><circle cx="' + map.iconsize[0] / 2 + '" cy="' + map.iconsize[1] / 2 + '" r="' + (map.iconsize[0] + map.iconsize[1]) / 4 + '" fill="' + (keyColor || key.color) + '"/></svg>');
          return {
            svg: svg,
            class: 'color'
          };
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
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

    if (_this.fullscreen) {
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

function stylePoint(feature, latlng, map) {
  var pointStyle, key, styleOptions;
  var CustomIcon = L.Icon.extend({
    options: {
      iconSize: [80, 80],
      iconAnchor: map.iconsize ? map.iconsize / 4 : map.iconanchor ? map.iconanchor : [5, 5]
    }
  });
  var nonPointStyle, key, divIcon;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = map.widgets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var w = _step.value;
      var thisFormKeyWidget = w.type === 'form' ? w : null;
      var thisColorKeyWidget = w.type === 'color' ? w : null;
      var colorKey = thisColorKeyWidget ? thisColorKeyWidget.keys.find(function (k) {
        return !k.value ? true : k.value.toLowerCase() === feature.properties[thisColorKeyWidget.field].toLowerCase();
      }) : null;
      var formKey = thisFormKeyWidget ? thisFormKeyWidget.keys.find(function (k) {
        return !k.value ? true : k.value.toLowerCase() === feature.properties[thisFormKeyWidget.field].toLowerCase();
      }) : null;
      var color = colorKey ? colorKey.color : formKey ? formKey.color : null;

      if (thisFormKeyWidget && feature.properties[thisFormKeyWidget.field]) {
        var forms = thisFormKeyWidget.keys.map(function (k) {
          return k.value.toLowerCase();
        });
        var i = forms.indexOf(feature.properties[thisFormKeyWidget.field].toLowerCase());
        key = thisFormKeyWidget.keys.find(function (k) {
          return !k.value ? true : k.value.toLowerCase() === feature.properties[thisFormKeyWidget.field].toLowerCase();
        });
        if (!key) break;
        var styleOptions = {
          key: formKey,
          index: i,
          forms: forms,
          color: color,
          map: map,
          feature: feature
        };

        if (key.form === 'div') {
          var value = feature.properties[thisFormKeyWidget.field];
          var count = value ? value.split('~').length : 0;
          divIcon = L.divIcon({
            className: 'icon-div',
            html: '<span class="text" style="background-color:' + color + '">' + count + '</span>'
          });
        }

        pointStyle = divIcon ? divIcon : styleKey(styleOptions);
      } else if (thisColorKeyWidget && feature.properties[thisColorKeyWidget.field]) {
        key = thisColorKeyWidget.keys.find(function (k) {
          return !k.value ? true : k.value.toLowerCase() === feature.properties[thisColorKeyWidget.field].toLowerCase();
        });
        if (!key) break;
        var styleOptions = {
          key: colorKey,
          color: colorKey.color,
          map: map,
          feature: feature
        };
        pointStyle = styleKey(styleOptions);
        console.log(pointStyle.svg);
      } else {
        var svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' + 'red' + '"/></svg>';
        pointStyle = {
          class: 'default',
          svg: encodeURI('data:image/svg+xml;base64,' + window.btoa(svg))
        };
      }

      var iconUrl = pointStyle.svg;
      var icon = new CustomIcon({
        iconUrl: iconUrl
      });
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return L.marker(latlng, {
    icon: divIcon ? divIcon : icon
  });
}
// CONCATENATED MODULE: ./src/js/styleNonPoint.js


function styleNonPoint(feature, map, index) {
  var nonPointStyle,
      colors = [],
      forms = [],
      sort = ['form', 'color'];
  var colorKeyWidget = map.widgets.find(function (w) {
    var key = w.keys.find(function (k) {
      return !k.value ? true : k.value.toLowerCase() === feature.properties[w.field].toLowerCase();
    });
    return key && w.type === 'color';
  });
  var formKeyWidget = map.widgets.find(function (w) {
    var key = w.keys.find(function (k) {
      return !k.value ? true : k.value.toLowerCase() === feature.properties[w.field].toLowerCase();
    });
    return key && w.type === 'form';
  });
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = map.widgets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var w = _step.value;
      var colorKey = colorKeyWidget ? colorKeyWidget.keys.find(function (k) {
        return !k.value ? true : k.value.toLowerCase() === feature.properties[colorKeyWidget.field].toLowerCase();
      }) : null;
      var formKey = formKeyWidget ? formKeyWidget.keys.find(function (k) {
        return !k.value ? true : k.value.toLowerCase() === feature.properties[formKeyWidget.field].toLowerCase();
      }) : null;
      var color = colorKey ? colorKey.color : formKey ? formKey.color : null;
      var formKeyForm = formKeyWidget ? formKeyWidget.keys.reduce(function (a, c) {
        return c.form;
      }) : null;
      var colorKeyForm = colorKeyWidget ? colorKeyWidget.keys.reduce(function (a, c) {
        return c.form;
      }) : null;
      var form = formKeyWidget ? formKeyWidget.keys.reduce(function (a, c) {
        return c.form;
      }) : null;

      if (formKeyWidget && form === 'line') {
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
      }

      if (forms && formKeyForm === 'line' || forms && colorKeyForm === 'line') {
        var i = forms.indexOf(feature.properties[formKeyWidget.field]);

        if (i > -1) {
          nonPointStyle = {
            color: colors[i][index] === undefined ? '#cad2d3' : colors[i][index] !== null ? colors[i][index] : color,
            weight: helpers["f" /* lineWeights */][i][index],
            lineCap: 'square',
            dashArray: helpers["e" /* lineDashArrays */][i] ? helpers["e" /* lineDashArrays */][i][index] : null
          };
        }
      } else if (formKeyForm === 'line' || colorKeyForm === 'line') {
        nonPointStyle = {
          color: color,
          weight: 2,
          lineCap: 'square',
          dashArray: '3,7'
        };
      } else if (colorKey && colorKey.form === 'pattern') {
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

        pattern.addTo(map.leaflet);
        nonPointStyle = {
          fillPattern: pattern ? pattern : null,
          fillColor: color,
          color: defaultColor,
          fillOpacity: 0.7,
          opacity: 0.5,
          weight: 2,
          lineCap: 'square'
        };
      } else {
        var lineColor;
        var lineWeight;
        var lineOpacity;

        switch (true) {
          case feature.geometry.type.toLowerCase().indexOf('line') > -1:
            lineColor = color ? chroma(color).brighten().hex() : null;
            lineOpacity = 1;
            lineWeight = 4;
            break;

          case feature.geometry.type.toLowerCase().indexOf('polygon') > -1:
            lineColor = defaultColor;
            lineOpacity = 0.5;
            lineWeight = 2;
            break;
        }

        nonPointStyle = {
          fillPattern: pattern,
          fillColor: color,
          color: lineColor,
          fillOpacity: 0.7,
          opacity: lineOpacity,
          weight: lineWeight
        };
      }

      if (nonPointStyle) return nonPointStyle;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}
// CONCATENATED MODULE: ./src/js/makeGeoJsonOptions.js



function makeGeoJsonOptions(map, colorKeyWidgets, formKeyWidgets) {
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

  var backgroundOptions = {
    filter: filter,
    onEachFeature: onEachFeature,
    pointToLayer: map.pointStyle || function (feature, latlng) {
      return stylePoint(feature, latlng, map);
    },
    style: map.nonPointStyle || function (feature) {
      // console.log(styleNonPoint(feature, styleOptions, 0))
      return styleNonPoint(feature, map, 0);
    }
  };
  var foregroundOptions = {
    filter: filter,
    onEachFeature: onEachFeature,
    pointToLayer: map.pointStyle || function (feature, latlng) {
      return stylePoint(feature, latlng, map);
    },
    style: map.nonPointStyle || function (feature) {
      return styleNonPoint(feature, map, 1);
    }
  };
  return [backgroundOptions, foregroundOptions];
}
// CONCATENATED MODULE: ./src/js/makeLayers.js

function makeLayers_makeLayers(map) {
  var colorKeyWidgets = [],
      formKeyWidgets = [];

  if (map.widgets) {
    colorKeyWidgets = map.widgets.filter(function (w) {
      return w.type === 'color';
    });
    formKeyWidgets = map.widgets.filter(function (w) {
      return w.type === 'form';
    });
  }

  var geoJsonOptions = map.geoJsonOptions ? map.geoJsonOptions(map) : makeGeoJsonOptions(map);
  map.json.forEach(function (json, i) {
    var clusterColor, colorKeyWidget;

    if (colorKeyWidgets.length) {
      var colorKeys = colorKeyWidgets.map(function (widget) {
        var collectionName = json.features[0].properties[widget.field];
        var key = widget.keys.find(function (key) {
          return key.value.toLowerCase() === collectionName.toLowerCase();
        });

        if (key) {
          colorKeyWidget = widget;
        }

        return key;
      }).filter(function (colorKey) {
        return colorKey;
      });
      clusterColor = colorKeys[0] ? colorKeys[0].color : '#000000';
    } else {
      clusterColor = '#000000';
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
          html: '<span class="text" style="border: 2px solid' + clusterColor + '; color:' + clusterColor + '">' + cluster.getChildCount() + '</span>'
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
    var tables = Object.keys(options).filter(function (k) {
      return k.toLowerCase().indexOf('table') > -1;
    });
    Promise.all(tables.map(function (table) {
      return fetch('https://csis.carto.com/api/v2/sql?api_key=' + map.apikey + '&format=geojson&q=SELECT%20*%20FROM%20' + options[table]);
    })).then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (jsons) {
      var json = jsons.reduce(function (a, b) {
        return {
          type: 'FeatureCollection',
          features: a.features.concat(b.features)
        };
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Njc3MvbWFpbi5zY3NzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21ha2VNYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9oZWxwZXJzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9zdHlsZUtleS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvQ3VzdG9tTWFwLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9oYW5kbGVGZWF0dXJlRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9zdHlsZVBvaW50LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9zdHlsZU5vblBvaW50LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tYWtlR2VvSnNvbk9wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21ha2VMYXllcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21hcFdpZGdldHNUb1N0YXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tYWtlV2lkZ2V0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFrZURvY3VtZW50Tm9kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luaXRXaXRoU3ByZWFkc2hlZXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3BhcnNlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Njc3MvbWFpbi5zY3NzPzEyOTciXSwibmFtZXMiOlsidXJsIiwid2luZG93IiwibG9jYXRpb24iLCJwYXJlbnQiLCJkb2N1bWVudCIsInJlZmVycmVyIiwiaHJlZiIsImV4ZWMiLCJsYW5nIiwibGVhZmxldExvYWRlZCIsInByaW1hcnlKc0ZpbGVzIiwic2Vjb25kYXJ5SnNGaWxlcyIsImhhbmRsZUxvYWRMZWFmbGV0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmb3JFYWNoIiwiZmlsZSIsImhlYWQiLCJqc0xpbmsiLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwiYXBwZW5kQ2hpbGQiLCJvbmxvYWQiLCJsZW5ndGgiLCJpbXBvcnRGaWxlcyIsIm1ha2VNYXAiLCJvcHRpb25zIiwidGhlbiIsInNjcmlwdHNMb2FkZWQiLCJpbml0IiwiZGF0YVVSTCIsImRlZmF1bHRDb2xvciIsIm9jZWFuY29sb3IiLCJvY2VhbkNvbG9yIiwiZmV0Y2giLCJnb29nbGVTaGVldCIsInJlc3BvbnNlIiwianNvbiIsInRyYW5zbGF0aW9ucyIsInBhcnNlTGFuZ3VhZ2VEYXRhIiwiZmVlZCIsImVudHJ5IiwiaW5pdFdpdGhTcHJlYWRzaGVldCIsInJlcXVpcmUiLCJkZWZhdWx0IiwiaW5pdFdpdGhvdXRTcHJlYWRzaGVldCIsImV4dGVybmFsTGluayIsIkN1c3RvbUV2ZW50IiwiZXZlbnQiLCJwYXJhbXMiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRldGFpbCIsInVuZGVmaW5lZCIsImV2dCIsImNyZWF0ZUV2ZW50IiwiaW5pdEN1c3RvbUV2ZW50IiwicHJvdG90eXBlIiwiRXZlbnQiLCJBcnJheSIsImdyb3VwQnkiLCJwcm9wZXJ0eTEiLCJwcm9wZXJ0eTIiLCJyZWR1Y2UiLCJncm91cHMiLCJpdGVtIiwidmFsIiwicHVzaCIsIlJlZ0V4cCIsImVzY2FwZSIsInMiLCJyZXBsYWNlIiwiY3JlYXRlQ29sb3JTY2FsZSIsImNvdW50IiwiaW5kZXgiLCJzY2FsZU9uZSIsImNocm9tYSIsImN1YmVoZWxpeCIsImh1ZSIsImxpZ2h0bmVzcyIsInNjYWxlIiwiY29sb3JzIiwic2NhbGVUd28iLCJnYW1tYSIsInJldmVyc2UiLCJpIiwiY29sb3IiLCJzYXR1cmF0ZSIsImhleCIsImxpbmVXZWlnaHRzIiwibGluZURhc2hBcnJheXMiLCJyZW1vdmUiLCJjb252ZXJ0VHlwZSIsInZhbHVlIiwidiIsIk51bWJlciIsImlzTmFOIiwidG9Mb3dlckNhc2UiLCJjYXBpdGFsaXplIiwic3RyaW5nIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImxvYWQiLCJlbGVtZW50IiwicmVxIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwic2VuZCIsImlubmVySFRNTCIsInJlc3BvbnNlVGV4dCIsIm1ha2VEcm9wZG93bk9wdGlvbnMiLCJ4Iiwid2lkZ2V0cyIsImtleXMiLCJjaG9pY2VzIiwiT2JqZWN0IiwibWFwIiwiZyIsInoiLCJpZCIsImxhYmVsIiwidHJpbSIsInBhcnNlSW50IiwiTmFOIiwiZGlzYWJsZWQiLCJyZW1vdmVJdGVtQnV0dG9uIiwibWF4SXRlbUNvdW50IiwibWF4aW11bSIsImNhbGxiYWNrT25DcmVhdGVUZW1wbGF0ZXMiLCJ0ZW1wbGF0ZSIsIl90aGlzIiwiY2xhc3NOYW1lcyIsImRhdGEiLCJrZXkiLCJmaW5kIiwia2V5U3R5bGUiLCJ0eXBlIiwiZm9ybXMiLCJrIiwiaW5kZXhPZiIsInN0eWxlT3B0aW9ucyIsInN0eWxlS2V5IiwibWFya3VwIiwiYWN0aXZlIiwiY2xhc3MiLCJzdmciLCJidG9hIiwiY2hvaWNlIiwiaXRlbUNob2ljZSIsIml0ZW1EaXNhYmxlZCIsIml0ZW1TZWxlY3RhYmxlIiwiY29uZmlnIiwiaXRlbVNlbGVjdFRleHQiLCJncm91cElkIiwiZmVhdHVyZSIsImdyb3VwIiwia2V5Q29sb3IiLCJ3IiwiZm9ybUtleVdpZGdldCIsImNvbG9yS2V5V2lkZ2V0IiwiY29sb3JLZXkiLCJwcm9wZXJ0aWVzIiwiZmllbGQiLCJmb3JtS2V5IiwiZXZlcnkiLCJhdmVyYWdlIiwiZm9ybSIsImRhcmtlbiIsImljb24iLCJzbHVnIiwicXVlcnlTZWxlY3RvciIsInN2Z0NvbnRlbnQiLCJtYXRjaCIsInAxIiwicDIiLCJwMyIsImljb25zaXplIiwicGF0dGVybiIsImNvbG9yVHdvIiwiY29sb3JPbmUiLCJtYXBJZCIsIkN1c3RvbU1hcCIsImNvbnRhaW5lciIsImZpbHRlcnMiLCJsZWFmbGV0IiwicHJvcGVydHkiLCJwb3B1cGNvbnRlbnQiLCJzcGxpdCIsInBvcHVwaGVhZGVycyIsImFsbCIsInJlc2V0RmlsdGVycyIsInJlbW92ZUdyb3VwcyIsInJlbW92ZUxheWVyIiwicmVuZGVyIiwiTCIsIm1pblpvb20iLCJtaW56b29tIiwibWF4Wm9vbSIsIm1heHpvb20iLCJtYXhCb3VuZHMiLCJtYXhib3VuZHMiLCJzd2JvdW5kcyIsIm5lYm91bmRzIiwic2Nyb2xsV2hlZWxab29tIiwiaW5uZXJXaWR0aCIsInpvb21Db250cm9sIiwiaGFzT3duUHJvcGVydHkiLCJ6b29tc2xpZGVyIiwiYXR0cmlidXRpb25Db250cm9sIiwibG9hZEV2ZW50Iiwib24iLCJsb2FkZXZlbnQiLCJhZGRFdmVudCIsImFkZGV2ZW50Iiwic2V0VmlldyIsImNlbnRlciIsInpvb20iLCJ0aWxlTGF5ZXIiLCJtYXBib3hzdHlsZSIsImFkZFRvIiwiY29udHJvbCIsImZ1bGxzY3JlZW4iLCJDb250cm9sIiwiRnVsbHNjcmVlbiIsImFkZENvbnRyb2wiLCJhdHRyaWJ1dGlvbiIsInBvc2l0aW9uIiwic2V0UHJlZml4IiwiaGFuZGxlRmVhdHVyZUV2ZW50cyIsImxheWVyIiwiZXZlbnRPcHRpb25zIiwib25lYWNoZmVhdHVyZSIsImNsaWNrIiwiaGFuZGxlTGF5ZXJDbGljayIsImxpc3RlbmVyIiwicG9wdXBDb250ZW50IiwiZm9ybWF0cG9wdXBjb250ZW50IiwiZm9ybWF0UG9wdXBDb250ZW50IiwiYmluZFBvcHVwIiwiY29udGVudCIsInAiLCJmaWx0ZXIiLCJqb2luIiwibGluayIsImh5cGVybGluayIsImV4dGVybmFsTGlua0NvbnRlbnQiLCJleHRlcm5hbExpbmtUZXh0IiwidHJhbnNsYXRhYmxlU3RyaW5ncyIsInNvcnQiLCJhIiwiYiIsInQiLCJyZSIsImlzU3BpZGVyZmllZCIsIl9wcmVTcGlkZXJmeUxhdGxuZyIsIl9sYXllcnMiLCJsIiwidW5zcGlkZXJmeSIsIl9fcGFyZW50IiwidmFsdWVzIiwiX2dyb3VwIiwiX2ZlYXR1cmVHcm91cCIsIl9zcGlkZXJmaWVkIiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJkIiwic3R5bGUiLCJvcGFjaXR5Iiwic3R5bGVQb2ludCIsImxhdGxuZyIsInBvaW50U3R5bGUiLCJDdXN0b21JY29uIiwiSWNvbiIsImV4dGVuZCIsImljb25TaXplIiwiaWNvbkFuY2hvciIsImljb25hbmNob3IiLCJub25Qb2ludFN0eWxlIiwiZGl2SWNvbiIsInRoaXNGb3JtS2V5V2lkZ2V0IiwidGhpc0NvbG9yS2V5V2lkZ2V0IiwiY2xhc3NOYW1lIiwiaHRtbCIsImNvbnNvbGUiLCJsb2ciLCJlbmNvZGVVUkkiLCJpY29uVXJsIiwibWFya2VyIiwic3R5bGVOb25Qb2ludCIsImZvcm1LZXlGb3JtIiwiYyIsImNvbG9yS2V5Rm9ybSIsImYiLCJ3ZWlnaHQiLCJsaW5lQ2FwIiwiZGFzaEFycmF5IiwicGF0dGVybk9wdGlvbnMiLCJzcGFjZVdlaWdodCIsInNwYWNlQ29sb3IiLCJzcGFjZU9wYWNpdHkiLCJhbmdsZSIsIlN0cmlwZVBhdHRlcm4iLCJzaGFwZU9wdGlvbnMiLCJ5IiwicmFkaXVzIiwiZmlsbCIsInN0cm9rZSIsImZpbGxDb2xvciIsImZpbGxPcGFjaXR5Iiwic2hhcGUiLCJQYXR0ZXJuQ2lyY2xlIiwid2lkdGgiLCJoZWlnaHQiLCJQYXR0ZXJuIiwiYWRkU2hhcGUiLCJmaWxsUGF0dGVybiIsImxpbmVDb2xvciIsImxpbmVXZWlnaHQiLCJsaW5lT3BhY2l0eSIsImdlb21ldHJ5IiwiYnJpZ2h0ZW4iLCJtYWtlR2VvSnNvbk9wdGlvbnMiLCJjb2xvcktleVdpZGdldHMiLCJmb3JtS2V5V2lkZ2V0cyIsIm9uRWFjaEZlYXR1cmUiLCJiYWNrZ3JvdW5kT3B0aW9ucyIsInBvaW50VG9MYXllciIsImZvcmVncm91bmRPcHRpb25zIiwibWFrZUxheWVycyIsImdlb0pzb25PcHRpb25zIiwiY2x1c3RlckNvbG9yIiwiY29sb3JLZXlzIiwid2lkZ2V0IiwiY29sbGVjdGlvbk5hbWUiLCJmZWF0dXJlcyIsImFsbFBvaW50cyIsIk1hcmtlckNsdXN0ZXJHcm91cCIsInNob3dDb3ZlcmFnZU9uSG92ZXIiLCJ6b29tVG9Cb3VuZHNPbkNsaWNrIiwibWF4Q2x1c3RlclJhZGl1cyIsImNsdXN0ZXJkaXN0YW5jZSIsImljb25DcmVhdGVGdW5jdGlvbiIsImNsdXN0ZXIiLCJnZXRDaGlsZENvdW50Iiwib3B0aW9uIiwibG9jYWxlQ29tcGFyZSIsImdlb0pzb24iLCJhZGRMYXllciIsImUiLCJoYW5kbGVDbHVzdGVyQ2xpY2siLCJfbGVhZmxldF9pZCIsInNwaWRlcmZ5IiwiZ2V0QWxsQ2hpbGRNYXJrZXJzIiwibSIsImdldEVsZW1lbnQiLCJtYXBXaWRnZXRzVG9TdGF0ZSIsInRhYmxlcyIsInRhYmxlIiwiYXBpa2V5IiwicmVzcG9uc2VzIiwianNvbnMiLCJjb25jYXQiLCJmZWF0dXJlR3JvdXBzIiwiYm94Iiwid2lkZ2V0Q29udGVudCIsIkNob2ljZXMiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlUmVzZXQiLCJzZWxlY3RzIiwiY2hlY2tzIiwic2VhcmNoIiwidG9nZ2xlIiwiaW5wdXRzIiwiaW5pdGlhbGl6ZWQiLCJpbnB1dCIsImhhbmRsZUNoYW5nZSIsImluaXRFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJmaXJlRXZlbnQiLCJtYXBfaWQiLCJ0cmFuc2xhdGFibGVOb2RlcyIsImVsIiwic2VsZWN0aW9ucyIsInBvc3NpYmxlQ2hlY2tzIiwibyIsIm5hbWUiLCJwb3NzaWJsZU9wdGlvbnMiLCJwb3NzaWJsZVF1ZXJpZXMiLCJxdWVyeSIsImJvb2wiLCJ3aXRoRGlhY3JpdGljcyIsIndpdGhvdXREaWFjcml0aWNzIiwibGF0aW5pc2UiLCJsYXllcnMiLCJncm91cGluZyIsIm1ha2VXaWRnZXRzIiwiYm94Q29udGVudCIsImxlZ2VuZERhdGEiLCJyZWZlcmVuY2UiLCJwYXJzZUxlZ2VuZERhdGEiLCJmb3JtYXRXaWRnZXRzIiwidGl0bGUiLCJub2RlcyIsImxhYmVsVGV4dCIsIml0ZW1UZXh0Iiwib2Zmc2V0SGVpZ2h0IiwiZm9udFNpemUiLCJnZXRDb21wdXRlZFN0eWxlIiwib2Zmc2V0IiwidHJhbnNmb3JtIiwid2lkZ2V0Tm9kZXMiLCJkcm9wZG93bk9wdGlvbnMiLCJpbnN0cnVjdGlvbnMiLCJsZWdlbmRJdGVtcyIsInNlbGVjdGVkIiwid2lkZ2V0VGl0bGUiLCJtYWtlRG9jdW1lbnROb2RlcyIsIm5ld1NlY3Rpb25IVE1MIiwibG9nbyIsImRlc2NyaXB0aW9uIiwidGl0bGVjYXJkY29udGVudCIsImJvZHkiLCJuZXdEaWFsb2dIVE1MIiwidGl0bGVjYXJkdGl0bGUiLCJvdmVyZmxvdyIsImRpYWxvZ0VsIiwiZ2V0RWxlbWVudEJ5SWQiLCJtYWluRWwiLCJkaWFsb2dUcmlnZ2VyIiwiZGlhbG9nQm94IiwiQTExeURpYWxvZyIsImRpYWxvZyIsInNob3ciLCJkaXNwbGF5IiwicHJvZ3JhbSIsIm1ldGFMb2NhbGVPRyIsInNldEF0dHJpYnV0ZSIsIm1ldGFUeXBlT0ciLCJtZXRhV2lkdGhPRyIsIm1ldGFIZWlnaHRPRyIsIm1ldGFUd2l0dGVyQ2FyZE9HIiwibWV0YVRpdGxlT0ciLCJtZXRhVGl0bGVUd2l0dGVyIiwibWV0YURlc2NyaXB0aW9uT0ciLCJtZXRhRGVzY3JpcHRpb25Ud2l0dGVyIiwibWV0YUltYWdlT0ciLCJzY3JlZW5zaG90IiwibWV0YUltYWdlVHdpdHRlciIsImlubmVyVGV4dCIsImJhY2tncm91bmRJbWFnZSIsIndlYnNpdGUiLCJtZXRhRGF0YSIsInBhcnNlTWV0YURhdGEiLCJwYXJzZVdpZGdldERhdGEiLCJ0d29EX3Byb3Blcml0ZXMiLCJtYXBJRCIsInJlZmVyZW5jZVNoZWV0cyIsInJlZmVyZW5jZVNoZWV0VVJMUyIsInUiLCJmb290ZXIiLCJmb290ZXJOb2RlIiwicGVuVWx0aW1hdGVOb2RlIiwicGFyZW50Tm9kZSIsImluc2VydEJlZm9yZSIsIm5leHRTaWJsaW5nIiwibGFuZ3VhZ2VEYXRhIiwicm93IiwiY29sdW1uIiwiY29sdW1uTmFtZSIsImNvbG9yU2NhbGUiLCJjb2xvclZhbCIsInByb2Nlc3MiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGtCQUFrQjtBQUNuRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FB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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0EsS0FBSyxLQUF3QyxFQUFFLEVBRTdDOztBQUVGLFFBQVEsc0JBQWlCO0FBQ3pCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7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QzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBMUIsTUFBTSxDQUFDeUIsT0FBUCxHQUFpQkEsT0FBakI7QUFDQXpCLE1BQU0sQ0FBQzhDLFlBQVAsR0FBc0JBLCtCQUF0QixDLENBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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VjtBQUNBdUYsS0FBQyxDQUFDdEMsRUFBRixHQUFPbkMsQ0FBUDtBQUNELEdBSEQ7QUFJQSxTQUFPNEIsT0FBUDtBQUNELEM7Ozs7Ozs7Ozs7Ozs7QUNsSEQsY0FBYyxtQkFBTyxDQUFDLGthQUF5Tzs7QUFFL1AsNENBQTRDLFFBQVM7O0FBRXJEO0FBQ0E7Ozs7QUFJQSxlQUFlOztBQUVmO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHNHQUFtRDs7QUFFeEU7O0FBRUEsR0FBRyxJQUFVO0FBQ2IsbUJBQW1CLGthQUF5TztBQUM1UCxtQkFBbUIsbUJBQU8sQ0FBQyxrYUFBeU87O0FBRXBRLG9EQUFvRCxRQUFTOztBQUU3RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBLEVBQUU7O0FBRUYsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDIiwiZmlsZSI6Im1ha2VNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gd2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XG4gXHRcdGlmIChwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xuIFx0fSA7XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcbiBcdFx0aWYgKG51bGwpIHNjcmlwdC5jcm9zc09yaWdpbiA9IG51bGw7XG4gXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7XG4gXHRcdHJlcXVlc3RUaW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQgfHwgMTAwMDA7XG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XG4gXHRcdFx0fVxuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQ7XG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XG4gXHRcdFx0fVxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRpZiAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XG4gXHRcdFx0XHRpZiAocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxuIFx0XHRcdFx0XHRyZWplY3QoXG4gXHRcdFx0XHRcdFx0bmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKVxuIFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuIFx0XHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXG4gXHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xuIFx0XHRcdFx0XHRcdHJldHVybjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI4YmQzMDkxZTk5MjkwMjAzYTAxNVwiO1xuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0aWYgKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiBcdFx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuIFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcbiBcdFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcInRcIlxuIFx0XHRcdCkge1xuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInJlYWR5XCIpIGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XG4gXHRcdFx0XHR0aHJvdyBlcnI7XG4gXHRcdFx0fSk7XG5cbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XG4gXHRcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xuIFx0XHRcdFx0XHRpZiAoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fTtcbiBcdFx0Zm4udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdFx0aWYgKG1vZGUgJiAxKSB2YWx1ZSA9IGZuKHZhbHVlKTtcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy50KHZhbHVlLCBtb2RlICYgfjEpO1xuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdFx0ZWxzZSBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG4gXHRcdFx0fSxcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRpZiAoIWwpIHJldHVybiBob3RTdGF0dXM7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG4gXHRcdH07XG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcbiBcdFx0cmV0dXJuIGhvdDtcbiBcdH1cblxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XG5cbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xuIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcbiBcdH1cblxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3REZWZlcnJlZDtcblxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XG4gXHRcdHZhciBpc051bWJlciA9ICtpZCArIFwiXCIgPT09IGlkO1xuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHtcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcbiBcdFx0fVxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcbiBcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9uZS1ibG9ja3NcbiBcdFx0XHR7XG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiZcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiZcbiBcdFx0XHRcdGhvdFdhaXRpbmdGaWxlcyA9PT0gMFxuIFx0XHRcdCkge1xuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXG4gXHRcdFx0cmV0dXJuO1xuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xuIFx0XHRmb3IgKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYgKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcbiBcdFx0aWYgKCFkZWZlcnJlZCkgcmV0dXJuO1xuIFx0XHRpZiAoaG90QXBwbHlPblVwZGF0ZSkge1xuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpXG4gXHRcdFx0XHQudGhlbihmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xuIFx0XHRcdFx0fSlcbiBcdFx0XHRcdC50aGVuKFxuIFx0XHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gXHRcdFx0XHRcdH0sXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHQpO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpXG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuIFx0XHR2YXIgY2I7XG4gXHRcdHZhciBpO1xuIFx0XHR2YXIgajtcbiBcdFx0dmFyIG1vZHVsZTtcbiBcdFx0dmFyIG1vZHVsZUlkO1xuXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcblxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5tYXAoZnVuY3Rpb24oaWQpIHtcbiBcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxuIFx0XHRcdFx0XHRpZDogaWRcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuIFx0XHRcdH07XG4gXHRcdH1cblxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XG4gXHRcdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xuIFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG4gXHRcdFx0KTtcbiBcdFx0fTtcblxuIFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xuIFx0XHRcdFx0LyoqIEB0eXBlIHtUT0RPfSAqL1xuIFx0XHRcdFx0dmFyIHJlc3VsdDtcbiBcdFx0XHRcdGlmIChob3RVcGRhdGVbaWRdKSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdC8qKiBAdHlwZSB7RXJyb3J8ZmFsc2V9ICovXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuIFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRkZWZhdWx0OlxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvQXBwbHkpIHtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdFx0XHRcdGlmIChcbiBcdFx0XHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0XHRcdFx0KVxuIFx0XHRcdFx0XHRcdCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiZcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkICYmXG4gXHRcdFx0XHQvLyByZW1vdmVkIHNlbGYtYWNjZXB0ZWQgbW9kdWxlcyBzaG91bGQgbm90IGJlIHJlcXVpcmVkXG4gXHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSAhPT0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHRcdH0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0fSk7XG5cbiBcdFx0dmFyIGlkeDtcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG4gXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcbiBcdFx0XHRcdGNiKGRhdGEpO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xuXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbiBcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4gXHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJhcHBseVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gXHRcdFx0XHRcdFx0aWYgKGNiKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoY2IpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcbiBcdFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuIFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHR0cnkge1xuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjI7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcbiBcdFx0aWYgKGVycm9yKSB7XG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuIFx0XHR9XG5cbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKFwiLi9zcmMvaW5kZXguanNcIikoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cblxudmFyIHN0eWxlc0luRG9tID0ge307XG5cbnZhclx0bWVtb2l6ZSA9IGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbztcblxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH07XG59O1xuXG52YXIgaXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xuXHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcblx0Ly8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG5cdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG59KTtcblxudmFyIGdldFRhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXQsIHBhcmVudCkge1xuICBpZiAocGFyZW50KXtcbiAgICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcbiAgfVxuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xufTtcblxudmFyIGdldEVsZW1lbnQgPSAoZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vID0ge307XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwgcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgcGFzc2luZyBmdW5jdGlvbiBpbiBvcHRpb25zLCB0aGVuIHVzZSBpdCBmb3IgcmVzb2x2ZSBcImhlYWRcIiBlbGVtZW50LlxuICAgICAgICAgICAgICAgIC8vIFVzZWZ1bCBmb3IgU2hhZG93IFJvb3Qgc3R5bGUgaS5lXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgaW5zZXJ0SW50bzogZnVuY3Rpb24gKCkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmb29cIikuc2hhZG93Um9vdCB9XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgc3R5bGVUYXJnZXQgPSBnZXRUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQsIHBhcmVudCk7XG5cdFx0XHQvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXHRcdFx0aWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG5cdFx0XHRcdFx0Ly8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuXHRcdH1cblx0XHRyZXR1cm4gbWVtb1t0YXJnZXRdXG5cdH07XG59KSgpO1xuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhclx0c2luZ2xldG9uQ291bnRlciA9IDA7XG52YXJcdHN0eWxlc0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vdXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKCFvcHRpb25zLnNpbmdsZXRvbiAmJiB0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gIT09IFwiYm9vbGVhblwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuICAgICAgICBpZiAoIW9wdGlvbnMuaW5zZXJ0SW50bykgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKCFvcHRpb25zLmluc2VydEF0KSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZSAobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSBkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20gKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzIChsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKSBzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2UgbmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50IChvcHRpb25zLCBzdHlsZSkge1xuXHR2YXIgdGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cblx0aWYgKCF0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlc0luc2VydGVkQXRUb3Bbc3R5bGVzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdFx0fVxuXHRcdHN0eWxlc0luc2VydGVkQXRUb3AucHVzaChzdHlsZSk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwib2JqZWN0XCIgJiYgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpIHtcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlLCB0YXJnZXQpO1xuXHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIG5leHRTaWJsaW5nKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJbU3R5bGUgTG9hZGVyXVxcblxcbiBJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0JyAoJ29wdGlvbnMuaW5zZXJ0QXQnKSBmb3VuZC5cXG4gTXVzdCBiZSAndG9wJywgJ2JvdHRvbScsIG9yIE9iamVjdC5cXG4gKGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyI2luc2VydGF0KVxcblwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQgKHN0eWxlKSB7XG5cdGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xuXG5cdHZhciBpZHggPSBzdHlsZXNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGUpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlc0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblxuXHRpZihvcHRpb25zLmF0dHJzLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0fVxuXG5cdGlmKG9wdGlvbnMuYXR0cnMubm9uY2UgPT09IHVuZGVmaW5lZCkge1xuXHRcdHZhciBub25jZSA9IGdldE5vbmNlKCk7XG5cdFx0aWYgKG5vbmNlKSB7XG5cdFx0XHRvcHRpb25zLmF0dHJzLm5vbmNlID0gbm9uY2U7XG5cdFx0fVxuXHR9XG5cblx0YWRkQXR0cnMoc3R5bGUsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGUpO1xuXG5cdHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRpZihvcHRpb25zLmF0dHJzLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0fVxuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Tm9uY2UoKSB7XG5cdGlmICh0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRyZXR1cm4gX193ZWJwYWNrX25vbmNlX187XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlIChvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlLCB1cGRhdGUsIHJlbW92ZSwgcmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgcmVzdWx0ID0gdHlwZW9mIG9wdGlvbnMudHJhbnNmb3JtID09PSAnZnVuY3Rpb24nXG5cdFx0ID8gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcykgXG5cdFx0IDogb3B0aW9ucy50cmFuc2Zvcm0uZGVmYXVsdChvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cbiIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvfFxccyokKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuIiwiaW1wb3J0IHsgcGFyc2VMYW5ndWFnZURhdGEgfSBmcm9tICcuL3BhcnNlcnMuanMnXG5cbnZhciB1cmwgPVxuICB3aW5kb3cubG9jYXRpb24gIT0gd2luZG93LnBhcmVudC5sb2NhdGlvblxuICAgID8gZG9jdW1lbnQucmVmZXJyZXJcbiAgICA6IGRvY3VtZW50LmxvY2F0aW9uLmhyZWZcbnZhciBocmVmID0gL2xhbmc9KFteJl0rKS8uZXhlYyh1cmwpXG53aW5kb3cubGFuZyA9IGhyZWYgPyBocmVmWzFdIDogbnVsbFxuXG52YXIgbGVhZmxldExvYWRlZCA9IDBcblxudmFyIHByaW1hcnlKc0ZpbGVzID0gW1xuICAnaHR0cHM6Ly91bnBrZy5jb20vbGVhZmxldEAxLjMuMS9kaXN0L2xlYWZsZXQuanMnLFxuICAnaHR0cHM6Ly91bnBrZy5jb20vd2hhdHdnLWZldGNoQDMuMC4wL2Rpc3QvZmV0Y2gudW1kLmpzJ1xuXVxuXG52YXIgc2Vjb25kYXJ5SnNGaWxlcyA9IFtcbiAgJ2h0dHBzOi8vdW5wa2cuY29tL2xlYWZsZXQuem9vbXNsaWRlckAwLjcuMS9zcmMvTC5Db250cm9sLlpvb21zbGlkZXIuanMnLFxuICAnaHR0cHM6Ly91bnBrZy5jb20vbGVhZmxldC1mdWxsc2NyZWVuQDEuMC4yL2Rpc3QvTGVhZmxldC5mdWxsc2NyZWVuLm1pbi5qcycsXG4gICdodHRwczovL3VucGtnLmNvbS9jaHJvbWEtanNAMi4wLjMvY2hyb21hLm1pbi5qcycsXG4gICdodHRwczovL2NzaXMtaWxhYi5naXRodWIuaW8vbWFwLXRlbXBsYXRlcy9kaXN0L2pzL3ZlbmRvci9BMTF5LURpYWxvZy5qcycsXG4gICdodHRwczovL3VucGtnLmNvbS9jaG9pY2VzLmpzQDcuMC4wL3B1YmxpYy9hc3NldHMvc2NyaXB0cy9jaG9pY2VzLm1pbi5qcycsXG4gICdodHRwczovL3VucGtnLmNvbS9sZWFmbGV0Lm1hcmtlcmNsdXN0ZXJAMS40LjEvZGlzdC9sZWFmbGV0Lm1hcmtlcmNsdXN0ZXIuanMnLFxuICAnaHR0cHM6Ly9jc2lzLWlsYWIuZ2l0aHViLmlvL21hcC10ZW1wbGF0ZXMvZGlzdC9qcy92ZW5kb3IvcGF0dGVybnMuanMnLFxuICAnaHR0cHM6Ly9jc2lzLWlsYWIuZ2l0aHViLmlvL21hcC10ZW1wbGF0ZXMvZGlzdC9qcy92ZW5kb3IvbGF0aW5pemUuanMnXG5dXG5cbmZ1bmN0aW9uIGhhbmRsZUxvYWRMZWFmbGV0KCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgc2Vjb25kYXJ5SnNGaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZFxuICAgICAgdmFyIGpzTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgICBqc0xpbmsuc3JjID0gZmlsZVxuICAgICAgaGVhZC5hcHBlbmRDaGlsZChqc0xpbmspXG5cbiAgICAgIGpzTGluay5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGVhZmxldExvYWRlZCsrXG5cbiAgICAgICAgaWYgKGxlYWZsZXRMb2FkZWQgPT09IHNlY29uZGFyeUpzRmlsZXMubGVuZ3RoICsgcHJpbWFyeUpzRmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcmVzb2x2ZShsZWFmbGV0TG9hZGVkKVxuICAgICAgICAgIHJldHVybiBsZWFmbGV0TG9hZGVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRGaWxlcygpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHByaW1hcnlKc0ZpbGVzLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkXG4gICAgICB2YXIganNMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgIGpzTGluay5zcmMgPSBmaWxlXG4gICAgICBqc0xpbmsub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGxlYWZsZXRMb2FkZWQrK1xuXG4gICAgICAgIGlmIChsZWFmbGV0TG9hZGVkID09PSBwcmltYXJ5SnNGaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICBoYW5kbGVMb2FkTGVhZmxldCgpXG4gICAgICAgICAgcmVzb2x2ZShsZWFmbGV0TG9hZGVkKVxuICAgICAgICAgIHJldHVybiBsZWFmbGV0TG9hZGVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoanNMaW5rKVxuICAgIH0pXG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlTWFwKG9wdGlvbnMpIHtcbiAgaWYgKCFsZWFmbGV0TG9hZGVkKSB7XG4gICAgcmV0dXJuIGF3YWl0IGltcG9ydEZpbGVzKCkudGhlbihhc3luYyBmdW5jdGlvbihzY3JpcHRzTG9hZGVkKSB7XG4gICAgICByZXR1cm4gYXdhaXQgaW5pdChvcHRpb25zKVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGF3YWl0IGluaXQob3B0aW9ucylcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0KG9wdGlvbnMpIHtcbiAgdmFyIGRhdGFVUkwgPSAnaHR0cHM6Ly9zcHJlYWRzaGVldHMuZ29vZ2xlLmNvbS9mZWVkcy9saXN0LydcbiAgd2luZG93LmRlZmF1bHRDb2xvciA9XG4gICAgb3B0aW9ucy5vY2VhbmNvbG9yIHx8IG9wdGlvbnMub2NlYW5Db2xvciB8fCBvcHRpb25zWydvY2VhbiBjb2xvciddXG4gIHZhciB0cmFuc2xhdGlvbnNcblxuICBpZiAobGFuZykge1xuICAgIGZldGNoKGRhdGFVUkwgKyBvcHRpb25zLmdvb2dsZVNoZWV0ICsgJy8nICsgMyArICcvcHVibGljL3ZhbHVlcz9hbHQ9anNvbicpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXG4gICAgICB9KVxuICAgICAgLnRoZW4oYXN5bmMgZnVuY3Rpb24oanNvbikge1xuICAgICAgICB0cmFuc2xhdGlvbnMgPSBwYXJzZUxhbmd1YWdlRGF0YShqc29uLmZlZWQuZW50cnkpXG5cbiAgICAgICAgY29uc3QgaW5pdFdpdGhTcHJlYWRzaGVldCA9IHJlcXVpcmUoJy4vaW5pdFdpdGhTcHJlYWRzaGVldC5qcycpLmRlZmF1bHRcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluaXRXaXRoU3ByZWFkc2hlZXQoZGF0YVVSTCwgb3B0aW9ucywgdHJhbnNsYXRpb25zKVxuICAgICAgfSlcbiAgfSBlbHNlIGlmIChvcHRpb25zLmdvb2dsZVNoZWV0KSB7XG4gICAgY29uc3QgaW5pdFdpdGhTcHJlYWRzaGVldCA9IHJlcXVpcmUoJy4vaW5pdFdpdGhTcHJlYWRzaGVldC5qcycpLmRlZmF1bHRcbiAgICByZXR1cm4gYXdhaXQgaW5pdFdpdGhTcHJlYWRzaGVldChkYXRhVVJMLCBvcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGluaXRXaXRob3V0U3ByZWFkc2hlZXQgPSByZXF1aXJlKCcuL2luaXRXaXRoU3ByZWFkc2hlZXQuanMnKS5kZWZhdWx0XG4gICAgcmV0dXJuIGF3YWl0IGluaXRXaXRob3V0U3ByZWFkc2hlZXQob3B0aW9ucylcbiAgfVxufVxuIiwiaW1wb3J0ICcuL3Njc3MvbWFpbi5zY3NzJ1xuaW1wb3J0ICdyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUnXG5pbXBvcnQgeyBtYWtlTWFwIH0gZnJvbSAnLi9qcy9tYWtlTWFwJ1xuaW1wb3J0IHsgZXh0ZXJuYWxMaW5rIH0gZnJvbSAnLi9qcy9oZWxwZXJzLmpzJ1xud2luZG93Lm1ha2VNYXAgPSBtYWtlTWFwXG53aW5kb3cuZXh0ZXJuYWxMaW5rID0gZXh0ZXJuYWxMaW5rXG4vLyA7KGFzeW5jIGZ1bmN0aW9uKCkge1xuLy8gICB2YXIgbmV3TWFwID0gYXdhaXQgbWFrZU1hcCh7XG4vLyAgICAgZ29vZ2xlU2hlZXQ6ICcxUjlKM2hhR0xEc1JQaHRUMVAxSnZRTF9YemFQWlpzYTMzdkJGTzZ4czZnNCcsXG4vLyAgICAgbWFwSUQ6ICdjaGluYXBvd2VyJyxcbi8vICAgICBtYXBib3hTdHlsZTpcbi8vICAgICAgIGxhbmcgJiYgbGFuZy5pbmRleE9mKCd6aC0nKSA+IC0xXG4vLyAgICAgICAgID8gJ2NpdHVpM3dhdzAwMTYyam8xemNzZjF1cmonXG4vLyAgICAgICAgIDogJ2NqODRzOWJldDEwZjUycm8ybHJuYTUweWcnLFxuLy8gICAgIG9uRWFjaEZlYXR1cmU6IHtcbi8vICAgICAgIG1vdXNlb3ZlcjogZnVuY3Rpb24gbW91c2VvdmVyKGUpIHtcbi8vICAgICAgICAgdGhpcy5vcGVuUG9wdXAoZS5sYXRsbmcpXG4vLyAgICAgICB9LFxuLy8gICAgICAgbW91c2VvdXQ6IGZ1bmN0aW9uIG1vdXNlb3ZlcihlKSB7XG4vLyAgICAgICAgIHRoaXMuY2xvc2VQb3B1cCgpXG4vLyAgICAgICB9XG4vLyAgICAgfSxcbi8vICAgICBmb3JtYXRQb3B1cENvbnRlbnQ6IGZ1bmN0aW9uKGZlYXR1cmUsIG1hcCkge1xuLy8gICAgICAgdmFyIHByZWZpeCA9IGxhbmcgPyAnXycgKyBsYW5nIDogJydcbi8vXG4vLyAgICAgICB2YXIgbmFtZSA9IGZlYXR1cmUucHJvcGVydGllc1snbmFtZScgKyBwcmVmaXhdXG4vL1xuLy8gICAgICAgLy8gdmFyIGRlc2NyaXB0aW9uID0gZmVhdHVyZS5wcm9wZXJ0aWVzWydkZXNjcmlwdGlvbicgKyBwcmVmaXhdXG4vLyAgICAgICAvLyAgIC5yZXBsYWNlKC88YSBocmVmPS9naSwgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9Jylcbi8vICAgICAgIC8vICAgLnJlcGxhY2UoLzxcXC9hPi9naSwgZXh0ZXJuYWxMaW5rICsgJzwvYT4nKVxuLy9cbi8vICAgICAgIHZhciBvdXRwb3N0ID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmNoaW5lc2Vfb3V0cG9zdHNcbi8vICAgICAgIHJldHVybiAoXG4vLyAgICAgICAgICc8ZGl2IGNsYXNzPVwicG9wdXBFbnRyeVN0eWxlXCI+JyArXG4vLyAgICAgICAgIG91dHBvc3QgK1xuLy8gICAgICAgICAobmFtZSAmJiBvdXRwb3N0ID8gJzxici8+JyA6ICcnKSArXG4vLyAgICAgICAgIChuYW1lICE9PSBvdXRwb3N0ID8gbmFtZSA6ICcnKSArXG4vLyAgICAgICAgIChmZWF0dXJlLnByb3BlcnRpZXMub2JzZXJ2ZWRcbi8vICAgICAgICAgICA/ICc8YnIvPihleHBlY3RlZCknXG4vLyAgICAgICAgICAgOiBmZWF0dXJlLnByb3BlcnRpZXMub2JzZXJ2ZWQgPT09IGZhbHNlXG4vLyAgICAgICAgICAgICA/ICc8YnIgLz4ob2JzZXJ2ZWQpJ1xuLy8gICAgICAgICAgICAgOiAnJykgK1xuLy8gICAgICAgICAnPC9kaXY+JyArXG4vLyAgICAgICAgICc8ZGl2IGNsYXNzPVwicG9wdXBFbnRyeVN0eWxlXCI+JyArXG4vLyAgICAgICAgICdkZXNjcmlwdGlvbicgK1xuLy8gICAgICAgICAnPC9kaXY+J1xuLy8gICAgICAgKVxuLy8gICAgIH1cbi8vICAgfSlcbi8vIH0pKClcblxuLy8gbWFrZU1hcCh7XG4vLyAgIGdvb2dsZVNoZWV0OiAnMWdHMG00eFJWZUJRN2VUeXBmWjBTUWV2X1J4VUswdWpfOUlseVVxU2V2N2MnLFxuLy8gICBtYXBJRDogJ2FpZC10ZXJyb3Jpc20nLFxuLy8gICBmb3JtYXRQb3B1cENvbnRlbnQ6IGZ1bmN0aW9uKGZlYXR1cmUsIG1hcCkge1xuLy8gICAgIHZhciBqc29ucyA9IG1hcC5qc29uXG4vLyAgICAgICAucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbi8vICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuLy8gICAgICAgICAgIGZlYXR1cmVzOiBhLmZlYXR1cmVzLmNvbmNhdChiLmZlYXR1cmVzKVxuLy8gICAgICAgICB9XG4vLyAgICAgICB9KVxuLy8gICAgICAgLmZlYXR1cmVzLm1hcChmdW5jdGlvbihmKSB7XG4vLyAgICAgICAgIHJldHVybiBmLnByb3BlcnRpZXNcbi8vICAgICAgIH0pXG4vL1xuLy8gICAgIHZhciBjb3VudHJ5RGF0YSA9IGpzb25zXG4vLyAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGYpIHtcbi8vICAgICAgICAgcmV0dXJuIGYuY291bnRyeSA9PT0gZmVhdHVyZS5wcm9wZXJ0aWVzLmNvdW50cnlcbi8vICAgICAgIH0pXG4vLyAgICAgICAucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbi8vICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICB0ZXJyb3Jpc206IGEudGVycm9yaXNtID8gYS50ZXJyb3Jpc20gOiBiLnRlcnJvcmlzbSxcbi8vICAgICAgICAgICBmb3JlaWduX2Fzc2lzdGFuY2U6IGEuZm9yZWlnbl9hc3Npc3RhbmNlXG4vLyAgICAgICAgICAgICA/IGEuZm9yZWlnbl9hc3Npc3RhbmNlXG4vLyAgICAgICAgICAgICA6IGIuZm9yZWlnbl9hc3Npc3RhbmNlXG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0pXG4vL1xuLy8gICAgIHZhciBncm91cHMgPSAnJyxcbi8vICAgICAgIGFzc2lzdGFuY2UsXG4vLyAgICAgICB0ZXJyb3Jpc20gPSBjb3VudHJ5RGF0YS50ZXJyb3Jpc20sXG4vLyAgICAgICBhaWQgPSB7XG4vLyAgICAgICAgIGU6ICckMTAwLDAwMCwwMDAtJDEsNTAwLDAwMCwwMDAnLFxuLy8gICAgICAgICBkOiAnJDMwLDAwMCwwMDAtJDk5LDAwMCwwMDAnLFxuLy8gICAgICAgICBjOiAnJDIsMDAwLDAwMC0kMjksOTk5LDAwMCcsXG4vLyAgICAgICAgIGI6ICckMTAsMDAwLSQxLDk5OSwwMDAnLFxuLy8gICAgICAgICBhOiAnJDAtJDEwLDAwMCdcbi8vICAgICAgIH1cbi8vXG4vLyAgICAgaWYgKHRlcnJvcmlzbS5sZW5ndGgpIHtcbi8vICAgICAgIGdyb3VwcyA9IGA8YnI+PGRpdiBjbGFzcz1cInBvcHVwSGVhZGVyU3R5bGVcIj5UZXJyb3Jpc3QgR3JvdXBzPC9kaXY+XG4vLyAgICAgICA8dWw+JHt0ZXJyb3Jpc21cbi8vICAgICAuc3BsaXQoJ34nKVxuLy8gICAgIC5tYXAoZnVuY3Rpb24oZ3JvdXApIHtcbi8vICAgICAgIHJldHVybiBgPGxpIGNsYXNzPSdwb3B1cEVudHJ5U3R5bGUnPiR7Z3JvdXB9PC9saT5gXG4vLyAgICAgfSlcbi8vICAgICAuam9pbignJyl9PC91bD5gXG4vLyAgICAgfVxuLy9cbi8vICAgICBhc3Npc3RhbmNlID0gYWlkW2NvdW50cnlEYXRhLmZvcmVpZ25fYXNzaXN0YW5jZV1cbi8vICAgICAgID8gYDxkaXYgY2xhc3M9XCJwb3B1cEhlYWRlclN0eWxlXCI+Rm9yZWlnbiBBc3Npc3RhbmNlOiAkeyhhc3Npc3RhbmNlID1cbi8vICAgICAgICAgICBhaWRbY291bnRyeURhdGEuZm9yZWlnbl9hc3Npc3RhbmNlXSl9PC9kaXY+YFxuLy8gICAgICAgOiAnJ1xuLy9cbi8vICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJwb3B1cFRpdGxlU3R5bGVcIj4ke2ZlYXR1cmUucHJvcGVydGllcy5jb3VudHJ5fTwvZGl2PlxuLy8gICAgICAgJHthc3Npc3RhbmNlfSAgICAgICR7Z3JvdXBzfWBcbi8vICAgfVxuLy8gfSlcblxuLy8gbWFrZU1hcCh7XG4vLyAgIGdvb2dsZVNoZWV0OiAnMVI5SjNoYUdMRHNSUGh0VDFQMUp2UUxfWHphUFpac2EzM3ZCRk82eHM2ZzQnLFxuLy8gICBtYXBJRDogJ2NoaW5hcG93ZXInLFxuLy8gICBtYXBib3hTdHlsZTpcbi8vICAgICBsYW5nICYmIGxhbmcuaW5kZXhPZignemgtJykgPiAtMVxuLy8gICAgICAgPyAnY2l0dWkzd2F3MDAxNjJqbzF6Y3NmMXVyaidcbi8vICAgICAgIDogJ2NqODRzOWJldDEwZjUycm8ybHJuYTUweWcnLFxuLy8gICBvbkVhY2hGZWF0dXJlOiB7XG4vLyAgICAgbW91c2VvdmVyOiBmdW5jdGlvbiBtb3VzZW92ZXIoZSkge1xuLy8gICAgICAgdGhpcy5vcGVuUG9wdXAoZS5sYXRsbmcpXG4vLyAgICAgfSxcbi8vICAgICBtb3VzZW91dDogZnVuY3Rpb24gbW91c2VvdmVyKGUpIHtcbi8vICAgICAgIHRoaXMuY2xvc2VQb3B1cCgpXG4vLyAgICAgfVxuLy8gICB9LFxuLy8gICBmb3JtYXRQb3B1cENvbnRlbnQ6IGZ1bmN0aW9uKGZlYXR1cmUsIG1hcCkge1xuLy8gICAgIHZhciBwcmVmaXggPSBsYW5nID8gJ18nICsgbGFuZyA6ICcnXG4vL1xuLy8gICAgIHZhciBuYW1lID0gZmVhdHVyZS5wcm9wZXJ0aWVzWyduYW1lJyArIHByZWZpeF1cbi8vXG4vLyAgICAgLy8gdmFyIGRlc2NyaXB0aW9uID0gZmVhdHVyZS5wcm9wZXJ0aWVzWydkZXNjcmlwdGlvbicgKyBwcmVmaXhdXG4vLyAgICAgLy8gICAucmVwbGFjZSgvPGEgaHJlZj0vZ2ksICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPScpXG4vLyAgICAgLy8gICAucmVwbGFjZSgvPFxcL2E+L2dpLCBleHRlcm5hbExpbmsgKyAnPC9hPicpXG4vL1xuLy8gICAgIHZhciBvdXRwb3N0ID0gZmVhdHVyZS5wcm9wZXJ0aWVzLmNoaW5lc2Vfb3V0cG9zdHNcbi8vICAgICByZXR1cm4gKFxuLy8gICAgICAgJzxkaXYgY2xhc3M9XCJwb3B1cEVudHJ5U3R5bGVcIj4nICtcbi8vICAgICAgIG91dHBvc3QgK1xuLy8gICAgICAgKG5hbWUgJiYgb3V0cG9zdCA/ICc8YnIvPicgOiAnJykgK1xuLy8gICAgICAgKG5hbWUgIT09IG91dHBvc3QgPyBuYW1lIDogJycpICtcbi8vICAgICAgIChmZWF0dXJlLnByb3BlcnRpZXMub2JzZXJ2ZWRcbi8vICAgICAgICAgPyAnPGJyLz4oZXhwZWN0ZWQpJ1xuLy8gICAgICAgICA6IGZlYXR1cmUucHJvcGVydGllcy5vYnNlcnZlZCA9PT0gZmFsc2Vcbi8vICAgICAgICAgICA/ICc8YnIgLz4ob2JzZXJ2ZWQpJ1xuLy8gICAgICAgICAgIDogJycpICtcbi8vICAgICAgICc8L2Rpdj4nICtcbi8vICAgICAgICc8ZGl2IGNsYXNzPVwicG9wdXBFbnRyeVN0eWxlXCI+JyArXG4vLyAgICAgICAnZGVzY3JpcHRpb24nICtcbi8vICAgICAgICc8L2Rpdj4nXG4vLyAgICAgKVxuLy8gICB9XG4vLyB9KVxuXG4vLyB2YXIgbWFwcyA9IFtcbi8vICAgLy8ge1xuLy8gICAvLyAgIGlkOiAnY2xhaW1zLW1hcCcsXG4vLyAgIC8vICAgc2hlZXQ6ICcxNE12dWNNYWMtbFlDdTAtMnZENXRjeGZDVXFJSm9nMmg0LVJFRmtwSDNLdycsXG4vLyAgIC8vICAgJ3BvcHVwIGhlYWRlcnMnOiBbXG4vLyAgIC8vICAgICB3aW5kb3cubGFuZyA/ICduYW1lXycgKyB3aW5kb3cubGFuZyA6ICduYW1lJyxcbi8vICAgLy8gICAgIHdpbmRvdy5sYW5nID8gJ2Rlc2NyaXB0aW9uXycgKyB3aW5kb3cubGFuZyA6ICdkZXNjcmlwdGlvbicsXG4vLyAgIC8vICAgICAnbGluaydcbi8vICAgLy8gICBdXG4vLyAgIC8vIH1cbi8vICAgLy8gLFxuLy8gICB7XG4vLyAgICAgaWQ6ICd2ZW5lenVlbGEnLFxuLy8gICAgIHNoZWV0OiAnMTN0dm94YzdrQjhCelNLTzY3YzZrZjk0OWtxdGVfby1XRkY1VzIxaDVPOTgnXG4vLyAgIH0sXG4vLyAgIHtcbi8vICAgICBpZDogJ2ZlYXR1cmVzLW1hcCcsXG4vLyAgICAgc2hlZXQ6ICcxUkVGTko4V1o5Zk96U2hZQzhTcFVKN3BaUUVNa1dscXpDMktwTWItd1N5Yydcbi8vICAgfSxcbi8vICAge1xuLy8gICAgIGlkOiAncmVzb3VyY2VzLW1hcCcsXG4vLyAgICAgc2hlZXQ6ICcxMXJVYW9JU1NrcWFrRUtaNmhpNHhlVmJiaUVuZlBpMXFzUm9xNHIwU3JQQScsXG4vLyAgICAgJ3BvcHVwIGhlYWRlcnMnOiBbXG4vLyAgICAgICBsYW5nID8gJ25hbWVfJyArIGxhbmcgOiAnbmFtZScsXG4vLyAgICAgICBsYW5nID8gJ2Rlc2NyaXB0aW9uXycgKyBsYW5nIDogJ2Rlc2NyaXB0aW9uJyxcbi8vICAgICAgICdsaW5rJ1xuLy8gICAgIF1cbi8vICAgfSxcbi8vICAge1xuLy8gICAgIGlkOiAnYWVnaXMnLFxuLy8gICAgIHNoZWV0OiAnMTVvSlNtazBLVzNfNUQ4VWoxZVNpei1lLVBwVzUxZTlOLVhTZ0xJUXRaSWsnXG4vLyAgIH0sXG4vLyAgIHtcbi8vICAgICBpZDogJ3diaS10ZXJyb3Jpc20nLFxuLy8gICAgIHNoZWV0OiAnMWQ0RWU2NUtUX1M0NngwbWs2MnNWNkNZRHBNWjQwYzJvWUo2QlFzOWFfMTAnXG4vLyAgIH1cbi8vIF1cbi8vXG4vLyBtYXBzLnJldmVyc2UoKS5mb3JFYWNoKChtYXAsIGkpID0+IHtcbi8vICAgdmFyIG1hcGJveFN0eWxlID1cbi8vICAgICBsYW5nICYmIGxhbmcuaW5kZXhPZignemgtJykgPiAtMVxuLy8gICAgICAgPyAobWFwYm94U3R5bGUgPSAnY2l0dWkzd2F3MDAxNjJqbzF6Y3NmMXVyaicpXG4vLyAgICAgICA6IChtYXBib3hTdHlsZSA9ICdjajg0czliZXQxMGY1MnJvMmxybmE1MHlnJylcbi8vXG4vLyAgIHNldFRpbWVvdXQoKCkgPT4ge1xuLy8gICAgIGNvbnNvbGUubG9nKCdhbm90aGVyIG9uZScpXG4vLyAgICAgbWFrZU1hcCh7XG4vLyAgICAgICBtYXBJRDogbWFwLmlkLFxuLy8gICAgICAgZXh0ZXJuYWxMaW5rVGV4dDogJ3lvLCBjbGljayBoZXJlJyxcbi8vICAgICAgIGdvb2dsZVNoZWV0OiBtYXAuc2hlZXQsXG4vLyAgICAgICBmdWxsU2NyZWVuOiB0cnVlLFxuLy8gICAgICAgJ21hcGJveCBzdHlsZSc6XG4vLyAgICAgICAgIG1hcC5pZCA9PT0gJ2FlZ2lzJ1xuLy8gICAgICAgICAgID8gJ2Nqb2l2NmRtbzI5a2gycnNkMno1cWRhMnAnXG4vLyAgICAgICAgICAgOiBtYXAuaWQgPT09ICd2ZW5lenVlbGEnIHx8IG1hcC5pZCA9PT0gJ3diaS10ZXJyb3Jpc20nXG4vLyAgICAgICAgICAgICA/ICdjanJhd2MxenMyYnpjMnNxM3k5d3Z0MjJ0J1xuLy8gICAgICAgICAgICAgOiBtYXBib3hTdHlsZSxcbi8vICAgICAgICdvY2VhbiBjb2xvcic6ICcjY2FkMmQzJyxcbi8vICAgICAgICdwb3B1cCBoZWFkZXJzJzogbWFwWydwb3B1cCBoZWFkZXJzJ10sIC8vIEFycmF5XG4vLyAgICAgICAvLyBcInBvcHVwIGNvbnRlbnRcIjogW10sXG4vLyAgICAgICAvLyBwb2ludFN0eWxlOiBmdW5jdGlvbihmZWF0dXJlLGxhdGxuZyl7fSxcbi8vICAgICAgIC8vIG5vblBvaW50U3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpe30sXG4vLyAgICAgICAvLyBvbkVhY2hGZWF0dXJlOiB7XG4vLyAgICAgICAvLyBjbGljazogZnVuY3Rpb24oZmVhdHVyZSwgbGF5ZXIpe31cbi8vICAgICAgIC8vIGRiY2xpY2s6IGZ1bmN0aW9uKGZlYXR1cmUsIGxheWVyLCBtYXApe30sXG4vLyAgICAgICAvLyBtb3VzZWRvd246IGZ1bmN0aW9uKGZlYXR1cmUsIGxheWVyLCBtYXApe30sXG4vLyAgICAgICAvLyBtb3VzZWVudGVyOiBmdW5jdGlvbihmZWF0dXJlLCBsYXllciwgbWFwKXt9LFxuLy8gICAgICAgLy8gbW91c2VvdXQ6IGZ1bmN0aW9uKGZlYXR1cmUsIGxheWVyLCBtYXApe31cbi8vICAgICAgIC8vIH0sXG4vLyAgICAgICBmb3JtYXRQb3B1cENvbnRlbnQ6XG4vLyAgICAgICAgIG1hcC5pZCA9PT0gJ2FlZ2lzJ1xuLy8gICAgICAgICAgID8gZnVuY3Rpb24oZmVhdHVyZSwgbWFwKSB7XG4vLyAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJwb3B1cFRpdGxlU3R5bGVcIj4ke1xuLy8gICAgICAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXMubmFtZVxuLy8gICAgICAgICAgICAgfTwvZGl2PlxuLy9cbi8vICAgICAgICAgJHtcbi8vICAgZmVhdHVyZS5wcm9wZXJ0aWVzLnRvdGFsX2d1aWRlZF9taXNzaWxlX2NydWlzZXJzXG4vLyAgICAgPyBgPGRpdiBjbGFzcz1cInBvcHVwSGVhZGVyU3R5bGVcIj5HdWlkZWQgTWlzc2lsZSBDcnVpc2VyczogJHtcbi8vICAgICAgIGZlYXR1cmUucHJvcGVydGllcy50b3RhbF9ndWlkZWRfbWlzc2lsZV9jcnVpc2Vyc1xuLy8gICAgIH08L2Rpdj5cbi8vICAgICAgICAgPGRpdj48c3BhbiBjbGFzcz0ncG9wdXBFbnRyeVN0eWxlJz5CTUQtQ2FwYWJsZTo8L3NwYW4+XG4vLyAgICAgICAgIDxzcGFuIGNsYXNzPSdwb3B1cEVudHJ5U3R5bGUnPiR7XG4vLyAgIGZlYXR1cmUucHJvcGVydGllcy5ibWRfY2FwYWJsZV9nbWNcbi8vIH08L3NwYW4+PC9kaXY+YFxuLy8gICAgIDogJydcbi8vIH1cbi8vICAgICAke1xuLy8gICBmZWF0dXJlLnByb3BlcnRpZXMudG90YWxfZ3VpZGVkX21pc3NpbGVfZGVzdHJveWVyc1xuLy8gICAgID8gYDxkaXYgY2xhc3M9XCJwb3B1cEhlYWRlclN0eWxlXCI+R3VpZGVkIE1pc3NpbGUgRGVzdHJveWVyczogJHtcbi8vICAgICAgIGZlYXR1cmUucHJvcGVydGllcy50b3RhbF9ndWlkZWRfbWlzc2lsZV9kZXN0cm95ZXJzXG4vLyAgICAgfTwvZGl2PlxuLy8gICAgIDxkaXY+PHNwYW4gY2xhc3M9J3BvcHVwRW50cnlTdHlsZSc+Qk1ELUNhcGFibGU6PC9zcGFuPlxuLy8gICAgIDxzcGFuIGNsYXNzPSdwb3B1cEVudHJ5U3R5bGUnPiR7XG4vLyAgIGZlYXR1cmUucHJvcGVydGllcy50b3RhbF9ndWlkZWRfbWlzc2lsZV9kZXN0cm95ZXJzXG4vLyB9PC9zcGFuPjwvZGl2PmBcbi8vICAgICA6ICcnXG4vLyB9YFxuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgICA6IG1hcC5pZCA9PT0gJ3ZlbmV6dWVsYSdcbi8vICAgICAgICAgICAgID8gZnVuY3Rpb24oZmVhdHVyZSwgbWFwKSB7XG4vLyAgICAgICAgICAgICAgIHJldHVybiAoXG4vLyAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwb3B1cEhlYWRlclN0eWxlXCI+JyArXG4vLyAgICAgICAgICAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXMuY291bnRyeSArXG4vLyAgICAgICAgICAgICAgICAgICAnPC9kaXY+PGRpdiBjbGFzcz1cInBvcHVwRW50cnlTdHlsZVwiPicgK1xuLy8gICAgICAgICAgICAgICAgICAgKGZlYXR1cmUucHJvcGVydGllcy5yZWNvZ25pdGlvbi50b0xvd2VyQ2FzZSgpID09PSAneSdcbi8vICAgICAgICAgICAgICAgICAgICAgPyBmZWF0dXJlLnByb3BlcnRpZXMuY291bnRyeSArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgJyByZWNvZ25pemVzIEp1YW4gR3VhaWRcXHhGMyBhcyBQcmVzaWRlbnQgb2YgVmVuZXp1ZWxhJ1xuLy8gICAgICAgICAgICAgICAgICAgICA6IGZlYXR1cmUucHJvcGVydGllcy5jb3VudHJ5ICtcbi8vICAgICAgICAgICAgICAgICAgICAgICAnIHJlY29nbml6ZXMgTmljb2xcXHhFMXMgTWFkdXJvIGFzIFByZXNpZGVudCBvZiBWZW5lenVlbGE8L2Rpdj4nKSArXG4vLyAgICAgICAgICAgICAgICAgICAnPC9kaXY+J1xuLy8gICAgICAgICAgICAgICApXG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICA6IG51bGxcbi8vICAgICB9KVxuLy8gICB9LCAyMDAwICogaSlcbi8vIH0pXG5cbmlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ICE9PSAnZnVuY3Rpb24nKSB7XG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH1cbiAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50JylcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpXG4gICAgcmV0dXJuIGV2dFxuICB9XG5cbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZVxuXG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50XG59XG5cbkFycmF5LnByb3RvdHlwZS5ncm91cEJ5ID0gZnVuY3Rpb24ocHJvcGVydHkxLCBwcm9wZXJ0eTIpIHtcbiAgcmV0dXJuIHByb3BlcnR5MlxuICAgID8gdGhpcy5yZWR1Y2UoZnVuY3Rpb24oZ3JvdXBzLCBpdGVtKSB7XG4gICAgICB2YXIgdmFsID0gaXRlbVtwcm9wZXJ0eTJdW3Byb3BlcnR5MV1cbiAgICAgIGdyb3Vwc1t2YWxdID0gZ3JvdXBzW3ZhbF0gfHwgW11cbiAgICAgIGdyb3Vwc1t2YWxdLnB1c2goaXRlbSlcbiAgICAgIHJldHVybiBncm91cHNcbiAgICB9LCB7fSlcbiAgICA6IHRoaXMucmVkdWNlKGZ1bmN0aW9uKGdyb3VwcywgaXRlbSkge1xuICAgICAgdmFyIHZhbCA9IGl0ZW1bcHJvcGVydHkxXVxuICAgICAgZ3JvdXBzW3ZhbF0gPSBncm91cHNbdmFsXSB8fCBbXVxuICAgICAgZ3JvdXBzW3ZhbF0ucHVzaChpdGVtKVxuICAgICAgcmV0dXJuIGdyb3Vwc1xuICAgIH0sIHt9KVxufVxuXG5SZWdFeHAuZXNjYXBlID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29sb3JTY2FsZShjb3VudCwgaW5kZXgpIHtcbiAgdmFyIHNjYWxlT25lID0gY2hyb21hXG4gICAgLmN1YmVoZWxpeCgpXG4gICAgLmh1ZSgwLjUpXG4gICAgLmxpZ2h0bmVzcyhbMC40LCAwLjZdKVxuICAgIC5zY2FsZSgpXG4gICAgLmNvbG9ycyhjb3VudCAqIDIpXG4gIHZhciBzY2FsZVR3byA9IGNocm9tYVxuICAgIC5jdWJlaGVsaXgoKVxuICAgIC5odWUoMSlcbiAgICAuZ2FtbWEoMC41KVxuICAgIC5zY2FsZSgpXG4gICAgLmNvbG9ycyhjb3VudCAqIDIpXG4gICAgLnJldmVyc2UoKVxuICB2YXIgc2NhbGUgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIHZhciBjb2xvciA9IGkgJSAyID09PSAwID8gc2NhbGVPbmVbaSAqIDJdIDogc2NhbGVUd29baSAqIDJdXG4gICAgY29sb3IgPSBjaHJvbWEoY29sb3IpXG4gICAgICAuc2F0dXJhdGUoKVxuICAgICAgLmhleCgpXG4gICAgc2NhbGUucHVzaChjb2xvcilcbiAgfVxuXG4gIHJldHVybiBzY2FsZVxufVxuXG5leHBvcnQgdmFyIGxpbmVXZWlnaHRzID0gW1szLCAzXSwgWzUsIDJdLCBbNCwgMy41XSwgWzcsIDNdLCBbNCwgNF1dXG5leHBvcnQgdmFyIGxpbmVEYXNoQXJyYXlzID0gW1xuICBbbnVsbCwgJzYsOSddLFxuICBbbnVsbCwgbnVsbF0sXG4gIFtudWxsLCAnNiwxMiddLFxuICBbbnVsbCwgbnVsbF0sXG4gIFsnMTgsMjQnLCAnMTgsMjQnXVxuXVxuZXhwb3J0IHZhciBleHRlcm5hbExpbmsgPVxuICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCIgdmlld0JveD1cIjAgMCAxNSAxNVwiPjxwYXRoIGQ9XCJNNy40OSwwVjEuNjdIMS42OFYxMy4zMkgxMy4zMlY3LjUySDE1djUuNzJhMS43NiwxLjc2LDAsMCwxLS40MiwxLjE5LDEuNjQsMS42NCwwLDAsMS0xLjEzLjU2SDEuNzRhMS42NywxLjY3LDAsMCwxLTEuMTYtLjQxQTEuNjEsMS42MSwwLDAsMSwwLDEzLjQ4di0uMjdDMCw5LjQsMCw1LjYsMCwxLjhBMS44MywxLjgzLDAsMCwxLC41OC40YTEuNTMsMS41MywwLDAsMSwxLS4zOWg2WlwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwIDApXCIvPjxwYXRoIGQ9XCJNOS4xNywxLjY3VjBIMTVWNS44NEgxMy4zNHYtM2gwYy0uMDUuMDUtLjExLjEtLjE2LjE2bC0uNDUuNDYtMS4zLDEuMjktLjg0Ljg0LS44OS45LS44OC44Ny0uODkuOWMtLjI4LjI5LS41Ny41Ny0uODYuODZMNi4xNiwxMGwtLjg4Ljg3YTEuODMsMS44MywwLDAsMS0uMTMuMTZMNCw5Ljg2bDAsMEw1LjM2LDguNDdsLjk1LTEsLjc1LS43NSwxLTFMOC44Nyw1bDEtLjk0Ljg1LS44Ni45Mi0uOTEuNTYtLjU4WlwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwIDApXCIvPjwvc3ZnPidcbmV4cG9ydCB2YXIgcmVtb3ZlID1cbiAgJzxzdmcgdmlld0JveD1cIjAgMCAyMSAyMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48ZyBmaWxsPVwiIzAwMFwiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIj48cGF0aCBkPVwiTTIuNTkyLjA0NGwxOC4zNjQgMTguMzY0LTIuNTQ4IDIuNTQ4TC4wNDQgMi41OTJ6XCIvPjxwYXRoIGQ9XCJNMCAxOC4zNjRMMTguMzY0IDBsMi41NDggMi41NDhMMi41NDggMjAuOTEyelwiLz48L2c+PC9zdmc+J1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFR5cGUodmFsdWUpIHtcbiAgdmFyIHYgPSBOdW1iZXIodmFsdWUpXG4gIHJldHVybiAhaXNOYU4odilcbiAgICA/IHZcbiAgICA6IHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd1bmRlZmluZWQnXG4gICAgICA/IHVuZGVmaW5lZFxuICAgICAgOiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAnbnVsbCdcbiAgICAgICAgPyBudWxsXG4gICAgICAgIDogdmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnXG4gICAgICAgICAgPyB0cnVlXG4gICAgICAgICAgOiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAnZmFsc2UnXG4gICAgICAgICAgICA/IGZhbHNlXG4gICAgICAgICAgICA6IHZhbHVlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkKHVybCwgZWxlbWVudCkge1xuICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgcmVxLm9wZW4oJ0dFVCcsIHVybCwgZmFsc2UpXG4gIHJlcS5zZW5kKG51bGwpXG4gIGVsZW1lbnQuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZURyb3Bkb3duT3B0aW9ucyhvcHRpb25zLCB4KSB7XG4gIHZhciBncm91cHMgPSBvcHRpb25zLndpZGdldHNbeF0ua2V5cy5ncm91cEJ5KCdncm91cCcpXG4gIHZhciBjaG9pY2VzID0gT2JqZWN0LmtleXMoZ3JvdXBzKS5tYXAoZnVuY3Rpb24oZywgeikge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogeixcbiAgICAgIGxhYmVsOiBnLnRyaW0oKSAmJiBwYXJzZUludChnLCAxMCkgPT09IE5hTiA/IGcgOiAnJyxcbiAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgIGNob2ljZXM6IGdyb3Vwc1tnXVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHtcbiAgICBjaG9pY2VzOiBjaG9pY2VzLFxuICAgIHJlbW92ZUl0ZW1CdXR0b246IHRydWUsXG4gICAgbWF4SXRlbUNvdW50OiBvcHRpb25zLndpZGdldHNbeF0ubWF4aW11bSxcbiAgICBjYWxsYmFja09uQ3JlYXRlVGVtcGxhdGVzOiBmdW5jdGlvbiBjYWxsYmFja09uQ3JlYXRlVGVtcGxhdGVzKHRlbXBsYXRlKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGl0ZW06IGZ1bmN0aW9uIGl0ZW0oY2xhc3NOYW1lcywgZGF0YSkge1xuICAgICAgICAgIHZhciBrZXkgPSBvcHRpb25zLndpZGdldHNbeF0ua2V5cy5maW5kKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgIHJldHVybiB2LnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IGRhdGEudmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdmFyIGtleVN0eWxlXG5cbiAgICAgICAgICBzd2l0Y2ggKG9wdGlvbnMud2lkZ2V0c1t4XS50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnZm9ybSc6XG4gICAgICAgICAgICB2YXIgZm9ybXMgPSBvcHRpb25zLndpZGdldHNbeF0ua2V5cy5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgICByZXR1cm4gay52YWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB2YXIgaSA9IGZvcm1zLmluZGV4T2Yoa2V5LnZhbHVlLnRvTG93ZXJDYXNlKCkpXG5cbiAgICAgICAgICAgIHZhciBzdHlsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgZm9ybXM6IGZvcm1zLFxuICAgICAgICAgICAgICBtYXA6IG9wdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleVN0eWxlID0gc3R5bGVLZXkoc3R5bGVPcHRpb25zKVxuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgIGNhc2UgJ2NvbG9yJzpcbiAgICAgICAgICAgIHZhciBzdHlsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICBtYXA6IG9wdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleVN0eWxlID0gc3R5bGVLZXkoc3R5bGVPcHRpb25zKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgbWFya3VwID1cbiAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiYm9yZGVyLWNvbG9yOicgK1xuICAgICAgICAgICAga2V5LmNvbG9yICtcbiAgICAgICAgICAgICdcIiBjbGFzcz1cIicgK1xuICAgICAgICAgICAgY2xhc3NOYW1lcy5pdGVtICtcbiAgICAgICAgICAgICdcIiBkYXRhLWl0ZW0gZGF0YS1pZD1cIicgK1xuICAgICAgICAgICAgZGF0YS5pZCArXG4gICAgICAgICAgICAnXCIgZGF0YS12YWx1ZT1cIicgK1xuICAgICAgICAgICAgZGF0YS52YWx1ZSArXG4gICAgICAgICAgICAnXCIgJyArXG4gICAgICAgICAgICAoZGF0YS5hY3RpdmUgPyAnYXJpYS1zZWxlY3RlZD1cInRydWVcIicgOiAnJykgK1xuICAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgIChkYXRhLmRpc2FibGVkID8gJ2FyaWEtZGlzYWJsZWQ9XCJ0cnVlXCInIDogJycpICtcbiAgICAgICAgICAgICc+PHNwYW4gY2xhc3M9XCInICtcbiAgICAgICAgICAgIGtleVN0eWxlLmNsYXNzICtcbiAgICAgICAgICAgICdLZXlcIiAnICtcbiAgICAgICAgICAgICdzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybChcXCcnICtcbiAgICAgICAgICAgIGtleVN0eWxlLnN2ZyArXG4gICAgICAgICAgICAnXCIpPjwvc3Bhbj4gJyArXG4gICAgICAgICAgICBjYXBpdGFsaXplKGRhdGEubGFiZWwpICtcbiAgICAgICAgICAgICc8YnV0dG9uIHN0eWxlPVwiYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAnICtcbiAgICAgICAgICAgIGtleS5jb2xvciArXG4gICAgICAgICAgICAnOyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFwnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICtcbiAgICAgICAgICAgIHdpbmRvdy5idG9hKHJlbW92ZSkgK1xuICAgICAgICAgICAgJ1xcJylcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjaG9pY2VzX19idXR0b25cIiBkYXRhLWJ1dHRvbj1cIlwiIGFyaWEtbGFiZWw9XCJSZW1vdmUgaXRlbVwiPlJlbW92ZSBpdGVtPC9idXR0b24+PC9kaXY+J1xuICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZShtYXJrdXApXG4gICAgICAgIH0sXG4gICAgICAgIGNob2ljZTogZnVuY3Rpb24gY2hvaWNlKGNsYXNzTmFtZXMsIGRhdGEpIHtcbiAgICAgICAgICB2YXIga2V5ID0gb3B0aW9ucy53aWRnZXRzW3hdLmtleXMuZmluZChmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICByZXR1cm4gdi52YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBkYXRhLnZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIHZhciBrZXlTdHlsZVxuXG4gICAgICAgICAgc3dpdGNoIChvcHRpb25zLndpZGdldHNbeF0udHlwZSkge1xuICAgICAgICAgIGNhc2UgJ2Zvcm0nOlxuICAgICAgICAgICAgdmFyIGZvcm1zID0gb3B0aW9ucy53aWRnZXRzW3hdLmtleXMubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGsudmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZhciBzdHlsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgZm9ybXM6IGZvcm1zLFxuICAgICAgICAgICAgICBtYXA6IG9wdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleVN0eWxlID0gc3R5bGVLZXkoc3R5bGVPcHRpb25zKVxuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgIGNhc2UgJ2NvbG9yJzpcbiAgICAgICAgICAgIHZhciBzdHlsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICBtYXA6IG9wdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleVN0eWxlID0gc3R5bGVLZXkoc3R5bGVPcHRpb25zKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgbWFya3VwID1cbiAgICAgICAgICAgICcgPGRpdiBjbGFzcz1cIicgK1xuICAgICAgICAgICAgY2xhc3NOYW1lcy5pdGVtICtcbiAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICBjbGFzc05hbWVzLml0ZW1DaG9pY2UgK1xuICAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgIChkYXRhLmRpc2FibGVkXG4gICAgICAgICAgICAgID8gY2xhc3NOYW1lcy5pdGVtRGlzYWJsZWRcbiAgICAgICAgICAgICAgOiBjbGFzc05hbWVzLml0ZW1TZWxlY3RhYmxlKSArXG4gICAgICAgICAgICAnXCIgZGF0YS1zZWxlY3QtdGV4dD1cIicgK1xuICAgICAgICAgICAgX3RoaXMuY29uZmlnLml0ZW1TZWxlY3RUZXh0ICtcbiAgICAgICAgICAgICdcIiBkYXRhLWNob2ljZSAnICtcbiAgICAgICAgICAgIChkYXRhLmRpc2FibGVkXG4gICAgICAgICAgICAgID8gJ2RhdGEtY2hvaWNlLWRpc2FibGVkIGFyaWEtZGlzYWJsZWQ9XCJ0cnVlXCInXG4gICAgICAgICAgICAgIDogJ2RhdGEtY2hvaWNlLXNlbGVjdGFibGUnKSArXG4gICAgICAgICAgICAnIGRhdGEtaWQ9XCInICtcbiAgICAgICAgICAgIGRhdGEuaWQgK1xuICAgICAgICAgICAgJ1wiIGRhdGEtdmFsdWU9XCInICtcbiAgICAgICAgICAgIGRhdGEudmFsdWUgK1xuICAgICAgICAgICAgJ1wiICcgK1xuICAgICAgICAgICAgKGRhdGEuZ3JvdXBJZCA+IDAgPyAncm9sZT1cInRyZWVpdGVtXCInIDogJ3JvbGU9XCJvcHRpb25cIicpICtcbiAgICAgICAgICAgICc+IDxzcGFuIGNsYXNzPVwiJyArXG4gICAgICAgICAgICBrZXlTdHlsZS5jbGFzcyArXG4gICAgICAgICAgICAnS2V5XCIgJyArXG4gICAgICAgICAgICAnc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFwnJyArXG4gICAgICAgICAgICBrZXlTdHlsZS5zdmcgK1xuICAgICAgICAgICAgJ1wiKT48L3NwYW4+ICcgK1xuICAgICAgICAgICAgY2FwaXRhbGl6ZShkYXRhLmxhYmVsKSArXG4gICAgICAgICAgICAnIDwvZGl2PiAnXG4gICAgICAgICAgcmV0dXJuIHRlbXBsYXRlKG1hcmt1cClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgY2FwaXRhbGl6ZSwgbG9hZCwgbGluZVdlaWdodHMsIGxpbmVEYXNoQXJyYXlzIH0gZnJvbSAnLi9oZWxwZXJzLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHlsZUtleShvcHRpb25zKSB7XG4gIHZhciBtYXAgPSBvcHRpb25zLm1hcCxcbiAgICBmZWF0dXJlID0gb3B0aW9ucy5mZWF0dXJlLFxuICAgIGdyb3VwID0gb3B0aW9ucy5ncm91cCxcbiAgICBrZXkgPSBvcHRpb25zLmtleSxcbiAgICBpbmRleCA9IG9wdGlvbnMuaW5kZXgsXG4gICAgZm9ybXMgPSBvcHRpb25zLmZvcm1zXG5cbiAgdmFyIGNvbG9ycywga2V5Q29sb3JcbiAgdmFyIGtleSA9IGdyb3VwID8gZ3JvdXBbMF0gOiBrZXlcblxuICBmb3IgKGxldCB3IG9mIG1hcC53aWRnZXRzKSB7XG4gICAgdmFyIGZvcm1LZXlXaWRnZXQgPSB3LnR5cGUgPT09ICdmb3JtJyA/IHcgOiBudWxsXG4gICAgdmFyIGNvbG9yS2V5V2lkZ2V0ID0gdy50eXBlID09PSAnY29sb3InID8gdyA6IG51bGxcblxuICAgIGlmIChmZWF0dXJlKSB7XG4gICAgICB2YXIgY29sb3JLZXkgPSBjb2xvcktleVdpZGdldFxuICAgICAgICA/IGNvbG9yS2V5V2lkZ2V0LmtleXMuZmluZChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgcmV0dXJuICFrLnZhbHVlXG4gICAgICAgICAgICA/IHRydWVcbiAgICAgICAgICAgIDogay52YWx1ZS50b0xvd2VyQ2FzZSgpID09PVxuICAgICAgICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW2NvbG9yS2V5V2lkZ2V0LmZpZWxkXS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIH0pXG4gICAgICAgIDogbnVsbFxuXG4gICAgICB2YXIgZm9ybUtleSA9IGZvcm1LZXlXaWRnZXRcbiAgICAgICAgPyBmb3JtS2V5V2lkZ2V0LmtleXMuZmluZChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgcmV0dXJuICFrLnZhbHVlXG4gICAgICAgICAgICA/IHRydWVcbiAgICAgICAgICAgIDogay52YWx1ZS50b0xvd2VyQ2FzZSgpID09PVxuICAgICAgICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW2Zvcm1LZXlXaWRnZXQuZmllbGRdLnRvTG93ZXJDYXNlKClcbiAgICAgICAgfSlcbiAgICAgICAgOiBudWxsXG5cbiAgICAgIGtleUNvbG9yID0gY29sb3JLZXkgPyBjb2xvcktleS5jb2xvciA6IGZvcm1LZXkgPyBmb3JtS2V5LmNvbG9yIDogbnVsbFxuICAgIH1cblxuICAgIGtleS5jb2xvciA9XG4gICAgICBncm91cCAmJlxuICAgICAgZ3JvdXAuZXZlcnkoZnVuY3Rpb24oZykge1xuICAgICAgICByZXR1cm4gZy5jb2xvclxuICAgICAgfSlcbiAgICAgICAgPyBjaHJvbWEuYXZlcmFnZShcbiAgICAgICAgICBncm91cC5tYXAoZnVuY3Rpb24oZykge1xuICAgICAgICAgICAgcmV0dXJuIGcuY29sb3JcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgIDoga2V5LmNvbG9yXG5cbiAgICBzd2l0Y2ggKGtleS5mb3JtKSB7XG4gICAgY2FzZSAnbGluZSc6XG4gICAgICBrZXlDb2xvciA9IGtleS5jb2xvclxuICAgICAgICA/IGtleS5jb2xvclxuICAgICAgICA6IG9wdGlvbnMubWFwLm9jZWFuY29sb3JcbiAgICAgICAgICA/IG9wdGlvbnMubWFwLm9jZWFuY29sb3JcbiAgICAgICAgICA6IG51bGxcblxuICAgICAgaWYgKGZvcm1zKSB7XG4gICAgICAgIHZhciBzdmdcbiAgICAgICAgc3dpdGNoIChpbmRleCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgY29sb3JzID0gW1xuICAgICAgICAgICAga2V5Q29sb3IgPyBrZXlDb2xvciA6IGNocm9tYShkZWZhdWx0Q29sb3IpLmRhcmtlbigpLFxuICAgICAgICAgICAga2V5Q29sb3IgPyBrZXlDb2xvciA6IGNocm9tYShkZWZhdWx0Q29sb3IpLmRhcmtlbigpXG4gICAgICAgICAgXVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGNvbG9ycyA9IFtcbiAgICAgICAgICAgIGtleUNvbG9yID8ga2V5Q29sb3IgOiBjaHJvbWEoZGVmYXVsdENvbG9yKS5kYXJrZW4oKSxcbiAgICAgICAgICAgICcjZmZmZmZmJ1xuICAgICAgICAgIF1cbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBjb2xvcnMgPSBbJyMwMDAwMDAnLCBrZXlDb2xvciA/IGtleUNvbG9yIDogZGVmYXVsdENvbG9yXVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIGNvbG9ycyA9IFtcbiAgICAgICAgICAgICcjZmZmZmZmJyxcbiAgICAgICAgICAgIGtleUNvbG9yID8ga2V5Q29sb3IgOiBjaHJvbWEoZGVmYXVsdENvbG9yKS5kYXJrZW4oKVxuICAgICAgICAgIF1cbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29sb3JzID0gW1xuICAgICAgICAgICAga2V5Q29sb3IgPyBrZXlDb2xvciA6IGNocm9tYShkZWZhdWx0Q29sb3IpLmRhcmtlbigpLFxuICAgICAgICAgICAga2V5Q29sb3IgPyBrZXlDb2xvciA6IGNocm9tYShkZWZhdWx0Q29sb3IpLmRhcmtlbigpXG4gICAgICAgICAgXVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBzdmcgPVxuICAgICAgICAgICAgJzxzdmcgeG1sbnM9XFwnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXCcgdmlld0JveD1cXCcwIDAgNDggMTJcXCc+PGxpbmUgeDE9XFwnMFxcJyB4Mj1cXCc0OFxcJyB5MT1cXCc1MCVcXCcgeTI9XFwnNTAlXFwnIHN0cm9rZT1cXCcnICtcbiAgICAgICAgICAgIGNvbG9yc1swXSArXG4gICAgICAgICAgICAnXFwnIHN0cm9rZS13aWR0aD1cXCcnICtcbiAgICAgICAgICAgIGxpbmVXZWlnaHRzW2luZGV4XVswXSArXG4gICAgICAgICAgICAnXFwnIHN0cm9rZS1saW5lY2FwPVxcJ3NxdWFyZVxcJyBzdHJva2UtZGFzaGFycmF5PVxcJycgK1xuICAgICAgICAgICAgKGluZGV4ID09PSA0ID8gJzE4LDEyJyA6IGxpbmVEYXNoQXJyYXlzW2luZGV4XVswXSkgK1xuICAgICAgICAgICAgJ1xcJy8+PGxpbmUgeDE9XFwnMFxcJyB4Mj1cXCc0OFxcJyB5MT1cXCc1MCVcXCcgeTI9XFwnNTAlXFwnIHN0cm9rZT1cXCcnICtcbiAgICAgICAgICAgIGNvbG9yc1sxXSArXG4gICAgICAgICAgICAnXFwnIHN0cm9rZS13aWR0aD1cXCcnICtcbiAgICAgICAgICAgIGxpbmVXZWlnaHRzW2luZGV4XVsxXSArXG4gICAgICAgICAgICAnXFwnIHN0cm9rZS1saW5lY2FwPVxcJ3NxdWFyZVxcJyBzdHJva2UtZGFzaGFycmF5PVxcJycgK1xuICAgICAgICAgICAgKGluZGV4ID09PSA0ID8gJzE4LDEyJyA6IGxpbmVEYXNoQXJyYXlzW2luZGV4XVsxXSkgK1xuICAgICAgICAgICAgJ1xcJy8+PC9zdmc+J1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ZnID1cbiAgICAgICAgICAgICc8c3ZnIHhtbG5zPVxcJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFwnIHZpZXdCb3g9XFwnMCAwIDQ4IDEyXFwnPjxsaW5lIHgxPVxcJzBcXCcgeDI9XFwnNDhcXCcgeTE9XFwnNTAlXFwnIHkyPVxcJzUwJVxcJyBzdHJva2U9XFwnJyArXG4gICAgICAgICAgICBrZXlDb2xvciArXG4gICAgICAgICAgICAnXFwnIHN0cm9rZS13aWR0aD1cXCcnICtcbiAgICAgICAgICAgIDMgK1xuICAgICAgICAgICAgJ1xcJyBzdHJva2UtbGluZWNhcD1cXCdzcXVhcmVcXCcgc3Ryb2tlLWRhc2hhcnJheT1cXCcnICtcbiAgICAgICAgICAgICczLDcnICtcbiAgICAgICAgICAgICdcXCcvPjwvc3ZnPidcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3ZnOiAnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICsgd2luZG93LmJ0b2Eoc3ZnKSxcbiAgICAgICAgY2xhc3M6ICdsaW5lJ1xuICAgICAgfVxuXG4gICAgY2FzZSAnaWNvbic6XG4gICAgICBpZiAoa2V5Lmljb24pIHtcbiAgICAgICAgdmFyIHNsdWcgPSBrZXkudmFsdWUucmVwbGFjZSgvIC9nLCAnLScpXG4gICAgICAgIGxvYWQoa2V5Lmljb24sIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oaWRkZW4nKSlcbiAgICAgICAgdmFyIHN2Z0NvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGlkZGVuJykuaW5uZXJIVE1MXG5cbiAgICAgICAgaWYgKGNvbG9yS2V5V2lkZ2V0ICYmIGtleUNvbG9yKSB7XG4gICAgICAgICAgc3ZnQ29udGVudCA9IHN2Z0NvbnRlbnQucmVwbGFjZShcbiAgICAgICAgICAgIC8oKFxcYmZpbGw9XCIjKSgoWzAtYS1mQS1GXXsyfSl7M318KFswLTlhLWZBLUZdKXszfSlcIikvZ2ksXG4gICAgICAgICAgICAnJ1xuICAgICAgICAgIClcbiAgICAgICAgICBzdmdDb250ZW50ID0gc3ZnQ29udGVudC5yZXBsYWNlKFxuICAgICAgICAgICAgLyg8Y2lyY2xlIHw8cmVjdGFuZ2xlIHw8ZWxsaXBzZSB8PHBvbHlnb24gfDxwYXRoICkvZyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKG1hdGNoLCBwMSwgcDIsIHAzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtYXRjaC5yZXBsYWNlKG1hdGNoLCBtYXRjaCArICdmaWxsPVwiJyArIGtleUNvbG9yICsgJ1wiICcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgc3ZnID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIHdpbmRvdy5idG9hKHN2Z0NvbnRlbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdmcgPVxuICAgICAgICAgICAgJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArXG4gICAgICAgICAgICB3aW5kb3cuYnRvYShcbiAgICAgICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxjaXJjbGUgY3g9XCInICtcbiAgICAgICAgICAgICAgICBtYXAuaWNvbnNpemVbMF0gLyAyICtcbiAgICAgICAgICAgICAgICAnXCIgY3k9XCInICtcbiAgICAgICAgICAgICAgICBtYXAuaWNvbnNpemVbMV0gLyAyICtcbiAgICAgICAgICAgICAgICAnXCIgcj1cIicgK1xuICAgICAgICAgICAgICAgIChtYXAuaWNvbnNpemVbMF0gKyBtYXAuaWNvbnNpemVbMV0pIC8gNCArXG4gICAgICAgICAgICAgICAgJ1wiIGZpbGw9XCInICtcbiAgICAgICAgICAgICAgICAoa2V5Q29sb3IgfHwga2V5LmNvbG9yKSArXG4gICAgICAgICAgICAgICAgJ1wiLz48L3N2Zz4nXG4gICAgICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN2Zzogc3ZnLFxuICAgICAgICBjbGFzczoga2V5Lmljb24gPyAnaWNvbicgOiAnY29sb3InXG4gICAgICB9XG5cbiAgICBjYXNlICdwYXR0ZXJuJzpcbiAgICAgIGtleUNvbG9yID0ga2V5LmNvbG9yXG4gICAgICB2YXIgc3ZnXG5cbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgY2FzZSBrZXkucGF0dGVyblswXS5pbmRleE9mKCdzdHJpcGUnKSA+IC0xOlxuICAgICAgICB2YXIgY29sb3JUd28gPSBrZXkucGF0dGVyblsxXVxuICAgICAgICB2YXIgY29sb3JPbmUgPSBrZXkucGF0dGVybltrZXkucGF0dGVybi5sZW5ndGggLSAxXVxuICAgICAgICBzdmcgPVxuICAgICAgICAgICAgICAnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICtcbiAgICAgICAgICAgICAgd2luZG93LmJ0b2EoXG4gICAgICAgICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTJcIiBoZWlnaHQ9XCIxMlwiIHZpZXdCb3g9XCIwIDAgMTIgMTJcIj48cG9seWdvbiBwb2ludHM9XCI1LjczIDAgNC42NyAwIDAgNC42NiAwIDUuNzEgNS43MyAwXCIgZmlsbD1cIicgK1xuICAgICAgICAgICAgICAgICAgY29sb3JPbmUgK1xuICAgICAgICAgICAgICAgICAgJ1wiLz48cG9seWdvbiBwb2ludHM9XCIyLjI4IDAgMS4yMiAwIDAgMS4yMiAwIDIuMjcgMi4yOCAwXCIgZmlsbD1cIicgK1xuICAgICAgICAgICAgICAgICAgY29sb3JUd28gK1xuICAgICAgICAgICAgICAgICAgJ1wiLz48cG9seWdvbiBwb2ludHM9XCI4Ljg1IDAgNy43OSAwIDAgNy43NyAwIDguODIgOC44NSAwXCIgZmlsbD1cIicgK1xuICAgICAgICAgICAgICAgICAgY29sb3JUd28gK1xuICAgICAgICAgICAgICAgICAgJ1wiLz48cG9seWdvbiBwb2ludHM9XCIxMiAwIDExLjI0IDAgMCAxMS4yIDAgMTIgMC4yNiAxMiAxMiAwLjMgMTIgMFwiIGZpbGw9XCInICtcbiAgICAgICAgICAgICAgICAgIGNvbG9yT25lICtcbiAgICAgICAgICAgICAgICAgICdcIi8+PHBvbHlnb24gcG9pbnRzPVwiMTIgMTAuMTIgMTIgOS4wNiA5LjA1IDEyIDEwLjExIDEyIDEyIDEwLjEyXCIgZmlsbD1cIicgK1xuICAgICAgICAgICAgICAgICAgY29sb3JUd28gK1xuICAgICAgICAgICAgICAgICAgJ1wiLz48cG9seWdvbiBwb2ludHM9XCIxMiAzLjUyIDEyIDIuNDYgMi40MyAxMiAzLjQ5IDEyIDEyIDMuNTJcIiBmaWxsPVwiJyArXG4gICAgICAgICAgICAgICAgICBjb2xvclR3byArXG4gICAgICAgICAgICAgICAgICAnXCIvPjxwb2x5Z29uIHBvaW50cz1cIjEyIDYuOTYgMTIgNS45IDUuODggMTIgNi45NCAxMiAxMiA2Ljk2XCIgZmlsbD1cIicgK1xuICAgICAgICAgICAgICAgICAgY29sb3JPbmUgK1xuICAgICAgICAgICAgICAgICAgJ1wiLz48L3N2Zz4nXG4gICAgICAgICAgICAgIClcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSBrZXkucGF0dGVyblswXS5pbmRleE9mKCdkb3QnKSA+IC0xOlxuICAgICAgICBzdmcgPVxuICAgICAgICAgICAgICAnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICtcbiAgICAgICAgICAgICAgd2luZG93LmJ0b2EoXG4gICAgICAgICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTMuMDZcIiBoZWlnaHQ9XCIxNS4xXCIgdmlld0JveD1cIjAgMCAxMiAxMlwiPjx0aXRsZT5zdHJpcGVzPC90aXRsZT48cGF0aCBkPVwiTTUuNDksMUExLjE2LDEuMTYsMCwxLDEsNC4zMy0uMTYsMS4xNiwxLjE2LDAsMCwxLDUuNDksMVpNNC4zMywzLjc3QTEuMTYsMS4xNiwwLDEsMCw1LjQ5LDQuOTMsMS4xNSwxLjE1LDAsMCwwLDQuMzMsMy43N1ptMCwzLjkzQTEuMTYsMS4xNiwwLDEsMCw1LjQ5LDguODYsMS4xNSwxLjE1LDAsMCwwLDQuMzMsNy43Wm0wLDMuOTNhMS4xNiwxLjE2LDAsMSwwLDEuMTYsMS4xNkExLjE1LDEuMTUsMCwwLDAsNC4zMywxMS42M1pNMTEuNS0uMTZBMS4xNiwxLjE2LDAsMSwwLDEyLjY2LDEsMS4xNiwxLjE2LDAsMCwwLDExLjUtLjE2Wm0wLDMuOTNhMS4xNiwxLjE2LDAsMSwwLDEuMTYsMS4xNkExLjE2LDEuMTYsMCwwLDAsMTEuNSwzLjc3Wm0wLDMuOTNhMS4xNiwxLjE2LDAsMSwwLDEuMTYsMS4xNkExLjE2LDEuMTYsMCwwLDAsMTEuNSw3LjdabTAsMy45M2ExLjE2LDEuMTYsMCwxLDAsMS4xNiwxLjE2QTEuMTYsMS4xNiwwLDAsMCwxMS41LDExLjYzWk03LjkyLTEuMTZBMS4xNiwxLjE2LDAsMCwwLDYuNzYsMCwxLjE2LDEuMTYsMCwwLDAsNy45MiwxLjE2LDEuMTYsMS4xNiwwLDAsMCw5LjA3LDAsMS4xNiwxLjE2LDAsMCwwLDcuOTItMS4xNlptMCwzLjkzQTEuMTYsMS4xNiwwLDEsMCw5LjA3LDMuOTMsMS4xNiwxLjE2LDAsMCwwLDcuOTIsMi43N1ptMCwzLjkzQTEuMTYsMS4xNiwwLDEsMCw5LjA3LDcuODYsMS4xNiwxLjE2LDAsMCwwLDcuOTIsNi43Wm0wLDMuOTNhMS4xNiwxLjE2LDAsMSwwLDEuMTUsMS4xNkExLjE2LDEuMTYsMCwwLDAsNy45MiwxMC42M1pNLjc1LTEuMTZBMS4xNiwxLjE2LDAsMCwwLS40MSwwLDEuMTYsMS4xNiwwLDAsMCwuNzUsMS4xNiwxLjE2LDEuMTYsMCwwLDAsMS45MSwwLDEuMTYsMS4xNiwwLDAsMCwuNzUtMS4xNlptMCwzLjkzQTEuMTYsMS4xNiwwLDEsMCwxLjkxLDMuOTMsMS4xNiwxLjE2LDAsMCwwLC43NSwyLjc3Wm0wLDMuOTNBMS4xNiwxLjE2LDAsMCwwLS40MSw3Ljg2LDEuMTUsMS4xNSwwLDAsMCwuNzUsOSwxLjE1LDEuMTUsMCwwLDAsMS45MSw3Ljg2LDEuMTYsMS4xNiwwLDAsMCwuNzUsNi43Wm0wLDMuOTNhMS4xNiwxLjE2LDAsMSwwLDEuMTYsMS4xNkExLjE2LDEuMTYsMCwwLDAsLjc1LDEwLjYzWlwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwLjcgMilcIiBmaWxsPVwiJyArXG4gICAgICAgICAgICAgICAgICBjb2xvck9uZSArXG4gICAgICAgICAgICAgICAgICAnXCIvPjwvc3ZnPidcbiAgICAgICAgICAgICAgKVxuICAgICAgICBicmVha1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzdmcgPVxuICAgICAgICAgICAgICAnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICtcbiAgICAgICAgICAgICAgd2luZG93LmJ0b2EoXG4gICAgICAgICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxjaXJjbGUgY3g9XCI2XCIgY3k9XCI2XCIgcj1cIjVcIiBmaWxsPVwiJyArXG4gICAgICAgICAgICAgICAgICBrZXlDb2xvciArXG4gICAgICAgICAgICAgICAgICAnXCIvPjwvc3ZnPidcbiAgICAgICAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdmc6IHN2ZyxcbiAgICAgICAgY2xhc3M6IGtleS5wYXR0ZXJuID8gJ3BhdHRlcm4nIDogJ2NvbG9yJ1xuICAgICAgfVxuXG4gICAgY2FzZSAnc2hhcGUnOlxuICAgICAgaWYgKGZlYXR1cmUpIHtcbiAgICAgICAgdmFyIGNvbG9yS2V5V2lkZ2V0ID0gbWFwLndpZGdldHMuZmluZChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgcmV0dXJuIHcudHlwZSA9PT0gJ2NvbG9yJ1xuICAgICAgICB9KVxuICAgICAgICB2YXIgY29sb3JLZXkgPSBjb2xvcktleVdpZGdldC5rZXlzLmZpbmQoZnVuY3Rpb24oaykge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBrLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllc1tjb2xvcktleVdpZGdldC5maWVsZF0udG9Mb3dlckNhc2UoKVxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgICAga2V5Q29sb3IgPSBjb2xvcktleSA/IGNvbG9yS2V5LmNvbG9yIDoga2V5Q29sb3IgPyBrZXlDb2xvciA6IG51bGxcbiAgICAgIH1cblxuICAgICAgdmFyIHN2Z1xuXG4gICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHN2ZyA9XG4gICAgICAgICAgICAgICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9XCJyYWluYm93XCIgIHkxPVwiNC41XCIgeDI9XCI5XCIgeTI9XCI0LjVcIiBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIiBncmFkaWVudFRyYW5zZm9ybT1cInRyYW5zbGF0ZSg0LjUgLTQuNSkgcm90YXRlKDEzNSlcIj48c3RvcCBvZmZzZXQ9XCIwXCIgc3RvcC1jb2xvcj1cIiM3ZjNjOGRcIi8+PHN0b3Agb2Zmc2V0PVwiMC4zMjVcIiBzdG9wLWNvbG9yPVwiI2U3M2Y3NFwiLz48c3RvcCBvZmZzZXQ9XCIwLjVcIiBzdG9wLWNvbG9yPVwiI2YyYjcwMVwiLz48c3RvcCBvZmZzZXQ9XCIwLjY3NVwiIHN0b3AtY29sb3I9XCIjMTFhNTc5XCIvPjxzdG9wIG9mZnNldD1cIjFcIiBzdG9wLWNvbG9yPVwiIzM5NjlhY1wiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB4PVwiMy4yNVwiIHk9XCIxLjc1XCIgd2lkdGg9XCI5XCIgaGVpZ2h0PVwiOVwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg0LjUgLTQuNSkgcm90YXRlKDQ1KVwiICcgK1xuICAgICAgICAgICAgICAoa2V5Q29sb3IgPyAncGFpbnQtb3JkZXI9XCJzdHJva2VcIiBzdHJva2U9XCIjZmZmZmZmXCInIDogJycpICtcbiAgICAgICAgICAgICAgJyBmaWxsPVwiJyArXG4gICAgICAgICAgICAgIChrZXlDb2xvciA/IGtleUNvbG9yIDogJ3VybCgjcmFpbmJvdyknKSArXG4gICAgICAgICAgICAgICdcIiAvPjwvc3ZnPidcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAxOlxuICAgICAgICBzdmcgPVxuICAgICAgICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPVwicmFpbmJvd1wiIHkxPVwiNVwiIHgyPVwiMTBcIiB5Mj1cIjVcIiBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj48c3RvcCBvZmZzZXQ9XCIwXCIgc3RvcC1jb2xvcj1cIiMzOTY5YWNcIi8+PHN0b3Agb2Zmc2V0PVwiMC4yNVwiIHN0b3AtY29sb3I9XCIjMTFhNTc5XCIvPjxzdG9wIG9mZnNldD1cIjAuNVwiIHN0b3AtY29sb3I9XCIjZjJiNzAxXCIvPjxzdG9wIG9mZnNldD1cIjAuNzVcIiBzdG9wLWNvbG9yPVwiI2U3M2Y3NFwiLz48c3RvcCBvZmZzZXQ9XCIxXCIgc3RvcC1jb2xvcj1cIiM3ZjNjOGRcIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjEwXCIgJyArXG4gICAgICAgICAgICAgIChrZXlDb2xvciA/ICdzdHJva2U9XCIjZmZmZmZmXCInIDogJycpICtcbiAgICAgICAgICAgICAgJyBmaWxsPVwiJyArXG4gICAgICAgICAgICAgIChrZXlDb2xvciA/IGtleUNvbG9yIDogJ3VybCgjcmFpbmJvdyknKSArXG4gICAgICAgICAgICAgICdcIi8+PC9zdmc+J1xuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHN2ZyA9XG4gICAgICAgICAgICAgICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9XCJyYWluYm93XCIgeTE9XCI1XCIgeDI9XCIxMFwiIHkyPVwiNVwiIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPjxzdG9wIG9mZnNldD1cIjBcIiBzdG9wLWNvbG9yPVwiIzM5NjlhY1wiLz48c3RvcCBvZmZzZXQ9XCIwLjMyNVwiIHN0b3AtY29sb3I9XCIjMTFhNTc5XCIvPjxzdG9wIG9mZnNldD1cIjAuNVwiIHN0b3AtY29sb3I9XCIjZjJiNzAxXCIvPjxzdG9wIG9mZnNldD1cIjAuNjc1XCIgc3RvcC1jb2xvcj1cIiNlNzNmNzRcIi8+PHN0b3Agb2Zmc2V0PVwiMVwiIHN0b3AtY29sb3I9XCIjN2YzYzhkXCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwb2x5Z29uIHBvaW50cz1cIjYgMTAuMzkgMCAxMC4zOSAzIDUuMiA2IDAgOSA1LjIgMTIgMTAuMzkgNiAxMC4zOVwiICcgK1xuICAgICAgICAgICAgICAoa2V5Q29sb3IgPyAncGFpbnQtb3JkZXI9XCJzdHJva2VcIiBzdHJva2U9XCIjZmZmZmZmXCInIDogJycpICtcbiAgICAgICAgICAgICAgJyBmaWxsPVwiJyArXG4gICAgICAgICAgICAgIChrZXlDb2xvciA/IGtleUNvbG9yIDogJ3VybCgjcmFpbmJvdyknKSArXG4gICAgICAgICAgICAgICdcIiAvPjwvc3ZnPidcbiAgICAgICAgYnJlYWtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc3ZnID1cbiAgICAgICAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD1cInJhaW5ib3dcIiB5MT1cIjVcIiB4Mj1cIjEwXCIgeTI9XCI1XCIgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+PHN0b3Agb2Zmc2V0PVwiMFwiIHN0b3AtY29sb3I9XCIjMzk2OWFjXCIvPjxzdG9wIG9mZnNldD1cIjAuMjVcIiBzdG9wLWNvbG9yPVwiIzExYTU3OVwiLz48c3RvcCBvZmZzZXQ9XCIwLjVcIiBzdG9wLWNvbG9yPVwiI2YyYjcwMVwiLz48c3RvcCBvZmZzZXQ9XCIwLjc1XCIgc3RvcC1jb2xvcj1cIiNlNzNmNzRcIi8+PHN0b3Agb2Zmc2V0PVwiMVwiIHN0b3AtY29sb3I9XCIjN2YzYzhkXCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9XCI2XCIgY3k9XCI2XCIgcj1cIjVcIiAnICtcbiAgICAgICAgICAgICAgKGtleUNvbG9yID8gJ3N0cm9rZT1cIiNmZmZmZmZcIicgOiAnJykgK1xuICAgICAgICAgICAgICAnIGZpbGw9XCInICtcbiAgICAgICAgICAgICAgKGtleUNvbG9yID8ga2V5Q29sb3IgOiAndXJsKCNyYWluYm93KScpICtcbiAgICAgICAgICAgICAgJ1wiLz48L3N2Zz4nXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN2ZzogJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIHdpbmRvdy5idG9hKHN2ZyksXG4gICAgICAgIGNsYXNzOiAnc2hhcGUnXG4gICAgICB9XG5cbiAgICBkZWZhdWx0OlxuICAgICAga2V5Q29sb3IgPSBrZXkuY29sb3JcblxuICAgICAgc3ZnID1cbiAgICAgICAgICAnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICtcbiAgICAgICAgICB3aW5kb3cuYnRvYShcbiAgICAgICAgICAgICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48Y2lyY2xlIGN4PVwiJyArXG4gICAgICAgICAgICAgIG1hcC5pY29uc2l6ZVswXSAvIDIgK1xuICAgICAgICAgICAgICAnXCIgY3k9XCInICtcbiAgICAgICAgICAgICAgbWFwLmljb25zaXplWzFdIC8gMiArXG4gICAgICAgICAgICAgICdcIiByPVwiJyArXG4gICAgICAgICAgICAgIChtYXAuaWNvbnNpemVbMF0gKyBtYXAuaWNvbnNpemVbMV0pIC8gNCArXG4gICAgICAgICAgICAgICdcIiBmaWxsPVwiJyArXG4gICAgICAgICAgICAgIChrZXlDb2xvciB8fCBrZXkuY29sb3IpICtcbiAgICAgICAgICAgICAgJ1wiLz48L3N2Zz4nXG4gICAgICAgICAgKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3ZnOiBzdmcsXG4gICAgICAgIGNsYXNzOiAnY29sb3InXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJ2YXIgbWFwSWQgPSAwXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEN1c3RvbU1hcChjb250YWluZXIsIHByb3BlcnRpZXMpIHtcbiAgdGhpcy5pZCA9IG1hcElkKytcbiAgdGhpcy5maWx0ZXJzID0gW11cbiAgdGhpcy5ncm91cHMgPSBbXVxuICB0aGlzLmpzb24gPSBbXVxuICB0aGlzLmxlYWZsZXRcblxuICB2YXIgX3RoaXMgPSB0aGlzXG5cbiAgT2JqZWN0LmtleXMocHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIF90aGlzW3Byb3BlcnR5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnJyldID0gcHJvcGVydGllc1twcm9wZXJ0eV1cbiAgfSlcbiAgX3RoaXMucG9wdXBjb250ZW50ID1cbiAgICBfdGhpcy5wb3B1cGNvbnRlbnQgJiYgdHlwZW9mIF90aGlzLnBvcHVwY29udGVudCA9PT0gJ3N0cmluZydcbiAgICAgID8gX3RoaXMucG9wdXBjb250ZW50LnNwbGl0KCcsJylcbiAgICAgIDogX3RoaXMucG9wdXBjb250ZW50ICYmIHRoaXMucG9wdXBjb250ZW50ID09PSAnb2JqZWN0J1xuICAgICAgICA/IF90aGlzLnBvcHVwY29udGVudFxuICAgICAgICA6IFtdXG4gIF90aGlzLnBvcHVwaGVhZGVycyA9XG4gICAgX3RoaXMucG9wdXBoZWFkZXJzICYmIHR5cGVvZiBfdGhpcy5wb3B1cGhlYWRlcnMgPT09ICdzdHJpbmcnXG4gICAgICA/IF90aGlzLnBvcHVwaGVhZGVycy5zcGxpdCgnLCcpXG4gICAgICA6IF90aGlzLnBvcHVwaGVhZGVycyAmJiBfdGhpcy5wb3B1cGhlYWRlcnMgPT09ICdvYmplY3QnXG4gICAgICAgID8gX3RoaXMucG9wdXBoZWFkZXJzXG4gICAgICAgIDogW11cbiAgQ3VzdG9tTWFwLmFsbCA9IEN1c3RvbU1hcC5hbGwgfHwgW11cbiAgQ3VzdG9tTWFwLmFsbC5wdXNoKHRoaXMpXG5cbiAgX3RoaXMucmVzZXRGaWx0ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgX3RoaXMuZmlsdGVycyA9IFtdXG4gIH1cblxuICBfdGhpcy5yZW1vdmVHcm91cHMgPSBmdW5jdGlvbigpIHtcbiAgICBfdGhpcy5ncm91cHMuZm9yRWFjaChmdW5jdGlvbihncm91cCkge1xuICAgICAgX3RoaXMubGVhZmxldC5yZW1vdmVMYXllcihncm91cClcbiAgICB9KVxuXG4gICAgX3RoaXMuZ3JvdXBzID0gW11cbiAgfVxuXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgX3RoaXMubGVhZmxldCA9IEwubWFwKGNvbnRhaW5lciwge1xuICAgICAgbWluWm9vbTogX3RoaXMubWluem9vbSB8fCBudWxsLFxuICAgICAgbWF4Wm9vbTogX3RoaXMubWF4em9vbSB8fCAyMCxcbiAgICAgIG1heEJvdW5kczogX3RoaXMubWF4Ym91bmRzIHx8IFtfdGhpcy5zd2JvdW5kcywgX3RoaXMubmVib3VuZHNdLFxuICAgICAgc2Nyb2xsV2hlZWxab29tOiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgIHpvb21Db250cm9sOlxuICAgICAgICAhX3RoaXMuaGFzT3duUHJvcGVydHkoJ3pvb21zbGlkZXInKSB8fCBfdGhpcy56b29tc2xpZGVyID8gZmFsc2UgOiB0cnVlLFxuICAgICAgYXR0cmlidXRpb25Db250cm9sOiBmYWxzZVxuICAgIH0pXG5cbiAgICBpZiAoX3RoaXMubG9hZEV2ZW50KSBfdGhpcy5sZWFmbGV0Lm9uKCdsb2FkJywgX3RoaXMubG9hZGV2ZW50KVxuICAgIGlmIChfdGhpcy5hZGRFdmVudCkgX3RoaXMubGVhZmxldC5vbignbGF5ZXJhZGQnLCBfdGhpcy5hZGRldmVudClcbiAgICB0aGlzLmxlYWZsZXQuc2V0VmlldyhfdGhpcy5jZW50ZXIsIF90aGlzLnpvb20gfHwgMilcbiAgICBMLnRpbGVMYXllcihcbiAgICAgICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9pbGFibWVkaWEvJyArXG4gICAgICAgIF90aGlzLm1hcGJveHN0eWxlICtcbiAgICAgICAgJy90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYVd4aFltMWxaR2xoSWl3aVlTSTZJbU5wYkhZeWNYWjJiVEF4YWpaMWMydHpkV1UxYjNneWRuWWlmUS5BSHhsOHBQWnNqc3Fvejk1LTYwNG53JyxcbiAgICAgIHt9XG4gICAgKS5hZGRUbyhfdGhpcy5sZWFmbGV0KVxuXG4gICAgaWYgKCFfdGhpcy5oYXNPd25Qcm9wZXJ0eSgnem9vbXNsaWRlcicpIHx8IF90aGlzLnpvb21zbGlkZXIpIHtcbiAgICAgIEwuY29udHJvbC56b29tc2xpZGVyKCkuYWRkVG8oX3RoaXMubGVhZmxldClcbiAgICB9XG5cbiAgICBpZiAoX3RoaXMuZnVsbHNjcmVlbikge1xuICAgICAgd2luZG93LmZ1bGxzY3JlZW4gPSBuZXcgTC5Db250cm9sLkZ1bGxzY3JlZW4oKVxuXG4gICAgICBfdGhpcy5sZWFmbGV0LmFkZENvbnRyb2wod2luZG93LmZ1bGxzY3JlZW4pXG4gICAgfVxuXG4gICAgTC5jb250cm9sXG4gICAgICAuYXR0cmlidXRpb24oe1xuICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbWxlZnQnXG4gICAgICB9KVxuICAgICAgLnNldFByZWZpeChfdGhpcy5hdHRyaWJ1dGlvbilcbiAgICAgIC5hZGRUbyhfdGhpcy5sZWFmbGV0KVxuXG4gICAgX3RoaXMucmVzZXRGaWx0ZXJzKClcblxuICAgIHJldHVybiBfdGhpc1xuICB9XG59XG4iLCJpbXBvcnQgeyBleHRlcm5hbExpbmsgfSBmcm9tICcuL2hlbHBlcnMuanMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhhbmRsZUZlYXR1cmVFdmVudHMoZmVhdHVyZSwgbGF5ZXIsIG1hcCkge1xuICB2YXIgZXZlbnRPcHRpb25zID0gbWFwLm9uZWFjaGZlYXR1cmVcbiAgICA/IG1hcC5vbmVhY2hmZWF0dXJlXG4gICAgOiB7XG4gICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgIGhhbmRsZUxheWVyQ2xpY2soZmVhdHVyZSwgbGF5ZXIsIG1hcC5sZWFmbGV0KVxuICAgICAgfVxuICAgIH1cblxuICBPYmplY3Qua2V5cyhldmVudE9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICBsYXllci5vbihsaXN0ZW5lciwgZXZlbnRPcHRpb25zW2xpc3RlbmVyXSlcbiAgfSlcblxuICB2YXIgcG9wdXBDb250ZW50ID1cbiAgICB0eXBlb2YgbWFwLmZvcm1hdHBvcHVwY29udGVudCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgPyBtYXAuZm9ybWF0cG9wdXBjb250ZW50KGZlYXR1cmUsIG1hcClcbiAgICAgIDogZm9ybWF0UG9wdXBDb250ZW50KGZlYXR1cmUsIG1hcClcbiAgbGF5ZXIuYmluZFBvcHVwKHBvcHVwQ29udGVudClcbn1cblxuZnVuY3Rpb24gZm9ybWF0UG9wdXBDb250ZW50KGZlYXR1cmUsIG1hcCkge1xuICB2YXIgY29udGVudFxuICBjb250ZW50ID0gT2JqZWN0LmtleXMoZmVhdHVyZS5wcm9wZXJ0aWVzKVxuICAgIC5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgaWYgKGZlYXR1cmUucHJvcGVydGllc1twXSkge1xuICAgICAgICBpZiAobWFwLnBvcHVwaGVhZGVycy5sZW5ndGggJiYgbWFwLnBvcHVwY29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gbWFwLnBvcHVwaGVhZGVycy5pbmRleE9mKHApID4gLTEgJiZcbiAgICAgICAgICAgIG1hcC5wb3B1cGNvbnRlbnQuaW5kZXhPZihwKSA+IC0xXG4gICAgICAgICAgICA/ICc8ZGl2IGNsYXNzPVwicG9wdXBIZWFkZXJTdHlsZVwiPicgK1xuICAgICAgICAgICAgICAgIHAudG9VcHBlckNhc2UoKS5yZXBsYWNlKC9fL2csICcgJykgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj48ZGl2IGNsYXNzPVwicG9wdXBFbnRyeVN0eWxlXCI+JyArXG4gICAgICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW3BdICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgOiBtYXAucG9wdXBjb250ZW50LmluZGV4T2YocCkgPiAtMVxuICAgICAgICAgICAgICA/ICc8ZGl2IGNsYXNzPVwicG9wdXBFbnRyeVN0eWxlXCI+JyArXG4gICAgICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW3BdICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgICA6ICcnXG4gICAgICAgIH0gZWxzZSBpZiAobWFwLnBvcHVwaGVhZGVycy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gbWFwLnBvcHVwaGVhZGVycy5pbmRleE9mKHApID4gLTFcbiAgICAgICAgICAgID8gJzxkaXYgY2xhc3M9XCJwb3B1cEhlYWRlclN0eWxlXCI+JyArXG4gICAgICAgICAgICAgICAgcC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL18vZywgJyAnKSArXG4gICAgICAgICAgICAgICAgJzwvZGl2PjxkaXYgY2xhc3M9XCJwb3B1cEVudHJ5U3R5bGVcIj4nICtcbiAgICAgICAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXNbcF0gK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICA6ICcnXG4gICAgICAgIH0gZWxzZSBpZiAobWFwLnBvcHVwY29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gbWFwLnBvcHVwY29udGVudC5pbmRleE9mKHApID4gLTFcbiAgICAgICAgICAgID8gJzxkaXYgY2xhc3M9XCJwb3B1cEVudHJ5U3R5bGVcIj4nICsgZmVhdHVyZS5wcm9wZXJ0aWVzW3BdICsgJzwvZGl2PidcbiAgICAgICAgICAgIDogJydcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwb3B1cEhlYWRlclN0eWxlXCI+JyArXG4gICAgICAgICAgICBwLnRvVXBwZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnICcpICtcbiAgICAgICAgICAgICc8L2Rpdj48ZGl2IGNsYXNzPVwicG9wdXBFbnRyeVN0eWxlXCI+JyArXG4gICAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXNbcF0gK1xuICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5maWx0ZXIoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHBcbiAgICB9KVxuICAgIC5qb2luKCcnKVxuICB2YXIgbGluayA9IGZlYXR1cmUucHJvcGVydGllcy5oeXBlcmxpbmsgfHwgZmVhdHVyZS5wcm9wZXJ0aWVzLmxpbmtcbiAgdmFyIGV4dGVybmFsTGlua0NvbnRlbnQgPVxuICAgIGxpbmsgJiYgbGluay50cmltKClcbiAgICAgID8gJzxkaXYgY2xhc3M9XCJzZXBhcmF0b3JcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaHlwZXJsaW5rIHBvcHVwRW50cnlTdHlsZVwiPjxhIGNsYXNzPVwidHJhbnNsYXRlXCIgaHJlZj0nICtcbiAgICAgICAgbGluay50cmltKCkgK1xuICAgICAgICAnIHRhcmdldD1cIl9ibGFua1wiPicgK1xuICAgICAgICBtYXAuZXh0ZXJuYWxMaW5rVGV4dCArXG4gICAgICAgICc8L2E+JyArXG4gICAgICAgIGV4dGVybmFsTGluayArXG4gICAgICAgICc8L2Rpdj4nXG4gICAgICA6ICcnXG4gIGNvbnRlbnQgKz0gZXh0ZXJuYWxMaW5rQ29udGVudFxuXG4gIGlmIChsYW5nKSB7XG4gICAgdmFyIHRyYW5zbGF0YWJsZVN0cmluZ3MgPSBPYmplY3Qua2V5cyhtYXAudHJhbnNsYXRpb25zKS5zb3J0KGZ1bmN0aW9uKFxuICAgICAgYSxcbiAgICAgIGJcbiAgICApIHtcbiAgICAgIHJldHVybiBiLmxlbmd0aCAtIGEubGVuZ3RoXG4gICAgfSlcbiAgICB0cmFuc2xhdGFibGVTdHJpbmdzLmZvckVhY2goZnVuY3Rpb24odCkge1xuICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cCgnXFxcXGIoJyArIFJlZ0V4cC5lc2NhcGUodCkgKyAnKScsICdnaScpXG4gICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKHJlLCBtYXAudHJhbnNsYXRpb25zW3RdKVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gY29udGVudFxufVxuXG53aW5kb3cuaGFuZGxlTGF5ZXJDbGljayA9IGZ1bmN0aW9uKGZlYXR1cmUsIGxheWVyLCBsZWFmbGV0KSB7XG4gIHZhciBpc1NwaWRlcmZpZWQgPSBmYWxzZVxuXG4gIGlmICghbGF5ZXIuX3ByZVNwaWRlcmZ5TGF0bG5nKSB7XG4gICAgT2JqZWN0LmtleXMobGVhZmxldC5fbGF5ZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKGwsIGkpIHtcbiAgICAgIGlmIChsZWFmbGV0Ll9sYXllcnNbbF0udW5zcGlkZXJmeSkgbGVhZmxldC5fbGF5ZXJzW2xdLnVuc3BpZGVyZnkoKVxuICAgIH0pXG5cbiAgICBpZiAobGF5ZXIuX19wYXJlbnQpIHtcbiAgICAgIE9iamVjdC52YWx1ZXMobGF5ZXIuX19wYXJlbnQuX2dyb3VwLl9mZWF0dXJlR3JvdXAuX2xheWVycykuZm9yRWFjaChcbiAgICAgICAgZnVuY3Rpb24odikge1xuICAgICAgICAgIGlmICh2Ll9ncm91cCAmJiB2Ll9ncm91cC5fc3BpZGVyZmllZCkgaXNTcGlkZXJmaWVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICApXG4gICAgICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5sZWFmbGV0LW1hcmtlci1pY29uJykpLmZvckVhY2goXG4gICAgICAgIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gKGQuc3R5bGUub3BhY2l0eSA9IGlzU3BpZGVyZmllZCA/IDAuMzMgOiAxKVxuICAgICAgICB9XG4gICAgICApXG4gICAgICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZy5sZWFmbGV0LW1hcmtlci1pY29uJykpLmZvckVhY2goXG4gICAgICAgIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gKGQuc3R5bGUub3BhY2l0eSA9IGlzU3BpZGVyZmllZCA/IDAuMzMgOiAxKVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgc3R5bGVLZXkgZnJvbSAnLi9zdHlsZUtleS5qcydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3R5bGVQb2ludChmZWF0dXJlLCBsYXRsbmcsIG1hcCkge1xuICB2YXIgcG9pbnRTdHlsZSwga2V5LCBzdHlsZU9wdGlvbnNcblxuICB2YXIgQ3VzdG9tSWNvbiA9IEwuSWNvbi5leHRlbmQoe1xuICAgIG9wdGlvbnM6IHtcbiAgICAgIGljb25TaXplOiBbODAsIDgwXSxcbiAgICAgIGljb25BbmNob3I6IG1hcC5pY29uc2l6ZVxuICAgICAgICA/IG1hcC5pY29uc2l6ZSAvIDRcbiAgICAgICAgOiBtYXAuaWNvbmFuY2hvclxuICAgICAgICAgID8gbWFwLmljb25hbmNob3JcbiAgICAgICAgICA6IFs1LCA1XVxuICAgIH1cbiAgfSlcblxuICB2YXIgbm9uUG9pbnRTdHlsZSwga2V5LCBkaXZJY29uXG5cbiAgZm9yIChsZXQgdyBvZiBtYXAud2lkZ2V0cykge1xuICAgIHZhciB0aGlzRm9ybUtleVdpZGdldCA9IHcudHlwZSA9PT0gJ2Zvcm0nID8gdyA6IG51bGxcbiAgICB2YXIgdGhpc0NvbG9yS2V5V2lkZ2V0ID0gdy50eXBlID09PSAnY29sb3InID8gdyA6IG51bGxcblxuICAgIHZhciBjb2xvcktleSA9IHRoaXNDb2xvcktleVdpZGdldFxuICAgICAgPyB0aGlzQ29sb3JLZXlXaWRnZXQua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgcmV0dXJuICFrLnZhbHVlXG4gICAgICAgICAgPyB0cnVlXG4gICAgICAgICAgOiBrLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW3RoaXNDb2xvcktleVdpZGdldC5maWVsZF0udG9Mb3dlckNhc2UoKVxuICAgICAgfSlcbiAgICAgIDogbnVsbFxuXG4gICAgdmFyIGZvcm1LZXkgPSB0aGlzRm9ybUtleVdpZGdldFxuICAgICAgPyB0aGlzRm9ybUtleVdpZGdldC5rZXlzLmZpbmQoZnVuY3Rpb24oaykge1xuICAgICAgICByZXR1cm4gIWsudmFsdWVcbiAgICAgICAgICA/IHRydWVcbiAgICAgICAgICA6IGsudmFsdWUudG9Mb3dlckNhc2UoKSA9PT1cbiAgICAgICAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXNbdGhpc0Zvcm1LZXlXaWRnZXQuZmllbGRdLnRvTG93ZXJDYXNlKClcbiAgICAgIH0pXG4gICAgICA6IG51bGxcblxuICAgIHZhciBjb2xvciA9IGNvbG9yS2V5ID8gY29sb3JLZXkuY29sb3IgOiBmb3JtS2V5ID8gZm9ybUtleS5jb2xvciA6IG51bGxcblxuICAgIGlmICh0aGlzRm9ybUtleVdpZGdldCAmJiBmZWF0dXJlLnByb3BlcnRpZXNbdGhpc0Zvcm1LZXlXaWRnZXQuZmllbGRdKSB7XG4gICAgICB2YXIgZm9ybXMgPSB0aGlzRm9ybUtleVdpZGdldC5rZXlzLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgIHJldHVybiBrLnZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgIH0pXG4gICAgICB2YXIgaSA9IGZvcm1zLmluZGV4T2YoXG4gICAgICAgIGZlYXR1cmUucHJvcGVydGllc1t0aGlzRm9ybUtleVdpZGdldC5maWVsZF0udG9Mb3dlckNhc2UoKVxuICAgICAgKVxuICAgICAga2V5ID0gdGhpc0Zvcm1LZXlXaWRnZXQua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgcmV0dXJuICFrLnZhbHVlXG4gICAgICAgICAgPyB0cnVlXG4gICAgICAgICAgOiBrLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllc1t0aGlzRm9ybUtleVdpZGdldC5maWVsZF0udG9Mb3dlckNhc2UoKVxuICAgICAgfSlcblxuICAgICAgaWYgKCFrZXkpIGJyZWFrXG5cbiAgICAgIHZhciBzdHlsZU9wdGlvbnMgPSB7XG4gICAgICAgIGtleTogZm9ybUtleSxcbiAgICAgICAgaW5kZXg6IGksXG4gICAgICAgIGZvcm1zOiBmb3JtcyxcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgZmVhdHVyZTogZmVhdHVyZVxuICAgICAgfVxuXG4gICAgICBpZiAoa2V5LmZvcm0gPT09ICdkaXYnKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGZlYXR1cmUucHJvcGVydGllc1t0aGlzRm9ybUtleVdpZGdldC5maWVsZF1cbiAgICAgICAgdmFyIGNvdW50ID0gdmFsdWUgPyB2YWx1ZS5zcGxpdCgnficpLmxlbmd0aCA6IDBcblxuICAgICAgICBkaXZJY29uID0gTC5kaXZJY29uKHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdpY29uLWRpdicsXG4gICAgICAgICAgaHRtbDpcbiAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInRleHRcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6JyArXG4gICAgICAgICAgICBjb2xvciArXG4gICAgICAgICAgICAnXCI+JyArXG4gICAgICAgICAgICBjb3VudCArXG4gICAgICAgICAgICAnPC9zcGFuPidcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcG9pbnRTdHlsZSA9IGRpdkljb24gPyBkaXZJY29uIDogc3R5bGVLZXkoc3R5bGVPcHRpb25zKVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzQ29sb3JLZXlXaWRnZXQgJiZcbiAgICAgIGZlYXR1cmUucHJvcGVydGllc1t0aGlzQ29sb3JLZXlXaWRnZXQuZmllbGRdXG4gICAgKSB7XG4gICAgICBrZXkgPSB0aGlzQ29sb3JLZXlXaWRnZXQua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgcmV0dXJuICFrLnZhbHVlXG4gICAgICAgICAgPyB0cnVlXG4gICAgICAgICAgOiBrLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllc1t0aGlzQ29sb3JLZXlXaWRnZXQuZmllbGRdLnRvTG93ZXJDYXNlKClcbiAgICAgIH0pXG5cbiAgICAgIGlmICgha2V5KSBicmVha1xuXG4gICAgICB2YXIgc3R5bGVPcHRpb25zID0ge1xuICAgICAgICBrZXk6IGNvbG9yS2V5LFxuICAgICAgICBjb2xvcjogY29sb3JLZXkuY29sb3IsXG4gICAgICAgIG1hcDogbWFwLFxuICAgICAgICBmZWF0dXJlOiBmZWF0dXJlXG4gICAgICB9XG5cbiAgICAgIHBvaW50U3R5bGUgPSBzdHlsZUtleShzdHlsZU9wdGlvbnMpXG4gICAgICBjb25zb2xlLmxvZyhwb2ludFN0eWxlLnN2ZylcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN2ZyA9XG4gICAgICAgICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48Y2lyY2xlIGN4PVwiNlwiIGN5PVwiNlwiIHI9XCI1XCIgZmlsbD1cIicgK1xuICAgICAgICAncmVkJyArXG4gICAgICAgICdcIi8+PC9zdmc+J1xuICAgICAgcG9pbnRTdHlsZSA9IHtcbiAgICAgICAgY2xhc3M6ICdkZWZhdWx0JyxcbiAgICAgICAgc3ZnOiBlbmNvZGVVUkkoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIHdpbmRvdy5idG9hKHN2ZykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGljb25VcmwgPSBwb2ludFN0eWxlLnN2Z1xuICAgIHZhciBpY29uID0gbmV3IEN1c3RvbUljb24oe1xuICAgICAgaWNvblVybDogaWNvblVybFxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gTC5tYXJrZXIobGF0bG5nLCB7XG4gICAgaWNvbjogZGl2SWNvbiA/IGRpdkljb24gOiBpY29uXG4gIH0pXG59XG4iLCJpbXBvcnQgc3R5bGVLZXkgZnJvbSAnLi9zdHlsZUtleS5qcydcbmltcG9ydCB7IGxpbmVXZWlnaHRzLCBsaW5lRGFzaEFycmF5cyB9IGZyb20gJy4vaGVscGVycy5qcydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3R5bGVOb25Qb2ludChmZWF0dXJlLCBtYXAsIGluZGV4KSB7XG4gIHZhciBub25Qb2ludFN0eWxlLFxuICAgIGNvbG9ycyA9IFtdLFxuICAgIGZvcm1zID0gW10sXG4gICAgc29ydCA9IFsnZm9ybScsICdjb2xvciddXG5cbiAgdmFyIGNvbG9yS2V5V2lkZ2V0ID0gbWFwLndpZGdldHMuZmluZChmdW5jdGlvbih3KSB7XG4gICAgdmFyIGtleSA9IHcua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiAhay52YWx1ZVxuICAgICAgICA/IHRydWVcbiAgICAgICAgOiBrLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IGZlYXR1cmUucHJvcGVydGllc1t3LmZpZWxkXS50b0xvd2VyQ2FzZSgpXG4gICAgfSlcbiAgICByZXR1cm4ga2V5ICYmIHcudHlwZSA9PT0gJ2NvbG9yJ1xuICB9KVxuXG4gIHZhciBmb3JtS2V5V2lkZ2V0ID0gbWFwLndpZGdldHMuZmluZChmdW5jdGlvbih3KSB7XG4gICAgdmFyIGtleSA9IHcua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiAhay52YWx1ZVxuICAgICAgICA/IHRydWVcbiAgICAgICAgOiBrLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IGZlYXR1cmUucHJvcGVydGllc1t3LmZpZWxkXS50b0xvd2VyQ2FzZSgpXG4gICAgfSlcbiAgICByZXR1cm4ga2V5ICYmIHcudHlwZSA9PT0gJ2Zvcm0nXG4gIH0pXG5cbiAgZm9yIChsZXQgdyBvZiBtYXAud2lkZ2V0cykge1xuICAgIHZhciBjb2xvcktleSA9IGNvbG9yS2V5V2lkZ2V0XG4gICAgICA/IGNvbG9yS2V5V2lkZ2V0LmtleXMuZmluZChmdW5jdGlvbihrKSB7XG4gICAgICAgIHJldHVybiAhay52YWx1ZVxuICAgICAgICAgID8gdHJ1ZVxuICAgICAgICAgIDogay52YWx1ZS50b0xvd2VyQ2FzZSgpID09PVxuICAgICAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllc1tjb2xvcktleVdpZGdldC5maWVsZF0udG9Mb3dlckNhc2UoKVxuICAgICAgfSlcbiAgICAgIDogbnVsbFxuXG4gICAgdmFyIGZvcm1LZXkgPSBmb3JtS2V5V2lkZ2V0XG4gICAgICA/IGZvcm1LZXlXaWRnZXQua2V5cy5maW5kKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgcmV0dXJuICFrLnZhbHVlXG4gICAgICAgICAgPyB0cnVlXG4gICAgICAgICAgOiBrLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzW2Zvcm1LZXlXaWRnZXQuZmllbGRdLnRvTG93ZXJDYXNlKClcbiAgICAgIH0pXG4gICAgICA6IG51bGxcblxuICAgIHZhciBjb2xvciA9IGNvbG9yS2V5ID8gY29sb3JLZXkuY29sb3IgOiBmb3JtS2V5ID8gZm9ybUtleS5jb2xvciA6IG51bGxcblxuICAgIHZhciBmb3JtS2V5Rm9ybSA9IGZvcm1LZXlXaWRnZXRcbiAgICAgID8gZm9ybUtleVdpZGdldC5rZXlzLnJlZHVjZShmdW5jdGlvbihhLCBjKSB7XG4gICAgICAgIHJldHVybiBjLmZvcm1cbiAgICAgIH0pXG4gICAgICA6IG51bGxcblxuICAgIHZhciBjb2xvcktleUZvcm0gPSBjb2xvcktleVdpZGdldFxuICAgICAgPyBjb2xvcktleVdpZGdldC5rZXlzLnJlZHVjZShmdW5jdGlvbihhLCBjKSB7XG4gICAgICAgIHJldHVybiBjLmZvcm1cbiAgICAgIH0pXG4gICAgICA6IG51bGxcblxuICAgIHZhciBmb3JtID0gZm9ybUtleVdpZGdldFxuICAgICAgPyBmb3JtS2V5V2lkZ2V0LmtleXMucmVkdWNlKGZ1bmN0aW9uKGEsIGMpIHtcbiAgICAgICAgcmV0dXJuIGMuZm9ybVxuICAgICAgfSlcbiAgICAgIDogbnVsbFxuXG4gICAgaWYgKGZvcm1LZXlXaWRnZXQgJiYgZm9ybSA9PT0gJ2xpbmUnKSB7XG4gICAgICBmb3JtcyA9IGZvcm1LZXlXaWRnZXQua2V5cy5tYXAoZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZi52YWx1ZVxuICAgICAgfSlcbiAgICAgIGZvcm1zLmZvckVhY2goZnVuY3Rpb24oZiwgaSkge1xuICAgICAgICBzd2l0Y2ggKGkpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIGNvbG9ycy5wdXNoKFsndHJhbnNwYXJlbnQnLCBudWxsXSlcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBjb2xvcnMucHVzaChbbnVsbCwgZGVmYXVsdENvbG9yXSlcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBjb2xvcnMucHVzaChbJyMwMDAwMDAnLCBudWxsXSlcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjb2xvcnMucHVzaChbJyNmZmZmZmYnLCBudWxsXSlcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29sb3JzLnB1c2goW251bGwsIG51bGxdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgKGZvcm1zICYmIGZvcm1LZXlGb3JtID09PSAnbGluZScpIHx8XG4gICAgICAoZm9ybXMgJiYgY29sb3JLZXlGb3JtID09PSAnbGluZScpXG4gICAgKSB7XG4gICAgICB2YXIgaSA9IGZvcm1zLmluZGV4T2YoZmVhdHVyZS5wcm9wZXJ0aWVzW2Zvcm1LZXlXaWRnZXQuZmllbGRdKVxuICAgICAgaWYgKGkgPiAtMSkge1xuICAgICAgICBub25Qb2ludFN0eWxlID0ge1xuICAgICAgICAgIGNvbG9yOlxuICAgICAgICAgICAgY29sb3JzW2ldW2luZGV4XSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgID8gJyNjYWQyZDMnXG4gICAgICAgICAgICAgIDogY29sb3JzW2ldW2luZGV4XSAhPT0gbnVsbFxuICAgICAgICAgICAgICAgID8gY29sb3JzW2ldW2luZGV4XVxuICAgICAgICAgICAgICAgIDogY29sb3IsXG4gICAgICAgICAgd2VpZ2h0OiBsaW5lV2VpZ2h0c1tpXVtpbmRleF0sXG4gICAgICAgICAgbGluZUNhcDogJ3NxdWFyZScsXG4gICAgICAgICAgZGFzaEFycmF5OiBsaW5lRGFzaEFycmF5c1tpXSA/IGxpbmVEYXNoQXJyYXlzW2ldW2luZGV4XSA6IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZm9ybUtleUZvcm0gPT09ICdsaW5lJyB8fCBjb2xvcktleUZvcm0gPT09ICdsaW5lJykge1xuICAgICAgbm9uUG9pbnRTdHlsZSA9IHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGxpbmVDYXA6ICdzcXVhcmUnLFxuICAgICAgICBkYXNoQXJyYXk6ICczLDcnXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjb2xvcktleSAmJiBjb2xvcktleS5mb3JtID09PSAncGF0dGVybicpIHtcbiAgICAgIHZhciBwYXR0ZXJuXG5cbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgY2FzZSBjb2xvcktleS5wYXR0ZXJuWzBdLmluZGV4T2YoJ3N0cmlwZScpID4gLTE6XG4gICAgICAgIHZhciBwYXR0ZXJuT3B0aW9ucyA9IHtcbiAgICAgICAgICB3ZWlnaHQ6IDMsXG4gICAgICAgICAgc3BhY2VXZWlnaHQ6IDMsXG4gICAgICAgICAgY29sb3I6IGNvbG9yS2V5LnBhdHRlcm5bMV0sXG4gICAgICAgICAgc3BhY2VDb2xvcjogY29sb3JLZXkucGF0dGVybltjb2xvcktleS5wYXR0ZXJuLmxlbmd0aCAtIDFdLFxuICAgICAgICAgIHNwYWNlT3BhY2l0eTogMSxcbiAgICAgICAgICBhbmdsZTogNDVcbiAgICAgICAgfVxuICAgICAgICBwYXR0ZXJuID0gbmV3IEwuU3RyaXBlUGF0dGVybihwYXR0ZXJuT3B0aW9ucylcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSBjb2xvcktleS5wYXR0ZXJuWzBdLmluZGV4T2YoJ2RvdCcpID4gLTE6XG4gICAgICAgIHZhciBzaGFwZU9wdGlvbnMgPSB7XG4gICAgICAgICAgeDogNCxcbiAgICAgICAgICB5OiA0LFxuICAgICAgICAgIHJhZGl1czogMixcbiAgICAgICAgICBmaWxsOiB0cnVlLFxuICAgICAgICAgIHN0cm9rZTogZmFsc2UsXG4gICAgICAgICAgZmlsbENvbG9yOiBjb2xvcktleS5wYXR0ZXJuW2NvbG9yS2V5LnBhdHRlcm4ubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDFcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2hhcGUgPSBuZXcgTC5QYXR0ZXJuQ2lyY2xlKHNoYXBlT3B0aW9ucylcbiAgICAgICAgdmFyIHBhdHRlcm5PcHRpb25zID0ge1xuICAgICAgICAgIHdpZHRoOiA4LFxuICAgICAgICAgIGhlaWdodDogOFxuICAgICAgICB9XG4gICAgICAgIHBhdHRlcm4gPSBuZXcgTC5QYXR0ZXJuKHBhdHRlcm5PcHRpb25zKVxuICAgICAgICBwYXR0ZXJuLmFkZFNoYXBlKHNoYXBlKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBwYXR0ZXJuLmFkZFRvKG1hcC5sZWFmbGV0KVxuICAgICAgbm9uUG9pbnRTdHlsZSA9IHtcbiAgICAgICAgZmlsbFBhdHRlcm46IHBhdHRlcm4gPyBwYXR0ZXJuIDogbnVsbCxcbiAgICAgICAgZmlsbENvbG9yOiBjb2xvcixcbiAgICAgICAgY29sb3I6IGRlZmF1bHRDb2xvcixcbiAgICAgICAgZmlsbE9wYWNpdHk6IDAuNyxcbiAgICAgICAgb3BhY2l0eTogMC41LFxuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGxpbmVDYXA6ICdzcXVhcmUnXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsaW5lQ29sb3JcbiAgICAgIHZhciBsaW5lV2VpZ2h0XG4gICAgICB2YXIgbGluZU9wYWNpdHlcblxuICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICBjYXNlIGZlYXR1cmUuZ2VvbWV0cnkudHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2xpbmUnKSA+IC0xOlxuICAgICAgICBsaW5lQ29sb3IgPSBjb2xvclxuICAgICAgICAgID8gY2hyb21hKGNvbG9yKVxuICAgICAgICAgICAgLmJyaWdodGVuKClcbiAgICAgICAgICAgIC5oZXgoKVxuICAgICAgICAgIDogbnVsbFxuICAgICAgICBsaW5lT3BhY2l0eSA9IDFcbiAgICAgICAgbGluZVdlaWdodCA9IDRcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSBmZWF0dXJlLmdlb21ldHJ5LnR5cGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdwb2x5Z29uJykgPiAtMTpcbiAgICAgICAgbGluZUNvbG9yID0gZGVmYXVsdENvbG9yXG4gICAgICAgIGxpbmVPcGFjaXR5ID0gMC41XG4gICAgICAgIGxpbmVXZWlnaHQgPSAyXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIG5vblBvaW50U3R5bGUgPSB7XG4gICAgICAgIGZpbGxQYXR0ZXJuOiBwYXR0ZXJuLFxuICAgICAgICBmaWxsQ29sb3I6IGNvbG9yLFxuICAgICAgICBjb2xvcjogbGluZUNvbG9yLFxuICAgICAgICBmaWxsT3BhY2l0eTogMC43LFxuICAgICAgICBvcGFjaXR5OiBsaW5lT3BhY2l0eSxcbiAgICAgICAgd2VpZ2h0OiBsaW5lV2VpZ2h0XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vblBvaW50U3R5bGUpIHJldHVybiBub25Qb2ludFN0eWxlXG4gIH1cbn1cbiIsImltcG9ydCBoYW5kbGVGZWF0dXJlRXZlbnRzIGZyb20gJy4vaGFuZGxlRmVhdHVyZUV2ZW50cy5qcydcbmltcG9ydCBzdHlsZVBvaW50IGZyb20gJy4vc3R5bGVQb2ludC5qcydcbmltcG9ydCBzdHlsZU5vblBvaW50IGZyb20gJy4vc3R5bGVOb25Qb2ludC5qcydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZUdlb0pzb25PcHRpb25zKFxuICBtYXAsXG4gIGNvbG9yS2V5V2lkZ2V0cyxcbiAgZm9ybUtleVdpZGdldHNcbikge1xuICBmdW5jdGlvbiBmaWx0ZXIoZmVhdHVyZSkge1xuICAgIHJldHVybiBtYXAuZmlsdGVyc1xuICAgICAgLm1hcChmdW5jdGlvbihmKSB7XG4gICAgICAgIHJldHVybiBmKGZlYXR1cmUpXG4gICAgICB9KVxuICAgICAgLmV2ZXJ5KGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgcmV0dXJuIGYgIT09IGZhbHNlXG4gICAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gb25FYWNoRmVhdHVyZShmZWF0dXJlLCBsYXllcikge1xuICAgIGhhbmRsZUZlYXR1cmVFdmVudHMoZmVhdHVyZSwgbGF5ZXIsIG1hcClcbiAgfVxuXG4gIHZhciBiYWNrZ3JvdW5kT3B0aW9ucyA9IHtcbiAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICBvbkVhY2hGZWF0dXJlOiBvbkVhY2hGZWF0dXJlLFxuICAgIHBvaW50VG9MYXllcjpcbiAgICAgIG1hcC5wb2ludFN0eWxlIHx8XG4gICAgICBmdW5jdGlvbihmZWF0dXJlLCBsYXRsbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0eWxlUG9pbnQoZmVhdHVyZSwgbGF0bG5nLCBtYXApXG4gICAgICB9LFxuICAgIHN0eWxlOlxuICAgICAgbWFwLm5vblBvaW50U3R5bGUgfHxcbiAgICAgIGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc3R5bGVOb25Qb2ludChmZWF0dXJlLCBzdHlsZU9wdGlvbnMsIDApKVxuICAgICAgICByZXR1cm4gc3R5bGVOb25Qb2ludChmZWF0dXJlLCBtYXAsIDApXG4gICAgICB9XG4gIH1cbiAgdmFyIGZvcmVncm91bmRPcHRpb25zID0ge1xuICAgIGZpbHRlcjogZmlsdGVyLFxuICAgIG9uRWFjaEZlYXR1cmU6IG9uRWFjaEZlYXR1cmUsXG4gICAgcG9pbnRUb0xheWVyOlxuICAgICAgbWFwLnBvaW50U3R5bGUgfHxcbiAgICAgIGZ1bmN0aW9uKGZlYXR1cmUsIGxhdGxuZykge1xuICAgICAgICByZXR1cm4gc3R5bGVQb2ludChmZWF0dXJlLCBsYXRsbmcsIG1hcClcbiAgICAgIH0sXG4gICAgc3R5bGU6XG4gICAgICBtYXAubm9uUG9pbnRTdHlsZSB8fFxuICAgICAgZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgICAgICByZXR1cm4gc3R5bGVOb25Qb2ludChmZWF0dXJlLCBtYXAsIDEpXG4gICAgICB9XG4gIH1cblxuICByZXR1cm4gW2JhY2tncm91bmRPcHRpb25zLCBmb3JlZ3JvdW5kT3B0aW9uc11cbn1cbiIsImltcG9ydCBtYWtlR2VvSnNvbk9wdGlvbnMgZnJvbSAnLi9tYWtlR2VvSnNvbk9wdGlvbnMuanMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VMYXllcnMobWFwKSB7XG4gIHZhciBjb2xvcktleVdpZGdldHMgPSBbXSxcbiAgICBmb3JtS2V5V2lkZ2V0cyA9IFtdXG5cbiAgaWYgKG1hcC53aWRnZXRzKSB7XG4gICAgY29sb3JLZXlXaWRnZXRzID0gbWFwLndpZGdldHMuZmlsdGVyKGZ1bmN0aW9uKHcpIHtcbiAgICAgIHJldHVybiB3LnR5cGUgPT09ICdjb2xvcidcbiAgICB9KVxuICAgIGZvcm1LZXlXaWRnZXRzID0gbWFwLndpZGdldHMuZmlsdGVyKGZ1bmN0aW9uKHcpIHtcbiAgICAgIHJldHVybiB3LnR5cGUgPT09ICdmb3JtJ1xuICAgIH0pXG4gIH1cblxuICB2YXIgZ2VvSnNvbk9wdGlvbnMgPSBtYXAuZ2VvSnNvbk9wdGlvbnNcbiAgICA/IG1hcC5nZW9Kc29uT3B0aW9ucyhtYXApXG4gICAgOiBtYWtlR2VvSnNvbk9wdGlvbnMobWFwKVxuICBtYXAuanNvbi5mb3JFYWNoKGZ1bmN0aW9uKGpzb24sIGkpIHtcbiAgICB2YXIgY2x1c3RlckNvbG9yLCBjb2xvcktleVdpZGdldFxuXG4gICAgaWYgKGNvbG9yS2V5V2lkZ2V0cy5sZW5ndGgpIHtcbiAgICAgIHZhciBjb2xvcktleXMgPSBjb2xvcktleVdpZGdldHNcbiAgICAgICAgLm1hcChmdW5jdGlvbih3aWRnZXQpIHtcbiAgICAgICAgICB2YXIgY29sbGVjdGlvbk5hbWUgPSBqc29uLmZlYXR1cmVzWzBdLnByb3BlcnRpZXNbd2lkZ2V0LmZpZWxkXVxuXG4gICAgICAgICAgdmFyIGtleSA9IHdpZGdldC5rZXlzLmZpbmQoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5LnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IGNvbGxlY3Rpb25OYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgY29sb3JLZXlXaWRnZXQgPSB3aWRnZXRcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGtleVxuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGNvbG9yS2V5KSB7XG4gICAgICAgICAgcmV0dXJuIGNvbG9yS2V5XG4gICAgICAgIH0pXG5cbiAgICAgIGNsdXN0ZXJDb2xvciA9IGNvbG9yS2V5c1swXSA/IGNvbG9yS2V5c1swXS5jb2xvciA6ICcjMDAwMDAwJ1xuICAgIH0gZWxzZSB7XG4gICAgICBjbHVzdGVyQ29sb3IgPSAnIzAwMDAwMCdcbiAgICB9XG5cbiAgICB2YXIgYWxsUG9pbnRzID0ganNvbi5mZWF0dXJlcy5ldmVyeShmdW5jdGlvbihmZWF0dXJlKSB7XG4gICAgICByZXR1cm4gZmVhdHVyZS5nZW9tZXRyeSAmJiBmZWF0dXJlLmdlb21ldHJ5LnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3BvaW50J1xuICAgIH0pXG5cbiAgICBtYXAuZ3JvdXBzLnB1c2goXG4gICAgICBuZXcgTC5NYXJrZXJDbHVzdGVyR3JvdXAoe1xuICAgICAgICBzaG93Q292ZXJhZ2VPbkhvdmVyOiBmYWxzZSxcbiAgICAgICAgem9vbVRvQm91bmRzT25DbGljazogZmFsc2UsXG4gICAgICAgIG1heENsdXN0ZXJSYWRpdXM6XG4gICAgICAgICAgYWxsUG9pbnRzICYmIG1hcC5jbHVzdGVyZGlzdGFuY2UgPyBtYXAuY2x1c3RlcmRpc3RhbmNlIDogTmFOLFxuICAgICAgICBpY29uQ3JlYXRlRnVuY3Rpb246IGZ1bmN0aW9uIGljb25DcmVhdGVGdW5jdGlvbihjbHVzdGVyKSB7XG4gICAgICAgICAgcmV0dXJuIEwuZGl2SWNvbih7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdpY29uLWdyb3VwJyxcbiAgICAgICAgICAgIGh0bWw6XG4gICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInRleHRcIiBzdHlsZT1cImJvcmRlcjogMnB4IHNvbGlkJyArXG4gICAgICAgICAgICAgIGNsdXN0ZXJDb2xvciArXG4gICAgICAgICAgICAgICc7IGNvbG9yOicgK1xuICAgICAgICAgICAgICBjbHVzdGVyQ29sb3IgK1xuICAgICAgICAgICAgICAnXCI+JyArXG4gICAgICAgICAgICAgIGNsdXN0ZXIuZ2V0Q2hpbGRDb3VudCgpICtcbiAgICAgICAgICAgICAgJzwvc3Bhbj4nXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG5cbiAgICBnZW9Kc29uT3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgaWYgKGNvbG9yS2V5V2lkZ2V0KSB7XG4gICAgICAgIGpzb24uZmVhdHVyZXMgPSBqc29uLmZlYXR1cmVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgIHJldHVybiBiLnByb3BlcnRpZXNbY29sb3JLZXlXaWRnZXQuZmllbGRdLmxvY2FsZUNvbXBhcmUoXG4gICAgICAgICAgICBhLnByb3BlcnRpZXNbY29sb3JLZXlXaWRnZXQuZmllbGRdXG4gICAgICAgICAgKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB2YXIgZ2VvSnNvbiA9IEwuZ2VvSnNvbihqc29uLCBvcHRpb24pXG4gICAgICBtYXAuZ3JvdXBzW2ldLmFkZExheWVyKGdlb0pzb24pXG4gICAgfSlcblxuICAgIG1hcC5sZWFmbGV0LmFkZExheWVyKG1hcC5ncm91cHNbaV0pXG4gICAgbWFwLmdyb3Vwc1tpXS5vbignY2x1c3RlcmNsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgaGFuZGxlQ2x1c3RlckNsaWNrKGUsIG1hcCwgaSlcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBoYW5kbGVDbHVzdGVyQ2xpY2soZSwgbWFwLCBpKSB7XG4gIG1hcC5sZWFmbGV0Ll9sYXllcnNbZS5sYXllci5fbGVhZmxldF9pZF0uc3BpZGVyZnkoKVxuXG4gIE9iamVjdC5rZXlzKG1hcC5sZWFmbGV0Ll9sYXllcnMpLmZvckVhY2goZnVuY3Rpb24obGF5ZXIsIGkpIHtcbiAgICBpZiAocGFyc2VJbnQobGF5ZXIsIDEwKSAhPT0gZS5sYXllci5fbGVhZmxldF9pZCkge1xuICAgICAgaWYgKG1hcC5sZWFmbGV0Ll9sYXllcnNbbGF5ZXJdLnVuc3BpZGVyZnkpXG4gICAgICAgIG1hcC5sZWFmbGV0Ll9sYXllcnNbbGF5ZXJdLnVuc3BpZGVyZnkoKVxuICAgIH1cbiAgfSlcbiAgdmFyIGlzU3BpZGVyZmllZCA9IGZhbHNlXG4gIE9iamVjdC52YWx1ZXMobWFwLmdyb3Vwc1tpXS5fZmVhdHVyZUdyb3VwLl9sYXllcnMpLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIGlmICh2Ll9ncm91cCAmJiB2Ll9ncm91cC5fc3BpZGVyZmllZCkgaXNTcGlkZXJmaWVkID0gdHJ1ZVxuICB9KVxuICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5sZWFmbGV0LW1hcmtlci1pY29uJykpLmZvckVhY2goXG4gICAgZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIChkLnN0eWxlLm9wYWNpdHkgPSBpc1NwaWRlcmZpZWQgPyAwLjMzIDogMSlcbiAgICB9XG4gIClcbiAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWcubGVhZmxldC1tYXJrZXItaWNvbicpKS5mb3JFYWNoKFxuICAgIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiAoZC5zdHlsZS5vcGFjaXR5ID0gaXNTcGlkZXJmaWVkID8gMC4zMyA6IDEpXG4gICAgfVxuICApXG4gIE9iamVjdC52YWx1ZXMobWFwLmdyb3Vwc1tpXS5fZmVhdHVyZUdyb3VwLl9sYXllcnMpLmZpbHRlcihmdW5jdGlvbih2KSB7XG4gICAgZS5sYXllclxuICAgICAgLmdldEFsbENoaWxkTWFya2VycygpXG4gICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgcmV0dXJuIG0uZ2V0RWxlbWVudCgpXG4gICAgICB9KVxuICAgICAgLmZpbHRlcihmdW5jdGlvbihtKSB7XG4gICAgICAgIHJldHVybiBtXG4gICAgICB9KVxuICAgICAgLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgICAgICByZXR1cm4gKG0uc3R5bGUub3BhY2l0eSA9IDEpXG4gICAgICB9KVxuICB9KVxufVxuIiwiaW1wb3J0IEN1c3RvbU1hcCBmcm9tICcuL0N1c3RvbU1hcC5qcydcbmltcG9ydCBtYWtlTGF5ZXJzIGZyb20gJy4vbWFrZUxheWVycy5qcydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFwV2lkZ2V0c1RvU3RhdGUob3B0aW9ucykge1xuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBvcHRpb25zLnNsdWcgKyAnIC5tYXAnKVxuXG4gIHZhciBtYXAgPSBuZXcgQ3VzdG9tTWFwKGNvbnRhaW5lciwgb3B0aW9ucykucmVuZGVyKClcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciB0YWJsZXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKS5maWx0ZXIoZnVuY3Rpb24oaykge1xuICAgICAgcmV0dXJuIGsudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd0YWJsZScpID4gLTFcbiAgICB9KVxuXG4gICAgUHJvbWlzZS5hbGwoXG4gICAgICB0YWJsZXMubWFwKGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChcbiAgICAgICAgICAnaHR0cHM6Ly9jc2lzLmNhcnRvLmNvbS9hcGkvdjIvc3FsP2FwaV9rZXk9JyArXG4gICAgICAgICAgICBtYXAuYXBpa2V5ICtcbiAgICAgICAgICAgICcmZm9ybWF0PWdlb2pzb24mcT1TRUxFQ1QlMjAqJTIwRlJPTSUyMCcgK1xuICAgICAgICAgICAgb3B0aW9uc1t0YWJsZV1cbiAgICAgICAgKVxuICAgICAgfSlcbiAgICApXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZXMpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICAgIHJlc3BvbnNlcy5tYXAoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICB9KVxuXG4gICAgICAudGhlbihmdW5jdGlvbihqc29ucykge1xuICAgICAgICB2YXIganNvbiA9IGpzb25zLnJlZHVjZShmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICAgICAgICBmZWF0dXJlczogYS5mZWF0dXJlcy5jb25jYXQoYi5mZWF0dXJlcylcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdmFyIGNvbG9yS2V5V2lkZ2V0ID0gbWFwLndpZGdldHMuZmluZChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgcmV0dXJuIHcudHlwZSA9PT0gJ2NvbG9yJ1xuICAgICAgICB9KVxuICAgICAgICBtYXAuanNvbiA9IFtqc29uXVxuXG4gICAgICAgIGlmIChjb2xvcktleVdpZGdldCkge1xuICAgICAgICAgIG1hcC5qc29uID0gW11cbiAgICAgICAgICB2YXIgZmVhdHVyZUdyb3VwcyA9IGpzb24uZmVhdHVyZXMuZ3JvdXBCeShcbiAgICAgICAgICAgIGNvbG9yS2V5V2lkZ2V0LmZpZWxkLFxuICAgICAgICAgICAgJ3Byb3BlcnRpZXMnXG4gICAgICAgICAgKVxuICAgICAgICAgIE9iamVjdC5rZXlzKGZlYXR1cmVHcm91cHMpXG4gICAgICAgICAgICAuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmZWF0dXJlR3JvdXBzW2JdWzBdLnByb3BlcnRpZXNbXG4gICAgICAgICAgICAgICAgY29sb3JLZXlXaWRnZXQuZmllbGRcbiAgICAgICAgICAgICAgXS5sb2NhbGVDb21wYXJlKFxuICAgICAgICAgICAgICAgIGZlYXR1cmVHcm91cHNbYV1bMF0ucHJvcGVydGllc1tjb2xvcktleVdpZGdldC5maWVsZF1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgICAgICAgICAgICBtYXAuanNvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgICAgICAgICAgIGZlYXR1cmVzOiBmZWF0dXJlR3JvdXBzW2ZlYXR1cmVdXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLndpZGdldHMubGVuZ3RoKSB7XG4gICAgICAgICAgbWFrZUxheWVycyhtYXApXG4gICAgICAgICAgdmFyIGJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgb3B0aW9ucy5zbHVnICsgJyAjY29udHJvbHMnKVxuICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucy53aWRnZXRzLmZvckVhY2goZnVuY3Rpb24odywgeCkge1xuICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICcjJyArIG9wdGlvbnMuc2x1ZyArICcgLndpZGdldC4nICsgb3B0aW9ucy53aWRnZXRzW3hdLmZpZWxkXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgaWYgKGVsZW1lbnQucXVlcnlTZWxlY3Rvcignc2VsZWN0JykgJiYgd2lkZ2V0Q29udGVudFt4XS5vcHRpb25zKSB7XG4gICAgICAgICAgICBuZXcgQ2hvaWNlcyhcbiAgICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKSxcbiAgICAgICAgICAgICAgd2lkZ2V0Q29udGVudFt4XS5vcHRpb25zXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbaWRePVxcJ3NlYXJjaFxcJ10nKSkge1xuICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcignI3Jlc2V0QnV0dG9uJylcbiAgICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlUmVzZXQoZWxlbWVudCwgbWFwLCB4KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzZWxlY3RzID0gQXJyYXkuZnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NlbGVjdCcpKVxuICAgICAgICAgIHZhciBjaGVja3MgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVxcJ2NoZWNrYm94XFwnXScpXG4gICAgICAgICAgKVxuICAgICAgICAgIHZhciBzZWFyY2ggPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVxcJ3RleHRcXCddOm5vdCguY2hvaWNlc19faW5wdXQpJylcbiAgICAgICAgICApXG4gICAgICAgICAgdmFyIHRvZ2dsZSA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XFwncmFkaW9cXCddJylcbiAgICAgICAgICApXG4gICAgICAgICAgdmFyIGlucHV0cyA9IHNlbGVjdHNcbiAgICAgICAgICAgIC5jb25jYXQoY2hlY2tzKVxuICAgICAgICAgICAgLmNvbmNhdChzZWFyY2gpXG4gICAgICAgICAgICAuY29uY2F0KHRvZ2dsZSkgLy8gaWYgKCFpbnB1dHMubGVuZ3RoKSBtYWtlTGF5ZXJzKG1hcClcblxuICAgICAgICAgIHZhciBpbml0aWFsaXplZCA9IDBcblxuICAgICAgICAgIHZhciBjb3VudCA9IGlucHV0cy5sZW5ndGhcbiAgICAgICAgICBpbnB1dHMuZm9yRWFjaChmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGhhbmRsZUNoYW5nZShcbiAgICAgICAgICAgICAgICAgIG1hcCxcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICBvcHRpb25zLndpZGdldHMsXG4gICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICAgICAgICArK2luaXRpYWxpemVkXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlQ2hhbmdlKFxuICAgICAgICAgICAgICAgICAgbWFwLFxuICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnMud2lkZ2V0cyxcbiAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICBjb3VudCxcbiAgICAgICAgICAgICAgICAgICsraW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgnY3JlYXRlRXZlbnQnIGluIGRvY3VtZW50KSB7XG4gICAgICAgICAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpXG4gICAgICAgICAgICAgIGV2dC5pbml0RXZlbnQoJ2NoYW5nZScsIGZhbHNlLCB0cnVlKVxuICAgICAgICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KGV2dClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlucHV0LmZpcmVFdmVudCgnb25jaGFuZ2UnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3Lm1hcF9pZCA9IG1hcC5pZFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKG1hcC50cmFuc2xhdGlvbnMpIHtcbiAgICAgICAgICB2YXIgdHJhbnNsYXRhYmxlTm9kZXMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRyYW5zbGF0ZScpXG4gICAgICAgICAgKVxuICAgICAgICAgIHZhciB0cmFuc2xhdGFibGVTdHJpbmdzID0gT2JqZWN0LmtleXMobWFwLnRyYW5zbGF0aW9ucykuc29ydChmdW5jdGlvbihcbiAgICAgICAgICAgIGEsXG4gICAgICAgICAgICBiXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdHJhbnNsYXRhYmxlTm9kZXMuZm9yRWFjaChmdW5jdGlvbihlbCwgaSkge1xuICAgICAgICAgICAgdHJhbnNsYXRhYmxlU3RyaW5ncy5mb3JFYWNoKGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKG1hcC50cmFuc2xhdGlvbnNbdF0pLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAoJ1xcXFxiKCcgKyBSZWdFeHAuZXNjYXBlKHQpICsgJyknLCAnZ2knKVxuICAgICAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IGVsLmlubmVySFRNTC5yZXBsYWNlKHJlLCBtYXAudHJhbnNsYXRpb25zW3RdKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKG1hcClcbiAgICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlc2V0KGVsZW1lbnQsIG1hcCwgeCkge1xuICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XFwndGV4dFxcJ10nKS52YWx1ZSA9ICcnXG4gIGlmIChtYXAuZ3JvdXBzLmxlbmd0aCkgbWFwLnJlbW92ZUdyb3VwcygpXG5cbiAgbWFwLmZpbHRlcnNbeF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgbWFrZUxheWVycyhtYXApXG59XG5cbmZ1bmN0aW9uIGhhbmRsZUNoYW5nZShtYXAsIGVsZW1lbnQsIHdpZGdldHMsIHgsIGNvdW50LCBpbml0aWFsaXplZCkge1xuICB2YXIgb3B0aW9ucyA9IGVsZW1lbnQucXVlcnlTZWxlY3Rvcignc2VsZWN0JylcbiAgICA/IEFycmF5LmZyb20oZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKS5vcHRpb25zKVxuICAgIDogZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVxcJ3RleHRcXCddJylcbiAgICAgID8gQXJyYXkuZnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XFwndGV4dFxcJ10nKSlcbiAgICAgIDogQXJyYXkuZnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0JykpXG4gIHZhciBzZWxlY3Rpb25zID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKVxuICAgID8gQXJyYXkuZnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpLm9wdGlvbnMpXG4gICAgOiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XFwndGV4dFxcJ10nKVxuICAgICAgPyBBcnJheS5mcm9tKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cXCd0ZXh0XFwnXScpKVxuICAgICAgOiBBcnJheS5mcm9tKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6Y2hlY2tlZCcpKVxuICB2YXIgcG9zc2libGVDaGVja3MgPSBBcnJheS5mcm9tKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKSkubWFwKFxuICAgIGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLm5hbWUudG9Mb3dlckNhc2UoKVxuICAgIH1cbiAgKVxuICB2YXIgcG9zc2libGVPcHRpb25zID0gd2lkZ2V0c1t4XS5rZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4ga2V5LnZhbHVlLnRvTG93ZXJDYXNlKClcbiAgfSlcblxuICB2YXIgcG9zc2libGVRdWVyaWVzID0gcG9zc2libGVDaGVja3MuY29uY2F0KHBvc3NpYmxlT3B0aW9ucylcbiAgdmFyIHF1ZXJ5ID0gQXJyYXkuZnJvbShzZWxlY3Rpb25zKS5tYXAoZnVuY3Rpb24obykge1xuICAgIHJldHVybiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XFwnY2hlY2tib3hcXCddJylcbiAgICAgID8gby5uYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIDogby52YWx1ZS50b0xvd2VyQ2FzZSgpXG4gIH0pXG5cbiAgbWFwLmZpbHRlcnNbd2lkZ2V0c1t4XS5pZF0gPVxuICAgIHdpZGdldHNbeF0uaW5wdXQgPT09ICd0b2dnbGUnXG4gICAgICA/IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICAgICAgdmFyIGJvb2wgPSB0cnVlXG5cbiAgICAgICAgaWYgKGZlYXR1cmUucHJvcGVydGllcy50b2dnbGUpIHtcbiAgICAgICAgICBib29sID0gY29udmVydFR5cGUocXVlcnlbMF0pID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYm9vbCA9IHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBib29sXG4gICAgICB9XG4gICAgICA6IHdpZGdldHNbeF0uZmllbGQgPT09ICdhbGwnXG4gICAgICAgID8gZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgICAgICAgIHZhciBib29sID0gdHJ1ZVxuICAgICAgICAgIHZhciB3aXRoRGlhY3JpdGljcyA9IE9iamVjdC52YWx1ZXMoZmVhdHVyZS5wcm9wZXJ0aWVzKVxuICAgICAgICAgICAgLmpvaW4oJycpXG4gICAgICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIHZhciB3aXRob3V0RGlhY3JpdGljcyA9IE9iamVjdC52YWx1ZXMoZmVhdHVyZS5wcm9wZXJ0aWVzKVxuICAgICAgICAgICAgLmpvaW4oJycpXG4gICAgICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgLmxhdGluaXNlKClcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHdpdGhEaWFjcml0aWNzLmluZGV4T2YocXVlcnlbMF0pIDwgMCAmJlxuICAgICAgICAgICAgICB3aXRob3V0RGlhY3JpdGljcy5pbmRleE9mKHF1ZXJ5WzBdKSA8IDBcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJvb2wgPSBmYWxzZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBib29sXG4gICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbihmZWF0dXJlLCBsYXllcnMpIHtcbiAgICAgICAgICB2YXIgYm9vbCA9IHRydWVcbiAgICAgICAgICB2YXIgZmllbGQgPSB3aWRnZXRzW3hdLmdyb3VwaW5nXG4gICAgICAgICAgICA/IHdpZGdldHNbeF0uZ3JvdXBpbmdcbiAgICAgICAgICAgIDogd2lkZ2V0c1t4XS5maWVsZFxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgcG9zc2libGVRdWVyaWVzLmluZGV4T2YoZmVhdHVyZS5wcm9wZXJ0aWVzW2ZpZWxkXS50b0xvd2VyQ2FzZSgpKSA+XG4gICAgICAgICAgICAgICAgLTEgJiZcbiAgICAgICAgICAgICAgcXVlcnkuaW5kZXhPZihmZWF0dXJlLnByb3BlcnRpZXNbZmllbGRdLnRvTG93ZXJDYXNlKCkpIDwgMFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYm9vbCA9IGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGJvb2xcbiAgICAgICAgfVxuXG4gIGlmIChpbml0aWFsaXplZCA+PSBjb3VudCkgbWFwLnJlbW92ZUdyb3VwcygpXG4gIGlmICh3aWRnZXRzLmxlbmd0aCA+PSB4ICsgMSAmJiBpbml0aWFsaXplZCA+PSBjb3VudCkgbWFrZUxheWVycyhtYXApXG59XG4iLCJpbXBvcnQgc3R5bGVLZXkgZnJvbSAnLi9zdHlsZUtleS5qcydcbmltcG9ydCBtYXBXaWRnZXRzVG9TdGF0ZSBmcm9tICcuL21hcFdpZGdldHNUb1N0YXRlLmpzJ1xuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgbWFrZURyb3Bkb3duT3B0aW9ucyB9IGZyb20gJy4vaGVscGVycy5qcydcbmltcG9ydCB7IHBhcnNlTGVnZW5kRGF0YSB9IGZyb20gJy4vcGFyc2Vycy5qcydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZVdpZGdldHMoanNvbnMsIG9wdGlvbnMsIGJveENvbnRlbnQpIHtcbiAgdmFyIHdpZGdldENvbnRlbnQgPSBbXVxuICBvcHRpb25zLndpZGdldHMuZm9yRWFjaChmdW5jdGlvbih3LCB4KSB7XG4gICAgaWYgKCF3Lmhhc093blByb3BlcnR5KCdpZCcpKSB3LmlkID0geFxuICAgIHZhciBsZWdlbmREYXRhID0gdy5yZWZlcmVuY2VcbiAgICAgID8gcGFyc2VMZWdlbmREYXRhKG9wdGlvbnMsIGpzb25zW3hdLmZlZWQuZW50cnksIHcudHlwZSlcbiAgICAgIDogdy5rZXlzXG4gICAgb3B0aW9ucy53aWRnZXRzW3hdLmtleXMgPSBsZWdlbmREYXRhXG4gICAgd2lkZ2V0Q29udGVudC5wdXNoKGZvcm1hdFdpZGdldHMob3B0aW9ucywgeCkpXG4gICAgYm94Q29udGVudCArPVxuICAgICAgJzxzZWN0aW9uIGNsYXNzPVwid2lkZ2V0ICcgK1xuICAgICAgb3B0aW9ucy53aWRnZXRzW3hdLmZpZWxkICtcbiAgICAgICdcIj48aDMgY2xhc3M9XCJ0cmFuc2xhdGVcIj4nICtcbiAgICAgIHdpZGdldENvbnRlbnRbeF0udGl0bGUgK1xuICAgICAgJzwvaDM+J1xuICAgIGJveENvbnRlbnQgKz0gd2lkZ2V0Q29udGVudFt4XS5ub2Rlc1xuICAgIGJveENvbnRlbnQgKz0gJzwvc2VjdGlvbj4nXG4gICAgdmFyIGJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgb3B0aW9ucy5zbHVnICsgJyAjY29udHJvbHMnKVxuICAgIGJveC5pbm5lckhUTUwgPSBib3hDb250ZW50XG4gICAgdmFyIGxhYmVsVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICsgb3B0aW9ucy5zbHVnICsgJyAuaXRlbVRleHQnKVxuICAgIEFycmF5LmZyb20obGFiZWxUZXh0KS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW1UZXh0KSB7XG4gICAgICB2YXIgaGVpZ2h0ID0gaXRlbVRleHQub2Zmc2V0SGVpZ2h0XG4gICAgICB2YXIgZm9udFNpemUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpdGVtVGV4dClbJ2ZvbnQtc2l6ZSddXG4gICAgICB2YXIgb2Zmc2V0ID0gaGVpZ2h0IC8gcGFyc2VJbnQoZm9udFNpemUucmVwbGFjZSgncHgnLCAnJyksIDEwKVxuICAgICAgaXRlbVRleHQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoJyArIG9mZnNldCAqIDEwICsgJyUpJ1xuICAgIH0pXG4gIH0pXG5cbiAgbWFwV2lkZ2V0c1RvU3RhdGUob3B0aW9ucylcbn1cblxuZnVuY3Rpb24gZm9ybWF0V2lkZ2V0cyhvcHRpb25zLCB4KSB7XG4gIHZhciB3aWRnZXROb2RlcyA9ICcnXG4gIHZhciBkcm9wZG93bk9wdGlvbnNcblxuICBzd2l0Y2ggKG9wdGlvbnMud2lkZ2V0c1t4XS5pbnB1dCkge1xuICBjYXNlICd0b2dnbGUnOlxuICAgIHdpZGdldE5vZGVzICs9XG4gICAgICAgICc8bGFiZWwgZm9yPVwidG9nZ2xlXycgK1xuICAgICAgICBvcHRpb25zLndpZGdldHNbeF0uZmllbGQgK1xuICAgICAgICAnXCIgY2xhc3M9XCJ0cmFuc2xhdGVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIicgK1xuICAgICAgICBvcHRpb25zLndpZGdldHNbeF0uZmllbGQgK1xuICAgICAgICAnXCIgaWQ9XCJ0b2dnbGVfJyArXG4gICAgICAgIG9wdGlvbnMud2lkZ2V0c1t4XS5maWVsZCArXG4gICAgICAgICdcIiAgdmFsdWU9XCIxXCIgY2hlY2tlZD5TaG93PC9sYWJlbD4nXG4gICAgd2lkZ2V0Tm9kZXMgKz1cbiAgICAgICAgJzxsYWJlbCBmb3I9XCIkdG9nZ2xlXycgK1xuICAgICAgICBvcHRpb25zLndpZGdldHNbeF0uZmllbGQgK1xuICAgICAgICAnXCIgY2xhc3M9XCJ0cmFuc2xhdGVcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIicgK1xuICAgICAgICBvcHRpb25zLndpZGdldHNbeF0uZmllbGQgK1xuICAgICAgICAnXCIgaWQ9XCJ0b2dnbGVfJyArXG4gICAgICAgIG9wdGlvbnMud2lkZ2V0c1t4XS5maWVsZCArXG4gICAgICAgICdcIiB2YWx1ZT1cIjBcIiA+SGlkZTwvbGFiZWw+J1xuICAgIGJyZWFrXG5cbiAgY2FzZSAnc2VhcmNoJzpcbiAgICB3aWRnZXROb2RlcyArPVxuICAgICAgICAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJzZWFyY2hfJyArXG4gICAgICAgIG9wdGlvbnMud2lkZ2V0c1t4XS5maWVsZCArXG4gICAgICAgICdcIiBwbGFjZWhvbGRlcj1cIicgK1xuICAgICAgICBvcHRpb25zLndpZGdldHNbeF0uaW5zdHJ1Y3Rpb25zICtcbiAgICAgICAgJ1wiIHNpemU9XCIxMFwiIC8+J1xuICAgIHdpZGdldE5vZGVzICs9XG4gICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInJlc2V0QnV0dG9uXCIgY2xhc3M9XCJ0cmFuc2xhdGVcIj5SZXNldDwvYnV0dG9uPidcbiAgICBicmVha1xuXG4gIGNhc2UgJ2Ryb3Bkb3duJzpcbiAgICB3aWRnZXROb2RlcyArPVxuICAgICAgICAnPHNlbGVjdCBpZD1cImRyb3Bkb3duXycgK1xuICAgICAgICBvcHRpb25zLndpZGdldHNbeF0uZmllbGQgK1xuICAgICAgICAnXCIgcGxhY2Vob2xkZXI9XCInICtcbiAgICAgICAgb3B0aW9ucy53aWRnZXRzW3hdLmluc3RydWN0aW9ucyArXG4gICAgICAgICdcIiBtdWx0aXBsZT1cIlwiPjwvc2VsZWN0PidcbiAgICBkcm9wZG93bk9wdGlvbnMgPSBtYWtlRHJvcGRvd25PcHRpb25zKG9wdGlvbnMsIHgpXG4gICAgYnJlYWtcblxuICBjYXNlICdjaGVja2JveCc6XG4gICAgd2lkZ2V0Tm9kZXMgKz0gJzx1bD4nXG4gICAgdmFyIGtleVN0eWxlXG4gICAgdmFyIGxlZ2VuZEl0ZW1zID0gb3B0aW9ucy53aWRnZXRzW3hdLmdyb3VwaW5nXG4gICAgICA/IG9wdGlvbnMud2lkZ2V0c1t4XS5rZXlzLmdyb3VwQnkoJ2dyb3VwJylcbiAgICAgIDogb3B0aW9ucy53aWRnZXRzW3hdLmtleXMuZ3JvdXBCeSgnbGFiZWwnKVxuICAgIE9iamVjdC5rZXlzKGxlZ2VuZEl0ZW1zKS5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwLCBpKSB7XG4gICAgICBzd2l0Y2ggKG9wdGlvbnMud2lkZ2V0c1t4XS50eXBlKSB7XG4gICAgICBjYXNlICdmb3JtJzpcbiAgICAgICAgdmFyIGZvcm1zID0gb3B0aW9ucy53aWRnZXRzW3hdLmtleXMubWFwKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICByZXR1cm4gZi52YWx1ZVxuICAgICAgICB9KVxuICAgICAgICB2YXIgc3R5bGVPcHRpb25zID0ge1xuICAgICAgICAgIGdyb3VwOiBsZWdlbmRJdGVtc1tncm91cF0sXG4gICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgZm9ybXM6IGZvcm1zLFxuICAgICAgICAgIG1hcDogb3B0aW9uc1xuICAgICAgICB9XG4gICAgICAgIGtleVN0eWxlID0gc3R5bGVLZXkoc3R5bGVPcHRpb25zKVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlICdjb2xvcic6XG4gICAgICAgIHZhciBzdHlsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgbWFwOiBvcHRpb25zLFxuICAgICAgICAgIGdyb3VwOiBsZWdlbmRJdGVtc1tncm91cF1cbiAgICAgICAgfVxuICAgICAgICBrZXlTdHlsZSA9IHN0eWxlS2V5KHN0eWxlT3B0aW9ucylcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgd2lkZ2V0Tm9kZXMgKz1cbiAgICAgICAgICAnPGxpPjxsYWJlbCBmb3I9XCInICtcbiAgICAgICAgICBncm91cCArXG4gICAgICAgICAgJ1wiPjxpbnB1dCBjbGFzcz1cIndpZGdldCAnICtcbiAgICAgICAgICBvcHRpb25zLndpZGdldHNbeF0uaW5wdXQgK1xuICAgICAgICAgICdcIiB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiJyArXG4gICAgICAgICAgKG9wdGlvbnMud2lkZ2V0c1t4XS5ncm91cGluZyA/IGdyb3VwIDogbGVnZW5kSXRlbXNbZ3JvdXBdWzBdLnZhbHVlKSArXG4gICAgICAgICAgJ1wiIGlkPVwiJyArXG4gICAgICAgICAgZ3JvdXAgK1xuICAgICAgICAgICdcIiAnICtcbiAgICAgICAgICAobGVnZW5kSXRlbXNbZ3JvdXBdWzBdLnNlbGVjdGVkID8gJ2NoZWNrZWQnIDogJycpICtcbiAgICAgICAgICAnID48c3BhbiBjbGFzcz1cIicgK1xuICAgICAgICAgIGtleVN0eWxlLmNsYXNzICtcbiAgICAgICAgICAnS2V5XCIgJyArXG4gICAgICAgICAgJ3N0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcJycgK1xuICAgICAgICAgIGtleVN0eWxlLnN2ZyArXG4gICAgICAgICAgJ1wiKT48L3NwYW4+PHNwYW4gY2xhc3M9XCJpdGVtVGV4dFwiPicgK1xuICAgICAgICAgIGNhcGl0YWxpemUoZ3JvdXApICtcbiAgICAgICAgICAnPC9zcGFuPjwvbGFiZWw+PC9saT4nXG4gICAgfSlcbiAgICB3aWRnZXROb2RlcyArPSAnPC91bD4nXG4gICAgYnJlYWtcblxuICBkZWZhdWx0OlxuICAgIHdpZGdldE5vZGVzICs9ICc8dWw+J1xuICAgIHZhciBrZXlTdHlsZVxuICAgIHZhciBsZWdlbmRJdGVtcyA9IG9wdGlvbnMud2lkZ2V0c1t4XS5ncm91cGluZ1xuICAgICAgPyBvcHRpb25zLndpZGdldHNbeF0ua2V5cy5ncm91cEJ5KCdncm91cCcpXG4gICAgICA6IG9wdGlvbnMud2lkZ2V0c1t4XS5rZXlzLmdyb3VwQnkoJ2xhYmVsJylcbiAgICBPYmplY3Qua2V5cyhsZWdlbmRJdGVtcykuZm9yRWFjaChmdW5jdGlvbihncm91cCwgaSkge1xuICAgICAgc3dpdGNoIChvcHRpb25zLndpZGdldHNbeF0udHlwZSkge1xuICAgICAgY2FzZSAnZm9ybSc6XG4gICAgICAgIHZhciBmb3JtcyA9IG9wdGlvbnMud2lkZ2V0c1t4XS5rZXlzLm1hcChmdW5jdGlvbihmKSB7XG4gICAgICAgICAgcmV0dXJuIGYudmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgdmFyIHN0eWxlT3B0aW9ucyA9IHtcbiAgICAgICAgICBncm91cDogbGVnZW5kSXRlbXNbZ3JvdXBdLFxuICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgIGZvcm1zOiBmb3JtcyxcbiAgICAgICAgICBtYXA6IG9wdGlvbnNcbiAgICAgICAgfVxuICAgICAgICBrZXlTdHlsZSA9IHN0eWxlS2V5KHN0eWxlT3B0aW9ucylcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAnY29sb3InOlxuICAgICAgICB2YXIgc3R5bGVPcHRpb25zID0ge1xuICAgICAgICAgIG1hcDogb3B0aW9ucyxcbiAgICAgICAgICBncm91cDogbGVnZW5kSXRlbXNbZ3JvdXBdXG4gICAgICAgIH1cbiAgICAgICAga2V5U3R5bGUgPSBzdHlsZUtleShzdHlsZU9wdGlvbnMpXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIHdpZGdldE5vZGVzICs9XG4gICAgICAgICAgJzxsaT48c3BhbiBjbGFzcz1cIicgK1xuICAgICAgICAgIGtleVN0eWxlLmNsYXNzICtcbiAgICAgICAgICAnS2V5XCIgJyArXG4gICAgICAgICAgJ3N0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcJycgK1xuICAgICAgICAgIGtleVN0eWxlLnN2ZyArXG4gICAgICAgICAgJ1wiKT48L3NwYW4+PHNwYW4gY2xhc3M9XCJpdGVtVGV4dFwiPicgK1xuICAgICAgICAgIGNhcGl0YWxpemUoZ3JvdXApICtcbiAgICAgICAgICAnPC9zcGFuPjwvbGk+J1xuICAgIH0pXG4gICAgd2lkZ2V0Tm9kZXMgKz0gJzwvdWw+J1xuICAgIGJyZWFrXG4gIH1cblxuICB2YXIgd2lkZ2V0VGl0bGUgPVxuICAgIG9wdGlvbnMud2lkZ2V0c1t4XS5maWVsZCA9PT0gJ2FsbCdcbiAgICAgID8gJ1NlYXJjaCdcbiAgICAgIDogb3B0aW9ucy53aWRnZXRzW3hdLmZpZWxkLnJlcGxhY2UoL18vZywgJyAnKVxuICByZXR1cm4ge1xuICAgIG5vZGVzOiB3aWRnZXROb2RlcyxcbiAgICB0aXRsZTogd2lkZ2V0VGl0bGUsXG4gICAgb3B0aW9uczogZHJvcGRvd25PcHRpb25zXG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VEb2N1bWVudE5vZGVzKG9wdGlvbnMpIHtcbiAgdmFyIG5ld1NlY3Rpb25IVE1MID0gJydcbiAgbmV3U2VjdGlvbkhUTUwgKz0gJzxzZWN0aW9uIGlkPVwiJyArIG9wdGlvbnMuc2x1ZyArICdcIj4nXG4gIG5ld1NlY3Rpb25IVE1MICs9ICc8ZGl2IGlkPVwiJyArIG9wdGlvbnMuc2x1ZyArICdfX21hcFwiIGNsYXNzPVwibWFwXCI+PC9kaXY+J1xuICBuZXdTZWN0aW9uSFRNTCArPSAnPGFzaWRlIGNsYXNzPVwidG9vbGJveFwiPidcbiAgbmV3U2VjdGlvbkhUTUwgKz0gb3B0aW9ucy50aXRsZVxuICAgID8gJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkIGNsYXNzPVwidWkgbW9iaWxlLW9ubHlcIj48ZGl2IGNsYXNzPVwiaGFtYnVyZ2VyIG1vYmlsZS1vbmx5XCI+PGRpdiBjbGFzcz1cImljb25cIj4gPHNwYW4+PC9zcGFuPiA8c3Bhbj48L3NwYW4+IDxzcGFuPjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPVwibWVudSB0cmFuc2xhdGVcIj48L2Rpdj48L2Rpdj4nXG4gICAgOiAnJ1xuICBuZXdTZWN0aW9uSFRNTCArPSAnPGRpdiBjbGFzcz1cImJveFwiPidcbiAgbmV3U2VjdGlvbkhUTUwgKz1cbiAgICBvcHRpb25zLnRpdGxlIHx8IG9wdGlvbnMubG9nbyB8fCBvcHRpb25zLmRlc2NyaXB0aW9uXG4gICAgICA/ICc8aGVhZGVyICBjbGFzcz1cInRyYW5zbGF0ZVwiPiA8aDE+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaWQ9XCJsb2dvXCI+PC9hPjwvaDE+ICA8cCBjbGFzcz1cInRyYW5zbGF0ZVwiPjwvcD48L2hlYWRlcj4nXG4gICAgICA6ICcnXG4gIG5ld1NlY3Rpb25IVE1MICs9XG4gICAgKG9wdGlvbnMuaW5zdHJ1Y3Rpb25zXG4gICAgICA/ICc8cCBjbGFzcz1cInRyYW5zbGF0ZVwiPicgKyBvcHRpb25zLmluc3RydWN0aW9ucyArICc8L3A+J1xuICAgICAgOiAnJykgK1xuICAgICc8ZGl2IGlkPVwiY29udHJvbHNcIj48ZGl2IGNsYXNzPVwibG9hZGVyXCI+PC9kaXY+PC9kaXY+PGZvb3Rlcj48ZGl2IGNsYXNzPVwiaGlkZGVuXCI+PC9kaXY+PC9mb290ZXI+PC9kaXY+PC9hc2lkZT4nXG4gIG5ld1NlY3Rpb25IVE1MICs9IG9wdGlvbnMudGl0bGVjYXJkY29udGVudFxuICAgID8gJzxidXR0b24gaWQ9XCInICtcbiAgICAgIG9wdGlvbnMuc2x1ZyArXG4gICAgICAnX19hYm91dFwiIGNsYXNzPVwiYWJvdXQtdHJpZ2dlclwiPkFCT1VUIFRISVMgTUFQPC9idXR0b24+J1xuICAgIDogJydcbiAgbmV3U2VjdGlvbkhUTUwgKz0gJzwvc2VjdGlvbj4nXG4gIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MICs9IG5ld1NlY3Rpb25IVE1MXG5cbiAgaWYgKG9wdGlvbnMudGl0bGVjYXJkY29udGVudCkge1xuICAgIHZhciBuZXdEaWFsb2dIVE1MID0gJydcbiAgICBuZXdEaWFsb2dIVE1MICs9ICc8ZGl2IGNsYXNzPVwiZGlhbG9nXCIgaWQ9XCInICsgb3B0aW9ucy5zbHVnICsgJ19fZGlhbG9nXCI+J1xuICAgIG5ld0RpYWxvZ0hUTUwgKz1cbiAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLW92ZXJsYXlcIiB0YWJpbmRleD1cIi0xXCIgZGF0YS1hMTF5LWRpYWxvZy1oaWRlPjwvZGl2PidcbiAgICBuZXdEaWFsb2dIVE1MICs9XG4gICAgICAnPGRpYWxvZyBjbGFzcz1cImRpYWxvZy1jb250ZW50XCIgYXJpYS1sYWJlbGxlZGJ5PVwiZGlhbG9nVGl0bGVcIiBhcmlhLWRlc2NyaWJlZGJ5PVwiZGlhbG9nQ29udGVudFwiPidcbiAgICBuZXdEaWFsb2dIVE1MICs9XG4gICAgICAnPGJ1dHRvbiBkYXRhLWExMXktZGlhbG9nLWhpZGUgY2xhc3M9XCJkaWFsb2ctY2xvc2VcIiBhcmlhLWxhYmVsPVwiQ2xvc2UgdGhpcyBkaWFsb2cgd2luZG93XCI+JnRpbWVzOzwvYnV0dG9uPidcbiAgICBuZXdEaWFsb2dIVE1MICs9IG9wdGlvbnMudGl0bGVjYXJkdGl0bGVcbiAgICAgID8gJzxoMSBpZD1cImRpYWxvZ1RpdGxlXCI+JyArIG9wdGlvbnMudGl0bGVjYXJkdGl0bGUgKyAnPC9oMT4nXG4gICAgICA6ICcnXG4gICAgbmV3RGlhbG9nSFRNTCArPVxuICAgICAgJzxkaXYgaWQ9XCJkaWFsb2dDb250ZW50XCI+JyArIG9wdGlvbnMudGl0bGVjYXJkY29udGVudCArICc8L2Rpdj4nXG4gICAgbmV3RGlhbG9nSFRNTCArPSAnPC9kaWFsb2c+J1xuICAgIG5ld0RpYWxvZ0hUTUwgKz0gJzwvZGl2PidcbiAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCArPSBuZXdEaWFsb2dIVE1MXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgdmFyIGRpYWxvZ0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3B0aW9ucy5zbHVnICsgJ19fZGlhbG9nJylcbiAgICB2YXIgbWFpbkVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29wdGlvbnMuc2x1ZycpXG4gICAgdmFyIGRpYWxvZ1RyaWdnZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRpb25zLnNsdWcgKyAnX19hYm91dCcpXG5cbiAgICB2YXIgZGlhbG9nQm94ID0gbmV3IEExMXlEaWFsb2coZGlhbG9nRWwsIG1haW5FbClcbiAgICB2YXIgZGlhbG9nID0gZGlhbG9nQm94LmRpYWxvZ1xuICAgIGRpYWxvZ0JveC5zaG93KClcbiAgICBkaWFsb2dCb3gub24oJ2hpZGUnLCBmdW5jdGlvbihkaWFsb2dFbCkge1xuICAgICAgZGlhbG9nVHJpZ2dlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIH0pXG4gICAgZGlhbG9nQm94Lm9uKCdzaG93JywgZnVuY3Rpb24oZGlhbG9nRWwpIHtcbiAgICAgIGRpYWxvZ1RyaWdnZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH0pXG4gICAgZGlhbG9nVHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgZGlhbG9nQm94LnNob3coKVxuICAgIH0pXG4gIH1cblxuICBkb2N1bWVudC50aXRsZSA9IG9wdGlvbnMudGl0bGUgKyAnIHwgQ1NJUyAnICsgb3B0aW9ucy5wcm9ncmFtXG4gIHZhciBtZXRhTG9jYWxlT0cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJylcbiAgbWV0YUxvY2FsZU9HLnNldEF0dHJpYnV0ZSgncHJvcGVydHknLCAnb2c6bG9jYWxlJylcbiAgbWV0YUxvY2FsZU9HLnNldEF0dHJpYnV0ZSgnY29udGVudCcsICdlbl9VUycpXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobWV0YUxvY2FsZU9HKVxuICB2YXIgbWV0YVR5cGVPRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21ldGEnKVxuICBtZXRhVHlwZU9HLnNldEF0dHJpYnV0ZSgncHJvcGVydHknLCAnb2c6dHlwZScpXG4gIG1ldGFUeXBlT0cuc2V0QXR0cmlidXRlKCdjb250ZW50JywgJ2FydGljbGUnKVxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGFUeXBlT0cpXG4gIHZhciBtZXRhV2lkdGhPRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21ldGEnKVxuICBtZXRhV2lkdGhPRy5zZXRBdHRyaWJ1dGUoJ3Byb3BlcnR5JywgJ29nOmltYWdlOndpZHRoJylcbiAgbWV0YVdpZHRoT0cuc2V0QXR0cmlidXRlKCdjb250ZW50JywgJzIwMDAnKVxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGFXaWR0aE9HKVxuICB2YXIgbWV0YUhlaWdodE9HID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWV0YScpXG4gIG1ldGFIZWlnaHRPRy5zZXRBdHRyaWJ1dGUoJ3Byb3BlcnR5JywgJ29nOmltYWdlOmhlaWdodCcpXG4gIG1ldGFIZWlnaHRPRy5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCAnMTMzMycpXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobWV0YUhlaWdodE9HKVxuICB2YXIgbWV0YVR3aXR0ZXJDYXJkT0cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJylcbiAgbWV0YVR3aXR0ZXJDYXJkT0cuc2V0QXR0cmlidXRlKCdwcm9wZXJ0eScsICd0d2l0dGVyOmNhcmQnKVxuICBtZXRhVHdpdHRlckNhcmRPRy5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCAnc3VtbWFyeScpXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobWV0YVR3aXR0ZXJDYXJkT0cpXG4gIHZhciBtZXRhVGl0bGVPRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21ldGEnKVxuICBtZXRhVGl0bGVPRy5zZXRBdHRyaWJ1dGUoJ3Byb3BlcnR5JywgJ29nOnRpdGxlJylcbiAgbWV0YVRpdGxlT0cuc2V0QXR0cmlidXRlKFxuICAgICdjb250ZW50JyxcbiAgICBvcHRpb25zLnRpdGxlICsgJyB8IENTSVMgJyArIG9wdGlvbnMucHJvZ3JhbVxuICApXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobWV0YVRpdGxlT0cpXG4gIHZhciBtZXRhVGl0bGVUd2l0dGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWV0YScpXG4gIG1ldGFUaXRsZVR3aXR0ZXIuc2V0QXR0cmlidXRlKCdwcm9wZXJ0eScsICd0d2l0dGVyOnRpdGxlJylcbiAgbWV0YVRpdGxlVHdpdHRlci5zZXRBdHRyaWJ1dGUoXG4gICAgJ2NvbnRlbnQnLFxuICAgIG9wdGlvbnMudGl0bGUgKyAnIHwgQ1NJUyAnICsgb3B0aW9ucy5wcm9ncmFtXG4gIClcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChtZXRhVGl0bGVUd2l0dGVyKVxuICB2YXIgbWV0YURlc2NyaXB0aW9uT0cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJylcbiAgbWV0YURlc2NyaXB0aW9uT0cuc2V0QXR0cmlidXRlKCdwcm9wZXJ0eScsICdvZzpkZXNjcmlwdGlvbicpXG4gIG1ldGFEZXNjcmlwdGlvbk9HLnNldEF0dHJpYnV0ZSgnY29udGVudCcsIG9wdGlvbnMuZGVzY3JpcHRpb24pXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobWV0YURlc2NyaXB0aW9uT0cpXG4gIHZhciBtZXRhRGVzY3JpcHRpb25Ud2l0dGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWV0YScpXG4gIG1ldGFEZXNjcmlwdGlvblR3aXR0ZXIuc2V0QXR0cmlidXRlKCdwcm9wZXJ0eScsICd0d2l0dGVyOmRlc2NyaXB0aW9uJylcbiAgbWV0YURlc2NyaXB0aW9uVHdpdHRlci5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCBvcHRpb25zLmRlc2NyaXB0aW9uKVxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGFEZXNjcmlwdGlvblR3aXR0ZXIpXG4gIHZhciBtZXRhSW1hZ2VPRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21ldGEnKVxuICBtZXRhSW1hZ2VPRy5zZXRBdHRyaWJ1dGUoJ3Byb3BlcnR5JywgJ29nOmltYWdlJylcbiAgbWV0YUltYWdlT0cuc2V0QXR0cmlidXRlKCdjb250ZW50Jywgb3B0aW9ucy5zY3JlZW5zaG90KVxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGFJbWFnZU9HKVxuICB2YXIgbWV0YUltYWdlVHdpdHRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21ldGEnKVxuICBtZXRhSW1hZ2VUd2l0dGVyLnNldEF0dHJpYnV0ZSgncHJvcGVydHknLCAndHdpdHRlcjppbWFnZScpXG4gIG1ldGFJbWFnZVR3aXR0ZXIuc2V0QXR0cmlidXRlKCdjb250ZW50Jywgb3B0aW9ucy5zY3JlZW5zaG90KVxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGFJbWFnZVR3aXR0ZXIpXG5cbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgb3B0aW9ucy5zbHVnICsgJyBoZWFkZXInKSkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgb3B0aW9ucy5zbHVnICsgJyAubWVudScpLmlubmVyVGV4dCA9XG4gICAgICBvcHRpb25zLnRpdGxlXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBvcHRpb25zLnNsdWcgKyAnIGhlYWRlciBoMScpLmlubmVySFRNTCArPVxuICAgICAgb3B0aW9ucy50aXRsZVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAnIycgKyBvcHRpb25zLnNsdWcgKyAnIGhlYWRlciBhJ1xuICAgICkuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gb3B0aW9ucy5sb2dvID8gJ3VybCgnICsgb3B0aW9ucy5sb2dvICsgJyknIDogJydcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgJyMnICsgb3B0aW9ucy5zbHVnICsgJyBoZWFkZXIgYSdcbiAgICApLmhyZWYgPSBvcHRpb25zLndlYnNpdGUgPyBvcHRpb25zLndlYnNpdGUgOiAnJ1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAnIycgKyBvcHRpb25zLnNsdWcgKyAnIGhlYWRlciBwJ1xuICAgICkuaW5uZXJUZXh0ID0gb3B0aW9ucy5kZXNjcmlwdGlvbiA/IG9wdGlvbnMuZGVzY3JpcHRpb24gOiAnJ1xuICB9XG59XG4iLCJpbXBvcnQgeyBwYXJzZU1ldGFEYXRhLCBwYXJzZVdpZGdldERhdGEgfSBmcm9tICcuL3BhcnNlcnMuanMnXG5pbXBvcnQgbWFrZVdpZGdldHMgZnJvbSAnLi9tYWtlV2lkZ2V0cy5qcydcbmltcG9ydCBtYWtlRG9jdW1lbnROb2RlcyBmcm9tICcuL21ha2VEb2N1bWVudE5vZGVzLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBpbml0V2l0aFNwcmVhZHNoZWV0KFxuICBkYXRhVVJMLFxuICBvcHRpb25zLFxuICB0cmFuc2xhdGlvbnNcbikge1xuICB2YXIgbWFwXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZXR1cm4gZmV0Y2goXG4gICAgICBkYXRhVVJMICsgb3B0aW9ucy5nb29nbGVTaGVldCArICcvJyArIDIgKyAnL3B1YmxpYy92YWx1ZXM/YWx0PWpzb24nXG4gICAgKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgdmFyIG1ldGFEYXRhID0gcGFyc2VNZXRhRGF0YShqc29uLmZlZWQuZW50cnkpXG4gICAgICAgIHZhciB3aWRnZXRzID0gcGFyc2VXaWRnZXREYXRhKG1ldGFEYXRhKVxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHt9XG4gICAgICAgIE9iamVjdC5rZXlzKG1ldGFEYXRhKS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzW2RhdGFdID0gbWV0YURhdGFbZGF0YV1cbiAgICAgICAgfSlcbiAgICAgICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgcHJvcGVydGllc1tkYXRhXSA9IG9wdGlvbnNbZGF0YV1cbiAgICAgICAgfSlcblxuICAgICAgICB2YXIgdHdvRF9wcm9wZXJpdGVzID0gW1xuICAgICAgICAgIHsgbmFtZTogJ2NlbnRlcicsIGRlZmF1bHQ6IFswLCAwXSB9LFxuICAgICAgICAgIHsgbmFtZTogJ2ljb25zaXplJywgZGVmYXVsdDogWzIwLCAyMF0gfSxcbiAgICAgICAgICB7IG5hbWU6ICdpY29uYW5jaG9yJywgZGVmYXVsdDogWzUsIDVdIH0sXG4gICAgICAgICAgeyBuYW1lOiAnc3dib3VuZHMnLCBkZWZhdWx0OiBbLTkwLCAtMTgwXSB9LFxuICAgICAgICAgIHsgbmFtZTogJ25lYm91bmRzJywgZGVmYXVsdDogWzkwLCAxODBdIH1cbiAgICAgICAgXVxuXG4gICAgICAgIHR3b0RfcHJvcGVyaXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eS5uYW1lXSA9XG4gICAgICAgICAgICB0eXBlb2YgcHJvcGVydGllc1twcm9wZXJ0eS5uYW1lXSA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgPyBwcm9wZXJ0aWVzW3Byb3BlcnR5Lm5hbWVdLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodiwgMTApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIDogcHJvcGVydGllc1twcm9wZXJ0eS5uYW1lXVxuICAgICAgICAgICAgICAgID8gcHJvcGVydGllc1twcm9wZXJ0eS5uYW1lXVxuICAgICAgICAgICAgICAgIDogcHJvcGVydHkuZGVmYXVsdFxuICAgICAgICB9KVxuICAgICAgICBwcm9wZXJ0aWVzLnNsdWcgPSBwcm9wZXJ0aWVzLm1hcElELnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnLScpXG4gICAgICAgIHByb3BlcnRpZXMudHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zXG4gICAgICAgIHByb3BlcnRpZXMud2lkZ2V0cyA9IHdpZGdldHNcbiAgICAgICAgbWFrZURvY3VtZW50Tm9kZXMocHJvcGVydGllcylcbiAgICAgICAgdmFyIHJlZmVyZW5jZVNoZWV0cyA9IHdpZGdldHMuZmlsdGVyKGZ1bmN0aW9uKHcpIHtcbiAgICAgICAgICByZXR1cm4gdy5yZWZlcmVuY2VcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAocmVmZXJlbmNlU2hlZXRzKSB7XG4gICAgICAgICAgdmFyIGJveENvbnRlbnQgPSAnJ1xuICAgICAgICAgIHZhciByZWZlcmVuY2VTaGVldFVSTFMgPSB3aWRnZXRzXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKHcpIHtcbiAgICAgICAgICAgICAgaWYgKHcucmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIGRhdGFVUkwgK1xuICAgICAgICAgICAgICAgICAgb3B0aW9ucy5nb29nbGVTaGVldCArXG4gICAgICAgICAgICAgICAgICAnLycgK1xuICAgICAgICAgICAgICAgICAgdy5yZWZlcmVuY2UgK1xuICAgICAgICAgICAgICAgICAgJy9wdWJsaWMvdmFsdWVzP2FsdD1qc29uJ1xuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24odSkge1xuICAgICAgICAgICAgICByZXR1cm4gdVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHJlZmVyZW5jZVNoZWV0VVJMUy5tYXAoZnVuY3Rpb24odXJsKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmZXRjaCh1cmwpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlcykge1xuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VzLm1hcChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihhc3luYyBmdW5jdGlvbihqc29ucykge1xuICAgICAgICAgICAgICBtYXAgPSBhd2FpdCBtYWtlV2lkZ2V0cyhqc29ucywgcHJvcGVydGllcywgYm94Q29udGVudClcblxuICAgICAgICAgICAgICBpZiAocHJvcGVydGllcy5mb290ZXIgJiYgcHJvcGVydGllcy5mb290ZXIudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZvb3Rlck5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb290ZXInKVxuICAgICAgICAgICAgICAgIGZvb3Rlck5vZGUuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZm9vdGVyICsgJyAgPGRpdiBjbGFzcz1cImhpZGRlblwiPjwvZGl2PidcbiAgICAgICAgICAgICAgICB2YXIgcGVuVWx0aW1hdGVOb2RlID1cbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgICAgICAgICcjJyArIHByb3BlcnRpZXMuc2x1ZyArICcgI2NvbnRyb2xzJ1xuICAgICAgICAgICAgICAgICAgKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHByb3BlcnRpZXMuc2x1ZyArICdoZWFkZXInKVxuICAgICAgICAgICAgICAgIHBlblVsdGltYXRlTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgIGZvb3Rlck5vZGUsXG4gICAgICAgICAgICAgICAgICBwZW5VbHRpbWF0ZU5vZGUubmV4dFNpYmxpbmdcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXNvbHZlKG1hcClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG1hcCA9IG5ldyBDdXN0b21NYXAoY29udGFpbmVyLCBvcHRpb25zKS5yZW5kZXIoKVxuICAgICAgICAgIG1ha2VMYXllcnMobWFwKVxuICAgICAgICAgIHZhciBib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIG9wdGlvbnMuc2x1ZyArICcgI2NvbnRyb2xzJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmZvb3RlciAmJiBwcm9wZXJ0aWVzLmZvb3Rlci50cmltKCkpIHtcbiAgICAgICAgICB2YXIgZm9vdGVyTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvb3RlcicpXG4gICAgICAgICAgZm9vdGVyTm9kZS5pbm5lckhUTUwgPVxuICAgICAgICAgICAgcHJvcGVydGllcy5mb290ZXIgKyAnICA8ZGl2IGNsYXNzPVwiaGlkZGVuXCI+PC9kaXY+J1xuICAgICAgICAgIHZhciBwZW5VbHRpbWF0ZU5vZGUgPVxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBwcm9wZXJ0aWVzLnNsdWcgKyAnICNjb250cm9scycpIHx8XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHByb3BlcnRpZXMuc2x1ZyArICdoZWFkZXInKVxuICAgICAgICAgIHBlblVsdGltYXRlTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgIGZvb3Rlck5vZGUsXG4gICAgICAgICAgICBwZW5VbHRpbWF0ZU5vZGUubmV4dFNpYmxpbmdcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH0pXG59XG4iLCJpbXBvcnQgeyBjb252ZXJ0VHlwZSwgY3JlYXRlQ29sb3JTY2FsZSB9IGZyb20gJy4vaGVscGVycy5qcydcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTGFuZ3VhZ2VEYXRhKGRhdGEpIHtcbiAgdmFyIGxhbmd1YWdlRGF0YSA9IHt9XG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbihyb3cpIHtcbiAgICB2YXIga2V5XG4gICAgT2JqZWN0LmtleXMocm93KS5mb3JFYWNoKGZ1bmN0aW9uKGNvbHVtbiwgaSkge1xuICAgICAgaWYgKGNvbHVtbi5pbmRleE9mKCdnc3gkJykgPiAtMSkge1xuICAgICAgICB2YXIgY29sdW1uTmFtZSA9IGNvbHVtbi5yZXBsYWNlKCdnc3gkJywgJycpXG5cbiAgICAgICAgaWYgKGNvbHVtbk5hbWUgPT09ICdlbicpIHtcbiAgICAgICAgICBrZXkgPSByb3dbY29sdW1uXVsnJHQnXVxuICAgICAgICAgIGxhbmd1YWdlRGF0YVtrZXldID0ge31cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2x1bW5OYW1lID09PSBsYW5nKSB7XG4gICAgICAgICAgbGFuZ3VhZ2VEYXRhW2tleV0gPSByb3dbY29sdW1uXVsnJHQnXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfSlcbiAgcmV0dXJuIGxhbmd1YWdlRGF0YVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VMZWdlbmREYXRhKG9wdGlvbnMsIGpzb24sIHN0eWxlKSB7XG4gIHZhciBjb2xvclNjYWxlID0gY3JlYXRlQ29sb3JTY2FsZShqc29uLmxlbmd0aClcbiAgdmFyIGxlZ2VuZEl0ZW1zID0gW11cbiAganNvbi5mb3JFYWNoKGZ1bmN0aW9uKHJvdywgeCkge1xuICAgIHZhciBkYXRhID0ge31cbiAgICBPYmplY3Qua2V5cyhyb3cpLmZvckVhY2goZnVuY3Rpb24oY29sdW1uLCB5KSB7XG4gICAgICBpZiAoY29sdW1uLmluZGV4T2YoJ2dzeCQnKSA+IC0xKSB7XG4gICAgICAgIHZhciBjb2x1bW5OYW1lID0gY29sdW1uLnJlcGxhY2UoJ2dzeCQnLCAnJylcblxuICAgICAgICBpZiAoY29sdW1uTmFtZSA9PT0gJ2xhYmVsJykge1xuICAgICAgICAgIHZhciBrZXkgPSByb3dbY29sdW1uXVsnJHQnXS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgZGF0YS5rZXkgPSBrZXlcbiAgICAgICAgICBkYXRhLmxhYmVsID0gcm93W09iamVjdC5rZXlzKHJvdylbeSArIDBdXVsnJHQnXVxuICAgICAgICAgIGRhdGEudmFsdWUgPSByb3dbT2JqZWN0LmtleXMocm93KVt5ICsgMV1dWyckdCddXG4gICAgICAgICAgZGF0YS5ncm91cCA9IGNvbnZlcnRUeXBlKHJvd1tPYmplY3Qua2V5cyhyb3cpW3kgKyAyXV1bJyR0J10pXG4gICAgICAgICAgZGF0YS5zZWxlY3RlZCA9IGNvbnZlcnRUeXBlKHJvd1tPYmplY3Qua2V5cyhyb3cpW3kgKyAzXV1bJyR0J10pXG4gICAgICAgICAgdmFyIGNvbG9yVmFsID0gcm93W09iamVjdC5rZXlzKHJvdylbeSArIDRdXVsnJHQnXVxuICAgICAgICAgIGRhdGEuZm9ybSA9IHJvd1tPYmplY3Qua2V5cyhyb3cpW3kgKyA1XV1bJyR0J11cbiAgICAgICAgICBkYXRhLmNvbG9yID0gY29sb3JWYWxcbiAgICAgICAgICAgID8gY29sb3JWYWxcbiAgICAgICAgICAgIDogZGF0YS5mb3JtID09PSAnbGluZSdcbiAgICAgICAgICAgICAgPyBkZWZhdWx0Q29sb3JcbiAgICAgICAgICAgICAgOiBjb2xvclNjYWxlW3hdXG4gICAgICAgICAgZGF0YS5pY29uID0gcm93W09iamVjdC5rZXlzKHJvdylbeSArIDZdXVsnJHQnXVxuICAgICAgICAgIGRhdGEucGF0dGVybiA9IHJvd1tPYmplY3Qua2V5cyhyb3cpW3kgKyA3XV1bJyR0J10uc3BsaXQoJywnKVxuXG4gICAgICAgICAgaWYgKG9wdGlvbnMudHJhbnNsYXRpb25zKSB7XG4gICAgICAgICAgICBkYXRhLmxhYmVsID0gb3B0aW9ucy50cmFuc2xhdGlvbnNbZGF0YS5sYWJlbF1cbiAgICAgICAgICAgIGRhdGEuZ3JvdXAgPSBvcHRpb25zLnRyYW5zbGF0aW9uc1tkYXRhLmdyb3VwXVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGxlZ2VuZEl0ZW1zLnB1c2goZGF0YSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG4gIHJldHVybiBsZWdlbmRJdGVtc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNZXRhRGF0YShqc29uKSB7XG4gIHZhciBkYXRhID0ge31cbiAganNvbi5mb3JFYWNoKGZ1bmN0aW9uKHJvdywgeCkge1xuICAgIE9iamVjdC5rZXlzKHJvdykuZm9yRWFjaChmdW5jdGlvbihjb2x1bW4sIHkpIHtcbiAgICAgIGlmIChjb2x1bW4uaW5kZXhPZignZ3N4JCcpID4gLTEpIHtcbiAgICAgICAgdmFyIGNvbHVtbk5hbWUgPSBjb2x1bW4ucmVwbGFjZSgnZ3N4JCcsICcnKVxuXG4gICAgICAgIGlmIChjb2x1bW5OYW1lID09PSAncHJvcGVydHknKSB7XG4gICAgICAgICAgdmFyIGtleSA9IHJvd1tjb2x1bW5dWyckdCddLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnJylcbiAgICAgICAgICBkYXRhW2tleV0gPSBkYXRhW2tleV0gfHwge31cbiAgICAgICAgICBkYXRhW2tleV0gPSBjb252ZXJ0VHlwZShyb3dbT2JqZWN0LmtleXMocm93KVt5ICsgMV1dWyckdCddKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfSlcbiAgcmV0dXJuIGRhdGFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlV2lkZ2V0RGF0YShtZXRhRGF0YSkge1xuICB2YXIgd2lkZ2V0cyA9IFtdXG5cbiAgZnVuY3Rpb24gcHJvY2VzcyhrLCBpbmRleCwgcHJvcGVydHkpIHtcbiAgICBpZiAoay50b0xvd2VyQ2FzZSgpLmluZGV4T2YocHJvcGVydHkpID4gLTEpXG4gICAgICB3aWRnZXRzW2luZGV4IC0gMV1bcHJvcGVydHldID0gY29udmVydFR5cGUobWV0YURhdGFba10pXG4gIH1cblxuICB2YXIgcHJvcGVydGllcyA9IFtcbiAgICAnaW5wdXQnLFxuICAgICdmaWVsZCcsXG4gICAgJ2dyb3VwaW5nJyxcbiAgICAnaW5zdHJ1Y3Rpb25zJyxcbiAgICAnbWF4aW11bScsXG4gICAgJ3R5cGUnLFxuICAgICdyZWZlcmVuY2UnLFxuICAgICdzdHlsZSdcbiAgXVxuICBPYmplY3Qua2V5cyhtZXRhRGF0YSlcbiAgICAuZmlsdGVyKGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiBrLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignd2lkZ2V0JykgPiAtMVxuICAgIH0pXG4gICAgLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGluZGV4ID0gay5tYXRjaCgvXFxkKy8pWzBdXG4gICAgICB3aWRnZXRzW2luZGV4IC0gMV0gPSB3aWRnZXRzW2luZGV4IC0gMV0gfHwge31cbiAgICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICBwcm9jZXNzKGssIGluZGV4LCBwcm9wZXJ0eSlcbiAgICAgIH0pXG4gICAgfSlcbiAgd2lkZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uKHcsIGkpIHtcbiAgICB3LmZpZWxkID0gdy5maWVsZC5yZXBsYWNlKC8gL2csICdfJylcbiAgICB3LmlkID0gaVxuICB9KVxuICByZXR1cm4gd2lkZ2V0c1xufVxuIiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9taW5pLWNzcy1leHRyYWN0LXBsdWdpbi9kaXN0L2xvYWRlci5qcyEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS01LTIhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL3NyYy9pbmRleC5qcz8/cG9zdGNzcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS01LTQhLi9tYWluLnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9taW5pLWNzcy1leHRyYWN0LXBsdWdpbi9kaXN0L2xvYWRlci5qcyEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS01LTIhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL3NyYy9pbmRleC5qcz8/cG9zdGNzcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS01LTQhLi9tYWluLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4vZGlzdC9sb2FkZXIuanMhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tNS0yIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9zcmMvaW5kZXguanM/P3Bvc3Rjc3MhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNS00IS4vbWFpbi5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sInNvdXJjZVJvb3QiOiIifQ==