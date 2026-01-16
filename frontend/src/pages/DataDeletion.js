import React from "react";

export const DataDeletion = () => {
    return (
        <div className="container-page py-12 md:py-16">
            <h1 className="text-3xl font-bold mb-6 text-primary">Data Deletion Instructions – IzhaIyam</h1>
            
            <p className="mb-6 text-gray-700">
                IzhaIyam respects your privacy and data rights.
            </p>

            <p className="mb-6 text-gray-700">
                If you want your personal data deleted from our systems, please follow the steps below:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                <ol className="list-decimal ml-5 space-y-4 text-gray-700">
                    <li>
                        <span className="font-semibold">Send an email to</span> <a href="mailto:support@izhaiyam.com" className="text-blue-600 hover:underline">support@izhaiyam.com</a>
                    </li>
                    <li>
                        <span className="font-semibold">Use the subject line:</span> “Data Deletion Request”
                    </li>
                    <li>
                        <span className="font-semibold">Include:</span>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>+91 88256 03528</li>
                            <li><a href="mailto:support@izhaiyam.com" className="text-blue-600 hover:underline">support@izhaiyam.com</a></li>
                            <li>Order ID (if applicable)</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <p className="mb-6 text-gray-700">
                We will verify your request and permanently delete your data within <strong>7–14 business days</strong>, except where retention is required by law.
            </p>

            <div className="mt-8 border-t pt-6">
                <p className="text-gray-700">
                    For questions, contact: <a href="mailto:support@izhaiyam.com" className="text-blue-600 hover:underline">support@izhaiyam.com</a>
                </p>
            </div>
        </div>
    );
};

export default DataDeletion;
