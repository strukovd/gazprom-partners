<template>
	<section id="news-page">
		<main class="page-blocks">
			<section class="row-tools">
				<BaseTabs v-model="form.tab" :items="[
					{ value: 'Все', key: undefined },
					{ value: 'Отключение', key: 'DISCONNECTION' },
					{ value: 'Газификация', key: 'GASIFICATION' },
				]"/>
				<BaseButton prependIcon="mdi-plus" @click="openCreateNews">Создать новость</BaseButton>
			</section>

			<section v-if="!form.tab || form.tab === 'DISCONNECTION'" class="row-outages">
				<BaseIsland title="Отключение газа по районам" prependIcon="mdi-fire-alert" data-aos="zoom-in">
					<template #actions>
						<div class="island-actions">
							<span>{{ activeDisconnections.length }} активных</span>
						</div>
					</template>

					<section class="filters">
						<BaseAutocomplete model-value="Все районы" :items="[{key: 'All', value:'Все районы'}, {key:'Leninskiy', value:'Ленинский район'}, {key:'Ocktyabrskiy',value:'Октябрьский район'}, {key:'Alamedinskiy',value:'Аламединский район'}]" prepend-icon="mdi-navigation-variant-outline"/>
						<BaseTextBox model-value="" type="date"/>
						<BaseTextBox model-value="" placeholder="Улица..." prepend-icon="mdi-road-variant"/>
						<BaseButton @click="loadNews">Найти</BaseButton>
					</section>

					<section class="outage-list">
						<div v-if="loading" class="empty-state">Загрузка...</div>
						<div v-else-if="!pageData.disconnections.length" class="empty-state">Нет отключений</div>
						<article
							v-for="item of pageData.disconnections"
							:key="item.id"
							:class="['outage-card', getNewsCardClass(item)]"
							data-aos="fade-up"
						>
							<div class="meta">
								<b>{{ getUrgencyLabel(item.urgencyLevel) }}</b>
								<span>Опубликовано: {{ formatDate(item.created) }}</span>
								<span>{{ isNewsExpired(item) ? 'Действовало до' : 'Действует до' }}: {{ formatDateTime(item.endDate) || 'не указано' }}</span>
								<strong :class="{ muted: isNewsExpired(item) }">
									{{ isNewsExpired(item) ? 'Устарело' : 'Актуально' }}
								</strong>
							</div>

							<div v-if="userStore.isPrivilegedUser" class="news-actions">
								<BaseButton prependIcon="mdi-pencil-outline" variant="secondary" @click="openEditNews(item)">Редактировать</BaseButton>
								<BaseButton prependIcon="mdi-delete-outline" color="#dc2626" @click="deleteNews(item)">Удалить</BaseButton>
							</div>

							<h3>{{ item.title }}</h3>

							<p>{{ item.text }}</p>

							<div v-if="item.textForClient" class="voice-text">
								<div>
									<BaseIcon name="mdi-microphone-outline"/>
									<span>Текст для озвучивания:</span>
								</div>

								<p>«{{ item.textForClient }}»</p>
							</div>
						</article>
					</section>
				</BaseIsland>
			</section>

			<section v-if="!form.tab || form.tab === 'GASIFICATION'" class="row-gasification">
				<BaseIsland title="Газификация населённых пунктов" prependIcon="mdi-map-marker" data-aos="fade-up">
					<template #actions>
						<a href="#">{{ pageData.gasification.length }} обновления</a>
					</template>

					<div class="gasification-list">
						<div v-if="loading" class="empty-state">Загрузка...</div>
						<div v-else-if="!pageData.gasification.length" class="empty-state">Нет новостей по газификации</div>
						<article
							v-for="item of pageData.gasification"
							:key="item.id"
							class="gasification-card"
							data-aos="fade-up"
						>
							<div class="status" :class="{ muted: isNewsExpired(item) }">
								<BaseIcon name="mdi-check-circle-outline"/>
								<span>{{ isNewsExpired(item) ? 'Устарело' : 'Актуально' }}</span>
							</div>

							<h3>{{ item.title }}</h3>

							<span class="date">
								Опубликовано: {{ formatDate(item.created) }} · Филиал: {{ getBranchLabel(item.branch) }}
							</span>

							<div v-if="userStore.isPrivilegedUser" class="news-actions">
								<BaseButton prependIcon="mdi-pencil-outline" variant="secondary" @click="openEditNews(item)">Редактировать</BaseButton>
								<BaseButton prependIcon="mdi-delete-outline" color="#dc2626" @click="deleteNews(item)">Удалить</BaseButton>
							</div>

							<p>{{ item.text }}</p>

							<div v-if="item.textForClient" class="voice-text">
								<div>
									<BaseIcon name="mdi-microphone-outline"/>
									<span>Текст для озвучивания:</span>
								</div>

								<p>«{{ item.textForClient }}»</p>
							</div>
						</article>
					</div>
				</BaseIsland>
			</section>
		</main>

	</section>
</template>

<script lang="ts" setup>
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import BaseAutocomplete from '~/components/common/base/BaseAutocomplete.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import { news, type NewsCategory, type NewsLevel, type NewsPayload } from '~/services/news';
import { formatDate, formatDateTime } from '~/utils/format';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CONTROLLER', 'CALLCENTER', 'CALLCENTER_COMPLAINT_ASSIGNEE'],
	layout: 'default'
});

type NewsTab = Extract<NewsCategory, 'DISCONNECTION' | 'GASIFICATION'> | undefined;

const { $flags, $modal } = useNuxtApp();
const userStore = useUserStore();
const form = reactive<{ tab: NewsTab }>({
	tab: undefined,
});
const loading = ref(false);
const pageData = reactive({
	disconnections: [] as NewsPayload[],
	gasification: [] as NewsPayload[],
});

const activeDisconnections = computed(() => {
	return pageData.disconnections.filter(item => !isNewsExpired(item));
});

watch(() => form.tab, () => {
	loadNews();
});

onMounted(() => {
	loadNews();
});

async function loadNews() {
	loading.value = true;

	if (!form.tab || form.tab === 'DISCONNECTION') {
		pageData.disconnections = await news.fetch({
			categoryFilter: 'DISCONNECTION',
			sortField: 'created',
			sortOrder: 'DESC',
		}) || [];
	}

	if (!form.tab || form.tab === 'GASIFICATION') {
		pageData.gasification = await news.fetch({
			categoryFilter: 'GASIFICATION',
			sortField: 'created',
			sortOrder: 'DESC',
		}) || [];
	}

	loading.value = false;
}

async function openCreateNews() {
	const created = await $modal.show('NewsCreate', { title: 'Создание новости', nonCloseable: true });
	if (created) loadNews();
}

async function openEditNews(item: NewsPayload) {
	const updated = await $modal.show('NewsCreate', {
		title: `Редактирование новости #${item.id}`,
		nonCloseable: true,
		payload: {
			news: item,
		}
	});
	if (updated) loadNews();
}

async function deleteNews(item: NewsPayload) {
	if (!window.confirm(`Удалить новость "${item.title}"?`)) return;

	try {
		await news.delete(item.id);
		$flags.success('Новость удалена');
		loadNews();
	}
	catch (error: any) {
		const data = error?.data || error?.response?._data;
		const message = data?.message || data?.error || data?.detail || error?.message;
		$flags.error(Array.isArray(message) ? message.join('\n') : (message || 'Не удалось удалить новость'));
	}
}

function isNewsExpired(item: NewsPayload) {
	return Boolean(item.endDate && new Date(item.endDate) < new Date());
}

function getNewsCardClass(item: NewsPayload) {
	if (isNewsExpired(item)) return 'old';
	if (item.urgencyLevel === 'HIGH') return 'danger';
	if (item.urgencyLevel === 'MIDDLE') return 'warning';
	return 'default';
}

function getUrgencyLabel(value: string) {
	const labels: Record<NewsLevel, string> = {
		HIGH: 'ВЫСОКИЙ',
		MIDDLE: 'СРЕДНИЙ',
		NORMAL: 'ОБЫЧНЫЙ',
	};

	return labels[value as NewsLevel] || value;
}

function getBranchLabel(value: string) {
	const labels = {
		BISHKEK: 'Бишкекгаз',
		CHUI: 'Чуйгаз',
		OSH: 'Ошгаз',
		JALALABAD: 'Жалал-Абадгаз',
	} as Record<string, string>;

	return labels[value] || value || 'не указано';
}

</script>

<style lang="scss">
#news-page {
	.page-blocks {
		>section,
		>div {
			margin: 0 0 1em 0;
		}

		.row-tools {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1em;

			>.tabs {
				margin: 0;
			}
		}

		.row-outages {
			width: 100%;

			.island-actions {
				display: flex;
				align-items: center;
				gap: 24px;

				span {
					color: #dc2626;
					font-size: 12px;
					font-weight: 800;
				}
			}

			.filters {
				display: grid;
				grid-template-columns: 190px 180px minmax(240px, 1fr) 100px;
				gap: 18px;
				margin-bottom: 18px;
			}

			.outage-list {
				display: grid;
				gap: 14px;

				.empty-state {
					padding: 1em 0;
					color: #6b7280;
					text-align: center;
				}
			}

			.outage-card {
				display: grid;
				gap: 10px;
				padding: 18px 22px;
				border: 1px solid #e5e7eb;
				border-radius: 14px;
				background: #fff;

				.meta {
					display: grid;
					grid-template-columns: 120px 1fr 1fr auto;
					align-items: center;
					gap: 18px;
					font-size: 12px;

					b {
						font-weight: 900;
					}

					span {
						color: #6b7280;
					}

					strong {
						color: #059669;
						font-size: 12px;
						text-align: right;

						&.muted {
							color: #6b7280;
						}
					}
				}

				.news-actions {
					display: flex;
					justify-content: flex-end;
					gap: .5em;
				}

				h3 {
					margin: 0;
					font-size: 15px;
					font-weight: 800;
				}

				>p {
					margin: 0;
					color: #374151;
					font-size: 14px;
					line-height: 1.45;
				}

				.voice-text {
					border: 1px solid rgba(229, 231, 235, .8);
					background: rgba(255, 255, 255, .82);
				}

				&.danger {
					border-color: #fecaca;
					background: #fff1f2;

					.meta {
						b {
							color: #dc2626;
						}
					}
				}

				&.warning {
					border-color: #fde68a;
					background: #fffbeb;

					.meta {
						b {
							color: #f59e0b;
						}
					}
				}

				&.default {
					.meta {
						b {
							color: #059669;
						}
					}
				}

				&.old {
					opacity: .82;

					.meta {
						b {
							color: #059669;
						}
					}
				}
			}
		}

		.row-gasification {
			width: 100%;

			.gasification-list {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 18px;

				.empty-state {
					grid-column: 1 / -1;
					padding: 1em 0;
					color: #6b7280;
					text-align: center;
				}
			}

			.gasification-card {
				display: grid;
				gap: 10px;
				padding: 22px 26px;
				border: 1px solid #e5e7eb;
				border-radius: 14px;
				background: #fff;

				.status {
					display: flex;
					align-items: center;
					gap: 6px;
					color: #059669;
					font-size: 12px;
					font-weight: 800;

					&.muted {
						color: #6b7280;
					}
				}

				h3 {
					margin: 0;
					font-size: 16px;
					font-weight: 800;
				}

				.date {
					color: #6b7280;
					font-size: 13px;
				}

				.news-actions {
					display: flex;
					gap: .5em;
				}

				>p {
					margin: 0;
					color: #374151;
					font-size: 14px;
					line-height: 1.45;
				}
			}
		}

		.voice-text {
			display: grid;
			gap: 8px;
			margin-top: 8px;
			padding: 14px 16px;
			border-radius: 10px;
			background: #f9fafb;

			div {
				display: flex;
				align-items: center;
				gap: 6px;
				color: #6b7280;
				font-size: 12px;
			}

			p {
				margin: 0;
				color: #4b5563;
				font-size: 13px;
				line-height: 1.45;
			}
		}

		a {
			color: #2563eb;
			font-size: 12px;
			font-weight: 700;
			text-decoration: none;
		}

		@media (max-width: 900px) {
			.row-tools {
				align-items: stretch;
				flex-direction: column;
			}

			.row-outages {
				.filters {
					grid-template-columns: 1fr 1fr;
				}

				.outage-card {
					.meta {
						grid-template-columns: 1fr 1fr;
						gap: 8px 14px;

						strong {
							text-align: left;
						}
					}
				}
			}

			.row-gasification {
				.gasification-list {
					grid-template-columns: 1fr;
				}
			}
		}

		@media (max-width: 640px) {
			.row-outages {
				.island-actions {
					align-items: flex-start;
					flex-direction: column;
					gap: 6px;
				}

				.filters {
					grid-template-columns: 1fr;
				}

				.outage-card {
					padding: 16px;

					.meta {
						grid-template-columns: 1fr;
					}
				}
			}
		}
	}
}
</style>
