const {
  CustomerService,
  buildCustomerPayload,
} = require('../../../src/services/customer.service');

const {
  CustomerModel,
} = require('../../../src/model/customer.model');

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

    it('should retain all provided values without falling back to default values', () => {
      const complexInput = {
        name: 'John Doe',
        phone: '0911',
        alt_phone: '0922',
        facebook: 'fb/johndoe',
        email: 'john@example.com',
      };
      expect(buildCustomerPayload(complexInput)).toEqual(complexInput);
    });
  });

  describe('getCustomers()', () => {
    it('should return customers when getCustomers succeeds', async () => {
      const customers = [{ id: 'c-1', name: 'Ana' }];
      vi.spyOn(CustomerModel, 'findAll').mockResolvedValue({
        data: customers,
        error: null,
      });

      const result = await CustomerService.getCustomers({ search: 'Ana' });

      expect(CustomerModel.findAll).toHaveBeenCalledWith({ search: 'Ana' });
      expect(result).toEqual(customers);
    });

    it('should throw an error if the model layer fails during findAll query', async () => {
      const mockError = new Error('Database connection failed');
      vi.spyOn(CustomerModel, 'findAll').mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        CustomerService.getCustomers({ search: 'Ana' })
      ).rejects.toThrow(mockError);
    });
  });

  describe('getCustomerById()', () => {
    it('should return customer record details when entity exists', async () => {
      const mockCustomer = { id: 'c-1', name: 'Ana' };
      vi.spyOn(CustomerModel, 'findById').mockResolvedValue({
        data: mockCustomer,
        error: null,
      });

      const result = await CustomerService.getCustomerById('c-1');

      expect(CustomerModel.findById).toHaveBeenCalledWith('c-1');
      expect(result).toEqual(mockCustomer);
    });

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
        data: { id: 'c-1' },
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
      expect(result).toEqual({ id: 'c-1' });
    });

    it('should abort operational execution and throw if insert row fails', async () => {
      const mockError = new Error('Duplicate entry violation');
      vi.spyOn(CustomerModel, 'create').mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        CustomerService.createCustomer({ name: 'Ana' })
      ).rejects.toThrow(mockError);
    });
  });

  describe('updateCustomer()', () => {
    it('should update only provided customer fields', async () => {
      vi.spyOn(CustomerModel, 'update').mockResolvedValue({
        data: { id: 'c-1', phone: '0999' },
        error: null,
      });

      const result = await CustomerService.updateCustomer('c-1', { phone: '0999' });

      expect(CustomerModel.update).toHaveBeenCalledWith('c-1', { phone: '0999' });
      expect(result.phone).toBe('0999');
    });

    it('should strictly filter out undefined properties from the update payload context', async () => {
      vi.spyOn(CustomerModel, 'update').mockResolvedValue({
        data: { id: 'c-1', name: 'Ana' },
        error: null,
      });

      // Nagpasa ng fields na may kasamang `undefined` keys upang masubukan ang if-conditions
      await CustomerService.updateCustomer('c-1', {
        name: 'Ana',
        phone: undefined,
        facebook: undefined,
      });

      expect(CustomerModel.update).toHaveBeenCalledWith('c-1', {
        name: 'Ana',
      });
    });

    it('should bubble up structural runtime exceptions from the update transaction', async () => {
      const mockError = new Error('Constraint violation');
      vi.spyOn(CustomerModel, 'update').mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        CustomerService.updateCustomer('c-1', { name: 'New Name' })
      ).rejects.toThrow(mockError);
    });
  });

  describe('deleteCustomer()', () => {
    it('should delete a customer and return its id', async () => {
      vi.spyOn(CustomerModel, 'remove').mockResolvedValue({ error: null });

      const result = await CustomerService.deleteCustomer('c-1');

      expect(CustomerModel.remove).toHaveBeenCalledWith('c-1');
      expect(result).toEqual({ id: 'c-1' });
    });

    it('should cascade throw error payload if remove execution results in failure', async () => {
      const mockError = new Error('Row locked error');
      vi.spyOn(CustomerModel, 'remove').mockResolvedValue({
        error: mockError,
      });

      await expect(
        CustomerService.deleteCustomer('c-1')
      ).rejects.toThrow(mockError);
    });
  });
});