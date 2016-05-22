/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

var AttachementModel = require('./../models/AttachementModel');
var ValidationResult = require('./../models/ValidationResultsStructure');
var ParticipationModel = require('./../models/ParticipationModel');

module.exports = {

    // create attachement
    save: function (attachement, callback) {

        var validation = this.validate(attachement);

        if (!validation.isValid) {
            callback(validation);
            return;
        }

        if (attachement._id) {
            //
        }

        else {
            AttachementModel.create(attachement, function (err, dbAttachement) {
                // attachement creation error
                if (err) {
                    validation.addError("Nepodařilo se vytvořit přílohu.");
                    callback(validation);
                    return;
                }
                else {
                    ParticipationModel.findOneAndUpdate(
                        { _id: attachement.participation },
                        { $push: { attachements: dbAttachement._id } },
                        function (err, participation) {
                            if (err) {
                                validation.addError("Nepodařilo se přídat přílohu k účasti.");
                                callback(validation);
                                return;
                            }
                            // attachement created and pushed to the participation
                            callback(validation);
                            return
                        }
                    );
                }
            });
        }
    },

    exists: function (attachementTypeHash, callback) {
        var validation = this.validate({});

        AttachementModel.count({ hash: attachementTypeHash }, function (err, count) {
            // attachement creation error
            if (err) {
                validation.addError("Nepodařilo se vytvořit přílohu.");
                callback(validation);
                return;
            }
            validation.data = count;
            callback(validation);
            return;
        });
    },

    // attachement structure validation
    validate: function (attachement) {
        // validation init
        validation = new ValidationResult(attachement);

        return validation;
    },

    // remove attachement by id
    remove: function (attachement, callback) {
        var validation = new ValidationResult(attachement);

        ParticipationModel.update(
            { _id: attachement.participation },
            { $pull: { attachements: attachement._id } },
            { safe: true },
            function (err, dbParticipation) {
                if (err) {
                    validation.addError("Přílohu se nepodařilo odebrat z účasti");
                    callback(validation);
                    return;
                }
                else {
                    AttachementModel.remove({ _id: attachement._id }, function (err, dbUser) {
                        // attachement remove error
                        if (err) {
                            validation.addError("Přílohu se nepodařilo odebrat");
                            callback(validation);
                            return;
                        }
                        // attachement removed
                        callback(validation);
                    });
                }
            });

    }
}