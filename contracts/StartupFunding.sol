// contracts/StartupFunding.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StartupFunding {
    struct Startup {
        address payable creator;
        uint256 goal;
        bool funded;
    }

    mapping(uint256 => Startup) public startups;
    uint256 public startupCount;

    event StartupCreated(uint256 startupId, address creator, uint256 goal);
    event StartupFunded(uint256 startupId, address investor);

    function createStartup(uint256 goal) public {
        startupCount++;
        startups[startupCount] = Startup({
            creator: payable(msg.sender),
            goal: goal,
            funded: false
        });
        emit StartupCreated(startupCount, msg.sender, goal);
    }

    function fundStartup(uint256 startupId) public payable {
        Startup storage startup = startups[startupId];
        require(!startup.funded, "Startup already funded");
        require(msg.value == startup.goal, "Must send exact goal amount");

        startup.funded = true;
        startup.creator.transfer(msg.value);
        emit StartupFunded(startupId, msg.sender);
    }
}
