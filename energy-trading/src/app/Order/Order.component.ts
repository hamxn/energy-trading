/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OrderService } from './Order.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-order',
  templateUrl: './Order.component.html',
  styleUrls: ['./Order.component.css'],
  providers: [OrderService]
})
export class OrderComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  orderID = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  state = new FormControl('', Validators.required);
  energyRate = new FormControl('', Validators.required);
  energyValue = new FormControl('', Validators.required);
  ownerID = new FormControl('', Validators.required);
  ownerEntity = new FormControl('', Validators.required);

  constructor(public serviceOrder: OrderService, fb: FormBuilder) {
    this.myForm = fb.group({
      orderID: this.orderID,
      type: this.type,
      state: this.state,
      energyRate: this.energyRate,
      energyValue: this.energyValue,
      ownerID: this.ownerID,
      ownerEntity: this.ownerEntity
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceOrder.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.energy.trading.network.Order',
      'orderID': this.orderID.value,
      'type': this.type.value,
      'state': this.state.value,
      'energyRate': this.energyRate.value,
      'energyValue': this.energyValue.value,
      'ownerID': this.ownerID.value,
      'ownerEntity': this.ownerEntity.value
    };

    this.myForm.setValue({
      'orderID': null,
      'type': null,
      'state': null,
      'energyRate': null,
      'energyValue': null,
      'ownerID': null,
      'ownerEntity': null
    });

    return this.serviceOrder.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'orderID': null,
        'type': null,
        'state': null,
        'energyRate': null,
        'energyValue': null,
        'ownerID': null,
        'ownerEntity': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.energy.trading.network.Order',
      'type': this.type.value,
      'state': this.state.value,
      'energyRate': this.energyRate.value,
      'energyValue': this.energyValue.value,
      'ownerID': this.ownerID.value,
      'ownerEntity': this.ownerEntity.value
    };

    return this.serviceOrder.updateAsset(form.get('orderID').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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


  deleteAsset(): Promise<any> {

    return this.serviceOrder.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceOrder.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'orderID': null,
        'type': null,
        'state': null,
        'energyRate': null,
        'energyValue': null,
        'ownerID': null,
        'ownerEntity': null
      };

      if (result.orderID) {
        formObject.orderID = result.orderID;
      } else {
        formObject.orderID = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.state) {
        formObject.state = result.state;
      } else {
        formObject.state = null;
      }

      if (result.energyRate) {
        formObject.energyRate = result.energyRate;
      } else {
        formObject.energyRate = null;
      }

      if (result.energyValue) {
        formObject.energyValue = result.energyValue;
      } else {
        formObject.energyValue = null;
      }

      if (result.ownerID) {
        formObject.ownerID = result.ownerID;
      } else {
        formObject.ownerID = null;
      }

      if (result.ownerEntity) {
        formObject.ownerEntity = result.ownerEntity;
      } else {
        formObject.ownerEntity = null;
      }

      this.myForm.setValue(formObject);

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

  resetForm(): void {
    this.myForm.setValue({
      'orderID': null,
      'type': null,
      'state': null,
      'energyRate': null,
      'energyValue': null,
      'ownerID': null,
      'ownerEntity': null
      });
  }

}
