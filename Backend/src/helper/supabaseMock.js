// Chainable mock para sa Supabase query builder.
// Lahat ng methods ay nagbabalik ng parehong object (chainable),
// at "thenable" ito kaya pwedeng i-await kahit saan matapos ang chain.
function createChainableMock() {
  const chain = {};
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'order', 'limit', 'single'];

  methods.forEach((m) => {
    chain[m] = vi.fn(() => chain);
  });

  chain.__setResult = (result) => {
    chain.__result = result;
  };

  chain.then = (resolve, reject) => Promise.resolve(chain.__result).then(resolve, reject);

  return chain;
}

module.exports = { createChainableMock };