angular.module('ConferenceCtrl',[]).controller('ConferenceController',['$scope', 'ConferenceService' ,function($scope, ConferenceService){
    $scope.conference = {};
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
        
        $scope.conference.attachementTypes.push({});
    }
    
    // remove document
    $scope.removeAttachementType = function (index){
        $scope.conference.attachementTypes.splice(index,1);
    }
    
    // save conference
    $scope.save = function () {
        console.log($scope.conference);
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
    
       
}]);