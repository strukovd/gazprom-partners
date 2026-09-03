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
					<div class="rp-summary-value">{{ curRoute.progress?.collected ?? 0 }}/{{ curRoute.progress?.total ?? 0 }} ({{ toPercent(curRoute.progress?.collected, curRoute.progress?.total) }}%)</div>
					<BaseProgressBar class="rp-progress-line" :percent="toPercent(curRoute.progress?.collected, curRoute.progress?.total)" height=".55em" color="#2563eb"/>
				</div>
			</BaseIsland>

			<section class="rp-stats">
				<BaseIsland v-for="item of statsData" :key="item.title" class="rp-stat">
					<div :class="['rp-stat-icon', item.color]"><BaseIcon :name="item.icon" size="1.4em"/></div>
					<div class="rp-stat-info"><div class="rp-stat-value">{{ item.value }}<template v-if="item.unit"> {{ item.unit }}<span v-if="item.exponent" class="rp-stat-unit">{{ item.exponent }}</span></template></div><div class="rp-stat-title">{{ item.title }}</div></div>
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
						<div class="rp-street-title"><BaseIcon name="mdi-map-marker-outline" size="1.2em"/>{{ street.street }}</div>
						<div class="rp-street-count">{{ street.progress.total }} в выборке, всего: {{ street.total }}</div>
						<div class="rp-street-stats">
							<span class="rp-street-stat green"><BaseIcon name="mdi-check-circle-outline" size="1em"/>{{ street.progress.collected }}</span>
							<span class="rp-street-stat blue"><BaseIcon name="mdi-fire" size="1em"/>{{ street.gasConsumption }} м³</span>
							<span class="rp-street-stat orange"><BaseIcon name="mdi-clock-outline" size="1em"/>{{ street.progress.total - street.progress.collected }}</span>
						</div>
					</header>
					<BaseTable class="rp-street-table" :columns="subscriberColumns" :rows="street.subscribers" rowKey="account">
						<template #cell.account="{ row }">
							<div class="rp-account">
								<NuxtLink class="rp-account-link" :to="{ path: `/fieldworks/subscribers/${row.account}`, query: { route: routeId, sector: sectorId } }">{{ row.account }}</NuxtLink>
								<span v-if="row.readingSource === 'subscriber'" class="rp-account-badge">Абонент</span>
							</div>
						</template>
						<template #cell.reading="{ row }">
							<BaseTextBox
								v-if="editingReading === row"
								v-model="readingValue"
								class="rp-reading-input"
								type="number"
								autofocus
								button="OK"
								@submit="saveReading(row)"
							/>
							<div v-else-if="row.readingSource === 'subscriber'" class="rp-reading-button subscriber">
								<BaseIcon name="mdi-shield-check-outline" size="1em"/>
								{{ row.reading }}
								<span class="rp-reading-note">абон.</span>
							</div>
							<BaseButton v-else-if="row.readingSource === 'controller'" class="rp-reading-button controller" variant="light" prependIcon="mdi-check-circle-outline" @click="startReading(row)">
								{{ row.reading }}
							</BaseButton>
							<BaseButton v-else class="rp-reading-button empty" variant="secondary" prependIcon="mdi-pencil-outline" @click="startReading(row)">
								Ввести
							</BaseButton>
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
	gasConsumption?: number;
	streets: {
		street: string;
		total: number;
		subscribers: {
			id: number;
			account: string;
			house: string;
			sign: string;
			meterNumber: string;
			power: string;
			model: string;
			sealNumber: string;
			previousReading: string;
			reading: string | null;
			readingSource?: 'controller' | 'subscriber';
			difference: string | number;
			name: string;
			lastPayment: string;
			gasDebt: string;
			gasDebtClass: string;
			penaltyDebt: string;
			phone: string;

		}[];
		progress: { collected: number; total: number };
		gasConsumption: number;
	}[];
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
	{ key: 'id', label: '№', width: '3em' },
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
const editingReading = ref<Route['streets'][number]['subscribers'][number] | null>(null);
const readingValue = ref<string | number>('');

const statsData = computed(() => [
	{ title: 'В выборке', value: curRoute.value.progress?.total ?? 0, icon: 'mdi-account-group-outline', color: 'gray' },
	{ title: 'Собрано', value: curRoute.value.progress?.collected ?? 0, icon: 'mdi-check-circle-outline', color: 'green' },
	{ title: 'Расход газа', value: curRoute.value.gasConsumption ?? 0, unit: 'м', exponent: '3', icon: 'mdi-fire', color: 'blue' },
	{ title: 'Не собрано', value: (curRoute.value.progress?.total ?? 0) - (curRoute.value.progress?.collected ?? 0), icon: 'mdi-clock-outline', color: 'orange' },
]);

const readingFilters = computed(() => [
	{ key: 'all', value: 'Все', badge: curRoute.value.progress?.total ?? 0 },
	{ key: 'collected', value: 'Собрано', badge: curRoute.value.progress?.collected ?? 0 },
	{ key: 'missing', value: 'Не собрано', badge: (curRoute.value.progress?.total ?? 0) - (curRoute.value.progress?.collected ?? 0) },
]);

onMounted(async () => {
	loading.value = true;
	curRoute.value = await fetchRoute();
	loading.value = false;
});

function toPercent(collected = 0, total = 0) {
	if (!total) return 0;
	return Math.min(Math.max(Math.round((collected / total) * 100), 0), 100);
}

function startReading(subscriber: Route['streets'][number]['subscribers'][number]) {
	editingReading.value = subscriber;
	readingValue.value = subscriber.reading ?? '';
}

function saveReading(subscriber: Route['streets'][number]['subscribers'][number]) {
	const reading = String(readingValue.value).trim();
	if (!reading) return;

	subscriber.reading = reading;
	subscriber.readingSource = 'controller';
	subscriber.difference = String(Number(reading) - Number(subscriber.previousReading));
	editingReading.value = null;
	updateRouteStats(curRoute.value);
}

function updateRouteStats(route: Route) {
	for (const street of route.streets) {
		street.progress = street.subscribers.reduce((progress, subscriber) => {
			progress.total++;
			if (subscriber.reading !== '' && subscriber.reading !== null && subscriber.reading !== undefined) progress.collected++;
			return progress;
		}, { collected: 0, total: 0 });
		street.gasConsumption = street.subscribers.reduce((sum, subscriber) => sum + (Number(subscriber.difference) || 0), 0);
	}

	route.progress = route.streets.reduce((progress, street) => {
		progress.collected += street.progress.collected;
		progress.total += street.progress.total;
		return progress;
	}, { collected: 0, total: 0 });
	route.subscribersCount = route.streets.reduce((count, street) => count + street.subscribers.length, 0);
	route.gasConsumption = route.streets.reduce((sum, street) => sum + street.gasConsumption, 0);
}

async function fetchRoute(): Promise<Route> {
	const routesStub: Route = {
		id: `1100802`,
		assignees: [{ id: 1, name: `Некрасова Наталия Михайловна` }],
		date: new Date(),
		streets: [
			{
				street: `ул. ВИШНЕВАЯ`,
				total: 62,
				progress: { collected: 0, total: 0 },
				gasConsumption: 0,
				subscribers: [
					{ id: 1, account: '110100134', house: '1', sign: '5', meterNumber: '2504046729', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22780598', previousReading: '417', reading: '', difference: '', name: 'МУСАБЕКОВ АЛМАЗ', lastPayment: '25.06.2026', gasDebt: '175,99', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 111 222' },
					{ id: 2, account: '110100215', house: '2', sign: '5', meterNumber: '2504052336', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184311', previousReading: '10', reading: '', difference: '', name: 'ЛАНСАРОВ БЕРИК', lastPayment: '18.06.2026', gasDebt: '30,71', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 222 333' },
					{ id: 3, account: '110100304', house: '3', sign: '5', meterNumber: '2504050918', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184334', previousReading: '17', reading: '45', readingSource: 'subscriber', difference: '28', name: 'Сакихова Зульфия Турсуновна', lastPayment: '24.06.2026', gasDebt: '-26,20', gasDebtClass: 'positive', penaltyDebt: '—', phone: '+996 700 333 444' },
					{ id: 4, account: '110100487', house: '4', sign: '5', meterNumber: '2504050887', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184338', previousReading: '104', reading: '', difference: '', name: 'САЛИЕВА НАЗГУЛЬ', lastPayment: '14.07.2026', gasDebt: '913,43', gasDebtClass: 'overdue', penaltyDebt: '—', phone: '+996 700 444 555' },
					{ id: 5, account: '110100568', house: '5', sign: '5', meterNumber: '2504050245', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184335', previousReading: '1', reading: '12', readingSource: 'controller', difference: '11', name: 'МАВАНКУЙ Р И', lastPayment: '—', gasDebt: '—', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 555 666' },
					{ id: 6, account: '110100649', house: '6', sign: '5', meterNumber: '2504052335', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22191337', previousReading: '224', reading: '', difference: '', name: 'Булаева Улбосын Суюмкуловна', lastPayment: '25.02.2026', gasDebt: '23,33', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 666 777' },
					{ id: 7, account: '110100720', house: '7', sign: '5', meterNumber: '2503003668', power: 'G4', model: 'ВК-G4 Elster', sealNumber: '22751020', previousReading: '224', reading: '251', readingSource: 'controller', difference: '27', name: 'НОРБУЗАЕВ ТИЛЕК', lastPayment: '30.05.2026', gasDebt: '1 824,36', gasDebtClass: 'overdue', penaltyDebt: '—', phone: '+996 700 777 888' },
					{ id: 8, account: '110100891', house: '9', sign: '5', meterNumber: '2504003898', power: 'G4', model: 'ВК-G4 Elster', sealNumber: '22184338', previousReading: '186', reading: '', difference: '', name: 'ВУЛГИЗОВ АНВАР', lastPayment: '20.06.2026', gasDebt: '678,82', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 888 999' },
				]
			},
			{
				street: `ул. ТОКТОГУЛА`,
				total: 58,
				progress: { collected: 0, total: 0 },
				gasConsumption: 0,
				subscribers: [
					{ id: 1, account: '110100134', house: '1', sign: '5', meterNumber: '2504046729', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22780598', previousReading: '417', reading: '', difference: '', name: 'МУСАБЕКОВ АЛМАЗ', lastPayment: '25.06.2026', gasDebt: '175,99', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 111 222' },
					{ id: 2, account: '110100215', house: '2', sign: '5', meterNumber: '2504052336', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184311', previousReading: '10', reading: '', difference: '', name: 'ЛАНСАРОВ БЕРИК', lastPayment: '18.06.2026', gasDebt: '30,71', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 222 333' },
					{ id: 3, account: '110100304', house: '3', sign: '5', meterNumber: '2504050918', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184334', previousReading: '17', reading: '45', readingSource: 'subscriber', difference: '28', name: 'Сакихова Зульфия Турсуновна', lastPayment: '24.06.2026', gasDebt: '-26,20', gasDebtClass: 'positive', penaltyDebt: '—', phone: '+996 700 333 444' },
					{ id: 4, account: '110100487', house: '4', sign: '5', meterNumber: '2504050887', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184338', previousReading: '104', reading: '', difference: '', name: 'САЛИЕВА НАЗГУЛЬ', lastPayment: '14.07.2026', gasDebt: '913,43', gasDebtClass: 'overdue', penaltyDebt: '—', phone: '+996 700 444 555' },
					{ id: 5, account: '110100568', house: '5', sign: '5', meterNumber: '2504050245', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22184335', previousReading: '1', reading: '12', readingSource: 'controller', difference: '11', name: 'МАВАНКУЙ Р И', lastPayment: '—', gasDebt: '—', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 555 666' },
					{ id: 6, account: '110100649', house: '6', sign: '5', meterNumber: '2504052335', power: 'G1.6', model: 'Чунчин G1.6', sealNumber: '22191337', previousReading: '224', reading: '', difference: '', name: 'Булаева Улбосын Суюмкуловна', lastPayment: '25.02.2026', gasDebt: '23,33', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 666 777' },
					{ id: 7, account: '110100720', house: '7', sign: '5', meterNumber: '2503003668', power: 'G4', model: 'ВК-G4 Elster', sealNumber: '22751020', previousReading: '224', reading: '251', readingSource: 'controller', difference: '27', name: 'НОРБУЗАЕВ ТИЛЕК', lastPayment: '30.05.2026', gasDebt: '1 824,36', gasDebtClass: 'overdue', penaltyDebt: '—', phone: '+996 700 777 888' },
					{ id: 8, account: '110100891', house: '9', sign: '5', meterNumber: '2504003898', power: 'G4', model: 'ВК-G4 Elster', sealNumber: '22184338', previousReading: '186', reading: '', difference: '', name: 'ВУЛГИЗОВ АНВАР', lastPayment: '20.06.2026', gasDebt: '678,82', gasDebtClass: '', penaltyDebt: '—', phone: '+996 700 888 999' },
				]
			},
			{
				street: `мкр. КУЗНЕЦОВСКИй`,
				total: 52,
				progress: { collected: 0, total: 0 },
				gasConsumption: 0,
				subscribers: []
			},
			{
				street: `ул. КОРОЛЕВА`,
				total: 45,
				progress: { collected: 0, total: 0 },
				gasConsumption: 0,
				subscribers: []
			}
		],
		progress: { collected: 0, total: 0 },
		// status: `В работе`, // collected - новый, > 1 - в работе, = total - выполнено
	};

	updateRouteStats(routesStub);

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
					&:has(.rp-account-badge) {
						background: #f7f4ff;
					}

					&:hover {
						background: #f8fbff;
					}

					&:has(.rp-account-badge):hover {
						background: #f1ecff;
					}
				}
			}

			.rp-account {
				display: flex;
				align-items: center;
				gap: .45em;

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

				.rp-account-badge {
					padding: .25em .55em;
					border: 1px solid #ddd6fe;
					border-radius: 1em;
					color: #7c3aed;
					background: #f5f3ff;
					font-size: .78em;
					font-weight: 800;
				}
			}

			.rp-reading-button {
				display: inline-flex;
				align-items: center;
				gap: .35em;
				justify-content: center;
				width: 100%;
				min-width: 7em;
				padding: .45em .65em;
				font-size: .9em;
				font-weight: 800;

				&.empty {
					border-color: #cbd5e1;
					border-style: dashed;
					color: #64748b;
					background: #ffffff;
				}

				&.controller {
					color: #2563eb;
					background: #eff6ff;
					border-color: #bfdbfe;
				}

				&.subscriber {
					border: 1px solid #ddd6fe;
					border-radius: 7px;
					color: #7c3aed;
					background: #f5f3ff;
				}

				.rp-reading-note {
					font-size: .78em;
					font-weight: 700;
					opacity: .7;
				}
			}

			.rp-reading-input {
				width: 100%;
				min-width: 7em;

				.text-box-area {
					padding: 0 .25em;

					.base-button {
						padding: .35em .55em;
					}
				}
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
