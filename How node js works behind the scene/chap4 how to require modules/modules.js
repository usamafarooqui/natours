// console.log(arguments);

// console.log(require("module").wrapper);


// import module

const C = require('./test-module-1');

// apmi jo Calculator import kia tha uska intsance bna liya hai 
const calc1 = new C();


console.log(calc1.add(2,5));


// module 2 example

// const cal2 = require('./test-module-2')

// console.log(cal2.add(6,3));

// agr de structure krna ho tou 

const {add , mul , div} = require('./test-module-2');


console.log(add(6,3));

// caching 

// module 1 dafa load hota hai uyske function bar bar load ho saktay hn

require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();