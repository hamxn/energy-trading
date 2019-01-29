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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { CoinsComponent } from './Coins/Coins.component';
import { EnergyComponent } from './Energy/Energy.component';
import { CashComponent } from './Cash/Cash.component';
import { OrderComponent } from './Order/Order.component';

import { ResidentComponent } from './Resident/Resident.component';
import { BankComponent } from './Bank/Bank.component';
import { UtilityCompanyComponent } from './UtilityCompany/UtilityCompany.component';
import { TransactionRBComponent } from './TransactionRB/TransactionRB.component';
import { TransactionUMComponent } from './TransactionUM/TransactionUM.component';
import { AllTransactionsComponent } from './AllTransactions/AllTransactions.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Coins', component: CoinsComponent },
  { path: 'Energy', component: EnergyComponent },
  { path: 'Cash', component: CashComponent },
  { path: 'Order', component: OrderComponent },
  { path: 'Resident', component: ResidentComponent },
  { path: 'Bank', component: BankComponent },
  { path: 'UtilityCompany', component: UtilityCompanyComponent },
  { path: 'TransactionRB', component: TransactionRBComponent },
  { path: 'TransactionUM', component: TransactionUMComponent },
  { path: 'AllTransactions', component: AllTransactionsComponent },
  
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
