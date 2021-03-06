/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('ParticipantCtrl', []).controller('ParticipantController', ['$scope', '$state', '$stateParams', '$timeout', 'UserService', 'ConferenceService', 'ParticipationService', 'SessionService', 'MessageService', 'filepickerService', 'AttachementService', '$rootScope', function ($scope, $state, $stateParams, $timeout, UserService, ConferenceService, ParticipationService, SessionService, MessageService, filepickerService, AttachementService, $rootScope) {
    // active menu structure
    if (SessionService.currentUser.role == "PARTICIPANT") {
        $rootScope.menu = {
            dashboard: false,
            actionAdministration: true,
            helpdesk: false,
            participants: false,
            administration: false,
            profile: false
        }
    }
    else {
        $rootScope.menu = {
            dashboard: false,
            actionAdministration: false,
            helpdesk: false,
            participants: true,
            administration: false,
            profile: false
        }
    }
    // initialization
    $scope.today = new Date();
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
    // attachement
    $scope.attachement = {};
    // loader - active
    $rootScope.loader = true;
    // deleting attachement
    $scope.deletingAttachement = {};
    // show and close modal for confirm operation
    $scope.showModal = function () {
        setTimeout(function () { $('.small.modal').modal('show'); }, 50);
    }
    $scope.closeModal = function () {
        setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
    }
    
   $scope.showModalAttachement = function (attachement) {
        $scope.deletingAttachement = attachement;
        setTimeout(function () { $('.small.modal.attachement').modal('show'); }, 50);
    }
    $scope.closeModalAttachement = function () {
        setTimeout(function () { $('.small.modal.attachement').modal('hide'); }, 50);
        $scope.deletingAttachement = {};
    }
    // remvove participation
    $scope.removeParticipation = function () {
        var deletedParticipation = {};
        deletedParticipation._id = $scope.participation._id;
        deletedParticipation.user = $scope.participation.user;
        deletedParticipation.conference = $scope.participation.conference._id;
        ParticipationService.delete(deletedParticipation)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Účast byla úspěšně odebrána.");
                    $state.go('home.participants');
                    setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
                }
                else {
                    $scope.showErrors(data.errors);
                    setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }
    // change conference for detail
    $scope.changeConference = function () {
        $scope.participations.forEach(function (participation) {
            if (participation.conference._id == $scope.conference._id) {
                $scope.participation = participation;
                setTimeout(function () { $('.ui.dropdown').dropdown(); }, 500);
            }
        });
        getAttachementTypes();
    }
    // mark message as seen
    $scope.markAsSeen = function (message) {
        message.seen = true;
        MessageService.save(message)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Zpráva byla označena za přečtenou.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    // send new message to the server
    $scope.sendMessage = function () {
        $rootScope.loader = true;
        $scope.message.date = new Date();
        $scope.message.author = $scope.session.currentUser._id;
        $scope.message.participation = $scope.participation._id;
        $scope.message.seen = false;
        $scope.message.userRole = $scope.session.currentUser.role;
        MessageService.save($scope.message)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Zpráva byla úspěšně odeslána.");
                    loadParticipant();
                    $scope.message = {};
                    $rootScope.loader = false;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }
    // get sponsorshipLevel documents
    var getAttachementTypes = function () {
        $scope.attachementTypes = [];
        if ($scope.participation.sponsorshipLevel) {
            $scope.conference.sponsorshipLevels.forEach(function (sponsorshipLevel) {
                if (sponsorshipLevel._id === $scope.participation.sponsorshipLevel.type._id) {
                    $scope.attachementTypes = sponsorshipLevel.attachementTypes;
                    $scope.attachementTypes.forEach(function (type) {
                        type.beforeDeadline = true;
                        var today = new Date($scope.today);
                        var typeDate = new Date(type.date);
                        if (typeDate < today) {
                            type.beforeDeadline = false;
                        }
                    })
                }

            })
        }
        assignAttachement();
    }
    // assign attachement to atttachement type
    var assignAttachement = function () {
        $scope.participation.attachements.forEach(function (attachement) {
            $scope.attachementTypes.forEach(function (attachementType) {
                if (attachementType.hash === attachement.hash)
                    attachementType.attachement = attachement;
            })
        })
    }

    // add attendee to the array
    $scope.addAttendee = function () {
        if (!$scope.participation.attendees)
            $scope.participation.attendees = [];

        $scope.participation.attendees.push({});
    }

    // remove sponsorShipLevel
    $scope.removeAttendee = function (index) {
        $scope.participation.attendees.splice(index, 1);
    }
    // remove attachement
    $scope.removeAttachement = function () {

        filepickerService.remove(
            $scope.deletingAttachement.data,
            function () {
                AttachementService.remove($scope.deletingAttachement)
                    .success(function (data, status, headers, config) {
                        if (data.isValid) {
                            loadParticipant();
                            $scope.closeModalAttachement();
                            $scope.showSuccess("Příloha byla úspěšně odstraněna.");
                        }
                        else {
                            $scope.showErrors(data.errors);
                        }
                    })
                    .error(function (data, status) {
                        console.error('Error', status, data);
                    });
            },
            function () {
                console.log("error");
            }
        );
    }
    // download attachement
    $scope.downloadAttachement = function (attachement) {
        filepickerService.exportFile(
            attachement,
            { language: 'cs' },
            function (Blob) {
                console.log(Blob.url);
            }
        );
    }
    // upload attachement
    $scope.uploadAttachement = function (attachementTypeHash) {
        filepickerService.pick(
            {
                mimetypes: ['application/pdf', 'image/png'],
                language: 'cs',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE'],
                openTo: 'COMPUTER'
            },
            //attachement saved to filestack
            function (Blob) {
                $scope.attachement.data = Blob;
                $scope.attachement.hash = attachementTypeHash;
                $scope.attachement.date = Date.now();
                $scope.attachement.participation = $scope.participation._id;
                $scope.participation.attachements.push($scope.attachement);
                //$scope.$apply();

                // save attachement to MongoDB
                AttachementService.save($scope.attachement)
                    .success(function (data, status, headers, config) {
                        if (data.isValid) {
                            loadParticipant();
                            $scope.showSuccess("Příloha byla úspěšně uložena.");
                        }
                        else {
                            $scope.showErrors(data.errors);
                        }
                    })
                    .error(function (data, status) {
                        console.error('Error', status, data);
                    });


            }
        );
    };

    // save updated participation
    $scope.updateParticipation = function () {
        ParticipationService.save($scope.participation)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.showSuccess("Účast byla úspěšně atualizována.");
                    $state.go('home.participants');
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    // set selected conference and its participation
    var setConferenceAndParticipation = function () {
        $scope.participations.forEach(function (participation) {
            $scope.ParticipatedConferences.push(participation.conference);
            if (participation.conference.active) {
                $scope.conference = participation.conference;
                setTimeout(function () { $('.ui.dropdown').dropdown(); }, 500);
                $scope.participation = participation;
            }
        })
        if (!$scope.conference._id) {
            $scope.conference = $scope.ParticipatedConferences[0];
            $scope.participation = $scope.participations[0];
        }
        if ($scope.conference) {
            getAttachementTypes();
        }
        $rootScope.loader = false;
    }

    // create new participation of participant
    $scope.addParticipation = function () {
        $scope.newParticipation.user = $scope.participant._id;
        $scope.newParticipation.state = "APPROVED";
        ParticipationService.save($scope.newParticipation)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $state.go('home.participants');
                    $scope.showSuccess("Účastník byl úspěšně přidán na konferenci.");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    // load participant detail
    var loadParticipant = function () {
        UserService.get($stateParams.participantId)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.participant = data.data;
                    loadParticipations();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    // load conferences, which participant didnt participate
    var loadOtherConferences = function () {
        ConferenceService.getFilteredList(getConferencesIDs($scope.participations))
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.otherConferences = data.data;
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    // get conferences IDs from participations
    var getConferencesIDs = function (array) {
        var IDsArray = [];
        array.forEach(function (object) {
            IDsArray.push(object.conference._id);
        });
        return IDsArray;
    }

    // get all pariticipations of user
    var loadParticipations = function () {
        ParticipationService.getList($scope.participant._id)
            .success(function (data, status, headers, config) {
                if (data.isValid) {
                    $scope.participations = data.data;
                    setConferenceAndParticipation();
                    loadOtherConferences();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    // save changes in participant(user)
    $scope.saveParticipant = function () {
        if (!$scope.participant.address) {
            $scope.participant.address = {};
        }
        UserService.save($scope.participant)
            .success(function (data) {
                if (data.isValid) {
                    $state.go('home.participants');
                    $scope.showSuccess("Účastník byl úspěšně aktualizován");
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.error('Error', status, data);
            });
    }

    loadParticipant();
}]);