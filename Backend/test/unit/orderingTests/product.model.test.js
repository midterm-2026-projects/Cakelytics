// const { supabase } = require('../../../src/config/supabase');
// const { ProductModel } = require('../../../src/model/orderingModels/product.model');

// function buildQueryChain() {
//   return {
//     select: vi.fn().mockReturnThis(),
//     order: vi.fn().mockReturnThis(),
//     eq: vi.fn().mockReturnThis(),
//     ilike: vi.fn().mockReturnThis(),
//     insert: vi.fn().mockReturnThis(),
//     update: vi.fn().mockReturnThis(),
//     delete: vi.fn().mockReturnThis(),
//     single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
//   };
// }

// describe('Ordering ProductModel', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//     supabase.from = vi.fn();
//   });

//   it('should find all products with filters', async () => {
//     const query = buildQueryChain();
//     supabase.from.mockReturnValue(query);

//     await ProductModel.findAll({ category: 'Pastry', search: 'Cake' });

//     expect(supabase.from).toHaveBeenCalledWith('products');
//     expect(query.select).toHaveBeenCalledWith(expect.stringContaining('product_variants(*)'));
//     expect(query.order).toHaveBeenCalledWith('name', { ascending: true });
//     expect(query.eq).toHaveBeenCalledWith('category', 'Pastry');
//     expect(query.eq).toHaveBeenCalledWith('is_active', true);
//     expect(query.ilike).toHaveBeenCalledWith('name', '%Cake%');
//   });

//   it('should allow inactive products when activeOnly is false', async () => {
//     const query = buildQueryChain();
//     supabase.from.mockReturnValue(query);

//     await ProductModel.findAll({ activeOnly: false });

//     expect(query.eq).not.toHaveBeenCalledWith('is_active', true);
//   });

//   it('should find a product by id', async () => {
//     const query = buildQueryChain();
//     supabase.from.mockReturnValue(query);

//     await ProductModel.findById('p-1');

//     expect(query.eq).toHaveBeenCalledWith('id', 'p-1');
//     expect(query.single).toHaveBeenCalled();
//   });

//   it('should create, update, and delete products', async () => {
//     const query = buildQueryChain();
//     supabase.from.mockReturnValue(query);

//     await ProductModel.create({ name: 'Cake' });
//     await ProductModel.update('p-1', { price: 850 });
//     await ProductModel.remove('p-1');

//     expect(query.insert).toHaveBeenCalledWith({ name: 'Cake' });
//     expect(query.update).toHaveBeenCalledWith({ price: 850 });
//     expect(query.delete).toHaveBeenCalled();
//     expect(query.eq).toHaveBeenCalledWith('id', 'p-1');
//   });
// });


const { supabase } = require('../../../src/config/supabase');
const { ProductModel } = require('../../../src/model/orderingModels/product.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { id: 'mock-id' },
      error: null,
    }),
  };
}

describe('ProductModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabase.from = vi.fn();
  });

  describe('findAll()', () => {
    it('should find all active products using filters', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await ProductModel.findAll({
        category: 'Cake',
        search: 'Chocolate',
      });

      expect(supabase.from).toHaveBeenCalledWith('products');

      expect(query.select).toHaveBeenCalledWith(
        expect.stringContaining('product_variants(*)')
      );

      expect(query.order).toHaveBeenCalledWith('name', {
        ascending: true,
      });

      expect(query.eq).toHaveBeenCalledWith('category', 'Cake');
      expect(query.eq).toHaveBeenCalledWith('is_active', true);

      expect(query.ilike).toHaveBeenCalledWith(
        'name',
        '%Chocolate%'
      );
    });

    it('should skip active filter when activeOnly is false', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await ProductModel.findAll({
        activeOnly: false,
      });

      expect(query.eq).not.toHaveBeenCalledWith(
        'is_active',
        true
      );
    });
  });

  describe('findById()', () => {
    it('should return a product by id', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await ProductModel.findById('p-1');

      expect(supabase.from).toHaveBeenCalledWith('products');

      expect(query.select).toHaveBeenCalledWith(
        expect.stringContaining('product_date_exceptions(*)')
      );

      expect(query.eq).toHaveBeenCalledWith('id', 'p-1');
      expect(query.single).toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('should create a product', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      const payload = {
        name: 'Chocolate Cake',
      };

      await ProductModel.create(payload);

      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(query.insert).toHaveBeenCalledWith(payload);
      expect(query.single).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should update a product', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      const payload = {
        price: 850,
      };

      await ProductModel.update('p-1', payload);

      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(query.update).toHaveBeenCalledWith(payload);
      expect(query.eq).toHaveBeenCalledWith('id', 'p-1');
      expect(query.single).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should delete a product', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await ProductModel.remove('p-1');

      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(query.delete).toHaveBeenCalled();
      expect(query.eq).toHaveBeenCalledWith('id', 'p-1');
    });
  });
});