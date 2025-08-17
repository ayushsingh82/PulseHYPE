/* eslint-disable @typescript-eslint/no-explicit-any */
import { utils } from './enhanced-helper';

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

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testHyperEVMUtils = testUtilityFunctions;
}
