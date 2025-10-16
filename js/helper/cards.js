import { updateState, getState } from "../state/state.js"

//count profit and loss
export function calculatePl(buy,sell,quantity){
    let sum = ((sell*quantity) - (buy *quantity))
    return sum
}

export function calculatePlinPercentage(buy,sell,quantity){
    let percentage = ((sell - buy)/buy)*100
    let formattedPercentage = percentage.toFixed(2)
    return formattedPercentage  
}

export function countNetPL(){
    let positive = 0
    let negative = 0
    let state = getState()

    state.trade.forEach(elem => elem.plRs > 0 ? positive += elem.plRs : negative += elem.plRs)
    negative = Math.abs(negative)

    let netPl = parseFloat(positive - negative)
    return netPl
}

//count win and loss rate
export function countWinRate(){
    let state = getState()
    let totalTrade = state.totalCompleteTrade
    let winNum = 0

    state.trade.forEach(elem => {
        if(elem.plRs > 0 && elem.soldStatus){
            console.log(elem.plRs)
            winNum++
        }
    })  

    let winRate = totalTrade > 0 ? (winNum/totalTrade)*100 : 0
    let formattedWinRate = winRate.toFixed(2)
    return formattedWinRate

}

export function countLossRate(winRate){
    let lossRate = (winRate - 100).toFixed(2);
    return lossRate
}

//count the trade with sold status true
export function countCompleteTrade(){
    let state = getState()
    let count = 0
    state.trade.forEach(elem => {
        if(elem.soldStatus){
            count++
        }
    })
    updateState({totalCompleteTrade: count})
    return count
}

//counts total number of trade and total number of active trade
export function countTotalTrade(){
    let state = getState();

    let count = state.trade.length;
    return count
}

export function countActiveTrade(){
    let state = getState()
    let count = 0
    state.trade.forEach(elem => !elem.soldStatus ? count++ : count)
    return count
}