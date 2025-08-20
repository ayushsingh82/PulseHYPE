/* eslint-disable @typescript-eslint/no-explicit-any */
import { utils, HyperEVMSimulator } from './enhanced-helper';

// Simple test function to validate our utility functions
export function testUtilityFunctions() {
  console.log('Testing HyperEVM Utility Functions...');
  
  // Test formatHypeAmount with various inputs
  const testCases = [
    { input: '1000000000000000000', expected: '1.000000' }, // 1 HYPE in wei
    { input: '500000000000000000', expected: '0.500000' },  // 0.5 HYPE in wei
    { input: 1000000000000000000, expected: '1.000000' },   // Number input
    { input: '0', expected: '0.000000' },                   // Zero
    { input: '', expected: '0.000000' },                    // Empty string
    { input: '0x', expected: '0.000000' },                  // Empty hex
    { input: 'invalid', expected: '0.000000' },             // Invalid input
  ];
  
  console.log('\n--- Testing formatHypeAmount ---');
  testCases.forEach(({ input, expected }, index) => {
    try {
      const result = utils.formatHypeAmount(input as any);
      const passed = result === expected;
      console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} Input: ${input}, Expected: ${expected}, Got: ${result}`);
    } catch (error) {
      console.log(`Test ${index + 1}: ❌ Error with input ${input}:`, error);
    }
  });
  
  // Test parseHypeAmount
  const parseTestCases = [
    { input: '1', expected: '1000000000000000000' },    // 1 HYPE to wei
    { input: '0.5', expected: '500000000000000000' },   // 0.5 HYPE to wei
    { input: '0', expected: '0' },                      // Zero
    { input: '', expected: '0' },                       // Empty
    { input: 'invalid', expected: '0' },                // Invalid
  ];
  
  console.log('\n--- Testing parseHypeAmount ---');
  parseTestCases.forEach(({ input, expected }, index) => {
    try {
      const result = utils.parseHypeAmount(input);
      const passed = result === expected;
      console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} Input: ${input}, Expected: ${expected}, Got: ${result}`);
    } catch (error) {
      console.log(`Test ${index + 1}: ❌ Error with input ${input}:`, error);
    }
  });
  
  // Test safeBigInt
  const bigIntTestCases = [
    { input: '1000000000000000000', expected: BigInt('1000000000000000000') },
    { input: 1000000000000000000, expected: BigInt('1000000000000000000') },
    { input: '1e+18', expected: BigInt('1000000000000000000') },
    { input: 'invalid', expected: BigInt(0) },
    { input: '', expected: BigInt(0) },
  ];
  
  console.log('\n--- Testing safeBigInt ---');
  bigIntTestCases.forEach(({ input, expected }, index) => {
    try {
      const result = utils.safeBigInt(input);
      const passed = result === expected;
      console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} Input: ${input}, Expected: ${expected.toString()}, Got: ${result.toString()}`);
    } catch (error) {
      console.log(`Test ${index + 1}: ❌ Error with input ${input}:`, error);
    }
  });
  
  console.log('\nUtility function tests completed!');
}

// Test fake simulation
export async function testFakeSimulation() {
  console.log('🎭 Testing Fake Simulation Feature...');
  
  try {
    const simulator = new HyperEVMSimulator('mainnet');
    
    const testRequest = {
      from: '0x742D35Cc6634c0532925A3B8d7C9DD7fEAd9c027',
      to: '0x1234567890123456789012345678901234567890',
      value: '1000000000000000000', // 1 HYPE in wei
      gasLimit: '21000',
      gasPrice: '20',
      fake: true // Enable fake simulation
    };
    
    console.log('Running fake simulation with request:', testRequest);
    
    const result = await simulator.simulateTransaction(testRequest);
    
    console.log('✅ Fake simulation completed!');
    console.log('Result summary:');
    console.log(`- Success: ${result.success}`);
    console.log(`- Status: ${result.executionResult.status}`);
    console.log(`- Gas Used: ${result.gasUsed}`);
    console.log(`- Block Number: ${result.blockNumber}`);
    console.log(`- State Changes: ${result.stateChanges.length}`);
    console.log(`- Events: ${result.events.length}`);
    console.log(`- Asset Changes: ${result.assetChanges.length}`);
    console.log(`- Recommendations: ${result.recommendations.length}`);
    
    // Check if it's actually fake
    const isFakeRecommendation = result.recommendations.some(r => r.title === 'Fake Simulation');
    console.log(`- Contains fake indicator: ${isFakeRecommendation ? '✅' : '❌'}`);
    
    return result;
  } catch (error) {
    console.error('❌ Fake simulation test failed:', error);
    throw error;
  }
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testHyperEVMUtils = testUtilityFunctions;
  (window as any).testFakeSimulation = testFakeSimulation;
}