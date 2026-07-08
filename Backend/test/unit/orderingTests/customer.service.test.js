// const { CustomerService, buildCustomerPayload } = require('../../../src/services/orderingServices/customer.service');
// const { CustomerModel } = require('../../../src/model/orderingModels/customer.model');

// describe('Ordering CustomerService', () => {
//   beforeEach(() => {
//     vi.restoreAllMocks();
//   });

//   it('should build a customer payload with defaults', () => {
//     expect(buildCustomerPayload({ name: 'Ana', phone: '0917' })).toEqual({
//       name: 'Ana',
//       phone: '0917',
//       alt_phone: '',
//       facebook: '',
//       email: null,
//     });
//   });

//   it('should return customers when getCustomers succeeds', async () => {
//     const customers = [{ id: 'c-1', name: 'Ana' }];
//     vi.spyOn(CustomerModel, 'findAll').mockResolvedValue({ data: customers, error: null });

//     const result = await CustomerService.getCustomers({ search: 'Ana' });

//     expect(CustomerModel.findAll).toHaveBeenCalledWith({ search: 'Ana' });
//     expect(result).toEqual(customers);
//   });

//   it('should create a customer', async () => {
//     vi.spyOn(CustomerModel, 'create').mockResolvedValue({ data: { id: 'c-1' }, error: null });

//     const result = await CustomerService.createCustomer({ name: 'Ana', phone: '0917' });

//     expect(CustomerModel.create).toHaveBeenCalledWith({
//       name: 'Ana',
//       phone: '0917',
//       alt_phone: '',
//       facebook: '',
//       email: null,
//     });
//     expect(result).toEqual({ id: 'c-1' });
//   });

//   it('should update only provided customer fields', async () => {
//     vi.spyOn(CustomerModel, 'update').mockResolvedValue({ data: { id: 'c-1', phone: '0999' }, error: null });

//     const result = await CustomerService.updateCustomer('c-1', { phone: '0999' });

//     expect(CustomerModel.update).toHaveBeenCalledWith('c-1', { phone: '0999' });
//     expect(result.phone).toBe('0999');
//   });

//   it('should throw when the model returns an error', async () => {
//     const error = new Error('Customer failed');
//     vi.spyOn(CustomerModel, 'findById').mockResolvedValue({ data: null, error });

//     await expect(CustomerService.getCustomerById('c-1')).rejects.toThrow(error);
//   });
// });

const {
  CustomerService,
  buildCustomerPayload,
} = require('../../../src/services/orderingServices/customer.service');

const {
  CustomerModel,
} = require('../../../src/model/orderingModels/customer.model');

describe('CustomerService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('buildCustomerPayload()', () => {
    it('should build a customer payload with defaults', () => {
      expect(
        buildCustomerPayload({
          name: 'Ana',
          phone: '0917',
        })
      ).toEqual({
        name: 'Ana',
        phone: '0917',
        alt_phone: '',
        facebook: '',
        email: null,
      });
    });
  });

  describe('getCustomers()', () => {
    it('should return customers when getCustomers succeeds', async () => {
      const customers = [
        {
          id: 'c-1',
          name: 'Ana',
        },
      ];

      vi.spyOn(CustomerModel, 'findAll').mockResolvedValue({
        data: customers,
        error: null,
      });

      const result = await CustomerService.getCustomers({
        search: 'Ana',
      });

      expect(CustomerModel.findAll).toHaveBeenCalledWith({
        search: 'Ana',
      });

      expect(result).toEqual(customers);
    });
  });

  describe('getCustomerById()', () => {
    it('should throw when the model returns an error', async () => {
      const error = new Error('Customer failed');

      vi.spyOn(CustomerModel, 'findById').mockResolvedValue({
        data: null,
        error,
      });

      await expect(
        CustomerService.getCustomerById('c-1')
      ).rejects.toThrow(error);
    });
  });

  describe('createCustomer()', () => {
    it('should create a customer', async () => {
      vi.spyOn(CustomerModel, 'create').mockResolvedValue({
        data: {
          id: 'c-1',
        },
        error: null,
      });

      const result = await CustomerService.createCustomer({
        name: 'Ana',
        phone: '0917',
      });

      expect(CustomerModel.create).toHaveBeenCalledWith({
        name: 'Ana',
        phone: '0917',
        alt_phone: '',
        facebook: '',
        email: null,
      });

      expect(result).toEqual({
        id: 'c-1',
      });
    });
  });

  describe('updateCustomer()', () => {
    it('should update only provided customer fields', async () => {
      vi.spyOn(CustomerModel, 'update').mockResolvedValue({
        data: {
          id: 'c-1',
          phone: '0999',
        },
        error: null,
      });

      const result = await CustomerService.updateCustomer(
        'c-1',
        {
          phone: '0999',
        }
      );

      expect(CustomerModel.update).toHaveBeenCalledWith(
        'c-1',
        {
          phone: '0999',
        }
      );

      expect(result.phone).toBe('0999');
    });
  });

  describe('deleteCustomer()', () => {
    it('should delete a customer and return its id', async () => {
      vi.spyOn(CustomerModel, 'remove').mockResolvedValue({
        error: null,
      });

      const result = await CustomerService.deleteCustomer(
        'c-1'
      );

      expect(CustomerModel.remove).toHaveBeenCalledWith(
        'c-1'
      );

      expect(result).toEqual({
        id: 'c-1',
      });
    });
  });
});