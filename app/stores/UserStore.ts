import { defineStore } from 'pinia';
type UserData = {
	id: number;
	login: string;
	role: 'ADMIN' | 'CALLCENTER' | 'CALLCENTER_MANAGER' | 'CONTRACTOR' | 'CONTROLLER' | 'CALLCENTER_COMPLAINT_ASSIGNEE';
	userName: null,
	contractorId: unknown,
	officeId: unknown
}

export const useUserStore = defineStore('user', {
	state: () => ({
		token: import.meta.browser ? localStorage.getItem('token') : null as string | null,
		userData: null as UserData | null,
	}),

	actions: {
		logout() {
			this.reset();
			navigateTo('/login');
		},

		setData(data: any) {
			if(!data || !data.token) {
				console.error('Token не получен!');
			}
			this.token = data.token;
			this.userData = data.userData;
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.userData));
		},

		loadFromStorage() {
			const token = localStorage.getItem('token');
			const userStr = localStorage.getItem('user');
			if (token) this.token = token;
			if (userStr) {
				try {
					const u = JSON.parse(userStr);
					this.userData = u;
				}
				catch {}
			}
		},

		reset() {
			this.token = null;
			this.userData = null;
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		}
	},

	getters: {
		isPrivilegedUser: (state) => {
			return ['ADMIN', 'CALLCENTER_MANAGER'].includes(state.userData?.role ?? '');
		},

		prettyRole: (state) => {
			switch( state.userData?.role ) {
				case 'CALLCENTER':
					return 'Оператор колл-центра';
				case 'CALLCENTER_MANAGER':
					return 'Менеджер колл-центра';
				case 'CALLCENTER_COMPLAINT_ASSIGNEE':
					return 'Исполнитель жалоб';
				case 'CONTROLLER':
					return 'Контролёр';
				case 'ADMIN':
					return 'Администратор';
				case 'CONTRACTOR':
					return 'Подрядчик';
				default: return state.userData?.role;
			}
		}
	}
});

// if(import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
// }
