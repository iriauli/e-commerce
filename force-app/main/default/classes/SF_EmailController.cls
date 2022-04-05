/*
* ============================================
* @apexClassName: SF_EmailController.cls
* @description: Send email to the order placement
* @author: Irakli Iriauli
* @dateCreated: 09/03/2022
* @lastChange: 11/03/2022 by Irakli Iriauli
* ============================================
*/
public with sharing class SF_EmailController {

    /*
    * @author: Irakli Iriauli
    * @description: Whenever an order is placed, send email that includes order details to the account owner
    */
    @future
    public static void sendMail(Id orderId) {
        List<Order__c> orderDetails = [SELECT Name, Account__r.owner.email, Total_Price__c, Total_Quantity__c FROM Order__c WHERE Id =:orderId];
        
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {orderDetails[0].Account__r.owner.email};
        String subject = 'Order(' + orderDetails[0].Name + ')';
        mail.setToAddresses(toAddresses);
        mail.setSubject(subject);
        mail.setHtmlBody('Congratulations! your order has been placed.<br><b> Order Name: </b>' + orderDetails[0].Name + '<br><b> Total Quantity: </b>' + orderDetails[0].Total_Quantity__c + '<br><b> Total Price: </b>'+ orderDetails[0].Total_Price__c +'');
        
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }

}