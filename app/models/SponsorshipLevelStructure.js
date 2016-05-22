/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

var mongoose = require('mongoose');
var attachementTypeStructure = require('./AttachementTypeStructure');

// sponsorship model
module.exports = {
    name: {
        type: String
    },
    value: {
        type: Number
    },
    attachementTypes:
    [attachementTypeStructure]
};