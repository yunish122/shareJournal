import { countActiveTrade, countTotalTrade, calculatePl, countCompleteTrade,countLossRate,countWinRate, countNetPL, calculatePlinPercentage } from "./helper/cards.js"
import { create_element, createSpan } from "./helper/helper.js"
import { getState, updateState, updateTrade } from "./state/state.js"
let dialog = document.getElementById('addTradeDialouge')
let editDialouge = document.getElementById('editTradeDialouge')
document.getElementById('addTrade').addEventListener('click',()=>{
    dialog.classList.remove('hidden')
    dialog.classList.add('flex')
})

document.getElementById('hiddenAddTrade').addEventListener('click',()=>{
    dialog.classList.remove('hidden')
    dialog.classList.add('flex')
})

document.getElementById('cancel').addEventListener('click',()=>{
    dialog.classList.add('hidden')
    dialog.classList.remove('flex')
})
document.getElementById('editCancel').addEventListener('click',()=>{
    editDialouge.classList.add('hidden')
    editDialouge.classList.remove('flex')
})

document.getElementById('editCrossX').addEventListener('click',()=>{
    editDialouge.classList.add('hidden')
    editDialouge.classList.remove('flex')
})
document.getElementById('crossX').addEventListener('click',()=>{
    dialog.classList.add('hidden')
    dialog.classList.remove('flex')
})

document.addEventListener('DOMContentLoaded',()=>{
    lucide.createIcons()
    render()

})

// dialog.addEventListener('click',(e)=>{
//     let saveBtn = e.target.closest('.saveTrade')
//     let cancelBtn = e.target.closest('.cancel')

//     if(saveBtn){
//         console.log('alsdjfh')
//         saveTrade()
//     }
// })

document.getElementById('theme').addEventListener('click',()=>{
    let state = getState()
    updateState({isDark: !state.isDark})
    toggleTheme()    
})

function toggleTheme(){
    let state = getState()
    if(state.isDark){
        document.querySelector('html').classList.add('dark')
    }else{
        document.querySelector('html').classList.remove('dark')
    }
}

document.getElementById('saveTrade').addEventListener('click',(e)=>{
    saveTrade()
})

let listenerIdx = null;
document.getElementById('editTrade').addEventListener('click',()=>{
    if(listenerIdx === null){ //protects
        return
    }
    editTrade(listenerIdx)
})

document.getElementById('dynamicCard').addEventListener(('click'),(e)=>{
    let state = getState()
    let wrapperDiv = e.target.closest('.wrapperDiv')
    if(!wrapperDiv) return
    let tradeId = Number(wrapperDiv.dataset.tradeId)
    if(!tradeId) return

    let idx = state.trade.findIndex(i => i.id === tradeId)

    let statusIcon = e.target.closest('.statusIcon')
    let updatedTrade;
    if(statusIcon){
        updatedTrade = state.trade.map(e => 
            e.id === tradeId ? {...e, soldStatus: !e.soldStatus} : e
        )
        updateState({trade: updatedTrade})
        render()
        return
    }

    let delBtn = e.target.closest('.deleteBtn')
    if(delBtn){
        let idx = state.trade.findIndex(i => i.id === tradeId)
        if(idx === -1) return
        
        state.trade.splice(idx,1)
        updateState({trade: state.trade})
        render()    
    }

    let editBtn = e.target.closest('.editBtn')
    if(editBtn){
        listenerIdx = tradeId
        populateForm(state.trade[idx])
        showEditDialog()
    }

})





function populateForm(elem) {
    document.getElementById('editInputDate').value = elem.Date || '';
    document.getElementById('editInputStock').value = elem.stockName || '';
    document.getElementById('editInputBuyPrice').value = elem.buyPrice || '';
    document.getElementById('editInputSellPrice').value = elem.sellPrice || '';
    document.getElementById('editInputQty').value = elem.quantity || '';
    document.getElementById('editInputTarget').value = elem.targetPrice || '';
    document.getElementById('editInputSl').value = elem.stopLoss || '';

    // Selects
    document.getElementById('editInputMarketCondition').value = elem.marketCondition 
    document.getElementById('editInputEntryEmo').value = elem.entryEmotion 
    document.getElementById('editInputExitEmo').value = elem.exitEmotion 

    // Textareas
    let value1 = checkForPlaceHolder('',elem.emtionNoteKey)
    document.getElementById('editInputEmotionNotes').value = value1;
    
    let value2 = checkForPlaceHolder('', elem.lessonKey)
    document.getElementById('editInputLesson').value = value2

    let value3 = checkForPlaceHolder('',elem.improveKey)
    document.getElementById('editInputImprovement').value = value3

}

function checkForPlaceHolder(placeholder, value){
    if(value === '-'){
        return placeholder
    }else{
        return value
    }
}

function showDialog(){
    dialog.classList.remove('hidden')
    dialog.classList.add('flex')
}
function showEditDialog(){
    
    editDialouge.classList.remove('hidden')
    editDialouge.classList.add('flex')
}

function hideEditDialouge(){
    editDialouge.classList.add('hidden')
    editDialouge.classList.remove('flex')
}
function hideDialog(){
    dialog.classList.add('hidden')
    dialog.classList.remove('flex')
}

function repolluteEditedInput(idx){
    let state = getState()

    let validBuyPp = validation('editInputBuyPrice');
    let validSellPp = validation('editInputSellPrice');
    let validQty = validation('editInputQty');
    let validTarget = validation('editInputTarget');
    let validSl = validation('editInputSl');

    if (!validBuyPp || !validQty || !validSellPp || !validSl || !validTarget) {
        return false;
    }

    let date = document.getElementById('editInputDate').value;
    let stock = document.getElementById('editInputStock').value;
    let buyPP = document.getElementById('editInputBuyPrice').value;
    let sellPP = document.getElementById('editInputSellPrice').value;
    let qty = document.getElementById('editInputQty').value;

    let target = document.getElementById('editInputTarget').value;
    let sl = document.getElementById('editInputSl').value;

    let condition = document.getElementById('editInputMarketCondition');
    let conditionText = condition.options[condition.selectedIndex].text 

    let outputEmo = document.getElementById('editInputEntryEmo');
    let outputEmoText = outputEmo.options[outputEmo.selectedIndex].text || '';

    let exitEmo = document.getElementById('editInputExitEmo');
    let exitEmoText = exitEmo.options[exitEmo.selectedIndex].text || '';

    let emotionNotes = document.getElementById('editInputEmotionNotes').value || '-';
    let lesson = document.getElementById('editInputLesson').value || '-';
    let improvement = document.getElementById('editInputImprovement').value || '-';

    let plinRs = calculatePl(buyPP,sellPP,qty);
    let plinPercentage = calculatePlinPercentage(buyPP,sellPP,qty);

    let newState = {buyDate: date,stockName: stock, buyPrice: buyPP,sellPrice: sellPP,quantity: qty, targetPrice: target, stopLoss: sl,
        marketCondition: conditionText, entryEmotion: outputEmoText, exitEmotion: exitEmoText,
        emtionNoteKey: emotionNotes, lessonKey: lesson, improveKey: improvement, plRs: plinRs, plPercentage: plinPercentage, holdDays: 0, soldStatus: false,
        trailStop: 0
    }

    updateTrade(newState,idx)

    return true
}

function poluteInput(){
    let state = getState()

    let validBuyPp = validation('inputBuyPrice')
    let validSellPp = validation('inputSellPrice')
    let validQty = validation('inputQty')
    let validTarget = validation('inputTarget')
    let validSl = validation('inputSl')

    if(!validBuyPp || !validQty || !validSellPp || !validSl || !validTarget){
        return false;
    }

    let date = document.getElementById('inputDate').value ;
    let stock = document.getElementById('inputStock').value;
    let buyPP = document.getElementById('inputBuyPrice').value;
    let sellPP = document.getElementById('inputSellPrice').value;
    let qty = document.getElementById('inputQty').value;

    let target = document.getElementById('inputTarget').value;
    let sl = document.getElementById('inputSl').value;

    let condition = document.getElementById('inputMarketCondition');
    let conditionText = condition.options[condition.selectedIndex].text;

    let outputEmo = document.getElementById('inputEntryEmo');
    let outputEmoText = outputEmo.options[outputEmo.selectedIndex].text;

    let exitEmo = document.getElementById('inputExitEmo');
    let exitEmoText = exitEmo.options[exitEmo.selectedIndex].text;

    let emotionNotes = document.getElementById('inputEmotionNotes').value || '-';
    let lesson = document.getElementById('inputLesson').value || '-';
    let improvement = document.getElementById('inputImprovement').value || '-';

    let plinRs = calculatePl(buyPP,sellPP,qty);
    let plinPercentage = calculatePlinPercentage(buyPP,sellPP,qty);


    let newState = [{id: Date.now() ,buyDate: date,stockName: stock, buyPrice: buyPP,sellPrice: sellPP,quantity: qty, targetPrice: target, stopLoss: sl,
        marketCondition: conditionText, entryEmotion: outputEmoText, exitEmotion: exitEmoText,
        emtionNoteKey: emotionNotes, lessonKey: lesson, improveKey: improvement, plRs: plinRs, plPercentage: plinPercentage, holdDays: 0, soldStatus: false,
        trailStop: 0
    }]

    updateState({trade: [...state.trade,...newState]})

    return true
}



// ill merge the two function.
//how? ill make a function that takes two parameter, id and idx and if idx is null then executes one func(updateState) else executes another function(updateTrade)

function validation(inputId){
    const value =  parseInt(document.getElementById(inputId).value);
    const input = document.getElementById(inputId);
    const sibling = document.querySelector(`#${inputId} + span`)
    if(isNaN(value)){
        input.value = '';
        sibling.textContent = '⚠ Please enter a number'
        return false
    }


    if(value <= 0){
        input.value = '';
        sibling.textContent = '⚠ No negative numbers'
        return false
    }
    return true
    
}
function saveTrade(){
    if(poluteInput()){
        hideDialog();
        render()
    }
}

function editTrade(idx){
    if(repolluteEditedInput(idx)){
        hideEditDialouge()
        render()
    }  
}

function render(){
    toggleTheme()
    let state = getState()
    countCompleteTrade()
    renderCards()
    if(state.trade.length === 0){
        document.getElementById('toBeHidden').classList.remove('hidden')
        document.getElementById('toBeHidden').classList.add('flex')

    }else{
        document.getElementById('toBeHidden').classList.add('hidden')

    }
    const container = document.getElementById('dynamicCard')
    container.innerHTML = '' // clear previous cards before re-render

    state.trade.slice().reverse().forEach((elem,i)=>{
        let idx = state.trade.length - i - 1;
        createCard(elem,idx)
    })
    lucide.createIcons()
}

function renderCards(){
    let state = getState()
    let totalTrade = countTotalTrade();
    document.getElementById('totalTrade').textContent = totalTrade
    
    let activeTradeCount = countActiveTrade()
    document.getElementById('activeTrade').textContent = activeTradeCount

    let winRate = countWinRate()
    document.getElementById('winRate').textContent = winRate+'%'
    document.getElementById('winRate').classList.add('text-emerald-600')
    
    let compelteTrade = countCompleteTrade()
    console.log(compelteTrade)
    if(totalTrade > 0 && state.totalCompleteTrade >= 1){
        let lossRate = countLossRate(winRate)
        document.getElementById('lossRate').textContent = lossRate+'%'
        document.getElementById('lossRate').classList.add('text-red-500')
    }else{
        document.getElementById('lossRate').textContent = '0.00%'
        document.getElementById('lossRate').classList.add('text-red-500')
    }

    let netPl = countNetPL()
    document.getElementById('netPl').textContent = netPl+'Rs'
    setPriceColor(netPl,document.getElementsByClassName('netPL')[0])
}



function setPriceColor(price,elem){
    if(price > 0){
        elem.classList.add('text-green-300')
    }else if(price < 0){
        elem.classList.add('text-red-600')
    }else{
        elem.classList.add('text-white')
    }
}

function createCard(elem,idx){
    const wrapperDiv = document.createElement('div')
    wrapperDiv.classList.add('wrapperDiv','gridStyle','min-w-0')// allow children to shrink in grid
    wrapperDiv.dataset.tradeId = elem.id;
    //logic: here i gave made a array of obj with id and value to later put it in evey span using for loop. 
    // disadvantage is i have less control now

    let date = createSpan(['dark:text-white', 'text-black']);
    let formatted = new Date().toISOString().slice(0, 10);

    date.textContent = elem.buyDate || formatted;

    let stock = createSpan(['dark:text-white', 'text-black']);
    stock.textContent = elem.stockName;

    let buyPP = createSpan(['dark:text-white', 'text-black']);
    buyPP.textContent = elem.buyPrice;

    let sellPP = createSpan(['dark:text-white', 'text-black']);
    sellPP.textContent = elem.sellPrice;

    let qty = createSpan(['dark:text-white', 'text-black']);
    qty.textContent = elem.quantity;

    let targetPP = createSpan(['dark:text-white', 'text-black']);
    targetPP.textContent = elem.targetPrice;

    let sl = createSpan(['dark:text-white', 'text-black']);
    sl.textContent = elem.stopLoss;

    let exitPrice = createSpan(['dark:text-white', 'text-black']);
    exitPrice.textContent = elem.exitPrice;

    let plInRs = document.createElement('span')
    plInRs.textContent = elem.plRs  + "Rs";
    setPriceColor(elem.plRs, plInRs)

    let plPercent = createSpan(['dark:text-white', 'text-black']);
    plPercent.textContent = elem.plPercentage +'%';

    let days = createSpan(['dark:text-white', 'text-black']);
    days.textContent = elem.holdDays;

    let condition = createSpan(['dark:text-white', 'text-black']);
    condition.textContent = elem.marketCondition;

    let entryEmo = createSpan(['dark:text-white', 'text-black','items-center']);
    entryEmo.textContent = elem.entryEmotion;

    let exitEmo = createSpan(['dark:text-white', 'text-black','items-center']);
    exitEmo.textContent = elem.exitEmotion;

    let trailStop = createSpan(['dark:text-white', 'text-black','items-center']);
    trailStop.textContent = elem.trailStop;

    let statusIconDiv = document.createElement('span')
    statusIconDiv.classList.add('w-[100px]','flex','justify-center')
    let statusIcon = document.createElement('i')
    statusIconDiv.append(statusIcon)
    statusIcon.setAttribute('data-lucide',elem.soldStatus ? 'circle-check' : 'circle')
    if(elem.soldStatus){
        statusIcon.classList.add('statusIcon','text-emerald-600','w-5')
    }else{
        statusIcon.classList.add('statusIcon','text-gray-300/70','w-5','hover:text-emerald-600','transition','transition-color','duration-200','ease-in-out')
    }

    let emotion = createSpan(['dark:text-white','text-black','text-sm','text-center','truncate','min-w-0','block','overflow-hidden','max-w-[200px]','wrap-break-word','hyphens-auto','line-clamp-3']);
    emotion.textContent = elem.emtionNoteKey;

    let lessonNotes = createSpan(['dark:text-white','text-black','text-sm','text-center','truncate','min-w-0','block','overflow-hidden','max-w-[200px]','wrap-break-word','hyphens-auto','w-[200px]','line-clamp-3']);
    lessonNotes.textContent = elem.lessonKey;

    let improvementNote = createSpan(['dark:text-white','text-black','text-sm','text-center','truncate','min-w-0','block','overflow-hidden','max-w-[200px]','wrap-break-word','hyphens-auto','w-[200px]','line-clamp-3']);
    improvementNote.textContent = elem.improveKey;

    let action = document.createElement('div')
    action.classList.add('flex','gap-2','items-center')
    let editBtn = document.createElement('button');
    editBtn.classList.add(
    'editBtn',
    'dark:bg-[#0f172a]',
    'px-4',
    'rounded-md',
    'py-1',
    'dark:border',
    'dark:border-[#334155]',
    'hover:cursor-pointer',
    'hover:bg-emerald-600',
    'transition-colors',
    'duration-350',
    'ease-in-out'
    );

    let editSpan = document.createElement('span');
    editSpan.classList.add('dark:text-white');
    editSpan.textContent = "Edit"
    editBtn.append(editSpan)

    let delBtn = document.createElement('button');
    delBtn.classList.add(
    'deleteBtn',
    'group',
    'dark:bg-[#0f172a]',
    'px-4',
    'rounded-md',
    'py-1',
    'dark:text-white',
    'text-black',
    'border-1',
    'dark:border-[#334155]',
    'hover:cursor-pointer',
    'hover:text-white',
    'hover:bg-red-600',
    'transition-colors',
    'duration-350',
    'ease-in-out'
    );

    let delSpan = document.createElement('span');
    delSpan.classList.add(
    'dark:text-red-600',
    'transition-colors',
    'duration-350',
    'ease-in-out',
    'group-hover:text-white'
    );
    delSpan.textContent = 'Delete'
    delBtn.append(delSpan)

    action.append(editBtn,delBtn)
    wrapperDiv.append(date, stock, buyPP, sellPP, qty, targetPP, sl,  plInRs, plPercent, days, condition, entryEmo, exitEmo, trailStop,statusIconDiv,emotion, lessonNotes, improvementNote,action);
    document.getElementById('dynamicCard').append(wrapperDiv)
    lucide.createIcons()
}
