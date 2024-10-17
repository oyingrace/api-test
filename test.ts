export async function GET() {
  try {
    return new Response('Hello, world!');
  } catch (error) {
    console.error('Error in GET function:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

  