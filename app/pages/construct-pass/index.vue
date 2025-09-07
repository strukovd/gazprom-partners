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
				<!-- <div class="small center"><span>организации и номер проекта</span></div> -->
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
						<tr>
							<td contenteditable style="padding:1em;" v-for="(item, index) of 5" :key="index"></td>
						</tr>
					</tbody>
				</table>

			</article>
		</div>
	</section>
</template>

<script lang="ts" setup>
import BaseAutocomplete from '~/components/common/BaseAutocomplete.vue';
import BaseButton from '~/components/common/BaseButton.vue';
import BaseMemo from '~/components/common/BaseMemo.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';


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
}
</style>
