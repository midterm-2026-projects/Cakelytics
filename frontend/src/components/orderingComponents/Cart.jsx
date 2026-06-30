import { useNavigate } from 'react-router-dom';

function formatMoney(value) {
  return `₱${value.toFixed(2)}`;
}

export default function Cart({ cart = [], setCart }) {
  const navigate = useNavigate();

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (window.confirm('Proceed to checkout?')) {
      navigate('/checkout');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="rounded-xl border border-brand-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
        <p className="text-gray-600">Your cart is empty.</p>
        <p className="text-gray-500">Add items from the menu.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{formatMoney(item.price)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded px-3 py-1 text-sm border border-slate-300"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  className="rounded px-3 py-1 text-sm border border-slate-300"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm text-gray-600">
              <p>{formatMoney(item.price * item.quantity)}</p>
              <button
                type="button"
                className="text-sm text-red-600 hover:underline"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-slate-200 pt-4 flex items-center justify-between">
        <p className="font-semibold">Total:</p>
        <p className="text-lg font-bold">{formatMoney(total)}</p>
      </div>
      <button
        type="button"
        onClick={handleCheckout}
        className="mt-4 w-full rounded-lg bg-brand-700 px-4 py-3 text-white hover:bg-brand-800"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
