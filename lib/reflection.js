/**
 * @author       Pablo Oliveira <pablo.oliveira@outlook.com.br>
 * @copyright    2015 Pablo Oliveira
 * @license      {@link https://github.com/poliveira/reflection-js/blob/master/LICENSE|MIT License}
 */

(function () {
    "use strict";

    var reflection = (function () {

        /**
         * @module reflection
         */
        var reflection = function (obj) {
            return {

                /**
                 * Reference to the object
                 *
                 * @property _obj
                 * @memberof reflection
                 * @private
                 */
                _obj: obj || {},

                /**
                 * Returns a reference for the given property name
                 *
                 * @method _getPropertyReference
                 * @memberof reflection
                 * @param {string} property
                 * @param {boolean} [createIfNotExists] - Flag whom determines if the property
                 *                                        should be created if it not exists
                 */
                _getPropertyReference: function (property, createIfNotExists) {
                    var namespaces = property.split(".");
                    var context = this._obj;

                    for (var i = 0; i < namespaces.length - 1; i++) {
                        if (!context.hasOwnProperty(namespaces[i])) {
                            if (createIfNotExists === true) {
                                context[namespaces[i]] = {};
                            } else {
                                return;
                            }

                        }

                        context = context[namespaces[i]];
                    }

                    return context[namespaces[i]];
                },

                /**
                 * Returns an array of all object properties, respecting the filters
                 * provided.
                 *
                 * @memberof reflection
                 * @private
                 */
                _getProperties: function (obj, exclude, include) {
                    include = include || [];
                    exclude = exclude || [];

                    var properties = [];

                    var skip;

                    for (var property in obj) {
                        skip = false;

                        if (!obj.hasOwnProperty(property)) {
                            continue;
                        }

                        for (var i = 0; i < exclude.length; i++) {
                            if (typeof obj[property] === exclude[i]) {
                                skip = true;
                                break;
                            }
                        }

                        if (skip) {
                            continue;
                        }

                        if (include.length > 0) {
                            for (var i = 0; i < include.length; i++) {
                                if (typeof obj[property] === include[i]) {
                                    properties.push(property);
                                }
                            }
                        } else {
                            properties.push(property);
                        }
                    }

                    return properties;

                },

                /**
                 * Runs a function by name.
                 *
                 * @method get
                 * @memberof reflection
                 * @param {string} functionName
                 * @param {Array} [args]
                 */
                call: function (functionName) {
                    if (!this.owns(functionName)) {
                        return;
                    }

                    var args = [].slice.call(arguments).splice(1);

                    var namespaces = functionName.split(".");
                    var fn = namespaces.pop();
                    var context = this._obj;

                    for (var i = 0; i < namespaces.length; i++) {
                        context = context[namespaces[i]];
                    }

                    return context[fn].apply(this, args);
                },

                /**
                 * Gets a reference for a given property name.
                 *
                 * @method get
                 * @memberof reflection
                 * @param {string} property - The property name
                 */
                get: function (property) {
                    return this._getPropertyReference(property, false);
                },

                /**
                 * Returns an Array contaning all the methods names.
                 *
                 * @method methods
                 * @memberof reflection
                 * @return {Array}
                 */
                methods: function () {
                    return this._getProperties(this._obj, null, ["function"]);
                },

                /**
                 * Returns true if the object owns the given property, otherwise false
                 *
                 * @method owns
                 * @memberof reflection
                 * @param {string} property - Property name
                 * @return {boolean}
                 */
                owns: function (property) {

                    // Gets a reference for the property
                    var ref = this._getPropertyReference(property, false);

                    return ref !== undefined;
                },

                /**
                 * Returns an Array contaning all the property names.
                 *
                 * @method properties
                 * @memberof reflection
                 * @return {Array}
                 */
                properties: function () {
                    return this._getProperties(this._obj, ["function"]);
                },

                /**
                 * Sets the value of a given property. If the property does not exists, it
                 * will created, even if it is a nested property.
                 *
                 * @method set
                 * @memberof reflection
                 * @param {string} property - Property name
                 * @param {boolean | number | object | string} value - The value to be setted
                 * @return {undefined}
                 */
                set: function (property, value) {

                    // TODO: should find a way to use the _getPropertyReference method
                    //       and keep a reference to the object
                    var namespaces = property.split(".");
                    var context = this._obj;

                    for (var i = 0; i < namespaces.length - 1; i++) {
                        if (!context.hasOwnProperty(namespaces[i])) {
                            context[namespaces[i]] = {};
                        }

                        context = context[namespaces[i]];
                    }

                    context[namespaces[i]] = value;
                }
            }
        };

        return reflection;
    })();

    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = reflection;
    } else {
        window.reflection = reflection;
    }
})();