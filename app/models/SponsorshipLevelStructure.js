/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce)
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