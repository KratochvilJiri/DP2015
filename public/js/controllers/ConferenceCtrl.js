angular.module('ConferenceCtrl',[]).controller('ConferenceController',['$scope','$timeout', 'ConferenceService' ,function($scope,$timeout, ConferenceService){
    $scope.conference = {};
    $scope.conference.active = false;
    $scope.conference.sponsorshipLevels = [];
    $scope.allConference = [];
    
    var loadAllConference = function() {
        // to do
    }
    
    // add sponsorShipLevel
    $scope.addSponsorshipLevel = function () {
        if(!$scope.conference.sponsorshipLevels)
            $scope.conference.sponsorshipLevels = [];
        
        $scope.conference.sponsorshipLevels.push({});
    }
    
    // remove sponsorShipLevel
    $scope.removeSponsorshipLevel = function (index){
        $scope.conference.sponsorshipLevels.splice(index,1);
    }
    
    // add new document to conference
    $scope.addAttachementType = function () {
        if(!$scope.conference.attachementTypes)
            $scope.conference.attachementTypes = [];
        
        var GUID = guid();
        $scope.conference.attachementTypes.push({
            hash: GUID
        });
    }
    
    // remove document
    $scope.removeAttachementType = function (index){
        removeAttachTypeFromSponsorshipLvl(index);
        $scope.conference.attachementTypes.splice(index,1);
    }
    
    // save conference
    $scope.save = function () {
        console.log($scope.conference);
        //console.log($scope.conference.attachementTypes);
        /*ConferenceService.save($scope.conference)
        .success = function (data) {
            if(data.isValid){
                loadAllConference;
                $scope.showSuccess("Konference byla úspěšně aktualizována/přidána");
            }
            else{
                $scope.showErros(data.errors);
            }
        }
        .error(function(data, status){
 			console.error('Error: ', status, data.error);
 		}); */
    }
    
    // remove deleted Attachement from SponsorshipLevels
    var removeAttachTypeFromSponsorshipLvl = function (index) {     
        $scope.conference.sponsorshipLevels.forEach(function(sponsorShipLevel) {
            if(sponsorShipLevel.attachementTypes){
                sponsorShipLevel.attachementTypes.forEach(function (attachementType, index, attachementTypes) {
                    if(attachementType.hash === $scope.conference.attachementTypes[index].hash){
                        attachementTypes.splice(index,1);
                    }
                })
            }
        })
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