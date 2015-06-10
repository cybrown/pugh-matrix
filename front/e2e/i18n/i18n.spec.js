'use strict';

describe('Test IT sur la page d\'accueil', function() {
    it('doit avoir le bon contenu', function() {
        browser.get('/#/i18n');
        expect(element.all(by.css('h1')).first().getText()).toEqual('Internationalization');
        expect(element.all(by.css('a')).first().getText()).toEqual('English');
        expect(element.all(by.css('a')).last().getText()).toEqual('French');
        expect(element.all(by.css('p')).first().getText()).toEqual('This is a text in english');
    });

    it('lorsque l\'on clique sur le lien "French", le site change de langue', function() {
        browser.get('/#/i18n');
        expect(element.all(by.css('h1')).first().getText()).toEqual('Internationalization');
        expect(element.all(by.css('a')).first().getText()).toEqual('English');
        expect(element.all(by.css('a')).last().getText()).toEqual('French');
        expect(element.all(by.css('p')).first().getText()).toEqual('This is a text in english');
        element.all(by.css('a')).last().click();
        expect(element.all(by.css('h1')).first().getText()).toEqual('Internationalisation');
        expect(element.all(by.css('a')).first().getText()).toEqual('Anglais');
        expect(element.all(by.css('a')).last().getText()).toEqual('Français');
        expect(element.all(by.css('p')).first().getText()).toEqual('Ceci est un texte en français');
    });
});
