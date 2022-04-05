/*
* ============================================
* @apexClassName: SF_AddToCartController.cls
* @description: Apex class that includes data retrieve, pagination and search methods
* @author: Irakli Iriauli
* @dateCreated: 25/02/2022
* @lastChange: 01/03/2022 by Irakli Iriauli
* ============================================
*/
public class SF_ProductController {
     
    /*
     * @author: Irakli Iriauli
     * @description: Pagination method
     */
    @AuraEnabled
    public static String getProductList(Integer pageSize, Integer pageNumber){
        String jsonData = '';
         
        //Offset for SOQL
        Integer offset = (pageNumber - 1) * pageSize;
         
        //Total Records
        Integer totalRecords = [SELECT COUNT() FROM Product__c];
        Integer recordEnd = pageSize * pageNumber;
         
        ProductsWrapper objData = new ProductsWrapper();
        objData.pageSize = pageSize;
        objData.pageNumber = pageNumber;
        objData.recordStart = offset + 1;
        objData.recordEnd = totalRecords >= recordEnd ? recordEnd : totalRecords;
        objData.totalRecords = totalRecords;
        objData.products = [SELECT Id, Name, Description__c, Price__c FROM Product__c LIMIT :pageSize OFFSET :offset];
        jsonData = JSON.serialize(objData);
        return jsonData;
    }
     
    public class ProductsWrapper {
        public Integer pageSize {get; set;}
        public Integer pageNumber {get; set;}
        public Integer totalRecords {get; set;}
        public Integer recordStart {get; set;}
        public Integer recordEnd {get; set;}
        public List<Product__c> products {get; set;}
    }

    /*
     * @author: Irakli Iriauli
     * @description: Search Products
     */
    @AuraEnabled(cacheable=true)
    public static List<Product__c> searchProducts(string searchKey){
        return [SELECT Id, Name, Description__c, Price__c FROM Product__c WHERE Name LIKE : '%' + searchKey + '%'];
    }

    /*
     * @author: Irakli Iriauli
     * @description: Product Details
     */
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProductById(Id productId) {
        return [SELECT Id, Name, Description__c, Price__c FROM Product__c WHERE Id =:productId];
    }

}
