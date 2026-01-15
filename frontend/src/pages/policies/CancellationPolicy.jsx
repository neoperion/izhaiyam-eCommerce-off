import React from "react";
import "./policies.css";

export const CancellationPolicy = () =>
{
    return (
        <div className="policy-container container-page py-12 md:py-16">
            <h1 className="text-3xl font-bold mb-6 text-primary">Order Cancellation Policy</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">1. Cancellation Before Dispatch</h2>
                <p className="mb-4 text-gray-700">Orders can be canceled before dispatch with full refund.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">2. Cancellation After Dispatch</h2>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Orders cannot be canceled after dispatch</li>
                    <li>Customers may follow the Return Policy (if applicable)</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">3. How to Cancel</h2>
                <p className="mb-4 text-gray-700">
                    📧 Email: <a href="mailto:support@izhaiyam.com" className="text-blue-600 hover:underline">support@izhaiyam.com</a>
                </p>
                <p className="mb-4 text-gray-700">Include: Order ID + reason</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">4. Refunds for Cancellations</h2>
                <p className="mb-4 text-gray-700">Approved cancellations are refunded within 7–10 business days.</p>
            </section>
        </div>
    );
};
