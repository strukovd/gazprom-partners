<template>
	<div v-if="subscriber" class="reading-details">
		<header class="rd-header">
			<div class="rd-title-block">
				<div class="rd-account">{{ subscriber.account }}</div>
				<div class="rd-name">{{ subscriber.name }}</div>
			</div>
			<button type="button" class="rd-close" @click="close">
				<BaseIcon name="mdi-close" size="1.2em"/>
			</button>
		</header>

		<section class="rd-contact">
			<div class="rd-contact-card phone">
				<BaseIcon name="mdi-phone-outline" size="1.1em"/>
				<span class="rd-contact-text">{{ subscriber.phone }}</span>
			</div>
			<div class="rd-contact-card address">
				<BaseIcon name="mdi-map-marker-outline" size="1.1em"/>
				<span class="rd-contact-text">{{ subscriber.address }}</span>
			</div>
		</section>

		<section class="rd-meter">
			<div class="rd-section-title">Данные счётчика</div>
			<div class="rd-meter-grid">
				<div class="rd-info">
					<div class="rd-label">Дата откл.</div>
					<div class="rd-value">{{ subscriber.disconnectDate }}</div>
				</div>
				<div class="rd-info">
					<div class="rd-label">Номер счётчика</div>
					<div class="rd-value">{{ subscriber.meter }}</div>
				</div>
				<div class="rd-info">
					<div class="rd-label">Модель</div>
					<div class="rd-value">{{ subscriber.equipment }}</div>
				</div>
				<div class="rd-info">
					<div class="rd-label">Дата посл. показания</div>
					<div class="rd-value">{{ subscriber.lastReadingDate }}</div>
				</div>
			</div>
		</section>

		<section class="rd-readings">
			<div class="rd-reading previous">
				<div class="rd-reading-label">Предыдущее</div>
				<div class="rd-reading-value">{{ subscriber.lastReading }}</div>
				<div class="rd-reading-unit">м³</div>
			</div>
			<div class="rd-reading current">
				<div class="rd-reading-label">Текущее</div>
				<div class="rd-reading-value">{{ subscriber.currentReading ?? '—' }}</div>
				<div class="rd-reading-unit">м³</div>
			</div>
		</section>

		<section class="rd-debts">
			<div class="rd-debt gas">
				<div class="rd-debt-title">
					<BaseIcon name="mdi-fire" size="1em"/>
					<span class="rd-debt-text">Сальдо — газ</span>
				</div>
				<div class="rd-debt-value">{{ subscriber.gasDebt }}</div>
			</div>
			<div class="rd-debt penalty">
				<div class="rd-debt-title">
					<BaseIcon name="mdi-alert-circle-outline" size="1em"/>
					<span class="rd-debt-text">Сальдо — пеня</span>
				</div>
				<div class="rd-debt-value">{{ subscriber.penaltyDebt }}</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/common/base/BaseIcon.vue';

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
	gasDebt: string;
	penaltyDebt: string;
};

const props = defineProps<{
	payload?: {
		subscriber?: ReadingSubscriber;
	};
}>();

const subscriber = computed(() => props.payload?.subscriber);

function close() {
	const modal = useAppStore().modals.pop();
	if (modal?.resolve) modal.resolve(false);
}
</script>

<style lang="scss">
.reading-details {
	display: grid;
	gap: 1em;
	width: min(420px, 100%);
	padding-bottom: .3em;

	.rd-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1em;

		.rd-title-block {
			min-width: 0;

			.rd-account {
				display: inline-block;
				padding: .12em .45em;
				color: #2563eb;
				background: #eff6ff;
				border-radius: 4px;
				font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
				font-size: .78rem;
				font-weight: 900;
			}

			.rd-name {
				margin-top: .35em;
				color: #0f172a;
				font-size: 1.05rem;
				font-weight: 900;
				line-height: 1.15;
			}
		}

		.rd-close {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2.3em;
			height: 2.3em;
			color: #64748b;
			background: #f1f5f9;
			border: 0;
			border-radius: 50%;
		}
	}

	.rd-contact,
	.rd-readings,
	.rd-debts {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: .7em;
	}

	.rd-contact {
		.rd-contact-card {
			display: flex;
			align-items: center;
			gap: .55em;
			min-height: 3.6em;
			padding: .75em;
			border-radius: 12px;
			font-size: .78rem;
			font-weight: 800;
			line-height: 1.25;

			&.phone {
				color: #2563eb;
				background: #eff6ff;
				border: 1px solid #bfdbfe;
			}

			&.address {
				color: #475569;
				background: #f8fafc;
				border: 1px solid #e2e8f0;
			}
		}
	}

	.rd-meter {
		padding: .95em;
		background: #f8fafc;
		border-radius: 14px;

		.rd-section-title {
			color: #64748b;
			font-size: .72rem;
			font-weight: 900;
			text-transform: uppercase;
		}

		.rd-meter-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: .9em 1em;
			margin-top: .8em;

			.rd-info {
				min-width: 0;

				.rd-label {
					color: #94a3b8;
					font-size: .66rem;
					font-weight: 800;
				}

				.rd-value {
					margin-top: .22em;
					overflow: hidden;
					color: #0f172a;
					font-size: .78rem;
					font-weight: 900;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}

	.rd-readings {
		.rd-reading {
			display: grid;
			place-items: center;
			min-height: 5.2em;
			padding: .8em;
			border-radius: 12px;

			.rd-reading-label {
				color: #94a3b8;
				font-size: .68rem;
				font-weight: 900;
				text-transform: uppercase;
			}

			.rd-reading-value {
				color: #2563eb;
				font-size: 1.65rem;
				font-weight: 900;
				line-height: 1;
			}

			.rd-reading-unit {
				color: #2563eb;
				font-size: .72rem;
				font-weight: 800;
			}

			&.previous {
				background: #eff6ff;
				border: 1px solid #bfdbfe;
			}

			&.current {
				background: #f8fafc;
				border: 1px solid #e2e8f0;

				.rd-reading-value,
				.rd-reading-unit {
					color: #cbd5e1;
				}
			}
		}
	}

	.rd-debts {
		.rd-debt {
			padding: .85em;
			border-radius: 12px;

			.rd-debt-title {
				display: flex;
				align-items: center;
				gap: .3em;
				font-size: .68rem;
				font-weight: 900;
				text-transform: uppercase;
			}

			.rd-debt-value {
				margin-top: .3em;
				font-size: 1rem;
				font-weight: 900;
			}

			&.gas {
				color: #ea580c;
				background: #fff7ed;
				border: 1px solid #fed7aa;
			}

			&.penalty {
				color: #e11d48;
				background: #fff1f2;
				border: 1px solid #fecdd3;
			}
		}
	}
}
</style>
