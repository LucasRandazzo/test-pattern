import { User } from '../../domain/User.js';

export class UserMother {
	static umUsuarioPadrao(overrides = {}) {
		const {
			id = 'user-padrao-id',
			nome = 'Usuario Padrao',
			email = 'usuario.padrao@example.com',
			tipo
		} = overrides;

		return new User(id, nome, email, tipo ?? 'PADRAO');
	}

	static umUsuarioPremium(overrides = {}) {
		const {
			id = 'user-premium-id',
			nome = 'Usuario Premium',
			email = 'usuario.premium@example.com',
			tipo
		} = overrides;

		return new User(id, nome, email, tipo ?? 'PREMIUM');
	}
}
