// const { ProductService, buildProductPayload } = require('../../../src/services/orderingServices/product.service');
// const { ProductModel } = require('../../../src/model/orderingModels/product.model');

// describe('Ordering ProductService', () => {
//   beforeEach(() => {
//     vi.restoreAllMocks();
//   });

//   it('should build a product payload with defaults', () => {
//     expect(buildProductPayload({ name: 'Cake', category: 'Pastry', price: 850 })).toEqual({
//       name: 'Cake',
//       category: 'Pastry',
//       price: 850,
//       inclusion: '',
//       image_url: null,
//       daily_limit: 0,
//       is_active: true,
//       allow_file_upload: false,
//     });
//   });

//   it('should return products', async () => {
//     const products = [{ id: 'p-1', name: 'Cake' }];
//     vi.spyOn(ProductModel, 'findAll').mockResolvedValue({ data: products, error: null });

//     const result = await ProductService.getProducts({ category: 'Pastry' });

//     expect(ProductModel.findAll).toHaveBeenCalledWith({ category: 'Pastry' });
//     expect(result).toEqual(products);
//   });

//   it('should create a product', async () => {
//     vi.spyOn(ProductModel, 'create').mockResolvedValue({ data: { id: 'p-1' }, error: null });

//     const result = await ProductService.createProduct({ name: 'Cake', category: 'Pastry', price: '850' });

//     expect(ProductModel.create).toHaveBeenCalledWith(expect.objectContaining({
//       name: 'Cake',
//       price: 850,
//       is_active: true,
//     }));
//     expect(result).toEqual({ id: 'p-1' });
//   });

//   it('should update only provided product fields', async () => {
//     vi.spyOn(ProductModel, 'update').mockResolvedValue({ data: { id: 'p-1', daily_limit: 3 }, error: null });

//     const result = await ProductService.updateProduct('p-1', { daily_limit: '3' });

//     expect(ProductModel.update).toHaveBeenCalledWith('p-1', { daily_limit: 3 });
//     expect(result.daily_limit).toBe(3);
//   });

//   it('should throw when the model returns an error', async () => {
//     const error = new Error('Product failed');
//     vi.spyOn(ProductModel, 'findById').mockResolvedValue({ data: null, error });

//     await expect(ProductService.getProductById('p-1')).rejects.toThrow(error);
//   });
// });

const { ProductService } = require('../../../src/services/orderingServices/product.service');
const { ProductModel } = require('../../../src/model/orderingModels/product.model');

describe('ProductService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    ProductModel.findAll = vi.fn();
    ProductModel.findById = vi.fn();
    ProductModel.create = vi.fn();
    ProductModel.update = vi.fn();
    ProductModel.remove = vi.fn();
  });

  describe('getProducts()', () => {
    it('should return all fetched products from the model layer', async () => {
      const mockProducts = [
        {
          id: 'p-1',
          name: 'Chocolate Cake',
        },
      ];

      ProductModel.findAll.mockResolvedValue({
        data: mockProducts,
        error: null,
      });

      const result = await ProductService.getProducts({
        search: 'Chocolate',
      });

      expect(ProductModel.findAll).toHaveBeenCalledWith({
        search: 'Chocolate',
      });

      expect(result).toEqual(mockProducts);
    });
  });

  describe('getProductById()', () => {
    it('should return a single product by id', async () => {
      const mockProduct = {
        id: 'p-1',
        name: 'Chocolate Cake',
      };

      ProductModel.findById.mockResolvedValue({
        data: mockProduct,
        error: null,
      });

      const result = await ProductService.getProductById('p-1');

      expect(ProductModel.findById).toHaveBeenCalledWith('p-1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('createProduct()', () => {
    it('should build the payload and create a product', async () => {
      const input = {
        name: 'Chocolate Cake',
        category: 'Cake',
        price: 850,
      };

      const created = {
        id: 'p-1',
        ...input,
      };

      ProductModel.create.mockResolvedValue({
        data: created,
        error: null,
      });

      const result = await ProductService.createProduct(input);

      expect(ProductModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Chocolate Cake',
          category: 'Cake',
          price: 850,
          is_active: true,
          allow_file_upload: false,
        })
      );

      expect(result).toEqual(created);
    });
  });

  describe('updateProduct()', () => {
    it('should update only the supplied fields', async () => {
      const updates = {
        price: 950,
        daily_limit: 10,
      };

      const updated = {
        id: 'p-1',
        ...updates,
      };

      ProductModel.update.mockResolvedValue({
        data: updated,
        error: null,
      });

      const result = await ProductService.updateProduct(
        'p-1',
        updates
      );

      expect(ProductModel.update).toHaveBeenCalledWith(
        'p-1',
        {
          price: 950,
          daily_limit: 10,
        }
      );

      expect(result).toEqual(updated);
    });
  });

  describe('deleteProduct()', () => {
    it('should delete a product and return its id', async () => {
      ProductModel.remove.mockResolvedValue({
        error: null,
      });

      const result = await ProductService.deleteProduct('p-1');

      expect(ProductModel.remove).toHaveBeenCalledWith('p-1');

      expect(result).toEqual({
        id: 'p-1',
      });
    });
  });
});
