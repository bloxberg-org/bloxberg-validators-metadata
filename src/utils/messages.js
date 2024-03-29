let messages = {}
messages.wrongRepo = function(repo) {
  return `There is no such file in configured repo ${repo}`
}
messages.invalidaVotingKey =
  'The key is not a valid voting Key or you are connected to the wrong chain! Please make sure you have loaded the correct voting key in Metamask / Nifty Wallet.'
messages.noMetamaskAccount = `Your MetaMask is locked.
Please choose your voting key in MetaMask and reload the page.
`

module.exports = {
  messages
}
