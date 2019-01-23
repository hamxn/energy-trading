import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TransactionRMService } from './TransactionRM.service';
import 'rxjs/add/operator/toPromise';

//provide associated components
@Component({
	selector: 'app-TransactionRM',
	templateUrl: './TransactionRM.component.html',
	styleUrls: ['./TransactionRM.component.css'],
  	providers: [TransactionRMService]
})

//TransactionRMComponent class
export class TransactionRMComponent {

  private SELL: string = 'Sell';
  private BUY: string = 'Buy';
  private order;
  private energy;
  private coins;
  private owner;

  //define variables
  private coinsExchanged;

  myForm: FormGroup;
  private errorMessage;
  private transactionFrom;

  private allResidents;
  private allOrders;
  private consumer;
  
  private energyToCoinsObj;
  private orderID;

  //initialize form variables
  ownerID = new FormControl("", Validators.required);
	energyValue = new FormControl("", Validators.required);
	energyRate = new FormControl("", Validators.required);
  action = new FormControl("", Validators.required); 

  constructor(private serviceTransaction:TransactionRMService, fb: FormBuilder) {
    //intialize form  
	  this.myForm = fb.group({		  
		  ownerID:this.ownerID,
      energyValue:this.energyValue,
      energyRate:this.energyRate,
      action:this.action,
    });
  };

  //on page initialize, load all residents
  ngOnInit(): void {
    this.transactionFrom  = false;
    this.loadAllOrders();
    this.loadAllResidents()
    .then(() => {                     
        this.transactionFrom  = true;
    });
    
  }

  //get all Residents
  loadAllResidents(): Promise<any> {

    //retrieve all residents in the tempList array
    let tempList = [];
    
    //call serviceTransaction to get all resident objects
    return this.serviceTransaction.getAllResidents()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      
      //append tempList with the resident objects returned
      result.forEach(resident => {
        tempList.push(resident);
      });

      //assign tempList to allResidents
      this.allResidents = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  //get all Orders
  loadAllOrders(): Promise<any> {

    //retrieve all orders in the tempList array
    let tempList = [];
    
    //call serviceTransaction to get all order objects
    return this.serviceTransaction.getAllOrders()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      
      //append tempList with the order objects returned
      result.forEach(order => {
        tempList.push(order);
      });

      //assign tempList to allOrders
      this.allOrders = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
        this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  //execute transaction
  execute(form: any): Promise<any> {

    if(this.action.value === this.SELL) {
      //update energy
      var energyID = "EN_R" + this.ownerID.value;
      return this.getEnergy(energyID)
      .then(() => {
        if(this.energy.value) {
          if ((this.energy.value - this.energyValue.value) < 0 ){
            this.errorMessage = "Insufficient energy in producer account";
          }
          else {
            this.updateEnergy(this.energy)
            .then(() => {
              this.excuteOrder();
            });
          }
        }
      });
    } 
    else { //BUY
      //update coins
      var coinsID = "CO_R" + this.ownerID.value;
      this.getCoins(coinsID)
      .then(() => {
        if(this.coins.value) {
          if ((this.coins.value - this.coins.value) < 0 ){
            this.errorMessage = "Insufficient coins in producer account";
          }
          else {
            this.updateCoins(this.coins)
            .then(() => {
              this.excuteOrder();
            });
          }
        }
      });
    }
  }

  excuteOrder(): Promise<any>  {
    //excute matching progress
    for(let orderX of this.allOrders) {
      //same type, owner or difference rate
      if(orderX.type == this.action.value || orderX.ownerID == this.ownerID.value || orderX.energyRate != this.energyRate.value) {
        continue;
      }
      //exchange
      if(orderX.energyValue > this.energyValue.value) {
        //exchange with less than energy
        return this.exchangeWith(orderX)
        .then(() => {
          //update old order, don't need to add new order.
          this.updateOrder(orderX)
          .then(() => {
            this.transactionFrom = false;
          });
        });
      }
      else if(orderX.energyValue < this.energyValue.value) {
        //exchange with more than energy
        return this.exchangeWith(orderX)
        .then(() => {
          //delete old order
          this.deleteOrder(orderX)
          .then(() => {
            //add new order with balance
            this.addOrder(orderX.energyValue)
            .then(() => {
              this.transactionFrom = false;
            });
          });
        });
   
      }
      else { 
        //exchange with equal energy
        return this.exchangeWith(orderX)
        .then(() => {
          //delete old order
          this.orderID = orderX.orderID;
          this.deleteOrder(orderX)
          .then(() => {
            this.transactionFrom = false;
          });
        });
      }
    }

    //excute not matching
    return this.addOrder(0)
    .then(() => {
      this.transactionFrom = false;
    });

  }

  //exchange when match
  exchangeWith(orderX: any): Promise<any> {
          
    //loop through all residents, and get producer and consumer resident from user input
    for (let resident of this.allResidents) {      
      if(resident.residentID == this.ownerID.value) {
        this.owner = resident;
      }
      if(resident.residentID == orderX.ownerID) {
        this.consumer = resident;
      }
    }

    var buyer;
    var seller;
    var exchangeValue;

    // identify buyer/seller
    if(this.action.value == this.SELL) {
      seller = this.owner;
      buyer = this.consumer;
    } 
    else {
      seller = this.consumer;
      buyer = this.owner;
    }

    //identify value exchange
    if(orderX.energyValue > this.energyValue.value) {
      exchangeValue = this.energyValue.value;
    }
    else {
      exchangeValue = orderX.energyValue;
    }  
    
    //identify energy and coins id which will be debited
    var splitted_energyID = buyer.energy.split("#", 2); 
    var energyID = String(splitted_energyID[1]);

    var splitted_coinsID = seller.coins.split("#", 2); 
    var coinsID = String(splitted_coinsID[1]);

    //create transaction object
    this.energyToCoinsObj = {
      $class: "org.energy.trading.network.EnergyToCoins",
      "energyRate": this.energyRate.value,
      "energyValue": exchangeValue,
      "coinsInc": seller.coins,
      "energyInc": buyer.energy,    
    };

    //call serviceTransaction call the energyToCoins transaction with energyToCoinsObj as parameter            
    return this.serviceTransaction.energyToCoins(this.energyToCoinsObj)      
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
        this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  //add order
  addOrder(minusValue:any): Promise<any> {

    // generate identify for order ID
    this.orderID = 'OR_' + Date.now();

    // create order object
    this.order = {
      $class: 'org.energy.trading.network.Order',
      'orderID': this.orderID,
      'type': this.action.value,
      'state': 'NotMatched',
      'energyRate': this.energyRate.value,
      'energyValue': this.energyValue.value - minusValue,
      'ownerID': this.ownerID.value,
      'ownerEntity': 'Resident'
    };

    return this.serviceTransaction.addOrder(this.order)
    .toPromise()
    .then(() => {
      this.errorMessage = null;   
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }

  // update Order
  updateOrder(itemToUpdate: any): Promise<any> {
    this.order = {
      $class: 'org.energy.trading.network.Order',
      'orderID':itemToUpdate.orderID,
      'type':itemToUpdate.type,
      'state':itemToUpdate.state,
      'energyRate': itemToUpdate.energyRate,
      'energyValue':itemToUpdate.energyValue - this.energyValue.value,
      'ownerID': itemToUpdate.ownerID,
      'ownerEntity': itemToUpdate.ownerEntity
    };

    return this.serviceTransaction.updateOrder(itemToUpdate.orderID, this.order)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  // delete Order
  deleteOrder(itemToDelete: any): Promise<any> {

    return this.serviceTransaction.deleteOrder(itemToDelete.orderID)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  // get Energy
  getEnergy(energyID:any): Promise<any> {

    return this.serviceTransaction.getEnergy(energyID)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      this.energy = result;
    }).catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    }); 
  }

  // update Energy
  updateEnergy(itemToUpdate: any): Promise<any> {
    
    this.energy = {
      $class: 'org.energy.trading.network.Energy',
      'units': itemToUpdate.units,
      'value': itemToUpdate.value - this.energyValue.value,
      'ownerID': itemToUpdate.ownerID,
      'ownerEntity': itemToUpdate.ownerEntity
    };

    return this.serviceTransaction.updateEnergy(itemToUpdate.energyID, this.energy)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  // get Coins
  getCoins(coinsID:any): Promise<any> {

    return this.serviceTransaction.getCoins(coinsID)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      this.coins = result;
    }).catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    }); 
  }

  // update Coins
  updateCoins(itemToUpdate: any): Promise<any> {

    //calculate coins exchanges from the rate
    this.coinsExchanged = this.energyRate.value * this.energyValue.value;

    this.coins = {
      $class: 'org.energy.trading.network.Coins',
      'value': itemToUpdate.value - this.coinsExchanged,
      'ownerID': itemToUpdate.ownerID,
      'ownerEntity': itemToUpdate.ownerEntity
    };

    return this.serviceTransaction.updateCoins(itemToUpdate.coinsID, this.coins)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }
          
}
