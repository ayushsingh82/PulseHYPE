/* eslint-disable @typescript-eslint/no-explicit-any */
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
    <div className="space-y-4">
      {/* Header and Status */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-emerald-400">🎯 Simulation Results</h3>
          {onShare && (
            <button
              onClick={() => onShare(`https://simulator.hyperevm.com/share/${Date.now()}`)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              📤 Share
            </button>
          )}
        </div>

        {/* Status Banner */}
        <div className={`p-3 rounded-lg border ${getStatusColor(getExecutionStatus())}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {getExecutionStatus() === 'success' ? '✅' : 
               getExecutionStatus() === 'reverted' ? '⚠️' : '❌'}
            </span>
            <span className="font-semibold capitalize">{getExecutionStatus()}</span>
            {result.autoBalanceUsed && (
              <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded">
                Auto-Funded
              </span>
            )}
          </div>
          
          {result.autoBalanceUsed && (
            <div className="mt-2 text-sm bg-emerald-900/20 p-2 rounded border border-emerald-400/20">
              <span className="text-emerald-400">💰 Auto-Balance Active:</span>{' '}
              <span className="text-emerald-200">
                Simulation used whale address ({result.whaleFrom?.slice(0, 8)}...{result.whaleFrom?.slice(-6)}) 
                to provide sufficient funds for testing.
              </span>
            </div>
          )}
          
          {(result.error || result.executionResult?.revertReason) && (
            <div className="mt-2 text-sm">
              <strong>Reason:</strong> {
                result.executionResult?.revertReason || 
                result.error || 
                'Transaction failed to execute'
              }
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      {getExecutionStatus() === 'success' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400">Gas Used</div>
            <div className="text-lg font-bold text-emerald-400">{formatGas(result.gasUsed)}</div>
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400">Block Number</div>
            <div className="text-lg font-bold text-blue-400">#{result.blockNumber}</div>
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400">Status</div>
            <div className="text-lg font-bold text-green-400">Success</div>
          </div>
          
          {result.executionResult?.gasBreakdown && (
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400">Gas Efficiency</div>
              <div className="text-lg font-bold text-yellow-400">
                {result.executionResult.gasBreakdown.optimization?.efficiency || 'N/A'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Asset Changes */}
      {result.assetChanges && result.assetChanges.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-semibold text-emerald-400 mb-3">💰 Asset Changes</h4>
          <div className="space-y-2">
            {result.assetChanges.slice(0, 5).map((change: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    {change.from ? `${change.from.slice(0, 8)}...` : 'System'}
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="text-gray-400">
                    {change.to ? `${change.to.slice(0, 8)}...` : 'System'}
                  </span>
                </div>
                <div className="text-emerald-400">
                  {formatEth(change.amount)} {change.symbol || 'ETH'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Analysis */}
      {result.securityAnalysis && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-semibold text-emerald-400 mb-3">🛡️ Security Analysis</h4>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-400">Risk Level:</span>
            <span className={`text-sm font-medium ${getRiskColor(result.securityAnalysis.riskLevel)}`}>
              {result.securityAnalysis.riskLevel.toUpperCase()}
            </span>
          </div>
          
          {result.securityAnalysis.vulnerabilities?.length > 0 && (
            <div className="text-sm text-gray-300">
              <div className="text-xs text-gray-400 mb-1">Vulnerabilities Found:</div>
              {result.securityAnalysis.vulnerabilities.slice(0, 3).map((vuln: any, index: number) => (
                <div key={index} className="text-xs text-yellow-400">
                  • {vuln.description}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-semibold text-emerald-400 mb-3">💡 Optimization Recommendations</h4>
          <div className="space-y-2">
            {result.recommendations.slice(0, 3).map((rec: any, index: number) => (
              <div key={index} className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    rec.category === 'gas' ? 'bg-green-900/30 text-green-400' :
                    rec.category === 'security' ? 'bg-red-900/30 text-red-400' :
                    'bg-blue-900/30 text-blue-400'
                  }`}>
                    {rec.category}
                  </span>
                  <span className="text-gray-300 font-medium">{rec.title}</span>
                </div>
                <div className="text-xs text-gray-400">{rec.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};