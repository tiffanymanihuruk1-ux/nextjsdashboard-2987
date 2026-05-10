import { sql } from '../lib/db';

type QueryInvoice = {
  amount: number;
  name: string;
};

export const dynamic = 'force-dynamic';

async function listInvoices() {
  return sql<QueryInvoice[]>`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666
    ORDER BY invoices.date DESC
    LIMIT 1;
  `;
}

export async function GET() {
  try {
    return Response.json(await listInvoices(), {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Query route error:', error);

    return Response.json(
      {
        error: 'Failed to fetch data from Neon.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
