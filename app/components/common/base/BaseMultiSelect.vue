<template>
	<div class="base-multi-select-wrapper" :class="{ invalid: error }">
		<label>
			<header v-if="label || error" class="header">
				<div v-if="label" class="caption-container"><span class="caption">{{ label }}</span></div>
				<div v-if="error" class="error-container"><span class="error-message">{{ error }}</span></div>
			</header>
			<div class="input-container">
				<div v-if="selectedItems.length" class="selected-items">
					<div v-for="item of selectedItems" :key="item[fieldKey]" class="item-badge">
						<span class="item-value">{{ item[fieldValue] }}</span>
						<BaseIcon class="remove-icon" name="mdi-close" @click.stop="removeItem(item[fieldKey])"/>
					</div>
				</div>
				<input
					v-model="searchValue"
					type="text"
					:placeholder="placeholder"
					@focus="showDropdown"
					@blur="hideDropdown"
					@input="onInput"
					@keydown="onKeydown"
				>
				<BaseIcon class="append-icon" size="1.4em" :name="appendIcon ?? 'mdi-menu-down'"/>
			</div>
		</label>
		<ul v-if="visibleDropdown" class="dropdown">
			<li
				v-for="(item, index) of filteredItems"
				:key="item[fieldKey]"
				:class="['dropdown-item', { focused: focusedItem === index }]"
				@mousedown="selectItem(item)"
			>
				<span>{{ item[fieldValue] }}</span>
				<span v-if="showKey" class="item-key">{{ item[fieldKey] }}</span>
			</li>
			<li v-if="!filteredItems.length" class="dropdown-item">Ничего не найдено</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';

export default defineComponent({
	name: 'BaseMultiSelect',
	components: { BaseIcon },
	emits: ['update:modelValue', 'change'],
	props: {
		modelValue: Array as () => Array<string | number>,
		label: String,
		placeholder: String,
		prependIcon: String,
		appendIcon: String,
		items: { type: Array as () => any[], default: () => [] },
		autoselect: Boolean,
		showKey: Boolean,
		loading: Boolean,
		error: String,
		fieldKey: { type: String, default: 'key' },
		fieldValue: { type: String, default: 'value' },
		emitValue: { type: Boolean, default: false },
	},
	data() {
		return {
			searchValue: '',
			visibleDropdown: false,
			focusedItem: -1,
			selectedItems: [] as any[],
		};
	},
	computed: {
		filteredItems() {
			const selectedKeys = this.selectedItems.map(item => String(item[this.fieldKey]));
			const search = this.searchValue.toLowerCase();
			return this.items.filter(item => !selectedKeys.includes(String(item[this.fieldKey]))
				&& (String(item[this.fieldKey]).toLowerCase().includes(search)
					|| String(item[this.fieldValue]).toLowerCase().includes(search)));
		},
	},
	methods: {
		getEmitField() {
			return this.emitValue ? this.fieldValue : this.fieldKey;
		},
		emitSelection() {
			const value = this.selectedItems.map(item => String(item[this.getEmitField()]));
			this.$emit('update:modelValue', value);
			this.$emit('change', value);
		},
		syncFromModel(value: unknown) {
			const values = Array.isArray(value) ? value : (value === undefined || value === null ? [] : [value]);
			this.selectedItems = values
				.map(value => this.items.find(item => String(item[this.getEmitField()]) === String(value)))
				.filter(Boolean);
		},
		selectItem(item: any) {
			if (!item) return;

			this.selectedItems.push(item);
			this.searchValue = '';
			this.focusedItem = -1;
			this.emitSelection();
			this.hideDropdown();
		},
		removeItem(key: string) {
			this.selectedItems = this.selectedItems.filter(item => item[this.fieldKey] !== key);
			this.emitSelection();
		},
		showDropdown() {
			this.visibleDropdown = true;
		},
		hideDropdown() {
			setTimeout(() => {
				this.visibleDropdown = false;
			}, 10);
		},
		onInput() {
			this.focusedItem = -1;
			this.showDropdown();
		},
		onKeydown(event: KeyboardEvent) {
			switch (event.key) {
				case 'Tab':
				case 'Enter':
					if (this.visibleDropdown && this.focusedItem >= 0) {
						this.selectItem(this.filteredItems[this.focusedItem]);
						event.preventDefault();
					}
					break;
				case 'Escape':
					if (this.visibleDropdown) this.hideDropdown();
					break;
				case 'Backspace':
					if (!this.searchValue && this.selectedItems.length) {
						this.selectedItems.pop();
						this.emitSelection();
					}
					break;
				case 'ArrowUp':
				case 'ArrowDown':
					if (!this.visibleDropdown) this.showDropdown();
					if (!this.filteredItems.length) return;

					this.focusedItem = event.key === 'ArrowUp'
						? (this.focusedItem - 1 + this.filteredItems.length) % this.filteredItems.length
						: (this.focusedItem + 1) % this.filteredItems.length;
					event.preventDefault();
					break;
			}
		},
		init() {
			if (this.modelValue?.length) {
				this.syncFromModel(this.modelValue);
			} else if (this.autoselect && this.items.length) {
				this.selectItem(this.items[0]);
			}
		},
	},
	watch: {
		modelValue: {
			deep: true,
			immediate: true,
			handler(value) {
				this.syncFromModel(value);
			},
		},
		items() {
			this.syncFromModel(this.modelValue);
		},
	},
	created() {
		this.init();
	},
	unmounted() {
		this.$emit('update:modelValue', undefined);
	},
});
</script>

<style lang="scss">
.base-multi-select-wrapper {
	position: relative;
	min-width: 0;

	label {
		display: block;
		min-width: 0;

		.header {
			display: flex;
			align-items: start;
			justify-content: space-between;
			gap: 1em;
			padding-right: 1em;

			.caption {
				display: block;
				margin-bottom: .4em;
				color: #4b5563;
				font-size: .82rem;
				font-weight: 700;
				line-height: 1.4em;
			}

			.error-container {
				color: #dc2626;
				font-size: .82rem;
				line-height: 1.4em;
			}
		}

		.input-container {
			display: flex;
			align-items: center;
			min-width: 0;
			padding: .2em .4em .2em .6em;
			background: #ffffff;
			border: 1px solid #d4d4d4;
			border-radius: 6px;
			font-size: 16px;
			font-weight: 500;
			line-height: 1.4em;

			&:focus-within {
				border-color: #2563ea80;
				box-shadow: 0 0 0 2px #2563ea80;
			}

			.selected-items {
				display: flex;
				flex: 0 1 auto;
				gap: .3em;
				min-width: 0;
				margin: 0;
				padding: 0 .4em;
				overflow-x: auto;
				white-space: nowrap;

				.item-badge {
					display: inline-flex;
					flex: 0 0 auto;
					align-items: center;
					gap: .3em;
					padding: .2em .6em;
					color: rgb(0 95 242 / .9);
					background: rgb(240 247 255);
					border: 1px solid rgb(203 231 255);
					border-radius: 5px;
					font-size: .85em;
					font-weight: 300;

					.remove-icon {
						cursor: pointer;
						opacity: .6;

						&:hover {
							opacity: 1;
						}
					}
				}
			}

			input {
				flex: 1 1 4em;
				min-width: 0;
				padding: .4em;
				color: inherit;
				background: transparent;
				border: 0;
				outline: 0;
				font-size: 16px;

				&::placeholder {
					font-weight: 300;
					opacity: .6;
				}
			}

			.append-icon {
				flex: 0 0 auto;
				color: #a3a3a3;
			}
		}
	}

	&:has(.dropdown) .append-icon {
		transform: rotate(180deg);
	}

	.dropdown {
		position: absolute;
		z-index: 100;
		width: 100%;
		max-height: 300px;
		margin: .2em 0 0;
		padding: 0;
		overflow-y: auto;
		background: #fdfdfd;
		border-radius: 3px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, .14);

		.dropdown-item {
			padding: 0 1.6em;
			list-style: none;
			cursor: pointer;
			font-size: 1rem;
			line-height: 2em;

			&:hover,
			&.focused {
				background: aliceblue;
			}

			.item-key {
				margin-left: .3em;
				opacity: .3;
			}
		}
	}

	&.invalid {
		.input-container {
			color: #dc2626;
			border-color: #dc2626;
			border-style: dashed;
		}
	}
}
</style>
