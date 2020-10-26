export const ether = (number) => {
    return new web3.utils.BN(
        web3.utils.toWei(number.toString(), 'ether')
    )
}


export const EVM_REVERT = 'VM Exception while processing transaction: revert';

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

export const tokens = (number) => ether(number)