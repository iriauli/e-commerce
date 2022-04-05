import { LightningElement, api, track } from 'lwc';
import getProductById from '@salesforce/apex/SF_ProductController.getProductById';
import addProductToCart from '@salesforce/apex/SF_AddToCartController.addProductToCart';

export default class Sf_productDetail extends LightningElement {
    @api recordId;
    product;

    error;
    loader;
    totalQty;
    quantity = 0; // Add to Cart
    error = 'Sorry';

    // Product Detail
    connectedCallback() {
        this.loader = true;
        getProductById({ productId: this.recordId })
            .then(data => {
                this.loader = false;
                this.product = data[0];
            }).catch(error => {
                this.loader = false;
                this.error = error;
            });
    }

    // Record is Unavailable
    get RecordIsUnavailable() {
        let isDisplay = true;
        if (this.product) {
            this.product.length == 0 ? isDisplay = true : isDisplay = false
        }
        return isDisplay;
    }

    // Change Product Quantity
    changeQuantity(event) {
        this.quantity = event.target.value;
    }

    // ERROR & SUCCESS Messages
    showErrorMessage = false;
    showSuccessMessage = false;
    closeErrorMessage() { this.showErrorMessage = false }
    closeSuccessMessage() { this.showSuccessMessage = false }

    // Check if there is less than 5 products in cart add them until it becomes 5
    // If there already is 5 product throw an error
    async addToCart(event) {
        this.loader = true;
        const productId = event.target.dataset.id;

        try {
            await addProductToCart({
                productId: productId,
                quantity: this.quantity
            });
            if (this.quantity >= 1 && this.quantity <= 5) {
                this.showSuccessMessage = true,
                    this.closeErrorMessage();
            }
            this.loader = false;
        } catch (error) {
            this.loader = false;
            this.showErrorMessage = true,
                this.closeSuccessMessage();
        }
    }

}
