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
};