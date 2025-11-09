import { CheckoutService } from '../services/CheckoutService.js';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';
import { UserMother } from './builders/UserMother.js';
import { Item } from '../domain/Item.js';

describe('CheckoutService', () => {
	describe('quando o pagamento falha', () => {
		it('retorna null quando a cobranca falha', async () => {
			const carrinho = new CarrinhoBuilder().build();
			const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: false }) };
			const repositoryDummy = { salvar: jest.fn() };
			const emailServiceDummy = { enviarEmail: jest.fn() };
			const checkoutService = new CheckoutService(gatewayStub, repositoryDummy, emailServiceDummy);

			const pedido = await checkoutService.processarPedido(carrinho, { numero: '4111111111111111' });

			expect(pedido).toBeNull();
			expect(repositoryDummy.salvar).not.toHaveBeenCalled();
			expect(emailServiceDummy.enviarEmail).not.toHaveBeenCalled();
		});
	});

		describe('quando um cliente Premium finaliza a compra', () => {
			it('concede desconto e envia notificacao', async () => {
				const usuarioPremium = UserMother.umUsuarioPremium({ email: 'premium@email.com' });
				const itens = [new Item('Produto Especial', 200)];
				const carrinho = new CarrinhoBuilder().comUser(usuarioPremium).comItens(itens).build();
				const cartao = { numero: '5555444433331111' };
				const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: true }) };
				const pedidoSalvo = { id: 'pedido-123', carrinho, total: 180, status: 'PROCESSADO' };
				const repositoryStub = { salvar: jest.fn().mockResolvedValue(pedidoSalvo) };
				const emailMock = { enviarEmail: jest.fn().mockResolvedValue(undefined) };
				const checkoutService = new CheckoutService(gatewayStub, repositoryStub, emailMock);

				const pedido = await checkoutService.processarPedido(carrinho, cartao);

				expect(pedido).toEqual(pedidoSalvo);
				expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, cartao);
				expect(repositoryStub.salvar).toHaveBeenCalledTimes(1);
				expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
				expect(emailMock.enviarEmail).toHaveBeenCalledWith(
					usuarioPremium.email,
					'Seu Pedido foi Aprovado!',
					'Pedido pedido-123 no valor de R$180'
				);
			});
		});
});
