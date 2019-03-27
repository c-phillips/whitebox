// global references
var cm;             // canvas manager
var gamestate;      // gamestate manager
var score_table;    // highscore table

// color globals
var colors = {
    LIGHT_GRAY: "#ECF0F1",
    SEAFOAM:    "#A3E4D7",
    SUNFLOWER:  "#F9E79F",
    LAVENDER:   "#D7BDE2",
    ROSE:       "#F5B7B1",
    SKY:        "#AED6F1",
    FIR:        "#7DCEA0",
    NAVY:       "#5499C7",
    ORANGE:     "#F8C471",
    CLOUDY:     "#AEB6BF",
    EGGSHELL:   "#F7F9F9",
    REFLECT:    "#F1C40F",
    HIT:        "#E74C3C",
    BORDER:     "#D0D3D4"
};


//============================================================================
//  Vector Classes/Functions
//============================================================================
function vec_str(v){
    return "("+v.x+", "+v.y+")";
}

function vec_comp(u,v){
    return (u.x == v.x && u.y == v.y);
}

function add_vec(u,v){
    return {x:u.x+v.x, y:u.y+v.y};
}

function diff_vec(u,v){
    return {x:u.x-v.x, y:u.y-v.y};
}

//============================================================================
//  Canvas Classes
//============================================================================
function CanvasElement(type, interactive=false, drawable=false){
    this.type = type;
    this.interactive = interactive;
    this.drawable = drawable;
}

function CanvasContainer(elems=[], type="container", interactive=false, drawable=true){
    CanvasElement.call(this, type=type, interactive=interactive, drawable=drawable);
    this.elements = [];
    for(var i=0; i < elems.length; i++){
        this.elements.push(elems[i]);
    }

    this.draw = function(cx){
        this.elements.forEach(elem => { elem.draw(cx); });
    };
}

function Shape(pos, type, color, interactive=false){

    CanvasElement.call(this, "shape:"+type, interactive=interactive, drawable=true);

    this.pos = pos;
    this.color = color;
    
    this.draw = function(){
        console.error("Implement a draw function dingus!");
    };

    this.point_inside = function(){
        console.error("Implement a point_inside function yo!");
    };
}

var draw_shapes = {
    BOX:    0,
    CIRCLE: 1,
    X:      2,
    SM_BOX: 3,
    DIAMOND:4,
    JAPAN:  5,
    XDOT:   6
};

function Box(pos, shape, color, id=null, clickable=false, gridpos=null){
    this.shape = shape;
    this.draw_shape = draw_shapes.BOX;
    this.id = id;
    this.clickable = clickable;
    this.gridpos = gridpos;
    this.background_color = "white";
    this.text = null;

    interactive = false;
    if(this.clickable){
        interactive = true;
    }

    Shape.call(this, pos, "box", color, interactive=interactive);

    this.draw = function(cx){
        cx.fillStyle = this.background_color;
        cx.fillRect(this.pos[0], this.pos[1], this.shape[0], this.shape[1]);
        switch(this.draw_shape){
            case draw_shapes.CIRCLE:
                // cx.beginPath();
                // cx.arc(this.pos[0]+(0.5*this.shape[0]), this.pos[1]+(0.5*this.shape[0]), this.shape[0]*0.5*0.6, 0, Math.PI*2, true);
                // cx.fillStyle = "gray";
                // cx.fill();
                // cx.beginPath();
                // cx.arc(this.pos[0]+(0.5*this.shape[0]), this.pos[1]+(0.5*this.shape[0]), this.shape[0]*0.5*0.5, 0, Math.PI*2, true);
                // cx.fillStyle = this.color;
                // cx.fill();
                cx.beginPath();
                cx.arc(this.pos[0]+(0.5*this.shape[0]), this.pos[1]+(0.5*this.shape[0]), this.shape[0]*0.5*0.6, 0, Math.PI*2, true);
                cx.fillStyle = this.color;
                cx.fill();
                cx.beginPath();
                cx.arc(this.pos[0]+(0.5*this.shape[0]), this.pos[1]+(0.5*this.shape[0]), this.shape[0]*0.5*0.55, 0, Math.PI*2, true);
                cx.strokeStyle = "rgba(0,0,0,0.2)";
                cx.lineWidth=6;
                cx.stroke();
                break;
            case draw_shapes.X:
                cx.beginPath();
                cx.moveTo(this.pos[0]+this.shape[0]*0.75, this.pos[1]+this.shape[0]*0.75);
                cx.lineTo(this.pos[0]+this.shape[0]*0.25, this.pos[1]+this.shape[0]*0.25);

                cx.moveTo(this.pos[0]+this.shape[0]*0.75, this.pos[1]+this.shape[0]*0.25);
                cx.lineTo(this.pos[0]+this.shape[0]*0.25, this.pos[1]+this.shape[0]*0.75);

                cx.strokeStyle = this.color;
                cx.lineWidth = 6;
                cx.stroke();
                break;
            case draw_shapes.SM_BOX:
                cx.beginPath();
                cx.fillStyle = "gray";
                cx.fillRect(this.pos[0]+this.shape[0]*0.2, this.pos[1]+this.shape[0]*0.2, this.shape[0]*0.6, this.shape[1]*0.6);
                cx.beginPath();
                cx.fillStyle = this.color;
                cx.fillRect(this.pos[0]+this.shape[0]*0.25, this.pos[1]+this.shape[0]*0.25, this.shape[0]*0.5, this.shape[1]*0.5);
                cx.beginPath();
                cx.fillStyle = "rgba(0,0,0,0.1)";
                cx.fillRect(this.pos[0]+this.shape[0]*0.35, this.pos[1]+this.shape[0]*0.35, this.shape[0]*0.4, this.shape[1]*0.4);
                break;
            case draw_shapes.DIAMOND:
                let a = 0.8;
                cx.beginPath();
                cx.moveTo(this.pos[0]+this.shape[0]*0.5, this.pos[1]+this.shape[0]*(1-a));
                cx.lineTo(this.pos[0]+this.shape[0]*a, this.pos[1]+this.shape[0]*0.5);
                cx.lineTo(this.pos[0]+this.shape[0]*0.5, this.pos[1]+this.shape[0]*a);
                cx.lineTo(this.pos[0]+this.shape[0]*(1-a), this.pos[1]+this.shape[0]*0.5);
                cx.closePath();
                cx.fillStyle = this.color;
                cx.fill();
                break;
            case draw_shapes.JAPAN:
                cx.beginPath();
                cx.arc(this.pos[0]+(0.5*this.shape[0]), this.pos[1]+(0.5*this.shape[0]), this.shape[0]*0.5*0.6, 0, Math.PI*2, true);
                cx.fillStyle = "white";
                cx.fill();
                cx.beginPath();
                cx.arc(this.pos[0]+(0.5*this.shape[0]), this.pos[1]+(0.5*this.shape[0]), this.shape[0]*0.5*0.4, 0, Math.PI*2, true);
                cx.fillStyle = this.color;
                cx.fill();
                cx.beginPath();
                cx.arc(this.pos[0]+(0.5*this.shape[0]), this.pos[1]+(0.5*this.shape[0]), this.shape[0]*0.5*0.6, 0, Math.PI*2, true);
                cx.strokeStyle = "gray";
                cx.stroke();
                break;
            case draw_shapes.XDOT:
                let c = 0.55
                let r = 0.6

                cx.beginPath();
                cx.arc(this.pos[0]+(0.5*this.shape[0]), this.pos[1]+(0.5*this.shape[0]), this.shape[0]*0.5*r, 0, Math.PI*2, true);
                cx.fillStyle = colors.ROSE;
                cx.fill();

                cx.beginPath();
                cx.moveTo(this.pos[0]+this.shape[0]*r, this.pos[1]+this.shape[0]*r);
                cx.lineTo(this.pos[0]+this.shape[0]*(1-r), this.pos[1]+this.shape[0]*(1-r));

                cx.moveTo(this.pos[0]+this.shape[0]*r, this.pos[1]+this.shape[0]*(1-r));
                cx.lineTo(this.pos[0]+this.shape[0]*(1-r), this.pos[1]+this.shape[0]*r);

                cx.strokeStyle = "rgba(0,0,0,0.2)";
                cx.lineWidth = 6;
                cx.stroke();
                
                // cx.beginPath();
                // cx.arc(this.pos[0]+(0.5*this.shape[0]), this.pos[1]+(0.5*this.shape[0]), this.shape[0]*0.5*c, 0, Math.PI*2, true);
                // cx.strokeStyle = "rgba(0,0,0,0.2)";
                // cx.stroke();
                break;
            default:
                cx.fillStyle = this.color;
                cx.fillRect(this.pos[0], this.pos[1], this.shape[0], this.shape[1]);
        }
        if(this.text != null){
            cx.beginPath();
            cx.arc(this.pos[0]+(0.5*this.shape[0]), this.pos[1]+(0.5*this.shape[0]), this.shape[0]*0.5*0.1, 0, Math.PI*2, true);
            cx.fillStyle = "gray";
            cx.fill();
            // cx.font = "8pt Arial";
            // cx.textAlign = "center";
            // cx.fillStyle = "gray";
            // cx.fillText(this.text, this.pos[0]+0.5*this.shape[0], this.pos[1]+0.75*this.shape[0]);
        }
    };

    this.point_inside = function(mpos){
        if(!this.clickable){ return null; }
        
        if(this.pos[0] < mpos.x &&  mpos.x < this.pos[0]+this.shape[0] && this.pos[1] < mpos.y && mpos.y < this.pos[1]+this.shape[1]){
            return true;
        }

        return false;
    };
}

function LineGrid(pos, dims, size, interactive=false){

    CanvasElement.call(this, "LineGrid", interactive=interactive, drawable=true);

    this.pos = pos;
    this.dims = dims;
    this.size = size;
    this.ends = [];
    
    for(var i = 0; i < this.dims[0]; i++){
        let new_x = this.pos.x+i*size+i+this.size;
        this.ends.push([
            {x:new_x, y:this.pos.y}, 
            {x:new_x, y:this.pos.y+size*dims[1]+dims[1]+this.size}
        ]);
    }

    for(var i = 0; i < this.dims[0]; i++){
        let new_y = this.pos.y+i*size+i+this.size;
        this.ends.push([
            {x:this.pos.x,                        y:new_y}, 
            {x:this.pos.x+size*dims[0]+dims[0]+this.size, y:new_y}
        ]);
    }

    this.draw = function(cx){
        for(var i = 0; i < this.ends.length; i++){
            p1 = this.ends[i][0];
            p2 = this.ends[i][1];
            cx.beginPath();
            cx.moveTo(p1.x,p1.y);
            cx.lineTo(p2.x,p2.y);
            cx.lineWidth = 3;
            cx.strokeStyle = colors.BORDER;
            cx.stroke();
        }

        cx.strokeStyle = "gray";
        cx.strokeRect(this.pos.x+this.size+1, this.pos.y+1, this.size*(this.dims[0]-1)+this.dims[0]-2, this.size*(this.dims[1]+1)+this.dims[0]-2);

        cx.strokeStyle = "gray";
        cx.strokeRect(this.pos.x+1, this.pos.y+this.size+1, this.size*(this.dims[0]+1)+this.dims[0]-2, this.size*(this.dims[1]-1)+this.dims[0]-2);
    };

    this.click = function(mpos){
        this.boxes.forEach(box => {
            if(box.point_inside(mpos)){  
                console.log("Clicked @ ("+mpos.x+","+mpos.y+"): ("+this.gridpos+"), "+this.id+" => "+this.type);
                return true;
            }
        });
    };
}

function CanvasManager(canvas){
    this.canvas = document.querySelector("canvas");
    this.cx = this.canvas.getContext("2d");

    this.elements = [];
    this.background_color = "white";

    this.canvas.addEventListener('click', (e) => {this.click_handler(e)}, true);

    this.init = function(background="white"){
        let dim = Math.min(0.5*window.innerWidth, 0.5*window.innerHeight);
        this.cx.canvas.width = dim;
        this.cx.canvas.height = dim;
        
        // set background color
        this.background_color = background;
    };
    
    this.clear = function(){
        this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cx.fillStyle = this.background_color;
        this.cx.fillRect(0, 0, this.cx.canvas.width, this.cx.canvas.height);
    }

    this.click_handler = function(e){
        var mx, my;
        if (e.pageX || e.pageY) { 
            mx = e.pageX;
            my = e.pageY;
        }
        else { 
            mx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
            my = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } 
        mx -= this.canvas.offsetLeft;
        my -= this.canvas.offsetTop;
        
        // We return a simple javascript object (a hash) with x and y defined
        this.click_manager({x: mx, y: my});
    };

    this.click_manager = function(mpos){
        this.elements.forEach(elem => {
            let obj = elem.obj;
            if(obj.interactive){
                if(obj.click(mpos)){
                    return true;
                }
            }
        });
    };

    this.update = function(){
        this.clear();

        this.elements.forEach(elem => {
            let obj = elem.obj;
            if(obj.drawable){
                obj.draw(this.cx);
            }
        });
    };

    this.add_element = function(element){
        this.elements.push({obj: element, interactive:element.interactive, type:element.type});
    };

    this.grid = function(pos, dims, size, interactive=false){
        grid = new Grid(pos, dims, size, interactive);
        this.add_element(grid);
        return grid;
    };
}

//============================================================================
//  Game Classes
//============================================================================

// Some useful ENUMS
const ray_states = {
    NONE:       0,
    HIT:        1,
    REFLECTED:  2,
    DEFLECTED:  3
};

const states = {
    NEW:    0,
    PROG:   1,
    END:    2
};

function Mystery(args){
    Box.call(this, ...args);
    this.guessed = false;
    this.color="white";
    this.background_color = colors.EGGSHELL;
    this.draw_shape = draw_shapes.DIAMOND;

    this.click = function(mpos){
        if(gamestate.avail_gems-!this.guessed*2+1 < 0){
            return;
        }
        gamestate.avail_gems -= !this.guessed*2-1;
        gamestate.update_gem_counter();
        this.guessed = !this.guessed;
        if(this.guessed){
            this.color=colors.SEAFOAM;
            // if(gamestate.gem_locations.some(gem => { return gem.x === this.gridpos.x && gem.y === this.gridpos.y })){
            //     this.color="green";
            // } else {
            //     this.color=colors.SEAFOAM;
            // }
        } else {
            this.color="white";
        }
        // console.log("Clicked Mystery @ ("+mpos.x+","+mpos.y+"): ("+this.gridpos+"), "+this.id+" => "+this.type);
    };
}

function Emitter(args){
    Box.call(this, ...args);
    this.state = ray_states.NONE;
    this.background_color = colors.LIGHT_GRAY;
    
    this.click = function(mpos){
        if(this.state == ray_states.NONE){
            var new_state = gamestate.get_result(this.gridpos);
            if(new_state != ray_states.DEFLECTED){
                this.set_state(new_state);
            }
        } else {
            return;
        }
    };

    this.set_state = function(state){
        this.state = state;
        switch(this.state){
            case ray_states.HIT:
                this.color = colors.HIT;
                // this.draw_shape = draw_shapes.X;
                this.draw_shape = draw_shapes.XDOT;
                break;
            case ray_states.REFLECTED:
                this.color = "white";
                this.draw_shape = draw_shapes.SM_BOX;
                break;
            case ray_states.DEFLECTED:
                this.color = gamestate.get_color();
                if(gamestate.color_wrap > 0){
                    this.text = ""+gamestate.color_wrap;
                }
                this.draw_shape = draw_shapes.CIRCLE;
                break;
            default:
                console.error("invalid emitter result");
        }
    };
}

function Board(dims, size=null){
    CanvasContainer.call(this, undefined, undefined, interactive=true, drawable=true);
    this.dims = dims;
    if(size != null){
        this.size = size;
    } else {
        let min_scale = Math.min(cm.canvas.width, cm.canvas.height);
        this.size = (min_scale-(dims+2))/(dims+2)
    }
    this.deflection_pairs = [];

    this.rays = [];
    this.mysteries = [];

    // this.pos = {x:cm.canvas.width/2-(dims*size+dims-1)/1.5, y:cm.canvas.height/2-(dims*size+dims-1)};
    this.pos = {x:1, y:1};

    for(var y=0; y < dims+2; y++){
        for(var x=0; x < dims+2; x++){
            let s = this.size;
            let args = [[this.pos.x+s*x+x, this.pos.y+s*y+y], [s,s], colors.LIGHT_GRAY, id=y*this.dims+x, clickable=true, gridpos={x:x,y:y}];
            if(x == 0 || x == dims+1 || y == 0 || y == dims+1){
                if(!(x==0 && y==0) && !(x==dims+1 && y==dims+1) && !(x==dims+1 && y==0) && !(x==0 && y==dims+1)){
                    this.rays.push(new Emitter(args));
                } else {
                    let box = new Box(...args);
                    box.clickable = false;
                    box.color="white";
                    this.elements.push(box);
                }
            } else {
                this.mysteries.push(new Mystery(args));
            }
        }
    }

    this.rays.forEach(ray => { this.elements.push(ray) });
    this.mysteries.forEach(myst => { this.elements.push(myst) });

    this.get_index_by_coord = function(coord){
        for(let i = 0; i < this.elements.length; i++){
            let elem = this.elements[i];
            if(vec_comp(elem.gridpos, coord)){
                return i; 
            }
        };
        return null;
    };

    this.click = function(mpos){
        this.elements.forEach(elem => {
            if(elem.type == "shape:box" && elem.point_inside(mpos)){ 
                elem.click(mpos);
                let temp_total = 0;
                this.rays.forEach(ray => { if(ray.state != ray_states.NONE){ temp_total += 1; } });
                gamestate.update_score(temp_total);
                cm.update();
                return true;
            }
        });
    };

    this.new_deflection = function(start, end){
        var emitter = this.elements[this.get_index_by_coord(start)];
        emitter.set_state(ray_states.DEFLECTED);

        var absorber = this.elements[this.get_index_by_coord(end)];
        absorber.set_state(ray_states.DEFLECTED);

        this.deflection_pairs.push([emitter, absorber]);
    };
}

function GameState(gems, board){
    this.board = board;
    this.gems = gems;
    this.total_rays = board.dims*4;
    this.avail_gems = this.gems;
    this.rays_used = 0;
    this.state = states.NEW;
    this.score = 0;

    this.color_cycle = [
        colors.SEAFOAM,
        colors.SUNFLOWER,
        colors.LAVENDER,
        colors.SKY,
        colors.FIR,
        colors.NAVY,
        colors.ORANGE,
        colors.CLOUDY,
        colors.ROSE,
    ];
    this.current_color = 0;
    this.color_wrap = 0;
    this.access_count = 0;

    this.gem_locations = [{x:1+Math.floor(Math.random()*board.dims), y:1+Math.floor(Math.random()*board.dims)}];
    for(var i = 0; i < this.gems-1; i++){
        let candidate = {x:1+Math.floor(Math.random()*board.dims), y:1+Math.floor(Math.random()*board.dims)};
        while( this.gem_locations.some(gem => { return vec_comp(candidate, gem); }) ){
            candidate = {x:1+Math.floor(Math.random()*board.dims), y:1+Math.floor(Math.random()*board.dims)};
        }
        this.gem_locations.push(candidate);
    }

    console.log(this.gem_locations);
    // this.reveal_gems();

    this.reveal_gems = function(){
        this.board.mysteries.forEach(mystery => {
            if(this.gem_locations.some(gem => { return vec_comp(gem, mystery.gridpos) })){
                mystery.color = colors.ORANGE;
            }
        });
    };

    this.get_color = function(){
        this.access_count += 1;
        console.log(this.access_count);
        if(this.access_count > 2){
            this.current_color += 1;
            this.access_count = 1;
        }
        if(this.current_color >= this.color_cycle.length){
            this.current_color = 0;
            this.color_wrap += 1;
            console.log("Color wrapped! "+this.color_wrap);
        }
        c = this.color_cycle[this.current_color];
        return c;
    };

    this.get_result = function(ray){
        var dir = {x:0, y:0};
        if(ray.x == 0) {
            dir = {x:1, y:0};
        } else if(ray.y == 0) {
            dir = {x:0, y:1};
        } else if(ray.x == board.dims+1) {
            dir = {x:-1, y:0};
        } else {
            dir = {x:0, y:-1};
        }
        var cur_ray_state = ray_states.NONE;
        var ray_head = ray;
        var ray_length = 0;
        while(cur_ray_state == ray_states.NONE || cur_ray_state != ray_states.DEFLECTED){
            if(this.gem_locations.some(gem => { return vec_comp(gem, add_vec(ray_head, dir)) })){
                return ray_states.HIT;
            }

            this.gem_locations.forEach(gem => {
                let dv = diff_vec(ray_head, gem);
                if(Math.abs(dv.x) == 1 && Math.abs(dv.y) == 1){ 
                    if(ray_length === 0){
                        cur_ray_state = ray_states.REFLECTED;
                    } else {
                        dir.x += dv.x;
                        dir.y += dv.y;
                    }
                }
            });

            ray_head = add_vec(ray_head, dir);
            ray_length += 1;
            
            if(cur_ray_state == ray_states.REFLECTED){ return cur_ray_state };

            if(ray_head.x == ray.x && ray_head.y == ray.y){
                return ray_states.REFLECTED;
            }

            if(ray_head.x == 0 || ray_head.y == 0 || ray_head.x == this.board.dims+1 || ray_head.y == this.board.dims+1){
                if(ray_length <= 1){
                    return ray_states.REFLECTED;
                } else {
                    this.board.new_deflection(ray, ray_head);
                    return ray_states.DEFLECTED;
                }
            }
        }
        return cur_ray_state;
    };

    this.update_score = function(total){
        this.rays_used = total;
        document.querySelector("#score").innerHTML = ""+this.rays_used;
    };

    this.update_gem_counter = function(){
        document.querySelector('#gems').innerHTML = "<span style='color:#AEB6BF'>&#x25C6;</span>".repeat(this.gems-this.avail_gems)+"<span style='color:#A3E4D7'>&#x25C6;</span>".repeat(this.avail_gems);
    };
}

function new_game(board_dims, num_gems){
    cm = new CanvasManager("canvas");
    cm.init();

    let gamekey = ""+board_dims+":"+num_gems+"";
    if(score_table != null){
        if(gamekey in score_table){
            document.querySelector("#bestscore").innerHTML = score_table[gamekey];
        } else {
            document.querySelector("#bestscore").innerHTML = "?";
        }
    } else {
        score_table[gamekey] = 1000;
    }
    console.log(score_table);
    document.querySelector("#score").innerHTML = "0";

    board = new Board(board_dims);
    grid = new LineGrid(board.pos, [board.dims+1,board.dims+1], board.size);
    gamestate = new GameState(num_gems, board);
    gamestate.update_gem_counter();

    cm.add_element(board);
    cm.add_element(grid);

    document.querySelector("#submit").addEventListener('click', function(e){
        console.log(gamestate.avail_gems);
        console.log("submitted");
        if(gamestate.avail_gems < 1){

            gamestate.reveal_gems();

            let correct = 0;
            gamestate.board.mysteries.forEach(myst => {
                if(myst.guessed){
                    myst.color=colors.HIT;
                    if(gamestate.gem_locations.some(gem => { return vec_comp(gem, myst.gridpos) }) ){
                        myst.color=colors.FIR;
                        correct++;
                    }
                }
            });

            if(correct === gamestate.gems){
                gamestate.score = gamestate.rays_used;
                console.log('you win!');
                let gamekey = ""+gamestate.board.dims+":"+gamestate.gems+"";
                if(gamekey in score_table){
                    if(gamestate.score < score_table[gamekey]){
                        score_table[gamekey] = gamestate.score;
                        document.querySelector("#bestscore").innerHTML = gamestate.score;
                    }
                } else {
                    score_table[gamekey] = gamestate.score;
                }
                window.localStorage.setItem("score_table", JSON.stringify(score_table));
            } else {
                gamestate.score = 0;
                console.log('you lose!');
            }
            cm.update();
        }
    });

    cm.update();
}

function newgame_button(e){
    document.querySelector("#canvas_container").innerHTML = '<canvas id="canvas" class="noselect">This message only shows if your browser doesn\'t support canvas elements</canvas>';

    var target = e.target || e.srcElement;
    
    var gamekey = target.id;
    let str_nums = gamekey.split(":");
    new_game(parseInt(str_nums[0]), parseInt(str_nums[1]));
}

document.addEventListener("DOMContentLoaded", function(){
    score_table = JSON.parse(window.localStorage.getItem("score_table"));
    if(score_table === null){score_table = {}}
    new_game(5,3);

    var newgame_buttons = document.getElementsByClassName("newgame");
    for(var i = 0; i < newgame_buttons.length; i++){
        newgame_buttons[i].addEventListener('click', newgame_button, false);
    }

    cm.update();
});