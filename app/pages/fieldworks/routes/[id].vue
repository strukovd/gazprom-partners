<template>
	<section id="route-page">
		<main class="page-blocks">
			<section class="rp-heading">
				<h1 class="rp-title">Полевые работы</h1>
				<p class="rp-description">Управление задачами и сбор показаний приборов учета</p>
			</section>

			<BaseTabs :model-value="2" :items="[{ key: 1, value: 'Задачи на сегодня', icon: 'mdi-calendar-today' }, { key: 2, value: 'Отправка показаний', icon: 'mdi-gauge', badge: 38, }]"/>
			<BaseBreadcrumbs :breadcrumbs="breadcrumbs"/>

			<BaseIsland class="rp-summary">
				<div class="rp-summary-icon"><BaseIcon name="mdi-transit-connection-variant" size="1.65em"/></div>
				<div class="rp-summary-item rp-summary-route">
					<div class="rp-summary-label">Маршрут</div>
					<div class="rp-summary-value rp-route-id">{{ routeId }}</div>
				</div>
				<div class="rp-summary-item">
					<div class="rp-summary-label">Дата</div>
					<div class="rp-summary-value">{{ toLocaleDate(curRoute.date) }}</div>
				</div>
				<div class="rp-summary-item">
					<div class="rp-summary-label">Исполнитель</div>
					<div v-if="curRoute.assignees?.length === 0" class="rp-summary-value"><BaseIcon name="mdi-account-outline" size="1em"/>Не назначен</div>
					<template v-else>
						<div v-for="assignee in curRoute.assignees" class="rp-summary-value"><BaseIcon name="mdi-account-outline" size="1em"/>{{ assignee.name }}</div>
					</template>
				</div>
				<div class="rp-summary-item">
					<div class="rp-summary-label">Абонентов</div>
					<div class="rp-summary-value">{{ curRoute.subscribersCount ?? 0 }}</div>
				</div>
				<div class="rp-spacer"></div>
				<div class="rp-summary-item">
					<div class="rp-summary-label">Прогресс</div>
					<div class="rp-summary-value">10/21 (48%)</div>
					<BaseProgressBar class="rp-progress-line" :percent="48" height=".55em" color="#2563eb"/>
				</div>
			</BaseIsland>

			<section class="rp-stats">
				<BaseIsland class="rp-stat">
					<div class="rp-stat-icon gray"><BaseIcon name="mdi-account-group-outline" size="1.4em"/></div>
					<div class="rp-stat-info"><div class="rp-stat-value">21</div><div class="rp-stat-title">В выборке</div></div>
				</BaseIsland>
				<BaseIsland class="rp-stat">
					<div class="rp-stat-icon green"><BaseIcon name="mdi-check-circle-outline" size="1.4em"/></div>
					<div class="rp-stat-info"><div class="rp-stat-value">10</div><div class="rp-stat-title">Собрано</div></div>
				</BaseIsland>
				<BaseIsland class="rp-stat">
					<div class="rp-stat-icon blue"><BaseIcon name="mdi-fire" size="1.4em"/></div>
					<div class="rp-stat-info"><div class="rp-stat-value">212 м<span class="rp-stat-unit">3</span></div><div class="rp-stat-title">Расход газа</div></div>
				</BaseIsland>
				<BaseIsland class="rp-stat">
					<div class="rp-stat-icon orange"><BaseIcon name="mdi-clock-outline" size="1.4em"/></div>
					<div class="rp-stat-info"><div class="rp-stat-value">11</div><div class="rp-stat-title">Не собрано</div></div>
				</BaseIsland>
			</section>

			<InfoBox
				type="info"
				title="Ввод показаний"
				message="Метод 1: нажмите на лицевой счет, чтобы открыть карточку абонента и ввести показание там. Метод 2: нажмите «Ввести» в столбце Показ. для быстрого ввода без перехода."
			/>

			<BaseIsland class="rp-filter">
				<BaseTabs v-model="filter" :items="[
					{ key: 'all', value: 'Все', badge: 21 },
					{ key: 'collected', value: 'Собрано', badge: 10 },
					{ key: 'missing', value: 'Не собрано', badge: 11 },
				]"/>
				<div class="rp-filter-controls">
					<BaseTextBox v-model="search" prependIcon="mdi-magnify" placeholder="Поиск по абоненту, Л/с, адресу, модели, № счётчика..."/>
					<BaseAutocomplete v-model="model" :items="[
						{ key: 'all', value: 'Все' },
						{ key: 'mechanical', value: 'Механические' },
						{ key: 'smart', value: 'Умные' },
					]" emitValue placeholder="Все"/>
				</div>
			</BaseIsland>

			<template v-for="street of curRoute.streets" :key="street.street">
				<BaseIsland class="rp-street">
					<header class="rp-street-header">
						<div class="rp-street-title"><BaseIcon name="mdi-map-marker-outline" size="1.2em"/>ул. ВИШНЕВАЯ</div>
						<div class="rp-street-count">8 в выборке, всего: 62</div>
						<div class="rp-street-stats">
							<span class="rp-street-stat green"><BaseIcon name="mdi-check-circle-outline" size="1em"/>3</span>
							<span class="rp-street-stat blue"><BaseIcon name="mdi-fire" size="1em"/>66 м³</span>
							<span class="rp-street-stat orange"><BaseIcon name="mdi-clock-outline" size="1em"/>5</span>
						</div>
					</header>
					<BaseTable class="rp-street-table" :columns="subscriberColumns" :rows="street.subscribers" rowKey="account">
						<template #cell.account="{ row }">
							<NuxtLink class="rp-account-link" :to="`/profile/${row.account}`">{{ row.account }}</NuxtLink>
						</template>
						<template #cell.reading="{ row }">
							<BaseButton v-if="row.reading" class="rp-reading-button" variant="light" prependIcon="mdi-check-circle-outline">{{ row.reading }}</BaseButton>
							<BaseButton v-else class="rp-reading-button" variant="secondary" prependIcon="mdi-pencil-outline">Ввести</BaseButton>
						</template>
						<template #cell.difference="{ row }">
							<span :class="['rp-difference', { hot: row.difference }]">
								<BaseIcon v-if="row.difference" name="mdi-fire" size="1em"/>
								{{ row.difference || '—' }}
							</span>
						</template>
						<template #cell.gasDebt="{ row }">
							<span :class="['rp-debt', row.gasDebtClass]">{{ row.gasDebt }}</span>
						</template>
					</BaseTable>
				</BaseIsland>
			</template>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseAutocomplete from '~/components/common/base/BaseAutocomplete.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import BaseProgressBar from '~/components/common/base/charts/BaseProgressBar.vue';
import BaseTable from '~/components/common/base/BaseTable.vue';
import InfoBox from '~/components/common/InfoBox.vue';
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import { toLocaleDate } from '~/utils/format';

type Route = {
	id: string;
	assignees: { id: number; name: string }[];
	date: Date | string;
	subscribersCount?: number;
	streets: { street: string; subscribers: any[] }[];
	progress: { collected: number; total: number };

	// district: string;
	// progress?: { collected: number; total: number };
	// status?: string;
};

const route = useRoute();
const routeId = computed(() => route.params.id);
const sectorId = computed(() => typeof route.query.sector === 'string' ? route.query.sector : '');
const breadcrumbs = computed(() => sectorId.value
	? [
		{ title: 'Участки', link: '/fieldworks/sectors' },
		{ title: `Участок №${sectorId.value}`, link: `/fieldworks/sectors/${sectorId.value}` },
		{ title: `Маршрут ${routeId.value}`, disabled: true },
	]
	: [
		{ title: 'Маршруты', link: '/fieldworks/routes' },
		{ title: `Маршрут ${routeId.value}`, disabled: true },
	]
);
const filter = ref('all');
const search = ref('');
const model = ref('all');

const subscriberColumns = [
	{ key: 'number', label: '№', width: '3em' },
	{ key: 'account', label: 'Лицевой счёт', width: '9em' },
	{ key: 'house', label: 'Дом', width: '4em' },
	{ key: 'sign', label: 'Зн.', width: '3em' },
	{ key: 'meterNumber', label: 'Номер счётчика', width: '8em' },
	{ key: 'power', label: 'Мощ-ть', width: '5em' },
	{ key: 'model', label: 'Модель', width: '8em' },
	{ key: 'sealNumber', label: '№ пломбы', width: '7em' },
	{ key: 'previousReading', label: 'Пред.пок.', width: '6em' },
	{ key: 'reading', label: 'Показ. (метод 2)', width: '10em' },
	{ key: 'difference', label: 'Раз.', width: '5em' },
	{ key: 'name', label: 'Ф.И.О.', width: '14em' },
	{ key: 'lastPayment', label: 'Посл.опл.', width: '7em' },
	{ key: 'gasDebt', label: 'Деб. Газ', width: '7em' },
	{ key: 'penaltyDebt', label: 'Деб. Пеня', width: '7em' },
	{ key: 'phone', label: 'Телефон', width: '9em' },
];

const loading = ref(true);
const curRoute = ref<Route>({} as Route);

onMounted(async () => {
	loading.value = true;
	curRoute.value = await fetchRoute();
	loading.value = false;
});

async function fetchRoute(): Promise<Route> {
	const routesStub: Route = {
		id: `1100802`,
		assignees: [{ id: 1, name: `Некрасова Наталия Михайловна` }],
		date: new Date(),
		streets: [
			{
				street: `ул. ВИШНЕВАЯ`,
				subscribers: [
					{ number: 1, account: '110100134', house: '1', sign: '5', meterNumber: '2504046729', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22780598', previousReading: '417', reading: '', difference: '', name: 'МУСАБЕКОВ АЛМАЗ', lastPayment: '25.06.2026', gasDebt: '175,99', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 111 222' },
					{ number: 2, account: '110100215', house: '2', sign: '5', meterNumber: '2504052336', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184311', previousReading: '10', reading: '', difference: '', name: 'ЛАНСАРОВ БЕРИК', lastPayment: '18.06.2026', gasDebt: '30,71', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 222 333' },
					{ number: 3, account: '110100304', house: '3', sign: '5', meterNumber: '2504050918', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184334', previousReading: '17', reading: '45', difference: '28', name: 'Сакихова Зульфия Турсуновна', lastPayment: '24.06.2026', gasDebt: '-26,20', gasDebtClass: 'positive', penaltyDebt: '—', phone: '+996 700 333 444' },
					{ number: 4, account: '110100487', house: '4', sign: '5', meterNumber: '2504050887', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184338', previousReading: '104', reading: '', difference: '', name: 'САЛИЕВА НАЗГУЛЬ', lastPayment: '14.07.2026', gasDebt: '913,43', gasDebtClass: 'overdue', penaltyDebt: '—', phone: '+996 700 444 555' },
					{ number: 5, account: '110100568', house: '5', sign: '5', meterNumber: '2504050245', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184335', previousReading: '1', reading: '12', difference: '11', name: 'МАВАНКУЙ Р И', lastPayment: '—', gasDebt: '—', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 555 666' },
					{ number: 6, account: '110100649', house: '6', sign: '5', meterNumber: '2504052335', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22191337', previousReading: '224', reading: '', difference: '', name: 'Булаева Улбосын Суюмкуловна', lastPayment: '25.02.2026', gasDebt: '23,33', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 666 777' },
					{ number: 7, account: '110100720', house: '7', sign: '5', meterNumber: '2503003668', power: 'G4', model: 'ВК-G4 Elster', sealNumber: '22751020', previousReading: '224', reading: '251', difference: '27', name: 'НОРБУЗАЕВ ТИЛЕК', lastPayment: '30.05.2026', gasDebt: '1 824,36', gasDebtClass: 'overdue', penaltyDebt: '—', phone: '+996 700 777 888' },
					{ number: 8, account: '110100891', house: '9', sign: '5', meterNumber: '2504003898', power: 'G4', model: 'ВК-G4 Elster', sealNumber: '22184338', previousReading: '186', reading: '', difference: '', name: 'ВУЛГИЗОВ АНВАР', lastPayment: '20.06.2026', gasDebt: '678,82', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 888 999' },
				]
			},
			{
				street: `ул. ТОКТОГУЛА`,
				subscribers: [
					{ number: 1, account: '110100134', house: '1', sign: '5', meterNumber: '2504046729', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22780598', previousReading: '417', reading: '', difference: '', name: 'МУСАБЕКОВ АЛМАЗ', lastPayment: '25.06.2026', gasDebt: '175,99', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 111 222' },
					{ number: 2, account: '110100215', house: '2', sign: '5', meterNumber: '2504052336', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184311', previousReading: '10', reading: '', difference: '', name: 'ЛАНСАРОВ БЕРИК', lastPayment: '18.06.2026', gasDebt: '30,71', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 222 333' },
					{ number: 3, account: '110100304', house: '3', sign: '5', meterNumber: '2504050918', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184334', previousReading: '17', reading: '45', difference: '28', name: 'Сакихова Зульфия Турсуновна', lastPayment: '24.06.2026', gasDebt: '-26,20', gasDebtClass: 'positive', penaltyDebt: '—', phone: '+996 700 333 444' },
					{ number: 4, account: '110100487', house: '4', sign: '5', meterNumber: '2504050887', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184338', previousReading: '104', reading: '', difference: '', name: 'САЛИЕВА НАЗГУЛЬ', lastPayment: '14.07.2026', gasDebt: '913,43', gasDebtClass: 'overdue', penaltyDebt: '—', phone: '+996 700 444 555' },
					{ number: 5, account: '110100568', house: '5', sign: '5', meterNumber: '2504050245', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184335', previousReading: '1', reading: '12', difference: '11', name: 'МАВАНКУЙ Р И', lastPayment: '—', gasDebt: '—', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 555 666' },
					{ number: 6, account: '110100649', house: '6', sign: '5', meterNumber: '2504052335', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22191337', previousReading: '224', reading: '', difference: '', name: 'Булаева Улбосын Суюмкуловна', lastPayment: '25.02.2026', gasDebt: '23,33', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 666 777' },
					{ number: 7, account: '110100720', house: '7', sign: '5', meterNumber: '2503003668', power: 'G4', model: 'ВК-G4 Elster', sealNumber: '22751020', previousReading: '224', reading: '251', difference: '27', name: 'НОРБУЗАЕВ ТИЛЕК', lastPayment: '30.05.2026', gasDebt: '1 824,36', gasDebtClass: 'overdue', penaltyDebt: '—', phone: '+996 700 777 888' },
					{ number: 8, account: '110100891', house: '9', sign: '5', meterNumber: '2504003898', power: 'G4', model: 'ВК-G4 Elster', sealNumber: '22184338', previousReading: '186', reading: '', difference: '', name: 'ВУЛГИЗОВ АНВАР', lastPayment: '20.06.2026', gasDebt: '678,82', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 888 999' },
				]
			},
			{
				street: `мкр. КУЗНЕЦОВСКИй`,
				subscribers: []
			},
			{
				street: `ул. КОРОЛЕВА`,
				subscribers: []
			}
		],
		progress: { collected: 10, total: 21 },
		// status: `В работе`, // collected - новый, > 1 - в работе, = total - выполнено
	};

	// количество абонентов всех улиц в маршруте
	routesStub.subscribersCount = routesStub.streets.reduce((acc, street) => acc + street.subscribers.length, 0);

	return new Promise(resolve => setTimeout(() => resolve(routesStub), 1000));
}
</script>

<style lang="scss">
#route-page {
	.page-blocks {
		display: grid;
		gap: 1.35em;
		margin: 1em 0;
	}

	.rp-heading {
		.rp-title {
			margin: 0;
			color: #020617;
			font-size: 1.8rem;
			font-weight: 900;
		}

		.rp-description {
			margin: .35em 0 0;
			color: #475569;
			font-size: 1rem;
		}
	}

	.rp-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2em;

		.rp-summary-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2.6em;
			height: 2.6em;
			aspect-ratio: 1 / 1;
			color: #ffffff;
			background: #2563eb;
			border-radius: .7em;
		}

		.rp-summary-item {
			padding-left: 1.4em;
			border-left: 1px solid #dbe3ee;

			&.rp-summary-route {
				padding-left: 0;
				border-left: 0;
			}

			&:last-child {
				padding-left: 0;
				border-left: 0;
			}
		}

		.rp-summary-label {
			color: #94a3b8;
			font-size: .68rem;
			letter-spacing: .04em;
			text-transform: uppercase;
		}

		.rp-summary-value {
			display: flex;
			align-items: center;
			gap: .35em;
			margin-top: .35em;
			color: #0f172a;
			font-size: .95rem;
			font-weight: 800;

			&.rp-route-id {
				color: #2563eb;
				font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
				font-size: 1.2rem;
			}
		}

		.rp-spacer {
			flex: 1 1 auto;
		}

		.rp-progress-line {
			width: 6em;
			margin-top: .45em;
		}
	}

	.rp-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1em;

		.rp-stat {
			display: flex;
			align-items: center;
			gap: 1em;
			min-height: 4.8em;

			.rp-stat-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 2.5em;
				height: 2.5em;
				border-radius: 50%;

				&.gray {
					color: #475569;
					background: #f1f5f9;
				}

				&.green {
					color: #16a34a;
					background: #dcfce7;
				}

				&.blue {
					color: #2563eb;
					background: #dbeafe;
				}

				&.orange {
					color: #f97316;
					background: #ffedd5;
				}
			}

			.rp-stat-value {
				color: #020617;
				font-size: 1.35rem;
				font-weight: 900;

				.rp-stat-unit {
					vertical-align: super;
					font-size: .6em;
				}
			}

			.rp-stat-title {
				margin-top: .25em;
				color: #64748b;
				font-size: .76rem;
				font-weight: 700;
			}
		}
	}

	.rp-filter {
		.rp-filter-controls {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 11em;
			gap: .8em;
		}
	}

	.rp-street {
		padding: 0;

		.rp-street-header {
			display: flex;
			align-items: center;
			gap: .8em;
			padding: .85em 1.2em;

			.rp-street-title {
				display: flex;
				align-items: center;
				gap: .45em;
				color: #0f172a;
				font-size: 1rem;
				font-weight: 900;
			}

			.rp-street-count {
				color: #94a3b8;
				font-size: .78rem;
				// font-weight: 700;
			}

			.rp-street-stats {
				display: flex;
				align-items: center;
				gap: .5em;
				margin-left: auto;

				.rp-street-stat {
					display: inline-flex;
					align-items: center;
					gap: .3em;
					padding: .45em .7em;
					border-radius: 999px;
					font-size: .76rem;
					font-weight: 800;

					&.green {
						color: #16a34a;
						background: #ecfdf5;
					}

					&.blue {
						color: #2563eb;
						background: #eff6ff;
					}

					&.orange {
						color: #ea580c;
						background: #fff7ed;
					}
				}
			}
		}

		.rp-street-table {
			.base-table {
				min-width: 120em;
				font-size: .78rem;

				.base-table__cell {
					padding: .7em .8em;
					border-right: 1px solid #eef2f7;

					&--head {
						color: #ffffff;
						background: #2563eb;
						border-color: rgba(255, 255, 255, .16);
						font-size: .92em;
					}
				}

				.base-table-row {
					&:hover {
						background: #f8fbff;
					}
				}
			}

			.rp-account-link {
				color: #2563eb;
				font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
				font-size: 1.1em;
				font-weight: 900;
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
			}

			.rp-reading-button {
				justify-content: center;
				width: 100%;
				min-width: 7em;
				padding: .45em .65em;
				font-size: .9em;
			}

			.rp-difference {
				display: inline-flex;
				align-items: center;
				gap: .25em;
				color: #94a3b8;
				font-weight: 700;

				&.hot {
					color: #2563eb;
				}
			}

			.rp-debt {
				color: #334155;
				font-weight: 800;

				&.positive {
					color: #16a34a;
				}

				&.overdue {
					color: #ea580c;
				}
			}
		}
	}
}
</style>
