var config = {
    apiKey: "AIzaSyAAmdIbaOZWJJf-vXSPaCSPGXscl72T6cM",
    authDomain: "fir-99747.firebaseapp.com",
    databaseURL: "https://fir-99747.firebaseio.com",
    projectId: "fir-99747",
    storageBucket: "fir-99747.appspot.com",
    messagingSenderId: "156319699888"
};
firebase.initializeApp(config);

// Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

if(innerHeight>innerWidth) {
    canvas.width = innerWidth;	
    canvas.height = innerWidth;
} else {
    canvas.width = innerHeight;	
    canvas.height = innerHeight;
}