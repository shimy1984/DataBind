(function() {

    "use strict";

    var DataBind = window.DataBind = function(key, value) {
        this._init();
        this.set(key, value);
        this._listener();
    };

    DataBind.prototype = {
        get: function(key) {
            if (!key) {
                return this.model;
            }
            return this.model[key];
        },
        set: function(key, value) {
            this.model = this.model || {};
            if (!key) {
                return;
            }
            if (typeof key !== 'object') {
                this.model[key] = value || "";
                this._changeHandler(key);
            } else {
                this.model = key;
                for (var k in key) {
                    if (key.hasOwnProperty(k)) {
                        this._changeHandler(k);
                    }
                }
            }
        },
        _init: function() {
            var binded = document.querySelectorAll('[data-bind]'),
                length = binded.length;

            while (length--) {
                var el = binded[length],
                    key = el.getAttribute('data-bind'),
                    val = "";

                if (this._isInput(el)) {
                    val = el.value;
                    if (val) {
                        this.set(key, val);
                    }
                } else {
                    val = el.innerHTML;
                    if (val) {
                        this.set(key, val);
                    }
                }
            }
        },
        _changeHandler: function(key) {
            var binded = document.querySelectorAll('[data-bind="' + key + '"]'),
                length = binded.length;

            while (length--) {
                var el = binded[length],
                    value = this.get(key);

                // # TODO: Check if value is array, if it is, cloneNode with separate values.

                if (this._isInput(el)) {
                    el.value = value;
                } else {
                    el.innerHTML = value;
                }
            }
        },
        _listener: function() {
            if (document.addEventListener) {
                (function(self) {
                    document.addEventListener('change', function(e) {
                        e = e || window.event;
                        var target = e.target || e.srcElement,
                            key = target.getAttribute('data-bind'),
                            value = target.value;
                        if (!key) {
                            return e;
                        }

                        self.set(key, value);
                    }, false);
                }(this));
            } else {
                (function(self) {
                    document.attachEvent('onchange', function(e) {
                        e = e || window.event;
                        var target = e.target || e.srcElement,
                            key = target.getAttribute('data-bind'),
                            value = target.value;
                        if (!key) {
                            return e;
                        }

                        self.set(key, value);
                    });
                }(this));
            }
        },
        _isInput: function(el) {
            var bool = (el.tagName && el.tagName.toLowerCase() === "input") || (el.tagName && el.tagName.toLowerCase() === "textarea");
            return bool;
        }
    };

}());