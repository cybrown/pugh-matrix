'use strict';

describe('Test IT sur la fonctionnalitée des utilisateurs', function() {
    it('doit avoir le bon contenu dans le titre', function() {
        browser.get('/#/users');
        expect(element.all(by.css('h1')).first().getText()).toEqual('Users');
    });

    it('doit apparaitre un utilisateur lorsque l on clique sur le boutton d\'édition', function() {
        browser.get('/#/users');
        element(by.id('btnShowUser')).click();

        var list = element.all(by.css('.usersEdit li'));
        expect(list.count()).toBe(1);
    });
});
