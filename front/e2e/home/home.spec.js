'use strict';

describe('Test IT sur la page d\'accueil', function() {
    it('doit avoir un lien vers les utilisateurs', function() {
        browser.get('/#');
        expect(element(by.id('titreHome')).getText()).toEqual('Home');
        expect(element(by.id('linkShowUsers')).getText()).toEqual('User list');
        expect(element(by.id('linkShowI18n')).getText()).toEqual('Internationalization');
    });

    it('lorsque l\'on clique sur le lien "User List", une liste des utilisateurs apparait', function() {
        browser.get('/#');
        element(by.id('linkShowUsers')).click();

        var list = element.all(by.css('.users li'));
        expect(list.count()).toBe(2);
    });

    it('doit apparaitre un utilisateur lorsque l on clique sur le boutton d\'édition', function() {
        browser.get('/#');
        element(by.id('linkShowUsers')).click();
        element(by.id('btnShowUser')).click();

        var list = element.all(by.css('.usersEdit li'));
        expect(list.count()).toBe(1);
    });
});
