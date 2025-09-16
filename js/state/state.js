let state = JSON.parse(localStorage.getItem('states')) || {
    total : 0,
    isDark: false,
    trade: []
}

export function getState(){
    return state
}

export function updateState(updated_trade){
    let state = getState()
    state = {...state,...updated_trade}
    localStorage.setItem('states',JSON.stringify(state))
}

export function udpateTrade(updated_trade,idx){
    let state = getState()
    let updatedTrade = state.trade.map((elem,i)=> i === idx ? [...elem,...updated_trade] : elem)
    updateState({trade: updatedTrade})
    return updatedTrade
}