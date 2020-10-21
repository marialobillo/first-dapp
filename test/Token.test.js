const { tokens } = require('./helpers');
const { result } = require('lodash');


const Token = artifacts.require('./Token');
require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Token', ([deployer, receiver]) => {

    const name = "DApp Token";
    const symbol = 'DAPP';
    const decimals = '18';
    const totalSupply = tokens(1000000).toString();
    let token;

    beforeEach(async () => {
        token = await Token.new()
    });

    describe('deployment', () => {

        it('tracks the name', async () => {
            // Read token name here...
            const result = await token.name()
            // Check The token name is "My name"
            result.should.equal(name)
        });

        it('tracks the symbol', async () => {
            const result = await token.symbol()
            result.should.equal(symbol);
        });

        it('tracks the decimals', async () => {
            const result = await token.decimals()
            result.toString().should.equal(decimals);

        })

        it('tracks the total supply', async () => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply).toString();
        })

        it('assigns the total supply to the deployer', async () => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply).toString();
        })
    })

    describe('sending tokens', () => {

        let result
        let amount 

        beforeEach(async () => {
            amount = tokens(100)
            result = await token.transfer(receiver, amount, { from : deployer})
        });

        it('transfers token balances', async () => {
            let balanceOf;        

            // After transfer
            balanceOf = await token.balanceOf(deployer)
            balanceOf.toString().should.equal(tokens(999900).toString());
            console.log("deployer balance after transfer", balanceOf.toString());
            balanceOf = await token.balanceOf(receiver);
            balanceOf.toString().should.equal(tokens(100).toString());
            console.log("receiver balance after transfer", balanceOf.toString());

        })
    })
})


