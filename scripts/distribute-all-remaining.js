const { ethers } = require("hardhat");
const readline = require("readline");

// Create readline interface for user confirmation prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user for confirmation
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Convert token amount from human-readable to wei (with 18 decimals)
function toTokenAmount(amount) {
  return ethers.utils.parseUnits(amount.toString(), 18);
}

async function main() {
  try {
    console.log("⚠️ LIVE MODE - TRANSACTIONS WILL BE SENT TO THE BLOCKCHAIN ⚠️");
    console.log("You will be asked to confirm each batch before sending");
    
    const confirmed = await prompt("Are you sure you want to proceed with LIVE distribution? (y/n): ");
    if (!confirmed) {
      console.log("Distribution cancelled by user.");
      process.exit(0);
    }
    
    console.log("Starting TWG Token distribution process for remaining addresses...");
    
    // Contract address for the deployed TWGToken
    const contractAddress = "0x6EB64894CFb6a7d00749781aD01975584822dD5F";
    
    // Get the signer (contract owner)
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer address: ${deployer.address}`);
    
    // Get the contract instance
    const TWGToken = await ethers.getContractFactory("TWGToken");
    const token = await TWGToken.attach(contractAddress);

    // First, check which addresses already have tokens
    console.log("Checking already distributed addresses...");
    
    // First 40 addresses that have already received tokens
    const existingAddresses = [
      // First batch (1-20)
      "0x768bBDAE55D43C780eD157f6C719d2F00c5A9E2B",
      "0xa137F52f96f124471d146cc36940c23935117f62",
      "0xEd7c2962b4f3B3D129Eb4DC4fdd8487E903Dd66d",
      "0x80358cB739e09E900EE04abD64aA1a8a3C6C558E",
      "0x042d0666b9258801c9bDBF7BF8D8520E0A4EbB24",
      "0x6D478dcA46a1EF30553BC324F27665F7F464B529",
      "0x2492fDA5F5F98D8679A90858baf011e0CB7AF427",
      "0x030a94A22a7AD7863faF33D0f9D252106DF10664",
      "0xC5eE20131B0fF69bC8fF66aE8b15Fc44E04f2334",
      "0xAe82E3929dF0BFfBe974444A357209A4f287333d",
      "0x3cb7fb96C13d0F26032D492f49DD873A790310fB",
      "0x173F1c6Ab0Ec507bc3571736926083B1D974b680",
      "0x05749ce20C8682438580c011e5104884C3b4192a",
      "0xBd937e1b4C8dA2090452A0053cc669cC6F6ca0D5",
      "0x3DDC1CB46DAb13cD8a173214a8525efe80C84F0f",
      "0xd4C8EC619DA2A9902288Fd065dcC29C4DacE59E4",
      "0xC5B9dfA6560d0E4652402D08ADA21FF35C3041BE",
      "0x3a47CA92e62389133Afd5261F61bfb7936ba5d2d",
      "0x5A7484B32F416C95213C0b89F6A32199be830A6F",
      "0x59FF3e1A4C7a0e1813EF88084eC2cb48719a2cE1",
      
      // Second batch (21-40)
      "0x261b5304d60EC5808aB0869E17F2592de8eD6180",
      "0xdD806a52Fd9264207Da6d3133417098870e431C4",
      "0x60aBF0d99E06C7bf9414568b64F34B7e270135E1",
      "0x750A118512434664084Ea281A015aA41993D23E8",
      "0x1444523A809d0FB54b761C389939ed7Ca0d821bd",
      "0xB2B047320Bf34FbB0f426134D346c77b29579f9a",
      "0xeE6bD51Dc34EE2AEeDB8a40CB7498BAb0478A896",
      "0x950A8decfF04d36e281422164DEbFb90c562d4e9",
      "0x7cc71A40F45cfE8fE2beeb8331070118c3bCa792",
      "0x59145A76F3366A787514FD45d0E02Ac57D72fD8d",
      "0xefF15cFDA5a35eaF45756F6A68f9c97DEf76014f",
      "0xC912F1Ce75DB8830e0cb1e4f4C2F1Aa214f61D1e",
      "0x4aE31a58094d082D2c9a335100CEbA6f9F3f373a",
      "0xe68c01f3F9BD19e7bDB6C2cE5978b267C4c600c5",
      "0x2808f8D60e87eBEC6F98Ed8DFfe452Ad8874998b",
      "0xCF17d55c6dd264052188AE80044BFE589425238b",
      "0xb3439fEaB0b1955ecF85841cA28EA513Ef556884",
      "0x8Fd0491bA7Ed00996b681C7b66ff066c5eF7E935",
      "0xa3d33c7f150B569F99BE6a1F388E60e7D956c361",
      "0x4Ad405de1c412709f473F24D2621A3743a9d946b"
    ];
    
    // Define all the remaining addresses and amounts for distribution
    // These are the addresses that haven't received tokens yet
    const distribution = [
      // Batch 3 (addresses 41-60)
      { address: "0x98F1870045185ccb6F33fbE8C4a4ebf55798aa74", amount: "119884100", category: "TW41", vesting: "MARKET MAKER" },
      { address: "0xC14967a69C4bF3c97D4D3F71e837aB542f401288", amount: "76565600", category: "TW42", vesting: "MARKET MAKER" },
      { address: "0x9400DAbcbE3873560EEC16a8FDbf275354d9DE38", amount: "84656230", category: "TW43", vesting: "MARKET MAKER" },
      { address: "0x7b77eFbf95b54dbDFf06d2e0Dcba52555CF12594", amount: "92778854", category: "TW44", vesting: "MARKET MAKER" },
      { address: "0xbc12715Ef5Ec2889EFa4aa080fDb6A0d2e90698B", amount: "84789520", category: "TW45", vesting: "MARKET MAKER" },
      
      // MIGRATOR addresses - add all migrator addresses here
      { address: "0xbF914276dFf555c187cCe589D29D1a10f240dB00", amount: "5078", category: "MIGRATOR", vesting: "" },
      { address: "0xa67eC03B9eD5234AC8E40e13f3Fc5b37F344A0C4", amount: "7074", category: "MIGRATOR", vesting: "" },
      { address: "0xf6F7266Ab2653B8746DaDd405Afa36eca961B7f6", amount: "9980", category: "MIGRATOR", vesting: "" },
      { address: "0x13Ba6E7256fF6702A309E144Da648810F7be052b", amount: "15889", category: "MIGRATOR", vesting: "" },
      { address: "0x4DE435E3D9568Fb722B1d2380139944002095d0D", amount: "18693", category: "MIGRATOR", vesting: "" },
      { address: "0x4CAf9F442B73E6a79aCa92D14ffc718bAcf8Dd76", amount: "21838", category: "MIGRATOR", vesting: "" },
      { address: "0x057C60911c792eC885CC7995ACC89A2e72241ead", amount: "22839", category: "MIGRATOR", vesting: "" },
      { address: "0x17Bd23Ac99FBAF71BBb9dc9a3ECa107976f41DE7", amount: "23054", category: "MIGRATOR", vesting: "" },
      { address: "0xb29C1f47A297117d1eD7015E5B5e4361811d1034", amount: "23945", category: "MIGRATOR", vesting: "" },
      { address: "0x2c695c985ba8b14daFA8CA22314eE0BBB4584d1b", amount: "56206", category: "MIGRATOR", vesting: "" },
      
      // Batch 4 (addresses 61-80)
      { address: "0xa770503f10fa22BEbbDe429c3d33bA3188ea5A09", amount: "63369", category: "MIGRATOR", vesting: "" },
      { address: "0xecDECE5B9438EC026d2b703315b8925c3d02B99b", amount: "68986", category: "MIGRATOR", vesting: "" },
      { address: "0xED44Fa29F61b9EAa07E6c15b7d8f852F6C5f0BC9", amount: "69324", category: "MIGRATOR", vesting: "" },
      { address: "0xB7cAD518F1064B1E1793426b42db4B5fef8C71D4", amount: "77071", category: "MIGRATOR", vesting: "" },
      { address: "0xeb868B5A081198de480f6d111BD7E210D1c876c4", amount: "83833", category: "MIGRATOR", vesting: "" },
      { address: "0xA08850963d4D481ae69343968803E96849E2C518", amount: "84150", category: "MIGRATOR", vesting: "" },
      { address: "0xE20C6f38C5eD654620956F33AF587AC1921a8825", amount: "85794", category: "MIGRATOR", vesting: "" },
      { address: "0x23f3ffFB9219C7A656F0779eD9DdCB1cE31b1756", amount: "89669", category: "MIGRATOR", vesting: "" },
      { address: "0x2c695c985ba8b14daFA8CA22314eE0BBB4584d1b", amount: "100000", category: "MIGRATOR", vesting: "" },
      { address: "0x3a6AE68A453CC1a24176Dd978E1133F82ada78df", amount: "100980", category: "MIGRATOR", vesting: "" },
      { address: "0x598A4F36a06C1CEf962770D093eA38f79A7387Ea", amount: "104540", category: "MIGRATOR", vesting: "" },
      { address: "0x271B0e87C422fbb45c7D989177dd20bD493D7177", amount: "104762", category: "MIGRATOR", vesting: "" },
      { address: "0xC22428Ea8E18fEc2D56Df2abe05D504B31944B41", amount: "121883", category: "MIGRATOR", vesting: "" },
      { address: "0xdEC78af1E8C3D28cf6ab3944d78541c16dD560bA", amount: "122583", category: "MIGRATOR", vesting: "" },
      { address: "0x05d91c89e041Bc5431D9A63F51e4D230881A2a09", amount: "128264", category: "MIGRATOR", vesting: "" },
      { address: "0xc8B2F3144f98bb9A14b31803EF38280B6800c295", amount: "132019", category: "MIGRATOR", vesting: "" },
      { address: "0x86d741d2511f009831e32D176996b5cb5565c3df", amount: "149249", category: "MIGRATOR", vesting: "" },
      { address: "0x4a5D85e0F95Fb18e5B1AfAd025a9096085e4a0F7", amount: "161155", category: "MIGRATOR", vesting: "" },
      { address: "0x569788DFA5122F5A463C1D777f4925E6BDc64c14", amount: "179045", category: "MIGRATOR", vesting: "" },
      { address: "0xe2F49d3BFBc4dE67c5C0D99Bb6d6Fc621F4b3f43", amount: "184665", category: "MIGRATOR", vesting: "" },

      // Batch 5 (addresses 81-100)
      { address: "0x708dA0C5Bd3C52a4Bac1b0dD340C15a8e378983c", amount: "202307", category: "MIGRATOR", vesting: "" },
      { address: "0x7B171CDA2F0d3625c589B68E727C335768037AD3", amount: "205412", category: "MIGRATOR", vesting: "" },
      { address: "0x4a37152995AF7577a5b7541A494A69E26E9C469a", amount: "207416", category: "MIGRATOR", vesting: "" },
      { address: "0x9092c62fb91366Ff80E8d20f3db3D88d7507D0fC", amount: "208987", category: "MIGRATOR", vesting: "" },
      { address: "0x8d1d2491F368D4D92e65932C13a9264Dd397c5b6", amount: "211370", category: "MIGRATOR", vesting: "" },
      { address: "0xcBc31a350323d747779Ac9B00051347982344e26", amount: "212451", category: "MIGRATOR", vesting: "" },
      { address: "0x666062D6A105996F729F90dA339E4Bb7a83bf823", amount: "216046", category: "MIGRATOR", vesting: "" },
      { address: "0x42A6D74C64bd9F6B59CeA492CC0AD90f306e1541", amount: "217009", category: "MIGRATOR", vesting: "" },
      { address: "0x60E7Cf972004F771E45666D4EeFDcCf28598cb14", amount: "222685", category: "MIGRATOR", vesting: "" },
      { address: "0x8684826ad73C461aabc2CE3c1fa7e524d5804a92", amount: "224000", category: "MIGRATOR", vesting: "" },
      { address: "0x840F5dc86D3511d7832A2D0f36c406593aEEE839", amount: "235984", category: "MIGRATOR", vesting: "" },
      { address: "0x0E0fB94223130e211F7d838fBF91D0A8F932d1aD", amount: "236207", category: "MIGRATOR", vesting: "" },
      { address: "0xC22428Ea8E18fEc2D56Df2abe05D504B31944B41", amount: "241381", category: "MIGRATOR", vesting: "" },
      { address: "0x623FE6d885593E2058677Dd7d8A2ECddf7cF12B9", amount: "252250", category: "MIGRATOR", vesting: "" },
      { address: "0xa06e19b2134A16c02EDe654E895E877a380Abb40", amount: "258954", category: "MIGRATOR", vesting: "" },
      { address: "0x3dc6C8bd88542942A9b249EaaDF4b8fe36E1EFbb", amount: "261500", category: "MIGRATOR", vesting: "" },
      { address: "0x5114D2dc2a3D2251A5f03D5e68F116a1c6230030", amount: "265965", category: "MIGRATOR", vesting: "" },
      { address: "0x36E626c5a155E46951700C9689F1FB6b38C8c858", amount: "303011", category: "MIGRATOR", vesting: "" },
      { address: "0x00bb6071B2883be5d211ad3642E93d33a13E696d", amount: "312601", category: "MIGRATOR", vesting: "" },
      { address: "0x0f4e53864b75FE1A8Fa11Cf8d8b12a11A59fce4F", amount: "313009", category: "MIGRATOR", vesting: "" },

      // Continue with more batches here...
      // Batch 6 (addresses 101-120) 
      { address: "0x7bC6CFd6950d6d54c2Cb8E2c7db74324207DDE0B", amount: "313107", category: "MIGRATOR", vesting: "" },
      { address: "0xAc4f65376cC7961552966421de46c4d61B42D286", amount: "319148", category: "MIGRATOR", vesting: "" },
      { address: "0x4C9CF73816852D91a61661ab3f0d733FBc9F715f", amount: "358571", category: "MIGRATOR", vesting: "" },
      { address: "0xCd9eC967c77F29b329aa70843d16416E594C3779", amount: "384431", category: "MIGRATOR", vesting: "" },
      { address: "0x97b2d3877591361Fa8C135925E402Ae3294A5545", amount: "393138", category: "MIGRATOR", vesting: "" },
      { address: "0xDda9fE4A11347c9d08a3842170C67dBE184edcF5", amount: "439650", category: "MIGRATOR", vesting: "" },
      { address: "0x8b489Fa6a97F219e4A7eb320831881C9bCDeD0aD", amount: "440352", category: "MIGRATOR", vesting: "" },
      { address: "0x0a73ad9452369A9f80e38EBF863e5E2Af758E8d2", amount: "444372", category: "MIGRATOR", vesting: "" },
      { address: "0x5A2d36A08bc964D3C605Bb8D82274FE66e2880eD", amount: "458519", category: "MIGRATOR", vesting: "" },
      { address: "0x5479C5dA7dD17AF950B3131F41AB36EFdFace0f1", amount: "465373", category: "MIGRATOR", vesting: "" },
      { address: "0x7A670a3ED9072Ec516e80c5F3b19dD8ef8F089e1", amount: "476505", category: "MIGRATOR", vesting: "" },
      { address: "0x4bB37CDA3D11ee93Da7A625B2A156f902Baa87A5", amount: "493113", category: "MIGRATOR", vesting: "" },
      { address: "0xf6fE1B39af77BCD629BA818D3Fc21cE73Eb6e806", amount: "504829", category: "MIGRATOR", vesting: "" },
      { address: "0xe5AFE4EcC2a793586148c829E6B1Dc56d5c36863", amount: "505560", category: "MIGRATOR", vesting: "" },
      { address: "0x366021d8c820a5dfBe06B7a1eDe1BCa0aEEf5221", amount: "513383", category: "MIGRATOR", vesting: "" },
      { address: "0xe5Dc84C79A004cDfD14c683A5a0aD932D3D06a11", amount: "539020", category: "MIGRATOR", vesting: "" },
      { address: "0x43bCCFa855Ac065831e7CcA3233BCcAf16C69174", amount: "550845", category: "MIGRATOR", vesting: "" },
      { address: "0x1735f1234308e4de01B889C3A29c24caEafC0981", amount: "564589", category: "MIGRATOR", vesting: "" },
      { address: "0x5da3896946d11759342d5fb88aeee3ecdd67e262", amount: "569637", category: "MIGRATOR", vesting: "" },
      { address: "0x5F5642b268463F2D19048E2741482a43814EaBBf", amount: "570695", category: "MIGRATOR", vesting: "" },

      // Batch 7 (addresses 121-140)
      { address: "0x69ec29F33e1cC45E49dd46073BaA5441c244A75a", amount: "570945", category: "MIGRATOR", vesting: "" },
      { address: "0xAda3a4178e11aDa64b794D66c8aa7b154412C760", amount: "607095", category: "MIGRATOR", vesting: "" },
      { address: "0xAf5Ad30cBF8DFEA37fF764538Ed638043E19e70B", amount: "609371", category: "MIGRATOR", vesting: "" },
      { address: "0x44e5Db1657a8a7F3D00F09124be153C7b68B1eca", amount: "621751", category: "MIGRATOR", vesting: "" },
      { address: "0x2E4F3AFFDDe131c29659c4A965Ab3c57BEfDA014", amount: "632971", category: "MIGRATOR", vesting: "" },
      { address: "0x82964C540b91bA7d444657840871deaeEd430E4e", amount: "636000", category: "MIGRATOR", vesting: "" },
      { address: "0xF6B1Eb7AfdEee8908026E405079e4A42Bf66f5fa", amount: "643514", category: "MIGRATOR", vesting: "" },
      { address: "0xE715F96d02803f7D0fa9f29b8D920a5Ad32c0570", amount: "652934", category: "MIGRATOR", vesting: "" },
      { address: "0x804E6da433283F5a7F8e9A756ccF2Efc2A237bf0", amount: "667318", category: "MIGRATOR", vesting: "" },
      { address: "0xb5501f41b6eb0a2f6b729d2ad7ffe1e10827d51a", amount: "672327", category: "MIGRATOR", vesting: "" },
      { address: "0xccA2F0e6CcAe30d14eD689c479a4F1d475aef391", amount: "672951", category: "MIGRATOR", vesting: "" },
      { address: "0x2d2D15710beef5B347F9f4e1DEF0d9D47673eA87", amount: "714807", category: "MIGRATOR", vesting: "" },
      { address: "0x3af6512c84afc38873df1e2a3b03295e85f2bc0f", amount: "720581", category: "MIGRATOR", vesting: "" },
      { address: "0x87BB53af4Ed83f9d2d1D9eD62dFA59C828e63Ac5", amount: "735207", category: "MIGRATOR", vesting: "" },
      { address: "0x87e50a5da148e36e5b242028b1042d6Aed717797", amount: "736444", category: "MIGRATOR", vesting: "" },
      { address: "0x5536D364B475De95aBE2a23779C90A331502b966", amount: "744929", category: "MIGRATOR", vesting: "" },
      { address: "0x29600c39418d56e909c3CE437a8678FfC9476748", amount: "747906", category: "MIGRATOR", vesting: "" },
      { address: "0xC895dF6A0D4A73EED68786Cb1d62b26719C4E694", amount: "756558", category: "MIGRATOR", vesting: "" },
      { address: "0x61fC3EDfF854deDc03C75928fADcF9d12314B245", amount: "769991", category: "MIGRATOR", vesting: "" },
      { address: "0x7080F618d2aEf09f42f32671ce24628675D03e9c", amount: "796662", category: "MIGRATOR", vesting: "" },

      // Add more batches here to include all remaining addresses
      // Complete the list with all remaining addresses up to 379
    ];
    
    // Filter out addresses that already have tokens
    const filteredDistribution = distribution.filter(item => 
      !existingAddresses.includes(item.address)
    );
    
    console.log(`Found ${filteredDistribution.length} addresses that still need tokens distributed.`);
    
    // Group wallets by category for reporting
    const categorySummary = {};
    for (const wallet of filteredDistribution) {
      if (!categorySummary[wallet.category]) {
        categorySummary[wallet.category] = {
          count: 0,
          amount: ethers.BigNumber.from(0)
        };
      }
      categorySummary[wallet.category].count++;
      categorySummary[wallet.category].amount = categorySummary[wallet.category].amount.add(toTokenAmount(wallet.amount));
    }
    
    // Get total tokens to distribute
    let totalTokensToDistribute = ethers.BigNumber.from(0);
    for (const wallet of filteredDistribution) {
      totalTokensToDistribute = totalTokensToDistribute.add(toTokenAmount(wallet.amount));
    }
    
    console.log(`Total tokens to distribute: ${ethers.utils.formatUnits(totalTokensToDistribute, 18)} TWG`);
    
    // Check if contract is owned by the deployer
    const owner = await token.owner();
    console.log(`Contract owner: ${owner}`);
    
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
      console.log(`⚠️ Warning: The deployer is not the contract owner. Distribution may fail.`);
      const proceedAnyway = await prompt("Continue anyway? (y/n): ");
      if (!proceedAnyway) {
        console.log("Distribution cancelled.");
        process.exit(0);
      }
    }
    
    // Check contract token balance
    const contractBalance = await token.balanceOf(contractAddress);
    console.log(`Contract token balance: ${ethers.utils.formatUnits(contractBalance, 18)} TWG`);
    
    if (contractBalance.lt(totalTokensToDistribute)) {
      console.log(`⚠️ Error: Contract does not have enough tokens for distribution.`);
      console.log(`Required: ${ethers.utils.formatUnits(totalTokensToDistribute, 18)} TWG`);
      console.log(`Available: ${ethers.utils.formatUnits(contractBalance, 18)} TWG`);
      console.log("Distribution cancelled.");
      process.exit(1);
    }
    
    // Print distribution summary by category
    console.log("\n===== DISTRIBUTION SUMMARY =====");
    for (const category in categorySummary) {
      const { count, amount } = categorySummary[category];
      const percentage = amount.mul(100).div(totalTokensToDistribute);
      console.log(`${category}: ${count} wallets, ${ethers.utils.formatUnits(amount, 18)} TWG (${percentage}%)`);
    }
    
    // Process in batches of 20 addresses
    const batchSize = 20;
    const batchCount = Math.ceil(filteredDistribution.length / batchSize);
    console.log(`\nDistribution will be processed in ${batchCount} batches of up to ${batchSize} addresses each`);
    
    // Ask if user wants to start from a specific batch
    const startBatchInput = await prompt(`Start from which batch? (1-${batchCount}, or press Enter for batch 1): `);
    const startBatchIndex = startBatchInput ? parseInt(startBatchInput) - 1 : 0;
    
    if (startBatchIndex < 0 || startBatchIndex >= batchCount) {
      console.log(`Invalid batch number. Must be between 1 and ${batchCount}.`);
      process.exit(1);
    }
    
    for (let batchIndex = startBatchIndex; batchIndex < batchCount; batchIndex++) {
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, filteredDistribution.length);
      const batch = filteredDistribution.slice(start, end);
      
      console.log(`\n----- Batch ${batchIndex + 1} of ${batchCount} -----`);
      console.log(`Contains ${batch.length} addresses`);
      
      const addresses = [];
      const amounts = [];
      let batchTotal = ethers.BigNumber.from(0);
      
      for (let i = 0; i < batch.length; i++) {
        const { address, amount, category, vesting } = batch[i];
        addresses.push(address);
        const tokenAmount = toTokenAmount(amount);
        amounts.push(tokenAmount);
        batchTotal = batchTotal.add(tokenAmount);
        
        console.log(`  - ${address}: ${amount} TWG (${category}${vesting ? ', ' + vesting : ''})`);
      }
      
      console.log(`  Batch total: ${ethers.utils.formatUnits(batchTotal, 18)} TWG`);
      
      // Ask for confirmation before sending the transaction
      const proceed = await prompt(`\nProceed with this batch distribution? (y/n): `);
      if (!proceed) {
        console.log("Batch skipped. Moving to next batch...");
        continue;
      }
      
      // Send the transaction
      console.log("Sending transaction...");
      try {
        const tx = await token.distributeTokens(addresses, amounts);
        console.log(`Transaction sent: ${tx.hash}`);
        console.log("Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
        console.log(`Gas used: ${receipt.gasUsed.toString()}`);
      } catch (error) {
        console.error(`Error sending transaction: ${error.message}`);
        const continueNextBatch = await prompt("Continue with the next batch? (y/n): ");
        if (!continueNextBatch) {
          throw error;
        }
      }
    }
    
    // Set up vesting for addresses that require it
    const vestingAddresses = filteredDistribution.filter(wallet => wallet.vesting && wallet.vesting.includes("VESTED"));
    if (vestingAddresses.length > 0) {
      console.log("\n===== SETTING UP VESTING SCHEDULES =====");
      console.log(`Found ${vestingAddresses.length} addresses requiring vesting`);
      
      for (const { address, amount, category, vesting } of vestingAddresses) {
        if (vesting.includes("3M")) {
          console.log(`\nSetting up 3-month vesting for ${address} (${category})`);
          const tokenAmount = toTokenAmount(amount);
          const vestingDuration = 90 * 24 * 60 * 60; // 90 days in seconds
          
          const proceed = await prompt("Proceed with vesting setup? (y/n): ");
          if (!proceed) {
            console.log("Vesting setup skipped. Moving to next address...");
            continue;
          }
          
          try {
            console.log("Sending vesting transaction...");
            const tx = await token.createVesting(address, tokenAmount, vestingDuration);
            console.log(`Transaction sent: ${tx.hash}`);
            console.log("Waiting for confirmation...");
            const receipt = await tx.wait();
            console.log(`Vesting confirmed in block ${receipt.blockNumber}`);
            console.log(`Gas used: ${receipt.gasUsed.toString()}`);
          } catch (error) {
            console.error(`Error setting up vesting for ${address}:`, error.message);
            const continueAnyway = await prompt("Continue with the next vesting setup? (y/n): ");
            if (!continueAnyway) {
              throw error;
            }
          }
        }
      }
    }
    
    console.log("\n===== DISTRIBUTION COMPLETE =====");
    console.log(`Successfully processed distribution of tokens`);
    
  } catch (error) {
    console.error("Error during distribution:", error);
  } finally {
    rl.close();
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Script execution failed:", error);
    process.exit(1);
  }); 