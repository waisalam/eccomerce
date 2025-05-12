'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();

  const handleSellerSignup = () => {
    router.push('/seller-signup');
  };

  const handleUserSignup = () => {
    router.push('/user-signup');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Ecommerce</h1>
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="text-gray-600 hover:text-gray-800 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-600 hover:text-gray-800 transition">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-600 hover:text-gray-800 transition">
                Contact
              </a>
            </li>
            <li>
              <Button onClick={handleUserSignup} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                User Signup
              </Button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen pt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 animate-fade-in">
          Welcome to <span className="text-blue-500">My Ecommerce Store</span>
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-md mb-8 animate-slide-up">
          Buy and sell your favorite products easily. Create your seller account to start selling!
        </p>
        <Button
          onClick={handleSellerSignup}
          className="px-8 py-4 text-lg rounded-2xl shadow-lg bg-blue-500 text-white hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          Seller Signup
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-1000">
            <h3 className="text-xl font-semibold mb-4">Wide Product Range</h3>
            <p className="text-gray-600">
              Explore a wide variety of products across multiple categories, all in one place.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-1000">
            <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
            <p className="text-gray-600">
              Enjoy safe and secure payment options for a seamless shopping experience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-1000">
            <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
            <p className="text-gray-600">
              Get your orders delivered quickly with our reliable delivery partners.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 My Ecommerce Store. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
