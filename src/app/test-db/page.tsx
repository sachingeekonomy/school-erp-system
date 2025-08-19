import { NextResponse } from 'next/server';

async function testDatabase() {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/check-db`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default async function TestDBPage() {
  const dbTest = await testDatabase();
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
        
        <div className="space-y-4">
          <div>
            <strong>Success:</strong> {dbTest.success ? '✅ Yes' : '❌ No'}
          </div>
          
          <div>
            <strong>Message:</strong> {dbTest.message || 'No message'}
          </div>
          
          <div>
            <strong>Database URL Set:</strong> {dbTest.databaseUrl || 'Unknown'}
          </div>
          
          <div>
            <strong>Node Environment:</strong> {dbTest.nodeEnv || 'Unknown'}
          </div>
          
          {dbTest.error && (
            <div className="bg-red-50 p-4 rounded border border-red-200">
              <strong>Error:</strong> {dbTest.error}
            </div>
          )}
          
          {dbTest.code && (
            <div>
              <strong>Error Code:</strong> {dbTest.code}
            </div>
          )}
          
          {dbTest.adminCount !== undefined && (
            <div>
              <strong>Admin Count:</strong> {dbTest.adminCount}
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
          <h3 className="font-semibold mb-2">Environment Variables Check:</h3>
          <div className="text-sm space-y-1">
            <div>DATABASE_URL: {process.env.DATABASE_URL ? '✅ Set' : '❌ Not Set'}</div>
            <div>NODE_ENV: {process.env.NODE_ENV || 'Not Set'}</div>
            <div>VERCEL_URL: {process.env.VERCEL_URL || 'Not Set'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
