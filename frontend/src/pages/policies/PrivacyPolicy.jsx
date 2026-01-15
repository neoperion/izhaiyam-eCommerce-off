import React from "react";
import "./policies.css";

export const PrivacyPolicy = () =>
{
    return (
        <div className="policy-container container-page py-12 md:py-16">
            <h1 className="text-3xl font-bold mb-6 text-primary">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: January 15, 2026</p>

            <p className="mb-6">
                IzhaIyam Handloom Furniture we respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website.
            </p>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">1. Information We Collect</h2>

                <h3 className="font-semibold mb-2">a) Personal Information</h3>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Full name</li>
                    <li>Phone number</li>
                    <li>Email address</li>
                    <li>Shipping & billing address</li>
                    <li>Order details</li>
                </ul>

                <h3 className="font-semibold mb-2">b) Payment Information</h3>
                <p className="mb-4 text-gray-700">Payments are processed via secure third-party gateways. We do not store debit/credit card details.</p>

                <h3 className="font-semibold mb-2">c) Technical Data</h3>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Device information</li>
                    <li>Cookies & usage data</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">2. How We Use Your Information</h2>
                <p className="mb-2">We use your information to:</p>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Process orders & deliveries</li>
                    <li>Communicate order updates</li>
                    <li>Provide customer support</li>
                    <li>Improve website performance</li>
                    <li>Prevent fraud & misuse</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">3. Cookies</h2>
                <p className="mb-4 text-gray-700">
                    Cookies help us remember login & preferences and analyze traffic and behavior. You can disable cookies via browser settings.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">4. Data Sharing</h2>
                <p className="mb-2">We only share data with:</p>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Payment gateways</li>
                    <li>Delivery partners</li>
                    <li>Analytics tools</li>
                </ul>
                <p className="mt-2 font-medium">We never sell your personal data.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">5. Data Security</h2>
                <p className="mb-4 text-gray-700">We use industry-standard security measures, but no online platform is 100% secure.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">6. Your Rights</h2>
                <p className="mb-2">You may request access to your data or correction/deletion.</p>
                <p className="mb-4 text-gray-700">📧 Email: <a href="mailto:privacy@izhaiyam.com" className="text-blue-600 hover:underline">privacy@izhaiyam.com</a></p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary">7. Policy Updates</h2>
                <p className="mb-4 text-gray-700">We may update this policy. Changes will be reflected on this page.</p>
            </section>
        </div>
    );
};
