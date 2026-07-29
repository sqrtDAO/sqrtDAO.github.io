import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BuyAndBurnHookV3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const buyAndBurnHookV3Abi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_uniswapSwapRouterAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BURN_ADDRESS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UNISWAP_SWAP_ROUTER_ADDRESS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_path', internalType: 'bytes', type: 'bytes' }],
    name: 'buyAndBurn',
    outputs: [{ name: 'amountOut', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amountIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BoughtAndBurnedV3',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DistributorV1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const distributorV1Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_creator', internalType: 'address', type: 'address' },
      {
        name: '_config',
        internalType: 'struct DistributorConfig',
        type: 'tuple',
        components: [
          {
            name: 'distributionToken',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'participationToken',
            internalType: 'address',
            type: 'address',
          },
          { name: 'epochDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'startTimestamp', internalType: 'uint256', type: 'uint256' },
          {
            name: 'minParticipation',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'claimDelaySeconds',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'allowFutureEpochParticipation',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'shares',
            internalType: 'struct Share[]',
            type: 'tuple[]',
            components: [
              { name: 'shareBps', internalType: 'uint256', type: 'uint256' },
              {
                name: 'hook',
                internalType: 'struct Hook',
                type: 'tuple',
                components: [
                  {
                    name: 'contractAddress',
                    internalType: 'address',
                    type: 'address',
                  },
                  { name: 'callData', internalType: 'bytes', type: 'bytes' },
                ],
              },
            ],
          },
          {
            name: 'emissionFunction',
            internalType: 'struct EmissionFunction',
            type: 'tuple',
            components: [
              {
                name: 'emissionContract',
                internalType: 'contract IEmissionFunction',
                type: 'address',
              },
              { name: 'curveConfig', internalType: 'bytes', type: 'bytes' },
            ],
          },
          { name: 'allowlistSigner', internalType: 'address', type: 'address' },
          {
            name: 'allowlistDeadline',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'numberOfEpochs', internalType: 'uint256', type: 'uint256' },
          {
            name: 'totalDistributionAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ALLOWLIST_DEADLINE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ALLOWLIST_SIGNER',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ALLOW_FUTURE_EPOCH_PARTICIPATION',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLAIM_DELAY_SECONDS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CREATOR',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DISTRIBUTION_TOKEN',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EPOCH_DURATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_PARTICIPATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'NUMBER_OF_EPOCHS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PARTICIPATION_TOKEN',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STARTING_TIMESTAMP',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOTAL_DISTRIBUTION_AMOUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'callDrainHook',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      {
        name: '_range',
        internalType: 'struct Range',
        type: 'tuple',
        components: [
          { name: 'from', internalType: 'uint256', type: 'uint256' },
          { name: 'length', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'claim',
    outputs: [
      { name: 'claimAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'claimFeeBps',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ClaimParams[]',
        type: 'tuple[]',
        components: [
          { name: 'user', internalType: 'address', type: 'address' },
          {
            name: 'range',
            internalType: 'struct Range',
            type: 'tuple',
            components: [
              { name: 'from', internalType: 'uint256', type: 'uint256' },
              { name: 'length', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'claimMany',
    outputs: [
      { name: 'totalClaimed', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_fromEpoch', internalType: 'uint256', type: 'uint256' },
      { name: '_numEpochs', internalType: 'uint256', type: 'uint256' },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_maxFound', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'discoverRewards',
    outputs: [
      { name: 'nextEpochToSearch', internalType: 'uint256', type: 'uint256' },
      { name: 'epochs', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'emissionFunction',
    outputs: [
      {
        name: 'emissionContract',
        internalType: 'contract IEmissionFunction',
        type: 'address',
      },
      { name: 'curveConfig', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'epochTotalParticipation',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'epochUniqueParticipants',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'epochUserClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'epochUserParticipation',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getContractInfo',
    outputs: [
      {
        name: 'result',
        internalType: 'struct GetContractInfoResult',
        type: 'tuple',
        components: [
          {
            name: 'distributionToken',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'participationToken',
            internalType: 'address',
            type: 'address',
          },
          { name: 'epochDuration', internalType: 'uint256', type: 'uint256' },
          {
            name: 'startingTimestamp',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minParticipation',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'claimDelaySeconds',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'remainingRewards',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'numberOfEpochs', internalType: 'uint256', type: 'uint256' },
          {
            name: 'totalDistributionAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'creator', internalType: 'address', type: 'address' },
          {
            name: 'shares',
            internalType: 'struct Share[]',
            type: 'tuple[]',
            components: [
              { name: 'shareBps', internalType: 'uint256', type: 'uint256' },
              {
                name: 'hook',
                internalType: 'struct Hook',
                type: 'tuple',
                components: [
                  {
                    name: 'contractAddress',
                    internalType: 'address',
                    type: 'address',
                  },
                  { name: 'callData', internalType: 'bytes', type: 'bytes' },
                ],
              },
            ],
          },
          {
            name: 'totalUniqueParticipants',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      {
        name: 'range',
        internalType: 'struct Range',
        type: 'tuple',
        components: [
          { name: 'from', internalType: 'uint256', type: 'uint256' },
          { name: 'length', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getEpochInfo',
    outputs: [
      {
        name: 'epochs',
        internalType: 'struct EpochInfo[]',
        type: 'tuple[]',
        components: [
          {
            name: 'userParticipationAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalParticipationAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'uniqueParticipants',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'claimed', internalType: 'bool', type: 'bool' },
          { name: 'rewardAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nextEpochToRelease',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountPerEpoch', internalType: 'uint256', type: 'uint256' },
      {
        name: '_range',
        internalType: 'struct Range',
        type: 'tuple',
        components: [
          { name: 'from', internalType: 'uint256', type: 'uint256' },
          { name: 'length', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_allowlistSignature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'participate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ParticipateParams[]',
        type: 'tuple[]',
        components: [
          { name: 'amountPerEpoch', internalType: 'uint256', type: 'uint256' },
          {
            name: 'range',
            internalType: 'struct Range',
            type: 'tuple',
            components: [
              { name: 'from', internalType: 'uint256', type: 'uint256' },
              { name: 'length', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'allowlistSignature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'participateMany',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'epoch', internalType: 'uint256', type: 'uint256' }],
    name: 'rewardOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_bps', internalType: 'uint256', type: 'uint256' }],
    name: 'setClaimFeeBps',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'shares',
    outputs: [
      { name: 'shareBps', internalType: 'uint256', type: 'uint256' },
      {
        name: 'hook',
        internalType: 'struct Hook',
        type: 'tuple',
        components: [
          { name: 'contractAddress', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalUniqueParticipants',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      { name: 'bps', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ClaimFeeBpsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromEpoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'numEpochs',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalClaimed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'nextDrainHookToCall',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DrainHookCall',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'fromEpoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'numEpochs',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountPerEpoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Participated',
  },
  {
    type: 'error',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'HookReverted',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'SharesNot100Percent' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ExponentialEmission
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const exponentialEmissionAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_curveConfig', internalType: 'bytes', type: 'bytes' },
      { name: '_epochNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculate',
    outputs: [{ name: 'reward', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FactoryV1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const factoryV1Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_initialOwner', internalType: 'address', type: 'address' },
      { name: '_protocolFeeBps', internalType: 'uint256', type: 'uint256' },
      {
        name: '_transferToHook',
        internalType: 'contract TransferToHook',
        type: 'address',
      },
      {
        name: '_buyAndBurnHookV3',
        internalType: 'contract BuyAndBurnHookV3',
        type: 'address',
      },
      {
        name: '_positionManager',
        internalType: 'contract INonfungiblePositionManager',
        type: 'address',
      },
      { name: '_permit2', internalType: 'contract IPermit2', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BUY_AND_BURN_HOOK',
    outputs: [
      { name: '', internalType: 'contract BuyAndBurnHookV3', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'LIQUIDITY_POOL_FEE',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PERMIT2',
    outputs: [{ name: '', internalType: 'contract IPermit2', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'POSITION_MANAGER',
    outputs: [
      {
        name: '',
        internalType: 'contract INonfungiblePositionManager',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TRANSFER_TO_HOOK',
    outputs: [
      { name: '', internalType: 'contract TransferToHook', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_config',
        internalType: 'struct DistributorConfig',
        type: 'tuple',
        components: [
          {
            name: 'distributionToken',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'participationToken',
            internalType: 'address',
            type: 'address',
          },
          { name: 'epochDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'startTimestamp', internalType: 'uint256', type: 'uint256' },
          {
            name: 'minParticipation',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'claimDelaySeconds',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'allowFutureEpochParticipation',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'shares',
            internalType: 'struct Share[]',
            type: 'tuple[]',
            components: [
              { name: 'shareBps', internalType: 'uint256', type: 'uint256' },
              {
                name: 'hook',
                internalType: 'struct Hook',
                type: 'tuple',
                components: [
                  {
                    name: 'contractAddress',
                    internalType: 'address',
                    type: 'address',
                  },
                  { name: 'callData', internalType: 'bytes', type: 'bytes' },
                ],
              },
            ],
          },
          {
            name: 'emissionFunction',
            internalType: 'struct EmissionFunction',
            type: 'tuple',
            components: [
              {
                name: 'emissionContract',
                internalType: 'contract IEmissionFunction',
                type: 'address',
              },
              { name: 'curveConfig', internalType: 'bytes', type: 'bytes' },
            ],
          },
          { name: 'allowlistSigner', internalType: 'address', type: 'address' },
          {
            name: 'allowlistDeadline',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'numberOfEpochs', internalType: 'uint256', type: 'uint256' },
          {
            name: 'totalDistributionAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
      { name: '_pullIn', internalType: 'bool', type: 'bool' },
    ],
    name: 'createDistributor',
    outputs: [
      { name: 'distributorAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_participationToken', internalType: 'address', type: 'address' },
      { name: '_distributionToken', internalType: 'address', type: 'address' },
      { name: '_sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      {
        name: '_participationTokenAmountDesired',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_distributionTokenAmountDesired',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_pullIn', internalType: 'bool', type: 'bool' },
      {
        name: '_participationPermit2',
        internalType: 'struct Permit2Data',
        type: 'tuple',
        components: [
          {
            name: 'permit',
            internalType: 'struct IPermit2.PermitTransferFrom',
            type: 'tuple',
            components: [
              {
                name: 'permitted',
                internalType: 'struct IPermit2.TokenPermissions',
                type: 'tuple',
                components: [
                  { name: 'token', internalType: 'address', type: 'address' },
                  { name: 'amount', internalType: 'uint256', type: 'uint256' },
                ],
              },
              { name: 'nonce', internalType: 'uint256', type: 'uint256' },
              { name: 'deadline', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: '_distributionPermit2',
        internalType: 'struct Permit2Data',
        type: 'tuple',
        components: [
          {
            name: 'permit',
            internalType: 'struct IPermit2.PermitTransferFrom',
            type: 'tuple',
            components: [
              {
                name: 'permitted',
                internalType: 'struct IPermit2.TokenPermissions',
                type: 'tuple',
                components: [
                  { name: 'token', internalType: 'address', type: 'address' },
                  { name: 'amount', internalType: 'uint256', type: 'uint256' },
                ],
              },
              { name: 'nonce', internalType: 'uint256', type: 'uint256' },
              { name: 'deadline', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'createPoolAndAddLiquidity',
    outputs: [
      { name: 'pool', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'liquidity', internalType: 'uint128', type: 'uint128' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      {
        name: '_allocations',
        internalType: 'struct Allocation[]',
        type: 'tuple[]',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'createToken',
    outputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenName', internalType: 'string', type: 'string' },
      { name: '_tokenSymbol', internalType: 'string', type: 'string' },
      {
        name: '_tokenAllocations',
        internalType: 'struct Allocation[]',
        type: 'tuple[]',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '_sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      {
        name: '_participationTokenAmountDesired',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_distributionTokenAmountDesired',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_config',
        internalType: 'struct DistributorConfig',
        type: 'tuple',
        components: [
          {
            name: 'distributionToken',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'participationToken',
            internalType: 'address',
            type: 'address',
          },
          { name: 'epochDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'startTimestamp', internalType: 'uint256', type: 'uint256' },
          {
            name: 'minParticipation',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'claimDelaySeconds',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'allowFutureEpochParticipation',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'shares',
            internalType: 'struct Share[]',
            type: 'tuple[]',
            components: [
              { name: 'shareBps', internalType: 'uint256', type: 'uint256' },
              {
                name: 'hook',
                internalType: 'struct Hook',
                type: 'tuple',
                components: [
                  {
                    name: 'contractAddress',
                    internalType: 'address',
                    type: 'address',
                  },
                  { name: 'callData', internalType: 'bytes', type: 'bytes' },
                ],
              },
            ],
          },
          {
            name: 'emissionFunction',
            internalType: 'struct EmissionFunction',
            type: 'tuple',
            components: [
              {
                name: 'emissionContract',
                internalType: 'contract IEmissionFunction',
                type: 'address',
              },
              { name: 'curveConfig', internalType: 'bytes', type: 'bytes' },
            ],
          },
          { name: 'allowlistSigner', internalType: 'address', type: 'address' },
          {
            name: 'allowlistDeadline',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'numberOfEpochs', internalType: 'uint256', type: 'uint256' },
          {
            name: 'totalDistributionAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
      {
        name: '_buyBackAndBurnShareBps',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_participationPermit2',
        internalType: 'struct Permit2Data',
        type: 'tuple',
        components: [
          {
            name: 'permit',
            internalType: 'struct IPermit2.PermitTransferFrom',
            type: 'tuple',
            components: [
              {
                name: 'permitted',
                internalType: 'struct IPermit2.TokenPermissions',
                type: 'tuple',
                components: [
                  { name: 'token', internalType: 'address', type: 'address' },
                  { name: 'amount', internalType: 'uint256', type: 'uint256' },
                ],
              },
              { name: 'nonce', internalType: 'uint256', type: 'uint256' },
              { name: 'deadline', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'createTokenAndLiquidityAndDistribution',
    outputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'distributorAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'drain',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFeeBps',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_protocolFeeBps', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setProtocolFeeBps',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'distributor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'NewDistributor',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'NewToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FixedEmission
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fixedEmissionAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_curveConfig', internalType: 'bytes', type: 'bytes' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculate',
    outputs: [{ name: 'reward', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LinearEmission
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const linearEmissionAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_curveConfig', internalType: 'bytes', type: 'bytes' },
      { name: '_epochNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculate',
    outputs: [{ name: 'reward', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenV1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenV1Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      {
        name: '_allocations',
        internalType: 'struct Allocation[]',
        type: 'tuple[]',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TransferToHook
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const transferToHookAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'transferTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transferred',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link buyAndBurnHookV3Abi}__
 */
export const useReadBuyAndBurnHookV3 = /*#__PURE__*/ createUseReadContract({
  abi: buyAndBurnHookV3Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link buyAndBurnHookV3Abi}__ and `functionName` set to `"BURN_ADDRESS"`
 */
export const useReadBuyAndBurnHookV3BurnAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: buyAndBurnHookV3Abi,
    functionName: 'BURN_ADDRESS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link buyAndBurnHookV3Abi}__ and `functionName` set to `"UNISWAP_SWAP_ROUTER_ADDRESS"`
 */
export const useReadBuyAndBurnHookV3UniswapSwapRouterAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: buyAndBurnHookV3Abi,
    functionName: 'UNISWAP_SWAP_ROUTER_ADDRESS',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link buyAndBurnHookV3Abi}__
 */
export const useWriteBuyAndBurnHookV3 = /*#__PURE__*/ createUseWriteContract({
  abi: buyAndBurnHookV3Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link buyAndBurnHookV3Abi}__ and `functionName` set to `"buyAndBurn"`
 */
export const useWriteBuyAndBurnHookV3BuyAndBurn =
  /*#__PURE__*/ createUseWriteContract({
    abi: buyAndBurnHookV3Abi,
    functionName: 'buyAndBurn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link buyAndBurnHookV3Abi}__
 */
export const useSimulateBuyAndBurnHookV3 =
  /*#__PURE__*/ createUseSimulateContract({ abi: buyAndBurnHookV3Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link buyAndBurnHookV3Abi}__ and `functionName` set to `"buyAndBurn"`
 */
export const useSimulateBuyAndBurnHookV3BuyAndBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: buyAndBurnHookV3Abi,
    functionName: 'buyAndBurn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link buyAndBurnHookV3Abi}__
 */
export const useWatchBuyAndBurnHookV3Event =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: buyAndBurnHookV3Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link buyAndBurnHookV3Abi}__ and `eventName` set to `"BoughtAndBurnedV3"`
 */
export const useWatchBuyAndBurnHookV3BoughtAndBurnedV3Event =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: buyAndBurnHookV3Abi,
    eventName: 'BoughtAndBurnedV3',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__
 */
export const useReadDistributorV1 = /*#__PURE__*/ createUseReadContract({
  abi: distributorV1Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"ALLOWLIST_DEADLINE"`
 */
export const useReadDistributorV1AllowlistDeadline =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'ALLOWLIST_DEADLINE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"ALLOWLIST_SIGNER"`
 */
export const useReadDistributorV1AllowlistSigner =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'ALLOWLIST_SIGNER',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"ALLOW_FUTURE_EPOCH_PARTICIPATION"`
 */
export const useReadDistributorV1AllowFutureEpochParticipation =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'ALLOW_FUTURE_EPOCH_PARTICIPATION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"CLAIM_DELAY_SECONDS"`
 */
export const useReadDistributorV1ClaimDelaySeconds =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'CLAIM_DELAY_SECONDS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"CREATOR"`
 */
export const useReadDistributorV1Creator = /*#__PURE__*/ createUseReadContract({
  abi: distributorV1Abi,
  functionName: 'CREATOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"DISTRIBUTION_TOKEN"`
 */
export const useReadDistributorV1DistributionToken =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'DISTRIBUTION_TOKEN',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"EPOCH_DURATION"`
 */
export const useReadDistributorV1EpochDuration =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'EPOCH_DURATION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"MIN_PARTICIPATION"`
 */
export const useReadDistributorV1MinParticipation =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'MIN_PARTICIPATION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"NUMBER_OF_EPOCHS"`
 */
export const useReadDistributorV1NumberOfEpochs =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'NUMBER_OF_EPOCHS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"PARTICIPATION_TOKEN"`
 */
export const useReadDistributorV1ParticipationToken =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'PARTICIPATION_TOKEN',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"STARTING_TIMESTAMP"`
 */
export const useReadDistributorV1StartingTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'STARTING_TIMESTAMP',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"TOTAL_DISTRIBUTION_AMOUNT"`
 */
export const useReadDistributorV1TotalDistributionAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'TOTAL_DISTRIBUTION_AMOUNT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"claimFeeBps"`
 */
export const useReadDistributorV1ClaimFeeBps =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'claimFeeBps',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"currentEpoch"`
 */
export const useReadDistributorV1CurrentEpoch =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'currentEpoch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"discoverRewards"`
 */
export const useReadDistributorV1DiscoverRewards =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'discoverRewards',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"emissionFunction"`
 */
export const useReadDistributorV1EmissionFunction =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'emissionFunction',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"epochTotalParticipation"`
 */
export const useReadDistributorV1EpochTotalParticipation =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'epochTotalParticipation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"epochUniqueParticipants"`
 */
export const useReadDistributorV1EpochUniqueParticipants =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'epochUniqueParticipants',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"epochUserClaimed"`
 */
export const useReadDistributorV1EpochUserClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'epochUserClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"epochUserParticipation"`
 */
export const useReadDistributorV1EpochUserParticipation =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'epochUserParticipation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"getContractInfo"`
 */
export const useReadDistributorV1GetContractInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'getContractInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"getEpochInfo"`
 */
export const useReadDistributorV1GetEpochInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'getEpochInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"nextEpochToRelease"`
 */
export const useReadDistributorV1NextEpochToRelease =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'nextEpochToRelease',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"rewardOf"`
 */
export const useReadDistributorV1RewardOf = /*#__PURE__*/ createUseReadContract(
  { abi: distributorV1Abi, functionName: 'rewardOf' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"shares"`
 */
export const useReadDistributorV1Shares = /*#__PURE__*/ createUseReadContract({
  abi: distributorV1Abi,
  functionName: 'shares',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"totalUniqueParticipants"`
 */
export const useReadDistributorV1TotalUniqueParticipants =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'totalUniqueParticipants',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__
 */
export const useWriteDistributorV1 = /*#__PURE__*/ createUseWriteContract({
  abi: distributorV1Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"callDrainHook"`
 */
export const useWriteDistributorV1CallDrainHook =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'callDrainHook',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"claim"`
 */
export const useWriteDistributorV1Claim = /*#__PURE__*/ createUseWriteContract({
  abi: distributorV1Abi,
  functionName: 'claim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"claimMany"`
 */
export const useWriteDistributorV1ClaimMany =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'claimMany',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"participate"`
 */
export const useWriteDistributorV1Participate =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'participate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"participateMany"`
 */
export const useWriteDistributorV1ParticipateMany =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'participateMany',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"setClaimFeeBps"`
 */
export const useWriteDistributorV1SetClaimFeeBps =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'setClaimFeeBps',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__
 */
export const useSimulateDistributorV1 = /*#__PURE__*/ createUseSimulateContract(
  { abi: distributorV1Abi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"callDrainHook"`
 */
export const useSimulateDistributorV1CallDrainHook =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'callDrainHook',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"claim"`
 */
export const useSimulateDistributorV1Claim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"claimMany"`
 */
export const useSimulateDistributorV1ClaimMany =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'claimMany',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"participate"`
 */
export const useSimulateDistributorV1Participate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'participate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"participateMany"`
 */
export const useSimulateDistributorV1ParticipateMany =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'participateMany',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"setClaimFeeBps"`
 */
export const useSimulateDistributorV1SetClaimFeeBps =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'setClaimFeeBps',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__
 */
export const useWatchDistributorV1Event =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: distributorV1Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__ and `eventName` set to `"ClaimFeeBpsSet"`
 */
export const useWatchDistributorV1ClaimFeeBpsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributorV1Abi,
    eventName: 'ClaimFeeBpsSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchDistributorV1ClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributorV1Abi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__ and `eventName` set to `"DrainHookCall"`
 */
export const useWatchDistributorV1DrainHookCallEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributorV1Abi,
    eventName: 'DrainHookCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__ and `eventName` set to `"Participated"`
 */
export const useWatchDistributorV1ParticipatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributorV1Abi,
    eventName: 'Participated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link exponentialEmissionAbi}__
 */
export const useReadExponentialEmission = /*#__PURE__*/ createUseReadContract({
  abi: exponentialEmissionAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link exponentialEmissionAbi}__ and `functionName` set to `"calculate"`
 */
export const useReadExponentialEmissionCalculate =
  /*#__PURE__*/ createUseReadContract({
    abi: exponentialEmissionAbi,
    functionName: 'calculate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__
 */
export const useReadFactoryV1 = /*#__PURE__*/ createUseReadContract({
  abi: factoryV1Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"BUY_AND_BURN_HOOK"`
 */
export const useReadFactoryV1BuyAndBurnHook =
  /*#__PURE__*/ createUseReadContract({
    abi: factoryV1Abi,
    functionName: 'BUY_AND_BURN_HOOK',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"LIQUIDITY_POOL_FEE"`
 */
export const useReadFactoryV1LiquidityPoolFee =
  /*#__PURE__*/ createUseReadContract({
    abi: factoryV1Abi,
    functionName: 'LIQUIDITY_POOL_FEE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"PERMIT2"`
 */
export const useReadFactoryV1Permit2 = /*#__PURE__*/ createUseReadContract({
  abi: factoryV1Abi,
  functionName: 'PERMIT2',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"POSITION_MANAGER"`
 */
export const useReadFactoryV1PositionManager =
  /*#__PURE__*/ createUseReadContract({
    abi: factoryV1Abi,
    functionName: 'POSITION_MANAGER',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"TRANSFER_TO_HOOK"`
 */
export const useReadFactoryV1TransferToHook =
  /*#__PURE__*/ createUseReadContract({
    abi: factoryV1Abi,
    functionName: 'TRANSFER_TO_HOOK',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"owner"`
 */
export const useReadFactoryV1Owner = /*#__PURE__*/ createUseReadContract({
  abi: factoryV1Abi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"protocolFeeBps"`
 */
export const useReadFactoryV1ProtocolFeeBps =
  /*#__PURE__*/ createUseReadContract({
    abi: factoryV1Abi,
    functionName: 'protocolFeeBps',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__
 */
export const useWriteFactoryV1 = /*#__PURE__*/ createUseWriteContract({
  abi: factoryV1Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"createDistributor"`
 */
export const useWriteFactoryV1CreateDistributor =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryV1Abi,
    functionName: 'createDistributor',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"createPoolAndAddLiquidity"`
 */
export const useWriteFactoryV1CreatePoolAndAddLiquidity =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryV1Abi,
    functionName: 'createPoolAndAddLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"createToken"`
 */
export const useWriteFactoryV1CreateToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryV1Abi,
    functionName: 'createToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"createTokenAndLiquidityAndDistribution"`
 */
export const useWriteFactoryV1CreateTokenAndLiquidityAndDistribution =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryV1Abi,
    functionName: 'createTokenAndLiquidityAndDistribution',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"drain"`
 */
export const useWriteFactoryV1Drain = /*#__PURE__*/ createUseWriteContract({
  abi: factoryV1Abi,
  functionName: 'drain',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteFactoryV1RenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryV1Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"setProtocolFeeBps"`
 */
export const useWriteFactoryV1SetProtocolFeeBps =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryV1Abi,
    functionName: 'setProtocolFeeBps',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteFactoryV1TransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryV1Abi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__
 */
export const useSimulateFactoryV1 = /*#__PURE__*/ createUseSimulateContract({
  abi: factoryV1Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"createDistributor"`
 */
export const useSimulateFactoryV1CreateDistributor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'createDistributor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"createPoolAndAddLiquidity"`
 */
export const useSimulateFactoryV1CreatePoolAndAddLiquidity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'createPoolAndAddLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"createToken"`
 */
export const useSimulateFactoryV1CreateToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'createToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"createTokenAndLiquidityAndDistribution"`
 */
export const useSimulateFactoryV1CreateTokenAndLiquidityAndDistribution =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'createTokenAndLiquidityAndDistribution',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"drain"`
 */
export const useSimulateFactoryV1Drain =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'drain',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateFactoryV1RenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"setProtocolFeeBps"`
 */
export const useSimulateFactoryV1SetProtocolFeeBps =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'setProtocolFeeBps',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateFactoryV1TransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link factoryV1Abi}__
 */
export const useWatchFactoryV1Event = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: factoryV1Abi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link factoryV1Abi}__ and `eventName` set to `"NewDistributor"`
 */
export const useWatchFactoryV1NewDistributorEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: factoryV1Abi,
    eventName: 'NewDistributor',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link factoryV1Abi}__ and `eventName` set to `"NewToken"`
 */
export const useWatchFactoryV1NewTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: factoryV1Abi,
    eventName: 'NewToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link factoryV1Abi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchFactoryV1OwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: factoryV1Abi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fixedEmissionAbi}__
 */
export const useReadFixedEmission = /*#__PURE__*/ createUseReadContract({
  abi: fixedEmissionAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fixedEmissionAbi}__ and `functionName` set to `"calculate"`
 */
export const useReadFixedEmissionCalculate =
  /*#__PURE__*/ createUseReadContract({
    abi: fixedEmissionAbi,
    functionName: 'calculate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link linearEmissionAbi}__
 */
export const useReadLinearEmission = /*#__PURE__*/ createUseReadContract({
  abi: linearEmissionAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link linearEmissionAbi}__ and `functionName` set to `"calculate"`
 */
export const useReadLinearEmissionCalculate =
  /*#__PURE__*/ createUseReadContract({
    abi: linearEmissionAbi,
    functionName: 'calculate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__
 */
export const useReadTokenV1 = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadTokenV1Allowance = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadTokenV1BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadTokenV1Decimals = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"name"`
 */
export const useReadTokenV1Name = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadTokenV1Symbol = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadTokenV1TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1Abi}__
 */
export const useWriteTokenV1 = /*#__PURE__*/ createUseWriteContract({
  abi: tokenV1Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteTokenV1Approve = /*#__PURE__*/ createUseWriteContract({
  abi: tokenV1Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteTokenV1Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: tokenV1Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteTokenV1TransferFrom = /*#__PURE__*/ createUseWriteContract(
  { abi: tokenV1Abi, functionName: 'transferFrom' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1Abi}__
 */
export const useSimulateTokenV1 = /*#__PURE__*/ createUseSimulateContract({
  abi: tokenV1Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateTokenV1Approve =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenV1Abi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateTokenV1Transfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenV1Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateTokenV1TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenV1Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenV1Abi}__
 */
export const useWatchTokenV1Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tokenV1Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenV1Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchTokenV1ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenV1Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenV1Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchTokenV1TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenV1Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link transferToHookAbi}__
 */
export const useWriteTransferToHook = /*#__PURE__*/ createUseWriteContract({
  abi: transferToHookAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link transferToHookAbi}__ and `functionName` set to `"transferTo"`
 */
export const useWriteTransferToHookTransferTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: transferToHookAbi,
    functionName: 'transferTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link transferToHookAbi}__
 */
export const useSimulateTransferToHook =
  /*#__PURE__*/ createUseSimulateContract({ abi: transferToHookAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link transferToHookAbi}__ and `functionName` set to `"transferTo"`
 */
export const useSimulateTransferToHookTransferTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: transferToHookAbi,
    functionName: 'transferTo',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link transferToHookAbi}__
 */
export const useWatchTransferToHookEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: transferToHookAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link transferToHookAbi}__ and `eventName` set to `"Transferred"`
 */
export const useWatchTransferToHookTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: transferToHookAbi,
    eventName: 'Transferred',
  })
