import { Link } from "react-router-dom";

export default function OrderCTA() {
  return (
    <section className="bg-[#F8F6F3] py-16">
      <div className="max-w-3xl mx-auto text-center">

        <p className="text-2xl text-[#8B6A58] mb-8">
          Want something customized for your special day?
        </p>

        <Link
          to="/menu"
          className="inline-block uppercase tracking-[0.25em] text-[#5A3B2E] border-b border-[#5A3B2E] pb-2 hover:text-[#8B6A58] hover:border-[#8B6A58] transition"
        >
          Start Your Order Here
        </Link>

      </div>
    </section>
  );
}