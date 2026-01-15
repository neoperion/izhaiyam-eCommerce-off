import React from "react";
import "./policies.css";

export const ShippingPolicy = () =>
{
    return (
        <div className="policy-container container-page py-12 md:py-16">
            <h1 className="text-3xl font-bold mb-6 text-primary">Shipping Policy</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">1. Delivery Locations</h2>
                <p className="mb-4 text-gray-700">We currently deliver across select locations in India.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">2. Processing Time</h2>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Order processing: 2–4 business days</li>
                    <li>Delivery timeline: 5–12 business days, depending on location</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">3. Delivery Conditions</h2>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Customer must be available at delivery location</li>
                    <li>Re-delivery charges may apply if delivery fails</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">4. Delays</h2>
                <p className="mb-2">Delays may occur due to:</p>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Weather</li>
                    <li>Logistics issues</li>
                    <li>Natural events</li>
                </ul>
                <p className="mt-2 text-gray-700">IzhaIyam is not liable for delays beyond control.</p>
            </section>
        </div>
    );
};
