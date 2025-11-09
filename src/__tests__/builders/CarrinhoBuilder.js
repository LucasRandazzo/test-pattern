import { Carrinho } from '../../domain/Carrinho.js';
import { Item } from '../../domain/Item.js';
import { UserMother } from './UserMother.js';

// Builder para criar Carrinho com variacoes de forma fluente nos testes.
export class CarrinhoBuilder {
	constructor() {
		this.user = UserMother.umUsuarioPadrao();
		this.itens = [new Item('Item Padrao', 10)];
	}

	comUser(user) {
		this.user = user;
		return this;
	}

	comItens(itens) {
		this.itens = [...itens];
		return this;
	}

	comItem(item) {
		this.itens = [...this.itens, item];
		return this;
	}

	vazio() {
		this.itens = [];
		return this;
	}

	build() {
		return new Carrinho(this.user, [...this.itens]);
	}
}
