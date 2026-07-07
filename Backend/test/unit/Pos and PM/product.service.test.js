const { ProductService } = require('../../../src/services/product.service');
const { ProductModel } = require('../../../src/model/product.model');

describe('ProductService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return products when getProducts succeeds', async () => {
    const products = [{ id: 'p-1', name: 'Cake' }];
    vi.spyOn(ProductModel, 'findAll').mockResolvedValue({ data: products, error: null });

    const result = await ProductService.getProducts({ category: 'Package' });

    expect(ProductModel.findAll).toHaveBeenCalledWith({ category: 'Package' });
    expect(result).toEqual(products);
  });

  it('should throw when getProducts returns an error', async () => {
    const error = new Error('Database failure');
    vi.spyOn(ProductModel, 'findAll').mockResolvedValue({ data: null, error });

    await expect(ProductService.getProducts({})).rejects.toThrow(error);
  });

  it('should return a product by id', async () => {
    const product = { id: 'p-2', name: 'Muffin' };
    vi.spyOn(ProductModel, 'findById').mockResolvedValue({ data: product, error: null });

    const result = await ProductService.getProductById('p-2');

    expect(ProductModel.findById).toHaveBeenCalledWith('p-2');
    expect(result).toEqual(product);
  });

  it('should throw when getProductById returns an error', async () => {
    const error = new Error('Not found');
    vi.spyOn(ProductModel, 'findById').mockResolvedValue({ data: null, error });

    await expect(ProductService.getProductById('p-2')).rejects.toThrow(error);
  });

  it('should create a product with default optional values', async () => {
    const payload = { name: 'Cupcake', category: 'Pastry', price: 80 };
    vi.spyOn(ProductModel, 'create').mockResolvedValue({ data: { id: 'p-3' }, error: null });

    const result = await ProductService.createProduct(payload);

    expect(ProductModel.create).toHaveBeenCalledWith({
      name: 'Cupcake',
      category: 'Pastry',
      description: null,
      description_points: [],
      price: 80,
      stock_quantity: 0,
      stock_status: 'Available',
      image_url: null,
      is_active: true,
    });
    expect(result).toEqual({ id: 'p-3' });
  });

  it('should create a product using provided values', async () => {
    const payload = {
      name: 'Banana Bread',
      category: 'Bakery',
      description: 'Sweet and moist',
      description_points: ['Fresh bananas'],
      price: 120,
      stock_quantity: 10,
      stock_status: 'Out of Stock',
      image_url: 'https://example.com/banana.jpg',
      is_active: false,
    };
    vi.spyOn(ProductModel, 'create').mockResolvedValue({ data: { id: 'p-4' }, error: null });

    const result = await ProductService.createProduct(payload);

    expect(ProductModel.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ id: 'p-4' });
  });

  it('should throw when createProduct returns an error', async () => {
    const error = new Error('Insert failed');
    vi.spyOn(ProductModel, 'create').mockResolvedValue({ data: null, error });

    await expect(ProductService.createProduct({ name: 'Toast', category: 'Pastry', price: 50 })).rejects.toThrow(error);
  });
});
