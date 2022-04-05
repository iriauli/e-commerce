@isTest
public class SF_EmailControllerTest {

    @TestSetup
    static void makeData(){
        Account testAccount = new Account(Name='Sandro');
        insert testAccount;
        
        Order__c testOrder = new Order__c(Account__c = testAccount.Id);
        insert testOrder;
    }

    @isTest
    static void sendMailTest(){
        Account acc = [SELECT Id FROM Account WHERE Name='Sandro'];
        List<Order__c> testOrder = [SELECT Id FROM Order__c WHERE Account__c =:acc.Id];

        Id orderId = testOrder[0].Id;
        System.debug(orderId + 'Test');
        SF_EmailController.sendMail(orderId);
    }
    
}
