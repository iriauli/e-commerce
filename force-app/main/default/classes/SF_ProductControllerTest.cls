@isTest
public class SF_ProductControllerTest {

    @TestSetup
    static void createData(){
        Product__c product = new Product__c(Name='Nvidia GeForce RTX 3080 Ti');        
        insert product;
    } 

    @isTest
    static void testProductView(){
        Product__c product = [SELECT Id FROM Product__c WHERE Name='Nvidia GeForce RTX 3080 Ti'];
        Id productId = product.Id;
        List<Product__c> currProduct = SF_ProductController.getProductById(productId);
        System.assert(currProduct != null, 'Product was not found');
    }

    @isTest
    static void testPagination(){
        Integer pageSize = 8;
        Integer pageNumber = 8;
        sf_productController.getProductList(pageSize, pageNumber);
        System.assert(sf_productController.getProductList(pageSize, pageNumber).length() > 0, 'null');
    }

    @isTest
    static void testSearchEmpty(){
        System.assert(!SF_ProductController.searchProducts('').isEmpty(), 'Product was not found');
    }  
    
    @isTest
    static void testSearch(){
        System.assert(!SF_ProductController.searchProducts('A').isEmpty(), 'Product was found');
    }
    
}
