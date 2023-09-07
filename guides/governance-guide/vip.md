# Submitting a VIP

### Overview

Venus Protocol's governance model allows XVS token holders to propose and vote on Venus Improvement Proposals (VIPs). Here's a step-by-step guide to help you create and submit a proposal.

{% hint style="info" %}
Remember, you need a voting weight of at least 300,000 to submit a proposal.
{% endhint %}

### Step 1: Visit the Venus Governance Portal

Navigate to the Venus Governance Portal using your preferred web browser. You can access the portal at <https://app.venus.io/governance>.

### Step 2: Connect Your Wallet

To submit a proposal, you need to connect your wallet by clicking on the "Connect Wallet" button at the top right corner of the screen. A menu will appear listing various wallets that the Venus Governance Portal supports. Select your wallet from the menu and follow the instructions to connect your wallet to the portal.

### Step 3: Create a Proposal

Now that your wallet is connected, you can create a proposal. Look for the "Create Proposal" button at the top right corner of the screen and click on it.

<figure><img src="../../.gitbook/assets/VIP_create_proposal_3.jpg" alt=""><figcaption></figcaption></figure>

This action will open a modal presenting two options - "Upload file" and "Create Manually":

<figure><img src="../../.gitbook/assets/VIP_create_modal_3.png" alt=""><figcaption></figcaption></figure>

### Step 4: Upload a proposal file

The fastest way to create a proposal is by importing a VIP file. The import uses a JSON file containing all the information needed to create a VIP, such as the proposal's title, type, actions and parameters.

Venus makes available a tool to generate VIP files, which you can find [here](https://github.com/VenusProtocol/vips#create-proposal). You can also check an example of a valid proposal file [here](https://github.com/VenusProtocol/venus-protocol-interface/blob/main/src/assets/proposals/vip-123.json). Note that all the fields will be validated according to their requirements and types.

#### Step 4.1: Choose a VIP file

Clicking "Upload file" will lead you to choose the proposal file you want to upload. After uploading the desired file, it will be parsed and validated and any possible errors found will be reported by the interface.

#### Step 4.2: Confirm the Proposal

Once the import is successfully validated, the interface will present all the VIP data for your review:

<figure><img src="../../.gitbook/assets/VIP_import_confirm_4-2.png" alt=""><figcaption></figcaption></figure>

If everything looks good, click "Create" at the bottom of the modal to confirm the creation of your VIP.

### Step 5: Create a Proposal Manually

Proposals can also be created manually by clicking on "Create manually".

#### Step 5.1: Choose the Proposal Type

After clicking the "Create manually" button, a new interface will pop up prompting you to select the proposal type. Select the relevant proposal type for the change you want to propose.

<figure><img src="../../.gitbook/assets/VIP_select_type_5-1.jpg" alt=""><figcaption></figcaption></figure>

#### Step 5.2: Enter Proposal Information

The next step is to provide detailed information about your proposal. This includes the proposal's title, a brief description, and a link to an off-chain discussion related to your proposal. Ensure the information you provide is clear and concise to facilitate understanding by other community members.

<figure><img src="../../.gitbook/assets/VIP_proposal_info_5-2.jpg" alt=""><figcaption></figcaption></figure>

#### Step 5.3: Set the Voting Options

The third screen is where you can specify descriptions for the voting options (for, against, abstain).

<figure><img src="../../.gitbook/assets/VIP_voting_options_5-3.jpg" alt=""><figcaption></figcaption></figure>

#### Step 5.4: Specify the Actions

Next add the actions that will take place if the proposal is approved. An action requires an contract address, function signature and arguments so that the operation can be created correctly.

<figure><img src="../../.gitbook/assets/VIP_actions_5-4.jpg" alt=""><figcaption></figcaption></figure>

#### Step 5.5: Confirm the Proposal Submission

Finally, just like after the VIP import, you will be able to review your proposal to ensure all details are accurate. After confirming everything is correct, click the "Submit" button to submit your proposal. You'll see a confirmation prompt on your connected wallet. Confirm the transaction to complete the proposal submission process.

<figure><img src="../../.gitbook/assets/VIP_confirm_5-5.jpg" alt=""><figcaption></figcaption></figure>

Congratulations! You've successfully submitted a Venus Improvement Proposal. The Venus community will now review your proposal and vote on it. Remember, your active involvement in Venus Protocol's governance process is crucial for its continued development and success.
