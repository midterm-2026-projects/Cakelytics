const { SalesService } = require('../../../src/services/sales.service');
const { SalesModel, OrderTransactionModel } = require('../../../src/model/sales.model');
const OrderItemsModel = require('../../../src/model/orderItems.model');


describe('SalesService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return sales when getSales succeeds', async () => {
    const sales = [{ id: 's-1', sale_number: 'SALE-100' }];
    vi.spyOn(SalesModel, 'findAll').mockResolvedValue({ data: sales, error: null });

    const result = await SalesService.getSales(10);

    expect(SalesModel.findAll).toHaveBeenCalledWith(10);
    expect(result).toEqual(sales);
  });

  it('should throw when getSales returns an error', async () => {
    const error = new Error('Database failure');
    vi.spyOn(SalesModel, 'findAll').mockResolvedValue({ data: null, error });

    await expect(SalesService.getSales(5)).rejects.toThrow('Database failure');
  });

  it('should create a sale and order transactions when items are provided', async () => {
    const sale = { id: 's-2', sale_number: 'SALE-101' };
    vi.spyOn(SalesModel, 'create').mockResolvedValue({ data: sale, error: null });
    vi.spyOn(OrderTransactionModel, 'createMany').mockResolvedValue({ data: [], error: null });



    const body = {
      order_id: 'o-1',
      subtotal: 100,
      payment_method: 'cash',
      amount_paid: 120,
      change_due: 20,
      items: [
        { product_id: 'p-1', product_name: 'Cake', quantity: 2, unit_price: 50 },
      ],
    };

    const result = await SalesService.createSale(body);

    expect(SalesModel.create).toHaveBeenCalled();
    // Items line-items insertion happens via OrderTransactionModel in SalesService.

    expect(OrderTransactionModel.createMany).toHaveBeenCalled();


    expect(result).toEqual(sale);
  });

  it('should create a sale without transactions when no items are provided', async () => {
    const sale = { id: 's-3', sale_number: 'SALE-102' };
    vi.spyOn(SalesModel, 'create').mockResolvedValue({ data: sale, error: null });
    const body = { order_id: 'o-2', subtotal: 80, items: [] };

    const result = await SalesService.createSale(body);

    expect(SalesModel.create).toHaveBeenCalled();
    expect(result).toEqual(sale);
  });

  it('should throw when createSale fails to create the sale', async () => {
    const error = new Error('Sale failed');
    vi.spyOn(SalesModel, 'create').mockResolvedValue({ data: null, error });

    await expect(SalesService.createSale({ order_id: 'o-3' })).rejects.toThrow('Sale failed');
  });

  it('should throw when creating transactions fails', async () => {
    const sale = { id: 's-4', sale_number: 'SALE-103' };
    vi.spyOn(SalesModel, 'create').mockResolvedValue({ data: sale, error: null });
    // SalesService actually calls OrderTransactionModel.createMany

    vi.spyOn(OrderTransactionModel, 'createMany').mockResolvedValue({ data: null, error: new Error('Transaction fail') });




    const body = { 
        order_id: 'o-3', 
        items: [{ product_id: 'p-1', product_name: 'Cake', quantity: 1, unit_price: 50 }] 
    };

    await expect(SalesService.createSale(body)).rejects.toThrow('Transaction fail');
  });
});
//princes