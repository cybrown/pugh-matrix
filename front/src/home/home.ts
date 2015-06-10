export interface Scores {
    [key: string]: number;
}

export interface Item {
    name: string;
    scores: Scores;
}

export interface Criteria {
    name: string;
    label: string;
    weight: number;
}

export class ItemService {

    items: Item[] = [];
    criterias: Criteria[] = [];

    addCriteria(newCriteriaName: string) {
        if (this.isCriteriaNameAvailable(newCriteriaName)) {
            this.criterias.push({
                name: newCriteriaName,
                label: newCriteriaName,
                weight: 0
            });
            this.items.forEach(item => item.scores[newCriteriaName] = 0);
        }
    }

    removeCriteria(criteriaName: string) {
        const criteria = this.criterias.filter(c => c.name === criteriaName)[0];
        if (criteria != null) {
            this.criterias.splice(this.criterias.indexOf(criteria), 1);
            this.items.forEach(i => {
                delete i.scores[criteriaName];
            });
        }
    }

    renameCriteria(oldCriteriaName: string, newCriteriaName: string) {
        if (this.isCriteriaNameAvailable(newCriteriaName)) {
            this.criterias.filter(c => c.name === oldCriteriaName)
                .forEach(c => {
                    c.name = newCriteriaName;
                    c.label = newCriteriaName;
                });
            this.items.forEach(i => {
                Object.keys(i.scores).filter(key => key === oldCriteriaName)
                    .forEach(key => {
                        i.scores[newCriteriaName] = i.scores[key];
                        delete i.scores[newCriteriaName];
                    });
            });
        }
    }

    renameItem(oldItemName: string, newItemName: string) {
        if (this.isItemNameAvailable(newItemName)) {
            this.items.filter(i => i.name === oldItemName)
                .forEach(i => i.name = newItemName);
            this.items.forEach(i => {
                Object.keys(i.scores).filter(key => key === oldItemName)
                    .forEach(key => {
                        i.scores[newItemName] = i.scores[key];
                        delete i.scores[newItemName];
                    });
            });
        }
    }

    removeItem(itemName: string) {
        const item = this.items.filter(i => i.name === itemName)[0];
        if (item != null) {
            this.items.splice(this.items.indexOf(item), 1);
        }
    }

    addItem(newItemName: string) {
        if (this.isItemNameAvailable(newItemName)) {
            this.items.push({
                name: newItemName,
                scores: this.criterias.reduce((prev, cur) => {
                    prev[cur.label] = 0;
                    return prev;
                }, <Scores>{})
            });
        }
    }

    private isItemNameAvailable(name: string) {
        return this.items.filter(i => i.name === name).length === 0;
    }

    private isCriteriaNameAvailable(name: string) {
        return this.criterias.filter(i => i.name === name).length === 0;
    }

    getWeightsSum() {
        return this.criterias.reduce((prev, cur) => prev + cur.weight, 0);
    }

    getScoresSums() {
        return this.items.map(item => Object.keys(item.scores).reduce((prev, key) => {
            return prev + item.scores[key] * this.criterias.filter(c => c.label === key)[0].weight;
        }, 0));
    }
    
    persist() {
        localStorage.setItem('data', angular.toJson({
            items: this.items,
            criterias: this.criterias
        }));
    }
    
    load() {
        if (localStorage.getItem('data') != null) {
            const data = angular.fromJson(localStorage.getItem('data'));
            this.items = data.items;
            this.criterias = data.criterias;
        }
    }
}

export class HomeController {

    newCriteriaName: string;
    newItemName: string;

    get items() {
        return this.itemService.items;
    }

    get criterias() {
        return this.itemService.criterias;
    }

    get weightsSum() {
        return this.itemService.getWeightsSum();
    }

    get scoresSums() {
        return this.itemService.getScoresSums();
    }

    static $inject = ['WELCOME_MESSAGE', 'itemService'];
    constructor (private WELCOME_MESSAGE: string, private itemService: ItemService) {
        this.itemService.load();
    }

    addCriteria() {
        const newCriteriaName = this.newCriteriaName + '';
        this.itemService.addCriteria(newCriteriaName);
        this.newCriteriaName = '';
        this.itemService.persist();
    }

    addItem() {
        this.itemService.addItem(this.newItemName + '');
        this.newItemName = '';
        this.itemService.persist();
    }

    removeCriteria(criteriaName: string) {
        this.itemService.removeCriteria(criteriaName);
        this.itemService.persist();
    }

    removeItem(itemName: string) {
        this.itemService.removeItem(itemName);
        this.itemService.persist();
    }

    startRenameCriteria(oldName) {
        const newName = prompt();
        if (newName) {
            this.itemService.renameCriteria(oldName, newName);
            this.itemService.persist();
        }
    }

    startRenameItem(oldName) {
        const newName = prompt();
        if (newName) {
            this.itemService.renameItem(oldName, newName);
            this.itemService.persist();
        }
    }
    
    persistData() {
        this.itemService.persist();
    }
}

export var HomeModule = angular.module('pugh.home', ['ui.router'])
    .controller('HomeController', HomeController)
    .service('itemService', ItemService)
    .directive('modelNumber', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elem, attrs, ngModel: ng.INgModelController) {
                ngModel.$parsers.push(v => parseFloat(v) || 0);
            }
        };
    })
    .directive('onUpdate', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope: ng.IScope, elem, attrs, ngModel: ng.INgModelController) {
                ngModel.$viewChangeListeners.push(() => {
                    scope.$eval(attrs.onUpdate);
                });
            }
        };
    })
    .directive('threeInput', function () {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {},
            link: function (scope: ng.IScope, elem, attrs, ngModel: ng.INgModelController) {
                ngModel.$render = () => (<any>scope).value = ngModel.$viewValue;
                scope.$watch('value', () => ngModel.$setViewValue((<any>scope).value));
            },
            template: `
                <button class="btn btn-default" ng-class="{'btn-primary': value == -1}" ng-click="value = -1">-1</button>
                <button class="btn btn-default" ng-class="{'btn-primary': value == 0}" ng-click="value = 0">0</button>
                <button class="btn btn-default" ng-class="{'btn-primary': value == 1}" ng-click="value = 1">1</button>
            `
        };
    })
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
        $stateProvider.state('home', {
            url: '/home',
            controller: 'HomeController',
            controllerAs: 'ctrl',
            templateUrl: 'src/home/home.html'
        });
    }]);
