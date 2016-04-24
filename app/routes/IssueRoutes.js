module.exports = function(app) {

    var IssueService = require('./../services/IssueService');

    app.post('/api/issue', function(req, res) {
        IssueService.save(req.body, function(validation) {
            res.json(validation);
        });
    });

    app.get('/api/issue', function(req, res) {
        IssueService.getAll(function(validation) {
            res.json(validation);
        });
    });

    app.post('/api/issue/:issueID', function(req, res) {
        IssueService.get({
               _id: req.params.issueID}, function(validation) {
            res.json(validation);
        });
    });
    
        app.get('/api/issue/unsolved', function(req, res) {
        IssueService.getUnsolvedCount(function(validation) {
            res.json(validation);
        });
    });

};