import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({
    title,
    description,
    canonical,
    type = 'website',
    name = 'Izhaiyam Handloom Furniture',
    image,
    data
}) =>
{
    const siteUrl = 'https://www.izhaiyam.com';
    const currentUrl = canonical || siteUrl;
    const defaultDescription = "Shop premium handcrafted wooden furniture made by skilled artisans. Sustainable, durable, and timeless designs for modern homes.";
    const metaDescription = description || defaultDescription;
    const metaTitle = title ? `${title} | ${name}` : name;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            {image && <meta name="twitter:image" content={image} />}

            {/* Structured Data (JSON-LD) - Organization */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Izhaiyam Handloom Furniture",
                    "url": siteUrl,
                    "logo": `${siteUrl}/logo.jpg`,
                    "sameAs": [
                        "https://www.facebook.com/rithanyahandicrafts.kayirukattil",
                        "https://www.instagram.com/izhaiyam_handloom_furnitures/"
                    ],
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+91-88256-03528",
                        "contactType": "customer service",
                        "areaServed": "IN",
                        "availableLanguage": "en"
                    }
                })}
            </script>

            {/* Additional Structured Data (JSON-LD) */}
            {data && (
                <script type="application/ld+json">
                    {JSON.stringify(data)}
                </script>
            )}
        </Helmet>
    );
};
