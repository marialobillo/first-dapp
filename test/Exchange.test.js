import { tokens, EVM_REVERT } from './helpers'

const Exchange = artifacts.require('./Exchange')

require('chai')
  .use(require('chai-as-promised'))
  .should()

// eslint-disable-next-line no-undef
contract('Exchange', ([deployer, feeAccount]) => {
  let exchange 
  const feePercent = 10

  beforeEach(async () => {
    exchange = await Exchange.new(feeAccount, feePercent)
  })

  describe('deployment', () => {
      
    it('tracks the fee Account', async () => {
      const result = await exchange.feeAccount()
      result.should.equal(feeAccount)
    })

    it('tracks the fee Percent', async () => {
        const result = await exchange.feePercent()
        result.toString().should.equal(feePercent.toString())
    })

  })

})