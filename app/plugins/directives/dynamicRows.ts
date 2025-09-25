// src/directives/dynamicRows.ts
import type { DirectiveBinding } from "vue";

type DynEl = HTMLTableElement & {
  __dynamicRowsCleanup?: () => void;
  __dynamicRowsCols?: number;
};

const dynamicRows = {
  mounted(el: DynEl, binding: DirectiveBinding<number>) {
    const getCols = () => {
      const n = Number(binding.value ?? 1);
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
    };

    const table: HTMLTableElement = el.tagName === "TABLE" ? el : (el.closest("table") as HTMLTableElement);
    if (!table) throw new Error("v-dynamic-rows: директива должна быть на <table> или внутри таблицы.");

    const tbody =
      table.tBodies[0] ??
      table.appendChild(document.createElement("tbody"));

    el.__dynamicRowsCols = getCols();

    const rowIsEmpty = (tr: HTMLTableRowElement) =>
      Array.from(tr.cells).every((td) => (td.textContent ?? "").trim() === "");

    const createRow = () => {
      const tr = document.createElement("tr");
      for (let i = 0; i < (el.__dynamicRowsCols ?? 1); i++) {
        const td = document.createElement("td");
        td.contentEditable = "true";
        td.spellcheck = false;
        td.setAttribute("data-placeholder", " ");
        td.addEventListener("input", onInput, { passive: true });
        td.addEventListener("keydown", onKeyDown);
        tr.appendChild(td);
      }
      return tr;
    };

    const getRows = () => Array.from(tbody.querySelectorAll(":scope > tr"));

    const placeCaretAtEnd = (node: HTMLElement | null) => {
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    };

    const ensureTrailingEmptyRow = () => {
      const rows = getRows();
      if (rows.length === 0 || !rowIsEmpty(rows.at(-1)!)) {
        tbody.appendChild(createRow());
      } else {
        // Если снизу накопились пустые строки — оставляем только одну
        for (let i = rows.length - 2; i >= 0; i--) {
          if (rowIsEmpty(rows[i])) tbody.removeChild(rows[i]);
          else break;
        }
      }
    };

    const pruneInnerEmptyRows = () => {
      const rows = getRows();
      rows.forEach((r, idx) => {
        if (idx !== rows.length - 1 && rowIsEmpty(r)) {
          tbody.removeChild(r);
        }
      });
    };

    const onInput = () => {
      pruneInnerEmptyRows();
      ensureTrailingEmptyRow();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const td = e.currentTarget as HTMLTableCellElement;
      const tr = td.parentElement as HTMLTableRowElement;

      // Enter — перейти к следующей ячейке/строке (без разрывов строк)
      if (e.key === "Enter") {
        e.preventDefault();
        const rows = getRows();
        const rowIndex = rows.indexOf(tr);
        const cellIndex = Array.from(tr.cells).indexOf(td);

        let target: HTMLElement | null = null;

        if (cellIndex < tr.cells.length - 1) {
          target = tr.cells[cellIndex + 1] as HTMLElement;
        } else {
          // Последняя ячейка строки
          if (rowIndex === rows.length - 1 && !rowIsEmpty(tr)) {
            ensureTrailingEmptyRow();
          }
          const nextRow = getRows()[rowIndex + 1];
          target = nextRow?.cells[0] as HTMLElement | undefined || null;
        }
        target?.focus();
        placeCaretAtEnd(target);
      }

      // Ctrl/Cmd+Backspace на полностью пустой строке (не самой нижней) — удалить строку
      if ((e.key === "Backspace" || e.key === "Delete") && (e.ctrlKey || e.metaKey)) {
        const rows = getRows();
        const idx = rows.indexOf(tr);
        if (idx !== rows.length - 1 && rowIsEmpty(tr)) {
          e.preventDefault();
          const focusTo =
            rows[idx + 1]?.cells[0] ??
            rows[idx - 1]?.cells[0] ??
            null;
          tbody.removeChild(tr);
          ensureTrailingEmptyRow();
          (focusTo as HTMLElement | null)?.focus();
        }
      }
    };

    const init = () => {
      const rows = getRows();
      if (rows.length === 0) {
        tbody.appendChild(createRow());
      } else {
        // Приводим существующие строки к нужному числу колонок и вешаем хендлеры
        rows.forEach((r) => {
          // добить/урезать кол-во ячеек
          while (r.cells.length < (el.__dynamicRowsCols ?? 1)) {
            const td = document.createElement("td");
            td.contentEditable = "true";
            td.spellcheck = false;
            td.setAttribute("data-placeholder", " ");
            td.addEventListener("input", onInput, { passive: true });
            td.addEventListener("keydown", onKeyDown);
            r.appendChild(td);
          }
          while (r.cells.length > (el.__dynamicRowsCols ?? 1)) {
            r.deleteCell(r.cells.length - 1);
          }
          Array.from(r.cells).forEach((td) => {
            td.contentEditable = "true";
            td.spellcheck = false;
            td.setAttribute("data-placeholder", " ");
            td.removeEventListener("input", onInput);
            td.removeEventListener("keydown", onKeyDown);
            td.addEventListener("input", onInput, { passive: true });
            td.addEventListener("keydown", onKeyDown);
          });
        });
      }
      ensureTrailingEmptyRow();
    };

    el.__dynamicRowsCleanup = () => {
      getRows().forEach((r) =>
        Array.from(r.cells).forEach((td) => {
          td.removeEventListener("input", onInput);
          td.removeEventListener("keydown", onKeyDown);
        }),
      );
    };

    init();
  },

  updated(el: DynEl, binding: DirectiveBinding<number>) {
    // Если изменилось число колонок — перестроим
    const newCols = Number(binding.value ?? 1);
    if (newCols !== el.__dynamicRowsCols) {
      el.__dynamicRowsCols = Number.isFinite(newCols) && newCols > 0 ? Math.floor(newCols) : 1;
      // Триггерим полную инициализацию заново
      (dynamicRows.mounted as any)(el, binding);
    }
  },

  beforeUnmount(el: DynEl) {
    el.__dynamicRowsCleanup?.();
  },
};

export default dynamicRows;
