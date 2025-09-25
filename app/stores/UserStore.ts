import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => ({
		token: null,
		userData: null,
	}),
	actions: {
		setData(data: any) {
			this.token = data.token;
			this.userData = data;
		}
	}
});

// if(import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
// }
