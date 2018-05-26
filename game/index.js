var signIn = document.getElementById("sign-in");

var upBool = false;
var downBool = false;
var leftBool = false;
var rightBool = false;

var attacking = false;
var color;

var A = document.getElementById("A");
var B = document.getElementById("B");
var C = document.getElementById("C");
var D = document.getElementById("D");

var up = document.getElementById("up");
var down = document.getElementById("down");
var left = document.getElementById("left");
var right = document.getElementById("right");

var atk = document.getElementById("attack");

function setBackground(){
    var firebaseUserRef = firebase.database().ref("games/0/"+firebase.auth().currentUser.uid);
        
    firebaseUserRef.on('value', snap => {
        color = snap.child("color").val();
    });
    $('body').css('background-color', color);
}

function checkAnsA(){
    var answerRef = firebase.database().ref();
    firebaseUserRef.on('value', snap => {
        var ans = snap.child("cq").val();
        
        if(ans === "A") {
            var firebaseUserRef = firebase.database().ref("games/0/"+firebase.auth().currentUser.uid);

            firebaseUserRef.on('value', snap => {
                var points = snap.child("points").val();
                firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/points").set(points+200);
            });
        
            //do the correct screen thing
            
            firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/status").set("attacker");
        }
        else {
            //do the wrong screen thing
            firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/status").set("runner");
        }
    });
}
function checkAnsB(){
    var answerRef = firebase.database().ref();
    firebaseUserRef.on('value', snap => {
        var ans = snap.child("cq").val();
        
        if(ans === "B") {
            var firebaseUserRef = firebase.database().ref("games/0/"+firebase.auth().currentUser.uid);

            firebaseUserRef.on('value', snap => {
                var points = snap.child("points").val();
                firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/points").set(points+200);
            });
            //do the correct screen thing
            firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/status").set("attacker");
        }
        else {
            firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/status").set("runner");
        }
    });}
function checkAnsC(){
    var answerRef = firebase.database().ref();
    firebaseUserRef.on('value', snap => {
        var ans = snap.child("cq").val();
        
        if(ans === "C") {
            var firebaseUserRef = firebase.database().ref("games/0/"+firebase.auth().currentUser.uid);

            firebaseUserRef.on('value', snap => {
                var points = snap.child("points").val();
                firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/points").set(points+200);
            });
            //do the correct screen thing
            firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/status").set("attacker");
        }
        else {
            firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/status").set("runner");
        }
    });
}
function checkAnsD(){
    var answerRef = firebase.database().ref();
    firebaseUserRef.on('value', snap => {
        var ans = snap.child("cq").val();

        if(ans === "D") {
            var firebaseUserRef = firebase.database().ref("games/0/"+firebase.auth().currentUser.uid);

            firebaseUserRef.on('value', snap => {
                var points = snap.child("points").val();
                firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/points").set(points+200);
            });
            //do the correct screen thing
            firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/status").set("attacker");
        }
        else {
            firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/status").set("runner");
        }
    });
}


function setReleaseLeft(){
    leftBool = false;
    if(!(rightBool||downBool||upBool))
        firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/direction").set("none");
}
function setReleaseRight(){
    rightBool = false;
    if(!(leftBool||downBool||upBool))
        firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/direction").set("none");
}
function setReleaseUp(){
    upBool = false;
    if(!(rightBool||downBool||leftBool))
        firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/direction").set("none");
}
function setReleaseDown()){
    downBool = false;
    if(!(rightBool||leftBool||upBool))
        firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/direction").set("none");
}
function setLeft(){
    leftBool = true;
}
function setRight(){
    rightBool = true;
}
function setDown(){
    downBool = true;
}
function setUp(){
    upBool = true;
}

function setAttacking(){
    if(attacking) {
        attacking = false;
        firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/attacking").set("false");
    }
    else{
        attacking = true;
        firebase.database().ref("games/0/"+firebase.auth().currentUser.uid+"/attacking").set("true");
    }
}
