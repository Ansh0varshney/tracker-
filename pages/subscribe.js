import React from 'react';

export default function Subscribe() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">Subscription Limit Reached</h1>
        <p className="text-gray-700 mb-6">
          You've reached the limit of <strong>1 campaign</strong> for your current plan.
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Want to create more campaigns? Contact <strong>Ansh</strong> to upgrade your plan and unlock more features!
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
          Contact Ansh
        </button>
      </div>
    </div>
  );
}
