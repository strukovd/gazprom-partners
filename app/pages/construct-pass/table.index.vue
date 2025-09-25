<template>
  <section>
    <table class="dyn-table">
      <thead>
        <tr>
          <td rowspan="2">ФИО сварщика</td>
          <td colspan="2">Клеймо и номер удостоверения сварщика</td>
          <td rowspan="2">Сварено стыков</td>
          <td rowspan="2">Дата проведения сварочных работ</td>
        </tr>
        <tr>
          <td>Диаметр, мм</td>
          <td>Число, шт.</td>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
          <td v-for="(_cell, colIndex) in row"
              :key="`${rowIndex}:${colIndex}`"
              contenteditable
              spellcheck="false"
              @focusout="onInput($event, rowIndex, colIndex)"
              @keydown.enter.prevent="focusNext(rowIndex, colIndex)"
              class="cell">
            {{ rows[rowIndex][colIndex] }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const COLS = 5;
const rows = ref<string[][]>([createEmptyRow(COLS)]);

/** ——— helpers ——— */
function createEmptyRow(cols: number) {
	return Array.from({ length: cols }, () => '');
}

function trim(val: string | null | undefined) {
	// убираем неразрывные пробелы/мягкие переводы строк/BR'ы, лишние пробелы
	return (val ?? '')
		.replace(/\u00A0/g, ' ')
		.replace(/\u200B/g, '')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/\s+/g, ' ')
		.trim();
}

function isRowEmpty(row: string[]) {
	return row.every(c => trim(c) === '');
}

/** ——— инварианты таблицы ——— */
function ensureInvariants() {
	// 1) убрать пустые внутренние строки (все, кроме последней)
	if (rows.value.length > 1) { // Если строк больше одной
		const lastIdx = rows.value.length - 1;
		rows.value = rows.value.filter((r, i) => i === lastIdx || !isRowEmpty(r)); // Оставляем только последнюю и не пустые строки
	}

	// 2) снизу всегда одна пустая
	if (rows.value.length === 0) { // Если строк нет, добавляем пустую строку
		rows.value.push(createEmptyRow(COLS));
	} // Если последняя строка не пустая, добавляем пустую строку
	else if (!isRowEmpty(rows.value[rows.value.length - 1])) {
		rows.value.push(createEmptyRow(COLS));
	}
	// else { // Когда строки есть и последняя пустая, если вдруг накопились несколько пустых в конце — оставим одну
	// 	while ( // Пока
	// 		rows.value.length > 1 && // строк больше одной
	// 		isRowEmpty(rows.value[rows.value.length - 1]) && // две последние строки пустые
	// 		isRowEmpty(rows.value[rows.value.length - 2])
	// 	) {
	// 		rows.value.pop();
	// 	}
	// }
}

/** ——— обработчики ——— */
function onInput(e: Event, rowIndex: number, colIndex: number) {
	// Записываем значение из DOM-ячейки в модель данных
	const el = e.target as HTMLElement;
	const text = trim(el.textContent ?? el.innerText);
	rows.value[rowIndex][colIndex] = text;

	ensureInvariants();
}

function focusNext(rowIndex: number, colIndex: number) {
	// переход по Enter к след. ячейке/строке, добавляя хвостовую пустую при необходимости
	const lastRowIdx = rows.value.length - 1;
	if (rowIndex === lastRowIdx && !isRowEmpty(rows.value[rowIndex])) {
		rows.value.push(createEmptyRow(COLS));
	}

	let nextRow = rowIndex;
	let nextCol = colIndex + 1;
	if (nextCol >= COLS) {
		nextCol = 0;
		nextRow = Math.min(rowIndex + 1, rows.value.length - 1);
	}

	// Фокус на следующую ячейку
	queueMicrotask(() => {
		// TODO: селектор будет путаться если будет несколько таблиц, обеспечить уникальность
		const cell = document.querySelectorAll<HTMLTableCellElement>('tbody td')[nextRow * COLS + nextCol];
		if (cell) {
			cell.focus();
			placeCaretAtEnd(cell);
		}
	});
}

/** ——— утилита для каретки ——— */
function placeCaretAtEnd(node: HTMLElement) {
	const range = document.createRange();
	range.selectNodeContents(node);
	range.collapse(false);
	const sel = window.getSelection();
	sel?.removeAllRanges();
	sel?.addRange(range);
}
</script>

<style>
.dyn-table {
	border-collapse: collapse;
	width: 100%;
}
td {
	border: 1px solid #e5e7eb;
	padding: .6rem .8rem;
	vertical-align: top;
}
.cell:focus {
	outline: 2px solid #60a5fa;
}
tbody td[contenteditable]:empty::before {
	/* content: attr(data-placeholder); */
	content: '___';
	opacity: .35;
}
</style>
