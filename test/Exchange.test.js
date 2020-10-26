import Web3 from 'web3'
import { tokens, EVM_REVERT, ETHER_ADDRESS, ether } from './helpers'

const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

require('chai')
  .use(require('chai-as-promised'))
  .should()

// eslint-disable-next-line no-undef
contract('Exchange', ([deployer, feeAccount, user1]) => {
    let token
    let exchange 
    const feePercent = 10


    beforeEach(async () => {
        // Deploy token
        token = await Token.new()
        // Transfer some tokens to user1
        token.transfer(user1, tokens(100), { from: deployer })
        // Deploy exchange
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

    describe('fallback', () => {
        it('reverts when Ether is sent', async () => {
            await exchange.sendTransaction(
                { value: 1, from: user1 }
                ).should.be.rejectedWith(EVM_REVERT)
        })
    })

    describe('desposintg Ether', async () => {
    let result
    let amount

    beforeEach(async () => {
        amount = ether(1)
        result = await exchange.depositEther({ from: user1, value: amount })
    })

    it('tracks the Ether deposit', async () => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1)
        balance.toString().should.equal(amount.toString())
    })

    it('emits a Deposit event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Deposit')
        const event = log.args
        event.token.should.equal(ETHER_ADDRESS, 'token address is correct')
        event.user.should.equal(user1, 'user address is correct')
        event.amount.toString().should.equal(amount.toString(), 'amount is correct')
        event.balance.toString().should.equal(amount.toString(), 'balance is correct')
    })

  })

    describe('withdrawing Ether', async () => {
        let result 
        let amount

        beforeEach(async () => {
            // Deposit Ether first
            amount = ether(1)
            await exchange.depositEther({ from: user1, value: amount })
        })

        describe('success', async () => {
            beforeEach(async () => {
                // Withdraw Ether 
                result = await exchange.withdrawEther(ether(1), { from: user1 })
            })

            it('withdraw Ether funds', async () => {
                const balance = await exchange.tokens(ETHER_ADDRESS, user1)
                balance.toString().should.equal('0')
            })

            it('emits a Withdraw event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Withdraw')
                const event = log.args
                event.token.should.equal(ETHER_ADDRESS)
                event.user.should.equal(user1)
                event.amount.toString().should.equal(amount.toString())
                event.balance.toString().should.equal('0')
            })
        })

        describe('failure', async () => {
            it('rejects withdraws for insufficient balances', async () => {
                await exchange.withdrawEther(ether(100), 
                { from: user1 } ).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('depositing tokens', () => {
      let result
      let amount

   
      
   describe('success', () => {

    beforeEach(async () => {
        amount = tokens(10)
        await token.approve(exchange.address, amount, { from: user1});
        result = await exchange.depositToken(token.address, amount, { from: user1});
    })

    it('tracks the token deposit', async () => {
        // Check exchange token balance
        let balance
        balance = await token.balanceOf(exchange.address)
        balance.toString().should.equal(amount.toString())
        // Check tokens on exchange
        balance = await exchange.tokens(token.address, user1)
        balance.toString().should.equal(amount.toString())
        
    })

    it('emits a Deposit event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Deposit')
        const event = log.args
        event.token.should.equal(token.address, 'token address is correct')
        event.user.should.equal(user1, 'user address is correct')
        event.amount.toString().should.equal(tokens(10).toString(), 'amount is correct')
        event.balance.toString().should.equal(tokens(10).toString(), 'balance is correct')
    })
    })

   describe('failure', () => {
    
    it('rejects Ether deposits', async () => {
        // TODO: fill me in...
        await exchange.depositToken(ETHER_ADDRESS, tokens(10), 
            { from: user1 }).should.be.rejectedWith(EVM_REVERT)
    })

    it('fails when no tokens are approved', async () => {
        
        await exchange.depositToken(token.address, tokens(10), 
            { from: user1 }).should.be.rejectedWith(EVM_REVERT)
    })
   })

  })


    describe('withdrawing tokens', async () => {
        let result 
        let amount
        
        describe('success', async () => {
            beforeEach(async () => {
                // Deposit tokens first
                amount = tokens(10)
                await token.approve(exchange.address, amount, { from: user1 })
                await exchange.depositToken(token.address, amount, { from: user1 })

                // Withdraw tokens 
                result = await exchange.withdrawToken(token.address, amount, { from: user1 })
            })

            it('withdraws token funds', async () => {
                const balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal('0')
            })
        })

        describe('failure', async () => {
            
        })
    })
})