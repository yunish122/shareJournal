import { create_element, createSpan } from "./helper/helper.js"
import { getState, updateState } from "./state/state.js"
let dialog = document.getElementById('myDialog')

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
    document.querySelector('html').classList.toggle('dark')
})

document.getElementById('saveTrade').addEventListener('click',(e)=>{

    saveTrade()
})

function showDialog(){
    let dialog = document.getElementById('myDialog')

    dialog.classList.remove('hidden')
    dialog.classList.add('flex')
}

function hideDialog(){
    let dialog = document.getElementById('myDialog')
    dialog.classList.add('hidden')
    dialog.classList.remove('flex')
}
function poluteInput(){
    let state = getState()

    let validBuyPp = validation('inputBuyPrice')
    let validSellPp = validation('inputSellPrice')
    let validQty = validation('inputQty')
    let validTarget = validation('inputTarget')
    let validSl = validation('inputSl')
    let validExitPp = validation('inputExitPrice')

    if(!validBuyPp || !validExitPp || !validQty || !validSellPp || !validSl || !validTarget){
        return false;
    }

    let date = document.getElementById('inputDate').value ;
    let stock = document.getElementById('inputStock').value;
    let buyPP = document.getElementById('inputBuyPrice').value;
    let sellPP = document.getElementById('inputSellPrice').value;
    let qty = document.getElementById('inputQty').value;

    let target = document.getElementById('inputTarget').value;
    let sl = document.getElementById('inputSl').value;
    let exitPP = document.getElementById('inputExitPrice').value;

    let condition = document.getElementById('inputMarketCondition');
    let conditionText = condition.options[condition.selectedIndex].text;

    let outputEmo = document.getElementById('inputEntryEmo');
    let outputEmoText = outputEmo.options[outputEmo.selectedIndex].text;

    let exitEmo = document.getElementById('inputExitEmo');
    let exitEmoText = exitEmo.options[exitEmo.selectedIndex].text;

    let emotionNotes = document.getElementById('inputEmotionNotes').value || '-';
    let lesson = document.getElementById('inputLesson').value || '-';

    let improvement = document.getElementById('inputImprovement').value || '-';

    let newState = [{buyDate: date,stockName: stock, buyPrice: buyPP,sellPrice: sellPP,quantity: qty, targetPrice: target, stopLoss: sl,
        exitPrice: exitPP, marketCondition: conditionText, entryEmotion: outputEmoText, exitEmotion: exitEmoText,
        emtionNoteKey: emotionNotes, lessonKey: lesson, improveKey: improvement, plRs: 0, plPercentage: 0, holdDays: 0, soldStatus: false,
        trailStop: 0
    }]
    updateState({trade: [...state.trade,...newState]})

    return true
}
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
function render(){
    console.log(localStorage)

    let state = getState()
    console.log(state)
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



function createCard(elem,idx){
    const wrapperDiv = document.createElement('div')
    wrapperDiv.setAttribute('data-index',idx) 
    wrapperDiv.id = 'wrapperDiv'
    wrapperDiv.classList.add('gridStyle')
    wrapperDiv.classList.add('min-w-0') // allow children to shrink in grid


    //logic: here i gave made a array of obj with id and value to later put it in evey span using for loop. 
    // disadvantage is i have less control now

    let date = createSpan(['dark:text-white', 'text-black']);
    date.textContent = elem.buyDate;

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

    let plInRs = createSpan(['dark:text-white', 'text-black']);
    plInRs.textContent = elem.plRs;

    let plPercent = createSpan(['dark:text-white', 'text-black']);
    plPercent.textContent = elem.plPercentage;

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

    let sellStatus = createSpan(['dark:text-white', 'text-black','flex','text-center']);
    sellStatus.textContent = elem.soldStatus;

    let emotion = createSpan(['dark:text-white','text-black','text-sm','text-center','truncate','min-w-0','block','overflow-hidden','max-w-[200px]','wrap-break-word','hyphens-auto','w-[200px]','line-clamp-3']);
    emotion.textContent = elem.emtionNoteKey;

    let lessonNotes = createSpan(['dark:text-white','text-black','text-sm','text-center','truncate','min-w-0','block','overflow-hidden','max-w-[200px]','wrap-break-word','hyphens-auto','w-[200px]','line-clamp-3']);
    lessonNotes.textContent = elem.lessonKey;

    let improvementNote = createSpan(['dark:text-white','text-black','text-sm','text-center','truncate','min-w-0','block','overflow-hidden','max-w-[200px]','wrap-break-word','hyphens-auto','w-[200px]','line-clamp-3']);
    improvementNote.textContent = elem.improveKey;

    let action = document.createElement('div')
    action.classList.add('flex','gap-2','items-center')
    let editBtn = document.createElement('button');
    editBtn.classList.add(
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
    wrapperDiv.append(date, stock, buyPP, sellPP, qty, targetPP, sl, exitPrice, plInRs, plPercent, days, condition, entryEmo, exitEmo, trailStop, sellStatus, emotion, lessonNotes, improvementNote,action);
    document.getElementById('dynamicCard').append(wrapperDiv)

}
