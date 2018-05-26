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

let mouse = {
	x: 0,
    y: 0
};

//let player = new Character(20, 20,'rgba(0,0,255,1)');
//let enemy = new Character(80,20,'rgba(255,0,0,1)')
let objs = [];
let angle = 0;
let turning = 0;
let data


// Event Listeners
addEventListener('mousemove', event => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener('resize', () => {
	if(innerHeight>innerWidth) {
        canvas.width = innerWidth;	
        canvas.height = innerWidth;
    } else {
        canvas.width = innerHeight;	
        canvas.height = innerHeight;
    }
});

firebase.database().ref("game").on("value", snap => {
    data = snap.val();
})

//addEventListener('keydown', e => {
//    if(e.keyCode>=37 && e.keyCode<=40)
//        player.direction = e.keyCode - 36;
//    else if(e.keyCode === 191)
//        player.attack();
//    else if(e.keyCode === 186)
//        player.build();
//    else if(e.keyCode == 87)
//        enemy.direction = 2;
//    else if(e.keyCode == 83)
//        enemy.direction = 4;
//    else if(e.keyCode == 65)
//        enemy.direction = 1;
//    else if(e.keyCode == 68)
//        enemy.direction = 3;
//    else if(e.keyCode === 81)
//        enemy.attack();
//    else if(e.keyCode === 49)
//        enemy.build();
//});

let shakeEvent = new Shake({threshold: 10});
shakeEvent.start();
window.addEventListener('shake', function(){
    turning = 2;
}, false);

//"Classes"

function Character(x, y, color, id) {
    this.x = x;
    this.y = y;
    this.width = 2;
    this.height = 2;
    this.direction = 0;
    this.lastDirection = 3;
    this.health = 100;
    this.color = color;
    this.id = id;
    
    this.attack = function() {
        if(this.direction!=0)
            objs.push(new Bullet(this, this.x+.5,this.y+.5,this.direction));
        else
            objs.push(new Bullet(this, this.x+.5,this.y+.5,this.lastDirection));
    }
    
    this.heal = function() {
        
        this.health=100;
        let spl = this.color.split(',');
        spl[3] = (this.health/100.0).toString()+")";
        this.color = "";
        for(let x=0;x<spl.length-1;x++) {
            this.color+=spl[x]+",";
        }
        this.color+=spl[spl.length-1];
        
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

function Block(sender, x, y) {
    this.color = sender.color;
    this.x = x;
    this.y = y;
    this.width = 2;
    this.height = 2;
    this.health = sender.health;
    
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
    
    this.update = function() {
        
        if(this.health<0)
            return false;
        
        for(indexe in objs) {
            obj = objs[indexe];
            if(obj!=this && (obj.x + obj.width > this.x && obj.x < this.x + this.width) && (obj.y + obj.height > this.y && obj.y < this.y + this.height))
            {
                if(obj instanceof Bullet && obj.sender != this) {
                    objs.splice(indexe,1);
                    this.damage();
                }
            }

        }
        
        this.draw();
        return true;
    }
    
    this.draw = function() {
        c.fillStyle = this.color;
        c.fillRect(this.x*canvas.width/100,this.y*canvas.height/100,this.width*canvas.width/100,this.height*canvas.height/100);
        
        c.fillStyle = "rgba(0, 0, 0, 0.2)";
        c.fillRect(this.x*canvas.width/100,this.y*canvas.height/100,this.width * canvas.width/100,this.height * canvas.height/100);
    }
    
}

//Game Function

function gameOver() {
    console.log("Game over u lose");
}

function isIn(arr, target) {
    for(let i in arr)
        if(arr[i]==target)
           return true;
    return false;
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    let ids = [];
    
    for(let obj in objs)
        if(objs[obj] instanceof Character) {
            ids.push(objs[obj].id);
        }
    
    for(let x in data)
        if(!isIn(ids, x))
            objs.push(new Character(Math.random()*100, Math.random()*100, "#ff0000", x));
    
    if(turning>0.001) {
        angle+=10;
        turning-=1/36.0;
    }
    
    angle = angle%360;
    
    canvas.style.transform = "rotate("+angle+"deg)";

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
                
//    if(!player.update())
//        gameOver();
//    if(player.x>100 || player.x<0 || player.y>100 || player.y<0)
//        player.hurt();
//    
//    if(!enemy.update())
//        gameOver();
//    if(enemy.x>100 || enemy.x<0 || enemy.y>100 || enemy.y<0)
//        enemy.hurt();
    
    
    for(let obj in objs)
        if(objs[obj] instanceof Character) {
            if(!objs[obj].update()) {
                objs.splice(obj,1);
                continue;
            }
        if(objs[obj].x>100 || objs[obj].x<0 || objs[obj].y>100 || objs[obj].y<0)
            objs[objs].hurt();
    }
                
//    objs[0].attack();
}

animate();