/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

angular.module("EmailSrvc", []).factory("EmailService", ["$http", function ($http) {

	return {
		getAll: function () {
			return $http.post("/api/email");
		},
        getNewEmailsCount: function () {
			return $http.post("/api/email/newEmailsCount");
		},
        markAsSeen: function (emailID) {
			return $http.post("/api/email/mark/" + emailID);
		},
        remove: function (emailID) {
			return $http.post("/api/email/remove/" + emailID);
		},
        send: function (emailStructure) {
            return $http.post("/api/email/send", emailStructure);
        },
		recoveryPassword: function (email) {
			return $http.post("/api/email/recoveryPassword", email);
		}
	}

}]);