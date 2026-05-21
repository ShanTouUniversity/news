export async function POST({ request, locals }) {
  const body = await request.json();
  const token = body?.token;

  if (!token) {
    return new Response(JSON.stringify({ success: false, error: 'Missing token' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const secretKey = import.meta.env.TURNSTILE_SECRET_KEY;
  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);

  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });

  const outcome = await result.json();

  return new Response(JSON.stringify(outcome), {
    headers: { 'Content-Type': 'application/json' },
  });
}
