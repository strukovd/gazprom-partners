import { acceptHMRUpdate, defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
	state: () => ({}),
	actions: {}
});

// if(import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
// }
