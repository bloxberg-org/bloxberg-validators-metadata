import React, { Component } from 'react'
import helpers from '../../utils/helpers'
import { PhysicalAddressValue } from '../PhysicalAddressValue'
import { ValidatorDataPair } from '../ValidatorDataPair'
import { ValidatorTitle } from '../ValidatorTitle'

class Validator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmation: null
    }
    // this.props.metadataContract.getConfirmations({ miningKey: this.props.address }).then(confirmation => {
    //   this.setState({ confirmation: confirmation[0] })
    // })
  }

  render() {
    let {
      address,
      children,
      contactEmail,
      createdDate,
      researchField,
      firstName,
      index,
      isCompany,
      lastName,
      researchInstitute,
      netId,
      networkBranch,
      physicalAddresses,
      updatedDate
    } = this.props

    if (helpers.isCompanyAllowed(netId) && !createdDate) {
       isCompany = false
      //originally true
    }

    const showAllValidators = this.props.methodToCall === 'getAllValidatorsData'
    const indexAndAddress = showAllValidators ? `#${index}. ${address}` : address
    const fullName = isCompany ? firstName : `${firstName} ${lastName}`
    const titleFirstColumn = isCompany ? 'Company' : 'bloxberg Member'
    const titleSecondColumn = isCompany ? '' : 'Research Institute'
    const confirmedAddresses = physicalAddresses.filter(a => a.isConfirmed)
    const unconfirmedAddresses = physicalAddresses.filter(a => !a.isConfirmed)
    const addresses = confirmedAddresses.concat(unconfirmedAddresses)

    return (
      <div className="vl-Validator">
        <div className="vl-Validator_Header">
          <div className="vl-Validator_AddressAndHint">
            <div className="vl-Validator_HeaderAddress">{indexAndAddress}</div>
            <div className="vl-Validator_HeaderHint">Wallet Address</div>
          </div>
          {showAllValidators ? null : (
            <div className="vl-Validator_HeaderConfirmations">{this.state.confirmation} confirmations</div>
          )}
        </div>
        <div className="vl-Validator_Body">
          <div className={`vl-Validator_Column`}>
            <ValidatorTitle
              networkBranch={networkBranch}
              text={titleFirstColumn}
              type={isCompany ? 'company' : 'notary'}
            />
            <div className="vl-Validator_InfoList">
              <ValidatorDataPair data={['Full Name', fullName]} />
              {isCompany ? null : <ValidatorDataPair data={['Research Field', researchField]} />}
              {isCompany ? <ValidatorDataPair data={['Contact E-mail', contactEmail]} /> : null}
            </div>
          </div>
          <div className={`vl-Validator_Column`}>
            <ValidatorTitle
              networkBranch={networkBranch}
              text={titleSecondColumn}
              type={isCompany ? '' : 'notaryLicense'}
            />
            <div className="vl-Validator_InfoList">
              {isCompany ? null : <ValidatorDataPair data={['Institute Name', researchInstitute]} />}
              {isCompany ? null : (
                <ValidatorDataPair
                  data={['Address', <PhysicalAddressValue networkBranch={networkBranch} addresses={addresses} />]}
                />
              )}

              {/* <ValidatorDataPair data={['Miner Creation Date', createdDate]} /> */}
              {updatedDate ? <ValidatorDataPair data={['Pending Change Date', updatedDate]} /> : null}
            </div>
          </div>
        </div>
        {children ? <div className="vl-Validator_Footer">{children}</div> : null}
      </div>
    )
  }
}
export default Validator
