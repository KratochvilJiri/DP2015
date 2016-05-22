/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

var IssueModel = require('./../models/IssueModel');
var UserModel = require('./../models/UserModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

module.exports = {
    // save issue
    save: function(issue, callback) {

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

                // Update and save issue
                dbIssue.name = issue.name;
                dbIssue.description = issue.description;
                dbIssue.priority = issue.priority;
                dbIssue.type = issue.type;
                dbIssue.state = issue.state;
                dbIssue.supervisor = issue.supervisor;

                // Save issue
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
                // issue creation error
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
    // get alll issues
    getAll: function(callback) {
        var validation = new ValidationResult([]);

        IssueModel.find()
            .populate('creator', 'name')
            .populate('supervisor', 'name')
            .exec(function(err, issues) {
                // get all issues error
                if (err) {
                    validation.addError("Nepodařilo se získat seznam problému");
                    callback(validation);
                    return;
                }
                // all issues obtained
                validation.data = issues;
                callback(validation);
                return;
            });
    },
    // get by ID
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
                path: 'messages', model: 'Message', options: { sort: { 'date': -1 } }, populate: { path: 'author', model: 'User', select: 'name role' }
            })
            .exec(function(err, dbIssue) {
                if (err) {
                    validation.addError("Problém se nepodařilo získat");
                    callback(validation);
                    return;
                }
                // issue obtained
                validation.data = dbIssue;
                callback(validation);
            })

    },
    // get unsolved issues count
    getUnsolvedCount: function(callback) {
        var validation = new ValidationResult({});

        IssueModel.count({ "state.constant": "IN_PROGRESS" }, function(err, count) {
            if (err) {
                validation.addError("Počet nevyřešených problémů se nepodařilo získat");
                callback(validation);
                return;
            }
            // user obtained
            validation.data = count;
            callback(validation);
            return;
        })

    },
    // all unseen messages
    getUnseenMessages: function(userRole, callback) {
        var validation = new ValidationResult({});

        if (userRole != "PARTICIPANT") {           
            IssueModel.find()
                .populate({ path: 'messages', model: 'Message', match: { "seen": false }, populate: { path: 'author', model: 'User', match: { "role": "PARTICIPANT" } } })
                .exec(function(err, issues) {
                    // get all issues error
                    if (err) {
                        validation.addError("Nepodařilo se získat seznam problému");
                        callback(validation);
                        return;
                    }
                    // all issues obtained
                    validation.data = issues;

                    callback(validation);
                    return;
                });
        }
        else {
            IssueModel.find()
                .populate({ path: 'messages', model: 'Message', match: { "seen": false }, populate: { path: 'author', model: 'User', match: { "role": { $ne: "PARTICIPANT"} } } })
                .exec(function(err, issues) {
                    // get all issues error
                    if (err) {
                        validation.addError("Nepodařilo se získat seznam problému");
                        callback(validation);
                        return;
                    }
                    // all issues obtained
                    validation.data = issues;

                    callback(validation);
                    return;
                });
        }
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