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

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Energy to Coins transaction
 * @param {org.energy.trading.network.EnergyToCoins} UpdateValues 
 * @transaction
 */
function EnergyToCoins(UpdateValues) {

    //determine change in coins value from the rate
    var coinsChange = (UpdateValues.energyRate * UpdateValues.energyValue);

    //update values of the assets
    UpdateValues.coinsInc.value = UpdateValues.coinsInc.value + coinsChange;
    UpdateValues.energyInc.value = UpdateValues.energyInc.value + UpdateValues.energyValue;

    //get asset registry for Coins and Energy, and update on the ledger
    return getAssetRegistry('org.energy.trading.network.Coins')
        .then(function (assetRegistry) {
            return assetRegistry.updateAll([UpdateValues.coinsInc]);
        })                
        .then(function () {
            return  getAssetRegistry('org.energy.trading.network.Energy')
            .then(function (assetRegistry) {
                return assetRegistry.updateAll([UpdateValues.energyInc]);
            });            
        });        
}

/**
 * Resident to bank transaction
 * @param {org.energy.trading.network.CoinsToCash} UpdateValues
 * @transaction
 */
function CoinsToCash(UpdateValues) {

    //determine change in cash value from the rate
    var cashChange = (UpdateValues.coinsRate * UpdateValues.coinsValue);

    //update values of the assets
    UpdateValues.cashInc.value = UpdateValues.cashInc.value + cashChange;
    UpdateValues.cashDec.value = UpdateValues.cashDec.value - cashChange;
    UpdateValues.coinsInc.value = UpdateValues.coinsInc.value + UpdateValues.coinsValue;
    UpdateValues.coinsDec.value = UpdateValues.coinsDec.value - UpdateValues.coinsValue;

    //get asset registry for Coins and Cash, and update the ledger
    return getAssetRegistry('org.energy.trading.network.Coins')
        .then(function (assetRegistry) {
            return assetRegistry.updateAll([UpdateValues.coinsInc,UpdateValues.coinsDec]);
        })                
        .then(function () {
            return  getAssetRegistry('org.energy.trading.network.Cash')
            .then(function (assetRegistry) {
                return assetRegistry.updateAll([UpdateValues.cashInc,UpdateValues.cashDec]);
            });            
        });     
}