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
// DistributionV1Factory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const distributionV1FactoryAbi = [
  {
    type: 'function',
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
            name: 'releasePolicy',
            internalType: 'enum ReleasePolicy',
            type: 'uint8',
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
          {
            name: 'initialMetadata',
            internalType: 'struct MetadataEntry[]',
            type: 'tuple[]',
            components: [
              { name: 'key', internalType: 'string', type: 'string' },
              { name: 'value', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'metadataEditable', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'createDistributor',
    outputs: [
      { name: 'distributorAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'creatorOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'distributionListLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_size', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDistributionsInfo',
    outputs: [
      {
        name: 'result',
        internalType: 'struct AddressAndDistributionInfo[]',
        type: 'tuple[]',
        components: [
          {
            name: 'info',
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
              {
                name: 'epochDuration',
                internalType: 'uint256',
                type: 'uint256',
              },
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
                name: 'totalParticipation',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'remainingRewards',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'numberOfEpochs',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalDistributionAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'owner', internalType: 'address', type: 'address' },
              {
                name: 'releasePolicy',
                internalType: 'enum ReleasePolicy',
                type: 'uint8',
              },
              {
                name: 'shares',
                internalType: 'struct Share[]',
                type: 'tuple[]',
                components: [
                  {
                    name: 'shareBps',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
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
                      {
                        name: 'callData',
                        internalType: 'bytes',
                        type: 'bytes',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'totalUniqueParticipants',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metadataLocked', internalType: 'bool', type: 'bool' },
            ],
          },
          { name: 'addr', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_factory', internalType: 'address', type: 'address' }],
    name: 'setFactory',
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DistributorV1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const distributorV1Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_creator', internalType: 'address', type: 'address' },
      { name: '_factory', internalType: 'address', type: 'address' },
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
            name: 'releasePolicy',
            internalType: 'enum ReleasePolicy',
            type: 'uint8',
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
          {
            name: 'initialMetadata',
            internalType: 'struct MetadataEntry[]',
            type: 'tuple[]',
            components: [
              { name: 'key', internalType: 'string', type: 'string' },
              { name: 'value', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'metadataEditable', internalType: 'bool', type: 'bool' },
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
    name: 'FACTORY',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    name: 'RELEASE_POLICY',
    outputs: [{ name: '', internalType: 'enum ReleasePolicy', type: 'uint8' }],
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
    name: 'contractURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
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
    name: 'getAllMetadata',
    outputs: [
      {
        name: '',
        internalType: 'struct MetadataEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'key', internalType: 'string', type: 'string' },
          { name: 'value', internalType: 'string', type: 'string' },
        ],
      },
    ],
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
            name: 'totalParticipation',
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
          { name: 'owner', internalType: 'address', type: 'address' },
          {
            name: 'releasePolicy',
            internalType: 'enum ReleasePolicy',
            type: 'uint8',
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
            name: 'totalUniqueParticipants',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'metadataLocked', internalType: 'bool', type: 'bool' },
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
    inputs: [{ name: '_key', internalType: 'string', type: 'string' }],
    name: 'getMetadata',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'metadata',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'metadataLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    inputs: [],
    name: 'releaseEpochFunds',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      { name: '_key', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'string', type: 'string' },
    ],
    name: 'setMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct MetadataEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'key', internalType: 'string', type: 'string' },
          { name: 'value', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'setMetadataMany',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_policy', internalType: 'enum ReleasePolicy', type: 'uint8' },
    ],
    name: 'setReleasePolicy',
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
    name: 'totalParticipation',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
        name: 'grossAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Claimed',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'ContractURIUpdated' },
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
        name: 'nextEpochToRelease',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EpochFundsReleased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MetadataLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'MetadataSet',
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
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'policy',
        internalType: 'enum ReleasePolicy',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'ReleasePolicySet',
  },
  {
    type: 'error',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'HookReverted',
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
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'SharesNot100Percent' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EthParticipationRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ethParticipationRouterAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_weth', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WETH',
    outputs: [{ name: '', internalType: 'contract IWETH', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_distributor', internalType: 'address', type: 'address' },
      {
        name: '_params',
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
    name: 'participateManyWithETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_distributor', internalType: 'address', type: 'address' },
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
    name: 'participateWithETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_to', internalType: 'address payable', type: 'address' }],
    name: 'sweepETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ETHSwept',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'distributor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
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
        name: 'amountPerEpoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ParticipatedWithETH',
  },
  { type: 'error', inputs: [], name: 'EmptyParams' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'sent', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectMsgValue',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'ZeroRecipient' },
  { type: 'error', inputs: [], name: 'ZeroWeth' },
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
  {
    type: 'function',
    inputs: [
      { name: '_curveConfig', internalType: 'bytes', type: 'bytes' },
      { name: '_numEpochs', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateTotal',
    outputs: [{ name: 'total', internalType: 'uint256', type: 'uint256' }],
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
      {
        name: '_tokenFactory',
        internalType: 'contract TokenV1Factory',
        type: 'address',
      },
      {
        name: '_distributorFactory',
        internalType: 'contract DistributionV1Factory',
        type: 'address',
      },
      { name: '_feeVault', internalType: 'contract FeeVault', type: 'address' },
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
    name: 'DISTRIBUTOR_FACTORY',
    outputs: [
      {
        name: '',
        internalType: 'contract DistributionV1Factory',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FEE_VAULT',
    outputs: [{ name: '', internalType: 'contract FeeVault', type: 'address' }],
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
    name: 'TOKEN_FACTORY',
    outputs: [
      { name: '', internalType: 'contract TokenV1Factory', type: 'address' },
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
    inputs: [],
    name: 'config',
    outputs: [
      { name: 'protocolFeeBps', internalType: 'uint256', type: 'uint256' },
      { name: 'releaseOperator', internalType: 'address', type: 'address' },
      {
        name: 'buyBackAndBurnMinBps',
        internalType: 'uint256',
        type: 'uint256',
      },
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
            name: 'releasePolicy',
            internalType: 'enum ReleasePolicy',
            type: 'uint8',
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
          {
            name: 'initialMetadata',
            internalType: 'struct MetadataEntry[]',
            type: 'tuple[]',
            components: [
              { name: 'key', internalType: 'string', type: 'string' },
              { name: 'value', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'metadataEditable', internalType: 'bool', type: 'bool' },
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
        name: '_participationTokenAmountMin',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_distributionTokenAmountMin',
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
            name: 'releasePolicy',
            internalType: 'enum ReleasePolicy',
            type: 'uint8',
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
          {
            name: 'initialMetadata',
            internalType: 'struct MetadataEntry[]',
            type: 'tuple[]',
            components: [
              { name: 'key', internalType: 'string', type: 'string' },
              { name: 'value', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'metadataEditable', internalType: 'bool', type: 'bool' },
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
    name: 'createLiquidityAndDistribution',
    outputs: [
      { name: 'pool', internalType: 'address', type: 'address' },
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
      { name: '_amount0Min', internalType: 'uint256', type: 'uint256' },
      { name: '_amount1Min', internalType: 'uint256', type: 'uint256' },
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
      {
        name: '_config',
        internalType: 'struct TokenConfig',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          {
            name: 'allocations',
            internalType: 'struct Allocation[]',
            type: 'tuple[]',
            components: [
              { name: 'recipient', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
              { name: 'startTime', internalType: 'uint256', type: 'uint256' },
              { name: 'duration', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'initialMetadata',
            internalType: 'struct MetadataEntry[]',
            type: 'tuple[]',
            components: [
              { name: 'key', internalType: 'string', type: 'string' },
              { name: 'value', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'metadataEditable', internalType: 'bool', type: 'bool' },
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
      {
        name: '_tokenConfig',
        internalType: 'struct TokenConfig',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          {
            name: 'allocations',
            internalType: 'struct Allocation[]',
            type: 'tuple[]',
            components: [
              { name: 'recipient', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
              { name: 'startTime', internalType: 'uint256', type: 'uint256' },
              { name: 'duration', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'initialMetadata',
            internalType: 'struct MetadataEntry[]',
            type: 'tuple[]',
            components: [
              { name: 'key', internalType: 'string', type: 'string' },
              { name: 'value', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'metadataEditable', internalType: 'bool', type: 'bool' },
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
        name: '_participationTokenAmountMin',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_distributionTokenAmountMin',
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
            name: 'releasePolicy',
            internalType: 'enum ReleasePolicy',
            type: 'uint8',
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
          {
            name: 'initialMetadata',
            internalType: 'struct MetadataEntry[]',
            type: 'tuple[]',
            components: [
              { name: 'key', internalType: 'string', type: 'string' },
              { name: 'value', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'metadataEditable', internalType: 'bool', type: 'bool' },
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
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
      {
        name: '_config',
        internalType: 'struct FactoryConfig',
        type: 'tuple',
        components: [
          { name: 'protocolFeeBps', internalType: 'uint256', type: 'uint256' },
          { name: 'releaseOperator', internalType: 'address', type: 'address' },
          {
            name: 'buyBackAndBurnMinBps',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'sweepToken',
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
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'protocolFeeBps',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'releaseOperator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'buyBackAndBurnMinBps',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FactoryConfigSet',
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
    inputs: [
      { name: 'providedBps', internalType: 'uint256', type: 'uint256' },
      { name: 'minBps', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BuyBackAndBurnShareBelowMinBps',
  },
  {
    type: 'error',
    inputs: [
      { name: 'protocolFeeBps', internalType: 'uint256', type: 'uint256' },
      {
        name: 'buyBackAndBurnMinBps',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'InvalidConfigBps',
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
// FeeVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const feeVaultAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_initialOwner', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cashOut',
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
    name: 'renounceOwnership',
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
  {
    type: 'function',
    inputs: [
      { name: '_curveConfig', internalType: 'bytes', type: 'bytes' },
      { name: '_numEpochs', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateTotal',
    outputs: [{ name: 'total', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IDistributorV1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iDistributorV1Abi = [
  {
    type: 'function',
    inputs: [
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC7729
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc7729Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'metadata',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IFactoryV1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iFactoryV1Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'config',
    outputs: [
      { name: 'protocolFeeBps', internalType: 'uint256', type: 'uint256' },
      { name: 'releaseOperator', internalType: 'address', type: 'address' },
      {
        name: 'buyBackAndBurnMinBps',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IWETH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iwethAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
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
  {
    type: 'function',
    inputs: [
      { name: '_curveConfig', internalType: 'bytes', type: 'bytes' },
      { name: '_numEpochs', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateTotal',
    outputs: [{ name: 'total', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MetadataStore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const metadataStoreAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'contractURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllMetadata',
    outputs: [
      {
        name: '',
        internalType: 'struct MetadataEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'key', internalType: 'string', type: 'string' },
          { name: 'value', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'string', type: 'string' }],
    name: 'getMetadata',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'metadata',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'metadataLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'string', type: 'string' },
    ],
    name: 'setMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct MetadataEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'key', internalType: 'string', type: 'string' },
          { name: 'value', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'setMetadataMany',
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
  { type: 'event', anonymous: false, inputs: [], name: 'ContractURIUpdated' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MetadataLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'MetadataSet',
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenV1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenV1Abi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_config',
        internalType: 'struct TokenConfig',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          {
            name: 'allocations',
            internalType: 'struct Allocation[]',
            type: 'tuple[]',
            components: [
              { name: 'recipient', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
              { name: 'startTime', internalType: 'uint256', type: 'uint256' },
              { name: 'duration', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'initialMetadata',
            internalType: 'struct MetadataEntry[]',
            type: 'tuple[]',
            components: [
              { name: 'key', internalType: 'string', type: 'string' },
              { name: 'value', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'metadataEditable', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: '_initialOwner', internalType: 'address', type: 'address' },
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
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'alreadyClaimed',
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
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_recipient', internalType: 'address', type: 'address' }],
    name: 'claimableOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'contractURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
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
    name: 'getAllMetadata',
    outputs: [
      {
        name: '',
        internalType: 'struct MetadataEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'key', internalType: 'string', type: 'string' },
          { name: 'value', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'string', type: 'string' }],
    name: 'getMetadata',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'metadata',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'metadataLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
      { name: '_key', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'string', type: 'string' },
    ],
    name: 'setMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct MetadataEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'key', internalType: 'string', type: 'string' },
          { name: 'value', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'setMetadataMany',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'share',
    outputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
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
    name: 'tokenURI',
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
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_recipient', internalType: 'address', type: 'address' }],
    name: 'vestingInfo',
    outputs: [
      {
        name: 'info',
        internalType: 'struct VestingInfo',
        type: 'tuple',
        components: [
          { name: 'allocated', internalType: 'uint256', type: 'uint256' },
          { name: 'claimed', internalType: 'uint256', type: 'uint256' },
          { name: 'claimable', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'duration', internalType: 'uint256', type: 'uint256' },
          { name: 'fullyVestedAt', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
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
  { type: 'event', anonymous: false, inputs: [], name: 'ContractURIUpdated' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MetadataLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'MetadataSet',
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenV1Factory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenV1FactoryAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: '_config',
        internalType: 'struct TokenConfig',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          {
            name: 'allocations',
            internalType: 'struct Allocation[]',
            type: 'tuple[]',
            components: [
              { name: 'recipient', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
              { name: 'startTime', internalType: 'uint256', type: 'uint256' },
              { name: 'duration', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'initialMetadata',
            internalType: 'struct MetadataEntry[]',
            type: 'tuple[]',
            components: [
              { name: 'key', internalType: 'string', type: 'string' },
              { name: 'value', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'metadataEditable', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: '_creator', internalType: 'address', type: 'address' },
    ],
    name: 'createToken',
    outputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'creatorOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_size', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTokens',
    outputs: [{ name: 'result', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_factory', internalType: 'address', type: 'address' }],
    name: 'setFactory',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenListLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WETH9
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const weth9Abi = [
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'guy', internalType: 'address', type: 'address' },
      { name: 'wad', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
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
      { name: 'dst', internalType: 'address', type: 'address' },
      { name: 'wad', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'src', internalType: 'address', type: 'address' },
      { name: 'dst', internalType: 'address', type: 'address' },
      { name: 'wad', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'wad', internalType: 'uint256', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'src', internalType: 'address', type: 'address', indexed: true },
      { name: 'guy', internalType: 'address', type: 'address', indexed: true },
      { name: 'wad', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'dst', internalType: 'address', type: 'address', indexed: true },
      { name: 'wad', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'src', internalType: 'address', type: 'address', indexed: true },
      { name: 'dst', internalType: 'address', type: 'address', indexed: true },
      { name: 'wad', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'src', internalType: 'address', type: 'address', indexed: true },
      { name: 'wad', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Withdrawal',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__
 */
export const useReadDistributionV1Factory = /*#__PURE__*/ createUseReadContract(
  { abi: distributionV1FactoryAbi },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__ and `functionName` set to `"creatorOf"`
 */
export const useReadDistributionV1FactoryCreatorOf =
  /*#__PURE__*/ createUseReadContract({
    abi: distributionV1FactoryAbi,
    functionName: 'creatorOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__ and `functionName` set to `"distributionListLength"`
 */
export const useReadDistributionV1FactoryDistributionListLength =
  /*#__PURE__*/ createUseReadContract({
    abi: distributionV1FactoryAbi,
    functionName: 'distributionListLength',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__ and `functionName` set to `"factory"`
 */
export const useReadDistributionV1FactoryFactory =
  /*#__PURE__*/ createUseReadContract({
    abi: distributionV1FactoryAbi,
    functionName: 'factory',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__ and `functionName` set to `"getDistributionsInfo"`
 */
export const useReadDistributionV1FactoryGetDistributionsInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: distributionV1FactoryAbi,
    functionName: 'getDistributionsInfo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__
 */
export const useWriteDistributionV1Factory =
  /*#__PURE__*/ createUseWriteContract({ abi: distributionV1FactoryAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__ and `functionName` set to `"createDistributor"`
 */
export const useWriteDistributionV1FactoryCreateDistributor =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributionV1FactoryAbi,
    functionName: 'createDistributor',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__ and `functionName` set to `"setFactory"`
 */
export const useWriteDistributionV1FactorySetFactory =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributionV1FactoryAbi,
    functionName: 'setFactory',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__
 */
export const useSimulateDistributionV1Factory =
  /*#__PURE__*/ createUseSimulateContract({ abi: distributionV1FactoryAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__ and `functionName` set to `"createDistributor"`
 */
export const useSimulateDistributionV1FactoryCreateDistributor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributionV1FactoryAbi,
    functionName: 'createDistributor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributionV1FactoryAbi}__ and `functionName` set to `"setFactory"`
 */
export const useSimulateDistributionV1FactorySetFactory =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributionV1FactoryAbi,
    functionName: 'setFactory',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributionV1FactoryAbi}__
 */
export const useWatchDistributionV1FactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: distributionV1FactoryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributionV1FactoryAbi}__ and `eventName` set to `"NewDistributor"`
 */
export const useWatchDistributionV1FactoryNewDistributorEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributionV1FactoryAbi,
    eventName: 'NewDistributor',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"FACTORY"`
 */
export const useReadDistributorV1Factory = /*#__PURE__*/ createUseReadContract({
  abi: distributorV1Abi,
  functionName: 'FACTORY',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"RELEASE_POLICY"`
 */
export const useReadDistributorV1ReleasePolicy =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'RELEASE_POLICY',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"contractURI"`
 */
export const useReadDistributorV1ContractUri =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'contractURI',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"getAllMetadata"`
 */
export const useReadDistributorV1GetAllMetadata =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'getAllMetadata',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"getMetadata"`
 */
export const useReadDistributorV1GetMetadata =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'getMetadata',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"metadata"`
 */
export const useReadDistributorV1Metadata = /*#__PURE__*/ createUseReadContract(
  { abi: distributorV1Abi, functionName: 'metadata' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"metadataLocked"`
 */
export const useReadDistributorV1MetadataLocked =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'metadataLocked',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"owner"`
 */
export const useReadDistributorV1Owner = /*#__PURE__*/ createUseReadContract({
  abi: distributorV1Abi,
  functionName: 'owner',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"totalParticipation"`
 */
export const useReadDistributorV1TotalParticipation =
  /*#__PURE__*/ createUseReadContract({
    abi: distributorV1Abi,
    functionName: 'totalParticipation',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"lockMetadata"`
 */
export const useWriteDistributorV1LockMetadata =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'lockMetadata',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"releaseEpochFunds"`
 */
export const useWriteDistributorV1ReleaseEpochFunds =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'releaseEpochFunds',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteDistributorV1RenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'renounceOwnership',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"setMetadata"`
 */
export const useWriteDistributorV1SetMetadata =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'setMetadata',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"setMetadataMany"`
 */
export const useWriteDistributorV1SetMetadataMany =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'setMetadataMany',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"setReleasePolicy"`
 */
export const useWriteDistributorV1SetReleasePolicy =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'setReleasePolicy',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteDistributorV1TransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: distributorV1Abi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__
 */
export const useSimulateDistributorV1 = /*#__PURE__*/ createUseSimulateContract(
  { abi: distributorV1Abi },
)

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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"lockMetadata"`
 */
export const useSimulateDistributorV1LockMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'lockMetadata',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"releaseEpochFunds"`
 */
export const useSimulateDistributorV1ReleaseEpochFunds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'releaseEpochFunds',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateDistributorV1RenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'renounceOwnership',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"setMetadata"`
 */
export const useSimulateDistributorV1SetMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'setMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"setMetadataMany"`
 */
export const useSimulateDistributorV1SetMetadataMany =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'setMetadataMany',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"setReleasePolicy"`
 */
export const useSimulateDistributorV1SetReleasePolicy =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'setReleasePolicy',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link distributorV1Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateDistributorV1TransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: distributorV1Abi,
    functionName: 'transferOwnership',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__ and `eventName` set to `"ContractURIUpdated"`
 */
export const useWatchDistributorV1ContractUriUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributorV1Abi,
    eventName: 'ContractURIUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__ and `eventName` set to `"EpochFundsReleased"`
 */
export const useWatchDistributorV1EpochFundsReleasedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributorV1Abi,
    eventName: 'EpochFundsReleased',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__ and `eventName` set to `"MetadataLocked"`
 */
export const useWatchDistributorV1MetadataLockedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributorV1Abi,
    eventName: 'MetadataLocked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__ and `eventName` set to `"MetadataSet"`
 */
export const useWatchDistributorV1MetadataSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributorV1Abi,
    eventName: 'MetadataSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchDistributorV1OwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributorV1Abi,
    eventName: 'OwnershipTransferred',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link distributorV1Abi}__ and `eventName` set to `"ReleasePolicySet"`
 */
export const useWatchDistributorV1ReleasePolicySetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: distributorV1Abi,
    eventName: 'ReleasePolicySet',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethParticipationRouterAbi}__
 */
export const useReadEthParticipationRouter =
  /*#__PURE__*/ createUseReadContract({ abi: ethParticipationRouterAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethParticipationRouterAbi}__ and `functionName` set to `"WETH"`
 */
export const useReadEthParticipationRouterWeth =
  /*#__PURE__*/ createUseReadContract({
    abi: ethParticipationRouterAbi,
    functionName: 'WETH',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethParticipationRouterAbi}__
 */
export const useWriteEthParticipationRouter =
  /*#__PURE__*/ createUseWriteContract({ abi: ethParticipationRouterAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethParticipationRouterAbi}__ and `functionName` set to `"participateManyWithETH"`
 */
export const useWriteEthParticipationRouterParticipateManyWithEth =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethParticipationRouterAbi,
    functionName: 'participateManyWithETH',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethParticipationRouterAbi}__ and `functionName` set to `"participateWithETH"`
 */
export const useWriteEthParticipationRouterParticipateWithEth =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethParticipationRouterAbi,
    functionName: 'participateWithETH',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethParticipationRouterAbi}__ and `functionName` set to `"sweepETH"`
 */
export const useWriteEthParticipationRouterSweepEth =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethParticipationRouterAbi,
    functionName: 'sweepETH',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethParticipationRouterAbi}__
 */
export const useSimulateEthParticipationRouter =
  /*#__PURE__*/ createUseSimulateContract({ abi: ethParticipationRouterAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethParticipationRouterAbi}__ and `functionName` set to `"participateManyWithETH"`
 */
export const useSimulateEthParticipationRouterParticipateManyWithEth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethParticipationRouterAbi,
    functionName: 'participateManyWithETH',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethParticipationRouterAbi}__ and `functionName` set to `"participateWithETH"`
 */
export const useSimulateEthParticipationRouterParticipateWithEth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethParticipationRouterAbi,
    functionName: 'participateWithETH',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethParticipationRouterAbi}__ and `functionName` set to `"sweepETH"`
 */
export const useSimulateEthParticipationRouterSweepEth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethParticipationRouterAbi,
    functionName: 'sweepETH',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethParticipationRouterAbi}__
 */
export const useWatchEthParticipationRouterEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ethParticipationRouterAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethParticipationRouterAbi}__ and `eventName` set to `"ETHSwept"`
 */
export const useWatchEthParticipationRouterEthSweptEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethParticipationRouterAbi,
    eventName: 'ETHSwept',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethParticipationRouterAbi}__ and `eventName` set to `"ParticipatedWithETH"`
 */
export const useWatchEthParticipationRouterParticipatedWithEthEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethParticipationRouterAbi,
    eventName: 'ParticipatedWithETH',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link exponentialEmissionAbi}__ and `functionName` set to `"calculateTotal"`
 */
export const useReadExponentialEmissionCalculateTotal =
  /*#__PURE__*/ createUseReadContract({
    abi: exponentialEmissionAbi,
    functionName: 'calculateTotal',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"DISTRIBUTOR_FACTORY"`
 */
export const useReadFactoryV1DistributorFactory =
  /*#__PURE__*/ createUseReadContract({
    abi: factoryV1Abi,
    functionName: 'DISTRIBUTOR_FACTORY',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"FEE_VAULT"`
 */
export const useReadFactoryV1FeeVault = /*#__PURE__*/ createUseReadContract({
  abi: factoryV1Abi,
  functionName: 'FEE_VAULT',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"TOKEN_FACTORY"`
 */
export const useReadFactoryV1TokenFactory = /*#__PURE__*/ createUseReadContract(
  { abi: factoryV1Abi, functionName: 'TOKEN_FACTORY' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"TRANSFER_TO_HOOK"`
 */
export const useReadFactoryV1TransferToHook =
  /*#__PURE__*/ createUseReadContract({
    abi: factoryV1Abi,
    functionName: 'TRANSFER_TO_HOOK',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"config"`
 */
export const useReadFactoryV1Config = /*#__PURE__*/ createUseReadContract({
  abi: factoryV1Abi,
  functionName: 'config',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"owner"`
 */
export const useReadFactoryV1Owner = /*#__PURE__*/ createUseReadContract({
  abi: factoryV1Abi,
  functionName: 'owner',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"createLiquidityAndDistribution"`
 */
export const useWriteFactoryV1CreateLiquidityAndDistribution =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryV1Abi,
    functionName: 'createLiquidityAndDistribution',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteFactoryV1RenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryV1Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"setConfig"`
 */
export const useWriteFactoryV1SetConfig = /*#__PURE__*/ createUseWriteContract({
  abi: factoryV1Abi,
  functionName: 'setConfig',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"sweepToken"`
 */
export const useWriteFactoryV1SweepToken = /*#__PURE__*/ createUseWriteContract(
  { abi: factoryV1Abi, functionName: 'sweepToken' },
)

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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"createLiquidityAndDistribution"`
 */
export const useSimulateFactoryV1CreateLiquidityAndDistribution =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'createLiquidityAndDistribution',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateFactoryV1RenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"setConfig"`
 */
export const useSimulateFactoryV1SetConfig =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'setConfig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryV1Abi}__ and `functionName` set to `"sweepToken"`
 */
export const useSimulateFactoryV1SweepToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryV1Abi,
    functionName: 'sweepToken',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link factoryV1Abi}__ and `eventName` set to `"FactoryConfigSet"`
 */
export const useWatchFactoryV1FactoryConfigSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: factoryV1Abi,
    eventName: 'FactoryConfigSet',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link feeVaultAbi}__
 */
export const useReadFeeVault = /*#__PURE__*/ createUseReadContract({
  abi: feeVaultAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link feeVaultAbi}__ and `functionName` set to `"owner"`
 */
export const useReadFeeVaultOwner = /*#__PURE__*/ createUseReadContract({
  abi: feeVaultAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link feeVaultAbi}__
 */
export const useWriteFeeVault = /*#__PURE__*/ createUseWriteContract({
  abi: feeVaultAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link feeVaultAbi}__ and `functionName` set to `"cashOut"`
 */
export const useWriteFeeVaultCashOut = /*#__PURE__*/ createUseWriteContract({
  abi: feeVaultAbi,
  functionName: 'cashOut',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link feeVaultAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteFeeVaultRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: feeVaultAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link feeVaultAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteFeeVaultTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: feeVaultAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link feeVaultAbi}__
 */
export const useSimulateFeeVault = /*#__PURE__*/ createUseSimulateContract({
  abi: feeVaultAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link feeVaultAbi}__ and `functionName` set to `"cashOut"`
 */
export const useSimulateFeeVaultCashOut =
  /*#__PURE__*/ createUseSimulateContract({
    abi: feeVaultAbi,
    functionName: 'cashOut',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link feeVaultAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateFeeVaultRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: feeVaultAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link feeVaultAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateFeeVaultTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: feeVaultAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link feeVaultAbi}__
 */
export const useWatchFeeVaultEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: feeVaultAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link feeVaultAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchFeeVaultOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: feeVaultAbi,
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fixedEmissionAbi}__ and `functionName` set to `"calculateTotal"`
 */
export const useReadFixedEmissionCalculateTotal =
  /*#__PURE__*/ createUseReadContract({
    abi: fixedEmissionAbi,
    functionName: 'calculateTotal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iDistributorV1Abi}__
 */
export const useWriteIDistributorV1 = /*#__PURE__*/ createUseWriteContract({
  abi: iDistributorV1Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iDistributorV1Abi}__ and `functionName` set to `"participate"`
 */
export const useWriteIDistributorV1Participate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iDistributorV1Abi,
    functionName: 'participate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iDistributorV1Abi}__ and `functionName` set to `"participateMany"`
 */
export const useWriteIDistributorV1ParticipateMany =
  /*#__PURE__*/ createUseWriteContract({
    abi: iDistributorV1Abi,
    functionName: 'participateMany',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iDistributorV1Abi}__
 */
export const useSimulateIDistributorV1 =
  /*#__PURE__*/ createUseSimulateContract({ abi: iDistributorV1Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iDistributorV1Abi}__ and `functionName` set to `"participate"`
 */
export const useSimulateIDistributorV1Participate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iDistributorV1Abi,
    functionName: 'participate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iDistributorV1Abi}__ and `functionName` set to `"participateMany"`
 */
export const useSimulateIDistributorV1ParticipateMany =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iDistributorV1Abi,
    functionName: 'participateMany',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc7729Abi}__
 */
export const useReadIerc7729 = /*#__PURE__*/ createUseReadContract({
  abi: ierc7729Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc7729Abi}__ and `functionName` set to `"metadata"`
 */
export const useReadIerc7729Metadata = /*#__PURE__*/ createUseReadContract({
  abi: ierc7729Abi,
  functionName: 'metadata',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iFactoryV1Abi}__
 */
export const useReadIFactoryV1 = /*#__PURE__*/ createUseReadContract({
  abi: iFactoryV1Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iFactoryV1Abi}__ and `functionName` set to `"config"`
 */
export const useReadIFactoryV1Config = /*#__PURE__*/ createUseReadContract({
  abi: iFactoryV1Abi,
  functionName: 'config',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iFactoryV1Abi}__ and `functionName` set to `"owner"`
 */
export const useReadIFactoryV1Owner = /*#__PURE__*/ createUseReadContract({
  abi: iFactoryV1Abi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iwethAbi}__
 */
export const useWriteIweth = /*#__PURE__*/ createUseWriteContract({
  abi: iwethAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iwethAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteIwethDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: iwethAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iwethAbi}__
 */
export const useSimulateIweth = /*#__PURE__*/ createUseSimulateContract({
  abi: iwethAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iwethAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateIwethDeposit = /*#__PURE__*/ createUseSimulateContract({
  abi: iwethAbi,
  functionName: 'deposit',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link linearEmissionAbi}__ and `functionName` set to `"calculateTotal"`
 */
export const useReadLinearEmissionCalculateTotal =
  /*#__PURE__*/ createUseReadContract({
    abi: linearEmissionAbi,
    functionName: 'calculateTotal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataStoreAbi}__
 */
export const useReadMetadataStore = /*#__PURE__*/ createUseReadContract({
  abi: metadataStoreAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"contractURI"`
 */
export const useReadMetadataStoreContractUri =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataStoreAbi,
    functionName: 'contractURI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"getAllMetadata"`
 */
export const useReadMetadataStoreGetAllMetadata =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataStoreAbi,
    functionName: 'getAllMetadata',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"getMetadata"`
 */
export const useReadMetadataStoreGetMetadata =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataStoreAbi,
    functionName: 'getMetadata',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"metadata"`
 */
export const useReadMetadataStoreMetadata = /*#__PURE__*/ createUseReadContract(
  { abi: metadataStoreAbi, functionName: 'metadata' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"metadataLocked"`
 */
export const useReadMetadataStoreMetadataLocked =
  /*#__PURE__*/ createUseReadContract({
    abi: metadataStoreAbi,
    functionName: 'metadataLocked',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"owner"`
 */
export const useReadMetadataStoreOwner = /*#__PURE__*/ createUseReadContract({
  abi: metadataStoreAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link metadataStoreAbi}__
 */
export const useWriteMetadataStore = /*#__PURE__*/ createUseWriteContract({
  abi: metadataStoreAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"lockMetadata"`
 */
export const useWriteMetadataStoreLockMetadata =
  /*#__PURE__*/ createUseWriteContract({
    abi: metadataStoreAbi,
    functionName: 'lockMetadata',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteMetadataStoreRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: metadataStoreAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"setMetadata"`
 */
export const useWriteMetadataStoreSetMetadata =
  /*#__PURE__*/ createUseWriteContract({
    abi: metadataStoreAbi,
    functionName: 'setMetadata',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"setMetadataMany"`
 */
export const useWriteMetadataStoreSetMetadataMany =
  /*#__PURE__*/ createUseWriteContract({
    abi: metadataStoreAbi,
    functionName: 'setMetadataMany',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteMetadataStoreTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: metadataStoreAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link metadataStoreAbi}__
 */
export const useSimulateMetadataStore = /*#__PURE__*/ createUseSimulateContract(
  { abi: metadataStoreAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"lockMetadata"`
 */
export const useSimulateMetadataStoreLockMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: metadataStoreAbi,
    functionName: 'lockMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateMetadataStoreRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: metadataStoreAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"setMetadata"`
 */
export const useSimulateMetadataStoreSetMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: metadataStoreAbi,
    functionName: 'setMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"setMetadataMany"`
 */
export const useSimulateMetadataStoreSetMetadataMany =
  /*#__PURE__*/ createUseSimulateContract({
    abi: metadataStoreAbi,
    functionName: 'setMetadataMany',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link metadataStoreAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateMetadataStoreTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: metadataStoreAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link metadataStoreAbi}__
 */
export const useWatchMetadataStoreEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: metadataStoreAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link metadataStoreAbi}__ and `eventName` set to `"ContractURIUpdated"`
 */
export const useWatchMetadataStoreContractUriUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: metadataStoreAbi,
    eventName: 'ContractURIUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link metadataStoreAbi}__ and `eventName` set to `"MetadataLocked"`
 */
export const useWatchMetadataStoreMetadataLockedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: metadataStoreAbi,
    eventName: 'MetadataLocked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link metadataStoreAbi}__ and `eventName` set to `"MetadataSet"`
 */
export const useWatchMetadataStoreMetadataSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: metadataStoreAbi,
    eventName: 'MetadataSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link metadataStoreAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchMetadataStoreOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: metadataStoreAbi,
    eventName: 'OwnershipTransferred',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"alreadyClaimed"`
 */
export const useReadTokenV1AlreadyClaimed = /*#__PURE__*/ createUseReadContract(
  { abi: tokenV1Abi, functionName: 'alreadyClaimed' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadTokenV1BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"claimableOf"`
 */
export const useReadTokenV1ClaimableOf = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'claimableOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"contractURI"`
 */
export const useReadTokenV1ContractUri = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'contractURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadTokenV1Decimals = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"getAllMetadata"`
 */
export const useReadTokenV1GetAllMetadata = /*#__PURE__*/ createUseReadContract(
  { abi: tokenV1Abi, functionName: 'getAllMetadata' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"getMetadata"`
 */
export const useReadTokenV1GetMetadata = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'getMetadata',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"metadata"`
 */
export const useReadTokenV1Metadata = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'metadata',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"metadataLocked"`
 */
export const useReadTokenV1MetadataLocked = /*#__PURE__*/ createUseReadContract(
  { abi: tokenV1Abi, functionName: 'metadataLocked' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"name"`
 */
export const useReadTokenV1Name = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"owner"`
 */
export const useReadTokenV1Owner = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"share"`
 */
export const useReadTokenV1Share = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'share',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadTokenV1SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenV1Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadTokenV1Symbol = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadTokenV1TokenUri = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadTokenV1TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"vestingInfo"`
 */
export const useReadTokenV1VestingInfo = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1Abi,
  functionName: 'vestingInfo',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"claim"`
 */
export const useWriteTokenV1Claim = /*#__PURE__*/ createUseWriteContract({
  abi: tokenV1Abi,
  functionName: 'claim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"lockMetadata"`
 */
export const useWriteTokenV1LockMetadata = /*#__PURE__*/ createUseWriteContract(
  { abi: tokenV1Abi, functionName: 'lockMetadata' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteTokenV1RenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenV1Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"setMetadata"`
 */
export const useWriteTokenV1SetMetadata = /*#__PURE__*/ createUseWriteContract({
  abi: tokenV1Abi,
  functionName: 'setMetadata',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"setMetadataMany"`
 */
export const useWriteTokenV1SetMetadataMany =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenV1Abi,
    functionName: 'setMetadataMany',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteTokenV1TransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenV1Abi,
    functionName: 'transferOwnership',
  })

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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"claim"`
 */
export const useSimulateTokenV1Claim = /*#__PURE__*/ createUseSimulateContract({
  abi: tokenV1Abi,
  functionName: 'claim',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"lockMetadata"`
 */
export const useSimulateTokenV1LockMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenV1Abi,
    functionName: 'lockMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateTokenV1RenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenV1Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"setMetadata"`
 */
export const useSimulateTokenV1SetMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenV1Abi,
    functionName: 'setMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"setMetadataMany"`
 */
export const useSimulateTokenV1SetMetadataMany =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenV1Abi,
    functionName: 'setMetadataMany',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateTokenV1TransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenV1Abi,
    functionName: 'transferOwnership',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenV1Abi}__ and `eventName` set to `"ContractURIUpdated"`
 */
export const useWatchTokenV1ContractUriUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenV1Abi,
    eventName: 'ContractURIUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenV1Abi}__ and `eventName` set to `"MetadataLocked"`
 */
export const useWatchTokenV1MetadataLockedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenV1Abi,
    eventName: 'MetadataLocked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenV1Abi}__ and `eventName` set to `"MetadataSet"`
 */
export const useWatchTokenV1MetadataSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenV1Abi,
    eventName: 'MetadataSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenV1Abi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchTokenV1OwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenV1Abi,
    eventName: 'OwnershipTransferred',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__
 */
export const useReadTokenV1Factory = /*#__PURE__*/ createUseReadContract({
  abi: tokenV1FactoryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__ and `functionName` set to `"creatorOf"`
 */
export const useReadTokenV1FactoryCreatorOf =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenV1FactoryAbi,
    functionName: 'creatorOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__ and `functionName` set to `"factory"`
 */
export const useReadTokenV1FactoryFactory = /*#__PURE__*/ createUseReadContract(
  { abi: tokenV1FactoryAbi, functionName: 'factory' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__ and `functionName` set to `"getTokens"`
 */
export const useReadTokenV1FactoryGetTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenV1FactoryAbi,
    functionName: 'getTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__ and `functionName` set to `"tokenListLength"`
 */
export const useReadTokenV1FactoryTokenListLength =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenV1FactoryAbi,
    functionName: 'tokenListLength',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__
 */
export const useWriteTokenV1Factory = /*#__PURE__*/ createUseWriteContract({
  abi: tokenV1FactoryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__ and `functionName` set to `"createToken"`
 */
export const useWriteTokenV1FactoryCreateToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenV1FactoryAbi,
    functionName: 'createToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__ and `functionName` set to `"setFactory"`
 */
export const useWriteTokenV1FactorySetFactory =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenV1FactoryAbi,
    functionName: 'setFactory',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__
 */
export const useSimulateTokenV1Factory =
  /*#__PURE__*/ createUseSimulateContract({ abi: tokenV1FactoryAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__ and `functionName` set to `"createToken"`
 */
export const useSimulateTokenV1FactoryCreateToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenV1FactoryAbi,
    functionName: 'createToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenV1FactoryAbi}__ and `functionName` set to `"setFactory"`
 */
export const useSimulateTokenV1FactorySetFactory =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenV1FactoryAbi,
    functionName: 'setFactory',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenV1FactoryAbi}__
 */
export const useWatchTokenV1FactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: tokenV1FactoryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenV1FactoryAbi}__ and `eventName` set to `"NewToken"`
 */
export const useWatchTokenV1FactoryNewTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenV1FactoryAbi,
    eventName: 'NewToken',
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

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link weth9Abi}__
 */
export const useReadWeth9 = /*#__PURE__*/ createUseReadContract({
  abi: weth9Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadWeth9Allowance = /*#__PURE__*/ createUseReadContract({
  abi: weth9Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadWeth9BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: weth9Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadWeth9Decimals = /*#__PURE__*/ createUseReadContract({
  abi: weth9Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"name"`
 */
export const useReadWeth9Name = /*#__PURE__*/ createUseReadContract({
  abi: weth9Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadWeth9Symbol = /*#__PURE__*/ createUseReadContract({
  abi: weth9Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadWeth9TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: weth9Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link weth9Abi}__
 */
export const useWriteWeth9 = /*#__PURE__*/ createUseWriteContract({
  abi: weth9Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteWeth9Approve = /*#__PURE__*/ createUseWriteContract({
  abi: weth9Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"deposit"`
 */
export const useWriteWeth9Deposit = /*#__PURE__*/ createUseWriteContract({
  abi: weth9Abi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteWeth9Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: weth9Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteWeth9TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: weth9Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteWeth9Withdraw = /*#__PURE__*/ createUseWriteContract({
  abi: weth9Abi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link weth9Abi}__
 */
export const useSimulateWeth9 = /*#__PURE__*/ createUseSimulateContract({
  abi: weth9Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateWeth9Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: weth9Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateWeth9Deposit = /*#__PURE__*/ createUseSimulateContract({
  abi: weth9Abi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateWeth9Transfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: weth9Abi, functionName: 'transfer' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateWeth9TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: weth9Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link weth9Abi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateWeth9Withdraw = /*#__PURE__*/ createUseSimulateContract(
  { abi: weth9Abi, functionName: 'withdraw' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link weth9Abi}__
 */
export const useWatchWeth9Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: weth9Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link weth9Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchWeth9ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: weth9Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link weth9Abi}__ and `eventName` set to `"Deposit"`
 */
export const useWatchWeth9DepositEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: weth9Abi,
    eventName: 'Deposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link weth9Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchWeth9TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: weth9Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link weth9Abi}__ and `eventName` set to `"Withdrawal"`
 */
export const useWatchWeth9WithdrawalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: weth9Abi,
    eventName: 'Withdrawal',
  })
