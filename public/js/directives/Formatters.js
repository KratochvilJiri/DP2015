/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce)
*/

angular.module('formatters', [])
.directive("formatDate", function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, modelCtrl) {
            modelCtrl.$formatters.push(function (modelValue) {
                return new Date(modelValue);
            })
        }
    }
})