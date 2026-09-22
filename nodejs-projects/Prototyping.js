/**
 * as prototype allow us to add properties in objects or functions.
 * @param name
 * @constructor
 */
function Person(name) {
    this.name = name;
}

/**
 * prototyping object
 * @type {{greeting_message: Person.greeting_message}}
 */
Person.prototype = {
    greeting_message : function () {
        console.log("Hello Everyone My name is " + this.name)
    }
}
/**
 * Creating a object of Person type
 * @type {Person}
 */
var hafiz = new Person('Hafiz');
/**
 *calling protyping data
 */
hafiz.greeting_message();