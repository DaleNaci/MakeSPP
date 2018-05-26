// Setup
var config = {
    apiKey: "AIzaSyCkGc9WYGQADhMVvrPzLQIMIJeUrfAZB_8",
    authDomain: "makespp-648bb.firebaseapp.com",
    databaseURL: "https://makespp-648bb.firebaseio.com",
    projectId: "makespp-648bb",
    storageBucket: "makespp-648bb.appspot.com",
    messagingSenderId: "1037090689130"
};
firebase.initializeApp(config);

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let data = {};
let objs = [];

if(innerHeight>innerWidth) {
    canvas.width = innerWidth;	
    canvas.height = innerWidth;
} else {
    canvas.width = innerHeight;	
    canvas.height = innerHeight;
}

firebase.database().ref().on("value", snap => {
    data = snap.val();
});

// Functions

function isIn(arr, target) {
    for(let i in arr)
        if(arr[i]==target)
           return true;
    return false;
}

// "Classes"

function Character(x, y, color, attacker, id) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;
    this.direction = 0;
    this.lastDirection = 3;
    this.color = color;
    this.attacker = attacker;
    this.id = id;
    
    this.attack = function() {
        if(this.direction!=0)
            objs.push(new Bullet(this, this.x+.5,this.y+.5,this.direction));
        else
            objs.push(new Bullet(this, this.x+.5,this.y+.5,this.lastDirection));
    }
    
    this.damage = function() {
        firebase.database().ref("games/0/"+this.id+"/points")
    }
    
    this.stop = function() {
        this.direction = 0;
    }
    
    this.move = function() {
        switch(this.direction) {
        
            case 1:
                this.x--;
                break;
            case 2:
                this.y--;
                break;
            case 3:
                this.x++;
                break;
            case 4:
                this.y++;
                break;
                
        }
    }    
    
    this.update = function() {
        
        this.move();
        
        for(indexe in objs) {
            obj = objs[indexe];
            if(obj!=this && (obj.x + obj.width > this.x && obj.x < this.x + this.width) && (obj.y + obj.height > this.y && obj.y < this.y + this.height))
            {
                if(obj instanceof Bullet && obj.sender != this) {
                    objs.splice(indexe,1);
                    this.damage();
                }
                else if(obj instanceof Character)
                    this.damage();
                else if(obj instanceof Block) {
                    this.direction = (this.direction+1)%4+1;
                    this.move()
                    this.stop();
                }
            }

        }
        
        if(this.direction!=0)
            this.lastDirection = this.direction;
        
        this.draw();
        return true;
    }
    
    this.draw = function() {
       
         c.fillStyle = this.color;
        c.fillRect(this.x*canvas.width/100,this.y*canvas.height/100,this.width*canvas.width/100,this.height*canvas.height/100);
    };
}

function Bullet(sender, x, y, direction) {
    
    this.sender = sender;
    this.color = sender.color;
    this.x = x;
    this.y = y;
    this.width = 2;
    this.height = 2;
    this.direction = direction;
    
    this.update = function() {
        
        switch(this.direction) {
        
            case 1:
                this.x-=2;
                break;
            case 2:
                this.y-=2;
                break;
            case 3:
                this.x+=2;
                break;
            case 4:
                this.y+=2;
                break;
                
        }
     
        this.draw();
    }
        
    this.draw = function() {
       
        c.fillStyle = this.color;
        c.fillRect(this.x*canvas.width/100,this.y*canvas.height/100,this.width*canvas.width/100,this.height*canvas.height/100);

    }
    
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    let ids = [];
    
    for(let obj in objs)
        if(objs[obj] instanceof Character) {
            ids.push(objs[obj].id);
        }

    if(Object.keys(data).length != 0)
        for(let x in data.games[0])
            if(!isIn(ids, x)) {
                objs.push(new Character(Math.random()*100, Math.random()*100, data.games[0][x].color, true, x));
            }
    
    for(let obj in objs)
        if(!(objs[obj] instanceof Character)) {
            
            if(objs[obj] instanceof Block) {
                
                if(!objs[obj].update()) {
                    objs.splice(obj,1);
                    continue;
                }
            }
            else {
                objs[obj].update();
            }
            if(objs[obj].x>100 || objs[obj].x<0 || objs[obj].y>100 || objs[obj].y<0)
                objs.splice(obj, 1);
        }
    
    
    
    
    for(let obj in objs)
        if(objs[obj] instanceof Character) {

            if(objs[obj].x>100 || objs[obj].x<0 || objs[obj].y>100 || objs[obj].y<0)
            objs[objs].damage();
    }
                
}

animate();