var IssueModel = require('./../models/IssueModel');
var UserModel = require('./../models/UserModel');
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
            IssueModel.create(issue, function(err, dbIssue) {
                // participation creation error
                if (err) {
                    validation.addError("Nepodařilo se vytvořit problém.");
                    callback(validation);
                    return;
                }
                else {
                    UserModel.findById(issue.creator, function(err, dbUser) {
                        if (err) {
                            validation.addError("Nepodařilo se získat uživatele pro přidání vytvořeného problému");
                            callback(validation);
                            return;
                        }
                        else {
                            dbUser.createdIssues.push(dbIssue._id);
                             dbUser.save(function(err) {
                                // error check
                                if (err) {
                                    validation.addError("Nepodařilo se uložit uživatele po přidání vytvořeného problému");
                                    callback(validation);
                                    return;
                                }
                                // issue created and pushed to the user - createdIssues
                                callback(validation);
                                return;
                            });
                        }
                    });
                }
            });
        }
    },
    
    getAll: function(callback){
        var validation = new ValidationResult([]);
        
        IssueModel.find(function(err, issues) {
                // get all users error
                if (err) {
                    validation.addError("Nepodařilo se získat seznam problému");
                    callback(validation);
                    return;
                }
                // all users obtained
                validation.data = issues;

                callback(validation);
                return;
            });
    },

    // user structure validation
    validate: function(issue) {
        // validation init
        validation = new ValidationResult(issue);

        validation.checkIfIsDefinedAndNotEmpty('name', "Název problému je povinný");
        validation.checkIfIsDefinedAndNotEmpty('description', "Popis problému je povinný");
        validation.checkIfIsDefinedAndNotEmpty('priority', "Priorita problému je povinná");
        validation.checkIfIsDefinedAndNotEmpty('type', "Typ problému je povinný");

        return validation;
    }
}