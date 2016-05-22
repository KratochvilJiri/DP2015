/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

module.exports = function (app) {

    var IssueService = require('./../services/IssueService');
    // save
    app.post('/api/issue', function (req, res) {
        IssueService.save(req.body, function (validation) {
            res.json(validation);
        });
    });
    // get all
    app.get('/api/issue', function (req, res) {
        IssueService.getAll(function (validation) {
            res.json(validation);
        });
    });
    // get by ID
    app.post('/api/issue/:issueID', function (req, res) {
        IssueService.get({
            _id: req.params.issueID
        }, function (validation) {
            res.json(validation);
        });
    });
    // get all unsolved
    app.get('/api/issue/unsolved', function (req, res) {
        IssueService.getUnsolvedCount(function (validation) {
            res.json(validation);
        });
    });
    // get unseen issue messages by role 
    app.post('/api/issue/unseen/:userRole', function (req, res) {
        IssueService.getUnseenMessages(req.params.userRole, function (validation) {
            res.json(validation);
        });
    });

};