import { api, LightningElement, wire } from 'lwc';
import getOrderById from '@salesforce/apex/SF_cartController.getOrderById';

export default class SF_orderDetails extends LightningElement {
    name;
    totalQty;
    totalPrice;
    status;

    shippingStreet;
    shippingState; 
    shippingCountry;
    shippingPostalCode;

    order;
    orderProducts = [];
    errors;

    @api recordId; 

    connectedCallback() {
        this.getOrder();
    }

    async getOrder() {
        try {
            const data = await getOrderById({id: this.recordId});

            this.order = data; 
            this.name = data.Name;
            this.totalQty = data.Total_Quantity__c;
            this.totalPrice = data.Total_Price__c;
            this.status = '';
            this.orderProducts = data.Order_Products__r;

            this.shippingCountry = data.Account__r.Shipping_Country__c;
            this.shippingPostalCode = data.Account__r.Shipping_Postal_Code__c     
            this.shippingState = data.Account__r.Shipping_State__c;
            this.shippingStreet = data.Account__r.Shipping_Street__c;
        } catch (error) {
            console.log(error);
        }
    }
}