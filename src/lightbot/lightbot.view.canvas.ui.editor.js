// Drag/drop editor for the program: uses SortableJS and persists per-level state to localStorage.
import Sortable from "sortablejs";

export function createEditor(params) {
  if (!params) throw new Error("createEditor: missing params");
  var map = params.map;
  var instructions = params.instructions;
  var storage = params.storage || localStorage;
  var PROGRAM_STORAGE_PREFIX = "lightbot_program_level_";
  var PROGRAM_STORAGE_VERSION = 1;
  if (!map) throw new Error("createEditor: missing map");
  if (!instructions) throw new Error("createEditor: missing instructions");

  function forEachNode(list, fn) {
    if (!list) return;
    for (var i = 0; i < list.length; i++) fn(list[i], i);
  }

  function getMainProgramList() {
    // main program list only (not nested repeat bodies).
    var container = document.getElementById("programContainer");
    if (!container) return null;
    return container.querySelector(".card-body > .droppable > ul");
  }

  function getAllProgramLists() {
    return document.querySelectorAll("#programContainer ul");
  }

  function getStorageKey() {
    // per-level storage key for the player's program.
    return PROGRAM_STORAGE_PREFIX + map.getLevelNumber();
  }

  function getListItems(listEl) {
    var items = [];
    if (listEl && listEl.children) {
      for (var i = 0; i < listEl.children.length; i++) {
        var child = listEl.children[i];
        if (child && child.tagName === "LI") items.push(child);
      }
    }
    return items;
  }

  function normalizeRepeatCount(value) {
    // keep repeat counts in a safe, UI-friendly range.
    var parsed = parseInt(value, 10);
    if (!isFinite(parsed)) return 2;
    if (parsed < 1) return 1;
    if (parsed > 99) return 99;
    return parsed;
  }

  function getInstructionTemplate(type) {
    // clone from the palette so labels stay localized and markup stays consistent.
    var list = document.querySelector("#instructionsContainer ul");
    if (!list) return null;
    var p = list.querySelector("p." + type);
    if (!p || !p.closest) return null;
    return p.closest("li");
  }

  function cloneInstructionTemplate(type) {
    var source = getInstructionTemplate(type);
    return source ? source.cloneNode(true) : null;
  }

  function getProgramDataFromItems(sourceItems) {
    // serialize the DOM instruction list into JSON-friendly data.
    var out = [];

    for (var i = 0; i < sourceItems.length; i++) {
      var li = sourceItems[i];
      if (!li || !li.querySelector) continue;

      var p = li.querySelector("p");
      if (!p || !p.classList) continue;

      if (p.classList.contains("walk")) {
        out.push({ type: "walk" });
      } else if (p.classList.contains("jump")) {
        out.push({ type: "jump" });
      } else if (p.classList.contains("light")) {
        out.push({ type: "light" });
      } else if (p.classList.contains("turnLeft")) {
        out.push({ type: "turnLeft" });
      } else if (p.classList.contains("turnRight")) {
        out.push({ type: "turnRight" });
      } else if (p.classList.contains("repeat")) {
        var input = li.querySelector('input[type="number"]');
        var count = normalizeRepeatCount(input ? input.value : 2);
        var bodyUl = li.querySelector(".lb-repeat-body ul");
        var bodyItems = getListItems(bodyUl);
        // recurse into the repeat body.
        var body = getProgramDataFromItems(bodyItems);
        out.push({ type: "repeat", count: count, body: body });
      }
    }

    return out;
  }

  function getProgramDataFromList(listEl) {
    return getProgramDataFromItems(getListItems(listEl));
  }

  function buildProgramListFromData(listEl, data) {
    // rebuild the DOM from stored program data (including nested repeats).
    if (!listEl || !Array.isArray(data)) return;
    for (var i = 0; i < data.length; i++) {
      var entry = data[i] || {};
      var type = entry.type || entry.name;
      if (typeof type !== "string") continue;

      var li = cloneInstructionTemplate(type);
      if (!li) continue;

      if (type === "repeat") {
        var input = li.querySelector('input[type="number"]');
        var count = normalizeRepeatCount(entry.count != null ? entry.count : entry.counter);
        if (input) {
          input.value = String(count);
          input.setAttribute("value", String(count));
        }

        var bodyUl = li.querySelector(".lb-repeat-body ul");
        if (bodyUl) {
          bodyUl.textContent = "";
          buildProgramListFromData(bodyUl, Array.isArray(entry.body) ? entry.body : []);
        }
      }

      listEl.appendChild(li);
    }
  }

  function parseStoredProgram(raw) {
    if (!raw) return null;
    var trimmed = String(raw).trim();
    if (!trimmed) return null;

    // only accept json payloads; legacy html is treated as invalid.
    var parsed = null;
    try {
      parsed = JSON.parse(trimmed);
    } catch (e) {
      parsed = null;
    }

    if (Array.isArray(parsed)) {
      // legacy json array format (pre-versioning).
      return { program: parsed, version: PROGRAM_STORAGE_VERSION, migrated: false };
    }
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.program)) {
      return { program: parsed.program, version: parsed.version || PROGRAM_STORAGE_VERSION, migrated: false };
    }

    return null;
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
      // ensure repeat label + count are grouped after drag/restore.
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
      return this.getInstructions(getListItems(list));
    },

    initEditor: function () {
      var container = document.getElementById("programContainer");
      if (!container) return;

      // persist repeat count changes.
      container.addEventListener("change", function (e) {
        var t = e.target;
        if (!t) return;
        if (t.tagName === "INPUT" && t.type === "number") {
          editor.saveProgram();
        }
      });

      // handle remove buttons inside the program.
      container.addEventListener("click", function (e) {
        var target = e.target;
        if (!target || !target.closest) return;
        var btn = target.closest(".lb-instruction-delete");
        if (!btn || !container.contains(btn)) return;
        var li = btn.closest("li");
        if (li) li.remove();
        editor._cleanupProgramSortables();
        editor.saveProgram();
      });

      editor.makeDroppable();
    },

    saveProgram: function () {
      var mainProgramList = getMainProgramList();
      if (!mainProgramList) return;

      var program = getProgramDataFromList(mainProgramList);
      var key = getStorageKey();

      if (!program.length) {
        // drop empty programs to keep storage tidy.
        storage.removeItem(key);
        return;
      }

      storage.setItem(
        key,
        JSON.stringify({
          version: PROGRAM_STORAGE_VERSION,
          program: program,
        })
      );
    },

    loadProgram: function () {
      var mainProgramList = getMainProgramList();
      if (!mainProgramList) return;

      var key = getStorageKey();
      var saved = storage.getItem(key);
      if (!saved) return;

      var parsed = parseStoredProgram(saved);
      if (!parsed) {
        // legacy html or corrupt data: wipe the program for this level.
        storage.removeItem(key);
        return;
      }
      if (!parsed.program || !parsed.program.length) return;

      // rebuild the dom from templates so translations match the current language.
      buildProgramListFromData(mainProgramList, parsed.program);

      // Strip any transient drag/drop CSS classes so the restored DOM isn't "stuck" in a drag state.
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
      // destroy Sortable instances for lists that were removed from the DOM.
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

      // instructions palette is clone-only; never reorders.
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
        emptyInsertThreshold: 5,
        swapThreshold: 0.5,
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
      // attach Sortable to each program list (main + nested repeats).
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
          emptyInsertThreshold: 5,
          swapThreshold: 0.5,
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
            // repeats can introduce nested program lists on drop.
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
      // convert DOM instructions into bot instruction instances.
      var out = [];

      for (var i = 0; i < sourceItems.length; i++) {
        var li = sourceItems[i];
        if (!li || !li.querySelector) continue;

        var p = li.querySelector("p");
        if (!p || !p.classList) continue;

        if (p.classList.contains("walk")) {
          out.push(new instructions.WalkInstruction());
        } else if (p.classList.contains("jump")) {
          out.push(new instructions.JumpInstruction());
        } else if (p.classList.contains("light")) {
          out.push(new instructions.LightInstruction());
        } else if (p.classList.contains("turnLeft")) {
          out.push(new instructions.TurnLeftInstruction());
        } else if (p.classList.contains("turnRight")) {
          out.push(new instructions.TurnRightInstruction());
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
          var body = editor.getInstructions(bodyLis);
          out.push(new instructions.RepeatInstruction(counter, body));
        }
      }
      return out;
    },
  };

  return editor;
}
