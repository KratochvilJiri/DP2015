/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module('ConferenceCtrl', []).controller('ConferenceController', ['$scope','$filter', '$timeout', '$state', 'ConferenceService', 'SessionService', 'AttachementService', '$rootScope', function ($scope,$filter, $timeout, $state, ConferenceService, SessionService, AttachementService, $rootScope) {
    // active menu structure
    $rootScope.menu = {
        dashboard: false,
        actionAdministration: false,
        helpdesk: false,
        participants: false,
        administration: true,
        profile: false
    }

    // initialization
    $scope.session = SessionService;
    $scope.conference = {};
    $scope.conference.sponsorshipLevels = [];
    $scope.allConference = [];
    $rootScope.loader = true;
    // show and close modals for confirm operations
    $scope.showModal = function () {
        setTimeout(function () { $('.small.modal').modal('show'); }, 50);
    }
    $scope.closeModal = function () {
        setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
    }
    // remove conference
    $scope.removeConference = function () {
        ConferenceService.delete($scope.conference._id)
            .success(function (data) {
                if (data.isValid) {
                    setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
                    $scope.showSuccess("Konference byla úspěšně odstraněna");
                    $state.go('home.dashboard');
                }
                else {
                    setTimeout(function () { $('.small.modal').modal('hide'); }, 50);
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }
    // check attachements count of conference
    var checkAttachements = function (count) {
        if (count > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    // load all conference
    var loadAllConference = function () {
        ConferenceService.getAll()
            .success(function (data) {
                if (data.isValid) {
                    $scope.allConference = data.data;
                    setActiveConference();
                }
                else {
                    $scope.showErrors(data.errors);
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }
    // get attachements types for conference
    var getAttachementTypesForLevel = function () {
        var isAssigned = true;
        $scope.conference.sponsorshipLevels.forEach(function (level) {
            level.possibleAttachementTypes = [];
            $scope.conference.attachementTypes.forEach(function (type) {
                level.attachementTypes.forEach(function (attachementTypeInLevel) {
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
        setTimeout(function () { $('.ui.dropdown').dropdown(); }, 20);
        $rootScope.loader = false;
    }

    // check attachements
    var checkAttachements = function () {
        $scope.conference.attachementTypes.forEach(function (type) {
            AttachementService.existsAttachementType(type.hash)
                .success(function (data) {
                    if (data.isValid) {
                        type.count = data.data;
                    }
                    else {
                        $scope.showErrors(data.errors);
                    }
                })
                .error(function (data, status) {
                    console.log('Error: ', status, data.error);
                });
        })
    }
    // set active conference
    var setActiveConference = function () {
        $scope.allConference.forEach(function (conference) {
            if (conference.active) {
                $scope.conference = conference;
                $scope.conference.date = $filter('date')($scope.conference.date, "yyyy/MM/dd");
                if($scope.conference.attachementTypes){
                    $scope.conference.attachementTypes.forEach(function(attachementType){
                        attachementType.date = $filter('date')(attachementType.date, "yyyy/MM/dd");
                    })
                }
                checkAttachements();
                getAttachementTypesForLevel();
            }
        })
    }
    // add new conference
    $scope.addConference = function () {
        $scope.conference = {};
        $scope.conference.notification = "5";
        setTimeout(function () { $('.ui.dropdown').dropdown(); }, 20);
    }

    // add sponsorShipLevel
    $scope.addSponsorshipLevel = function () {
        if (!$scope.conference.sponsorshipLevels)
            $scope.conference.sponsorshipLevels = [];

        $scope.conference.sponsorshipLevels.push({});
    }

    // remove sponsorShipLevel
    $scope.removeSponsorshipLevel = function (index) {
        $scope.conference.sponsorshipLevels.splice(index, 1);
    }

    // add new document to conference
    $scope.addAttachementType = function () {

        if (!$scope.conference.attachementTypes)
            $scope.conference.attachementTypes = [];

        var GUID = guid();
        $scope.conference.attachementTypes.push({
            hash: GUID
        });

        getAttachementTypesForLevel();

    }

    // remove document
    $scope.removeAttachementType = function (index) {
        removeAttachTypeFromSponsorshipLvl($scope.conference.attachementTypes[index].hash);
        $scope.conference.attachementTypes.splice(index, 1);
        getAttachementTypesForLevel();
    }
    // upload attachement types in levels
    var uploadATypesAtSLevels = function () {
        if ($scope.conference.sponsorshipLevels) {
            $scope.conference.sponsorshipLevels.forEach(function (level) {
                level.attachementTypes.forEach(function (LType) {
                    $scope.conference.attachementTypes.forEach(function (AType) {
                        if (LType.hash == AType.hash) {
                            LType.date = AType.date;
                            LType.name = AType.name;
                        }
                    })
                })
            })
        }
    }

    // save conference
    $scope.save = function () {
        $rootScope.loader = true;
        $scope.conference.active = true;
        uploadATypesAtSLevels();
        SessionService.currentUser.conferenceID = $scope.conference._id;
        ConferenceService.save($scope.conference)
            .success(function (data) {
                if (data.isValid) {
                    $scope.showSuccess("Konference byla úspěšně aktualizována/přidána");
                    $rootScope.loader = false;
                    $state.go('home.dashboard');
                    //loadAllConference();
                }
                else {
                    $scope.showErrors(data.errors);
                    $rootScope.loader = false;
                }
            })
            .error(function (data, status) {
                console.log('Error: ', status, data.error);
            });
    }

    // remove deleted Attachement from SponsorshipLevels
    var removeAttachTypeFromSponsorshipLvl = function (deletedHash) {
        $scope.conference.sponsorshipLevels.forEach(function (sponsorShipLevel) {
            if (sponsorShipLevel.attachementTypes) {
                sponsorShipLevel.attachementTypes.forEach(function (attachementType, index) {
                    if (attachementType.hash === deletedHash) {
                        sponsorShipLevel.attachementTypes.splice(index, 1);
                    }
                })
            }
        })
    }

    if ($scope.session.currentUser.conferenceID) {
        loadAllConference();
    }
    else {
        $rootScope.loader = false;
    }


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