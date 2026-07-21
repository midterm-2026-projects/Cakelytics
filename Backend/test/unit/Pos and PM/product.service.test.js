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

    // Actual buildProductPayload uses inclusion, description as fallback,
    // daily_limit, stock_quantity. No stock_status/description_points.
    expect(ProductModel.create).toHaveBeenCalledWith({
      name: 'Cupcake',
      category: 'Pastry',
      price: 80,
      inclusion: '',
      image_url: null,
      daily_limit: 0,
      is_active: true,
      allow_file_upload: false,
      stock_quantity: 0,
    });
    expect(result).toEqual({ id: 'p-3' });
  });

  it('should create a product using provided values', async () => {
    const payload = {
      name: 'Banana Bread',
      category: 'Bakery',
      price: 120,
      stock_quantity: 10,
      image_url: 'https://example.com/banana.jpg',
      is_active: false,
      allow_file_upload: false,
      inclusion: 'Sweet and moist',
    };

    vi.spyOn(ProductModel, 'create').mockResolvedValue({ data: { id: 'p-4' }, error: null });

    const result = await ProductService.createProduct(payload);

    // Actual buildProductPayload uses inclusion field only (no description_points/stock_status)
    expect(ProductModel.create).toHaveBeenCalledWith({
      name: 'Banana Bread',
      category: 'Bakery',
      price: 120,
      inclusion: 'Sweet and moist',
      image_url: 'https://example.com/banana.jpg',
      daily_limit: 0,
      is_active: false,
      allow_file_upload: false,
      stock_quantity: 10,
    });
    expect(result).toEqual({ id: 'p-4' });
  });

  it('should throw when createProduct returns an error', async () => {
    const error = new Error('Insert failed');
    vi.spyOn(ProductModel, 'create').mockResolvedValue({ data: null, error });

    await expect(ProductService.createProduct({ name: 'Toast', category: 'Pastry', price: 50 })).rejects.toThrow(error);
  });

  it('should update a product', async () => {
    const body = { name: 'New Name', category: 'Pastry', price: 100, stock_quantity: 5 };
    vi.spyOn(ProductModel, 'update').mockResolvedValue({ data: { id: 'p-1' }, error: null });

    const result = await ProductService.updateProduct('p-1', body);

    expect(ProductModel.update).toHaveBeenCalledWith('p-1', expect.objectContaining({
      name: 'New Name',
      category: 'Pastry',
      price: 100,
      stock_quantity: 5,
    }));
    expect(result).toEqual({ id: 'p-1' });
  });

  it('should delete a product', async () => {
    vi.spyOn(ProductModel, 'delete').mockResolvedValue({ data: { id: 'p-1' }, error: null });

    const result = await ProductService.deleteProduct('p-1');

    expect(ProductModel.delete).toHaveBeenCalledWith('p-1');
    expect(result).toEqual({ id: 'p-1' });
  });
});
//princes
