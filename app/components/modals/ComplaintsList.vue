<template>
	<div class="complaints-list-modal">
		<main class="cl-content">
			<section v-if="!complaints.length" style="display: grid; place-items: center; padding: 2em 0;">
				<img src="/images/complaints-empty.svg" width="160px"/>
				<div class="cl-empty">Жалоб нет</div>
			</section>

			<section v-else class="cl-list">
				<article
					v-for="item of complaintsView"
					:key="item.complaint.id"
					class="cl-complaint"
					:style="{ '--cl-color': item.subject.color }"
					@click="showComplaint(item.complaint)"
				>
					<div class="cl-icon">
						<BaseIcon :name="item.subject.icon" size="1.3em"/>
					</div>

					<div class="cl-body">
						<div class="cl-title">
							<div class="cl-heading">
								<span class="cl-subject">{{ item.complaint.subject || 'Без темы' }}</span>
								<span class="cl-key">#{{ item.complaint.id }}</span>
							</div>
							<span :class="['status', item.statusClass]">{{ item.complaint.status || 'Без статуса' }}</span>
						</div>
						<div class="cl-description">{{ item.complaint.description || 'Описание не заполнено' }}</div>
						<div class="cl-meta">
							<span class="cl-date"><BaseIcon name="mdi-calendar-month-outline" size="1em"/> {{ toLocaleDate(item.complaint.created) || item.complaint.created || 'Дата не указана' }}</span>
							<span class="cl-responsible"><BaseIcon name="mdi-account" size="1em"/> {{ item.complaint.userName || 'Исполнитель не назначен' }}</span>
							<span v-if="item.complaint.sla" class="cl-sla"><BaseIcon name="mdi-timer-outline" size="1em"/> {{ item.complaint.sla }} дн.</span>
						</div>
					</div>
				</article>
			</section>
		</main>

		<footer class="cl-footer">
			<BaseButton prependIcon="mdi-close" variant="secondary" @click="close">Закрыть</BaseButton>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import BaseButton from '../common/base/BaseButton.vue';
import BaseIcon from '../common/base/BaseIcon.vue';
import type { ComplaintsPayload } from '~/services/complaints';
import { toLocaleDate } from '~/utils/format';

const props = defineProps<{
	payload?: {
		complaints?: ComplaintsPayload[];
	};
}>();

const { $modal } = useNuxtApp();
const complaints = computed(() => props.payload?.complaints || []);
const complaintsView = computed(() => complaints.value.map(complaint => ({
	complaint,
	subject: subjectView(complaint.subject),
	statusClass: statusClass(complaint.status),
})));

function subjectView(subject?: string) {
	if(typeof subject === 'string') {
		if (subject.includes('БСГ')) return { color: '#61a3ed', icon: 'mdi-gauge' };
		if (subject.includes('сотрудника')) return { color: '#fb6868', icon: 'mdi-account-alert-outline' };
		if (subject.includes('Тариф') || subject.includes('начисл') || subject.includes('Перерасчет')) return { color: '#f5ba5e', icon: 'mdi-cash-sync' };
		if (subject.includes('квитанц')) return { color: '#83d1af', icon: 'mdi-receipt-text-outline' };
		if (subject.includes('дорожное') || subject.includes('газопровод')) return { color: '#fb6868', icon: 'mdi-road-variant' };
		if (subject.includes('услуг') || subject.includes('СМР') || subject.includes('ЭЧ')) return { color: '#61a3ed', icon: 'mdi-tools' };
		if (subject.includes('Утечка') || subject.includes('Авария')) return { color: '#fb6868', icon: 'mdi-fire-alert' };
	}
	return { color: '#83d1af', icon: 'mdi-alert-box' };
}

function statusClass(status = '') {
	if (status === 'Просрочено') return 'status-red';
	if (status === 'Новая') return 'status-blue';
	if (status === 'Закрыто') return 'status-green';
	if (status === 'В работе') return 'status-yellow';
	return 'status-grey';
}

function showComplaint(complaint: ComplaintsPayload) {
	$modal.show('ComplaintDetails', {
		title: `Жалоба #${complaint.id}`,
		payload: {
			complaint,
		}
	});
}

function close() {
	const modal = useAppStore().modals.pop();
	if (modal?.resolve) modal.resolve(false);
}
</script>

<style lang="scss">
.complaints-list-modal {
	// width: min(720px, 82vw);

	.cl-content {
		padding-bottom: 1em;

		.cl-empty {
			padding: .4em 0;
			color: #467cec;
			font-size: 0.9em;
			font-weight: 700;
			text-align: center;
		}

		.cl-list {
			display: grid;
			max-height: 65vh;
			overflow-y: auto;
			padding: .1em .2em .1em 0;

			.cl-complaint {
				position: relative;
				display: flex;
				align-items: center;
				gap: .75em;
				padding: .75em .7em .75em 1.55em;
				border-radius: 8px;
				background: #fff;
				cursor: pointer;
				transition: opacity 200ms ease 0s, transform 200ms ease 0s;

					&::before {
						content: '';
						position: absolute;
						top: 0;
						bottom: 0;
						left: 2.5em;
					width: .6em;
					border: 1px solid #bcc4cd;
					border-width: 0 1px;
					background: #e2e8f0;
				}

				&:first-child {
					&::before {
						top: 50%;
					}
				}

				&:last-child {
					&::before {
						bottom: 50%;
					}
				}

				&:hover {
					opacity: .86;
					transform: translateY(-1px);
				}

				.cl-icon {
					display: grid;
					place-items: center;
					margin-right: .7em;
					flex: 0 0 2.5em;
					width: 2.5em;
					height: 2.5em;
					border-radius: 8px;
					color: #fff;
					background: var(--cl-color);
					box-shadow: 0 10px 20px color-mix(in srgb, var(--cl-color) 22%, transparent);
					z-index: 1;
				}

				.cl-body {
					display: grid;
					gap: .45em;
					min-width: 0;
					flex: 1;

					.cl-title {
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: .8em;

						.cl-heading {
							display: flex;
							align-items: baseline;
							gap: .45em;
							min-width: 0;
						}

						.cl-key {
							color: #8f8f8f;
							font-size: .7em;
							position: relative;
							top: -2px;
						}
					}

					.cl-subject {
						overflow: hidden;
						color: #111827;
						font-weight: 700;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.cl-description {
						display: -webkit-box;
						overflow: hidden;
						color: #374151bb;
						line-height: 1.4;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						font-size: .9em;
					}

					.cl-meta {
						display: flex;
						flex-wrap: wrap;
						gap: .4em .8em;
						color: #737373;
						font-size: .86em;

						.cl-responsible {}
						.cl-date {
							color: #dd2f18;
						}
						.cl-sla {
							color: goldenrod;
						}
					}
				}
			}
		}
	}

	.cl-footer {
		display: flex;
		justify-content: flex-end;
	}

	@media (max-width: 700px) {
		width: 100%;

		.cl-content {
			.cl-list {
				.cl-complaint {
					.cl-body {
						.cl-title {
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
