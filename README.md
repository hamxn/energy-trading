# Energy trading platform
> The project was created from Hakathon State of chain with Blockchain
Product purpose/ idea: Use for exchange energy in the EVN network.

Product features: List of products features & description
Overview the energy market price
Make a market order by exchange energy
Get cash from exchange coins with bank

Technology: The technology apply for this product, The programing design/ flow…
Hyperledger fabric
Hyperledger composer
Angular

# Architecture Flow

# Included Components

* Hyperledger Composer
* Angular Framework

# Running the Application
Follow these steps to setup and run this code pattern. The steps are described in detail below.

## Prerequisite
- Operating Systems: Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12
- [Docker](https://www.docker.com/) (Version 17.03 or higher)
- [npm](https://www.npmjs.com/)  (v5.x)
- [Node](https://nodejs.org/en/) (version 8.9 or higher - note version 9 is not supported)
  * to install specific Node version you can use [nvm](https://davidwalsh.name/nvm)
- [Hyperledger Composer](https://hyperledger.github.io/composer/installing/development-tools.html)
  * to install composer cli
    `npm install -g composer-cli`
  * to install composer-rest-server
    `npm install -g composer-rest-server`
  * to install generator-hyperledger-composer
    `npm install -g generator-hyperledger-composer`

## Steps
1. [Clone the repo](#1-clone-the-repo)
2. [Setup Fabric](#2-setup-fabric)
3. [Deploy to Fabric](#3-deploy-to-fabric)
4. [Start REST server](#4-start-rest-server)
5. [Run Application](#5-run-application)
6. [Create Participants](#6-create-participants)
7. [Execute Transactions](#7-execute-transactions)

## 1. Clone the repo

Clone the `energy-trading-flatform code` locally. In a terminal, run:

```
git clone https://github.com/hamxn/energy-trading
cd energy-trading
```

## 2. Setup Fabric

These commands will kill and remove all running containers, and should remove all previously created Hyperledger Fabric chaincode images:

```none
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)
```

All the scripts will be in the directory `/fabric-dev-servers`.  Start fabric and create peer admin card:

```
cd fabric-dev-servers/
./downloadFabric.sh
./startFabric.sh
./createPeerAdminCard.sh
```


## 3. Deploy to Fabric

Now, we are ready to deploy the business network to Hyperledger Fabric. This requires the Hyperledger Composer chaincode to be installed on the peer,then the business network archive (.bna) must be sent to the peer, and a new participant, identity, and associated card must be created to be the network administrator. Finally, the network administrator business network card must be imported for use, and the network can then be pinged to check it is responding.

First, install the business network:

```
composer network install --card PeerAdmin@hlfv1 --archiveFile energy-trading@0.0.5.bna
```

Start the business network:

```
composer network start --networkName energy-trading --networkVersion 0.0.5 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
```

Import the network administrator identity as a usable business network card:
```
composer card import --file networkadmin.card
```

Check that the business network has been deployed successfully, run the following command to ping the network:
```
composer network ping --card admin@energy-trading
```

## 4. Start REST server
```
composer-rest-server -c admin@energy-trading-network -n never -w true -p3000
```
The REST server to communicate with network is available here:
`http://localhost:3001/explorer/`

## 5. Run Application

First, go into the `/energy-trading` folder and install the dependency:

```
npm install
```

To start the application:
```
npm start
```

The application should now be running at:
`http://localhost:4200`

## 6. Create Participants

Once the application opens, create participants and fill in dummy data.  Create Residents, Banks and Utility Companies.


## 7. Execute Transactions

Execute transactions manually between Residents, Resident and Bank, and Resident and Utility Company.  After executing transactions, ensure the participants account values are updated.


At the end of your session, stop fabric:

```
cd ~/fabric-tools
./stopFabric.sh
./teardownFabric.sh
```
