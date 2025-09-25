export type UserData = {
	success: boolean;
	token: string;
	userData: {
		contractorId: number;
		id: number;
		login: string;
		role: string;
	};
}
