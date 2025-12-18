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
                // Fetch only featured products, limit to 4
                const { data } = await axios.get('/api/v1/products?featured=true&limit=4');
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

                {/* Grid / Swipeable Container */}
                <div className="
                    flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-4 
                    sm:grid sm:grid-cols-2 sm:gap-6 sm:pb-0 sm:mx-0 sm:px-0
                    lg:grid-cols-4 lg:gap-8
                    scrollbar-hide
                ">
                    {loading ? (
                        // Skeleton Loading
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="min-w-[85%] sm:min-w-0 snap-center bg-white rounded-[20px] h-[400px] animate-pulse">
                                <div className="h-2/3 bg-gray-200 w-full rounded-t-[20px]" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 w-3/4 rounded" />
                                    <div className="h-4 bg-gray-200 w-1/2 rounded" />
                                </div>
                            </div>
                        ))
                    ) : (
                        products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className="min-w-[85%] sm:min-w-auto snap-center h-full">
                                    <FeaturedProductCard
                                        product={product}
                                        toggleWishlist={toggleWishlist}
                                        isWishlisted={wishlist.includes(product._id)}
                                    />
                                </div>
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
