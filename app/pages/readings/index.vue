<template>
	<IndexDesktop v-if="isDesktop"/>
	<IndexMobile v-else/>
</template>

<script lang="ts" setup>
import useDevice from '~/composables/useDevice';
import IndexDesktop from './indexDesktop.vue';
import IndexMobile from './indexMobile.vue';

const { isDesktop } = useDevice();

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CONTROLLER', 'CALLCENTER', 'CALLCENTER_COMPLAINT_ASSIGNEE'],
	layout: 'default'
});
</script>

<style lang="scss">

</style>
