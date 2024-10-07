# bloxberg Network Validators DApp

The bloxberg validators DApp is built for researchers running an authority node on the bloxberg blockchain. It gives an opportunity for the current validators of the network to set their personal information on-chain. Also, everyone can view current validators' personal data from this DApp.

## Supported browsers

* Google Chrome v 59.0.3071.115+

## MetaMask extension setup

* Connect to the bloxberg network using the Metamask extension.

## Validator role

### Set metadata
If you are a new validator of the bloxberg network and your validator node is successfully launched, you should fill your personal data. To do it you need:
- connect to the corresponding endpoint of the bloxberg network in Metamask
- select your authority node key from accounts in Metamask
- click **SET METADATA** in the navigation bar
- fill all fields in the form of a new validator
- click **+ SET METADATA** button
- confirm transaction in Metamask.

That's it. After DApp will get a receipt for the transaction you'll see a success message and your personal data will be added to the list of validators.

## Building from source

1) `npm i`
2) `npm start`
