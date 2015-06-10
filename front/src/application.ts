import home = require('./home/home');
declare var CONFIG: {[key: string]: any};

const appModule = angular.module('pugh', [
    'ui.router',
    'templates',
    'gettext',
    home.HomeModule.name
]).config(['$urlRouterProvider', ($urlRouterProvider: ng.ui.IUrlRouterProvider) => {
    $urlRouterProvider.otherwise('/home');
}]);

Object.keys(CONFIG).forEach(key => {
    appModule.constant(key, CONFIG[key]);
});
