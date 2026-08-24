<template>
	<div class="complaint-modal">
		<form class="form" @submit.prevent="submit">
			<section>
				<AccountSearch class="col-6" v-model="form.account" label="Абонент" required :autofocus="!form.account" @select="onAccountSelect"/>
				<BaseTextBox class="col-6" v-model="customerName" label="ФИО клиента" placeholder="Введите ФИО клиента..." disabled/>
			</section>

			<BaseTextBox v-model="form.contactNumber" type="tel" prependIcon="mdi-phone-outline" label="Номер тел. клиента" placeholder="+996..."/>

			<div class="field">
				<label>Уровень срочности</label>
				<BaseTabs v-model="form.urgencyLevel" :items="urgencyTabs"/>
			</div>

			<BaseAutocomplete v-model="form.subject" :items="subjectOptions" label="Тема обращения"/>

			<BaseMemo v-model="form.description" height="126px" resize="vertical" label="Описание ситуации" placeholder="Подробное описание проблемы абонента..."/>
			<section class="files">
				<div class="field">
					<label>Закрепленные файлы</label>
					<BaseFileListPicker v-model="files" multiple emptyText="Файлы не выбраны"/>
				</div>
			</section>

			<InfoBox v-if="message.type" :type="message.type" :title="message.title" :message="message.text"/>

			<footer class="footer">
				<BaseButton prependIcon="mdi-check" :disabled="loading" @click="submit">
					{{ loading ? 'Регистрация...' : 'Зарегистрировать жалобу' }}
				</BaseButton>
				<BaseButton prependIcon="mdi-close" :disabled="loading" variant="secondary" @click="close(false)">
					Отмена
				</BaseButton>
			</footer>
		</form>
	</div>
</template>

<script lang="ts" setup>
import AccountSearch from '../AccountSearch.vue';
import BaseAutocomplete from '../common/base/BaseAutocomplete.vue';
import BaseButton from '../common/base/BaseButton.vue';
import BaseFileListPicker from '../common/base/BaseFileListPicker.vue';
import BaseMemo from '../common/base/BaseMemo.vue';
import BaseTabs from '../common/base/BaseTabs.vue';
import BaseTextBox from '../common/base/BaseTextBox.vue';
import InfoBox from '../common/InfoBox.vue';
import { complaints, type ComplaintsBody } from '~/services/complaints';
import type { FindPayload } from '~/types/Facility';

type MessageType = '' | 'info' | 'error' | 'warning' | 'protect' | 'success';
type Payload = {
	account?: string;
	name?: string;
	contactNumber?: string;
};

const props = defineProps<{
	payload?: Payload;
}>();

const subjects: ComplaintsBody['subject'][] = ['Жалоба на БСГ', 'Жалоба на сотрудника', 'Прочее', 'Тарифы/Прейскурант цен', 'Не восстановили дорожное покрытие после газификации', 'Некорректные начисления', 'Не приносят квитанции', 'Перерасчет начислений', 'Повредили газопровод', 'Предоставление услуг:Разработка ЭЧ', 'Установка/Снятие/Замена БСГ', 'Предоставление услуг СМР, ПНР, Замена БСГ', 'Утечка/ Авария'];
const subjectOptions = subjects.map(subject => ({ key: subject, value: subject }));
const urgencyTabs = [
	{ key: 'Обычная', value: 'Обычная', icon: 'mdi-dots-circle' },
	{ key: 'Срочно', value: 'Срочно', icon: 'mdi-chevron-double-up' },
	{ key: 'Очень срочно', value: 'Очень срочно', icon: 'mdi-alert-octagon' },
];
const accountStore = useAccountStore();
const loading = ref(false);
const customerName = ref('');
const files = ref<File[]>([]);
const message = reactive({
	type: '' as MessageType,
	title: '',
	text: '',
});
const form = reactive<ComplaintsBody>({
	account: props.payload?.account || '',
	subject: subjects[0],
	urgencyLevel: 'Обычная',
	description: '',
	contactNumber: props.payload?.contactNumber || '',
});

if (props.payload?.name) {
	customerName.value = props.payload.name;
}
else if (props.payload?.account && accountStore.accountData?.account === props.payload.account) {
	customerName.value = accountStore.accountData.name;
}

function onAccountSelect(account: FindPayload | null) {
	customerName.value = account?.name || '';
}

async function submit() {
	if (loading.value) return;
	message.type = '';

	if (!validate()) return;

	loading.value = true;

	try {
		const res = await complaints.create({
			...form,
			account: form.account.trim(),
			description: form.description.trim(),
			contactNumber: form.contactNumber?.trim() || undefined,
			files: files.value,
		});

		useNuxtApp().$flags.success('Жалоба зарегистрирована');
		if( !res.issueId ) {
			useNuxtApp().$flags.error('Жалоба зарегистрирована, но задача в МФЦ не создана!', { title: 'Задача в МФЦ не создана!', timeout: 60000 });
		}

		close(true);
	}
	catch (error: any) {
		const data = error?.data || error?.response?._data;
		const text = data?.message || data?.error || data?.detail || error?.statusMessage || error?.message;

		message.type = 'error';
		message.title = 'Не удалось зарегистрировать жалобу';
		message.text = Array.isArray(text) ? text.join('\n') : (text || 'Проверьте данные и попробуйте ещё раз.');
	}
	finally {
		loading.value = false;
	}
}

function validate() {
	if (!form.account.trim()) {
		message.type = 'warning';
		message.title = 'Укажите лицевой счет';
		message.text = 'Лицевой счет нужен для регистрации жалобы.';
		return false;
	}

	if (!form.subject) {
		message.type = 'warning';
		message.title = 'Выберите тему обращения';
		message.text = 'Тема нужна для маршрутизации жалобы.';
		return false;
	}

	if (!form.description.trim()) {
		message.type = 'warning';
		message.title = 'Заполните описание';
		message.text = 'Опишите ситуацию абонента перед регистрацией жалобы.';
		return false;
	}

	return true;
}

function close(result: boolean) {
	const appStore = useAppStore();
	const modal = appStore?.modals.pop();
	if (modal?.resolve) modal.resolve(result);
}
</script>

<style lang="scss">
.complaint-modal {
	// width: min(720px, 82vw);
	max-height: calc(90vh - 5em);
	overflow-y: auto;
	padding: 0 .3em;

	.form {
		display: grid;
		gap: 1em;

		.field {
			display: grid;
			gap: .4em;

			> label {
				color: #4b5563;
				font-size: .82rem;
				font-weight: 700;
			}
		}

		.footer {
			display: flex;
			justify-content: flex-end;
			gap: .5em;
			padding-top: .4em;
		}
	}

	@media (max-width: 700px) {
		width: 100%;

		.form {
			.footer {
				display: grid;
			}
		}
	}
}
</style>
