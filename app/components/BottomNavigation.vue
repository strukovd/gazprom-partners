<template>
	<section class="bottom-navigation">
		<nav class="bn-bar">
			<template v-for="link of mainLinks" :key="link.link ?? link.title">
				<button
					v-if="link.action"
					type="button"
					:class="['bn-item', { disabled: link.disabled }]"
					@click="handleActionClick(link)"
				>
					<BaseIcon :name="link.icon!" size="22"/>
					<span class="bn-title">{{ link.title }}</span>
				</button>
				<NuxtLink
					v-else
					:to="link.link"
					:class="['bn-item', { active: isActiveLink(link), disabled: link.disabled }]"
					@click="handleLinkClick(link, $event)"
				>
					<BaseIcon :name="link.icon!" size="22"/>
					<span class="bn-title">{{ link.title }}</span>
				</NuxtLink>
			</template>

			<button v-if="moreLinks.length" type="button" class="bn-item" @click="openMore">
				<BaseIcon name="mdi-dots-horizontal" size="24"/>
				<span class="bn-title">Еще</span>
			</button>
		</nav>
	</section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import type { NavigationLink } from '~/composables/useDefaultNavigation';

const route = useRoute();
const { $modal } = useNuxtApp();
const { links } = useDefaultNavigation();

const navigationLinks = computed(() => links.filter(link => !link.spacer));
const mainLinks = computed(() => navigationLinks.value.slice(0, 4));
const moreLinks = computed(() => navigationLinks.value.slice(4));

function isActiveLink(link: NavigationLink) {
	if( link.link && route.path === link.link ) return true;
	return Boolean(link.children?.some(isActiveLink));
}

function handleLinkClick(link: NavigationLink, event: Event) {
	if( link.disabled ) {
		event.preventDefault();
		return;
	}
}

function handleActionClick(link: NavigationLink) {
	if( link.disabled ) return;
	link.action?.();
}

function openMore() {
	$modal.show('NavigationMenu', {
		title: 'Меню',
		payload: {
			links: moreLinks.value,
		},
	});
}
</script>

<style lang="scss">
.bottom-navigation {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 40;
	pointer-events: none;

	.bn-bar {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: .2rem;
		margin: 0;
		padding: .45rem .65rem calc(.45rem + env(safe-area-inset-bottom));
		background: #ffffff;
		border-top: 1px solid #e5e7eb;
		box-shadow: 0 -14px 30px #0f172a17;
		pointer-events: auto;

		.bn-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: .18rem;
			min-width: 0;
			min-height: 3.55rem;
			padding: .3rem .2rem;
			color: #64748b;
			background: transparent;
			border: 1px solid transparent;
			border-radius: 12px;
			text-decoration: none;
			cursor: pointer;

			&.active {
				color: #0e3896;
				background: #eff6ff;
			}

			&.disabled {
				color: #94a3b8;
				pointer-events: none;
			}

			.bn-title {
				max-width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: .68rem;
				font-weight: 600;
				line-height: 1.1;
				overflow: visible;
			}
		}
	}
}
</style>
