import { NextRequest } from 'next/server';

const NEXT_PUBLIC_BASE_API = process.env.NEXT_PUBLIC_BASE_API || "https://gardening-server.vercel.app/api/v1";

async function handleProxy(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = new URL(`${NEXT_PUBLIC_BASE_API}/${path}`);
  
  // Forward search params
  url.search = request.nextUrl.search;

  // Extract necessary headers, explicitly EXCLUDING 'Origin' and 'Host'
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey !== 'host' && lowerKey !== 'origin' && lowerKey !== 'referer') {
      headers.set(key, value);
    }
  });

  const requestInit: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    const body = await request.text();
    if (body) {
      requestInit.body = body;
    }
  }

  try {
    const response = await fetch(url.toString(), requestInit);
    
    const responseHeaders = new Headers(response.headers);
    // Clean up CORS headers from backend response
    responseHeaders.delete('Access-Control-Allow-Origin');
    responseHeaders.delete('Access-Control-Allow-Methods');
    responseHeaders.delete('Access-Control-Allow-Headers');
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Proxy Error: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
