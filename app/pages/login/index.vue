<template>
	<section class="login-page">
		<div class="auth">
			<h2 class="title">Авторизация</h2>
			<div class="form">
				<BaseTextBox placeholder="Логин"/>
				<BaseTextBox placeholder="Пароль"/>
				<BaseButton>Войти</BaseButton>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';


</script>

<style lang="scss">
body:has(.login-page) {
	background-color: #e0f2fe;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	color: #183d6d;
}

.login-page {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;

	.auth {
		.title {
			font-size: 2em;
			text-align: center;
			margin-bottom:.6em;
		}
		.form {
			padding:3em;
			display: flex;
			flex-direction: column;
			gap: 1em;
			background-color: #fff;
			border-radius: 6px;
			filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.1));
		}
	}
}
</style>
