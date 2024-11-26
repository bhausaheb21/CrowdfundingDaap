// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;



contract CampaignFactory {
    address[] public deployedCampaigns;

    event CampaignCreated(
        string title,
        uint256 required_amt,
        address indexed owner,
        address campaignAddress,
        string indexed category,
        uint256 indexed timestamp,
        string imgURI
    );

    function createCampaign(
        string memory cTitle,
        uint256 requiredAmt,
        string memory imgUrl,
        string memory storyURL,
        string memory category
    ) public {
        Campaign newCampaign = new Campaign(
            cTitle,
            requiredAmt,
            imgUrl,
            storyURL,
            msg.sender
        );

        deployedCampaigns.push(address(newCampaign));

        emit CampaignCreated(
            cTitle,
            requiredAmt,
            address(msg.sender),
            address(newCampaign),
            category,
            block.timestamp,
            imgUrl
        );
    }
}

contract Campaign {
    string public title;
    uint256 public required_amt;
    string public image;
    string public story;
    address payable public owner;
    uint256 public received_amt;

    event donated(address indexed donor, uint256 amount, uint256 timestamp);

    constructor(
        string memory campaignTitle,
        uint256 comapign_req_amt,
        string memory imURI,
        string memory campaignStory,
        address campaignOwner
    ) {
        title = campaignTitle;
        required_amt = comapign_req_amt;
        image = imURI;
        story = campaignStory;
        received_amt = 0;
        owner = payable(campaignOwner);
    }

    function donate() public payable {
        
        owner.transfer(msg.value);
        received_amt += msg.value;
        emit donated(msg.sender, msg.value, block.timestamp);
    }
}
