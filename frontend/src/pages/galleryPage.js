import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { NavTabs } from '../components/headerSection/navTabs';
import FooterSection from '../components/footerSection';
import heroImage from '../assets/image.png';

export default function GalleryPage() {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const galleryRef = useRef(null);
    const offsetRef = useRef(0);
    const velocityRef = useRef(0);
    const lastTimestampRef = useRef(null);
    const rafRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const galleryImages = [
        { id: 1, src: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500&h=400&fit=crop', alt: 'Gallery 1', username: 'design_studio', userAvatar: 'DS', instagramUrl: 'https://www.instagram.com/p/example1/' },
        { id: 2, src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop', alt: 'Gallery 2', username: 'creative_works', userAvatar: 'CW', instagramUrl: 'https://www.instagram.com/p/example2/' },
        { id: 3, src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop', alt: 'Gallery 3', username: 'art_collective', userAvatar: 'AC', instagramUrl: 'https://www.instagram.com/p/example3/' },
        { id: 4, src: 'https://images.unsplash.com/photo-1561637404-35e2e9a01cda?w=500&h=400&fit=crop', alt: 'Gallery 4', username: 'modern_designs', userAvatar: 'MD', instagramUrl: 'https://www.instagram.com/p/example4/' },
        { id: 5, src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop', alt: 'Gallery 5', username: 'visual_stories', userAvatar: 'VS', instagramUrl: 'https://www.instagram.com/p/example5/' },
        { id: 6, src: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=400&fit=crop', alt: 'Gallery 6', username: 'photo_gallery', userAvatar: 'PG', instagramUrl: 'https://www.instagram.com/p/example6/' },
        { id: 7, src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop', alt: 'Gallery 7', username: 'creative_hub', userAvatar: 'CH', instagramUrl: 'https://www.instagram.com/p/example7/' },
        { id: 8, src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop', alt: 'Gallery 8', username: 'studio_works', userAvatar: 'SW', instagramUrl: 'https://www.instagram.com/p/example8/' },
    ];

    const videos = [
        { id: 1, title: 'Best Data Structures & Algorithms (DSA) Course - Clear Any FAANG Interview', youtubeId: 'dQw4w9WgXcQ', description: 'Complete DSA course for interviews' },
        { id: 2, title: 'Java vs C++ for Data Structures & Algorithms', youtubeId: 'jNQXAC9IVRw', description: 'Comparison and best practices' },
        { id: 3, title: 'How I Cleared My Google Interviews - Use LeetCode Effectively', youtubeId: '9bZkp7q19f0', description: 'Interview preparation tips' },
        { id: 4, title: 'Complete Git and GitHub Tutorial', youtubeId: 'kJQP7kiw5Fk', description: 'Version control mastery' },
        { id: 5, title: 'System Design Interview Preparation', youtubeId: 'OPf0YbXqDm0', description: 'Design scalable systems' },
        { id: 6, title: 'Dynamic Programming Patterns for Coding Interviews', youtubeId: 'oBt53YbR9Kk', description: 'Master DP concepts' },
        { id: 7, title: 'Complete Web Development Bootcamp 2024', youtubeId: 'rfscVS0vtbw', description: 'Full stack development' },
        { id: 8, title: 'React JS Full Course for Beginners', youtubeId: 'bMknfKXIFA8', description: 'Learn React from scratch' },
        { id: 9, title: 'Docker Tutorial for Beginners - DevOps Made Easy', youtubeId: 'fqMOX6JJhGo', description: 'Containerization basics' },
        { id: 10, title: 'Kubernetes Crash Course - Deploy Apps Fast', youtubeId: 'X48VuDVv0do', description: 'Container orchestration' },
        { id: 11, title: 'Python for Data Science and Machine Learning', youtubeId: 'LHBE6Q9XlzI', description: 'ML fundamentals' },
        { id: 12, title: 'AWS Cloud Practitioner Certification Course', youtubeId: '3hLmDS179YE', description: 'Cloud computing basics' },
        { id: 13, title: 'SQL Tutorial - Full Database Course for Beginners', youtubeId: 'HXV3zeQKqGY', description: 'Database management' },
        { id: 14, title: 'Node.js and Express.js - Full Backend Course', youtubeId: 'Oe421EPjeBE', description: 'Backend development' },
        { id: 15, title: 'TypeScript Tutorial - Complete Guide', youtubeId: 'BwuLxPH8IDs', description: 'Type-safe JavaScript' },
    ];

    const speed = 50; // pixels per second
    const SMOOTH_TAU = 0.25;

    // Initialize with first video
    useEffect(() => {
        if (!selectedVideo && videos.length > 0) {
            setSelectedVideo(videos[0]);
        }
    }, []);

    // Auto-scroll loop animation (similar to testimonials)
    useEffect(() => {
        const track = galleryRef.current;
        if (!track) return;

        const cards = track.querySelectorAll('.gallery-card');
        if (cards.length === 0) return;

        const cardWidth = cards[0].offsetWidth + 24; // include gap
        const totalWidth = cardWidth * galleryImages.length;

        const animate = (timestamp) => {
            if (lastTimestampRef.current === null) {
                lastTimestampRef.current = timestamp;
            }

            const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
            lastTimestampRef.current = timestamp;

            const target = isHovered ? 0 : speed;

            const easingFactor = 1 - Math.exp(-deltaTime / SMOOTH_TAU);
            velocityRef.current += (target - velocityRef.current) * easingFactor;

            if (totalWidth > 0) {
                let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
                nextOffset = ((nextOffset % totalWidth) + totalWidth) % totalWidth;
                offsetRef.current = nextOffset;

                track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
            lastTimestampRef.current = null;
        };
    }, [isHovered, galleryImages.length]);

    const scroll = (direction) => {
        if (galleryRef.current) {
            const scrollAmount = 420;
            if (direction === 'left') {
                galleryRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                galleryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="w-full bg-white">
            {/* Navbar */}
            <NavTabs />

            {/* Hero Section - Fixed below navbar */}
            <section className="relative w-full h-screen overflow-hidden -mt-16 pt-16">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${heroImage})`,
                    }}
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* Banner Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                    <h1 className="font-inter text-5xl md:text-7xl font-bold mb-4">Creative Excellence</h1>
                    <p className="font-inter text-lg md:text-2xl font-light mb-8 max-w-2xl">Showcasing our latest work and innovative projects</p>
                    <button className="font-inter px-8 py-3 bg-[#93a267] hover:bg-[#7d8c56] text-white font-semibold rounded-lg transition transform hover:scale-105">
                        Explore Now
                    </button>
                </div>
            </section>

            {/* View Our Works Section */}
            <section id="gallery" className="py-20 bg-[#FFF7F2]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Heading */}
                    <div className="text-center mb-16">
                        <h2 className="font-inter text-4xl md:text-5xl font-bold text-gray-900 mb-4">View Our Works</h2>
                        <p className="font-inter text-gray-600 text-lg">Discover our latest creative projects and designs</p>
                    </div>

                    {/* Instagram-style Gallery Slider with Auto-scroll */}
                    <div className="relative group overflow-hidden">
                        {/* Gallery Container */}
                        <div
                            className="flex gap-6"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div
                                ref={galleryRef}
                                className="flex gap-6"
                                style={{ willChange: 'transform' }}
                            >
                                {/* Duplicate images for seamless loop */}
                                {[...galleryImages, ...galleryImages].map((image, index) => (
                                    <div
                                        key={`${image.id}-${index}`}
                                        className="gallery-card flex-shrink-0 w-[400px] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                                    >
                                        {/* Instagram Header */}
                                        <div className="flex items-center justify-between p-3 bg-white">
                                            <div className="flex items-center gap-2">
                                                {/* User Avatar */}
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                        <span className="text-xs font-inter font-semibold text-gray-700">{image.userAvatar}</span>
                                                    </div>
                                                </div>
                                                {/* Username */}
                                                <span className="font-inter font-semibold text-sm text-gray-900">{image.username}</span>
                                            </div>
                                            {/* Three Dots Menu */}
                                            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="5" r="2" />
                                                    <circle cx="12" cy="12" r="2" />
                                                    <circle cx="12" cy="19" r="2" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Image */}
                                        <a
                                            href={image.instagramUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="relative w-full h-[400px] block group/img"
                                        >
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="w-full h-full object-cover"
                                            />
                                        </a>

                                        {/* Instagram Actions Footer */}
                                        <div className="p-3 bg-white">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-4">
                                                    {/* Like Button */}
                                                    <button className="hover:opacity-50 transition-opacity">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                        </svg>
                                                    </button>
                                                    {/* Comment Button */}
                                                    <button className="hover:opacity-50 transition-opacity">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                                        </svg>
                                                    </button>
                                                    {/* Share Button */}
                                                    <button className="hover:opacity-50 transition-opacity">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {/* Bookmark Button */}
                                                <button className="hover:opacity-50 transition-opacity">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg p-3 rounded-full text-gray-900 hover:bg-gray-100 transition z-10 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg p-3 rounded-full text-gray-900 hover:bg-gray-100 transition z-10 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                </div>
            </section>

            {/* Video Content Section with YouTube */}
            <section id="videos" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-inter text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">Featured Videos</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main YouTube Video Player */}
                        <div className="lg:col-span-2">
                            <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    key={selectedVideo?.youtubeId}
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${selectedVideo?.youtubeId}`}
                                    title={selectedVideo?.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-inter text-2xl font-bold text-gray-900 mb-2">{selectedVideo?.title}</h3>
                                <p className="font-inter text-gray-600">{selectedVideo?.description}</p>
                            </div>
                        </div>

                        {/* Related Videos Sidebar - YouTube Style */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-inter text-xl font-semibold text-gray-900 mb-2">Related Videos</h3>
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {videos.slice(1).map((video, index) => (
                                    <div
                                        key={video.id}
                                        className="flex gap-2 cursor-pointer group/video transition"
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        {/* Number Badge */}
                                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                            <span className="font-inter text-sm font-semibold text-gray-600">{index + 1}</span>
                                        </div>

                                        {/* Thumbnail */}
                                        <div className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden bg-gray-200 group-hover/video:ring-2 group-hover/video:ring-[#93a267] transition-all">
                                            <img
                                                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Duration Badge */}
                                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-inter font-semibold px-1.5 py-0.5 rounded">
                                                {Math.floor(Math.random() * 20 + 5)}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                                            </div>
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/0 group-hover/video:bg-black/10 transition-colors"></div>
                                        </div>

                                        {/* Video Info */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-inter font-medium text-sm text-gray-900 line-clamp-2 leading-tight group-hover/video:text-[#93a267] transition-colors">
                                                {video.title}
                                            </h4>
                                            <p className="font-inter text-xs text-gray-600 mt-1">Kunal Kushwaha</p>
                                            <p className="font-inter text-xs text-gray-500 mt-0.5">
                                                {Math.floor(Math.random() * 500 + 100)}K views • {Math.floor(Math.random() * 30 + 1)} days ago
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <FooterSection />

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
        </div>
    );
}
