import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import { Resident } from '../org.energy.trading.network';
import { Bank } from '../org.energy.trading.network';
import { Coins } from '../org.energy.trading.network';
import { Cash } from '../org.energy.trading.network';
import { CoinsToCash } from '../org.energy.trading.network';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class TransactionRBService {

    //define namespace strings for api calls
	private RESIDENT: string = 'Resident';
    private BANK: string = 'Bank'; 
    private CASH: string = 'Cash';
    private COINS: string = 'Coins';
    private COINS_TO_CASH: string = 'CoinsToCash';

    //use data.service.ts to create services to make API calls
    constructor(private residentService: DataService<Resident>, private bankService: DataService<Bank>, private coinsService: DataService<Coins>, private cashService: DataService<Cash>, private coinsToCashService: DataService<CoinsToCash>) {
    };

    //get all resident objects on the blockchain network
    public getAllResidents(): Observable<Resident[]> {
        return this.residentService.getAll(this.RESIDENT);
    }

    //get all bank objects
    public getAllBanks(): Observable<Bank[]> {
        return this.bankService.getAll(this.BANK);
    }

    //get cash asset by id
    public getCash(id: any): Observable<Cash> {
      return this.cashService.getSingle(this.CASH, id);
    }

    //get coins asset by id
    public getCoins(id: any): Observable<Coins> {
      return this.coinsService.getSingle(this.COINS, id);
    }
   
    //create coins to cash transaction
    public coinsToCash(itemToAdd: any): Observable<CoinsToCash> {
      return this.coinsToCashService.add(this.COINS_TO_CASH, itemToAdd);
    }

}
