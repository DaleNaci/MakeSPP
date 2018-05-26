let provider = new firebase.auth.GoogleAuthProvider();
let data;


function login() {
   firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function(result) {
        var firebaseUserRef = firebase.database().ref("games/0/"+firebase.auth().currentUser.uid);
        
    firebaseUserRef.on('value', snap => {
        color = snap.child("color").val();
    });
    $('body').css('background-color', color);
   }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
        
      console.log(error.code)
      console.log(error.message)
   });
