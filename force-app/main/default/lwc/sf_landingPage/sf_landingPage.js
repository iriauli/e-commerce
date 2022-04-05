import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getProductList from '@salesforce/apex/SF_ProductController.getProductList';
import searchProducts from '@salesforce/apex/SF_ProductController.searchProducts';
import addProductToCart from '@salesforce/apex/SF_AddToCartController.addProductToCart';

export default class Sf_landingPage extends NavigationMixin(LightningElement) {
    getProductById
    @track loader = false;
    @track error = null;
    @track pageSize = 12;
    @track pageNumber = 1;
    @track totalRecords = 0;
    @track totalPages = 0;
    @track recordEnd = 0;
    @track recordStart = 0;
    @track isPrev = true;
    @track isNext = true;
    @track products = [];
    @track Id;
    @track key; // Search Products
    @track quantity = 0; // Add to Cart

    // On Load
    connectedCallback() {
        this.getProducts();
    }

    // Handle Next
    handleNext() {
        this.pageNumber = this.pageNumber + 1;
        this.getProducts();
    }

    // Handle Prev
    handlePrev() {
        this.pageNumber = this.pageNumber - 1;
        this.getProducts();
    }

    // Get Products
    getProducts() {
        this.loader = true;
        getProductList({ pageSize: this.pageSize, pageNumber: this.pageNumber })
            .then(result => {
                this.loader = false;
                if (result) {
                    var resultData = JSON.parse(result);
                    this.products = resultData.products;
                    this.pageNumber = resultData.pageNumber;
                    this.totalRecords = resultData.totalRecords;
                    this.recordStart = resultData.recordStart;
                    this.recordEnd = resultData.recordEnd;
                    this.totalPages = Math.ceil(resultData.totalRecords / this.pageSize);
                    this.isNext = (this.pageNumber == this.totalPages || this.totalPages == 0);
                    this.isPrev = (this.pageNumber == 1 || this.totalRecords < this.pageSize);
                }
            })
            .catch(error => {
                this.loader = false;
                this.error = error;
            });
    }

    // Record is Unavailable
    get RecordIsUnavailable() {
        let isDisplay = true;
        if (this.products) {
            this.products.length == 0 ? isDisplay = true : isDisplay = false
        }
        return isDisplay;
    }

    // Search Products
    updateKey(event) {
        this.key = event.target.value;
    }

    handleSearch() {
        this.loader = true;
        searchProducts({ searchKey: this.key })
            .then(result => {
                this.loader = false;
                this.products = result;
            }).catch(error => {
                this.loader = false;
                this.error = error;
            });
    }

    // Navigate to Product Detail
    navigateToProductPage(event) {
        const productId = event.target.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'product/' + productId
            }
        },
            true
        );
    }

    @track error = 'Sorry';

    // ERROR & SUCCESS Messages
    showErrorMessage = false;
    showSuccessMessage = false;
    closeErrorMessage() { this.showErrorMessage = false }
    closeSuccessMessage() { this.showSuccessMessage = false }

    // If there is less than 5 products in cart add them until it becomes 5
    // If there already is 5 product throw an error
    async addToCart(event) {
        this.loader = true;
        const productId = event.target.dataset.id;

        try {
            await addProductToCart({
                productId: productId,
                quantity: 1
            });
            this.quantity += 1;
            if (this.quantity >= 1) {
                this.showSuccessMessage = true,
                    this.closeErrorMessage();
            }
            this.loader = false;
        } catch (error) {
            this.showErrorMessage = true,
                this.closeSuccessMessage();
            this.loader = false;
        }
    }
}