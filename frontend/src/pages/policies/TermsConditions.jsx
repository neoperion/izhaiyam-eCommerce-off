import React from "react";
import "./policies.css";

export const TermsConditions = () =>
{
    return (
        <div className="policy-container container-page py-12 md:py-16">
            <h1 className="text-3xl font-bold mb-6 text-primary">Terms & Conditions</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: January 15, 2026</p>

            <p className="mb-6">
                By accessing or purchasing from izhaiyam.com, you agree to these Terms & Conditions.
            </p>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">1. Eligibility</h2>
                <p className="mb-4 text-gray-700">You must be at least 18 years old to place an order.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">2. Use of Website</h2>
                <p className="mb-2">You agree not to:</p>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Misuse the website</li>
                    <li>Attempt hacking or scraping</li>
                    <li>Violate any laws</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">3. Product Information</h2>
                <p className="mb-4 text-gray-700">
                    We try our best to display accurate images and descriptions. Minor variations in color, texture, or finish may occur due to lighting or material nature (especially furniture).
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">4. Pricing & Payments</h2>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Prices are inclusive of applicable taxes</li>
                    <li>Payments must be completed before order confirmation</li>
                    <li>We reserve the right to correct pricing errors</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">5. Intellectual Property</h2>
                <p className="mb-4 text-gray-700">All website content belongs to izhaiyam.com. Unauthorized use is prohibited.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">6. Limitation of Liability</h2>
                <p className="mb-4 text-gray-700">Our liability shall not exceed the value of the order placed.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">7. Governing Law</h2>
                <p className="mb-4 text-gray-700">These terms are governed by the laws of India.</p>
            </section>
        </div>
    );
};
