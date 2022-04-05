import { api, LightningElement } from 'lwc';

export default class Sf_cartLineItem extends LightningElement {
    qty;
    _qty;
    price;
    desc;
    productName;
    _product;
    disableSave=true;
    disableAction=false;

    @api
    get product() {
        return this._product;
    };

    set product(product) {
        this._product = product;
        this.productName = product.Product__r.Name;
        this.price = product.Price__c;
        this.qty = product.Quantity__c;
        this.desc = product.Product_Description__c;
    }

    handleQtyChange(e) {
        this._qty = e.detail.value;
        this.disableSave = false;
    }   

    handleSave(e) {
        if(this._qty === '' || parseInt(this._qty) < 1) {
            return;
        }

        this.disableSave = true;

        const saveQtyEvent = new CustomEvent('saveqty', {
            detail: {
                qty: this._qty,
                id: this._product.Id
            }
        })
        this.dispatchEvent(saveQtyEvent);
    }

    handleAction() {
        this.disableAction = true;

        const deleteItemEvent = new CustomEvent('removecartitem', {
            detail: this._product.Id
        })
        this.dispatchEvent(deleteItemEvent);
    }
}