"use client";

import { useState } from 'react';

export default function SetupDBPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const setupDatabase = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Setup failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Setup</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4 text-gray-600">
          This will set up your database with initial data including admin users, students, teachers, and other sample data.
        </p>
        
        <button
          onClick={setupDatabase}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Setting up database...' : 'Setup Database'}
        </button>

        {isLoading && (
          <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-blue-800">Setting up database... This may take a few minutes.</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
            <h3 className="font-semibold text-red-800">Error:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
            <h3 className="font-semibold text-green-800">Success:</h3>
            <p className="text-green-600">{result.message}</p>
            {result.counts && (
              <div className="mt-2">
                <h4 className="font-medium text-green-800">Data Counts:</h4>
                <ul className="text-sm text-green-700">
                  <li>Admins: {result.counts.admins}</li>
                  <li>Students: {result.counts.students}</li>
                  <li>Teachers: {result.counts.teachers}</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {result && result.success && (
          <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
            <h3 className="font-semibold text-yellow-800">Login Credentials:</h3>
            <p className="text-yellow-700 text-sm">
              You can now log in with any of these admin accounts:
            </p>
            <ul className="text-sm text-yellow-700 mt-2">
              <li>Username: <strong>admin1</strong> | Password: <strong>Dayesh@123</strong></li>
              <li>Username: <strong>admin2</strong> | Password: <strong>Dayesh@123</strong></li>
            </ul>
            <p className="text-yellow-700 text-sm mt-2">
              Or try student/teacher accounts: <strong>student1</strong> / <strong>teacher1</strong> with password <strong>Dayesh@123</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
