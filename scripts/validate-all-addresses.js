const { ethers } = require("hardhat");

function isValidEthereumAddress(address) {
  try {
    const formattedAddress = address.startsWith('0x') ? address : '0x' + address;
    // Check if it's a valid address
    ethers.utils.getAddress(formattedAddress);
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  console.log("======= VALIDATING ALL ADDRESSES =======");
  
  // Extract all addresses from the full distribution list
  const fs = require('fs');
  const path = require('path');
  
  const distributionScript = path.join(__dirname, 'distribute-tokens.js');
  
  try {
    // Read the script content
    const content = fs.readFileSync(distributionScript, 'utf8');
    
    // Extract addresses using regex
    const addressRegex = /address:\s*["']([^"']+)["']/g;
    const matches = [...content.matchAll(addressRegex)];
    
    const addresses = matches.map(match => match[1]);
    
    console.log(`Found ${addresses.length} addresses to validate\n`);
    
    let validCount = 0;
    let invalidCount = 0;
    const invalidAddresses = [];
    
    // Validate each address
    for (const address of addresses) {
      if (isValidEthereumAddress(address)) {
        validCount++;
      } else {
        invalidCount++;
        invalidAddresses.push(address);
        console.log(`❌ INVALID: ${address}`);
        
        // Provide details on what's wrong
        let formattedAddress = address;
        if (!formattedAddress.startsWith("0x")) {
          formattedAddress = "0x" + formattedAddress;
          console.log(`   Issue: Missing 0x prefix`);
        }
        
        if (formattedAddress.length !== 42) {
          console.log(`   Issue: Wrong length (${formattedAddress.length} chars, should be 42)`);
        }
        
        const invalidChars = formattedAddress.substring(2).match(/[^a-fA-F0-9]/g);
        if (invalidChars) {
          console.log(`   Issue: Contains invalid characters: ${[...new Set(invalidChars)].join(', ')}`);
        }
        
        console.log("");
      }
    }
    
    // Print summary
    console.log("\n======= VALIDATION SUMMARY =======");
    console.log(`Total addresses found: ${addresses.length}`);
    console.log(`Valid addresses: ${validCount}`);
    console.log(`Invalid addresses: ${invalidCount}`);
    
    if (invalidCount > 0) {
      console.log("\n⚠️ WARNING: Found invalid addresses that need to be fixed:");
      invalidAddresses.forEach(addr => console.log(`- ${addr}`));
      console.log("\nPlease correct these addresses before proceeding with distribution.");
    } else {
      console.log("\n✅ SUCCESS: All addresses are valid Ethereum addresses!");
      console.log("You can safely proceed with the token distribution.");
    }
    
  } catch (error) {
    console.error("Error reading distribution script:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Validation failed:", error);
    process.exit(1);
  }); 