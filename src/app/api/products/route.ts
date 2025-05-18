import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('http://localhost:8080/products');
    return new Response(JSON.stringify(response.data), {
      status: 200,
    });
  } catch (error) {
    console.error(error)
    return new Response('Error fetching products', { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    
    const data = await req.json();

    const response = await axios.post('http://localhost:8080/products', data);
    return new Response(JSON.stringify(response.data), {
      status: 200,
    });
  } catch (error) {
    console.error(error)
    return new Response('Error create product', { status: 500 });
  }
}
