/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  var instructions = {};

  function Instruction(name) {
    this.name = name;
  }

  instructions.WalkInstruction = function() {};
  instructions.WalkInstruction.instructionName = 'walk';
  instructions.WalkInstruction.prototype = new Instruction(instructions.WalkInstruction.instructionName);
  instructions.WalkInstruction.prototype.constructor = instructions.WalkInstruction;

  instructions.JumpInstruction = function() {};
  instructions.JumpInstruction.instructionName = 'jump';
  instructions.JumpInstruction.prototype = new Instruction(instructions.JumpInstruction.instructionName);
  instructions.JumpInstruction.prototype.constructor = instructions.JumpInstruction;

  instructions.LightInstruction = function() {};
  instructions.LightInstruction.instructionName = 'light';
  instructions.LightInstruction.prototype = new Instruction(instructions.LightInstruction.instructionName);
  instructions.LightInstruction.prototype.constructor = instructions.LightInstruction;

  instructions.TurnLeftInstruction = function() {};
  instructions.TurnLeftInstruction.instructionName = 'turnLeft';
  instructions.TurnLeftInstruction.prototype = new Instruction(instructions.TurnLeftInstruction.instructionName);
  instructions.TurnLeftInstruction.prototype.constructor = instructions.TurnLeftInstruction;

  instructions.TurnRightInstruction = function() {};
  instructions.TurnRightInstruction.instructionName = 'turnRight';
  instructions.TurnRightInstruction.prototype = new Instruction(instructions.TurnRightInstruction.instructionName);
  instructions.TurnRightInstruction.prototype.constructor = instructions.TurnRightInstruction;

  instructions.RepeatInstruction = function(counter, body) {
    this.counter = counter;
    this.body = body;
  };
  instructions.RepeatInstruction.instructionName = 'repeat';
  instructions.RepeatInstruction.prototype = new Instruction(instructions.RepeatInstruction.instructionName);
  instructions.RepeatInstruction.prototype.constructor = instructions.RepeatInstruction;

  instructions.WhileInstruction = function(condition, body) {
    this.condition = condition;
    this.body = body;
  };
  instructions.WhileInstruction.instructionName = 'while';
  instructions.WhileInstruction.prototype = new Instruction(instructions.WhileInstruction.instructionName);
  instructions.WhileInstruction.prototype.constructor = instructions.WhileInstruction;

  lightBot.bot.instructions = instructions;
})();