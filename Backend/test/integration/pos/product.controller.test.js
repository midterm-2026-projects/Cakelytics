const productServiceModule = require('../../../src/services/product.service');

// "Integration" here means end-to-end mocking of the service layer so we
// validate the controller composes filters, status codes, and response
// shapes correctly — including the dual error-handling paths (delegate to
// Express `next` vs respond inline). Avoids any real DB / HTTP dependency.
productServiceModule.ProductService = {
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
};

const { ProductController } = require('../../../src/controller/product.controller');
const { ProductService } = productServiceModule;

function buildRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe('ProductController (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('builds filters from query and returns 200 with the product list', async () => {
      const products = [{ id: 'p-1', name: 'Ube Cake' }];
      ProductService.getProducts.mockResolvedValue(products);

      const req = { query: { category: 'Cakes', search: 'ube' } };
      const res = buildRes();

      await ProductController.getAllProducts(req, res);

      expect(ProductService.getProducts).toHaveBeenCalledWith({
        category: 'Cakes',
        search: 'ube',
        activeOnly: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: products });
    });

    it('sets activeOnly to false only when the query param is the string "false"', async () => {
      ProductService.getProducts.mockResolvedValue([]);

      const req = { query: { activeOnly: 'false' } };
      const res = buildRes();

      await ProductController.getAllProducts(req, res);

      expect(ProductService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ activeOnly: false })
      );
    });

    it('calls next(err) when next is provided and the service throws', async () => {
      const err = new Error('DB down');
      ProductService.getProducts.mockRejectedValue(err);

      const req = { query: {} };
      const res = buildRes();
      const next = vi.fn();

      await ProductController.getAllProducts(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('responds inline with err.status||500 when no next is provided', async () => {
      const err = new Error('DB down');
      ProductService.getProducts.mockRejectedValue(err);

      const req = { query: {} };
      const res = buildRes();

      await ProductController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'DB down' });
    });

    it('responds inline with a custom err.status when present', async () => {
      const err = Object.assign(new Error('forbidden'), { status: 403 });
      ProductService.getProducts.mockRejectedValue(err);

      const req = { query: {} };
      const res = buildRes();

      await ProductController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('getProductById', () => {
    it('returns 200 with the product when found', async () => {
      const product = { id: 'p-1', name: 'Ube Cake' };
      ProductService.getProductById.mockResolvedValue(product);

      const req = { params: { id: 'p-1' } };
      const res = buildRes();

      await ProductController.getProductById(req, res);

      expect(ProductService.getProductById).toHaveBeenCalledWith('p-1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: product });
    });

    it('returns 404 when the product resolves to null/undefined', async () => {
      ProductService.getProductById.mockResolvedValue(null);

      const req = { params: { id: 'missing-id' } };
      const res = buildRes();

      await ProductController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Product not found' });
    });

    it('preserves a 404 thrown by the service (with message) even when next is provided', async () => {
      const err = Object.assign(new Error('Product not found for id=p-1'), { status: 404 });
      ProductService.getProductById.mockRejectedValue(err);

      const req = { params: { id: 'p-1' } };
      const res = buildRes();
      const next = vi.fn();

      await ProductController.getProductById(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found for id=p-1',
      });
    });

    it('falls back to "Product not found" when a 404 error has no message', async () => {
      const err = Object.assign(new Error(''), { status: 404 });
      ProductService.getProductById.mockRejectedValue(err);

      const req = { params: { id: 'p-1' } };
      const res = buildRes();

      await ProductController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Product not found' });
    });

    it('calls next(err) for non-404 errors when next is provided', async () => {
      const err = new Error('DB down');
      ProductService.getProductById.mockRejectedValue(err);

      const req = { params: { id: 'p-1' } };
      const res = buildRes();
      const next = vi.fn();

      await ProductController.getProductById(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('responds with 500 for non-404 errors when no next is provided', async () => {
      const err = new Error('DB down');
      ProductService.getProductById.mockRejectedValue(err);

      const req = { params: { id: 'p-1' } };
      const res = buildRes();

      await ProductController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'DB down' });
    });
  });

  describe('createProduct', () => {
    it('returns 201 with the created product on success', async () => {
      const body = { name: 'Ube Cake', category: 'Cakes' };
      const created = { id: 'p-1', ...body };
      ProductService.createProduct.mockResolvedValue(created);

      const req = { body };
      const res = buildRes();

      await ProductController.createProduct(req, res);

      expect(ProductService.createProduct).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: created });
    });

    it('calls next(err) when next is provided and the service throws', async () => {
      const err = new Error('bad payload');
      ProductService.createProduct.mockRejectedValue(err);

      const req = { body: {} };
      const res = buildRes();
      const next = vi.fn();

      await ProductController.createProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('responds inline with err.status||400 when no next is provided', async () => {
      const err = new Error('bad payload');
      ProductService.createProduct.mockRejectedValue(err);

      const req = { body: {} };
      const res = buildRes();

      await ProductController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'bad payload' });
    });

    it('responds inline with a custom err.status when present', async () => {
      const err = Object.assign(new Error('conflict'), { status: 409 });
      ProductService.createProduct.mockRejectedValue(err);

      const req = { body: {} };
      const res = buildRes();

      await ProductController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('updateProduct', () => {
    it('returns 200 with the updated product on success', async () => {
      const updated = { id: 'p-1', price: 99 };
      ProductService.updateProduct.mockResolvedValue(updated);

      const req = { params: { id: 'p-1' }, body: { price: 99 } };
      const res = buildRes();

      await ProductController.updateProduct(req, res);

      expect(ProductService.updateProduct).toHaveBeenCalledWith('p-1', { price: 99 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: updated });
    });

    it('calls next(err) when next is provided and the service throws', async () => {
      const err = new Error('not found');
      ProductService.updateProduct.mockRejectedValue(err);

      const req = { params: { id: 'p-1' }, body: {} };
      const res = buildRes();
      const next = vi.fn();

      await ProductController.updateProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('responds inline with err.status||400 when no next is provided', async () => {
      const err = Object.assign(new Error('Product not found for id=p-1'), { status: 404 });
      ProductService.updateProduct.mockRejectedValue(err);

      const req = { params: { id: 'p-1' }, body: {} };
      const res = buildRes();

      await ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found for id=p-1',
      });
    });
  });

  describe('deleteProduct', () => {
    it('returns 200 with the deleted product on success', async () => {
      const deleted = { id: 'p-1' };
      ProductService.deleteProduct.mockResolvedValue(deleted);

      const req = { params: { id: 'p-1' } };
      const res = buildRes();

      await ProductController.deleteProduct(req, res);

      expect(ProductService.deleteProduct).toHaveBeenCalledWith('p-1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: deleted });
    });

    it('calls next(err) when next is provided and the service throws', async () => {
      const err = new Error('not found');
      ProductService.deleteProduct.mockRejectedValue(err);

      const req = { params: { id: 'p-1' } };
      const res = buildRes();
      const next = vi.fn();

      await ProductController.deleteProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('responds inline with err.status||400 when no next is provided', async () => {
      const err = Object.assign(new Error('Product not found for id=p-1'), { status: 404 });
      ProductService.deleteProduct.mockRejectedValue(err);

      const req = { params: { id: 'p-1' } };
      const res = buildRes();

      await ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found for id=p-1',
      });
    });
  });
});