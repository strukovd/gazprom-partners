<template>
	<section id="readings-mobile-page">
		<main class="rm-content">
			<section class="rm-header">
				<div class="rm-title-block">
					<h1 class="rm-title">Отправка показаний</h1>
					<div class="rm-subtitle">25.05.2026 • Контроллер: Алиев М.</div>
				</div>
				<button type="button" class="rm-filter-button">
					<BaseIcon name="mdi-tune-variant" size="1.3em"/>
				</button>
			</section>

			<section class="rm-stats">
				<div class="rm-stat accepted">
					<div class="rm-stat-value">3</div>
					<div class="rm-stat-label">Принято</div>
				</div>
				<div class="rm-stat consumption">
					<div class="rm-stat-value">58</div>
					<div class="rm-stat-label">м³ расход</div>
				</div>
				<div class="rm-stat pending">
					<div class="rm-stat-value">4</div>
					<div class="rm-stat-label">Не оказано</div>
				</div>
			</section>

			<section class="rm-search">
				<BaseTextBox v-model="search" prependIcon="mdi-magnify" placeholder="ФИО, ЛС, адрес..."/>
			</section>

			<section class="rm-tabs">
				<button
					v-for="tab of tabs"
					:key="tab.key"
					type="button"
					class="rm-tab"
					:class="{ active: selectedStatus === tab.key }"
					@click="selectedStatus = tab.key"
				>
					{{ tab.title }} ({{ tab.count }})
				</button>
			</section>

			<section class="rm-list">
				<article
					v-for="subscriber of filteredSubscribers"
					:key="subscriber.account"
					class="rm-card"
					:class="{ accepted: subscriber.accepted }"
				>
					<header class="rm-card-header">
						<div class="rm-card-title">
							<div class="rm-card-line">
								<span class="rm-account">{{ subscriber.account }}</span>
								<span class="rm-status" :class="{ accepted: subscriber.accepted }">
									<BaseIcon :name="subscriber.accepted ? 'mdi-check-circle-outline' : 'mdi-clock-outline'" size=".9em"/>
									<span class="rm-status-text">{{ subscriber.accepted ? 'Принято' : 'Не принято' }}</span>
								</span>
							</div>
							<div class="rm-name">{{ subscriber.name }}</div>
							<div class="rm-address">{{ subscriber.address }}</div>
						</div>

						<button type="button" class="rm-details-button" @click="showDetails(subscriber)">
							<BaseIcon name="mdi-clipboard-text-outline" size="1.1em"/>
						</button>
					</header>

					<div class="rm-reading-grid">
						<div class="rm-reading previous">
							<div class="rm-reading-label">Пред. показание</div>
							<div class="rm-reading-value">{{ subscriber.lastReading }} м³</div>
						</div>
						<div v-if="subscriber.delta" class="rm-reading delta">
							<div class="rm-reading-label">Расход</div>
							<div class="rm-reading-value">{{ subscriber.delta }}</div>
						</div>
					</div>

					<div class="rm-current">
						<div class="rm-current-label">Текущее показание (м³)</div>
						<div class="rm-current-field" :class="{ filled: subscriber.accepted }">
							<span class="rm-current-value">{{ subscriber.accepted ? subscriber.currentReading : 'Введите показание' }}</span>
							<span class="rm-current-unit">м³</span>
						</div>
					</div>
				</article>
			</section>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';

type ReadingStatus = 'all' | 'accepted' | 'pending';
type ReadingSubscriber = {
	account: string;
	name: string;
	address: string;
	phone: string;
	equipment: string;
	meter: string;
	disconnectDate: string;
	lastReadingDate: string;
	lastReading: number;
	currentReading: number | null;
	delta: string;
	gasDebt: string;
	penaltyDebt: string;
	accepted: boolean;
};

const { $modal } = useNuxtApp();
const selectedStatus = ref<ReadingStatus>('all');
const search = ref('');
const subscribers: ReadingSubscriber[] = [
	{
		account: '100004521',
		name: 'ПАЗЫЛОВ ЧОЛПОНБАЙ',
		address: 'мкр. Т. Кулатова, ул., дом №747, кв. 1',
		phone: '+996990990990',
		equipment: 'Чунцин-ШАН-ЧЕН-5-G1.6-M-CN',
		meter: '2307018557',
		disconnectDate: '20.05.2026',
		lastReadingDate: '30.04.2026',
		lastReading: 64,
		currentReading: null,
		delta: '',
		gasDebt: '200 547,1 сом',
		penaltyDebt: '540 сом',
		accepted: false,
	},
	{
		account: '100007832',
		name: 'МАМЫТОВА АЙГУЛЬ АСАНБЕКОВНА',
		address: 'г. Бишкек, мкр. Асанбай, д. 5, кв. 38',
		phone: '+996700112233',
		equipment: 'BK-G4 Elster',
		meter: '2204031122',
		disconnectDate: '21.05.2026',
		lastReadingDate: '30.04.2026',
		lastReading: 318,
		currentReading: 341,
		delta: '23 м³',
		gasDebt: '45 200 сом',
		penaltyDebt: '0 сом',
		accepted: true,
	},
	{
		account: '200001143',
		name: 'ТОКТОСУНОВ МАРАТ КЕНЖЕБЕКОВ',
		address: 'Чуйская обл., г. Токмок, ул. Ленина, 12',
		phone: '+996555401122',
		equipment: 'СГМН-1 G6',
		meter: '2410800412',
		disconnectDate: '18.05.2026',
		lastReadingDate: '28.04.2026',
		lastReading: 1240,
		currentReading: null,
		delta: '',
		gasDebt: '18 900 сом',
		penaltyDebt: '120 сом',
		accepted: false,
	},
];

const tabs = computed<Array<{ key: ReadingStatus; title: string; count: number }>>(() => [
	{ key: 'all', title: 'Все', count: subscribers.length },
	{ key: 'accepted', title: 'Принято', count: subscribers.filter(item => item.accepted).length },
	{ key: 'pending', title: 'Не принято', count: subscribers.filter(item => !item.accepted).length },
]);

const filteredSubscribers = computed(() => {
	const query = search.value.trim().toLowerCase();

	return subscribers.filter((subscriber) => {
		const matchesStatus = selectedStatus.value === 'all'
			|| (selectedStatus.value === 'accepted' && subscriber.accepted)
			|| (selectedStatus.value === 'pending' && !subscriber.accepted);
		const matchesSearch = !query
			|| subscriber.name.toLowerCase().includes(query)
			|| subscriber.account.includes(query)
			|| subscriber.address.toLowerCase().includes(query);

		return matchesStatus && matchesSearch;
	});
});

function showDetails(subscriber: ReadingSubscriber) {
	$modal.show('ReadingDetails', {
		payload: { subscriber },
	});
}
</script>

<style lang="scss">
#readings-mobile-page {
	.rm-content {
		display: grid;
		gap: .85em;
		padding: .9em .8em 1.2em .8em;

		.rm-header {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 1em;

			.rm-title-block {
				min-width: 0;

				.rm-title {
					margin: 0;
					color: #0f172a;
					font-size: 1.05rem;
					font-weight: 900;
				}

				.rm-subtitle {
					margin-top: .25em;
					color: #94a3b8;
					font-size: .78rem;
					font-weight: 600;
				}
			}

			.rm-filter-button {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 2.6em;
				height: 2.6em;
				color: #fff;
				background: #2563eb;
				border: 0;
				border-radius: 50%;
				box-shadow: 0 8px 18px rgba(37, 99, 235, .24);
			}
		}

		.rm-stats {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: .55em;

			.rm-stat {
				display: grid;
				place-items: center;
				min-height: 4.2em;
				border-radius: 12px;

				.rm-stat-value {
					font-size: 1.15rem;
					font-weight: 900;
					line-height: 1;
				}

				.rm-stat-label {
					margin-top: .35em;
					font-size: .68rem;
					font-weight: 800;
				}

				&.accepted {
					color: #16a34a;
					background: #eafaf0;
				}

				&.consumption {
					color: #2563eb;
					background: #eaf3ff;
				}

				&.pending {
					color: #ea580c;
					background: #fff7ed;
				}
			}
		}

		.rm-search {
			.base-text-box {
				.text-box-area {
					background: #f8fafc;
					border-color: transparent;
					border-radius: 12px;
					box-shadow: none;
				}
			}
		}

		.rm-tabs {
			display: flex;
			gap: .45em;
			overflow-x: auto;

			.rm-tab {
				padding: .5em .75em;
				color: #334155;
				background: #fff;
				border: 1px solid #e2e8f0;
				border-radius: 9px;
				font-size: .78rem;
				font-weight: 800;
				white-space: nowrap;

				&.active {
					color: #fff;
					background: #2563eb;
					border-color: #2563eb;
				}
			}
		}

		.rm-list {
			display: grid;
			gap: .75em;

			.rm-card {
				display: grid;
				gap: .85em;
				padding: .85em;
				background: #fff;
				border: 1px solid #fde68a;
				border-top: 4px solid #facc15;
				border-radius: 14px;
				box-shadow: 0 8px 18px rgba(15, 23, 42, .08);

				&.accepted {
					border-color: #86efac;
					border-top-color: #22c55e;
				}

				.rm-card-header {
					display: flex;
					align-items: flex-start;
					justify-content: space-between;
					gap: .7em;

					.rm-card-title {
						min-width: 0;

						.rm-card-line {
							display: flex;
							align-items: center;
							gap: .35em;

							.rm-account {
								color: #2563eb;
								font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
								font-size: .72rem;
								font-weight: 900;
							}

							.rm-status {
								display: flex;
								align-items: center;
								gap: .2em;
								padding: .1em .45em;
								color: #b45309;
								background: #fffbeb;
								border: 1px solid #fde68a;
								border-radius: 999px;
								font-size: .62rem;
								font-weight: 900;

								&.accepted {
									color: #16a34a;
									background: #f0fdf4;
									border-color: #86efac;
								}
							}
						}

						.rm-name {
							margin-top: .2em;
							color: #0f172a;
							font-size: .9rem;
							font-weight: 900;
							line-height: 1.18;
						}

						.rm-address {
							margin-top: .2em;
							color: #94a3b8;
							font-size: .72rem;
							font-weight: 600;
							line-height: 1.2;
						}
					}

					.rm-details-button {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 2.2em;
						height: 2.2em;
						color: #64748b;
						background: #f1f5f9;
						border: 0;
						border-radius: 50%;
					}
				}

				.rm-reading-grid {
					display: grid;
					grid-template-columns: repeat(2, minmax(0, 1fr));
					gap: .5em;

					.rm-reading {
						padding: .65em .75em;
						background: #f8fafc;
						border-radius: 9px;

						.rm-reading-label {
							color: #94a3b8;
							font-size: .68rem;
							font-weight: 800;
						}

						.rm-reading-value {
							margin-top: .25em;
							color: #0f172a;
							font-size: .82rem;
							font-weight: 900;
						}

						&.delta {
							color: #2563eb;
							background: #eff6ff;

							.rm-reading-value {
								color: #2563eb;
							}
						}
					}
				}

				.rm-current {
					.rm-current-label {
						color: #94a3b8;
						font-size: .68rem;
						font-weight: 800;
						text-transform: uppercase;
					}

					.rm-current-field {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: .35em;
						min-height: 3.4em;
						padding: 0 .9em;
						color: #bfdbfe;
						background: #fff;
						border: 2px solid #93c5fd;
						border-radius: 12px;
						font-size: 1.05rem;
						font-weight: 900;

						.rm-current-unit {
							color: #94a3b8;
							font-size: .78rem;
						}

						&.filled {
							color: #22c55e;
							background: #f0fdf4;
							border-color: #4ade80;
							font-size: 1.45rem;
						}
					}
				}
			}
		}
	}
}
</style>
