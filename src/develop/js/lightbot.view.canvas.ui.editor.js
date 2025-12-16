/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function () {

  var editor = {
    _instructionSortable: null,
    _programSortables: [],
    initEditor: function () {
      // save the program when the value of input[type=number] changes
      $("#programContainer").delegate(':input[type="number"]', "change", function () {
        lightBot.ui.editor.saveProgram();
      });

      // delete icon for instructions in the program
      $("#programContainer").delegate(".ui-icon-close", "click", function () {
        $(this).parent().parent().remove();
        lightBot.ui.editor._cleanupProgramSortables();
        lightBot.ui.editor.saveProgram();
      });

      // palette items should look like instructions (Sortable handles drag/drop)
      $("#instructionsContainer li").addClass('ui-state-default');

      // hover effect for instructions
      $('#instructionsContainer, #programContainer').delegate('li', 'hover', function () {
        $(this).toggleClass('ui-state-hover');
      });

      // make instructions draggable (clone) and program sortable (incl. nested repeat bodies)
      lightBot.ui.editor.makeDroppable();
    },
    // this function saves the current program in the localStorage
    saveProgram: function () {
      $('#programContainer ul').find(':input[type="number"]').each(function () {
        $(this).attr('value', $(this).val());
      });
      localStorage.setItem('lightbot_program_level_' + lightBot.map.getLevelNumber(), $('#programContainer ul').html());
    },
    loadProgram: function () {
      $('#programContainer ul')
        .append(localStorage.getItem('lightbot_program_level_' + lightBot.map.getLevelNumber()))
        .find('*')
        .removeClass('ui-state-hover ui-state-droppable ui-state-droppable-hover sortable-ghost sortable-chosen ui-draggable-dragging');
      $('#programContainer').find('li.placeholder').remove();
      this.makeDroppable();
    },
    _cleanupProgramSortables: function () {
      var kept = [];
      for (var i = 0; i < this._programSortables.length; i++) {
        var instance = this._programSortables[i];
        if (!instance || !instance.el) continue;
        if (!document.body.contains(instance.el)) {
          try { instance.destroy(); } catch (e) { /* ignore */ }
          continue;
        }
        kept.push(instance);
      }
      this._programSortables = kept;
    },
    _ensureInstructionSortable: function () {
      if (this._instructionSortable || typeof Sortable === 'undefined') return;

      var instructionList = document.querySelector('#instructionsContainer ul');
      if (!instructionList) return;

      this._instructionSortable = Sortable.create(instructionList, {
        group: {
          name: 'lightbot-instructions',
          pull: 'clone',
          put: false
        },
        sort: false,
        draggable: 'li:not(.placeholder)',
        handle: 'p',
        filter: 'input, .ui-icon-close',
        preventOnFilter: false,
        emptyInsertThreshold: 25,
        animation: 150,
        dragClass: 'ui-draggable-dragging',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onStart: function () {
          $('#programContainer ul').addClass('ui-state-droppable');
        },
        onEnd: function () {
          $('#programContainer ul').removeClass('ui-state-droppable ui-state-droppable-hover');
        },
        onMove: function (evt) {
          if (evt && evt.to) {
            $('#programContainer ul.ui-state-droppable-hover').not(evt.to).removeClass('ui-state-droppable-hover');
            $(evt.to).addClass('ui-state-droppable-hover');
          }
        }
      });
    },
    _ensureProgramSortables: function (rootEl) {
      if (typeof Sortable === 'undefined') return;

      var lists = [];
      if (rootEl) {
        if (rootEl.tagName && rootEl.tagName.toLowerCase() === 'ul') {
          lists = [rootEl];
        } else if (rootEl.querySelectorAll) {
          lists = rootEl.querySelectorAll('ul');
        }
      } else {
        lists = document.querySelectorAll('#programContainer ul');
      }

      var self = this;
      for (var i = 0; i < lists.length; i++) {
        var listEl = lists[i];
        if (!listEl || !listEl.parentNode) continue;
        if (!$(listEl).closest('#programContainer').length) continue;
        if (listEl._lightbotSortable) continue;

        listEl._lightbotSortable = Sortable.create(listEl, {
          group: {
            name: 'lightbot-program',
            pull: true,
            put: ['lightbot-program', 'lightbot-instructions']
          },
          sort: true,
          draggable: 'li:not(.placeholder)',
          handle: 'p',
          filter: 'input, .ui-icon-close',
          preventOnFilter: false,
          emptyInsertThreshold: 25,
          animation: 150,
          dragClass: 'ui-draggable-dragging',
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          onStart: function () {
            $('#programContainer ul').addClass('ui-state-droppable');
          },
          onEnd: function () {
            $('#programContainer ul').removeClass('ui-state-droppable ui-state-droppable-hover');
          },
          onMove: function (evt) {
            if (evt && evt.to) {
              $('#programContainer ul.ui-state-droppable-hover').not(evt.to).removeClass('ui-state-droppable-hover');
              $(evt.to).addClass('ui-state-droppable-hover');
            }
          },
          onAdd: function (evt) {
            $(evt.to).children('.placeholder').remove();
            if (evt.item) {
              $(evt.item).find('li.placeholder').remove();
            }

            // if a repeat block was added, initialize its nested drop zone(s)
            if (evt.item && evt.item.querySelector && evt.item.querySelector('div.droppable ul')) {
              self._ensureProgramSortables(evt.item);
            }

            // if the target area was the "main" programContainer ul, scroll to the bottom
            var tmp = $(evt.to).parent();
            if (tmp.parent().is('#programContainer')) {
              tmp.animate({ scrollTop: tmp.height() }, "slow");
            }

            self.saveProgram();
          },
          onUpdate: function () {
            self.saveProgram();
          },
          onRemove: function () {
            self.saveProgram();
          }
        });

        this._programSortables.push(listEl._lightbotSortable);
      }
    },
    // this function makes "repeat" instructions a droppable area (SortableJS)
    makeDroppable: function () {
      $('#programContainer').find('li.placeholder').remove();
      this._cleanupProgramSortables();
      this._ensureInstructionSortable();
      this._ensureProgramSortables();
    },
    // recursively get all the instructions within a repeat instruction
    getInstructions: function (source) {
      var instructions = [];

      source.each(function (index) {
        switch ($(this).children('p').attr('class')) {
          case 'walk':
            instructions.push(new lightBot.bot.instructions.WalkInstruction());
            break;
          case 'jump':
            instructions.push(new lightBot.bot.instructions.JumpInstruction());
            break;
          case 'light':
            instructions.push(new lightBot.bot.instructions.LightInstruction());
            break;
          case 'turnLeft':
            instructions.push(new lightBot.bot.instructions.TurnLeftInstruction());
            break;
          case 'turnRight':
            instructions.push(new lightBot.bot.instructions.TurnRightInstruction());
            break;
          case 'repeat':
            var counter = $(this).children('p').children('span').children('input').val();
            var body = lightBot.ui.editor.getInstructions($(this).children('div').children('div').children('ul').children('li'));
            instructions.push(new lightBot.bot.instructions.RepeatInstruction(counter, body));
            break;
          default:
            break;
        }
      });
      return instructions;
    }
  };

  lightBot.ui.editor = editor;
})();
