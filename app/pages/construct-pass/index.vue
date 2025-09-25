<template>
	<section class="construct-pass-page">
		<div class="documents">
			<article class="document">
				<h1 class="center">СТРОИТЕЛЬНЫЙ ПАСПОРТ № 2025-0001</h1>
				<h1 class="center">ВНУТРИДОМОВОГО (ВНУТРИЦЕХОВОГО) ГАЗООБОРУДОВАНИЯ,</h1>
				<div class="flex-line">
					смонтированного <BaseAutocomplete placeholder="Организация" :items="[
						{ key: 'BISHKEKGAZ', value: 'филиала «Бишкекгаз» ОсОО «Газпром Кыргызстан»' },
						{ key: 'GAZKOMM', value: 'частной организацией ОсОО «Газкомм»' },
					]"/>
				</div>

				<h2 class="center">Служба по обслуживанию внутридомового газового оборудования</h2>
				<div class="flex-line">по адресу: <BaseTextBox placeholder="Адрес абонента"/></div>

				<h2 class="center">1.ХАРАКТЕРИСТИКА ГАЗООБОРУДОВАНИЯ</h2>
				<p>Указывается для внутридомового газооборудования – число квартир, тип и число установленных газовых приборов, общая протяженность газопровода и число запорных устройств на них; для внутрицехового оборудования общая протяженность газопровода, тип и число установленного газооборудования, рабочее давление газа</p>
				<BaseMemo resize="vertical" placeholder="Начните вводить сюда"/>

				<h2 class="center">2. ПЕРЕЧЕНЬ ПРИЛАГАЕМЫХ СЕРТИФИКАТОВ, ТЕХНИЧЕСКИХ ПАСПОРТОВ И ДРУГИХ ДОКУМЕНТОВ, УДОСТОВЕРЯЮЩИХ КАЧЕСТВО МАТЕРИАЛОВ И ОБОРУДОВАНИЯ</h2>
				<BaseMemo resize="vertical" placeholder="Начните вводить сюда"/>

				<h2 class="center">3. ДАННЫЕ О СВАРКЕ СТЫКОВ ГАЗОПРОВОДА</h2>

				<table>
					<thead>
						<tr>
							<td rowspan="2">ФИО сварщика</td>
							<td colspan="2">Клеймо и номер удостоверения сварщика</td>
							<td rowspan="2">Сварено стыков</td>
							<td rowspan="2">Дата проведения сварочных работ</td>
						</tr>
						<tr>
							<td colspan="0.5">Диаметр, мм</td>
							<td colspan="0.5">Число, шт.</td>
						</tr>
					</thead>
					<tbody>
						<DynamicRow :n="5"/>
					</tbody>
				</table>

				<br>
				<BaseTextBox placeholder="Должность, подпись, инициалы, фамилия производителя работ"/>

				<h2 class="center">4. ПРОВЕРКА И ОЧИСТКА ВНУТРЕННЕЙ ПОЛОСТИ ГАЗОПРОВОДА ИСПЫТАНИЕ ГАЗОПРОВОДА НА ПРОЧНОСТЬ И ГЕРМЕТИЧНОСТЬ</h2>
				<ol>
					<li>Перед монтажом газопровода трубы осмотрены и внутренняя полость их очищена от грязи, окалины и других засорений</li>
					<li>
						<p>
							<BaseTextBox type="date" style="display: inline-block;"/> Газопровод испытан на прочность давлением воздуха <BaseTextBox style="display: inline-block"/> 0.1 <BaseTextBox placeholder="кгс/см2" style="display: inline-block"/> МПа, (кгс/см2) в течении 1 ч на участке от отключающего устройства на вводе до кранов на отпусках к оборудованию (приборам) с внешним осмотром и поверкой сварных и фланцевых соединений с помощью мыльной эмульсии после давления до <BaseTextBox style="display: inline-block"/> 0,005 <BaseTextBox placeholder="кгс/см2" style="display: inline-block"/> МПа (________0,05__ кгс/см2).
						</p>
						<p>
							Дефекты и утечки не обнаружены. Испытание на прочность газопровод выдержал.
						</p>
					</li>
					<li>
						<p>
							<BaseTextBox type="date" style="display: inline-block;"/> Газопровод испытан на герметичность давлением воздуха___500мм. вод/ст. (_____кгс/см2) с подключением газовыми приборами. При испытании в течении_____5 мин. давление упало на_______МПа (_____кгс/см2) при допускаемом падении ______20 мм. Вод/ст. (_______кгс/см2).
						</p>
						<p>
							Испытание на герметичность газопровод выдержал.
						</p>
						<div class="flex-line">Производитель работ <BaseTextBox placeholder="должность, инициалы, фамилия"/></div>
						<div class="flex-line">Представитель газового хозяйства <BaseTextBox placeholder="должность, инициалы, фамилия"/></div>
					</li>
				</ol>

				<h2 class="center">5. ЗАКЛЮЧЕНИЕ</h2>
				<p>Внутридомовое (внутрицеховое) газооборудование (включая газопровод и ГРУ) смонтировано в соответствии с проектом, разработанным</p>
				<div class="flex-line">
					<BaseTextBox placeholder="Наименование проектной организации"/>
					<BaseTextBox type="date" placeholder="Дата выпуска проекта"/>
				</div>
				<p>с учетом согласованных изменений, внесенных в рабочие чертежи № <BaseTextBox placeholder="номер чертежа"/></p>
				<p>Строительство начато <BaseTextBox type="date"/></p>
				<p>Строительство закончено <BaseTextBox type="date"/></p>

				<div class="flex-line">Ведущий инженер СОВГО: <BaseTextBox placeholder="должность, инициалы, фамилия"/></div>
				<div class="flex-line">Представител газового хозяйства: <BaseTextBox placeholder="должность, инициалы, фамилия"/></div>

				<p style="font-style:italic; font-size:14px; opacity:.6; line-height:1.4em; margin-bottom:.8em;">
					Примечание: Если в цехе (котельной) имеются ГРУ, смонтировано в общем помещении цеха и обслуживающая только данный цех, то на внутрицеховой газопровод и ГРУ допускается составлять общий строительный паспорт. В том случае ниже приведенную форму паспорта должны быть внесены следующие изменения
				</p>
				<ol style="list-style-type:lower-latin; margin-top:.4em;">
					<li>в раздел 1 характеристика газооборудования цеха должна быть приведена по следующей форме:</li>
					<table style="max-width:100%;">
						<thead>
							<tr>
								<td rowspan="2">Общая протяженность газопровода цеха, м</td>
								<td colspan="2">Давление газа МПа (кгс/см2)</td>
								<td colspan="4">Оборудование ГРУ, тип, размер</td>
								<td colspan="4">Газифицируемое оборудование (печи, котла, приборы, шт.)</td>
							</tr>
							<tr>
								<td>На входе P max</td>
								<td>На выходе из ГРП (рабочее Р)</td>
								<td>Регулятор давления</td>
								<td>Клапан отключитель</td>
								<td>Предохранительный сбросной клапан</td>
								<td>Фильтр</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</thead>
						<tbody>
							<DynamicRow :n="11"/>
						</tbody>
					</table>
					<li>в разделе 2,3,4 необходимо учесть ГРУ</li>
					<li>дополнить паспорт разделом «Испытание ГРУ на прочность и герметичность»</li>
					<li>в «Заключении» вместо слов «(включая газопровод)» следует написать «(включая газопровод и ГРУ)»</li>
				</ol>
			</article>

			<div style="margin:1.4em 0 5em; display:flex; justify-content:flex-end; gap:1em;">
				<BaseButton prependIcon="mdi-content-save" style="font-size:1.2em;">Сохранить</BaseButton>
				<BaseButton prependIcon="mdi-printer" variant="secondary" style="font-size:1.2em;">Печать</BaseButton>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import BaseAutocomplete from '~/components/common/BaseAutocomplete.vue';
import BaseButton from '~/components/common/BaseButton.vue';
import BaseMemo from '~/components/common/BaseMemo.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';
import DynamicRow from '~/components/DynamicRow.vue';


</script>

<style lang="scss">
body:has(.construct-pass-page) {
	background-color: #e0f2fe;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	color: #183d6d;
}

.construct-pass-page {
	.documents {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: .6em;
		margin-top:5em;

		.document {
			font-family: serif;
			color: #222;
			background-color: #fff;
			position: relative;
			padding:2em 4em;
			width: 800px;
			border-radius: 6px;
			box-shadow: 0 6px 40px rgba(0,0,0,.05);
			// box-shadow: 0 0 8px 0px #0079C1aa;

			h1 {
				font-size: 24px;
			}
			h2 {
				font-size: 20px;
			}

			p {
				text-indent:2em;
				line-height:1.4em;

				.base-text-box {
					display: inline-block;
				}
			}

			.center {
				text-align: center;
			}

			.small {
				font-size: .8em;
				opacity: .6;
			}

			.flex-line {
				display:flex;
				align-items:center;
				gap:1em;

				&>* {
					flex:auto 1 1;
				}
			}

			table {
				width: 100%;
				border-collapse: collapse;

				td, th {
					border: 1px solid #ddd;
					text-align: center;
					padding: .4em;
				}
			}
		}
	}

	table td[contenteditable]:empty::before {
		// content: attr(data-placeholder);
		content: "___";
		opacity: .35;
	}
	table td[contenteditable]:focus::before {
		content: "";
	}
	table td[contenteditable] {
		min-width: 4ch;
		padding: .4rem .6rem;
		outline: none;
		border: 1px solid #e5e7eb;
	}
	table tr + tr td {
		border-top: none;
	}
}
</style>
