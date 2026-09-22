/**
 * this keyward point the object in which it is defined
 * @type {{firstname: hafiz.firstname}}
 */
var hafiz = {
    firstname : function () {
        console.log(this === hafiz)
    }
}
/**
 * clling that object
 */
hafiz.firstname();

/**
 * in this function, its not defined inside object, so this will point to global object
 */
function globally_checking() {
    console.log(this === global)
}
globally_checking();