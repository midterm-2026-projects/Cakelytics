// // const { supabase } = require('../../../src/config/supabase');
// // const { CustomerModel } = require('../../../src/model/orderingModels/customer.model');

// // function buildQueryChain() {
// //   return {
// //     select: vi.fn().mockReturnThis(),
// //     order: vi.fn().mockReturnThis(),
// //     or: vi.fn().mockReturnThis(),
// //     eq: vi.fn().mockReturnThis(),
// //     insert: vi.fn().mockReturnThis(),
// //     update: vi.fn().mockReturnThis(),
// //     delete: vi.fn().mockReturnThis(),
// //     single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
// //   };
// // }

// // describe('Ordering CustomerModel', () => {
// //   beforeEach(() => {
// //     vi.clearAllMocks();
// //     supabase.from = vi.fn();
// //   });

// //   it('should find all customers with search filter', async () => {
// //     const query = buildQueryChain();
// //     supabase.from.mockReturnValue(query);

// //     await CustomerModel.findAll({ search: 'Ana' });

// //     expect(supabase.from).toHaveBeenCalledWith('customers');
// //     expect(query.select).toHaveBeenCalledWith('*');
// //     expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
// //     expect(query.or).toHaveBeenCalledWith('name.ilike.%Ana%,phone.ilike.%Ana%,email.ilike.%Ana%');
// //   });

// //   it('should find a customer by id', async () => {
// //     const query = buildQueryChain();
// //     supabase.from.mockReturnValue(query);

// //     await CustomerModel.findById('c-1');

// //     expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
// //     expect(query.single).toHaveBeenCalled();
// //   });

// //   it('should create, update, and delete customers', async () => {
// //     const query = buildQueryChain();
// //     supabase.from.mockReturnValue(query);

// //     await CustomerModel.create({ name: 'Ana' });
// //     await CustomerModel.update('c-1', { phone: '0917' });
// //     await CustomerModel.remove('c-1');

// //     expect(query.insert).toHaveBeenCalledWith({ name: 'Ana' });
// //     expect(query.update).toHaveBeenCalledWith({ phone: '0917' });
// //     expect(query.delete).toHaveBeenCalled();
// //     expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
// //   });
// // });

// const { supabase } = require('../../../src/config/supabase');
// const { CustomerModel } = require('../../../src/model/orderingModels/customer.model');

// function buildQueryChain() {
//   return {
//     select: vi.fn().mockReturnThis(),
//     order: vi.fn().mockReturnThis(),
//     or: vi.fn().mockReturnThis(),
//     eq: vi.fn().mockReturnThis(),
//     insert: vi.fn().mockReturnThis(),
//     update: vi.fn().mockReturnThis(),
//     delete: vi.fn().mockReturnThis(),
//     single: vi.fn().mockResolvedValue({
//       data: { id: 'mock-id' },
//       error: null,
//     }),
//   };
// }

// describe('CustomerModel', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//     supabase.from = vi.fn();
//   });

//   describe('findAll()', () => {
//     it('should find all customers with search filter', async () => {
//       const query = buildQueryChain();
//       supabase.from.mockReturnValue(query);

//       await CustomerModel.findAll({
//         search: 'Ana',
//       });

//       expect(supabase.from).toHaveBeenCalledWith('customers');
//       expect(query.select).toHaveBeenCalledWith('*');

//       expect(query.order).toHaveBeenCalledWith(
//         'created_at',
//         { ascending: false }
//       );

//       expect(query.or).toHaveBeenCalledWith(
//         'name.ilike.%Ana%,phone.ilike.%Ana%,email.ilike.%Ana%'
//       );
//     });
//   });

//   describe('findById()', () => {
//     it('should find a customer by id', async () => {
//       const query = buildQueryChain();
//       supabase.from.mockReturnValue(query);

//       await CustomerModel.findById('c-1');

//       expect(supabase.from).toHaveBeenCalledWith('customers');
//       expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
//       expect(query.single).toHaveBeenCalled();
//     });
//   });

//   describe('create()', () => {
//     it('should create a customer', async () => {
//       const query = buildQueryChain();
//       supabase.from.mockReturnValue(query);

//       await CustomerModel.create({
//         name: 'Ana',
//       });

//       expect(query.insert).toHaveBeenCalledWith({
//         name: 'Ana',
//       });

//       expect(query.single).toHaveBeenCalled();
//     });
//   });

//   describe('update()', () => {
//     it('should update a customer', async () => {
//       const query = buildQueryChain();
//       supabase.from.mockReturnValue(query);

//       await CustomerModel.update('c-1', {
//         phone: '0917',
//       });

//       expect(query.update).toHaveBeenCalledWith({
//         phone: '0917',
//       });

//       expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
//     });
//   });

//   describe('remove()', () => {
//     it('should delete a customer', async () => {
//       const query = buildQueryChain();
//       supabase.from.mockReturnValue(query);

//       await CustomerModel.remove('c-1');

//       expect(query.delete).toHaveBeenCalled();
//       expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
//     });
//   });
// });

const { supabase } = require('../../../src/config/supabase');
const { CustomerModel } = require('../../../src/model/orderingModels/customer.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { id: 'mock-id' },
      error: null,
    }),
  };
}

describe('CustomerModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabase.from = vi.fn();
  });

  describe('findAll()', () => {
    it('should find all customers with search filter', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await CustomerModel.findAll({ search: 'Ana' });

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.select).toHaveBeenCalledWith('*');
      expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(query.or).toHaveBeenCalledWith('name.ilike.%Ana%,phone.ilike.%Ana%,email.ilike.%Ana%');
    });

    it('should query all customers in default chronological order if no filters are provided', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      // Tinawag nang walang ipinasang arguments para masubukan ang default parameters `{}`
      await CustomerModel.findAll();

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.select).toHaveBeenCalledWith('*');
      expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(query.or).not.toHaveBeenCalled();
    });
  });

  describe('findById()', () => {
    it('should find a customer by id', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await CustomerModel.findById('c-1');

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
      expect(query.single).toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('should create a customer', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      const payload = { name: 'Ana' };
      await CustomerModel.create(payload);

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.insert).toHaveBeenCalledWith(payload);
      expect(query.single).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should update a customer', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await CustomerModel.update('c-1', { phone: '0917' });

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.update).toHaveBeenCalledWith({ phone: '0917' });
      expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
      expect(query.single).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should delete a customer', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await CustomerModel.remove('c-1');

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.delete).toHaveBeenCalled();
      expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
    });

    it('should not chain a single modifier on removal action context', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await CustomerModel.remove('c-1');

      // Sinisigurong hindi tinatawag ang `.single()` sa remove operation dahil mag-e-error ito sa Supabase
      expect(query.single).not.toHaveBeenCalled();
    });
  });
});