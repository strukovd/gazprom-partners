<template>
	<div class="reading-modal">
		<main class="content">
			<!-- <section class="summary">
				<div class="item">
					<div class="label">Лицевой счет</div>
					<div class="value">{{ payload?.account || 'Не указан' }}</div>
				</div>
				<div class="item">
					<div class="label">Предыдущие показания</div>
					<div class="value">{{ previousReadingText }}</div>
					<div v-if="payload?.previousReadingDate" class="hint">{{ formatDateTime(payload.previousReadingDate) }}</div>
				</div>
			</section> -->

			<section class="form">
				<section style="font-size:1.6em;">
					<BaseTextBox v-model="previousReadingText" readonly disabled label="Предыдущее показание, м³"/>
					<BaseTextBox v-model="reading" autofocus :disabled="loading || !!response" label="Новое показание, м³" placeholder="Введите новые показание" @submit="sendReading"/>
				</section>
				<div v-if="consumption !== null" class="consumption">
					Расход: <b>{{ consumption }} м³</b>
				</div>
			</section>

			<InfoBox v-if="message.type" :type="message.type" :title="message.title" :message="message.text"/>
		</main>

		<footer class="footer">
			<section v-if="response" class="result-section">
				<h3>Результат</h3>
				<div class="result">
					<section class="grid-parent">
						<div class="item col-6">
							<div class="label">Принятое показание</div>
							<div>{{ number(response.reading) }} м³</div>
						</div>
						<div class="item col-6">
							<div class="label">Расход</div>
							<div>{{ number(response.consumption) }} м³</div>
						</div>
						<div class="item col-6">
							<div class="label">Тариф</div>
							<div>{{ money(response.tariff) }} / м³</div>
						</div>
						<div class="item col-6">
							<div class="label">К начислению</div>
							<div>{{ money(response.payAmount) }}</div>
						</div>
					</section>
					<div v-if="response?.created" class="created">
						<BaseIcon name="mdi-clock-outline" size="18"/>
						<span>Показание принято <span class="date">{{ formatDateTime(response.created) }}</span></span>
					</div>
					<div v-if="!response" class="item">
						<div class="label">Расход после отправки</div>
						<div>{{ consumption === null ? 'Будет рассчитан после ввода' : `${number(consumption)} м³` }}</div>
					</div>
				</div>
			</section>
			<div class="buttons">
				<BaseButton v-if="!response" prependIcon="mdi-check" :loading="loading" @click="sendReading">Отправить</BaseButton>
				<BaseButton prependIcon="mdi-close" :disabled="loading" @click="close()" variant="secondary">Закрыть</BaseButton>
			</div>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import { formatDateTime } from '~/utils/format';
import BaseButton from '../common/base/BaseButton.vue';
import BaseIcon from '../common/base/BaseIcon.vue';
import BaseTextBox from '../common/base/BaseTextBox.vue';
import InfoBox from '../common/InfoBox.vue';

type MessageType = '' | 'info' | 'error' | 'warning' | 'protect' | 'success';
type Payload = {
	account?: string;
	previousReading?: number | null;
	previousReadingDate?: string | null;
}
type ReadingResponse = {
	id: number;
	reading: number;
	created: string;
	consumption: number;
	tariff: number;
	payAmount: number;
};

const props = defineProps<{
	payload?: Payload
}>();

const { $fetchPortal } = useNuxtApp();
const reading = ref('');
const loading = ref(false);
const response = ref<ReadingResponse | null>(null);
const message = reactive({
	type: '' as MessageType,
	title: '',
	text: '',
});


const previousReadingText = computed(() => {
	return props.payload?.previousReading === null || props.payload?.previousReading === undefined
		? 'Не указаны'
		: `${props.payload.previousReading} м³`;
});

const readingNumber = computed(() => {
	if (!/^\d+$/.test(reading.value.trim())) return null;
	return Number(reading.value);
});

const consumption = computed(() => {
	if (readingNumber.value === null || props.payload?.previousReading === null || props.payload?.previousReading === undefined) return null;
	return readingNumber.value - props.payload.previousReading;
});


async function sendReading() {
	if (loading.value || response.value) return;
	message.type = '';
	response.value = null;

	if (!validate()) return;
	loading.value = true;

	try {
		response.value = await $fetchPortal<ReadingResponse>('v1/portal/readings', {
			method: 'POST',
			body: {
				account: props.payload?.account,
				reading: readingNumber.value,
			}
		});

		showMsg('success', 'Показания приняты', '');
	}
	catch (error: any) {
		const data = error?.data || error?.response?._data;
		const text = data?.message || data?.error || data?.detail || error?.statusMessage || error?.message;

		showMsg(
			'error',
			'Не удалось отправить показания',
			Array.isArray(text) ? text.join('\n') : (text || 'Проверьте данные и попробуйте ещё раз.')
		);
	}
	finally {
		loading.value = false;
	}
}

function validate() {
	if (!props.payload?.account) {
		showMsg('error', 'Не указан лицевой счет', 'Закройте окно и попробуйте открыть приём показаний из карточки абонента.');
		return false;
	}

	if (!reading.value.trim()) {
		showMsg('error', 'Введите показание', 'Поле нового показания не должно быть пустым.');
		return false;
	}

	if (readingNumber.value === null) {
		showMsg('error', 'Показание должно быть числом', 'Используйте только целые числа без пробелов и символов.');
		return false;
	}

	if (readingNumber.value < 0) {
		showMsg('warning', 'Показание не может быть отрицательным', 'Введите значение счетчика больше или равное нулю.');
		return false;
	}

	return true;
}

function showMsg(type: MessageType, title: string, text: string) {
	message.type = type;
	message.title = title;
	message.text = text;
}

const numberFormatter = new Intl.NumberFormat('ru-RU');
const moneyFormatter = new Intl.NumberFormat('ru-RU', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

function number(value: number | null | undefined) {
	return numberFormatter.format(Number(value || 0));
}

function money(value: number | null | undefined) {
	return `${moneyFormatter.format(Number(value || 0))} сом`;
}

function close(result = false) {
	const appStore = useAppStore();
	const modal = appStore?.modals.pop();
	if (modal?.resolve) modal.resolve(result);
}
</script>

<style lang="scss">
.reading-modal {
	min-width: 520px;

	.content {
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 0 0 1.4em 0;

		.summary {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: .75em;

			.item {
				padding: .9em 1em;
				border: 1px solid #dbe5f7;
				border-radius: 8px;
				background: #f8fafc;

				.label {
					color: #64748b;
					font-size: .78rem;
				}

				.value {
					margin-top: .2em;
					color: #111827;
					font-size: 1.25rem;
					font-weight: 700;
				}

				.hint {
					margin-top: .2em;
					color: #64748b;
					font-size: .78rem;
				}
			}
		}

		.form {
			.consumption {
				margin-top: .5em;
				color: #2563ea;
				font-size: .9rem;
			}
		}
	}

	.footer {
		display: grid;
		gap: 1em;

		h3 {
			margin-bottom: .6em;
			color: #172b4d;
			font-size: 1rem;
		}

		.result {
			display: grid;
			gap: .75em;
			.grid-parent {
				.item {
					padding: .8em .9em;
					border: 1px solid #dbe5f7;
					border-radius: 8px;
					background: #f8fafc;

					.label {
						color: #64748b;
						font-size: .78rem;
					}

					div:last-child {
						margin-top: .2em;
						color: #111827;
						font-size: 1.05rem;
						font-weight: 700;
					}
				}
			}

			>.created {
				display: flex;
				align-items: center;
				gap: .4em;
				color: #64748b;
				font-size: .84rem;

				.date {
					color: #f12400;
				}
			}
		}

		>.buttons {
			display: flex;
			justify-content: flex-end;
			gap: .5em;
		}
	}
}
</style>
