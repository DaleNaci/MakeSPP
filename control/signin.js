var config = {
    apiKey: "AIzaSyCkGc9WYGQADhMVvrPzLQIMIJeUrfAZB_8",
    authDomain: "makespp-648bb.firebaseapp.com",
    databaseURL: "https://makespp-648bb.firebaseio.com",
    projectId: "makespp-648bb",
    storageBucket: "makespp-648bb.appspot.com",
    messagingSenderId: "1037090689130"
};
firebase.initializeApp(config);
let provider = new firebase.auth.GoogleAuthProvider();
let data;


function login() {
        firebase.auth().signInWithPopup(provider).then(function(result) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('controller').style.display = 'block';
        console.log(firebase.auth().currentUser);
    })
    
    var firebaseUserRef = firebase.database().ref("games/0/"+firebase.auth().currentUser.uid);
        
    firebaseUserRef.on('value', snap => {
        color = snap.child("color").val();
    });
    $('body').css('background-color', color);
}
