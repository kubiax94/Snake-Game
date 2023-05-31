const SnakeBorder = document.createElement("canvas");

class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Collider {
    constructor(position,size) {
        this.position = position;
        this.size = size;
    }
               
    
    CollisionCheck(target) {
        
        if(this.position.x < target.position.x + target.size.x/3 &&
           this.position.x + this.size.x/3 > target.position.x &&
           this.position.y < target.position.y + target.size.y/3 &&
           this.size.y/3 + this.position.y > target.position.y)
            {
                return true;
        
            }
        return false;
    }
}

const Direction = {
    
    "ArrowLeft": new Point2D(-1, 0),
    "ArrowRight": new Point2D(1, 0),
    "ArrowUp": new Point2D(0, -1),
    "ArrowDown": new Point2D(0, 1)
    
};

class GameWindow {
    
    static SnakeBorder = document.createElement("canvas");
    
    constructor(Width,Height) {
        
      GameWindow.SnakeBorder.width = Width;
      GameWindow.SnakeBorder.height = Height;
        
      this.MainRenderer = GameWindow.SnakeBorder.getContext("2d");
        
      this.Player = new Snake();
      this.Apple = new Apple();
        
        document.body.onkeydown = (event) => {this.Player.ChangeDir(event)};

    }

    Update() {
        
        window.requestAnimationFrame(() => this.Update());
        
        if(this.Player.Head.collider.CollisionCheck(this.Apple.collider))
        {
            this.Player.AddBodyPart();
            this.Apple.Respawn();
        }
        
        this.Player.Update();

        this.Render();
    }

    Render() {
        
        this.background();
                
        this.MainRenderer.drawImage(this.Apple.Render,
                                     this.Apple.position.x,
                                     this.Apple.position.y);
        
        for(var i = 0; i < this.Player.body.length; i++) {
            this.MainRenderer.drawImage(this.Player.body[i].Render,
                                        this.Player.body[i].position.x,
                                        this.Player.body[i].position.y);
        }

        
        
    }
    
     background() {
        this.MainRenderer.beginPath();
        this.MainRenderer.fillStyle = "black";
        this.MainRenderer.fillRect(0, 0, GameWindow.SnakeBorder.width, GameWindow.SnakeBorder.height);
         
    }

}

class Renderer {
    
    
    
    constructor() {
        this.Render = Renderer.CreateRenderer();
        this.RenderCtx = this.Render.getContext('2d');
    }
    
    static CreateRenderer() {
        return document.createElement("canvas");
    }
    
    
    Draw() {
        
    }
}

class Apple extends Renderer {
    constructor() {
        super();
        
        this.position = new Point2D(Math.random()* GameWindow.SnakeBorder.width, Math.random() * GameWindow.SnakeBorder.height);
        this.Render.width = 40;
        this.Render.height = 40;
      
      

      
        this.RenderCtx.beginPath();
        this.RenderCtx.fillStyle = "red";
        this.RenderCtx.arc(20, 20, 11, 0, 2*Math.PI);
        this.RenderCtx.fill();
        
        var size = new Point2D(this.Render.width, this.Render.height);
        this.collider = new Collider(this.position, size);
    }
    
    Respawn() {
        this.position.x = Math.random() * GameWindow.SnakeBorder.width;
        this.position.y = Math.random() * GameWindow.SnakeBorder.height;
    }
}

class Snake {

  constructor(){
    this.body = [];
      this.HeadDir = Direction['ArrowUp'];
      
    this.Speed = 2;

    for(var i = 0; i < 25 ; i++) {
        this.AddBodyPart();
    }

  }

  Update() {   
      this.Move();
      
  }
    
    ChangeDir(event) {
        console.log(this.body);
        this.Head.bodyDir = Direction[event.key];
        this.body[1].Target = this.Head.position;
        this.body[1].changeDirection = true;
    }

  Move() {
      
      
      for(var i = this.body.length-1; i>=0; i--) {
          this.body[i].Mover(this.Speed);
          
          if(i > 1)
          this.Head.collider.CollisionCheck(this.body[i].collider); 
          
          if(this.body[i].OnPositono && this.body[i].changeDirection && i != 0) {
              
              if(i == this.body.length-1) {
                this.body[i].ChangeTarget(null);
                  continue;
              }
              
              this.body[i].ChangeTarget(this.body[i+1]);

          }
          
      }   

  }
    
    get Head() {
        return this.body[0];
    }
    
    get LastBodyPart() {
       return this.body[this.body.length - 1];
    }
    
    set LastBodyPart(bool) {
        this.LastBodyPart.isTail = false;
    }
    
    AddBodyPart() {
        
        var toAdd = new SnakeBodyPart();
        
                
        if(this.body.length == 0) {
            this.body.push(toAdd);
            this.body[0].isTail = false;       
            this.body[0].isHead = true;
            this.body[0].position = new Point2D(GameWindow.SnakeBorder.width/2, GameWindow.SnakeBorder.height/2);
            this.body[0].collider.position = this.body[0].position;
            this.nextBody = null;
            return;
        }
        
        if(this.LastBodyPart != undefined) {
            
            toAdd.Direction = this.LastBodyPart.bodyDir;
            
            
            if(toAdd.bodyDir.x == Direction.ArrowLeft.x && toAdd.bodyDir.y == Direction.ArrowLeft.y) {
                
                toAdd.position.x = this.LastBodyPart.position.x + this.LastBodyPart.Render.width/2;
                toAdd.position.y = this.LastBodyPart.position.y;
                
            }
            
            if(toAdd.bodyDir.x == Direction.ArrowRight.x && toAdd.bodyDir.y == Direction.ArrowRight.y) {
                
                toAdd.position.x = this.LastBodyPart.position.x - this.LastBodyPart.Render.width/2;
                toAdd.position.y = this.LastBodyPart.position.y;
                
            }
            
            if(toAdd.bodyDir.x == Direction.ArrowUp.x && toAdd.bodyDir.y == Direction.ArrowUp.y) {
                
                toAdd.position.x = this.LastBodyPart.position.x;     
                toAdd.position.y = this.LastBodyPart.Render.height/2 + this.LastBodyPart.position.y;
                
            }
            
            if(toAdd.bodyDir.x == Direction.ArrowDown.x && toAdd.bodyDir.y == Direction.ArrowDown.y) {
                
                toAdd.position.x = this.LastBodyPart.position.x;     
                toAdd.position.y = this.LastBodyPart.position.y - this.LastBodyPart.Render.height/2;
                
            }
            
            
            toAdd.NextBody = this.LastBodyPart;
            
        }

        this.LastBodyPart = false;
        toAdd.isTail = true;
        this.body.push(toAdd);
        
        toAdd.collider.position = toAdd.position;
    }
}

class SnakeBodyPart extends Renderer {
  constructor(x = 0, y = 0) {
      super();
        this.isTail = false;
        this.isHead = false;
        this.color = "red";
        
        this.position = new Point2D(x, y);
        this.targetPos = new Point2D(x, y);
        this.nextBody = null;
        this.changeDirection = false;
        
      this.Render.width = 40;
      this.Render.height = 40;
      
      

      
      this.RenderCtx.beginPath();
      this.RenderCtx.fillStyle = "green";
      this.RenderCtx.arc(this.position.x+20, this.position.y+20, 11, 0, 2*Math.PI);
      this.RenderCtx.fill();
      
      this.bodyDir = new Point2D(0,0); 
      this.Direction = Direction.ArrowUp;
      
      var size = new Point2D(this.Render.width, this.Render.height);
      
      this.collider = new Collider(this.position, size);
  }
    
    
    ChangeTarget(previous) {
        
            if(this.changeDirection) {
                this.Direction = this.nextBody.bodyDir;
                this.changeDirection = false;
                
                if(previous != null){
                    previous.changeDirection = true;
                    previous.Target = this.position;
                }
                
            }

        
    }
    
    set NextBody(body) {
        this.nextBody = body;
        
        this.targetPos.x = body.position.x;
        this.targetPos.y = body.position.y;
    }
    
    set Target(newTar) {
        this.targetPos.x = newTar.x;
        this.targetPos.y = newTar.y;
    }
    
    set Direction(newDir) {
        this.bodyDir.x = newDir.x;   
        this.bodyDir.y = newDir.y;   
    }
    
    
    
    get OnPositono() {
        
        if(this.isHead) {
            return false;
        }
        
        if(this.position.x == this.targetPos.x && 
           this.position.y == this.targetPos.y )
          return true;
        
        return false;
    }
    
  Mover(speed) {
      
        this.position.x += speed * this.bodyDir.x;
        this.position.y += speed * this.bodyDir.y;
      
  }
}



var  gameWindow = new GameWindow(800, 600);

document.body.appendChild(GameWindow.SnakeBorder);

window.requestAnimationFrame(()=>gameWindow.Update())

