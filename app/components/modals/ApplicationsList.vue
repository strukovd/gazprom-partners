<template>
	<div class="applications-modal">
		<main class="am-content">
			<div v-if="!applications.length" class="am-empty">Заявок нет</div>

			<section v-else class="am-list">
				<article v-for="application of applications" :key="application.id" class="am-issue">
					<div class="am-icon">
						<BaseIcon name="mdi-file-document-outline" size="1.3em"/>
					</div>

					<div class="am-body">
						<div class="am-title">
							<span class="am-key">{{ application.issueKey || `#${application.id}` }}</span>
							<span class="am-status">{{ application.status?.name || 'Без статуса' }}</span>
						</div>
						<div class="am-summary">{{ application.summary || 'Без описания' }}</div>
						<div class="am-meta">
							<span>{{ application.project?.name || application.project?.key || 'Проект не указан' }}</span>
							<span>{{ application.assignee || 'Исполнитель не назначен' }}</span>
							<span>{{ toLocaleDate(application.created) || application.created || 'Дата не указана' }}</span>
						</div>
					</div>
				</article>
			</section>
		</main>

		<footer class="am-footer">
			<BaseButton prependIcon="mdi-close" variant="secondary" @click="close">Закрыть</BaseButton>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import BaseButton from '../common/base/BaseButton.vue';
import BaseIcon from '../common/base/BaseIcon.vue';
import type { AccountData } from '~/types/Facility';
import { toLocaleDate } from '~/utils/format';

const props = defineProps<{
	payload?: {
		applications?: AccountData['applications'];
	};
}>();

const applications = computed(() => props.payload?.applications || []);

function close() {
	const modal = useAppStore().modals.pop();
	if (modal?.resolve) modal.resolve(false);
}
</script>

<style lang="scss">
.applications-modal {
	// width: min(720px, 82vw);

	.am-content {
		padding-bottom: 1em;

		.am-empty {
			padding: 2em 0;
			color: #737373;
			font-size: .9em;
			font-weight: 700;
			text-align: center;
		}

		.am-list {
			display: grid;
			gap: .8em;
			max-height: 65vh;
			overflow-y: auto;
			padding-right: .2em;

			.am-issue {
				display: flex;
				gap: .8em;
				padding: 1em;
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				background: #fff;

				.am-icon {
					display: grid;
					place-items: center;
					flex: 0 0 2.5em;
					width: 2.5em;
					height: 2.5em;
					border-radius: 8px;
					background: #eef4ff;
					color: #2563ea;
				}

				.am-body {
					display: grid;
					gap: .45em;
					min-width: 0;
					flex: 1;

					.am-title {
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: .8em;

						.am-key {
							color: #111827;
							font-weight: 800;
						}

						.am-status {
							padding: .25em .6em;
							border-radius: 999px;
							background: #f3f4f6;
							color: #475569;
							font-size: .78em;
							font-weight: 700;
							white-space: nowrap;
						}
					}

					.am-summary {
						color: #374151;
						line-height: 1.4;
					}

					.am-meta {
						display: flex;
						flex-wrap: wrap;
						gap: .4em .8em;
						color: #737373;
						font-size: .86em;
					}
				}
			}
		}
	}

	.am-footer {
		display: flex;
		justify-content: flex-end;
	}

	@media (max-width: 700px) {
		width: 100%;

		.am-content {
			.am-list {
				.am-issue {
					.am-body {
						.am-title {
							align-items: flex-start;
							flex-direction: column;
							gap: .4em;
						}
					}
				}
			}
		}
	}
}
</style>
