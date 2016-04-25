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
            IssueModel.findById(issue._id, function(err, dbIssue) {
                // error check
                if (err) {
                    validation.addError("Problém se nezdařilo nalézt v databázi");
                    callback(validation);
                    return;
                }

                // Update and save conference
                dbIssue.name = issue.name;
                dbIssue.description = issue.description;
                dbIssue.priority = issue.priority;
                dbIssue.type = issue.type;
                dbIssue.state = issue.state;
                dbIssue.supervisor = issue.supervisor;

                // Save user
                dbIssue.save(function(err) {
                    if (err) {
                        validation.addError("Problém se nepodařilo uložit");
                        callback(validation);
                        return;
                    }

                    callback(validation);
                    return;
                });
            })
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

    getAll: function(callback) {
        var validation = new ValidationResult([]);

        IssueModel.find()
            .populate('creator', 'name')
            .populate('supervisor', 'name')
            .exec(function(err, issues) {
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

    get: function(issue, callback) {
        var validation = new ValidationResult(issue);

        if (!issue._id) {
            validation.addError("Porblém nelze získat bez identifikátoru");
            callback(validation);
            return;
        }

        IssueModel.findById(issue._id)
            .populate('creator', 'name')
            .populate('supervisor', 'name')
            .populate({
                path: 'messages', model: 'Message', populate: { path: 'author', model: 'User', select: 'name role' }
            })
            .exec(function(err, dbIssue) {
                if (err) {
                    validation.addError("Problém se nepodařilo získat");
                    callback(validation);
                    return;
                }
                // user obtained
                validation.data = dbIssue;
                callback(validation);
            })

    },

    getUnsolvedCount: function(callback) {
        var validation = new ValidationResult({});

        IssueModel.count({ "state.constant" : "IN_PROGRESS" }, function(err, count) {
            if (err) {
                validation.addError("Počet nevyřešených problémů se nepodařilo získat");
                callback(validation);
                return;
            }
            // user obtained
            validation.data = count;
            callback(validation);
        })

    },

    // user structure validation
    validate: function(issue) {
        // validation init
        validation = new ValidationResult(issue);

        validation.checkIfIsDefinedAndNotEmpty('name', "Název problému je povinný");
        validation.checkIfIsDefinedAndNotEmpty('description', "Popis problému je povinný");

        if (!issue.type) {
            validation.addError("Typ problému je povinný");
        }
        if (!issue.priority) {
            validation.addError("Priorita problému je povinná");
        }

        return validation;
    }
}