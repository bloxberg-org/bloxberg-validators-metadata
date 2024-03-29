const constants = {}
constants.organization = 'bloxberg-org'
constants.repoName = 'bloxberg-network-consensus-contracts'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  // KeysManager: 'KeysManager.abi.json',
  PoaNetworkConsensus: 'PoaNetworkConsensus.abi.json',
  ValidatorMetadata: 'ValidatorMetadata.abi.json'
  // ProofOfPhysicalAddress: 'ProofOfPhysicalAddress.abi.json'
}
constants.userDeniedTransactionPattern = 'User denied transaction'
constants.rootPath = '/bloxberg-dapps-validators'
constants.branches = {
  DAI: 'dai',
  CORE: 'core',
  SOKOL: 'sokol',
  KOVAN: 'kovan',
  BLOXBERG: 'master'
}

constants.navigationData = [
  {
    icon: 'all',
    title: 'All',
    url: constants.rootPath
  },
  {
    icon: 'set',
    title: 'Set Metadata',
    url: `${constants.rootPath}/set`
  },
  // {
  //   icon: 'pending',
  //   title: 'Pending Changes',
  //   url: `${constants.rootPath}/pending-changes`
  // }
]

constants.NETWORKS = {
  '42': {
    NAME: 'Kovan',
    RPC: 'https://kovan.infura.io/v3/1125fe73d87c4e5396678f4e3089b3dd',
    BRANCH: constants.branches.KOVAN,
    TESTNET: true
  },
  '77': {
    NAME: 'Sokol',
    RPC: 'https://sokol.poa.network',
    BRANCH: constants.branches.SOKOL,
    TESTNET: true
  },
  '99': {
    NAME: 'Core',
    RPC: 'https://core.poa.network',
    BRANCH: constants.branches.CORE,
    TESTNET: false
  },
  '100': {
    NAME: 'Dai',
    RPC: 'https://dai.poa.network',
    BRANCH: constants.branches.DAI,
    TESTNET: false
  },
  '8995': {
    NAME: 'bloxberg',
    RPC: 'https://core.bloxberg.org',
    BRANCH: constants.branches.BLOXBERG,
    TESTNET: false
  }
}

module.exports = {
  constants
}
