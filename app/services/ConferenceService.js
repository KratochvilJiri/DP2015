var ConferenceModel = require('./../models/ConferenceModel');
var ValidationResult = require('./../models/ValidationResultsStructure');

module.exports = {
     
    // save or create conference
    save: function(conference, callback) {
        // conference validation
        var validation = this.validate(conference);

        if (!validation.isValid) {
            callback(validation);
            return;
        }
        
        
       this.deactivateAll(validation, function(validation){   
            // check if _Id is set
            if (conference._id) {
                // to do
            }
            else {
                ConferenceModel.create(conference, function(err, dbConference) {
                    // conference creation error
                    if (err) {
                        validation.addError(err);
                        validation.addError("Nepodařilo se vytvořit konferenci");
                        callback(validation);
                        return;
                    }
                    // conference created
                    callback(validation);
                    return
                 });
            }
        });
    },

    // conference structure validation
    validate: function(conference) {
        // validation init
        validation = new ValidationResult(conference);

        // check required values
        validation.checkIfIsDefinedAndNotEmpty('date', "Datum začátku konference je povinné");
        validation.checkIfIsDefinedAndNotEmpty('name', "Název konference je povinný");
        
        if(validation.data.attachementTypes){
            validation.data.attachementTypes.forEach(function (attachementType) {
                if (!attachementType.name){
                    validation.addError("Název typu přílohy je povinný");
                }
                else if(!attachementType.date){
                    validation.addError("Datum odevzdání přílohy je povinné");
                }
            });
        }
        
        if(validation.data.sponsorshipLevels){
            validation.data.sponsorshipLevels.forEach(function(sponsorshipLevel) {
                if(!sponsorshipLevel.name){
                    validation.addError("Název úrovně sponzorství je povinné");
                }
            });
        }    
        return validation;
    },
    
    deactivateAll: function (validation, callback) {
        ConferenceModel.update({}, {active: false}, {multi: true}, function (err,conferences) {
           if (err){
               validation.addError("Nepodařila se nastavit neaktivita konferencí");
               callback(validation);
               return;
           }
           else{
               console.log("Neaktivni:", conferences);
               callback(validation);
               return;
           } 
        });
    },

    // get all conference
    getList: function(callback) {
        var validation = new ValidationResult([]);

        // find all conference
        ConferenceModel.find({}, 'name date notification active sponsorshipLevels attachementTypes', function(err, allConference) {
            // get all conference error
            if (err) {
                validation.addError("Nepodařilo se získat seznam konferencí");
                callback(validation);
                return;
            }
            // all conference obtained
            validation.data = allConference;

            callback(validation);
            return;
        });
    }
}