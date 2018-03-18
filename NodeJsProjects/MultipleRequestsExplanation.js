/**
 * request are not handling one after other
 * 
 * request handling
 * @param order
 */
function request(order) {
    console.log("Request Order",order);
    response(function () {
        console.log('Resturned Data', order);
    })
}

/**
 * response call function
 * @param callback
 */
function response(callback) {
    setTimeout(callback,5000)
}

/**
 * number of request
 */
request(1);
request(2);
request(3);
request(4);
request(5);