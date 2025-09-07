<template>
	<section>
		<div class="buttons" style="display:flex; flex-direction:column; gap:1em;">
			<BaseButton style="font-size:1.6em;" @click="navigateTo('/login')">Авторизация</BaseButton>
			<BaseButton style="font-size:1.6em;" @click="navigateTo('/issues')">Задачи</BaseButton>
			<BaseButton style="font-size:1.6em;" @click="navigateTo('/construct-pass')">Файл строй-паспорта</BaseButton>
		</div>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';


</script>

<style>

</style>
