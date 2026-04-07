// ==========================
// GEMINI API KEY
// ==========================

const API_KEY = "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";


// ==========================
// CURRENT CHARACTER
// ==========================

let currentCharacter = "";
let userQuestion = "";


// ==========================
// SPEECH RECOGNITION
// ==========================

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-IN";
recognition.interimResults = false;
recognition.continuous = true;
recognition.maxAlternatives = 1;


// ==========================
// WHEN USER SPEAKS
// ==========================

recognition.onresult = function(event){

userQuestion = event.results[event.results.length - 1][0].transcript;

console.log("User asked:", userQuestion);

};


// ==========================
// RECORDING START
// ==========================

recognition.onstart = function(){

console.log("Listening...");

};


// ==========================
// RECORDING ERROR
// ==========================

recognition.onerror = function(event){

console.error("Speech recognition error:", event.error);

};


// ==========================
// CLICK EVENTS
// ==========================

document.addEventListener("DOMContentLoaded", () => {

document.querySelector("#kalam")
.addEventListener("click", () => {
startConversation("APJ Abdul Kalam");
});

document.querySelector("#sarabhai")
.addEventListener("click", () => {
startConversation("Vikram Sarabhai");
});

document.querySelector("#bhabha")
.addEventListener("click", () => {
startConversation("Homi Bhabha");
});

});


// ==========================
// START RECORDING
// ==========================

function startConversation(character){

currentCharacter = character;

alert("Speak your question. Press A when finished.");

recognition.start();

}


// ==========================
// STOP RECORDING WITH KEY
// ==========================

document.addEventListener("keydown", function(event){

if(event.key === "a" || event.key === "A"){

console.log("Stopping recording");

recognition.stop();

askAI(userQuestion);

}

});


// ==========================
// GEMINI AI REQUEST
// ==========================

async function askAI(question){

try{

let response = await fetch("https://openrouter.ai/api/v1/chat/completions",{

method:"POST",

headers:{
"Authorization":"Bearer YOUR_OPENROUTER_API_KEY",
"Content-Type":"application/json",
"HTTP-Referer":"http://localhost",
"X-Title":"KaalYatra VR"
},

body: JSON.stringify({

model:"openai/gpt-3.5-turbo",

messages:[
{
role:"system",
content:"You are " + currentCharacter + ". Explain India's space history briefly."
},
{
role:"user",
content:question
}

]

})

});

let data = await response.json();

console.log(data);

if(!data.choices){
speak("AI service error.");
return;
}

let reply = data.choices[0].message.content;

speak(reply);

}

catch(error){

console.error(error);

speak("Connection error.");

}

}


// ==========================
// TEXT TO SPEECH
// ==========================

function speak(text){

let speech = new SpeechSynthesisUtterance(text);

speech.lang = "en-IN";
speech.rate = 1;
speech.pitch = 1;

window.speechSynthesis.speak(speech);

}