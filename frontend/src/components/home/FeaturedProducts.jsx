import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import FeaturedProductCard from './FeaturedProductCard';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                // Fetch only featured products, limit to 6
                const { data } = await axios.get('/api/v1/products?featured=true&limit=6');
                setProducts(data.products || []);
            } catch (error) {
                console.error('Failed to fetch featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const toggleWishlist = (id) => {
        // This is a local toggle for now, usually needs API call to update user wishlist
        setWishlist((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // if (!loading && products.length === 0) {
    //     return null; 
    // }

    console.log('Featured Products:', products);

    return (
        <section className="py-20 px-4 sm:px-8 bg-[#FDFBF7]">
            {/* Premium background color - warm beige/ivory tone */}
            <div className="max-w-7xl mx-auto">

                {/* Header content */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <div className="mb-3">
                            <span className="font-inter text-xs font-bold tracking-[0.2em] text-[#93a267] uppercase">Curated Selection</span>
                        </div>
                        <h2 className="font-inter text-4xl md:text-5xl font-serif font-medium text-gray-900">
                            Featured Products
                        </h2>
                    </div>
                    <div className="flex justify-end">
                        <NavLink
                            to="/shop"
                            className="group inline-flex items-center gap-2 text-[#93a267] font-semibold tracking-wide hover:text-[#7a8a55] transition-colors"
                        >
                            <span>View All Products</span>
                            <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                        </NavLink>
                    </div>
                </div>

                {/* Grid Layout - 2 Rows x 3 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {loading ? (
                        // Skeleton Loading - 6 cards for 2x3 grid
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl h-[450px] animate-pulse">
                                <div className="h-2/3 bg-gray-200 w-full rounded-t-2xl" />
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-gray-200 w-3/4 rounded" />
                                    <div className="h-4 bg-gray-200 w-1/2 rounded" />
                                </div>
                            </div>
                        ))
                    ) : (
                        products.length > 0 ? (
                            // Display only first 6 products for 2x3 grid
                            products.slice(0, 6).map((product) => (
                                <FeaturedProductCard
                                    key={product._id}
                                    product={product}
                                    toggleWishlist={toggleWishlist}
                                    isWishlisted={wishlist.includes(product._id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center space-y-3">
                                <p className="text-gray-400 italic font-medium">No featured products found.</p>
                                <p className="text-sm text-gray-400">Mark items as "Featured" in the Admin Panel to display them here.</p>
                            </div>
                        )
                    )}
                </div>

                {/* Mobile "View All" Button */}
                <div className="mt-10 md:hidden flex justify-center">
                    <NavLink
                        to="/shop"
                        className="inline-flex items-center bg-[#93a267] text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-[#7a8a55] transition-colors"
                    >
                        View All Products
                    </NavLink>
                </div>

            </div>
        </section>
    );
};

export default FeaturedProducts;
