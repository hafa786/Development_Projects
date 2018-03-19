/**
 * creating a user having few properties
 * @type {{name: string, age: number}}
 */
var  user = {
    name:"Hafiz",
    age: 26
};
/**
 * creating a new object refrencing old object but not copy object.
 * @type {{name: string, age: number}}
 */
var new_user = user;

new_user.name='Sikandar';

console.log(user.name);

/**
 * illustrate the difference between == and ===
 */
console.log(new_user.age == '26');
console.log(new_user.age ==='26');


