var config = {
    apiKey: "AIzaSyCkGc9WYGQADhMVvrPzLQIMIJeUrfAZB_8",
    authDomain: "makespp-648bb.firebaseapp.com",
    databaseURL: "https://makespp-648bb.firebaseio.com",
    projectId: "makespp-648bb",
    storageBucket: "makespp-648bb.appspot.com",
    messagingSenderId: "1037090689130"
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

let data = {};
let objs = {};

firebase.database().ref().on("value", snap => {
    data = snap.val();
});

// "Classes"

function Character(x, y, color, id) {
    this.x = x;
    this.y = y;
    this.width = 2;
    this.height = 2;
    this.direction = 0;
    this.lastDirection = 3;
    this.color = color;
    this.id = id;
    
    this.attack = function() {
        if(this.direction!=0)
            objs.push(new Bullet(this, this.x+.5,this.y+.5,this.direction));
        else
            objs.push(new Bullet(this, this.x+.5,this.y+.5,this.lastDirection));
    }
    
    this.damage = function() {
        this.health-=10;
        let spl = this.color.split(',');
        spl[3] = (this.health/100.0).toString()+")";
        this.color = "";
        for(let x=0;x<spl.length-1;x++) {
            this.color+=spl[x]+",";
        }
        this.color+=spl[spl.length-1];
    }
    
    this.hurt = function() {
        this.health--;
        let spl = this.color.split(',');
        spl[3] = (this.health/100.0).toString()+")";
        this.color = "";
        for(let x=0;x<spl.length-1;x++) {
            this.color+=spl[x]+",";
        }
        this.color+=spl[spl.length-1];
    }
    
    this.stop = function() {
        this.direction = 0;
    }
    
    this.build = function() {
        
        switch(this.direction) {
                
            case 1:
                objs.push(new Block(this,this.x-this.width,this.y));
                break;
            case 2:
                objs.push(new Block(this,this.x,this.y-this.height));
                break;
            case 3:
                objs.push(new Block(this,this.x+this.width,this.y));
                break;
            case 4:
                objs.push(new Block(this,this.x,this.y+this.height));
                break;
                
        }
        
        this.stop();
        
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
    
    this.big = function() {
        this.width+=2;
        this.height+=2;
    }
    
    
    this.update = function() {
        
        if(this.health<=0)
            return false;
        
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
                    this.hurt();
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
    }
    
    this.getInfo = function() {
        return {
            x: this.x,
            y: this.y,
            health: this.health,
            type: "Character"
        };
    }
}

function Bullet(sender, x, y, direction) {
    
    this.sender = sender;
    this.color = sender.color;
    this.x = x;
    this.y = y;
    this.width = 1;
    this.height = 1;
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
        c.fillRect(this.x*canvas.width/100,this.y*canvas.height/100,canvas.width/100,canvas.height/100);

    }
    
}