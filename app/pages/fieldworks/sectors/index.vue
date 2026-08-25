<template>
	<section id="sectors-page">
		<main class="page-blocks">
			<section class="sp-stats">
				<BaseIsland v-for="item of statsData" :key="item.id" class="sp-stat">
					<div :class="['sp-stat-icon', item.color]">
						<BaseIcon :name="item.icon" size="1.35em"/>
					</div>
					<div class="sp-stat-info">
						<div class="sp-stat-value"><Incrementator :value="item.value"/></div>
						<div class="sp-stat-title">{{ item.title }}</div>
					</div>
				</BaseIsland>
			</section>

			<section class="sp-caption">
				<span class="sp-caption-text">Участки</span>
				<span class="sp-caption-date">25.05.2026</span>
			</section>

			<section class="sp-sectors">
				<BaseIsland class="sp-sector" v-for="item of sectors" :key="item.id">
					<header class="sp-sector-header">
						<div class="sp-sector-title">
							<div class="sp-title-line">
								<BaseIcon name="mdi-layers-outline" size="1.1em"/>
								<span class="sp-title-text">Участок №{{ item.id }}</span>
							</div>
							<div class="sp-area-line">
								<BaseIcon name="mdi-city-variant-outline" size="1em"/>
								<span class="sp-area-text">{{ item.district }}</span>
							</div>
						</div>
						<div class="sp-badge">{{ item.status }}</div>
					</header>

					<div class="sp-assignees">
						<div v-for="assignee of item.assignees" :key="assignee.id" class="sp-assignee">
							<Avatar :name="assignee.name" size="2em"/>
							<span class="sp-assignee-name">{{ assignee.name }}</span>
						</div>
					</div>

					<div class="sp-progress">
						<div class="sp-progress-header">
							<span class="sp-progress-title">Общий прогресс</span>
							<span class="sp-progress-count">{{ item.progress.collected }}/{{ item.progress.total }}</span>
						</div>
						<BaseProgressBar :percent="toPercent(item.progress.collected, item.progress.total)" height=".5em" color="#2563eb"/>
						<div class="sp-progress-percent">{{ toPercent(item.progress.collected, item.progress.total) }}%</div>
					</div>

					<div class="sp-routes">
						<span v-for="route of item.routes" :key="route.id" class="sp-route">{{ route.id }}</span>
					</div>

					<div class="sp-totals">
						<div class="sp-total routes">
							<div class="sp-total-value">{{ item.routes.length }}</div>
							<div class="sp-total-title">Маршрутов</div>
						</div>
						<div class="sp-total collected">
							<div class="sp-total-value">{{ item.progress.collected }}</div>
							<div class="sp-total-title">Собрано</div>
						</div>
						<div class="sp-total missing">
							<div class="sp-total-value">{{ item.progress.total - item.progress.collected }}</div>
							<div class="sp-total-title">Не собрано</div>
						</div>
					</div>

					<BaseButton class="sp-route-button" prependIcon="mdi-transit-connection-variant" @click="openSector(item.id)">Маршруты участка</BaseButton>
				</BaseIsland>
			</section>
		</main>
	</section>
</template>

<script lang="ts" setup>
import Avatar from '~/components/common/Avatar.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseProgressBar from '~/components/common/base/charts/BaseProgressBar.vue';
import Incrementator from '~/components/common/Incrementator.vue';

type Sector = {
	id: number;
	district: string;
	status: 'Новый' | 'В работе' | 'Выполнено';
	assignees: Array<{ id: number; name: string }>;
	routes: Array<{ id: string; progress: { collected: number; total: number } }>;
	progress: { collected: number; total: number };
};

const loading = ref(false);
const sectors = ref<Sector[]>([]);

onMounted(async () => {
	loading.value = true;
	sectors.value = await fetchSectors();
	loading.value = false;
});

const statsData = computed(() => {
	const totalSectors = sectors.value.length;
	const totalRoutes = sectors.value.reduce((acc, item) => acc + item.routes.length, 0);
	const totalCollected = sectors.value.reduce((acc, item) => acc + item.progress.collected, 0);
	const totalMissing = sectors.value.reduce((acc, item) => acc + (item.progress.total - item.progress.collected), 0);

	return [
		{ id: 1, title: 'Участков', value: totalSectors, icon: 'mdi-layers-triple-outline', color: 'violet' },
		{ id: 2, title: 'Маршрутов', value: totalRoutes, icon: 'mdi-transit-connection-variant', color: 'blue' },
		{ id: 3, title: 'Собрано', value: totalCollected, icon: 'mdi-check-circle-outline', color: 'green' },
		{ id: 4, title: 'Не собрано', value: totalMissing, icon: 'mdi-clock-outline', color: 'orange' },
	];
});

function openSector(id: number) {
	navigateTo(`/fieldworks/sectors/${id}`);
}

function toPercent(progress = 0, total = 0) {
	if (!total) return 0;
	const percent = (progress / total) * 100;
	return Math.min(Math.max(Math.round(percent), 0), 100);
}

async function fetchSectors(): Promise<Sector[]> {
	const sectorsStub: Sector[] = [
		{
			id: 1,
			district: `Свердловский р-н`,
			assignees: [{ id: 1, name: `Некрасова Наталия Михайловна` }, { id: 2, name: `Асанов Тимур Бакытбекович` }],
			routes: [{ id: `1100802`, progress: { collected: 10, total: 21 } }, { id: `1100803`, progress: { collected: 0, total: 12 } }],
			// ниже поля можно вычислить на основе тех что выше.
			progress: { collected: 10, total: 33 }, // суммарый прогресс из routes
			status: `В работе`, // collected - новый, > 1 - в работе, = total - выполнено
		},
		{
			id: 2,
			district: `Октябрьский р-н`,
			assignees: [{ id: 1, name: `Джумабеков Азат Сейитович` }, { id: 2, name: `Рысбекова Гульмира Абдукаримовна` }],
			routes: [{ id: `1100804`, progress: { collected: 9, total: 9 } }, { id: `1100805`, progress: { collected: 10, total: 15 } }],
			status: `В работе`,
			progress: { collected: 19, total: 24 },
		},
		{
			id: 3,
			district: `Первомайский р-н`,
			assignees: [{ id: 1, name: `Токтоматтов Санжар Элибекович` }],
			routes: [{ id: `1100806`, progress: { collected: 0, total: 10 } }],
			status: `Новый`,
			progress: { collected: 0, total: 10 },
		}
	];

	return new Promise(resolve => setTimeout(() => resolve(sectorsStub), 1000));
}
</script>

<style lang="scss">
#sectors-page {
	.page-blocks {
		display: grid;
		gap: 1.4em;
		margin: 1em 0;
	}

	.sp-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1em;

		.sp-stat {
			display: flex;
			align-items: center;
			gap: 1em;
			min-height: 5em;
			overflow: hidden;
			border-color: #dbe3ee;
			box-shadow: 0 5px 14px rgba(15, 23, 42, .08);

			.sp-stat-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 3em;
				height: 3em;
				border-radius: 50%;

				&.violet {
					color: #9333ea;
					background: #f3e8ff;
				}

				&.blue {
					color: #2563eb;
					background: #dbeafe;
				}

				&.green {
					color: #16a34a;
					background: #dcfce7;
				}

				&.orange {
					color: #f97316;
					background: #ffedd5;
				}
			}

			.sp-stat-info {
				.sp-stat-value {
					color: #020617;
					font-size: 1.55rem;
					font-weight: 900;
					line-height: 1;
				}

				.sp-stat-title {
					margin-top: .45em;
					color: #475569;
					font-size: .82rem;
					font-weight: 600;
				}
			}
		}
	}

	.sp-caption {
		display: flex;
		align-items: center;
		gap: .45em;
		color: #94a3b8;
		font-size: .88rem;
		font-weight: 900;
		letter-spacing: .04em;
		text-transform: uppercase;

		.sp-caption-date {
			color: #64748b;
		}
	}

	.sp-sectors {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1em;

		.sp-sector {
			display: grid;
			gap: 1.15em;
			overflow: hidden;
			border-color: #dbe3ee;
			border-top: 6px solid #cbd5e1;
			box-shadow: 0 6px 18px rgba(15, 23, 42, .08);

			&.active {
				border-top-color: #2563eb;
			}

			.sp-sector-header {
				display: flex;
				justify-content: space-between;
				gap: 1em;

				.sp-sector-title {
					min-width: 0;

					.sp-title-line {
						display: flex;
						align-items: center;
						gap: .35em;
						color: #2563eb;

						.sp-title-text {
							color: #020617;
							font-size: 1.2rem;
							font-weight: 900;
						}
					}

					.sp-area-line {
						display: flex;
						align-items: center;
						gap: .35em;
						margin-top: .45em;
						color: #94a3b8;
						font-size: .82rem;
						font-weight: 700;
					}
				}

				.sp-badge {
					align-self: flex-start;
					padding: .45em .75em;
					border-radius: 999px;
					font-size: .78rem;
					font-weight: 800;
					white-space: nowrap;

					&.work {
						color: #2563eb;
						background: #dbeafe;
					}

					&.new {
						color: #64748b;
						background: #f1f5f9;
					}
				}
			}

			.sp-assignees {
				display: grid;
				gap: .55em;
				min-height: 5.4em;
				padding: .9em;
				background: #f8fafc;
				border-radius: 14px;

				.sp-assignee {
					display: flex;
					align-items: center;
					gap: .65em;
					min-width: 0;

					.sp-assignee-name {
						overflow: hidden;
						color: #0f172a;
						font-size: .9rem;
						font-weight: 700;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}

			.sp-progress {
				.sp-progress-header {
					display: flex;
					justify-content: space-between;
					gap: 1em;
					color: #475569;
					font-size: .82rem;
					font-weight: 700;

					.sp-progress-count {
						color: #020617;
						font-weight: 900;
					}
				}

				.animated-progress-line {
					margin-top: .65em;
				}

				.sp-progress-percent {
					margin-top: .35em;
					color: #94a3b8;
					font-size: .78rem;
					font-weight: 700;
					text-align: right;
				}
			}

			.sp-routes {
				display: flex;
				flex-wrap: wrap;
				gap: .45em;

				.sp-route {
					padding: .45em .75em;
					color: #64748b;
					background: #f1f5f9;
					border-radius: 10px;
					font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
					font-size: .82rem;
					font-weight: 900;

					&.active {
						color: #2563eb;
						background: #dbeafe;
					}

					&.success {
						color: #16a34a;
						background: #dcfce7;
					}
				}
			}

			.sp-totals {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: .7em;

				.sp-total {
					padding: .8em .6em;
					border-radius: 14px;
					text-align: center;

					.sp-total-value {
						color: #020617;
						font-size: 1.05rem;
						font-weight: 900;
					}

					.sp-total-title {
						margin-top: .35em;
						font-size: .72rem;
						font-weight: 700;
					}

					&.routes {
						background: #f8fafc;

						.sp-total-title {
							color: #64748b;
						}
					}

					&.collected {
						background: #ecfdf5;

						.sp-total-value,
						.sp-total-title {
							color: #16a34a;
						}
					}

					&.missing {
						background: #fff7ed;

						.sp-total-value,
						.sp-total-title {
							color: #ea580c;
						}
					}
				}
			}

			.sp-route-button {
				justify-content: center;
				width: 100%;
				min-height: 3.1em;
				font-size: 1rem;
				border-radius: 12px;
			}
		}
	}
}
</style>
