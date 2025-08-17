/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface SimulationDashboardProps {
  result: any;
  onShare?: (link: string) => void;
}

export const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ result, onShare }) => {
  if (!result) return null;

  const formatGas = (gas: string | number) => {
    const gasNum = typeof gas === 'string' ? parseInt(gas) : gas;
    return gasNum.toLocaleString();
  };

  const formatEth = (wei: string | number) => {
    try {
      const weiNum = BigInt(wei);
      const eth = Number(weiNum) / 1e18;
      return eth.toFixed(6);
    } catch {
      return '0.000000';
    }
  };

  const getExecutionStatus = () => {
    // Check for explicit failure first
    if (result.success === false) return 'failed';
    
    // Check execution result status
    if (result.executionResult?.status) {
      return result.executionResult.status;
    }
    
    // Check for revert reason (indicates failure)
    if (result.executionResult?.revertReason && result.executionResult.revertReason !== 'Unknown error') {
      return 'reverted';
    }
    
    // Check for error conditions
    if (result.error || (result.gasUsed === '0' && result.blockNumber === '0')) {
      return 'failed';
    }
    
    // Default to success if no failure indicators
    return 'success';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-900/20 border-green-400/30';
      case 'reverted': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30';
      case 'failed': return 'text-red-400 bg-red-900/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-400/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display (if any) */}
      {(result.error || result.executionResult?.error || result.executionResult?.revertReason || getExecutionStatus() === 'failed') && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-red-400 text-xl">⚠️</span>
            <h3 className="text-xl font-bold text-red-400">Simulation Failed</h3>
          </div>
          
          <div className="text-red-200 mb-3">
            <strong>Reason:</strong> {
              result.executionResult?.revertReason || 
              result.error || 
              result.executionResult?.error || 
              'Transaction simulation failed to execute'
            }
          </div>
          
          {result.returnData && (
            <div className="mb-3">
              <div className="text-sm text-red-300 font-semibold">Return Data:</div>
              <div className="text-red-100 bg-red-900/30 p-3 rounded mt-1 font-mono text-xs break-all">
                {result.returnData}
              </div>
            </div>
          )}
          
          <div className="text-sm text-red-300 bg-red-900/20 p-3 rounded border border-red-400/20">
            <div className="font-semibold mb-2">💡 Troubleshooting Tips:</div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Check transaction parameters (to address, value, data)</li>
              <li>Verify contract exists and function signature is correct</li>
              <li>Ensure sufficient gas limit for complex operations</li>
              <li>Try with our auto-funded test scenarios</li>
            </ul>
          </div>
        </div>
      )}      {/* Execution Summary */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-emerald-400 mb-4">🎯 Execution Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border ${getStatusColor(getExecutionStatus())}`}>
            <div className="text-sm opacity-75">Status</div>
            <div className="text-lg font-bold capitalize">
              {getExecutionStatus()}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-blue-400/30 bg-blue-900/20 text-blue-400">
            <div className="text-sm opacity-75">Gas Used</div>
            <div className="text-lg font-bold">{formatGas(result.gasUsed || '0')}</div>
          </div>
          <div className="p-4 rounded-lg border border-purple-400/30 bg-purple-900/20 text-purple-400">
            <div className="text-sm opacity-75">Block Number</div>
            <div className="text-lg font-bold">{result.blockNumber || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Gas Analysis */}
      {getExecutionStatus() !== 'failed' && result.executionResult && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-blue-400 mb-4">⛽ Gas Analysis</h3>
          {result.executionResult.gasBreakdown ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{formatGas(result.executionResult.gasBreakdown.intrinsic || '0')}</div>
                <div className="text-sm text-gray-400">Intrinsic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{formatGas(result.executionResult.gasBreakdown.execution || '0')}</div>
                <div className="text-sm text-gray-400">Execution</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{formatGas(result.executionResult.gasBreakdown.calldata || '0')}</div>
                <div className="text-sm text-gray-400">Calldata</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{formatGas(result.executionResult.gasBreakdown.total || result.gasUsed || '0')}</div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">⛽ Gas Usage</div>
              <div className="text-3xl font-bold text-blue-400 mb-2">{formatGas(result.gasUsed || '0')}</div>
              <div className="text-sm text-gray-500">Detailed breakdown not available for this transaction</div>
            </div>
          )}
          
          {result.executionResult.gasBreakdown?.optimization && (
            <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Gas Efficiency</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  result.executionResult.gasBreakdown.optimization.efficiency === 'optimal' ? 'bg-green-900/30 text-green-400' :
                  result.executionResult.gasBreakdown.optimization.efficiency === 'good' ? 'bg-blue-900/30 text-blue-400' :
                  result.executionResult.gasBreakdown.optimization.efficiency === 'moderate' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {result.executionResult.gasBreakdown.optimization.efficiency.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Score: {result.executionResult.gasBreakdown.optimization.score || 0}/100
              </div>
              {result.executionResult.gasBreakdown.optimization.potentialSavings > 0 && (
                <div className="text-sm text-green-400 mt-1">
                  Potential savings: {formatGas(result.executionResult.gasBreakdown.optimization.potentialSavings)} gas
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Failed Transaction Gas Info */}
      {getExecutionStatus() === 'failed' && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-red-400 mb-4">⛽ Gas Analysis</h3>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-red-400 text-lg font-semibold mb-2">No Gas Data Available</div>
            <div className="text-gray-400 text-sm">Transaction failed before gas consumption could be measured</div>
          </div>
        </div>
      )}

      {/* Asset Changes */}
      {result.assetChanges && result.assetChanges.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-emerald-400 mb-4">💰 Asset Changes</h3>
          <div className="space-y-3">
            {result.assetChanges.map((change: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    change.type === 'ETH' ? 'bg-blue-900/30 text-blue-400' :
                    change.type === 'ERC20' ? 'bg-green-900/30 text-green-400' :
                    'bg-purple-900/30 text-purple-400'
                  }`}>
                    {change.type === 'ETH' ? 'Ξ' : change.tokenInfo?.symbol?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {change.amount} {change.tokenInfo?.symbol || change.type}
                    </div>
                    <div className="text-sm text-gray-400">
                      {change.from.slice(0, 8)}...{change.from.slice(-6)} → {change.to.slice(0, 8)}...{change.to.slice(-6)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold capitalize">{change.changeType}</div>
                  {change.usdValue && change.usdValue !== '0' && (
                    <div className="text-xs text-gray-400">${change.usdValue}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events */}
      {result.events && result.events.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-purple-400 mb-4">📝 Events ({result.events.length})</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {result.events.map((event: any, index: number) => (
              <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-purple-300">{event.eventName}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.category?.impact === 'high' ? 'bg-red-900/30 text-red-400' :
                    event.category?.impact === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-green-900/30 text-green-400'
                  }`}>
                    {event.category?.type || 'other'}
                  </span>
                </div>
                <div className="text-sm text-gray-300">{event.humanReadable}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Contract: {event.contractAddress.slice(0, 10)}...{event.contractAddress.slice(-8)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Analysis */}
      {getExecutionStatus() !== 'failed' && result.securityAnalysis && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-red-400 mb-4">🛡️ Security Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-3">
                <span className="text-sm text-gray-400">Risk Level: </span>
                <span className={`font-bold ${getRiskColor(result.securityAnalysis.riskLevel)}`}>
                  {result.securityAnalysis.riskLevel.toUpperCase()}
                </span>
              </div>
              
              {result.securityAnalysis.vulnerabilities && result.securityAnalysis.vulnerabilities.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-300 mb-2">Vulnerabilities:</div>
                  <div className="space-y-2">
                    {result.securityAnalysis.vulnerabilities.map((vuln: any, index: number) => (
                      <div key={index} className={`p-2 rounded border-l-4 ${
                        vuln.severity === 'critical' ? 'border-red-500 bg-red-900/20' :
                        vuln.severity === 'high' ? 'border-orange-500 bg-orange-900/20' :
                        vuln.severity === 'medium' ? 'border-yellow-500 bg-yellow-900/20' :
                        'border-blue-500 bg-blue-900/20'
                      }`}>
                        <div className="text-sm font-semibold">{vuln.type}</div>
                        <div className="text-xs text-gray-400">{vuln.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              {result.securityAnalysis.interactions && result.securityAnalysis.interactions.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-300 mb-2">Contract Interactions:</div>
                  <div className="space-y-2">
                    {result.securityAnalysis.interactions.map((interaction: any, index: number) => (
                      <div key={index} className="p-2 bg-gray-700/30 rounded">
                        <div className="text-sm">{interaction.address.slice(0, 12)}...{interaction.address.slice(-10)}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`${getRiskColor(interaction.riskLevel)}`}>
                            {interaction.riskLevel} risk
                          </span>
                          <span className={interaction.verified ? 'text-green-400' : 'text-yellow-400'}>
                            {interaction.verified ? '✓ Verified' : '⚠ Unverified'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Failed Transaction Security Info */}
      {getExecutionStatus() === 'failed' && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-red-400 mb-4">🛡️ Security Analysis</h3>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🛡️</div>
            <div className="text-gray-400 text-lg font-semibold mb-2">Risk Level: LOW</div>
            <div className="text-gray-500 text-sm">Transaction failed before security analysis could be performed</div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">💡 Optimization Recommendations</h3>
          <div className="space-y-3">
            {result.recommendations.map((rec: any, index: number) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                rec.severity === 'critical' ? 'border-red-500 bg-red-900/10' :
                rec.severity === 'error' ? 'border-orange-500 bg-orange-900/10' :
                rec.severity === 'warning' ? 'border-yellow-500 bg-yellow-900/10' :
                'border-blue-500 bg-blue-900/10'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{rec.title}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    rec.category === 'gas' ? 'bg-blue-900/30 text-blue-400' :
                    rec.category === 'security' ? 'bg-red-900/30 text-red-400' :
                    rec.category === 'performance' ? 'bg-green-900/30 text-green-400' :
                    'bg-purple-900/30 text-purple-400'
                  }`}>
                    {rec.category}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-2">{rec.description}</div>
                <div className="text-sm text-gray-400">{rec.solution}</div>
                {rec.impact?.gasReduction && (
                  <div className="text-xs text-green-400 mt-2">
                    Potential gas savings: {formatGas(rec.impact.gasReduction)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* State Changes */}
      {result.stateChanges && result.stateChanges.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-cyan-400 mb-4">🔄 State Changes</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {result.stateChanges.map((change: any, index: number) => (
              <div key={index} className="p-3 bg-gray-700/30 rounded">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono">{change.address.slice(0, 10)}...{change.address.slice(-8)}</span>
                  <span className="capitalize text-cyan-400">{change.type}</span>
                </div>
                {change.humanReadable && (
                  <div className="text-xs text-gray-400 mt-1">{change.humanReadable}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Trace */}
      {result.trace?.calls && result.trace.calls.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-orange-400 mb-4">🔍 Execution Trace</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {result.trace.calls.map((call: any, index: number) => (
              <div key={index} className="p-3 bg-gray-700/30 rounded">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono text-orange-300">{call.type}</span>
                  <span className="text-gray-400">{formatGas(call.gasUsed)} gas</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {call.from.slice(0, 10)}...{call.from.slice(-8)} → {call.to.slice(0, 10)}...{call.to.slice(-8)}
                </div>
                {call.error && (
                  <div className="text-xs text-red-400 mt-1">Error: {call.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share functionality */}
      {onShare && (
        <div className="flex justify-center">
          <button
            onClick={() => onShare(window.location.href)}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
          >
            📤 Share Simulation Results
          </button>
        </div>
      )}
    </div>
  );
};
