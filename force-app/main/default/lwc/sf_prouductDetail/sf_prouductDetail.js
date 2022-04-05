import { LightningElement, api, wire, track} from 'lwc';
import getProductById from '@salesforce/apex/SF_ProductController.getProductById';


export default class Sf_prouductDetail extends LightningElement {
    @api recordId;
    product;
    error;

    @wire(getProductById, ({productId:'$recordId'}))
    retrieveProducts({error, data}){

      if(data){
          this.product = data[0];
          this.error = undefined;
      }else{
          this.product = undefined;
          this.error = error;
      }
  }

}