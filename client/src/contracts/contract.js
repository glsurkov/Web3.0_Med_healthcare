export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
export const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "enterOrganizationName",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "previousHash",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "newHash",
                "type": "string"
            }
        ],
        "name": "CardUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "contractAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "cause",
                "type": "string"
            }
        ],
        "name": "Error",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "previousAdminRole",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "newAdminRole",
                "type": "bytes32"
            }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "userName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "userSurname",
                "type": "string"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "jsonHash",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lastUpdate",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct Control.Card",
                "name": "userCard",
                "type": "tuple"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "userRole",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "UserAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "userName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "userSurname",
                "type": "string"
            }
        ],
        "name": "UserRemoved",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "DOCTOR_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "USER_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_userAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_userName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_userSurname",
                "type": "string"
            },
            {
                "internalType": "uint128",
                "name": "_userAge",
                "type": "uint128"
            },
            {
                "internalType": "string",
                "name": "_userRole",
                "type": "string"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "jsonHash",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lastUpdate",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Control.Card",
                "name": "_userCard",
                "type": "tuple"
            }
        ],
        "name": "addUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "_status",
                "type": "bool"
            }
        ],
        "name": "changeStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllUsers",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFullDoctors",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "userName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "userSurname",
                        "type": "string"
                    },
                    {
                        "internalType": "uint128",
                        "name": "userAge",
                        "type": "uint128"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userSince",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userRole",
                        "type": "string"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "jsonHash",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lastUpdate",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct Control.Card",
                        "name": "userCard",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct Control.UserStruct[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFullUsers",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "userName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "userSurname",
                        "type": "string"
                    },
                    {
                        "internalType": "uint128",
                        "name": "userAge",
                        "type": "uint128"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userSince",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userRole",
                        "type": "string"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "jsonHash",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lastUpdate",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct Control.Card",
                        "name": "userCard",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct Control.UserStruct[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNoOfDoctors",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNoOfUsers",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOnlyDoctors",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOnlyUsers",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "ownerAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "organizationName",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "dateCreated",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "name": "getRoleAdmin",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            }
        ],
        "name": "getSpecificUser",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "userName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "userSurname",
                        "type": "string"
                    },
                    {
                        "internalType": "uint128",
                        "name": "userAge",
                        "type": "uint128"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userSince",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userRole",
                        "type": "string"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "jsonHash",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lastUpdate",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct Control.Card",
                        "name": "userCard",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct Control.UserStruct",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "hasRole",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_userAddress",
                "type": "address"
            }
        ],
        "name": "removeUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_userAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_jsonHash",
                "type": "string"
            }
        ],
        "name": "updateCard",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]