angular.module('ParticipantCtrl', []).controller('ParticipantController', ['$scope', '$state', '$stateParams', '$timeout', 'UserService', 'ConferenceService', 'ParticipationService', 'SessionService', 'MessageService', 'filepickerService', 'AttachementService', function($scope, $state, $stateParams, $timeout, UserService, ConferenceService, ParticipationService, SessionService, MessageService, filepickerService, AttachementService) {
    // session structure
    $scope.session = SessionService;
    // participant (user)
    $scope.participant = {};
    // participantion that is currently showed
    $scope.participation = {};
    // all participations of user
    $scope.participations = [];
    // participant(user) - address initialization
    $scope.participant.address = {};
    // currently showed conference (participation of participant)
    $scope.conference = {};
    // new participantion of user
    $scope.newParticipation = {};
    // all participated conference
    $scope.ParticipatedConferences = [];
    // all not participated conference
    $scope.otherConferences = [];
    // new message
    $scope.message = {};
    //
    $scope.attachement = {};

    $scope.markAsSeen = function(message) {
        message.seen = true;
        MessageService.save(message)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Zpráva byla označena za přečtenou.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // send new message to the server
    $scope.sendMessage = function() {
        $scope.message.date = new Date();
        $scope.message.author = $scope.session.currentUser._id;
        $scope.message.participation = $scope.participation._id;
        $scope.message.seen = false;
        $scope.message.userRole = $scope.session.currentUser.role;
        MessageService.save($scope.message)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Zpráva byla úspěšně odeslána.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }
    // get sponsorshipLevel documents
    var getAttachementTypes = function() {
        $scope.conference.sponsorshipLevels.forEach(function(sponsorshipLevel) {
            if (sponsorshipLevel._id === $scope.participation.sponsorshipLevel.type._id)
                $scope.attachementTypes = sponsorshipLevel.attachementTypes;
        })
        assignAttachement();
    }

    var assignAttachement = function() {

        $scope.participation.attachements.forEach(function(attachement) {
            $scope.attachementTypes.forEach(function(attachementType) {
                if (attachementType.hash === attachement.hash)
                    attachementType.attachement = attachement;
            })
        })
    }

    // add attendee to the array
    $scope.addAttendee = function() {
        if (!$scope.participation.attendees)
            $scope.participation.attendees = [];

        $scope.participation.attendees.push({});
    }

    // remove sponsorShipLevel
    $scope.removeAttendee = function(index) {
        $scope.participation.attendees.splice(index, 1);
    }

    $scope.removeAttachement = function(attachement) {
        console.log(attachement.data);


        filepickerService.remove(
            attachement.data,
            function() {
                console.log("Removed");
                console.log(attachement);
                AttachementService.remove(attachement)
                    .success(function(data, status, headers, config) {
                        if (data.isValid) {
                            $scope.showSuccess("Příloha byla úspěšně odstraněna.");
                        }
                        else {
                            $scope.showErrors(data.errors);
                        }
                    })
                    .error(function(data, status) {
                        console.error('Error', status, data);
                    });
            },
            function() {
                console.log("error");
            }
        );
    }

    $scope.downloadAttachement = function(attachement) {
        console.log(attachement);
        filepickerService.exportFile(
            attachement,
            { language: 'cs' },
            function(Blob) {
                console.log(Blob.url);
            }
        );
    }

    $scope.uploadAttachement = function(attachementTypeHash) {
        filepickerService.pick(
            {
                mimetype: 'application/pdf',
                language: 'cs',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE'],
                openTo: 'COMPUTER'
            },
            //attachement saved to filestack
            function(Blob) {
                $scope.attachement.data = Blob;
                $scope.attachement.hash = attachementTypeHash;
                $scope.attachement.date = Date.now();
                $scope.attachement.participation = $scope.participation._id;
                $scope.participation.attachements.push($scope.attachement);
                //$scope.$apply();

                // save attachement to MongoDB
                AttachementService.save($scope.attachement)
                    .success(function(data, status, headers, config) {
                        if (data.isValid) {
                            $scope.showSuccess("Příloha byla úspěšně uložena.");
                        }
                        else {
                            $scope.showErrors(data.errors);
                        }
                    })
                    .error(function(data, status) {
                        console.error('Error', status, data);
                    });


            }
        );
    };

    // save updated participation
    $scope.updateParticipation = function() {
        ParticipationService.save($scope.participation)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Účast byla úspěšně atualizována.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // set selected conference and its participation
    var setConferenceAndParticipation = function() {
        $scope.participations.forEach(function(participation) {
            $scope.ParticipatedConferences.push(participation.conference);
            if (participation.conference.active) {
                $scope.conference = participation.conference;
                $scope.participation = participation;
            }
        })
        if (!$scope.conference) {
            $scope.conference = $scope.ParticipatedConferences[0];
            $scope.participation = $scope.participations[0];
        }
        if ($scope.conference._id) {
            getAttachementTypes();
        }
    }

    // create new participation of participant
    $scope.addParticipation = function() {
        $scope.newParticipation.user = $scope.participant._id;
        $scope.newParticipation.state = "APPROVED";
        ParticipationService.save($scope.newParticipation)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Účastník byl úspěšně přidán na konferenci.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // load participant detail
    var loadParticipant = function() {
        UserService.get($stateParams.participantId)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.participant = data.data;
                    loadParticipations();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // load conferences, which participant didnt participate
    var loadOtherConferences = function() {
        ConferenceService.getFilteredList(getConferencesIDs($scope.participations))
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.otherConferences = data.data;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // get conferences IDs from participations
    var getConferencesIDs = function(array) {
        var IDsArray = [];
        array.forEach(function(object) {
            IDsArray.push(object.conference._id);
        });
        return IDsArray;
    }

    // get all pariticipations of user
    var loadParticipations = function() {
        ParticipationService.getList($scope.participant._id)
            .success(function(data, status, headers, config) {
                if (data.isValid) {
                    $scope.participations = data.data;
                    setConferenceAndParticipation();
                    loadOtherConferences();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    // save changes in participant(user)
    $scope.saveParticipant = function() {
        if (!$scope.participant.address) {
            $scope.participant.address = {};
        }
        UserService.save($scope.participant)
            .success(function(data) {
                if (data.isValid) {
                    $scope.showSuccess("Účastník byl úspěšně aktualizován");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.error('Error', status, data);
            });
    }

    loadParticipant();
}]);