<template>
	<section id="sector-page">
		<main class="page-blocks">
			<section class="sp-heading">
				<h1 class="sp-title">Полевые работы</h1>
				<p class="sp-description">Управление задачами и сбор показаний приборов учета</p>
			</section>

			<BaseTabs :model-value="2" :items="[{ key: 1, value: 'Задачи на сегодня', icon: 'mdi-calendar-today' }, { key: 2, value: 'Отправка показаний', icon: 'mdi-gauge', badge: 38, }]"/>
			<BaseBreadcrumbs :breadcrumbs="[{ title: 'Участки', link: '/fieldworks/sectors' }, { title: 'Участок №' + sectorId, disabled: true }]" />

			<BaseIsland class="sp-summary">
				<template v-if="loading">
					<BaseSkeleton width="2.6em" height="2.6em" borderRadius="50%"/>
					<div class="sp-summary-item sp-summary-sector"><BaseSkeleton width="8em" height="2em"/></div>
					<div class="sp-summary-item"><BaseSkeleton width="8em" height="2em"/></div>
					<div class="sp-summary-item"><BaseSkeleton width="3em" height="2em"/></div>
					<div class="sp-spacer"></div>
					<div class="sp-summary-item"><BaseSkeleton width="6em" height="2em"/></div>
				</template>
				<template v-else>
					<div class="sp-summary-icon"><BaseIcon name="mdi-layers-triple-outline" size="1.7em"/></div>
					<div class="sp-summary-item sp-summary-sector">
						<div class="sp-summary-label">Участок</div>
						<div class="sp-summary-title">Участок №{{ sectorId }}</div>
					</div>
					<div class="sp-summary-item">
						<div class="sp-summary-label">Район</div>
						<div class="sp-summary-value"><BaseIcon name="mdi-city-variant-outline" size="1em"/>{{ sector.district }}</div>
					</div>
					<div class="sp-summary-item">
						<div class="sp-summary-label">Маршрутов</div>
						<div class="sp-summary-value">{{ sector.routes?.length ?? 0 }}</div>
					</div>
					<div class="sp-spacer"></div>
					<div v-if="sector?.progress" class="sp-summary-item">
						<div class="sp-summary-label">Прогресс</div>
						<div class="sp-summary-value">{{ sector.progress.collected }} / {{ sector.progress.total }} ({{ toPercent(sector.progress.collected, sector.progress.total) }}%)</div>
						<BaseProgressBar class="sp-progress-line" :percent="toPercent(sector.progress.collected, sector.progress.total)" height=".55em" color="#2563eb"/>
					</div>
				</template>
			</BaseIsland>

			<section class="sp-content">
				<div class="sp-caption">Маршруты участка</div>
				<div class="sp-routes">
					<template v-if="loading">
						<BaseIsland v-for="item of 2" :key="item" class="sp-route sp-route-skeleton">
							<BaseSkeleton width="40%" height="1.2em"/>
							<BaseSkeleton height="3.2em"/>
							<BaseSkeleton width="55%" height=".9em"/>
							<BaseSkeleton height="4em"/>
							<BaseSkeleton height=".45em"/>
						</BaseIsland>
					</template>
					<template v-else>
						<BaseIsland v-for="(route, index) of sector?.routes" :key="index" class="sp-route" @click="openRoute(route.id)">
							<div class="sp-route-header">
								<div class="sp-route-number"><BaseIcon name="mdi-transit-connection-variant" size="1.2em"/><span class="sp-route-id">{{ route.id }}</span></div>
								<div class="sp-route-date">{{ toLocaleDate(route.date) }}</div>
							</div>
							<section class="sp-assignees">
								<div v-for="assignee of route.assignees" class="sp-assignee"><Avatar :name="assignee.name" size="2em"/><span class="sp-assignee-name">{{ assignee.name }}</span></div>
							</section>
							<div class="sp-route-meta">
								<span class="sp-route-meta-item"><BaseIcon name="mdi-account-group-outline" size="1em"/>{{ route.subscribers }} абонентов</span>
								<span class="sp-route-meta-item"><BaseIcon name="mdi-map-marker-outline" size="1em"/>{{ route.streets.length }} улицы</span>
							</div>
							<div class="sp-streets">
								<div v-for="street of route.streets" class="sp-street"><span>{{ street.street }}</span><span>{{ street.subscribers }} аб.</span></div>
							</div>
							<div class="sp-route-progress">
								<div class="sp-route-progress-header"><span>Собрано: <span class="sp-route-progress-count">{{ route.progress.collected }} / {{ route.progress.total }}</span></span><span>{{ toPercent(route.progress.collected, route.progress.total) }}%</span></div>
								<BaseProgressBar :percent="toPercent(route.progress.collected, route.progress.total)" height=".45em" color="#2563eb"/>
							</div>
						</BaseIsland>
					</template>
				</div>
			</section>
		</main>
	</section>
</template>

<script lang="ts" setup>
import Avatar from '~/components/common/Avatar.vue';
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import BaseProgressBar from '~/components/common/base/charts/BaseProgressBar.vue';
import BaseSkeleton from '~/components/common/base/BaseSkeleton.vue';
import { toLocaleDate } from '~/utils/format';

type Sector = {
	id: number;
	district: string;
	routes: {
		id: string;
		assignees: { id: number; name: string }[];
		date: string;
		subscribers?: number;
		streets: { street: string; subscribers: number }[];
		progress: { collected: number; total: number };
	}[];
	progress?: { collected: number; total: number };
	status?: string;
};

const route = useRoute();
const sectorId = computed(() => route.params.id);

const loading = ref(true);
const sector = ref<Sector>({} as Sector);

onMounted(async () => {
	loading.value = true;
	sector.value = await fetchSector();
	loading.value = false;
});


function openRoute(id: string) {
	navigateTo({
		path: `/fieldworks/routes/${id}`,
		query: { sector: String(sectorId.value) },
	});
}

function toPercent(progress = 0, total = 0) {
	if (!total) return 0;
	const percent = (progress / total) * 100;
	return Math.min(Math.max(Math.round(percent), 0), 100);
}

async function fetchSector(): Promise<Sector> {
	const sectorsStub: Sector = {
		id: 1,
		district: `Свердловский р-н`,
		routes: [
			{
				id: `1100802`,
				assignees: [{ id: 1, name: `Некрасова Наталия Михайловна` }],
				date: new Date().toISOString(),
				streets: [
					{
						street: `ул. ВИШНЕВАЯ`,
						subscribers: 62
					},
					{
						street: `ул. ТОКТОГУЛА`,
						subscribers: 58
					},
					{
						street: `мкр. КУЗНЕЦОВСКИй`,
						subscribers: 52
					},
					{
						street: `ул. КОРОЛЕВА`,
						subscribers: 45
					}
				],
				progress: { collected: 10, total: 21 },
			},
			{
				id: `1100803`,
				assignees: [{ id: 2, name: `Асанов Тимур Бакытбекович` }],
				date: new Date().toISOString(),
				streets: [
					{
						street: `мкр. АЛАМЕДИН-1`,
						subscribers: 54
					},
					{
						street: `ул. САДЫГАНОВА`,
						subscribers: 41
					},
					{
						street: `пер. ПИОНЕРСКИЙ`,
						subscribers: 38
					}
				],
				progress: { collected: 0, total: 12 },
			}
		],
		// progress: { collected: 10, total: 33 }, // суммарый прогресс из routes
		// status: `В работе`, // collected - новый, > 1 - в работе, = total - выполнено
	};

	// Общее количество абонентов
	for (const route of sectorsStub.routes) {
		route.subscribers = route.streets.reduce((acc, street) => {
			acc += street.subscribers;
			return acc;
		}, 0);
	}

	// Вычисляем общий прогресс
	sectorsStub.progress = sectorsStub.routes.reduce((acc, route) => {
		acc.collected += route.progress.collected;
		acc.total += route.progress.total;
		return acc;
	}, { collected: 0, total: 0 });

	return new Promise(resolve => setTimeout(() => resolve(sectorsStub), 1000));
}
</script>

<style lang="scss">
#sector-page {
	.page-blocks {
		display: grid;
		gap: 1.5em;
		margin: 1em 0;
	}

	.sp-heading {
		.sp-title {
			margin: 0;
			color: #020617;
			font-size: 1.8rem;
			font-weight: 900;
		}

		.sp-description {
			margin: .35em 0 0;
			color: #475569;
			font-size: 1rem;
		}
	}

	.sp-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2em;
		padding: 1.1em 1.3em;
		border-color: #dbeafe;
		box-shadow: 0 3px 8px rgba(15, 23, 42, .08);

		.sp-summary-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2.6em;
			height: 2.6em;
			aspect-ratio: 1/1;
			color: #ffffff;
			background: #9333ea;
			border-radius: 50%;
		}

		.sp-summary-item {
			padding-left: 1.4em;
			border-left: 1px solid #dbe3ee;

			&.sp-summary-sector {
				padding-left: 0;
				border-left: 0;
			}

			&:last-child {
				padding-left: 0;
				border-left: 0;
			}
		}

		.sp-summary-label {
			color: #94a3b8;
			font-size: .68rem;
			letter-spacing: .04em;
			text-transform: uppercase;
		}

		.sp-summary-value {
			display: flex;
			align-items: center;
			gap: .35em;
			margin-top: .35em;
			color: #0f172a;
			font-size: .95rem;
			font-weight: 800;
		}

		.sp-summary-title {
			margin-top: .25em;
			color: #020617;
			font-size: 1.4rem;
			font-weight: 900;
		}

		.sp-spacer {
			flex: 1 1 auto;
		}

		.sp-progress-line {
			width: 6em;
			margin-top: .45em;
		}
	}

	.sp-content {
		display: grid;
		gap: 1em;

		.sp-caption {
			color: #94a3b8;
			font-size: .78rem;
			font-weight: 900;
			letter-spacing: .05em;
			text-transform: uppercase;
		}

		.sp-routes {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1em;

			.sp-route {
				display: grid;
				gap: 1.1em;
				min-height: 15.3em;
				padding: 1em;
				cursor: pointer;
				box-shadow: 0 3px 8px rgba(15, 23, 42, .08);
				transition: transform .2s ease, box-shadow .2s ease;

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 18px rgba(15, 23, 42, .12);
				}

				.sp-route-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 1em;

					.sp-route-number {
						display: flex;
						align-items: center;
						gap: .45em;
						color: #2563eb;

						.sp-route-id {
							font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
							font-size: 1rem;
							font-weight: 900;
						}
					}

					.sp-route-date {
						color: #94a3b8;
						font-size: .75rem;
						font-weight: 700;
					}
				}

				.sp-assignees {
					background: #F9FAFB;
					border-radius: 14px;
					padding:.6em .8em;

					.sp-assignee {
						display: flex;
						align-items: center;
						gap: .55em;

						.sp-assignee-name {
							min-width: 0;
							overflow: hidden;
							color: #0f172a;
							font-size: .86rem;
							font-weight: 700;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}

				.sp-route-meta {
					display: flex;
					gap: 1em;

					.sp-route-meta-item {
						display: flex;
						align-items: center;
						gap: .35em;
						color: #334155;
						font-size: .82rem;
						font-weight: 700;
					}
				}

				.sp-streets {
					display: grid;
					gap: .35em;

					.sp-street {
						display: flex;
						justify-content: space-between;
						gap: 1em;
						color: #64748b;
						font-size: .78rem;
						font-weight: 700;
					}
				}

				.sp-route-progress {
					align-self: end;

					.sp-route-progress-header {
						display: flex;
						justify-content: space-between;
						gap: 1em;
						color: #475569;
						font-size: .78rem;
						font-weight: 700;

						.sp-route-progress-count {
							color: #0f172a;
						}

					}
					.animated-progress-line {
						margin-top: .5em;
					}
				}
			}
		}
	}
}
</style>
