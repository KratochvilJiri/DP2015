/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

var mongoose = require('mongoose');

// address structure
module.exports = {
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    street: {
        type: String
    },
    postal: {
        type: String
    }
};