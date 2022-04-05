import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import placeOrder from '@salesforce/apex/SF_cartController.placeOrder';
import getCart from '@salesforce/apex/SF_cartController.getCart';
import QUANTITY_FIELD from '@salesforce/schema/Cart_Line_Item__c.Quantity__c';
import ID_FIELD from '@salesforce/schema/Cart_Line_Item__c.Id';

export default class Sf_cart extends NavigationMixin(LightningElement) {
    @track
    cartLineItems=[];
    name;
    status;
    totalQty;
    totalPrice;

    cart;
    errors;
    disableRemoveCart=false;

    @wire(getCart)
    wiredDetails({error, data}) {
        if(data) {
            this.cart = data; 
            this.cartLineItems = data.Cart_Line_Items__r; 

            this.name = data.Name;  
            this.status = data.Status__c; 
            this.totalQty = data.Total_Quantity__c; 
            this.totalPrice = data.Total_Price__c;
        } else {
            this.errors = error;
        } 
    }
    
    async handleOrder() {
        try {
            const recordId = await placeOrder({testId : ''});
            
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: { 
                    url: `order/${recordId}`
                }
            });
        } catch (error) {
            this.errors = error;
        }
    }

    async handleRemove() {
         this.disableRemoveCart = true;
         try {
             await deleteRecord(this.cart.Id);

             this.cart = null;
         } catch (error) {
            this.errors = error;
         }
    }

    async handleSaveCartLineItemQty(e) {
        let quantity = 0, price = 0;

        const fields = {};
        fields[QUANTITY_FIELD.fieldApiName] = e.detail.qty;
        fields[ID_FIELD.fieldApiName] = e.detail.id;

        try {
            const record = await updateRecord({fields});  
            
            this.cartLineItems.forEach((item) => { 
                if(item.Id === record.id) {
                    item.Quantity__c = record.fields.Quantity__c.value; 
                    item.Total_Price__c = record.fields.Total_Price__c.value;
                }
                quantity += item.Quantity__c;
                price += item.Total_Price__c;
            });

            this.totalQty = quantity;
            this.totalPrice = price; 
        } catch (error) {
            this.errors = error; 
        }
    }

    async handleRemoveCartLineItem(e) {
        try {
            await deleteRecord(e.detail);

            this.cartLineItems = this.cartLineItems.filter(el => {
                if (el.Id !== e.detail) {
                    return true;
                } else {
                    this.totalQty -= el.Quantity__c;
                    this.totalPrice -= el.Total_Price__c;
                    
                    return false;
                }
            });
        } catch (error) {
            this.errors = error;
        }
    }
}