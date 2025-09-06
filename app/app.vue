<template>
  <div>
	<NuxtLayout :name="layout">
		<NuxtPage/>
	</NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
const layout = computed(() => {
	// if (useRoute().query.layout === 'default') return 'default';
	return 'default';
});

</script>

<style>

</style>
