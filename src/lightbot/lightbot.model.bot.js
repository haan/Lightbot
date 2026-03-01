// Bot model: maintains current position/direction and executes a queue of instructions.

export function createBot(params) {
  if (!params) throw new Error("createBot: missing params");
  var directions = params.directions;
  var getMap = params.getMap;
  var instructions = params.instructions;
  var LightBox = params.LightBox;
  if (!directions) throw new Error("createBot: missing directions");
  if (typeof getMap !== "function") throw new Error("createBot: missing getMap()");
  if (!instructions) throw new Error("createBot: missing instructions");
  if (!LightBox) throw new Error("createBot: missing LightBox");

  function cloneShallowIncludingInherited(obj) {
    var out = {};
    for (var k in obj) out[k] = obj[k];
    return out;
  }

  function cloneInstructionDeep(instruction) {
    // clone repeat bodies so execution can mutate counters safely.
    if (!instruction) return instruction;

    var out = cloneShallowIncludingInherited(instruction);

    if (out.body && Array.isArray(out.body)) {
      var clonedBody = [];
      for (var i = 0; i < out.body.length; i++) {
        clonedBody.push(cloneInstructionDeep(out.body[i]));
      }
      out.body = clonedBody;
    }

    return out;
  }

  function map() {
    return getMap();
  }

  var bot = {
    startingPos: {x: 0, y: 0}, // save initial position for reset
    currentPos: {x: 0, y: 0}, // current bot position on the map
    startingDirection: directions.se, // save initial direction for reset
    direction: directions.se, // current direction the bot is facing
    instructionQueue: [], // saves the instruction queue. useful for post-executing analysis
    executionQueue: [], // current instruction execution queue
    executionMode: false, // boolean flag indicating whether the bot is in execution mode
    instructions: instructions,
    init: function(direction, position) {
      this.startingPos = cloneShallowIncludingInherited(position);
      this.currentPos = cloneShallowIncludingInherited(position);
      this.startingDirection = direction;
      this.direction = direction;
      this.reset();
    },
    reset: function() {
      this.currentPos = cloneShallowIncludingInherited(this.startingPos);
      this.direction = this.startingDirection;
      this.instructionQueue.length = 0;
      this.executionQueue.length = 0;
      this.executionMode = false;
    },
    clearExecutionQueue: function() {
      this.executionQueue.length = 0;
    },
    queueInstructions: function(instructions) {
      this.instructionQueue = this.instructionQueue.concat(instructions);
    },
    hasNextInstruction: function() {
      return (this.executionQueue.length > 0);
    },
    execute: function() {
      this.executionMode = true;
      this.executionQueue = this.instructionQueue.slice(); // copy instructionQueue into executionQueue
    },
    // executes and returns the next instruction
    executeNextInstruction: function() {
      if (this.executionQueue.length > 0) {
        var instruction = this.executionQueue.shift();
        switch (instruction.name) {
          case instructions.WalkInstruction.instructionName:
            this.walk();
            break;
          case instructions.JumpInstruction.instructionName:
            this.jump();
            break;
          case instructions.LightInstruction.instructionName:
            this.light();
            break;
          case instructions.TurnLeftInstruction.instructionName:
            this.turnLeft();
            break;
          case instructions.TurnRightInstruction.instructionName:
            this.turnRight();
            break;
          case instructions.RepeatInstruction.instructionName:
            if (instruction.counter > 1) {
              instruction.counter--;
              this.executionQueue.unshift(instruction);
            }
            // expand the repeat body onto the execution queue.
            for (var i = instruction.body.length - 1; i >= 0 ; i--) {
              var tmp = instruction.body[i];
              var tmp2 = cloneInstructionDeep(tmp);
              this.executionQueue.unshift(tmp2);
            }
            return this.executeNextInstruction();
          default:
            console.error('Bot executeNextInstruction: unknown instruction "' + instruction.name + '"');
            break;
        }
        return instruction;
      } else {
        console.error('Bot executeNextInstruction: no instruction to execute');
        return null;
      }
    },
    walk: function() {
      var m = map();
      if (!m) return;
      switch (this.direction) {
        case directions.se:
          if (this.currentPos.y > 0 && m.getMapRef()[this.currentPos.x][this.currentPos.y].height === m.getMapRef()[this.currentPos.x][this.currentPos.y-1].height) {
            this.currentPos.y--;
          }
          break;
        case directions.ne:
          if (this.currentPos.x+1 < m.getLevelSize().x && m.getMapRef()[this.currentPos.x][this.currentPos.y].height === m.getMapRef()[this.currentPos.x+1][this.currentPos.y].height) {
            this.currentPos.x++;
          }
          break;
        case directions.nw:
          if (this.currentPos.y+1 < m.getLevelSize().y && m.getMapRef()[this.currentPos.x][this.currentPos.y].height === m.getMapRef()[this.currentPos.x][this.currentPos.y+1].height) {
            this.currentPos.y++;
          }
          break;
        case directions.sw:
          if (this.currentPos.x > 0 && m.getMapRef()[this.currentPos.x][this.currentPos.y].height === m.getMapRef()[this.currentPos.x-1][this.currentPos.y].height) {
            this.currentPos.x--;
          }
          break;
        default:
          console.error('Bot walk: unknown direction "' + this.direction + '"');
          break;
      }
    },
    jump: function() {
      var m = map();
      if (!m) return;
      switch (this.direction) {
        case directions.se:
          if (this.currentPos.y > 0 && (m.getMapRef()[this.currentPos.x][this.currentPos.y-1].height - m.getMapRef()[this.currentPos.x][this.currentPos.y].height === 1 || m.getMapRef()[this.currentPos.x][this.currentPos.y].height > m.getMapRef()[this.currentPos.x][this.currentPos.y-1].height)) {
            this.currentPos.y--;
          }
          break;
        case directions.ne:
          if (this.currentPos.x+1 < m.getLevelSize().x && (m.getMapRef()[this.currentPos.x+1][this.currentPos.y].height - m.getMapRef()[this.currentPos.x][this.currentPos.y].height === 1 || m.getMapRef()[this.currentPos.x][this.currentPos.y].height > m.getMapRef()[this.currentPos.x+1][this.currentPos.y].height)) {
            this.currentPos.x++;
          }
          break;
        case directions.nw:
          if (this.currentPos.y+1 < m.getLevelSize().y && (m.getMapRef()[this.currentPos.x][this.currentPos.y+1].height - m.getMapRef()[this.currentPos.x][this.currentPos.y].height === 1 || m.getMapRef()[this.currentPos.x][this.currentPos.y].height > m.getMapRef()[this.currentPos.x][this.currentPos.y+1].height)) {
            this.currentPos.y++;
          }
          break;
        case directions.sw:
          if (this.currentPos.x > 0 && m.getLevelSize().x && (m.getMapRef()[this.currentPos.x-1][this.currentPos.y].height - m.getMapRef()[this.currentPos.x][this.currentPos.y].height === 1 || m.getMapRef()[this.currentPos.x][this.currentPos.y].height > m.getMapRef()[this.currentPos.x-1][this.currentPos.y].height)) {
            this.currentPos.x--;
          }
          break;
        default:
          console.error('Bot is facing unknown direction');
          break;
      }
    },
    light: function() {
      var m = map();
      if (!m) return;
      var tmp = m.getMapRef()[this.currentPos.x][this.currentPos.y];
      if (tmp instanceof LightBox) {
        tmp.toggleLight();
      }
    },
    turnLeft: function() {
      this.direction = (this.direction+1) % 4;
    },
    turnRight: function() {
      this.direction--;
      if (this.direction < 0) {
        this.direction = 3;
      }
    },
    isInExecutionMode: function() {
      return this.executionMode;
    },
    getNumberOfInstructions: function() {
      function count(a) {
        var x = 0;
        for (var i = 0; i < a.length; i++) {
          x++;
          if (a[i] instanceof instructions.RepeatInstruction) {
            x += count(a[i].body);
          }
        }
        return x;
      }
      return count(this.instructionQueue);
    }
  };

  return bot;
}
