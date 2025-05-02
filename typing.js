const str = "the quick brown fox jumps over lazy dog speed typing accuracy rhythm practice focus keyboard monitor screen challenge letter fast sunlight window clock pencil notebook dream energy motion silent active clever power always never before behind careful simple planet rocket galaxy universe orbit gravity future digital program terminal command execute random skills boost sharp brain train moment value reason system pattern logic together instant magic wonder rapid storm update create improve master vision hope memory sharpness awareness reflex thunder start finish calm steady precise victory brave courage loyal unity honest bright shadow whisper mountain river forest ocean stormy cloudy breezy summer winter monsoon rainstorm sunrise sunset sparkle shine balance harmony dreamer achiever creator thinker maker believer friend family brother sister parent teacher student captain player team school college university science fiction reality mystery thriller comedy adventure journey path road travel explore discover invent design build code debug compile test deploy network server client cloud database array string integer boolean object variable constant loop method structure solve plan idea concept imagine ancient modern virtual space star moon earth fire air water ice metal stone grass sand wind wave fog mist spell hero villain quest castle kingdom treasure secret trap puzzle lock key portal gate realm myth legend sword shield armor battle warrior archer wizard guardian champion";
const words=str.split(" ");
const typingArea=document.querySelector('.typing-area');
const para=document.querySelector(".para");
const totalWords=290;

function formatletter(word){
    let result=``;
    for(let char of word){
        result+=`<span class="letter">${char}</span>`;
    }
    return result;
}

function randomWord(){
    let word = words[Math.floor(Math.random() * words.length)];
    console.log(word);
    return `<div class="word">${formatletter(word)}</div>`;
}

function insertpara(){
    let html='';
    for(let i=0;i<totalWords;i++){
        html+=randomWord()+" ";
    }
    para.innerHTML=html;
}

insertpara();