/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

import Sortable from "sortablejs";

(function () {
  function forEachNode(list, fn) {
    if (!list) return;
    for (var i = 0; i < list.length; i++) fn(list[i], i);
  }

  function getMainProgramList() {
    var container = document.getElementById("programContainer");
    if (!container) return null;
    return container.querySelector(".card-body > .droppable > ul");
  }

  function getAllProgramLists() {
    return document.querySelectorAll("#programContainer ul");
  }

  function addClassAllProgramLists(className) {
    var lists = getAllProgramLists();
    forEachNode(lists, function (el) {
      if (el && el.classList) el.classList.add(className);
    });
  }

  function clearDropHover(exceptEl) {
    var hovered = document.querySelectorAll("#programContainer ul.lb-drop-hover");
    forEachNode(hovered, function (el) {
      if (el !== exceptEl && el.classList) el.classList.remove("lb-drop-hover");
    });
  }

  var editor = {
    _instructionSortable: null,
    _programSortables: [],

    _normalizeRepeatRows: function (root) {
      var scope = root || document;
      var rows = scope.querySelectorAll("p.repeat.lb-instruction-row");

      forEachNode(rows, function (row) {
        if (!row || !row.children) return;

        for (var i = 0; i < row.children.length; i++) {
          if (row.children[i].classList && row.children[i].classList.contains("lb-repeat-left")) return;
        }

        var label = null;
        var count = null;
        var deleteBtn = null;
        for (var j = 0; j < row.children.length; j++) {
          var child = row.children[j];
          if (!child || !child.classList) continue;
          if (child.classList.contains("lb-instruction-label")) label = child;
          if (child.classList.contains("lb-repeat-count")) count = child;
          if (child.classList.contains("lb-instruction-delete")) deleteBtn = child;
        }

        if (!label || !count) return;

        var left = document.createElement("span");
        left.className = "lb-repeat-left flex items-center gap-2";
        left.appendChild(label);
        left.appendChild(count);

        if (deleteBtn) {
          row.insertBefore(left, deleteBtn);
        } else if (row.firstChild) {
          row.insertBefore(left, row.firstChild);
        } else {
          row.appendChild(left);
        }
      });
    },

    getProgramInstructions: function () {
      var list = getMainProgramList();
      var items = [];
      if (list && list.children) {
        for (var i = 0; i < list.children.length; i++) {
          var child = list.children[i];
          if (child && child.tagName === "LI") items.push(child);
        }
      }
      return this.getInstructions(items);
    },

    initEditor: function () {
      var container = document.getElementById("programContainer");
      if (!container) return;

      container.addEventListener("change", function (e) {
        var t = e.target;
        if (!t) return;
        if (t.tagName === "INPUT" && t.type === "number") {
          lightBot.ui.editor.saveProgram();
        }
      });

      container.addEventListener("click", function (e) {
        var target = e.target;
        if (!target || !target.closest) return;
        var btn = target.closest(".lb-instruction-delete");
        if (!btn || !container.contains(btn)) return;
        var li = btn.closest("li");
        if (li) li.remove();
        lightBot.ui.editor._cleanupProgramSortables();
        lightBot.ui.editor.saveProgram();
      });

      lightBot.ui.editor.makeDroppable();
    },

    saveProgram: function () {
      var mainProgramList = getMainProgramList();
      if (!mainProgramList) return;

      var inputs = mainProgramList.querySelectorAll('input[type="number"]');
      forEachNode(inputs, function (input) {
        input.setAttribute("value", input.value);
      });

      localStorage.setItem(
        "lightbot_program_level_" + lightBot.map.getLevelNumber(),
        mainProgramList.innerHTML
      );
    },

    loadProgram: function () {
      var mainProgramList = getMainProgramList();
      if (!mainProgramList) return;

      var saved = localStorage.getItem("lightbot_program_level_" + lightBot.map.getLevelNumber());
      if (saved) {
        mainProgramList.insertAdjacentHTML("beforeend", saved);
      }

      var classesToRemove = ["lb-drop-active", "lb-drop-hover", "sortable-ghost", "sortable-chosen", "lb-dragging"];
      var targets = [mainProgramList];
      var descendants = mainProgramList.querySelectorAll("*");
      for (var i = 0; i < descendants.length; i++) targets.push(descendants[i]);

      for (var t = 0; t < targets.length; t++) {
        var el = targets[t];
        if (!el || !el.classList) continue;
        for (var c = 0; c < classesToRemove.length; c++) el.classList.remove(classesToRemove[c]);
      }

      var placeholders = document.querySelectorAll("#programContainer li.placeholder");
      forEachNode(placeholders, function (li) { li.remove(); });

      this._normalizeRepeatRows(document.getElementById("programContainer"));
      this.makeDroppable();
    },

    _cleanupProgramSortables: function () {
      var kept = [];
      for (var i = 0; i < this._programSortables.length; i++) {
        var instance = this._programSortables[i];
        if (!instance || !instance.el) continue;
        if (!document.body.contains(instance.el)) {
          try { instance.destroy(); } catch (e) { }
          continue;
        }
        kept.push(instance);
      }
      this._programSortables = kept;
    },

    _ensureInstructionSortable: function () {
      if (this._instructionSortable) return;

      var instructionList = document.querySelector("#instructionsContainer ul");
      if (!instructionList) return;

      this._instructionSortable = Sortable.create(instructionList, {
        group: {
          name: "lightbot-instructions",
          pull: "clone",
          put: false,
        },
        sort: false,
        draggable: "li",
        handle: "p",
        filter: "input, .lb-instruction-delete",
        preventOnFilter: false,
        emptyInsertThreshold: 25,
        animation: 150,
        dragClass: "lb-dragging",
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        onStart: function () {
          addClassAllProgramLists("lb-drop-active");
        },
        onEnd: function () {
          var lists = getAllProgramLists();
          forEachNode(lists, function (el) {
            if (!el || !el.classList) return;
            el.classList.remove("lb-drop-active", "lb-drop-hover");
          });
        },
        onMove: function (evt) {
          if (evt && evt.to && evt.to.classList) {
            clearDropHover(evt.to);
            evt.to.classList.add("lb-drop-hover");
          }
        },
      });
    },

    _ensureProgramSortables: function (rootEl) {
      var lists = [];
      if (rootEl) {
        if (rootEl.tagName && rootEl.tagName.toLowerCase() === "ul") {
          lists = [rootEl];
        } else if (rootEl.querySelectorAll) {
          lists = rootEl.querySelectorAll("ul");
        }
      } else {
        lists = document.querySelectorAll("#programContainer ul");
      }

      var self = this;
      forEachNode(lists, function (listEl) {
        if (!listEl || !listEl.parentNode) return;
        if (!listEl.closest || !listEl.closest("#programContainer")) return;
        if (listEl._lightbotSortable) return;

        listEl._lightbotSortable = Sortable.create(listEl, {
          group: {
            name: "lightbot-program",
            pull: true,
            put: ["lightbot-program", "lightbot-instructions"],
          },
          sort: true,
          draggable: "li",
          handle: "p",
          filter: "input, .lb-instruction-delete",
          preventOnFilter: false,
          emptyInsertThreshold: 25,
          animation: 150,
          dragClass: "lb-dragging",
          ghostClass: "sortable-ghost",
          chosenClass: "sortable-chosen",
          onStart: function () {
            addClassAllProgramLists("lb-drop-active");
          },
          onEnd: function () {
            var lists = getAllProgramLists();
            forEachNode(lists, function (el) {
              if (!el || !el.classList) return;
              el.classList.remove("lb-drop-active", "lb-drop-hover");
            });
          },
          onMove: function (evt) {
            if (evt && evt.to && evt.to.classList) {
              clearDropHover(evt.to);
              evt.to.classList.add("lb-drop-hover");
            }
          },
          onAdd: function (evt) {
            if (evt.item && evt.item.querySelector && evt.item.querySelector("div.droppable ul")) {
              self._ensureProgramSortables(evt.item);
            }

            var scrollBox = evt.to && evt.to.closest ? evt.to.closest(".droppable") : null;
            if (scrollBox) {
              try {
                scrollBox.scrollTo({ top: scrollBox.scrollHeight, behavior: "smooth" });
              } catch (e) {
                scrollBox.scrollTop = scrollBox.scrollHeight;
              }
            }

            self.saveProgram();
          },
          onUpdate: function () {
            self.saveProgram();
          },
          onRemove: function () {
            self.saveProgram();
          },
        });

        self._programSortables.push(listEl._lightbotSortable);
      });
    },

    makeDroppable: function () {
      this._cleanupProgramSortables();
      this._ensureInstructionSortable();
      this._ensureProgramSortables();
    },

    getInstructions: function (sourceItems) {
      var instructions = [];

      for (var i = 0; i < sourceItems.length; i++) {
        var li = sourceItems[i];
        if (!li || !li.querySelector) continue;

        var p = li.querySelector("p");
        if (!p || !p.classList) continue;

        if (p.classList.contains("walk")) {
          instructions.push(new lightBot.bot.instructions.WalkInstruction());
        } else if (p.classList.contains("jump")) {
          instructions.push(new lightBot.bot.instructions.JumpInstruction());
        } else if (p.classList.contains("light")) {
          instructions.push(new lightBot.bot.instructions.LightInstruction());
        } else if (p.classList.contains("turnLeft")) {
          instructions.push(new lightBot.bot.instructions.TurnLeftInstruction());
        } else if (p.classList.contains("turnRight")) {
          instructions.push(new lightBot.bot.instructions.TurnRightInstruction());
        } else if (p.classList.contains("repeat")) {
          var input = li.querySelector('input[type="number"]');
          var counter = input ? input.value : 2;
          var bodyUl = li.querySelector(".lb-repeat-body ul");
          var bodyLis = [];
          if (bodyUl && bodyUl.children) {
            for (var j = 0; j < bodyUl.children.length; j++) {
              var bChild = bodyUl.children[j];
              if (bChild && bChild.tagName === "LI") bodyLis.push(bChild);
            }
          }
          var body = lightBot.ui.editor.getInstructions(bodyLis);
          instructions.push(new lightBot.bot.instructions.RepeatInstruction(counter, body));
        }
      }
      return instructions;
    },
  };

  lightBot.ui.editor = editor;
})();
