angular.module('ConferenceCtrl', []).controller('ConferenceController', ['$scope', '$timeout', '$state', 'ConferenceService', 'SessionService', function($scope, $timeout, $state, ConferenceService, SessionService) {
    $scope.session = SessionService;
    $scope.conference = {};
    $scope.conference.sponsorshipLevels = [];
    $scope.allConference = [];

    var loadAllConference = function() {
        ConferenceService.getAll()
            .success(function(data) {
                if (data.isValid) {
                    $scope.allConference = data.data;
                    setActiveConference();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    var getAttachementTypesForLevel = function() {
        var isAssigned = true;
        $scope.conference.sponsorshipLevels.forEach(function(level) {
            level.possibleAttachementTypes = [];
            // console.log(level);
            $scope.conference.attachementTypes.forEach(function(type) {
                level.attachementTypes.forEach(function(attachementTypeInLevel) {
                    if (type.hash == attachementTypeInLevel.hash) {
                        isAssigned = false;
                    }
                })
                if (isAssigned) {
                    level.possibleAttachementTypes.push(type);
                }
                else {
                    isAssigned = true;
                }
            })
        })
        console.log($scope.conference);
    }

    var setActiveConference = function() {
        $scope.allConference.forEach(function(conference) {
            if (conference.active) {
                $scope.conference = conference;
                console.log($scope.conference.sponsorshipLevels); 
                getAttachementTypesForLevel();
                
            }
        })
    }

    $scope.addConference = function() {
        $scope.conference = {};
    }

    // add sponsorShipLevel
    $scope.addSponsorshipLevel = function() {
        if (!$scope.conference.sponsorshipLevels)
            $scope.conference.sponsorshipLevels = [];

        $scope.conference.sponsorshipLevels.push({});
    }

    // remove sponsorShipLevel
    $scope.removeSponsorshipLevel = function(index) {
        $scope.conference.sponsorshipLevels.splice(index, 1);
    }

    // add new document to conference
    $scope.addAttachementType = function() {
        
        if (!$scope.conference.attachementTypes)
            $scope.conference.attachementTypes = [];

        var GUID = guid();
        $scope.conference.attachementTypes.push({
            hash: GUID
        });
        
        getAttachementTypesForLevel();

    }

    // remove document
    $scope.removeAttachementType = function(index) {
        removeAttachTypeFromSponsorshipLvl($scope.conference.attachementTypes[index].hash);
        $scope.conference.attachementTypes.splice(index, 1);
        getAttachementTypesForLevel();
    }

    // save conference
    $scope.save = function() {
        $scope.conference.active = true;
        SessionService.currentUser.conferenceID = $scope.conference._id;
        //console.log($scope.conference.attachementTypes);
        ConferenceService.save($scope.conference)
            .success(function(data) {
                if (data.isValid) {
                    $scope.showSuccess("Konference byla úspěšně aktualizována/přidána");
                    $state.go('home.dashboard');
                    //loadAllConference();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function(data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    // remove deleted Attachement from SponsorshipLevels
    var removeAttachTypeFromSponsorshipLvl = function(deletedHash) {
        $scope.conference.sponsorshipLevels.forEach(function(sponsorShipLevel) {
            if (sponsorShipLevel.attachementTypes) {
                sponsorShipLevel.attachementTypes.forEach(function(attachementType, index) {
                    if (attachementType.hash === deletedHash) {
                        sponsorShipLevel.attachementTypes.splice(index, 1);
                    }
                })
            }
        })
    }

    loadAllConference();


    // unique hash creator
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

}]);