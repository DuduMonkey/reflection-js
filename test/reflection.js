var assert = require("assert");
var reflection = require("../lib/reflection");

describe("Reflection", function () {

    describe("#call()", function () {
        it("should execute the given function", function () {
            var obj = {
                a: function () {
                    return "cool";
                },
                b: function (x, y) {
                    return x + y;
                }
            };

            assert.strictEqual(reflection(obj).call("a"), "cool");
            assert.strictEqual(reflection(obj).call("b", 1, 2), 3);
            assert.strictEqual(reflection(obj).call("c"), undefined);
        });
    });
    
    describe("#clone()", function () {
        it("should create an exact copy of the object", function () {
            var obj = {
                a: function () {
                    return "cool";
                },
                b: 1,
                c: {
                    a: {
                        a: "nested stuff"
                    }
                }
            };

            var copy = reflection(obj).clone();
            
            assert.strictEqual(copy.a, obj.a);
            assert.strictEqual(copy.c.a.a, obj.c.a.a);
        });
        
        it("should work without Object.create", function () {
            var obj = {
                a: function () {
                    return "cool";
                },
                b: 1,
                c: {
                    a: {
                        a: "nested stuff"
                    }
                }
            };

            Object.create = null;
            
            var copy = reflection(obj).clone();
            
            assert.strictEqual(copy.a, obj.a);
            assert.strictEqual(copy.c.a.a, obj.c.a.a);
        });
    });
    
    describe("#get()", function () {
        it("should get a reference to the property", function () {
            var obj = {
                a: function () {
                    return "a";
                },
                b: function (x, y) {
                    return x + y;
                },
                c: "c",
                d: {
                    a: "d.a"
                }
            };

            assert.strictEqual(reflection(obj).get("a"), obj.a);
            assert.strictEqual(reflection(obj).get("a")(), "a");
            assert.strictEqual(reflection(obj).get("b"), obj.b);
            assert.strictEqual(reflection(obj).get("b")(1, 1), 2);
            assert.strictEqual(reflection(obj).get("c"), obj.c);
            assert.strictEqual(reflection(obj).get("c"), "c");
            assert.strictEqual(reflection(obj).get("d.a"), obj.d.a);
            assert.strictEqual(reflection(obj).get("d.a"), "d.a"); 
        });
        
        it("should undefined if the property does not exists", function () {
            var obj = {};
            
            assert.strictEqual(reflection(obj).get("z"), undefined);
            assert.strictEqual(reflection(obj).get(null), undefined);
        });
        
        it("should be able to run an method by reference", function () {
            var obj = {
                a: function (text) {
                    text = text || "a";
                    return text;
                }
            };
            
            var ref = reflection(obj).get("a");
            
            assert.strictEqual(ref(), "a");
            assert.strictEqual(ref("b"), "b");
        });
    });
    
    describe("#methods()", function () {
        it("should return an array with all object methods", function () {
            var obj = {
                a: "a",
                fa: function () {},
                fb: function () {}
            };

            var methods = reflection(obj).methods();

            assert.deepEqual(methods, ["fa", "fb"]);
        });
        
        it("should return an empty array if the object does not have any methods", function () {
            var obj = {
                a: "a"
            };

            var methods = reflection(obj).methods();

            assert.deepEqual(methods, []);
        });
    });
    
    describe("#owns()", function () {
        it("should return true when the object owns a property, otherwise false", function () {
            var obj = {
                a: "a",
                b: {
                    a: "b.a",
                    b: "b.b"
                },
                c: {
                    a: {
                        a: "c.a.a"
                    }
                }
            };

            assert.strictEqual(reflection(obj).owns("a"), true);
            assert.strictEqual(reflection(obj).owns("b"), true);
            assert.strictEqual(reflection(obj).owns("b.a"), true);
            assert.strictEqual(reflection(obj).owns("c.a.a"), true);
            assert.strictEqual(reflection(obj).owns("c.a.z"), false);
            assert.strictEqual(reflection(obj).owns("z"), false);
            assert.strictEqual(reflection(obj).owns(null), false);
        });
    });
    
    describe("#properties()", function () {
        it("should return an array with all object properties", function () {
            var obj = {
                a: "a",
                b: "b",
                c: "c",
                fa: function () {}
            };

            var properties = reflection(obj).properties();

            assert.deepEqual(properties, ["a", "b", "c"]);
        });
        
        it("should return an empty array if the object does not have any properties", function () {
            var obj = {
                fa: function () {}
            };

            var properties = reflection(obj).properties();

            assert.deepEqual(properties, []);
        });
    });
    
    describe("#set()", function () {
        it("should set the value of a property", function () {
            var obj = {
                a: "a",
                b: null,
                c: {
                    a: "c.a",
                    b: null
                }
            };

            reflection(obj).set("b", "b");
            reflection(obj).set("c.b", "c.b");
            reflection(obj).set("d.a.b.c.d.e", "d.a.b.c.d.e");
            reflection(obj).set(null, null);

            assert.strictEqual(obj.b, "b");
            assert.strictEqual(obj.c.b, "c.b");
            assert.strictEqual(obj.d.a.b.c.d.e, "d.a.b.c.d.e");
        });
    });
});