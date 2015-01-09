/**
 * @author       Pablo Oliveira <pablo.oliveira@outlook.com.br>
 * @copyright    2015 Pablo Oliveira
 * @license      {@link https://github.com/poliveira/reflection-js/blob/master/LICENSE|MIT License}
 */

/**
 * @class reflection
 */
(function () {
    "use strict";

    var reflection = (function () {
        var reflection = function (obj) {

            return {

                /**
                 * Reference to the object
                 *
                 * @property _obj
                 * @memberof reflection
                 * @private
                 */
                _obj: obj,

                /**
                 * Returns a reference for the given property name
                 *
                 * @method _getPropertyReference
                 * @memberof reflection
                 * @param {string} property - The property name
                 * @private
                 */
                _getPropertyReference: function (property) {
                    var namespaces = property.split(".");
                    var context = this._obj;

                    for (var i = 0; i < namespaces.length - 1; i++) {
                        if (!context.hasOwnProperty(namespaces[i])) {
                            return;
                        }

                        context = context[namespaces[i]];
                    }

                    return context[namespaces[i]];
                },

                /**
                 * Returns an array of all object properties, respecting the filters
                 * provided.
                 *
                 * @method _getProperties
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

                            // If this property type is any of the excluded
                            // ones, skip to the next one
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

                                // Include the property if its type is one
                                // of the included types
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

                _type: Object.prototype.toString.call(obj).slice(8, -1),
                
                /**
                 * Runs a function by name.
                 *
                 * @method call
                 * @memberof reflection
                 * @param {string} functionName
                 * @param {Array} [args]
                 */
                call: function (functionName) {
                    if (!functionName || !this.owns(functionName)) {
                        return;
                    }

                    var args = [].slice.call(arguments).splice(1);

                    // Creates an array containing all namespace
                    // levels
                    var namespaces = functionName.split(".");

                    // Picks the last name in the namespaces so
                    // it can be called below within the reference
                    // of the current context
                    var fn = namespaces.pop();

                    // Context is created at the top level
                    // of the current object
                    var context = this._obj;

                    // Iterates through the namespace array, updateing
                    // the context reference in each iteration. Get out
                    // of the loop one step earlier to keep the reference
                    // to the context
                    for (var i = 0; i < namespaces.length; i++) {

                        // Set context to the current namespace
                        context = context[namespaces[i]];
                    }

                    return context[fn].apply(this, args);
                },

                /**
                 * Clones the object and remove its reference.
                 *
                 * @method clone
                 * @memberof reflection
                 * @return {object} - A clone of the current object
                 */
                clone: function () {
                    if (this._obj === null) {
                        return null;
                    }
                    
                    if (!Object.create) {
                        Object.create = function (obj) {
                            var fn = function () {};

                            fn.prototype = obj;

                            return new fn();
                        };
                    }

                    return Object.create((this._obj));;
                },

                /**
                 * Gets a reference for a given property name.
                 *
                 * @method get
                 * @memberof reflection
                 * @param {string} property - The property name
                 */
                get: function (property) {
                    if (!property || !this._obj) {
                        return;
                    }

                    return this._getPropertyReference(property);
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
                    if (!property || !this._obj) {
                        return false;
                    }

                    // Gets a reference for the property
                    var ref = this._getPropertyReference(property);

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
                    if (!property || !this._obj) {
                        return;
                    }

                    // TODO: should find a way to use the _getPropertyReference method
                    //       and keep a reference to the object
                    var namespaces = property.split(".");
                    var context = this._obj;

                    for (var i = 0; i < namespaces.length - 1; i++) {

                        // Create the property if the object does not 
                        // have it
                        if (!context.hasOwnProperty(namespaces[i])) {
                            context[namespaces[i]] = {};
                        }

                        context = context[namespaces[i]];
                    }

                    context[namespaces[i]] = value;
                },

                /**
                 * Returns a string with the name of the type of the current object.
                 *
                 * @method type
                 * @memberof reflection
                 * @return {string}
                 */
                type: function () {
                    return this._type;
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