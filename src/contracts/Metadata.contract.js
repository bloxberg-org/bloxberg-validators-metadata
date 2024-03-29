/* eslint-disable no-throw-literal */
import PoaConsensus from './PoaConsensus.contract'
import moment from 'moment'
import helpers from './helpers'
import helpersGlobal from '../utils/helpers'
import { messages } from '../utils/messages'
import { constants } from '../utils/constants'

var toAscii = function(hex) {
  var str = '',
    i = 0,
    l = hex.length
  if (hex.substring(0, 2) === '0x') {
    i = 2
  }
  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16)
    if (code === 0) continue // this is added
    str += String.fromCharCode(code)
  }
  return str
}

export default class Metadata {
  async init({ web3, netId, addresses }) {
    this.web3 = web3
    this.netId = Number(netId)
    this.gasPrice = web3.utils.toWei('20', 'gwei')

    const { METADATA_ADDRESS, MOC } = addresses
    console.log('Metadata contract Address: ', METADATA_ADDRESS)

    const MetadataAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'ValidatorMetadata')

    this.metadataInstance = new web3.eth.Contract(MetadataAbi, METADATA_ADDRESS)
    console.log(this.metadataInstance)
    if (MOC) {
      this.MOC_ADDRESS = MOC
    }
    this.addresses = addresses

    const poaInstance = new PoaConsensus()
    await poaInstance.init({ web3, netId, addresses })
    // this.mocRemoved = await poaInstance.isMasterOfCeremonyRemoved()
    this.miningKeys = await poaInstance.getValidators()
  }
  async createMetadata({
    firstName,
    lastName,
    researchInstitute,
    instituteAddress,
    researchField,
    contactEmail,
    isCompany,
    votingKey,
    hasData
  }) {
    const methodToCall = hasData ? 'changeRequest' : 'createMetadata'
    if (isCompany && isNaN(researchField)) {
      researchField = 0
    }
    let input = [
      firstName,
      lastName,
      contactEmail,
      researchInstitute,
      researchField,
      instituteAddress
      // this.web3.utils.fromAscii(state),
      // this.web3.utils.fromAscii(zipcode),

    ]
    if (helpersGlobal.isCompanyAllowed(this.netId)) {
      input.push(this.web3.utils.fromAscii(contactEmail))
      input.push(isCompany)
    }
    return await this.metadataInstance.methods[methodToCall](...input).send({
      from: votingKey,
      gasPrice: this.gasPrice
    })
  }

  getMocData() {
    // Barinov, Igor		755 Bounty Dr 202	Foster City	CA	94404 	41	2206724	07/23/2021
    return {
      firstName: 'Igor',
      lastName: 'Barinov',
      instituteAddress: '755 Bounty Dr 202, Foster City',
      createdDate: '2017-12-18',
      updatedDate: '',
      researchField: '2021-07-23',
      researchInstitute: '2206724',
      us_state: 'CA',
      postal_code: '94404',
      contactEmail: '',
      isCompany: false
    }
  }

  async getValidatorData(miningKey) {
    if (!miningKey) {
      //helpersGlobal.generateAlert('warning', 'Warning!', messages.invalidaVotingKey)
      return {}
    }
    let validatorData = await this.metadataInstance.methods.validatorsMetadata(miningKey).call()
    //let validatorData = await this.metadataInstance.methods.validators(miningKey).call()
    console.log(validatorData)
    let createdDate = validatorData.createdDate > 0 ? moment.unix(validatorData.createdDate).format('YYYY-MM-DD') : ''
    let updatedDate = validatorData.updatedDate > 0 ? moment.unix(validatorData.updatedDate).format('YYYY-MM-DD') : ''
    //let researchField =
    //  validatorData.researchField > 0 ? moment.unix(validatorData.researchField).format('YYYY-MM-DD') : ''
    let researchField = validatorData.researchField
    let contactEmail
    if (validatorData.hasOwnProperty('contactEmail')) {
      contactEmail = validatorData.contactEmail
    }
    let isCompany
    if (validatorData.hasOwnProperty('isCompany')) {
      isCompany = validatorData.isCompany
    }
    console.log(validatorData.instituteAddress)
    return {
      firstName: validatorData.firstName,
      lastName: validatorData.lastName,
      instituteAddress: validatorData.instituteAddress,
      createdDate,
      updatedDate,
      researchField,
      researchInstitute: validatorData.researchInstitute,
      // us_state: validatorData.state,
      //postal_code: toAscii(validatorData.zipcode),
      contactEmail,
      isCompany
    }
  }

  async getAllValidatorsData(netId) {
    let all = []
    return new Promise(async (resolve, reject) => {
      console.log(this.miningKeys)
      const mocAddressLowercase = this.MOC_ADDRESS ? this.MOC_ADDRESS.toLowerCase() : ''
      for (let key of this.miningKeys) {
        let data
        if (key.toLowerCase() === mocAddressLowercase) {
          if (this.mocRemoved) {
            continue
          }
          data = this.getMocData()
        } else {
          data = await this.getValidatorData(key)
          
        }
        data.address = key
        all.push(data)
      }
      resolve(all)
    })
  }

  async getPendingChange(miningKey) {
    if (!miningKey) {
      
      return {}
    }

    let pendingChanges = await this.metadataInstance.methods.pendingChanges(miningKey).call()
    let createdDate = pendingChanges.createdDate > 0 ? moment.unix(pendingChanges.createdDate).format('YYYY-MM-DD') : ''
    let updatedDate = pendingChanges.updatedDate > 0 ? moment.unix(pendingChanges.updatedDate).format('YYYY-MM-DD') : ''
    // let researchField =
    //   pendingChanges.researchField > 0 ? moment.unix(pendingChanges.researchField).format('YYYY-MM-DD') : ''
    let researchField = pendingChanges.researchField
    let contactEmail
    if (pendingChanges.hasOwnProperty('contactEmail')) {
      contactEmail = toAscii(pendingChanges.contactEmail)
    }
    let isCompany
    if (pendingChanges.hasOwnProperty('isCompany')) {
      isCompany = pendingChanges.isCompany
    }
    return {
      firstName: pendingChanges.firstName,
      lastName: pendingChanges.lastName,
      instituteAddress: pendingChanges.instituteAddress,
      createdDate,
      updatedDate,
      researchField,
      researchInstitute: pendingChanges.researchInstitute,
      us_state: pendingChanges.state,
      //postal_code: toAscii(validatorData.zipcode),
      contactEmail,
      isCompany
    }
  }

  async getAllPendingChanges() {
    let pendingChanges = []
    for (let key of this.miningKeys) {
      let pendingChange = await this.getPendingChange(key)
      pendingChange.address = key
      if (pendingChange.createdDate) {
        pendingChanges.push(pendingChange)
      }
    }
    return pendingChanges
  }

  async confirmPendingChange({ miningKeyToConfirm, senderVotingKey, senderMiningKey }) {
    const { methods } = this.metadataInstance
    let alreadyConfirmed
    if (methods.isValidatorAlreadyVoted) {
      alreadyConfirmed = await methods.isValidatorAlreadyVoted(miningKeyToConfirm, senderMiningKey).call()
    } else {
      alreadyConfirmed = await methods.isAddressAlreadyVoted(miningKeyToConfirm, senderVotingKey).call()
    }
    console.log(alreadyConfirmed)
    if (alreadyConfirmed) {
      throw {
        message: `You already confirmed this change.`
      }
    }
    if (senderMiningKey === miningKeyToConfirm) {
      throw {
        message: `You cannot confirm your own changes.\n
          Please ask other validators to verify your new information.`
      }
    } else if (senderMiningKey === '0x0000000000000000000000000000000000000000') {
      throw {
        //message: messages.invalidaVotingKey
      }
    }
    return await this.metadataInstance.methods
      .confirmPendingChange(miningKeyToConfirm)
      .send({ from: senderVotingKey, gasPrice: this.gasPrice })
  }

  async getConfirmations({ miningKey }) {
    return await this.metadataInstance.methods.confirmations(miningKey).call()
  }

  async getMinThreshold({ miningKey }) {
    let validatorData = await this.metadataInstance.methods.validators(miningKey).call()
    return validatorData.minThreshold
  }

  async finalize({ miningKeyToConfirm, senderVotingKey, senderMiningKey }) {
    const confirmations = await this.getConfirmations({
      miningKey: miningKeyToConfirm
    })
    const getMinThreshold = await this.getMinThreshold({
      miningKey: miningKeyToConfirm
    })
    if (senderMiningKey === '0x0000000000000000000000000000000000000000') {
      throw {
        //message: messages.invalidaVotingKey
      }
    }
    if (Number(confirmations[0]) < Number(getMinThreshold)) {
      throw {
        message: `There is not enough confimations.\n
          The minimum threshold to finalize is ${getMinThreshold}.`
      }
    }
    return await this.metadataInstance.methods
      .finalize(miningKeyToConfirm)
      .send({ from: senderVotingKey, gasPrice: this.gasPrice })
  }
}
