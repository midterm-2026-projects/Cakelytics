const { ProductService, buildProductPayload } = require('../../../src/services/orderingServices/product.service');
const { ProductModel } = require('../../../src/model/orderingModels/product.model');

describe('Ordering ProductService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should build a product payload with defaults', () => {
    expect(buildProductPayload({ name: 'Cake', category: 'Pastry', price: 850 })).toEqual({
      name: 'Cake',
      category: 'Pastry',
      price: 850,
      inclusion: '',
      image_url: null,
      daily_limit: 0,
      is_active: true,
      allow_file_upload: false,
    });
  });

  it('should return products', async () => {
    const products = [{ id: 'p-1', name: 'Cake' }];
    vi.spyOn(ProductModel, 'findAll').mockResolvedValue({ data: products, error: null });

    const result = await ProductService.getProducts({ category: 'Pastry' });

    expect(ProductModel.findAll).toHaveBeenCalledWith({ category: 'Pastry' });
    expect(result).toEqual(products);
  });

  it('should create a product', async () => {
    vi.spyOn(ProductModel, 'create').mockResolvedValue({ data: { id: 'p-1' }, error: null });

    const result = await ProductService.createProduct({ name: 'Cake', category: 'Pastry', price: '850' });

    expect(ProductModel.create).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Cake',
      price: 850,
      is_active: true,
    }));
    expect(result).toEqual({ id: 'p-1' });
  });

  it('should update only provided product fields', async () => {
    vi.spyOn(ProductModel, 'update').mockResolvedValue({ data: { id: 'p-1', daily_limit: 3 }, error: null });

    const result = await ProductService.updateProduct('p-1', { daily_limit: '3' });

    expect(ProductModel.update).toHaveBeenCalledWith('p-1', { daily_limit: 3 });
    expect(result.daily_limit).toBe(3);
  });

  it('should throw when the model returns an error', async () => {
    const error = new Error('Product failed');
    vi.spyOn(ProductModel, 'findById').mockResolvedValue({ data: null, error });

    await expect(ProductService.getProductById('p-1')).rejects.toThrow(error);
  });
});
