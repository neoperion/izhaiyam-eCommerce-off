import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Play } from 'lucide-react';
import './InstagramCard.css';
import Logo from '../../assets/logo.jpg';

const InstagramCard = ({ item }) => {
    const { 
        image, 
        link, 
        embedUrl,
        video = false, 
        caption, 
        likes: initialLikes = 0, 
        comments: initialComments = 0 
    } = item;

    // States
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    
    // Error Handling State
    const [imageError, setImageError] = useState(false);

    // Profile Data
    const profile = {
        username: "izhaiyam_handloom",
        location: "Chennai, India",
        image: Logo 
    };

    const handleLike = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isLiked) {
            setLikes(l => Math.max(0, l - 1));
        } else {
            setLikes(l => l + 1);
        }
        setIsLiked(!isLiked);
    };

    const handleSave = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsSaved(!isSaved);
    };

    const toggleExpand = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsExpanded(!isExpanded);
    };

    const openLink = () => {
        if (link) {
            window.open(link, '_blank');
        }
    };

    // Fallback: If image fails, just render the iframe (Native Instagram Embed)
    if (imageError && embedUrl) {
        return (
            <div className="instagram-card-container">
                <iframe 
                    src={embedUrl} 
                    className="w-full h-full border-none" 
                    title="Instagram Post"
                    loading="lazy"
                    style={{ minHeight: '400px' }}
                />
            </div>
        );
    }

    return (
        <article className="instagram-card-container" onClick={openLink}>
            
            {/* Header */}
            <header className="card-header">
                <div className="user-info">
                    <div className="profile-pic-outside">
                        <div className="profile-ring"></div>
                        <img src={profile.image} alt={profile.username} className="profile-pic" />
                    </div>
                    
                    <div className="user-details">
                        <span className="username">{profile.username}</span>
                        {profile.location && <span className="location">{profile.location}</span>}
                    </div>
                </div>
                {/* Options Icon (Could be added here if needed, but keeping clean) */}
            </header>

            {/* Media */}
            <div className="card-media">
                <img 
                    src={image} 
                    alt="Post Content" 
                    className="media-content" 
                    loading="lazy"
                    onError={() => setImageError(true)}
                />
                
                {video && (
                    <div className="play-icon-overlay">
                        <Play size={64} fill="white" color="white" strokeWidth={0} style={{ opacity: 0.8 }} />
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="action-bar">
                <div className="action-left">
                    <button 
                        className={`icon-btn like-btn ${isLiked ? 'liked' : ''}`} 
                        onClick={handleLike}
                        aria-label="Like"
                    >
                        <Heart size={24} fill={isLiked ? "#ed4956" : "none"} strokeWidth={isLiked ? 0 : 1.5} color={isLiked ? "#ed4956" : "#262626"} />
                    </button>
                    
                    <button className="icon-btn" aria-label="Comment">
                        <MessageCircle size={24} strokeWidth={1.5} color="#262626" style={{ transform: 'rotateY(180deg)' }} />
                    </button>
                    
                    <button className="icon-btn" aria-label="Share">
                        <Send size={24} strokeWidth={1.5} color="#262626" style={{ transform: 'rotate(-25deg) translateY(-2px)' }} />
                    </button>
                </div>
                
                <button className="icon-btn" onClick={handleSave} aria-label="Save">
                    <Bookmark size={24} fill={isSaved ? "black" : "none"} strokeWidth={1.5} color="#262626" />
                </button>
            </div>

            {/* Content Section */}
            <div className="card-content">
                {/* Likes */}
                <span className="likes-count">
                    {likes.toLocaleString()} likes
                </span>

                {/* Caption */}
                <div className="caption-line">
                    <span className="caption-username">{profile.username}</span>
                    <span className="caption-text">
                        {isExpanded ? caption : (caption && caption.length > 90 ? caption.substring(0, 90) + '...' : caption)}
                    </span>
                    {/* Only show 'more' if truncated */}
                    {!isExpanded && caption && caption.length > 90 && (
                        <span className="more-link" onClick={toggleExpand}> more</span>
                    )}
                </div>

                {/* Comments Link */}
                <span className="view-comments">
                   View all {initialComments + (Math.floor(Math.random() * 5))} comments
                </span>

                {/* Time */}
                <time className="time-posted" dateTime={new Date().toISOString()}>
                    2 DAYS AGO
                </time>
            </div>
        </article>
    );
};

export default InstagramCard;
