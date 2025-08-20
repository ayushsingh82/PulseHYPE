/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { SimulationRequest, utils } from '../app/simulator/enhanced-helper';

interface TransactionBuilderProps {
  onTransactionReady: (tx: SimulationRequest) => void;
  onAddToBundle?: (tx: SimulationRequest) => void;
  defaultValues?: Partial<SimulationRequest>;
}

export const TransactionBuilder: React.FC<TransactionBuilderProps> = ({
  onTransactionReady,
  onAddToBundle,
  defaultValues = {}
}) => {
  const [formData, setFormData] = useState({
    to: defaultValues.to || '',
    from: defaultValues.from || '',
    value: defaultValues.value ? utils.formatHypeAmount(defaultValues.value) : '',
    data: defaultValues.data || '',
    gasLimit: defaultValues.gasLimit || '',
    gasPrice: defaultValues.gasPrice || '',
    maxFeePerGas: defaultValues.maxFeePerGas || '',
    maxPriorityFeePerGas: defaultValues.maxPriorityFeePerGas || '',
    blockNumber: defaultValues.blockNumber?.toString() || ''
  });

  const [transactionType, setTransactionType] = useState<'transfer' | 'contract' | 'deploy'>('transfer');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined contract function signatures
  const commonFunctions = [
    {
      name: 'ERC20 Transfer',
      signature: 'transfer(address,uint256)',
      data: '0xa9059cbb',
      description: 'Transfer tokens to another address'
    },
    {
      name: 'ERC20 Approve',
      signature: 'approve(address,uint256)',
      data: '0x095ea7b3',
      description: 'Approve spender to use tokens'
    },
    {
      name: 'Uniswap V2 Swap',
      signature: 'swapExactETHForTokens(uint256,address[],address,uint256)',
      data: '0x7ff36ab5',
      description: 'Swap ETH for tokens on Uniswap V2'
    },
    {
      name: 'Uniswap V3 Exact Input',
      signature: 'exactInputSingle(ExactInputSingleParams)',
      data: '0x414bf389',
      description: 'Swap tokens using Uniswap V3'
    }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.to) {
      newErrors.to = 'To address is required';
    } else if (!utils.isValidHyperEVMAddress(formData.to)) {
      newErrors.to = 'Invalid address format';
    }

    if (formData.from && !utils.isValidHyperEVMAddress(formData.from)) {
      newErrors.from = 'Invalid from address format';
    }

    if (formData.value && isNaN(parseFloat(formData.value))) {
      newErrors.value = 'Invalid value format';
    }

    if (formData.gasLimit && (isNaN(parseInt(formData.gasLimit)) || parseInt(formData.gasLimit) < 21000)) {
      newErrors.gasLimit = 'Gas limit must be at least 21000';
    }

    if (formData.data && !formData.data.startsWith('0x')) {
      newErrors.data = 'Call data must start with 0x';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const transaction: SimulationRequest = {
      to: formData.to,
      from: formData.from || undefined,
      value: formData.value ? utils.parseHypeAmount(formData.value) : undefined,
      data: formData.data || undefined,
      gasLimit: formData.gasLimit || undefined,
      gasPrice: formData.gasPrice || undefined,
      maxFeePerGas: formData.maxFeePerGas || undefined,
      maxPriorityFeePerGas: formData.maxPriorityFeePerGas || undefined,
      blockNumber: formData.blockNumber || undefined
    };

    onTransactionReady(transaction);
  };

  const handleAddToBundle = () => {
    if (!validateForm() || !onAddToBundle) return;

    const transaction: SimulationRequest = {
      to: formData.to,
      from: formData.from || undefined,
      value: formData.value ? utils.parseHypeAmount(formData.value) : undefined,
      data: formData.data || undefined,
      gasLimit: formData.gasLimit || undefined,
      gasPrice: formData.gasPrice || undefined,
      maxFeePerGas: formData.maxFeePerGas || undefined,
      maxPriorityFeePerGas: formData.maxPriorityFeePerGas || undefined,
      blockNumber: formData.blockNumber || undefined
    };

    onAddToBundle(transaction);
    
    // Clear form after adding to bundle
    setFormData({
      to: '',
      from: formData.from, // Keep from address
      value: '',
      data: '',
      gasLimit: '',
      gasPrice: '',
      maxFeePerGas: '',
      maxPriorityFeePerGas: '',
      blockNumber: ''
    });
  };

  const loadFunction = (func: typeof commonFunctions[0]) => {
    setFormData(prev => ({
      ...prev,
      data: func.data
    }));
    setTransactionType('contract');
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-emerald-400 mb-6">🔧 Transaction Builder</h3>

      {/* Transaction Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Type</label>
        <div className="flex space-x-4">
          {[
            { id: 'transfer', label: '💸 Transfer', desc: 'Send HYPE or tokens' },
            { id: 'contract', label: '🔗 Contract Call', desc: 'Call smart contract function' },
            { id: 'deploy', label: '🚀 Deploy', desc: 'Deploy new contract' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setTransactionType(type.id as any)}
              className={`flex-1 p-3 rounded-lg border transition-colors ${
                transactionType === type.id
                  ? 'border-emerald-500 bg-emerald-900/20 text-emerald-300'
                  : 'border-gray-600 bg-gray-700/30 text-gray-400 hover:text-white'
              }`}
            >
              <div className="font-semibold">{type.label}</div>
              <div className="text-xs opacity-75">{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Common Function Templates */}
      {transactionType === 'contract' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Common Functions</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonFunctions.map((func) => (
              <button
                key={func.name}
                onClick={() => loadFunction(func)}
                className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors text-left"
              >
                <div className="font-semibold text-blue-300">{func.name}</div>
                <div className="text-xs text-gray-400 mt-1">{func.description}</div>
                <div className="text-xs text-gray-500 mt-1 font-mono">{func.signature}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Address Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            From Address {transactionType !== 'deploy' && '(Optional)'}
          </label>
          <input
            type="text"
            value={formData.from}
            onChange={(e) => updateField('from', e.target.value)}
            placeholder="0x742d35Cc..."
            className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 ${
              errors.from 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-emerald-500'
            }`}
          />
          {errors.from && <div className="text-red-400 text-xs mt-1">{errors.from}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {transactionType === 'deploy' ? 'To Address (Leave empty for deployment)' : 'To Address *'}
          </label>
          <input
            type="text"
            value={formData.to}
            onChange={(e) => updateField('to', e.target.value)}
            placeholder={transactionType === 'deploy' ? 'Leave empty' : '0x742d35Cc...'}
            disabled={transactionType === 'deploy'}
            className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 ${
              errors.to 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-emerald-500'
            } ${transactionType === 'deploy' ? 'opacity-50' : ''}`}
          />
          {errors.to && <div className="text-red-400 text-xs mt-1">{errors.to}</div>}
        </div>
      </div>

      {/* Value and Gas Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Value (HYPE)</label>
          <input
            type="text"
            value={formData.value}
            onChange={(e) => updateField('value', e.target.value)}
            placeholder="0.0"
            className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 ${
              errors.value 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-emerald-500'
            }`}
          />
          {errors.value && <div className="text-red-400 text-xs mt-1">{errors.value}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Gas Limit</label>
          <input
            type="text"
            value={formData.gasLimit}
            onChange={(e) => updateField('gasLimit', e.target.value)}
            placeholder={transactionType === 'deploy' ? '2000000' : '21000'}
            className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 ${
              errors.gasLimit 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-emerald-500'
            }`}
          />
          {errors.gasLimit && <div className="text-red-400 text-xs mt-1">{errors.gasLimit}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Gas Price (gwei)</label>
          <input
            type="text"
            value={formData.gasPrice}
            onChange={(e) => updateField('gasPrice', e.target.value)}
            placeholder="Auto"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Call Data / Contract Code */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {transactionType === 'deploy' ? 'Contract Bytecode' : 'Call Data'} 
          {transactionType !== 'transfer' && ' *'}
        </label>
        <textarea
          value={formData.data}
          onChange={(e) => updateField('data', e.target.value)}
          placeholder={
            transactionType === 'deploy' 
              ? '0x608060405234801561001057600080fd5b50...' 
              : transactionType === 'contract'
              ? '0xa9059cbb000000000000000000000000...'
              : 'Optional call data'
          }
          rows={transactionType === 'deploy' ? 6 : 3}
          className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 font-mono text-sm ${
            errors.data 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-600 focus:ring-emerald-500'
          }`}
        />
        {errors.data && <div className="text-red-400 text-xs mt-1">{errors.data}</div>}
      </div>

      {/* EIP-1559 Gas Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Max Fee Per Gas</label>
          <input
            type="text"
            value={formData.maxFeePerGas}
            onChange={(e) => updateField('maxFeePerGas', e.target.value)}
            placeholder="Auto"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Max Priority Fee</label>
          <input
            type="text"
            value={formData.maxPriorityFeePerGas}
            onChange={(e) => updateField('maxPriorityFeePerGas', e.target.value)}
            placeholder="Auto"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Block Number</label>
          <input
            type="text"
            value={formData.blockNumber}
            onChange={(e) => updateField('blockNumber', e.target.value)}
            placeholder="Latest"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSubmit}
          disabled={!formData.to && transactionType !== 'deploy'}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
        >
          🎯 Simulate Transaction
        </button>

        {onAddToBundle && (
          <button
            onClick={handleAddToBundle}
            disabled={!formData.to && transactionType !== 'deploy'}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            📦 Add to Bundle
          </button>
        )}

        <button
          onClick={() => setFormData({
            to: '',
            from: '',
            value: '',
            data: '',
            gasLimit: '',
            gasPrice: '',
            maxFeePerGas: '',
            maxPriorityFeePerGas: '',
            blockNumber: ''
          })}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
        >
          🗑️ Clear Form
        </button>
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
          <div className="text-red-300 font-semibold mb-2">❌ Please fix the following errors:</div>
          <ul className="text-red-300 text-sm space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
