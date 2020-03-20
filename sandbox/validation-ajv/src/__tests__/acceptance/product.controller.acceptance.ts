import {Client, expect} from '@loopback/testlab';
import {ValidationAjvApplication} from '../..';
import {ProductRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('ProductController', () => {
	let app: ValidationAjvApplication;
	let client: Client;
	let productRepository: ProductRepository;

	before('setupApplication', async () => {
		({app, client} = await setupApplication());
		productRepository = await app.getRepository(ProductRepository);
		await productRepository.deleteAll();
	});

	after(async () => {
		await app.stop();
	});

	afterEach(() => productRepository.deleteAll());

	it('uniqueness property `name`', async () => {
		const data = {
			name: 'test-1',
		};

		const {body: product} = await client.post('/products')
			.send(data)
			.expect(200);

		expect(product).to.be.ok();
		expect(product.id).to.be.ok()

		const {body: errorResponse} = await client.post('/products')
			.send(data)
			.expect(422);

		expect(errorResponse).to.be.ok();
		const {error} = errorResponse;
		expect(error).to.be.ok();
		expect(error.details).to.be.ok();
		expect(error.details[0].code).to.be.equal('uniqueness');
	});
});
