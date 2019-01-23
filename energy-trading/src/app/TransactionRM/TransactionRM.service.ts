import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import { Resident } from '../org.energy.trading.network';
import { Coins } from '../org.energy.trading.network';
import { Energy } from '../org.energy.trading.network';
import { Order } from '../org.energy.trading.network';
import { EnergyToCoins } from '../org.energy.trading.network';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class TransactionRMService {

    //define namespace strings for api calls
	private RESIDENT: string = 'Resident';
    private ENERGY: string = 'Energy';
    private COINS: string = 'Coins';
    private ORDER: string = 'Order';
    private ENERGY_TO_COINS: string = 'EnergyToCoins';

    //use data.service.ts to create services to make API calls
    constructor(private residentService: DataService<Resident>, private coinsService: DataService<Coins>, private energyService: DataService<Energy>, private orderService: DataService<Order>, private energyToCoinsService: DataService<EnergyToCoins>) {
    };

    //get all resident objects on the blockchain network
    public getAllResidents(): Observable<Resident[]> {
        return this.residentService.getAll(this.RESIDENT);
    }

    //get energy asset by id
    public getEnergy(id: any): Observable<Energy> {
      return this.energyService.getSingle(this.ENERGY, id);
    }

    //update energy
    public updateEnergy(id: any, itemToUpdate: any): Observable<Energy> {
      return this.energyService.update(this.ENERGY, id, itemToUpdate);
    }

    //get coins asset by id
    public getCoins(id: any): Observable<Coins> {
      return this.coinsService.getSingle(this.COINS, id);
    }

    //update coins
    public updateCoins(id: any, itemToUpdate: any): Observable<Coins> {
      return this.coinsService.update(this.COINS, id, itemToUpdate);
    }

    //get all order objects on the blockchain network
    public getAllOrders(): Observable<Order[]> {
        return this.orderService.getAll(this.ORDER);
    }

    //add order
    public addOrder(itemToAdd: any): Observable<Order> {
      return this.orderService.add(this.ORDER, itemToAdd);
    }

    //update order
    public updateOrder(id: any, itemToUpdate: any): Observable<Order> {
      return this.orderService.update(this.ORDER, id, itemToUpdate);
    }

    //delete order
    public deleteOrder(id: any): Observable<Order> {
      return this.orderService.delete(this.ORDER, id);
    }
   
    //create energy to coins transaction
    public energyToCoins(itemToAdd: any): Observable<EnergyToCoins> {
      return this.energyToCoinsService.add(this.ENERGY_TO_COINS, itemToAdd);
    }

}
