export const tokens = (number) => {
    return new web3.utils.BN(
        web3.utils.toWei(number.toString(), 'ether')
    )
}


export const EVM_REVERT = 'VM Exception while processing transaction: revert';