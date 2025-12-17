/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function () {

  var editor = {
    _instructionSortable: null,
    _programSortables: [],
    _getMainProgramList: function () {
      return $('#programContainer .card-body > .droppable > ul').first();
    },
    getProgramInstructions: function () {
      return this.getInstructions(this._getMainProgramList().children('li'));
    },
    initEditor: function () {
      // save the program when the value of input[type=number] changes
      $("#programContainer").delegate(':input[type="number"]', "change", function () {
        lightBot.ui.editor.saveProgram();
      });

      // delete icon for instructions in the program
      $("#programContainer").delegate(".lb-instruction-delete", "click", function () {
        $(this).closest('li').remove();
        lightBot.ui.editor._cleanupProgramSortables();
        lightBot.ui.editor.saveProgram();
      });

      // make instructions draggable (clone) and program sortable (incl. nested repeat bodies)
      lightBot.ui.editor.makeDroppable();
    },
    // this function saves the current program in the localStorage
    saveProgram: function () {
      var mainProgramList = this._getMainProgramList();
      mainProgramList.find(':input[type="number"]').each(function () {
        $(this).attr('value', $(this).val());
      });
      localStorage.setItem('lightbot_program_level_' + lightBot.map.getLevelNumber(), mainProgramList.html());
    },
    loadProgram: function () {
      this._getMainProgramList()
        .append(localStorage.getItem('lightbot_program_level_' + lightBot.map.getLevelNumber()))
        .find('*')
        .removeClass('lb-drop-active lb-drop-hover sortable-ghost sortable-chosen lb-dragging');
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
        draggable: 'li',
        handle: 'p',
        filter: 'input, .lb-instruction-delete',
        preventOnFilter: false,
        emptyInsertThreshold: 25,
        animation: 150,
        dragClass: 'lb-dragging',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onStart: function () {
          $('#programContainer ul').addClass('lb-drop-active');
        },
        onEnd: function () {
          $('#programContainer ul').removeClass('lb-drop-active lb-drop-hover');
        },
        onMove: function (evt) {
          if (evt && evt.to) {
            $('#programContainer ul.lb-drop-hover').not(evt.to).removeClass('lb-drop-hover');
            $(evt.to).addClass('lb-drop-hover');
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
          draggable: 'li',
          handle: 'p',
          filter: 'input, .lb-instruction-delete',
          preventOnFilter: false,
          emptyInsertThreshold: 25,
          animation: 150,
          dragClass: 'lb-dragging',
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          onStart: function () {
            $('#programContainer ul').addClass('lb-drop-active');
          },
          onEnd: function () {
            $('#programContainer ul').removeClass('lb-drop-active lb-drop-hover');
          },
          onMove: function (evt) {
            if (evt && evt.to) {
              $('#programContainer ul.lb-drop-hover').not(evt.to).removeClass('lb-drop-hover');
              $(evt.to).addClass('lb-drop-hover');
            }
          },
          onAdd: function (evt) {
            // if a repeat block was added, initialize its nested drop zone(s)
            if (evt.item && evt.item.querySelector && evt.item.querySelector('div.droppable ul')) {
              self._ensureProgramSortables(evt.item);
            }

            // if the target area was the "main" programContainer ul, scroll to the bottom
            var scrollBox = $(evt.to).closest('.droppable');
            if (scrollBox.length) {
              scrollBox.animate({ scrollTop: scrollBox[0].scrollHeight }, "slow");
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
      this._cleanupProgramSortables();
      this._ensureInstructionSortable();
      this._ensureProgramSortables();
    },
    // recursively get all the instructions within a repeat instruction
    getInstructions: function (source) {
      var instructions = [];

      source.each(function (index) {
        var p = $(this).children('p').first();

        if (p.hasClass('walk')) {
          instructions.push(new lightBot.bot.instructions.WalkInstruction());
        } else if (p.hasClass('jump')) {
          instructions.push(new lightBot.bot.instructions.JumpInstruction());
        } else if (p.hasClass('light')) {
          instructions.push(new lightBot.bot.instructions.LightInstruction());
        } else if (p.hasClass('turnLeft')) {
          instructions.push(new lightBot.bot.instructions.TurnLeftInstruction());
        } else if (p.hasClass('turnRight')) {
          instructions.push(new lightBot.bot.instructions.TurnRightInstruction());
        } else if (p.hasClass('repeat')) {
          var counter = $(this).find('input[type="number"]').first().val();
          var body = lightBot.ui.editor.getInstructions($(this).find('.lb-repeat-body ul').first().children('li'));
          instructions.push(new lightBot.bot.instructions.RepeatInstruction(counter, body));
        }
      });
      return instructions;
    }
  };

  lightBot.ui.editor = editor;
})();
