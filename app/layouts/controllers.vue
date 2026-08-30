<template>
	<ControllersDesktop v-if="isDesktop">
		<slot/>
	</ControllersDesktop>
	<ControllersMobile v-else>
		<slot/>
	</ControllersMobile>
</template>

<script lang="ts" setup>
import ControllersDesktop from './controllersDesktop.vue';
import ControllersMobile from './controllersMobile.vue';
import useDevice from '~/composables/useDevice';

const { isMobile, isDesktop } = useDevice();
</script>