@isTest
public with sharing class SF_AddToCartControllerTest {
    @TestSetup
    public static void initialData(){
        Account testAccount = new Account(Name='Sandro');
        insert testAccount;
        
        Product__c testProduct = new Product__c(Name='Nvidia');
        insert testProduct;

        Product__c testProduct2 = new Product__c(Name='Radeon');
        insert testProduct2;

        Product__c testProduct3 = new Product__c(Name='AMD');
        insert testProduct3;
    }
    
    // create new cart and new cart line item
    @isTest
    static void addProductToCartTest() {

        List<Product__c> testProduct = [SELECT Id From Product__c WHERE Name='Nvidia' LIMIT 1];
        Id productId = testProduct[0].Id;
        Integer quantity = 1;

        
        SF_AddToCartController.addProductToCart(productId, quantity);
        List<Account> testAccount = [SELECT Id FROM Account WHERE Name = 'Sandro'];
        List<Cart__c> testCart = [SELECT Id FROM Cart__c WHERE Account__c =:testAccount[0].Id LIMIT 1];
        List<Cart_Line_Item__c> testCartLineItem = [SELECT Id FROM Cart_Line_Item__c WHERE Cart__c =:testCart[0].Id LIMIT 1];

        System.assert(testCartLineItem.size() > 0, 'Cart line item error');
    }

    @isTest
    static void addProductToCartTest2() {
        List<Account> testAccount = [SELECT Id From Account WHERE Name='Sandro' LIMIT 1];
        Cart__c testCart = new Cart__c(Account__c = testAccount[0].Id, Status__c = 'Draft');
        insert testCart;

        List<Product__c> testProduct2 = [SELECT Id From Product__c WHERE Name='Radeon' LIMIT 1];
        Id productId = testProduct2[0].Id;
        Integer quantity = 1;
        SF_AddToCartController.addProductToCart(productId, quantity);
        
        List<Cart_Line_Item__c> items = [SELECT Id FROM Cart_Line_Item__c WHERE Product__c =:productId];
        System.assert(items.size() > 0, 'second Cart line item error');
    }
        @isTest
        static void addProductToCartTest3() {
            List<Account> testAccount = [SELECT Id From Account WHERE Name='Sandro' LIMIT 1];
            Cart__c testCart = new Cart__c(Account__c = testAccount[0].Id, Status__c = 'Draft');
            insert testCart;
    
            List<Product__c> testProduct3 = [SELECT Id From Product__c WHERE Name='AMD' LIMIT 1];
            
            Id productId = testProduct3[0].Id;
            Integer quantity = 1;
            
            SF_AddToCartController.addProductToCart(productId, quantity);
            SF_AddToCartController.addProductToCart(productId, quantity);

            List<Cart_Line_Item__c> item = [SELECT Id, Quantity__c FROM Cart_Line_Item__c WHERE Product__c =:productId LIMIT 1];
            System.assert(item[0].Quantity__c > 1, 'cart line item qantity was not updated');
        }

}
