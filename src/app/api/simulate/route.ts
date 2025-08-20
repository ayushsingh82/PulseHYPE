import { NextRequest, NextResponse } from 'next/server';
import { HyperEVMSimulator } from '../../simulator/enhanced-helper';

// Helper function to serialize BigInt values in objects
function serializeBigInt(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === 'object') {
    const serialized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeBigInt(value);
    }
    return serialized;
  }
  return obj;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transaction, options = {} } = body;

    // Initialize simulator
    const simulator = new HyperEVMSimulator(options.network || 'mainnet');

    // Handle different simulation types
    switch (options.simulationType) {
      case 'bundle':
        const bundleResults = await simulator.simulateBundle(transaction.transactions);
        return NextResponse.json(serializeBigInt({
          success: true,
          type: 'bundle',
          results: bundleResults,
          timestamp: Date.now()
        }));

      case 'historical':
        const historicalResult = await simulator.simulateHistorical(transaction, options.blockNumber);
        return NextResponse.json(serializeBigInt({
          success: true,
          type: 'historical',
          result: historicalResult,
          blockNumber: options.blockNumber,
          timestamp: Date.now()
        }));

      case 'state_override':
        const overrideResult = await simulator.simulateWithStateOverrides(transaction, options.stateOverrides);
        return NextResponse.json(serializeBigInt({
          success: true,
          type: 'state_override',
          result: overrideResult,
          overrides: options.stateOverrides,
          timestamp: Date.now()
        }));

      default:
        // Standard simulation
        const result = await simulator.simulateTransaction(transaction);
        return NextResponse.json(serializeBigInt({
          success: true,
          type: 'standard',
          result,
          timestamp: Date.now()
        }));
    }
  } catch (error: unknown) {
    console.error('Simulation API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Simulation failed';
    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: Date.now()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shareId = searchParams.get('shareId');

  if (shareId) {
    // In a real implementation, you'd fetch from a database
    // For now, return a mock response
    return NextResponse.json({
      success: true,
      shareId,
      message: 'Shared simulation results would be retrieved here',
      timestamp: Date.now()
    });
  }

  return NextResponse.json({
    success: true,
    message: 'HyperEVM Simulation API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/simulate - Execute transaction simulation',
      GET: '/api/simulate?shareId=xxx - Retrieve shared results'
    }
  });
}
