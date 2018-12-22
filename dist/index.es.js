import React from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var mapArrayToObject = (function (array, mapValue) {
    return array.reduce(function (newObject, value) {
        newObject[value] = mapValue(value);
        return newObject;
    }, {});
});

var mapObject = (function (object, callback) {
    return Object.keys(object).reduce(function (newObject, key) {
        newObject[key] = callback(key, object[key]);
        return newObject;
    }, {});
});

var component = (function (_a) {
    var name = _a.name, _b = _a.events, events = _b === void 0 ? [] : _b, _c = _a.handlers, handlers = _c === void 0 ? {} : _c, _render_ = _a.render;
    var _d;
    return _d = /** @class */ (function (_super) {
            __extends(Component, _super);
            function Component(props) {
                var _this = _super.call(this, props) || this;
                _this.adapters = props.__adapters__;
                var eventCallbacks = mapArrayToObject(events, function (eventName) {
                    return props[eventName] || (function () { return console.warn("Prop '" + eventName + "' not defined"); });
                });
                _this.eventHandlers = mapObject(handlers, function (_name, handler) {
                    return typeof (handler) === 'string'
                        ? function () { return eventCallbacks[handler](); }
                        : function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return handler.apply(void 0, [eventCallbacks].concat(args));
                        };
                });
                return _this;
            }
            Component.prototype.render = function () {
                return _render_(this.props, this.eventHandlers, this.adapters);
            };
            return Component;
        }(React.PureComponent)),
        _d.displayName = name,
        _d;
});

var buildEventHandlers = function (events, dispatch, props, scope) {
    if (!events)
        return null;
    var eventHandlers = typeof (events) === 'function'
        ? events(dispatch, props, scope)
        : events;
    return mapObject(eventHandlers, function (name, handler) {
        return typeof (handler) === 'string'
            ? function (payload) { return dispatch(handler, payload); }
            : handler;
    });
};
var buildAdapter = (function (name, _a, Component, app) {
    var addToScope = _a.addToScope, propsFromDb = _a.propsFromDb, events = _a.events;
    var Adapter = /** @class */ (function (_super) {
        __extends(Adapter, _super);
        function Adapter() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            _this.dbView = null;
            _this.state = { snapshotID: null };
            _this.scope = Object.assign({}, _this.context && _this.context.treehouseScope, addToScope && addToScope(_this.props));
            if (propsFromDb) {
                _this.dbView = app.dbView(propsFromDb, _this.props, _this.scope);
                _this.dbView.watch(function () {
                    var snapshotID = app.dbSnapshotID();
                    if (_this.state.snapshotID !== snapshotID) {
                        _this.setState({ snapshotID: snapshotID });
                    }
                });
            }
            _this.eventHandlers = buildEventHandlers(events, app.dispatch, _this.props, _this.scope);
            return _this;
        }
        Adapter.getDerivedStateFromProps = function () {
            return { snapshotID: app.dbSnapshotID() };
        };
        Adapter.prototype.componentWillUnmount = function () {
            if (this.dbView) {
                this.dbView.unwatch();
            }
        };
        Adapter.prototype.render = function () {
            var propsFromDb = this.dbView ? this.dbView.pull() : {};
            return React.createElement(Component, __assign({}, propsFromDb, this.eventHandlers, { __adapters__: app.adapters }, this.props));
        };
        Adapter.displayName = "Adapter(" + name + ")";
        return Adapter;
    }(React.PureComponent));
    if (addToScope) {
        Adapter.prototype.getChildContext = function () {
            return {
                treehouseScope: this.scope
            };
        };
        Adapter.childContextTypes = {
            treehouseScope: function () { return null; }
        };
    }
    Adapter.contextTypes = {
        treehouseScope: function () { }
    };
    return Adapter;
});

var handleEvent = (function (eventName, payload, _a, app) {
    var state = _a.state, action = _a.action, update = _a.update;
    var dbView, currentState, actionReturnValue, changes;
    if (state && (action || update)) {
        dbView = app.dbView(state, payload);
        currentState = dbView.pull();
    }
    if (action) {
        actionReturnValue = action(payload, app.dispatch, currentState);
    }
    if (update) {
        if (!state) {
            throw new Error("'update' needs the state to be specified");
        }
        dbView.push(update(currentState, payload));
        changes = app.commitUpdates();
    }
    return {
        changes: changes,
        actionReturnValue: actionReturnValue,
    };
});

var FilteredPipe = /** @class */ (function () {
    function FilteredPipe(source, spec, args) {
        this.source = source;
        this.spec = spec;
        this.args = args;
    }
    FilteredPipe.prototype.filterFn = function () {
        if (!this._filterFn) {
            this._filterFn = typeof (this.spec) === 'function' ? this.spec : this.spec.filter;
        }
        return this._filterFn;
    };
    FilteredPipe.prototype.unfilterFn = function () {
        if (!this.spec.unfilter) {
            throw new Error("You need to implement 'unfilter' on a filter to be able to set through it");
        }
        else {
            return this.spec.unfilter;
        }
    };
    FilteredPipe.prototype.pull = function () {
        return this.filterFn()(this.source.pull(), this.args);
    };
    FilteredPipe.prototype.push = function (value) {
        return this.source.push(this.unfilterFn()(value, this.args));
    };
    FilteredPipe.prototype.watch = function (callback) {
        this.source.watch(callback);
    };
    FilteredPipe.prototype.unwatch = function () {
        this.source.unwatch();
    };
    FilteredPipe.prototype.filter = function (spec, args) {
        return new this.constructor(this, spec, args);
    };
    return FilteredPipe;
}());

var getIn = (function (data, path) {
    var i, value = data;
    for (i = 0; i < path.length; i++) {
        value = value[path[i]];
        if (value === undefined) {
            return undefined;
        }
    }
    return value;
});

var Cursor = /** @class */ (function () {
    function Cursor(db, path) {
        this.db = db;
        this.path = path;
        this.watchCallback = null;
    }
    Cursor.prototype.pull = function () {
        return getIn(this.db.pull(), this.path);
    };
    Cursor.prototype.push = function (value) {
        this.db.push({ path: this.path, value: value });
    };
    Cursor.prototype.watch = function (callback) {
        this.unwatch();
        this.watchCallback = callback;
        this.db.watch(this.path, this.watchCallback);
    };
    Cursor.prototype.unwatch = function () {
        this.db.unwatch(this.path, this.watchCallback);
        this.watchCallback = null;
    };
    Cursor.prototype.filter = function (spec, args) {
        return new FilteredPipe(this, spec, args);
    };
    return Cursor;
}());

var DbView = /** @class */ (function () {
    function DbView(sources) {
        this.sources = sources;
        this.watchCallback = null;
    }
    DbView.prototype.watch = function (callback) {
        mapObject(this.sources, function (_, source) { return source.watch(callback); });
    };
    DbView.prototype.unwatch = function () {
        mapObject(this.sources, function (_, source) { return source.unwatch(); });
    };
    DbView.prototype.pull = function () {
        return mapObject(this.sources, function (_, source) { return source.pull(); });
    };
    DbView.prototype.push = function (data) {
        var _this = this;
        mapObject(data, function (key, value) { return _this.sources[key].push(value); });
    };
    return DbView;
}());

var DirtyTracker = /** @class */ (function () {
    function DirtyTracker() {
        this.all = new Set();
        this.channels = {};
        this.dirty = new Set();
    }
    DirtyTracker.prototype.channel = function (name) {
        if (!this.channels[name]) {
            this.channels[name] = new Set();
        }
        return this.channels[name];
    };
    DirtyTracker.prototype.track = function (callback, channel) {
        this.all.add(callback);
        this.channel(channel).add(callback);
    };
    DirtyTracker.prototype.untrack = function (callback, channel) {
        this.all.delete(callback);
        this.dirty.delete(callback);
        this.channel(channel).delete(callback);
    };
    DirtyTracker.prototype.markChannelDirty = function (channel) {
        var _this = this;
        var subscriptions = channel ? this.channel(channel) : this.all;
        subscriptions.forEach(function (s) { return _this.dirty.add(s); });
    };
    DirtyTracker.prototype.markClean = function (callback) {
        this.dirty.delete(callback);
    };
    DirtyTracker.prototype.isDirty = function (callback) {
        return this.dirty.has(callback);
    };
    DirtyTracker.prototype.flush = function () {
        var _this = this;
        this.dirty.forEach(function (callback) {
            callback();
            _this.markClean(callback);
        });
    };
    return DirtyTracker;
}());

var shallowCompare = (function (obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }
    var key;
    for (key in obj1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
});

var normalizeSpec = function (spec) {
    return Array.isArray(spec)
        ?
            {
                state: function (db) { return db.at(spec); },
                get: function (v) { return v; },
                set: function (v) { return v; },
            }
        :
            spec;
};
var Query = /** @class */ (function () {
    function Query(db, spec, args) {
        this.db = db;
        this.spec = normalizeSpec(spec);
        this.args = args;
        this.state = null;
        this.result = null;
    }
    Query.prototype.dbView = function () {
        if (!this._dbView) {
            this._dbView = this.db.view(this.spec.state, this.args);
        }
        return this._dbView;
    };
    Query.prototype.pull = function () {
        var currentState = this.dbView().pull();
        if (!this.state || !shallowCompare(this.state, currentState)) {
            this.result = this.spec.get(currentState, this.args);
            this.state = currentState;
        }
        return this.result;
    };
    Query.prototype.push = function (value) {
        if (!this.spec.set) {
            throw new Error("Query doesn't implement set");
        }
        var dbView = this.dbView(), changes = this.spec.set(value, dbView.pull(), this.args);
        dbView.push(changes);
    };
    Query.prototype.watch = function (callback) {
        this.dbView().watch(callback);
    };
    Query.prototype.unwatch = function () {
        this.dbView().unwatch();
    };
    Query.prototype.filter = function (spec, args) {
        return new FilteredPipe(this, spec, args);
    };
    return Query;
}());

var clone = (function (obj) { return Array.isArray(obj) ? obj.slice() : __assign({}, obj); });

// Immutable operation; returns a new object
var setIn = function (data, path, twigValue, level) {
    if (level === void 0) { level = 0; }
    if (path.length === 0) {
        return twigValue;
    }
    var newData = clone(data), branch = path[level], value;
    if (level + 1 < path.length) {
        value = setIn(newData[branch], path, twigValue, level + 1);
    }
    else {
        value = twigValue;
    }
    newData[branch] = value;
    return newData;
};

var Db = /** @class */ (function () {
    function Db() {
        var _this = this;
        this.snapshotID = 0;
        this.applyUpdate = function (_a) {
            var path = _a.path, value = _a.value;
            var bough = path[0], subbranches = path.slice(1);
            _this.data[bough] = setIn(_this.data[bough], subbranches, value);
            _this.dirtyTracker.markChannelDirty(_this.channelForPath(path));
        };
        this.dirtyTracker = new DirtyTracker();
        this.data = null;
        this.updates = [];
    }
    Db.prototype.init = function (data) {
        this.data = data;
    };
    Db.prototype.push = function (update) {
        this.updates.push(update);
    };
    Db.prototype.pull = function () {
        return this.data;
    };
    Db.prototype.applyUpdates = function () {
        var _this = this;
        var changes = this.updates.map(function (_a) {
            var path = _a.path, value = _a.value;
            return ({
                path: path,
                from: getIn(_this.data, path),
                to: value,
            });
        });
        this.updates.forEach(this.applyUpdate);
        this.updates = [];
        return changes;
    };
    Db.prototype.commitUpdates = function () {
        var changes = this.applyUpdates();
        this.snapshotID++;
        this.dirtyTracker.flush();
        return changes;
    };
    Db.prototype.watch = function (path, callback) {
        this.dirtyTracker.track(callback, this.channelForPath(path));
    };
    Db.prototype.unwatch = function (path, callback) {
        this.dirtyTracker.untrack(callback, this.channelForPath(path));
    };
    Db.prototype.channelForPath = function (path) {
        return path[0];
    };
    Db.prototype.at = function () {
        var path = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            path[_i] = arguments[_i];
        }
        if (Array.isArray(path[0])) {
            path = path[0];
        }
        return new Cursor(this, path);
    };
    Db.prototype.query = function (spec, args) {
        return new Query(this, spec, args);
    };
    Db.prototype.view = function (picker) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var src = typeof (picker) === 'function'
            ? picker.apply(void 0, [this].concat(args)) : picker;
        if (src.constructor === Object) {
            return new DbView(mapObject(src, function (k, s) {
                return Array.isArray(s) ? new Cursor(_this, s) : s;
            }));
        }
        else if (Array.isArray(src)) {
            return new Cursor(this, src);
        }
        else {
            return src;
        }
    };
    return Db;
}());

var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.dispatch = function (eventName, payload) {
            if (_this.eventSpecs[eventName]) {
                if (_this._currentlyDispatchingEvent) {
                    throw new Error("You can't call dispatch(" + eventName + ") synchronously while already performing an action(" + _this._currentlyDispatchingEvent + ")");
                }
                try {
                    _this._currentlyDispatchingEvent = eventName;
                    _this._handleEvent(eventName, payload, _this.eventSpecs[eventName]);
                }
                finally {
                    _this._currentlyDispatchingEvent = null;
                }
            }
            else {
                console.warn("Event '" + eventName + "' not registered");
            }
        };
        this._handleEvent = function (eventName, payload, spec) {
            return handleEvent(eventName, payload, spec, _this);
        };
        this.adapters = {};
        this.db = new Db();
        this.eventSpecs = {};
        this._registerEventCallbacks = [];
        this._currentlyDispatchingEvent = null;
    }
    App.prototype.init = function (state) {
        this.db.init(state);
    };
    App.prototype.dbView = function (picker) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        return (_a = this.db).view.apply(_a, [picker].concat(args));
    };
    App.prototype.dbSnapshotID = function () {
        return this.db.snapshotID;
    };
    App.prototype.commitUpdates = function () {
        return this.db.commitUpdates();
    };
    App.prototype.getState = function (eventName, payload) {
        var spec = this.eventSpecs[eventName];
        return spec.state ? this.dbView(spec.state, payload).pull() : null;
    };
    App.prototype.registerEvents = function (_a) {
        var _this = this;
        var defaults = _a.defaults, events = _a.events;
        mapObject(events, function (name, spec) { return _this._registerEvent(name, __assign({}, defaults, spec)); });
    };
    App.prototype._registerEvent = function (name, spec) {
        this.eventSpecs[name] = spec;
        this._registerEventCallbacks.forEach(function (callback) { return callback(name, spec); });
    };
    App.prototype.onRegisterEvent = function (callback) {
        this._registerEventCallbacks.push(callback);
    };
    App.prototype.registerAdapter = function (name, spec, component) {
        this.adapters[name] = buildAdapter(name, spec, component, this);
    };
    App.prototype.usePlugin = function (plugin, args) {
        return plugin(this, args);
    };
    App.prototype.useMiddleware = function (middleware, args) {
        var _this = this;
        var nextHandleEvent = this._handleEvent, nextLayerDispatch = function (eventName, payload) {
            return nextHandleEvent(eventName, payload, _this.eventSpecs[eventName]);
        };
        this._handleEvent = middleware(nextLayerDispatch, this, args);
        return nextLayerDispatch;
    };
    return App;
}());

export { component, App };
