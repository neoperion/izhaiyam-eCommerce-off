import React from "react";
import "./policies.css";

export const ReturnRefundPolicy = () =>
{
    return (
        <div className="policy-container container-page py-12 md:py-16">
            <h1 className="text-3xl font-bold mb-6 text-primary">Return & Refund Policy</h1>
            <p className="mb-6">
                We stand behind our products. However, furniture is sensitive — so rules matter.
            </p>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">1. Eligibility for Return</h2>
                <p className="mb-2">Returns are accepted within 7 days of delivery only if:</p>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Item is damaged</li>
                    <li>Item is defective</li>
                    <li>Wrong item delivered</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">2. Non-Returnable Items</h2>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Custom-made furniture</li>
                    <li>Used or assembled products</li>
                    <li>Items damaged due to misuse</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">3. Return Process</h2>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Email <a href="mailto:support@izhaiyam.com" className="text-blue-600 hover:underline">support@izhaiyam.com</a> within 7 days</li>
                    <li>Share order ID + photos/videos</li>
                    <li>Our team will inspect & approve</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">4. Refund Timeline</h2>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Approved refunds processed within 7–10 business days</li>
                    <li>Refunds credited to original payment method</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">5. Pickup</h2>
                <p className="mb-4 text-gray-700">Pickup availability depends on location. In some cases, customer may need to self-ship.</p>
            </section>
        </div>
    );
};
