var ParticipationModel = require('./../models/ParticipationModel');
var ConferenceModel = require('./../models/ConferenceModel');
var UserModel = require('./../models/UserModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

module.exports = {

    // create user
    save: function(participation, callback) {

        // participation validation
        var validation = this.validate(participation);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        // check if _Id is set
        if (participation._id) {

        }
        else {
            ParticipationModel.create(participation, function(err, dbParticipation) {
                // participation creation error
                if (err) {
                    validation.addError("Nepodařilo se vytvořit účast.");
                    callback(validation);
                    return;
                }
                else {

                    // to do add participation to user??
                    UserModel.findById(participation.user, function(err, dbUser) {
                        if (err) {
                            validation.addError("Nepodařilo se získat uživatele pro přidání účasti");
                            callback(validation);
                            return;
                        }
                        else {
                            console.log(dbUser);
                            
                            dbUser.participations.push(dbParticipation._id);

                            dbUser.save(function(err) {
                                // error check
                                if (err) {
                                    validation.addError("Nepodařilo se uložit uživatele po přidání účasti");
                                    callback(validation);
                                    return;
                                }
                                else {
                                    // add participant to conference
                                    // find conference by ID
                                    ConferenceModel.findById(participation.conference, function(err, dbConference) {
                                        // error check
                                        if (err) {
                                            validation.addError("Nepodařilo se získat konferenci pro přidání účastníka");
                                            callback(validation);
                                            return;
                                        }
                                        else {

                                            // push participation to conference
                                            dbConference.participations.push(dbParticipation._id);

                                            // save conference      
                                            dbConference.save(function(err) {
                                                // error check
                                                if (err) {
                                                    validation.addError("Nepodařilo se uložit konferenci po přidání účastníka");
                                                    callback(validation);
                                                    return;
                                                }
                                                // participation created and pushed to the conference
                                                callback(validation);
                                                return;
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    
    getList: function(participantID, callback){
        var validation = new ValidationResult([]);
        ParticipationModel
            .find({'user': participantID})
            .populate('conference', 'name')
            .exec(function(err,participations) {
             if (err) {
                validation.addError("Účasti se nepodařilo získat");
                callback(validation);
                return;
            }
            // user obtained
            validation.data = participations;
            callback(validation);
        });        
    },

    // user structure validation
    validate: function(user) {
        // validation init
        validation = new ValidationResult(user);


        validation.checkIfIsDefinedAndNotEmpty('conference', "Vyběr konference, kde proběhne účast je povinná");

        return validation;
    }
}