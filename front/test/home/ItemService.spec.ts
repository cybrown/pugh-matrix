import {ItemService, HomeModule} from '../../src/home/home';

describe('user.UserService', () => {
	
	beforeEach(window.module(HomeModule.name));
	
	var itemService: ItemService;
	
	beforeEach(inject(function() {
		itemService = new ItemService();
	}));
	
	it('doit ajouter un critère', () => {
        itemService.addCriteria('test');
        expect(itemService.criterias).have.length(1);
	});
	
	it('ne doit pas ajouter un critère si le nom est déjà pris', () => {
        itemService.addCriteria('test');
        itemService.addCriteria('test');
        expect(itemService.criterias).have.length(1);
	});
    
    it ('doit supprimer un critère', () => {
        itemService.addCriteria('a');
        itemService.addCriteria('b');
        itemService.addItem('d');
        itemService.addItem('e');
        
        itemService.removeCriteria('a');
        
        expect(itemService.criterias).have.length(1);
        expect(itemService.criterias[0].name).to.equal('b');
        expect(Object.keys(itemService.items[0].scores).length).to.equal(1);
        expect(Object.keys(itemService.items[1].scores).length).to.equal(1);
    });
    
    it ('doit supprimer un item', () => {
        itemService.addCriteria('a');
        itemService.addCriteria('b');
        itemService.addItem('d');
        itemService.addItem('e');
        
        itemService.removeItem('d');
        
        expect(itemService.items.length).to.equal(1);
    });
});
