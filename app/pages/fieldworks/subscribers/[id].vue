<template>
	<section id="subscriber-page">
		<main class="page-blocks">
			<NuxtLink class="sb-back" :to="backLink"><BaseIcon name="mdi-arrow-left" size="1.2em"/>Назад к реестру</NuxtLink>

			<template v-if="loading">
				<BaseIsland class="sb-skeleton"><BaseSkeleton width="55%" height="3.5em"/></BaseIsland>
				<section class="sb-details"><BaseIsland><BaseSkeleton height="12em"/></BaseIsland><BaseIsland><BaseSkeleton height="12em"/></BaseIsland></section>
				<BaseIsland class="sb-skeleton"><BaseSkeleton height="15em"/></BaseIsland>
			</template>

			<template v-else>
				<BaseIsland class="sb-header">
					<div class="sb-profile">
						<Avatar :name="subscriber.name" size="3em"/>
						<div class="sb-profile-content">
							<div class="sb-name">{{ subscriber.name }}</div>
							<div class="sb-meta"><span class="sb-account">Л/с {{ subscriber.account }}</span><span class="sb-address"><BaseIcon name="mdi-map-marker-outline" size="1em"/>{{ subscriber.address }}</span></div>
						</div>
					</div>
					<div class="sb-contact">
						<div :class="['sb-status', subscriber.readingSource]"><BaseIcon :name="readingStatus.icon" size="1em"/>{{ readingStatus.label }}</div>
						<a class="sb-phone" :href="`tel:${subscriber.phone}`"><BaseIcon name="mdi-phone-outline" size="1em"/>{{ subscriber.phone }}</a>
					</div>
				</BaseIsland>

				<section class="sb-details">
					<BaseIsland class="sb-card">
						<div class="sb-card-title"><BaseIcon name="mdi-gauge" size="1.35em"/>Данные счётчика</div>
						<div class="sb-data"><span class="sb-label">Номер счётчика</span><span class="sb-value">{{ subscriber.meterNumber }}</span></div>
						<div class="sb-data"><span class="sb-label">Модель</span><span class="sb-value">{{ subscriber.meterModel }}</span></div>
						<div class="sb-data"><span class="sb-label">Мощность</span><span class="sb-value">{{ subscriber.power }}</span></div>
						<div class="sb-data"><span class="sb-label">№ пломбы</span><span class="sb-value">{{ subscriber.sealNumber }}</span></div>
						<div class="sb-data"><span class="sb-label">Знак</span><span class="sb-value">{{ subscriber.sign }}</span></div>
					</BaseIsland>

					<BaseIsland class="sb-card">
						<div class="sb-card-title"><BaseIcon name="mdi-wallet-outline" size="1.35em"/>Финансы</div>
						<div class="sb-data"><span class="sb-label">Последняя оплата</span><span class="sb-value">{{ subscriber.lastPayment }}</span></div>
						<div class="sb-data"><span class="sb-label">Сальдо - Газ</span><span :class="['sb-value', subscriber.gasBalanceClass]">{{ subscriber.gasBalance }}</span></div>
						<div class="sb-data"><span class="sb-label">Сальдо - Пеня</span><span :class="['sb-value', subscriber.penaltyBalanceClass]">{{ subscriber.penaltyBalance }}</span></div>
						<div class="sb-data"><span class="sb-label">Пред. показание</span><span class="sb-value">{{ subscriber.previousReading }} м³</span></div>
						<div v-if="subscriber.currentReading !== null" class="sb-data"><span class="sb-label">Тек. показание</span><span class="sb-value green">{{ subscriber.currentReading }} м³</span></div>
					</BaseIsland>
				</section>

				<BaseIsland :class="['sb-reading', subscriber.readingSource]">
					<div class="sb-reading-heading">
						<div class="sb-reading-title"><BaseIcon :name="readingStatus.icon" size="1.35em"/>{{ readingStatus.heading }}</div>
						<div class="sb-reading-description">{{ readingStatus.description }}</div>
					</div>

					<template v-if="subscriber.readingSource === 'subscriber'">
						<section class="sb-reading-values">
							<div class="sb-reading-value"><span class="sb-label">Предыдущее</span><span class="sb-reading-number">{{ subscriber.previousReading }} м³</span></div>
							<div class="sb-reading-value current"><span class="sb-label">Текущее</span><span class="sb-reading-number">{{ subscriber.currentReading }} м³</span></div>
							<div class="sb-reading-value"><span class="sb-label">Расход</span><span class="sb-reading-number">{{ consumption }} м³</span></div>
						</section>
						<InfoBox type="protect" title="Показание подтверждено абонентом" message="Изменение показания, переданного абонентом самостоятельно, недоступно для контроллёра."/>
						<BaseButton class="sb-return" variant="outlined" @click="navigateTo(backLink)">Вернуться к реестру</BaseButton>
					</template>

					<template v-else>
						<div class="sb-previous"><span class="sb-previous-label"><BaseIcon name="mdi-history" size="1em"/>Предыдущее показание</span><span class="sb-previous-value">{{ subscriber.previousReading }} м³</span></div>
						<BaseTextBox v-model="reading" class="sb-reading-input" :disabled="subscriber.readingSource === 'controller'" label="Текущее показание, м³" placeholder="Введите значение" type="number"/>
						<div v-if="subscriber.readingSource === 'controller'" class="sb-consumption"><span>Расход за период</span><span>{{ consumption }} м³</span></div>
						<div class="sb-actions">
							<BaseButton variant="outlined" @click="navigateTo(backLink)">Отмена</BaseButton>
							<BaseButton :disabled="String(reading).trim() === ''" prependIcon="mdi-check-circle-outline" @click="acceptReading">Принять показание</BaseButton>
						</div>
					</template>
				</BaseIsland>
			</template>
		</main>
	</section>
</template>

<script lang="ts" setup>
import Avatar from '~/components/common/Avatar.vue';
import InfoBox from '~/components/common/InfoBox.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseSkeleton from '~/components/common/base/BaseSkeleton.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';

type Subscriber = {
	account: string;
	name: string;
	address: string;
	phone: string;
	meterNumber: string;
	meterModel: string;
	power: string;
	sealNumber: string;
	sign: string;
	lastPayment: string;
	gasBalance: string;
	gasBalanceClass: string;
	penaltyBalance: string;
	penaltyBalanceClass: string;
	previousReading: number;
	currentReading: number | null;
	readingSource: 'none' | 'subscriber' | 'controller';
};

const route = useRoute();
const subscriberId = computed(() => String(route.params.id));
const routeId = computed(() => typeof route.query.route === 'string' ? route.query.route : '');
const sectorId = computed(() => typeof route.query.sector === 'string' ? route.query.sector : '');
const backLink = computed(() => routeId.value
	? { path: `/fieldworks/routes/${routeId.value}`, query: sectorId.value ? { sector: sectorId.value } : {} }
	: '/fieldworks/routes'
);

const loading = ref(true);
const reading = ref<string | number>('');
const subscriber = ref<Subscriber>({} as Subscriber);
const consumption = computed(() => subscriber.value.currentReading === null ? 0 : subscriber.value.currentReading - subscriber.value.previousReading);
const readingStatus = computed(() => {
	if (subscriber.value.readingSource === 'subscriber') return { label: 'Передано абонентом', heading: 'Показание передано абонентом', description: 'Редактирование контроллёром заблокировано', icon: 'mdi-shield-check-outline' };
	if (subscriber.value.readingSource === 'controller') return { label: 'Принято', heading: 'Ввод текущего показания', description: 'Показание принято контроллёром', icon: 'mdi-check-circle-outline' };
	return { label: 'Не принято', heading: 'Ввод текущего показания', description: 'Метод 1 - карточка абонента', icon: 'mdi-gauge' };
});

onMounted(async () => {
	subscriber.value = await fetchSubscriber();
	reading.value = subscriber.value.currentReading ?? '';
	loading.value = false;
});

function acceptReading() {
	const value = Number(reading.value);
	if (!Number.isFinite(value)) return;

	subscriber.value.currentReading = value;
	subscriber.value.readingSource = 'controller';
}

async function fetchSubscriber(): Promise<Subscriber> {
	const subscribers: Record<string, Subscriber> = {
		'110100304': { account: '110100304', name: 'Сакихова Зульфия Турсуновна', address: 'ул. ВИШНЕВАЯ, д. 3', phone: '+996 558 558 778', meterNumber: '2504050918', meterModel: 'Чунчин G1.6', power: 'G1.6', sealNumber: '22184334', sign: '5', lastPayment: '24.06.2026', gasBalance: '-26,20 сом', gasBalanceClass: 'green', penaltyBalance: '—', penaltyBalanceClass: '', previousReading: 17, currentReading: 45, readingSource: 'subscriber' },
		'110100568': { account: '110100568', name: 'Маванкуй Р И', address: 'ул. ВИШНЕВАЯ, д. 5', phone: '+996 700 555 666', meterNumber: '2504050245', meterModel: 'Чунчин G1.6', power: 'G1.6', sealNumber: '22184335', sign: '5', lastPayment: '—', gasBalance: '—', gasBalanceClass: '', penaltyBalance: '—', penaltyBalanceClass: '', previousReading: 1, currentReading: 12, readingSource: 'controller' },
		default: { account: subscriberId.value, name: 'Токтосунов Марат', address: 'мкр. т. КУЛАТОВА, д. 12', phone: '+996 550 334 455', meterNumber: '1908045678', meterModel: 'ЛГБЭ-G4', power: 'G4', sealNumber: '44102345', sign: '5', lastPayment: '22.05.2026', gasBalance: '12 300 сом', gasBalanceClass: 'red', penaltyBalance: '180 сом', penaltyBalanceClass: 'red', previousReading: 1240, currentReading: null, readingSource: 'none' }
	};

	return new Promise(resolve => setTimeout(() => resolve(subscribers[subscriberId.value] ?? subscribers.default), 500));
}
</script>

<style lang="scss">
#subscriber-page {
	.page-blocks {
		display: grid;
		gap: 1.25em;
		margin: 1em 0;
	}

	.sb-back {
		display: inline-flex;
		align-items: center;
		gap: .35em;
		width: fit-content;
		color: #475569;
		font-weight: 700;
		text-decoration: none;

		&:hover {
			color: #2563eb;
		}
	}

	.sb-skeleton {
		overflow: hidden;
	}

	.sb-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1em;
		border-color: #bfdbfe;
		background: #f8fbff;

		.sb-profile {
			display: flex;
			align-items: center;
			gap: .85em;
			min-width: 0;

			.sb-profile-content {
				min-width: 0;

				.sb-name {
					color: #0f172a;
					font-size: 1.15rem;
					font-weight: 900;
				}

				.sb-meta {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					gap: .35em .8em;
					margin-top: .3em;
					color: #64748b;
					font-size: .86rem;

					.sb-account {
						color: #2563eb;
						font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
						font-weight: 800;
					}

					.sb-address {
						display: inline-flex;
						align-items: center;
						gap: .25em;
					}
				}
			}
		}

		.sb-contact {
			display: grid;
			justify-items: end;
			gap: .55em;
			white-space: nowrap;

			.sb-status {
				display: inline-flex;
				align-items: center;
				gap: .35em;
				padding: .45em .75em;
				border-radius: 1em;
				color: #ea580c;
				background: #fff7ed;
				font-size: .82rem;
				font-weight: 800;

				&.subscriber {
					color: #7c3aed;
					background: #f5f3ff;
				}

				&.controller {
					color: #16a34a;
					background: #ecfdf5;
				}
			}

			.sb-phone {
				display: inline-flex;
				align-items: center;
				gap: .3em;
				color: #2563eb;
				font-size: .85rem;
				text-decoration: none;
			}
		}
	}

	.sb-details {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1em;

		.sb-card {
			.sb-card-title {
				display: flex;
				align-items: center;
				gap: .55em;
				margin-bottom: 1em;
				padding-bottom: .8em;
				border-bottom: 1px solid #eef2f7;
				color: #0f172a;
				font-size: 1.05rem;
				font-weight: 900;
			}

			.sb-data {
				display: flex;
				justify-content: space-between;
				gap: 1em;
				padding: .45em 0;
				font-size: .9rem;

				.sb-label { color: #94a3b8; }
				.sb-value { color: #0f172a; font-weight: 800;
					&.green { color: #16a34a; }
					&.red { color: #dc2626; }
				}
			}
		}
	}

	.sb-reading {
		display: grid;
		gap: 1em;
		border-color: #bfdbfe;

		&.subscriber { border-color: #ddd6fe; background: #faf9ff; }

		.sb-reading-heading {
			padding-bottom: 1em;
			border-bottom: 1px solid #eef2f7;
			.sb-reading-title { display: flex; align-items: center; gap: .5em; color: #0f172a; font-size: 1.1rem; font-weight: 900; }
			.sb-reading-description { margin-top: .35em; color: #94a3b8; font-size: .86rem; }
		}

		.sb-previous {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1em;
			padding: 1em;
			border-radius: 8px;
			background: #f8fafc;
			.sb-previous-label { display: inline-flex; align-items: center; gap: .4em; color: #64748b; font-size: .9rem; }
			.sb-previous-value { color: #0f172a; font-size: 1.25rem; font-weight: 900; }
		}

		.sb-reading-input {
			.text-box-area { border-color: #93c5fd; background: #f8fbff; }
		}

		.sb-consumption { display: flex; justify-content: space-between; gap: 1em; padding: .9em 1em; border-radius: 8px; color: #ffffff; background: #2563eb; font-weight: 800; }

		.sb-reading-values {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1em;
			.sb-reading-value {
				display: grid;
				justify-items: center;
				gap: .45em;
				padding: 1em;
				border: 1px solid #e5e7eb;
				border-radius: 10px;
				background: #ffffff;
				&.current { border-color: #7c3aed; color: #ffffff; background: #7c3aed; }
				.sb-label { color: #94a3b8; font-size: .75rem; font-weight: 700; text-transform: uppercase; }
				.sb-reading-number { font-size: 1.25rem; font-weight: 900; }
			}
		}

		.sb-return { width: 100%; justify-content: center; }
		.sb-actions { display: flex; justify-content: flex-end; gap: .75em; .base-button { min-width: 12em; justify-content: center; } }
	}
}
</style>
