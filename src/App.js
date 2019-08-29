import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import emailValidator from 'email-validator'
import helpers from './utils/helpers'
import PoaConsensus from './contracts/PoaConsensus.contract'
import moment from 'moment'
import { ButtonConfirm } from './components/ButtonConfirm'
import { CreateKeysAddressNote } from './components/CreateKeysAddressNote'
import { FormAutocomplete } from './components/FormAutocomplete'
import { FormInput } from './components/FormInput'
import { FormRadioButton } from './components/FormRadioButton'
import { Loading } from './components/Loading'
import { MainTitle } from './components/MainTitle'
import { constants } from './utils/constants'
import { geocodeByAddress } from 'react-places-autocomplete'
import { messages } from './utils/messages'

import './assets/stylesheets/index.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.checkValidation = this.checkValidation.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onChangeFormField = this.onChangeFormField.bind(this)
    this.getKeysManager = this.getKeysManager.bind(this)
    this.getMetadataContract = this.getMetadataContract.bind(this)
    this.getVotingKey = this.getVotingKey.bind(this)
    this.onChangeAutoComplete = address => {
      const form = this.state.form
      form.instituteAddress = address
      this.setState({ form })
    }
    this.onSelect = this.onSelectAutocomplete.bind(this)
    this.state = {
      web3Config: {},
      form: {
        instituteAddress: '',
        researchField: '',
        postal_code: '',
        us_state: '',
        firstName: '',
        lastName: '',
        researchInstitute: '',
        contactEmail: '',
        //isCompany: false
        isCompany: helpers.isCompanyAllowed(Number(this.props.web3Config.netId))
      },
      hasData: false
    }
    this.defaultValues = null
    this.setMetadata.call(this)
    this.isValidVotingKey = false
    this.setIsValidVotingKey.call(this)
  }
  async setMetadata() {
    const currentData = await this.getMetadataContract().getValidatorData(this.getMiningKey())
    const hasData = currentData.createdDate ? true : false
    this.defaultValues = currentData
    const pendingChange = await this.getMetadataContract().getPendingChange(this.getMiningKey())
    if (Number(pendingChange.minThreshold) > 0) {
      let msg
      if (pendingChange.isCompany) {
        msg = `
          Full name: <b>${pendingChange.firstName}</b> <br/>
          Contact E-mail: <b>${pendingChange.contactEmail}</b> <br/>
        `
      } else {
        msg = `
          First Name: <b>${pendingChange.firstName}</b> <br/>
          Last Name: <b>${pendingChange.lastName}</b> <br/>
          Full Address: <b>${pendingChange.instituteAddress}</b> <br/>
          Research Field: <b>${pendingChange.researchField}</b> <br />
          Institute Name: <b>${pendingChange.researchInstitute}</b> <br/>
          US state: <b>${pendingChange.us_state}</b> <br/>
          Zip Code: <b>${pendingChange.postal_code}</b> <br/>
        `
      }
      helpers.generateAlert('warning', 'You have pending changes!', msg)
    }
    this.setState({
      form: {
        instituteAddress: currentData.instituteAddress,
        researchField: currentData.researchField,
        firstName: currentData.firstName,
        lastName: currentData.lastName,
        researchInstitute: currentData.researchInstitute,
        contactEmail: currentData.contactEmail,
        isCompany: hasData ? currentData.isCompany : this.state.form.isCompany
      },
      hasData
    })
  }
  async setIsValidVotingKey() {
   console.log(this.getVotingKey())
   console.log(this.props.web3Config.metadataContract.miningKeys)
   this.isValidVotingKey = this.checkMiningKey(this.getVotingKey())
   //this.isValidVotingKey = await this.getKeysManager().isVotingActive(this.getVotingKey())
    if (!this.isValidVotingKey) {
      this.setState({ loading: false })
      //this.setState({ loading: true })
      //helpers.generateAlert('warning', 'Warning!', messages.invalidaVotingKey)
    }
  }
  getKeysManager() {
    return this.props.web3Config.keysManager
  }
  checkMiningKey(currentKey) {
    let miningKeyBool  = this.props.web3Config.metadataContract.miningKeys.includes(currentKey)
    if (miningKeyBool) {
      return true
    }
    else {
      return false
    }
  }
  getMetadataContract() {
    return this.props.web3Config.metadataContract
  }
  getVotingKey() {
    return this.props.web3Config.votingKey
  }
  getMiningKey() {
    return this.props.web3Config.miningKey
  }
  checkValidation() {
    if (this.state.form.isCompany) {
      if (!this.state.form.firstName) {
        this.setState({ loading: false })
        helpers.generateAlert('warning', 'Warning!', `Full name cannot be empty`)
        return false
      }
    } else {
      if (!emailValidator.validate(this.state.form.contactEmail)) {
        this.setState({ loading: false })
        helpers.generateAlert('warning', 'Warning!', `Contact E-mail is invalid`)
        return false
      }
      const keys = Object.keys(this.state.form)
      keys.forEach(key => {
        if (!this.state.form[key]) {
          if (key !== 'contactEmail' && key !== 'isCompany') {
            this.setState({ loading: false })
            helpers.generateAlert('warning', 'Warning!', `${key} cannot be empty`)
            return false
          }
        }
      })
    }
    return true
  }
  async onSelectAutocomplete(data) {
    let place = await geocodeByAddress(data)
    let address_components = {}
    for (var i = 0; i < place[0].address_components.length; i++) {
      var addressType = place[0].address_components[i].types[0]
      switch (addressType) {
        case 'postal_code':
          address_components.postal_code = place[0].address_components[i].short_name
          break
        case 'street_number':
          address_components.street_number = place[0].address_components[i].short_name
          break
        case 'route':
          address_components.route = place[0].address_components[i].short_name
          break
        case 'locality':
          address_components.locality = place[0].address_components[i].short_name
          break
        case 'administrative_area_level_1':
          address_components.administrative_area_level_1 = place[0].address_components[i].short_name
          break
        default:
          break
      }
      let form = this.state.form
      form.instituteAddress = `${address_components.street_number} ${address_components.route} ${
        address_components.locality
      } ${address_components.postal_code}`
      //form.us_state = address_components.administrative_area_level_1
      //form.postal_code = address_components.postal_code
      this.setState({
        form
      })
    }
  }
  async onClick() {
    this.setState({ loading: true })
    const isFormValid = this.checkValidation()
    // const isFormValid = true
    if (isFormValid) {
      const votingKey = this.getVotingKey()
      const isValid = this.checkMiningKey(votingKey)
      //const isValid = await this.getKeysManager().isVotingActive(votingKey)
      // const isValid = true
      if (isValid) {
        await this.sendTxToContract()
      } else {
        this.setState({ loading: false })
        //helpers.generateAlert('warning', 'Warning!', messages.invalidaVotingKey)
        return
      }
    }
  }
  async sendTxToContract() {
    this.getMetadataContract()
      .createMetadata({
        firstName: this.state.form.firstName,
        lastName: this.state.form.lastName,
        contactEmail: this.state.form.contactEmail,
        researchInstitute: this.state.form.researchInstitute,
        researchField: this.state.form.researchField,
        instituteAddress: this.state.form.instituteAddress,
        //researchField: moment(this.state.form.researchField).unix(),
        votingKey: this.getVotingKey(),
        // isCompany: this.state.form.isCompany,
        // hasData: this.state.hasData
      })
      .then(receipt => {
        this.setState({ loading: false })
        helpers.generateAlert('success', 'Congratulations!', 'Your metadata was sent!')
      })
      .catch(error => {
        let errDescription

        if (error.message.includes(constants.userDeniedTransactionPattern))
          errDescription = `Error: ${constants.userDeniedTransactionPattern}`
        else errDescription = error.message
        this.setState({ loading: false })
        console.log(error)
        let msg = `
          Something went wrong!<br/><br/>
          ${errDescription}
        `
        helpers.generateAlert('error', 'Error!', msg)
      })
  }
  onChangeFormField(event) {
    const field = event.target.id
    let form = this.state.form
    if (field === 'isNotary') {
      form.isCompany = false
    } else if (field === 'isCompany') {
      form.isCompany = true
    } else {
      form[field] = event.target.value
    }
    this.setState({ form })
  }

  render() {
    const netId = Number(this.props.web3Config.netId)
    const { isCompany } = this.state.form
    const { networkBranch } = this.props
    const hideNote = netId !== helpers.netIdByName(constants.branches.CORE)
    const isCompanyAllowed = helpers.isCompanyAllowed(netId)
    const inputProps = {
      id: 'address',
      onChange: this.onChangeAutoComplete,
      value: this.state.form.instituteAddress
    }
    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="vld-App_FormAutocompleteItem">
        <strong>{formattedSuggestion.mainText}</strong> <small>{formattedSuggestion.secondaryText}</small>
      </div>
    )

    if (this.state.loading) {
      return ReactDOM.createPortal(
        <Loading networkBranch={networkBranch} />,
        document.getElementById('loadingContainer')
      )
    }

    return this.isValidVotingKey ? (
      <div className="vld-App">
        <MainTitle text={constants.navigationData[1].title} />
        {isCompanyAllowed ? (
          <div className="vld-App_RadioButtons">
            <FormRadioButton
              checked={isCompany}
              id="isCompany"
              name="isCompanyRadio"
              networkBranch={networkBranch}
              onChange={this.onChangeFormField}
              text="I'm a company"
            />
            <FormRadioButton
              checked={!isCompany}
              id="isNotary"
              name="isCompanyRadio"
              networkBranch={networkBranch}
              onChange={this.onChangeFormField}
              text="I'm a notary"
            />
          </div>
        ) : null}
        <form className="vld-App_Form">
          <FormInput
            id="firstName"
            onChange={this.onChangeFormField}
            title={isCompany ? 'Full name' : 'First name'}
            value={this.state.form.firstName}
          />
          {isCompany ? null : (
            <FormInput
              id="lastName"
              onChange={this.onChangeFormField}
              title="Last name"
              value={this.state.form.lastName}
            />
          )}
          {isCompany ? null : (
            <FormInput
              id="contactEmail"
              onChange={this.onChangeFormField}
              title="Contact E-mail"
              type="email"
              value={this.state.form.contactEmail}
            />
          )}
          {isCompany ? null : (
            <FormInput
              id="researchInstitute"
              onChange={this.onChangeFormField}
              title="Institute Name"
              value={this.state.form.researchInstitute}
            />
          )}
          {isCompany ? null : (
            <FormInput
              id="researchField"
              onChange={this.onChangeFormField}
              title="Research Field"
              value={this.state.form.researchField}
            />
          )}
          {isCompany ? null : (
            <FormAutocomplete
              autocompleteItem={AutocompleteItem}
              id="address"
              inputProps={inputProps}
              onSelect={this.onSelect}
              title="Institute Address"
            />
          )}
        </form>
        <ButtonConfirm
          networkBranch={networkBranch}
          text={` ${this.state.hasData ? 'Update' : 'Set'} Metadata`}
          onClick={this.onClick}
        />
        {hideNote ? null : <CreateKeysAddressNote networkBranch={networkBranch} />}
      </div>
    ) : (
      <div className="vld-App">
        <MainTitle text={constants.navigationData[1].title} />
        <p>Invalid voting key</p>
      </div>
    )
  }
}

export default App
