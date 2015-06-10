import * as express from 'express';

export default function routes (app: express.Express) {

    app.get('/api/users', function (req, res) {
        res.json(require('../../../data/users.json'));
    });

    app.get('/api/users/:id', function (req, res) {
        var users = require('../../../data/users.json');
        users.forEach(function search(element,index,array) {
            if(element.id == req.params.id){
                res.json(element);
            }
        });
    });
}
