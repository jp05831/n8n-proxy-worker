addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, api_key'
      }
    })
  }

  const url = new URL(request.url)
  const path = url.pathname.toLowerCase()

  const targetUrls = {
    '/onboarding': 'https://looplyco.app.n8n.cloud/webhook/6255551a-3608-4f5f-8b1b-99d1deb8690e',
    '/optimizer': 'https://looplyco.app.n8n.cloud/webhook/96ecfd3c-9791-4fc1-8eb6-f037a9276c2c',
    '/video':     'https://looplyco.app.n8n.cloud/webhook/81d58d0b-d3cd-4b36-8ad9-93f1df6700a4',
    '/campaign':  'https://looplyco.app.n8n.cloud/webhook/f7f7f307-6bc3-403f-903e-e533a3825fba'
  }

  const targetUrl = targetUrls[path] || targetUrls['/onboarding']

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow'
  })

  const response = await fetch(proxyRequest)

  const newHeaders = new Headers(response.headers)
  newHeaders.set('Access-Control-Allow-Origin', '*')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
