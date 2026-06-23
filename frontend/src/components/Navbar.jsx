import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#4A1F00] text-white">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-10 py-4">

        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="logo"
            className="w-14 h-14 rounded-full"
          />

          <div>
            <h1 className="text-2xl font-bold">
              Aileen Cake Max
            </h1>

            <p className="text-sm tracking-widest">
              BAKE SHOP
            </p>
          </div>
        </div>

        <div className="flex gap-10 text-lg">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
        </div>

      </div>

    </nav>
  );
}