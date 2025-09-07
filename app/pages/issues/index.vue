<template>
	<section class="issues-page">
		<div class="issues">
			<h1>Заявки сотрудника</h1>
			<BaseTextBox style="width:100%;" prepend-icon="mdi-magnify" button="Найти" placeholder="Поиск" />
			<div class="issue" v-for="(item, index) of 5" :key="index">
				<div class="title">Асанбаева Дилбара Жапаровна, Бишкек, Ленинский, ж/м Ынтымак, Жетиген, ул., д. 29/1, , 996700327000</div>
				<div class="flex-line">
					<div class="issue-date"><span>Дата подачи: </span><span class="date">12.12.2022</span></div>
					<div class="status" :style="{ background: randColor() }">Согласование ЭЧ</div>
				</div>
				<BaseButton prependIcon="mdi-plus">Добавить строй паспорт</BaseButton>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';

function randColor() {
	const colors = [ '#0079C1', '#14cf34', '#e3ce31', ];
	const color = colors[Math.floor(Math.random() * colors.length)];
	// return `linear-gradient(to top, ${color} 0%, ${color}a8 100%)`;
	return color;
}
</script>

<style lang="scss">
body:has(.issues-page) {
	background-color: #e0f2fe;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	color: #183d6d;
}

.issues-page {
	.issues {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: .6em;
		max-width:650px;
		margin:1em auto;

		.issue {
			background-color: #fff;
			position: relative;
			padding: .6em 1em;
			// max-width: 600px;
			border-radius: 6px;
			box-shadow: 0 6px 40px rgba(0,0,0,.05);
			// box-shadow: 0 0 8px 0px #0079C1aa;

			.title {
				font-size: 1.2em;
				font-weight: 500;
				margin-bottom: .4em;
			}

			.issue-date {
				font-size: 14px;
				opacity: .6;

				.date {
					color: #7e0606;
					font-weight: 600;
				}
			}

			.flex-line {
				display:flex;
				align-items:center;
				gap:1em;
				justify-content: space-between;
				align-items: center;

				// &>* {
				// 	flex:auto 1 1;
				// }
			}

			.status {
				// position: absolute;
				// top: 0;
				// right: 0;
				display: inline-block;
				background-color: #0079C1;
				color: #fff;
				padding:.4em .9em;
				font-size: 14px;
				border-radius:6px;
			}
		}
	}
}
</style>
