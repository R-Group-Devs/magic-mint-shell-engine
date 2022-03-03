// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@r-group/shell-contracts/contracts/engines/ShellBaseEngine.sol";

contract MagicMintEngine is ShellBaseEngine {
    /// @notice Displayed on heyshell.xyz
    function name() external pure returns (string memory) {
        return "magic-mint-v1";
    }

    function getTokenURI(IShellFramework collection, uint256 tokenId)
        external
        view
        override
        returns (string memory)
    {
        // TODO: use aave gov v2 style encoding to store ipfsHash in a single
        // slot instead of a string
        string memory ipfsHash = collection.readTokenString(
            StorageLocation.MINT_DATA,
            tokenId,
            "ipfsHash"
        );
        return string.concat("ipfs://ipfs/", ipfsHash);
    }

    // TODO: this method should require a signature, ie erc712
    function mint(
        IShellFramework collection,
        address to,
        string calldata ipfsHash
    ) external returns (uint256) {
        StringStorage[] memory stringData = new StringStorage[](1);
        IntStorage[] memory intData = new IntStorage[](0);

        stringData[0] = StringStorage({key: "ipfsHash", value: ipfsHash});

        uint256 tokenId = collection.mint(
            MintEntry({
                to: to,
                amount: 1,
                options: MintOptions({
                    storeEngine: false,
                    storeMintedTo: false,
                    storeTimestamp: false,
                    storeBlockNumber: false,
                    stringData: stringData,
                    intData: intData
                })
            })
        );

        return tokenId;
    }
}
