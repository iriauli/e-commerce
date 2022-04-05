import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// import getCart from '@salesforce/apex/SF_cartController.getCart';

export default class Sf_header extends NavigationMixin(LightningElement) {
    // cart;
    // quantity = 0;

    // Navigate to Home Page
    navigateToHomePage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/'
            }
        },
            true
        );
    }

    // Navigate to View Cart Page
    navigateToViewCartPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/cart'
            }
        },
            true
        );
    }

    // Navigate to View Cart Page
    navigateToAccountDetails() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/myaccountdetails'
            }
        },
            true
        );
    }

    // Navigate to View Cart Page
    navigateToMyOrders() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/order/:objectApiName/:filterName'
            }
        },
            true
        );
    }

    // Total Quantity
    // @wire(getCart)
    // wiredQuantity({ error, data }) {
    //     if (data) {
    //         this.cart = data;
    //         this.quantity = data.Total_Quantity__c;
    //     } else {
    //         this.errors = error;
    //     }
    // }

}