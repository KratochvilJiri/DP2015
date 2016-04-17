var IssueModel = require('./../models/IssueModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

module.exports = {
    // create user
    save: function(issue, callback) {
        
        console.log(issue);

        // participation validation
        var validation = this.validate(issue);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        // check if _Id is set
        if (issue._id) {
        }
        else {
        }
    },
    
        // user structure validation
    validate: function(issue) {
        // validation init
        validation = new ValidationResult(issue);
        return validation;
    }
}