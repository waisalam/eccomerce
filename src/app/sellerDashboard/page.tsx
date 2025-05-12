'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
};

export default function SellerDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false); // Button loading state
  const router = useRouter()
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    sellerId: Number(),
  });

  useEffect(() => {
    const storedTOken = localStorage.getItem('token')
    if (!storedTOken) {
      router.push('sellerlogin')
      return
    }
    const decodedId: { id: Number } = jwtDecode(storedTOken)
    const storedSellerId = Number(decodedId.id)
    setProduct((prevProduct) => ({
      ...prevProduct,
      sellerId: storedSellerId || 0,
    }));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('/api/seller/products');
      setData(res.data.product);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'imageurlforeccomerce');

      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dpjgxxynf/image/upload',
          formData
        );

        const imageUrl = res.data.secure_url;
        setProduct((prevProduct) => ({
          ...prevProduct,
          image: imageUrl,
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setButtonLoading(true); // Set button to loading state

    try {
      const res = await axios.post('/api/seller/products', product);
      if (res.status === 201) {
        setData((prevData) => [...prevData, res.data.product]);
      }
      setShowForm(false);
      setProduct((prevProduct) => ({
        name: '',
        description: '',
        price: '',
        image: '',
        sellerId: prevProduct.sellerId,
      }));
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setButtonLoading(false); // Reset button loading state
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
      {/* Navbar */}
     <nav className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold">Seller Dashboard</h1>
  <div className="space-x-4">
    <Button onClick={() => router.push('/')}>Go to Home</Button>
    <Button onClick={() => setShowForm(!showForm)}>
      {showForm ? 'Cancel' : 'Add Product'}
    </Button>
  </div>
</nav>


      {/* Add Product Form */}
      {showForm && (
        <Card className="p-6 rounded-lg space-y-4 max-w-md mx-auto shadow-lg">
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
            />
            <Textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Product Description"
              required
            />
            <Input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
              required
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              name="image"
              required
            />
            <Button type="submit" className="w-full" disabled={buttonLoading}>
              {buttonLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Submitting...
                </span>
              ) : (
                'Submit Product'
              )}
            </Button>
          </form>
        </Card>
      )}

      {/* Products Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center">
            {data.map((item) => (
              <Card
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col p-4 hover:shadow-lg transition-transform duration-1000 hover:scale-105 max-w-xs mx-auto"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover mb-3 rounded"
                />
                <div className="flex-1 flex flex-col">
                  <h3 className="text-md font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-700 mb-1 flex-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-black font-bold text-md">₹{item.price}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
