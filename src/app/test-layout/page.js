"use client"

export default function TestLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Layout Test Page</h1>
          <p className="text-xl text-gray-600 mb-8">
            This page is used to test if the layout is working correctly.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Test Content</h2>
            <p className="text-gray-600">
              This content should be properly centered and aligned. If you can see this text
              centered on the page, then the layout is working correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 