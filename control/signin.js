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
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    
    var firebaseUserRef = firebase.database().ref("games/0/"+firebase.auth().currentUser.uid);
        
    firebaseUserRef.on('value', snap => {
        color = snap.child("color").val();
    });
    $('body').css('background-color', color);
}
