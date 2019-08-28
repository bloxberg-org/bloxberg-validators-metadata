import { constants } from '../utils/constants'
import helpers from './helpers'
import helpersGlobal from '../utils/helpers'
import messages from '../utils/messages'
// const local = {
//   METADATA_ADDRESS: '0xe9a1e0dcbde0ca17f96b194993a0e971b7a880c8',
//   //KEYS_MANAGER_ADDRESS: '0x2b1dbc7390a65dc40f7d64d67ea11b4d627dd1bf',
//   POA_ADDRESS: '0x379a599f4141f772f802e8c6928c495b8612c142',
//   //MOC: '0x9850711951A84Ef8a2A31a7868d0dCa34B0661cA'
// }

export default web3Config => {
  const branch = constants.NETWORKS[web3Config.netId].BRANCH
  return new Promise((resolve, reject) => {
    fetch(helpers.addressesURL(branch))
      .then(response => {
        response.json().then(json => {
          resolve({ addresses: json, web3Config })
        })
      })
      .catch(function(err) {
        let addr = helpers.addressesURL(branch)
        let msg = `
                Something went wrong!<br/><br/>
                ${messages.wrongRepo(addr)}
            `
        helpersGlobal.generateAlert('error', 'Error!', msg)
        reject(err)
      })
  })
}
