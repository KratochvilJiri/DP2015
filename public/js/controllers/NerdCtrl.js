// public/js/controllers/NerdCtrl.js
angular.module('NerdCtrl', []).controller('NerdController', function($scope,$http) {

    console.log("ahoj"); 
    $scope.formData = {};
    
    // when landing on the page, get all todos and show them
    $http.get('/api/nerds')
        .success(function(data) {
            $scope.nerds = data;
            console.log("ahoj"); 
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createNerd = function() {
        $http.post('/api/nerds', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.nerds = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteNerd = function(id) {
        $http.delete('/api/nerds/' + id)
            .success(function(data) {
                $scope.nerds = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});