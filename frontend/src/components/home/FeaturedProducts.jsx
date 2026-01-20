import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import FeaturedProductCard from './FeaturedProductCard';
import { useSelector } from 'react-redux';
import API from '../../config';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    // Get wishlist from Redux (same as shop page)
    const { wishlist } = useSelector((state) => state.wishlistAndCartSection);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                // Fetch only featured products, limit to 8 for 2 rows
                const { data } = await axios.get(`${API}/api/v1/products?featured=true&limit=8`);
                setProducts(data.products || []);
            } catch (error) {
                console.error('Failed to fetch featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

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
                        <h2 className="font-inter text-4xl md:text-5xl font-medium text-gray-900">
                            Featured Products
                        </h2>
                    </div>
                    <div className="hidden md:flex justify-end">
                        <NavLink
                            to="/shop"
                            className="group inline-flex items-center gap-2 text-[#93a267] font-semibold tracking-wide hover:text-[#7a8a55] transition-colors"
                        >
                            <span>View All Products</span>
                            <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                        </NavLink>
                    </div>
                </div>

                {/* Responsive Layout: Slider on Mobile/Tablet, Grid on Desktop */}
                <div className="flex overflow-x-auto pb-6 gap-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 scrollbar-hide snap-x snap-mandatory">
                    {loading ? (
                        // Skeleton Loading
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[280px] lg:w-full bg-white rounded-none p-4 animate-pulse snap-center">
                                <div className="aspect-square bg-gray-200 mb-4" />
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 w-3/4 rounded" />
                                    <div className="h-4 bg-gray-200 w-1/2 rounded" />
                                </div>
                            </div>
                        ))
                    ) : (
                        products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[280px] lg:w-full snap-center">
                                    <FeaturedProductCard
                                        product={product}
                                        isWishlisted={wishlist.some(item => item._id === product._id)}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full w-full py-12 flex flex-col items-center justify-center text-center space-y-3">
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

            {/* Hide scrollbar CSS */}
            <style jsx="true">{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default FeaturedProducts;

