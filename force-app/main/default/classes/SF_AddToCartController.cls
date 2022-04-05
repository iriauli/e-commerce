/*
* ============================================
* @apexClassName: SF_AddToCartController.cls
* @description: Apex class that includes product add methods to the cart
* @author: Irakli Iriauli
* @dateCreated: 07/03/2022
* @lastChange: 09/03/2022 by Irakli Iriauli
* ============================================
*/
public with sharing class SF_AddToCartController {
    
    /*
     * @author: Irakli Iriauli
     * @description: Add products to cart
     */
    @AuraEnabled 
    public static void addProductToCart(Id productId, Integer quantity){
        
        List<Account> accountsList = [SELECT Id FROM Account WHERE Name ='Sandro' LIMIT 1]; // Name
        
        List<Cart__c> cart = [SELECT Id From Cart__c WHERE Account__c in:accountsList AND Status__c ='Draft' LIMIT 1];
        if (cart.isEmpty()) {
            Cart__c newCart = new Cart__c(
                Account__c = accountsList[0].Id,
                Status__c = 'Draft');
            insert newCart;

            List<Product__c> product = [SELECT Id, Name, Price__c, Description__c from Product__c WHERE id =:productId LIMIT 1];
            Cart_Line_Item__c newCartLineItem = new Cart_Line_Item__c(
                Cart__c = newCart.Id,
                Product__c = productId,
                Product_Description__c = product[0].Description__c,
                Price__c = product[0].Price__c,
                Quantity__c = quantity);
            insert newCartLineItem;

        } else {
            List<Cart_Line_Item__c> cartLineItem = [SELECT Id, Product_Name__c, Quantity__c, Product_Description__c, Price__c FROM Cart_Line_Item__c WHERE Cart__c =:cart[0].Id AND Product__c =:productId];
            if (cartLineItem.isEmpty()) {
                List<Product__c> product = [SELECT Id, Name, Price__c, Description__c from Product__c WHERE id =:productId LIMIT 1];
                Cart_Line_Item__c newCartLineItem = new Cart_Line_Item__c(
                    Cart__c = cart[0].Id,
                    Product__c = productId,
                    Product_Description__c = product[0].Description__c,
                    Price__c = product[0].Price__c,
                    Quantity__c = quantity);
                insert newCartLineItem;

            } else {
                cartLineItem[0].Quantity__c += quantity;
                update cartLineItem;    
            }
        }  
    }
}
