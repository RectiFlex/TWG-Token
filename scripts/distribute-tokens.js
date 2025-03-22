const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("===== DISTRIBUTING TWG TOKENS TO REMAINING ADDRESSES =====");
    
    // Contract address for the deployed TWGToken
    const contractAddress = "0x6EB64894CFb6a7d00749781aD01975584822dD5F";
    
    // Get the signer (must be the contract owner)
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer address: ${deployer.address}`);
    
    // Get the contract instance
    const TWGToken = await ethers.getContractFactory("TWGToken");
    const token = await TWGToken.attach(contractAddress);
    
    // Verify ownership
    const owner = await token.owner();
    console.log(`Contract owner address: ${owner}`);
    
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
      console.error("The signer is not the contract owner. Cannot distribute tokens.");
      return;
    }

    console.log("\n=== CONTRACT INFORMATION ===");
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    const tradingEnabled = await token.tradingEnabled();
    
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
    console.log(`Total Supply: ${ethers.utils.formatUnits(totalSupply, decimals)} ${symbol}`);
    console.log(`Trading Enabled: ${tradingEnabled ? "Yes" : "No"}`);
    
    // Define the remaining addresses that need tokens (from the third batch with 0 balance)
    const addressesToDistribute = [
      { address: "0xeE6bD51Dc34EE2AEeDB8a40CB7498BAb0478A896", amount: "110044490", category: "TW22", vesting: "" },
      { address: "0x950A8decfF04d36e281422164DEbFb90c562d4e9", amount: "111566650", category: "TW23", vesting: "" },
      { address: "0x7cc71A40F45cfE8fE2beeb8331070118c3bCa792", amount: "97785410", category: "TW24", vesting: "" },
      { address: "0x59145A76F3366A787514FD45d0E02Ac57D72fD8d", amount: "66632520", category: "TW25", vesting: "" },
      { address: "0xefF15cFDA5a35eaF45756F6A68f9c97DEf76014f", amount: "76145220", category: "TW26", vesting: "" },
      { address: "0xC912F1Ce75DB8830e0cb1e4f4C2F1Aa214f61D1e", amount: "87120580", category: "TW27", vesting: "" },
      { address: "0x4aE31a58094d082D2c9a335100CEbA6f9F3f373a", amount: "93452030", category: "TW28", vesting: "" },
      { address: "0xe68c01f3F9BD19e7bDB6C2cE5978b267C4c600c5", amount: "112120580", category: "TW29", vesting: "" },
      { address: "0x2808f8D60e87eBEC6F98Ed8DFfe452Ad8874998b", amount: "98120356", category: "TW30", vesting: "" },
      { address: "0xCF17d55c6dd264052188AE80044BFE589425238b", amount: "110120250", category: "TW31", vesting: "" },
      { address: "0xb3439fEaB0b1955ecF85841cA28EA513Ef556884", amount: "115784520", category: "TW32", vesting: "" },
      { address: "0x8Fd0491bA7Ed00996b681C7b66ff066c5eF7E935", amount: "139302560", category: "TW33", vesting: "" },
      { address: "0xa3d33c7f150B569F99BE6a1F388E60e7D956c361", amount: "121154780", category: "TW34", vesting: "" },
      { address: "0x4Ad405de1c412709f473F24D2621A3743a9d946b", amount: "95784100", category: "TW35", vesting: "" },
      { address: "0xdFef689B53E00f97612bFE845e76E2244A367fa4", amount: "108123050", category: "TW36", vesting: "" },
      { address: "0x624FF9c56C0637fce21b2dC9fEdE05E6eDAe3B3d", amount: "122141120", category: "TW37", vesting: "" },
      { address: "0xF537E176753173C2223568A1922F1c63aaD33396", amount: "88412300", category: "TW38", vesting: "" },
      { address: "0x43D5A91f47786405FB1aD2e33F89040da0C75928", amount: "96784520", category: "TW39", vesting: "" },
      { address: "0xAffE2a4dE68217a660572f534cbD863E6D3bf378", amount: "133566320", category: "TW40", vesting: "" },
      { address: "0x98F1870045185ccb6F33fbE8C4a4ebf55798aa74", amount: "119884100", category: "TW41", vesting: "MARKET MAKER" },
      { address: "0xC14967a69C4bF3c97D4D3F71e837aB542f401288", amount: "76565600", category: "TW42", vesting: "MARKET MAKER" },
      { address: "0x9400DAbcbE3873560EEC16a8FDbf275354d9DE38", amount: "84656230", category: "TW43", vesting: "MARKET MAKER" },
      { address: "0x7b77eFbf95b54dbDFf06d2e0Dcba52555CF12594", amount: "92778854", category: "TW44", vesting: "MARKET MAKER" },
      { address: "0xbc12715Ef5Ec2889EFa4aa080fDb6A0d2e90698B", amount: "84789520", category: "TW45", vesting: "MARKET MAKER" },
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
      { address: "0x6B6b3973A3db6984b3fa58813584B54FAc2A56F7", amount: "825002", category: "MIGRATOR", vesting: "" },
      { address: "0x1F9Bc1df118237486EFD15aF8D5A46a5D0Aab904", amount: "828962", category: "MIGRATOR", vesting: "" },
      { address: "0xe901322764AA4b68e13463F923f56845b6cE3d61", amount: "854755", category: "MIGRATOR", vesting: "" },
      { address: "0x0D5eA655DE0b852fE7c72Fb284c9f66637Cc7eF4", amount: "904624", category: "MIGRATOR", vesting: "" },
      { address: "0x2EA82fc168bC4336dc23ed3b8E228DE00bfEeA87", amount: "918338", category: "MIGRATOR", vesting: "" },
      { address: "0x170b6468c07215904216d8BF3cdC8d3c2ed26357", amount: "919051", category: "MIGRATOR", vesting: "" },
      { address: "0x07bfEe41eACA490275a50dfC1524E99444cBC5A9", amount: "921195", category: "MIGRATOR", vesting: "" },
      { address: "0xDdA637803666e67F9d593B47Aa1dE3f04FbeBa93", amount: "928212", category: "MIGRATOR", vesting: "" },
      { address: "0x70d7301C1b02c8B5288cC9A5382A10E4986A0eac", amount: "945552", category: "MIGRATOR", vesting: "" },
      { address: "0xBEa5640cA9057059a98352bDa418E0fEaAE4670e", amount: "947207", category: "MIGRATOR", vesting: "" },
      { address: "0x65f7e5FBCc4153880e567866a95ca73f99Ef886c", amount: "948326", category: "MIGRATOR", vesting: "" },
      { address: "0x947Ed3cab08688CBcACd9932cFF8238E4Ae2d28C", amount: "959689", category: "MIGRATOR", vesting: "" },
      { address: "0x4B8a51363e8810a857047FdFD0ED622b03CbE3a1", amount: "964429", category: "MIGRATOR", vesting: "" },
      { address: "0x6330AaeBEbB21A5C39e674Bf3c609070bEa963a9", amount: "979667", category: "MIGRATOR", vesting: "" },
      { address: "0x73565D7F6C17716c0BB295e72bfed8CAc26884F0", amount: "1001068", category: "MIGRATOR", vesting: "" },
      { address: "0xB73fe9c49D6e2e879482BF04f1671b845F074305", amount: "1001984", category: "MIGRATOR", vesting: "" },
      { address: "0x82331d4083dBc2167521a46cc8bF6771e0C9EbF5", amount: "1005071", category: "MIGRATOR", vesting: "" },
      { address: "0xD1CBFe78B80E57d35c84CFE2b3Df5f7c657eb016", amount: "1017371", category: "MIGRATOR", vesting: "" },
      { address: "0xD915Bb1Af1d803fD9C2494BFd81EaA693910c65E", amount: "1017600", category: "MIGRATOR", vesting: "" },
      { address: "0x7A735d95110C5d41F7cDb3B7Ce6E465a8aA316b4", amount: "1018719", category: "MIGRATOR", vesting: "" },
      { address: "0xf11017f17Bbe3Fc37D980EB744b81A75361E1Deb", amount: "1019185", category: "MIGRATOR", vesting: "" },
      { address: "0xA0960218A967D6875467eEdb72043d5a8B8AA506", amount: "1040923", category: "MIGRATOR", vesting: "" },
      { address: "0x7e3f4225C2A0BDB1d25EEf441C11AB43398C670F", amount: "1071746", category: "MIGRATOR", vesting: "" },
      { address: "0x3A1aF47696E666536E9C3F72863A21CB76019126", amount: "1075875", category: "MIGRATOR", vesting: "" },
      { address: "0xE0a41F08Bb9be6d0D44189666aa6A13E001967Aa", amount: "1100938", category: "MIGRATOR", vesting: "" },
      { address: "0xad00f4e66E81b52B4518521A07f526a85e47D705", amount: "1106363", category: "MIGRATOR", vesting: "" },
      { address: "0x78dCC1DF811DDc6e969b77797f0eAd397277E0d1", amount: "1114864", category: "MIGRATOR", vesting: "" },
      { address: "0x44179bBcf698C55B04ED51591b8DF338a91F578e", amount: "1122766", category: "MIGRATOR", vesting: "" },
      { address: "0x5878Bf6587BE42EE73839A1f9394C9Db0441bd33", amount: "1128186", category: "MIGRATOR", vesting: "" },
      { address: "0x802a2c53212dc44be857198bfc8ca58954f332a1", amount: "1140783", category: "MIGRATOR", vesting: "" },
      { address: "0xF62eF9AfED3f7d9c932a307d8f03C38e69295D91", amount: "1175475", category: "MIGRATOR", vesting: "" },
      { address: "0x1A61082d93E3c2F150a9f05fF34B3C4B59034a68", amount: "1203534", category: "MIGRATOR", vesting: "" },
      { address: "0x1633f693684C96b6115Ea7a708abac3443a78097", amount: "1205292", category: "MIGRATOR", vesting: "" },
      { address: "0x52F0f4D8063DfD6318AD8227Ff978E8f2c891A9A", amount: "1227410", category: "MIGRATOR", vesting: "" },
      { address: "0x49d4A9da67cC28B8d93f0C15CE15A318adbDfd68", amount: "1236247", category: "MIGRATOR", vesting: "" },
      { address: "0xB37225007B45bBA7970eF11DDa5e966616877b6f", amount: "1270500", category: "MIGRATOR", vesting: "" },
      { address: "0xFC27F17DabC03851548c2e897b7a9550da813d41", amount: "1286165", category: "MIGRATOR", vesting: "" },
      { address: "0x461720eD77062aa1ab28E86Bb18100a36A92530c", amount: "1299128", category: "MIGRATOR", vesting: "" },
      { address: "0xE03512eb4e1dD6067E23C66AD6Ad036CDB7DB39c", amount: "1315130", category: "MIGRATOR", vesting: "" },
      { address: "0x5097A8814Caf6f7bA2Cf2f17Be45d14837e9Ccd3", amount: "1315395", category: "MIGRATOR", vesting: "" },
      { address: "0x2c81BBc39C30fdC5a9342A871130e0748dd0d90f", amount: "1358641", category: "MIGRATOR", vesting: "" },
      { address: "0xBA31a4cA7d5C5aA53092B530E5e12AeBD29Ecc8c", amount: "1362366", category: "MIGRATOR", vesting: "" },
      { address: "0x82cBb8a4666E65c44cEdF99C3A02Fb5b865fEdd0", amount: "1383567", category: "MIGRATOR", vesting: "" },
      { address: "0xaC923a7c5BDA08607f3AcA793D3F1A77014A4673", amount: "1427356", category: "MIGRATOR", vesting: "" },
      { address: "0xAab4AFDE346ee1D14785A001086b044885F6B33d", amount: "1476810", category: "MIGRATOR", vesting: "" },
      { address: "0xbCabc5Ccd874a3084ef064ea313bdb2b8984c62C", amount: "1517978", category: "MIGRATOR", vesting: "" },
      { address: "0x4fCd2C858F5939C8916231571F6f37e734B0B8da", amount: "1557730", category: "MIGRATOR", vesting: "" },
      { address: "0x6751f9e09805c58e3b7fad96380dc266c70af39a", amount: "1570018", category: "MIGRATOR", vesting: "" },
      { address: "0xC83F5b75CCaca9323db82305998D46De7A95de25", amount: "1596822", category: "MIGRATOR", vesting: "" },
      { address: "0x5e85Fe7117B6A91184b469aCBB8143f367E087Fd", amount: "1617621", category: "MIGRATOR", vesting: "" },
      { address: "0xDDC434801Fdd5219DD51E21aE7f3fFDC6C0b3e96", amount: "1641462", category: "MIGRATOR", vesting: "" },
      { address: "0xAc6a85d856ad67f12E5B4c8e3C7B073CE1b9250f", amount: "1654554", category: "MIGRATOR", vesting: "" },
      { address: "0x3A90c9337946C1b349c23f55Dd5D99C0aeC6d055", amount: "1810090", category: "MIGRATOR", vesting: "" },
      { address: "0x93f89a4b4DA5Af814e6D83C47022F54d435F7c02", amount: "1845286", category: "MIGRATOR", vesting: "" },
      { address: "0x75a5D641E376D235451A0e8e0AD364b33F454602", amount: "1849386", category: "MIGRATOR", vesting: "" },
      { address: "0x802aE70f1d506dE4a489E1301d4364d5f2d9d7aD", amount: "1916698", category: "MIGRATOR", vesting: "" },
      { address: "0x962D809d1Bd1bB56Fe25782935dd43dF33a49040", amount: "1953529", category: "MIGRATOR", vesting: "" },
      { address: "0x0b1443606297E443753D99510E70EA67C9380115", amount: "2018779", category: "MIGRATOR", vesting: "" },
      { address: "0xF404e0b022Ccf97a2e0d6B7830bf0F1574a6d794", amount: "2022671", category: "MIGRATOR", vesting: "" },
      { address: "0xC8121F4EEDa00D92D78aCA0A8Ed6b5c5908Ba3d9", amount: "2048246", category: "MIGRATOR", vesting: "" },
      { address: "0xd4399B983bf5d0BC2b3d51fc3d0eA4F17A9f52c0", amount: "2056815", category: "MIGRATOR", vesting: "" },
      { address: "0xe5359E84b8ED882d1e0A7a7963972730B8C240f0", amount: "2063002", category: "MIGRATOR", vesting: "" },
      { address: "0x8b976686B75Fa44CEeEF8fA2a29e2647c437D9d4", amount: "2093280", category: "MIGRATOR", vesting: "" },
      { address: "0x64814e184c409da30913E428b7D4Ff5C8074e267", amount: "2123934", category: "MIGRATOR", vesting: "" },
      { address: "0x0A38d4EB4B2190F28bD724398fDCF8ee87d90c89", amount: "2223607", category: "MIGRATOR", vesting: "" },
      { address: "0x16e65B4C70a006d0036B9987c3DDC1B3cdfc0E63", amount: "2268758", category: "MIGRATOR", vesting: "" },
      { address: "0x6e3C8983e2212e58F9d3847fA7587020b72bF671", amount: "2287264", category: "MIGRATOR", vesting: "" },
      { address: "0x383B2Fa3E8766903f8ffe45E3a176239091f4576", amount: "2328073", category: "MIGRATOR", vesting: "" },
      { address: "0x54B829B5Dde3bB1cf8Db4F0335B58D44b9F00408", amount: "2370280", category: "MIGRATOR", vesting: "" },
      { address: "0x1c606ac8c40ABBF6Ca3ffB17eB080e7a2F820970", amount: "2414278", category: "MIGRATOR", vesting: "" },
      { address: "0x343f2c8be29ba7fc33b537b7bf85dca440df1262", amount: "2451416", category: "MIGRATOR", vesting: "" },
      { address: "0x97290F87A50253A168C0622e6fA7cE7ae4c80A08", amount: "2456584", category: "MIGRATOR", vesting: "" },
      { address: "0x879Fb6764493571F91A4d1CD8E7E9a617bD8E661", amount: "2470133", category: "MIGRATOR", vesting: "" },
      { address: "0x3cEe595da2a60f0620F11c8bAdE9d188143cf381", amount: "2507228", category: "MIGRATOR", vesting: "" },
      { address: "0x8CFA7B20874D174b83Ce8Fbb1e32b13E5a465446", amount: "2552188", category: "MIGRATOR", vesting: "" },
      { address: "0x57d3Ce42722dA98523861E3414734eea9979c5be", amount: "2610928", category: "MIGRATOR", vesting: "" },
      { address: "0xf7910D16Aa994Ca8bdf56dc75B859A9D99dE1592", amount: "2630862", category: "MIGRATOR", vesting: "" },
      { address: "0xFD9f8d9879B82fff3d0Ed30Ca31f36d59Dafdd38", amount: "2806852", category: "MIGRATOR", vesting: "" },
      { address: "0x11A3Fd1D241A3436a9AAf962A85Be12d75f0ecC4", amount: "2864432", category: "MIGRATOR", vesting: "" },
      { address: "0x4e451FcFDe65640811153D042609497F60ada64A", amount: "2876803", category: "MIGRATOR", vesting: "" },
      { address: "0x5490430262d17330f596601d25965C192cef9c3E", amount: "2901863", category: "MIGRATOR", vesting: "" },
      { address: "0x2E0FaC4d3dE08CB97994b05110920a5944D7fe4A", amount: "2946231", category: "MIGRATOR", vesting: "" },
      { address: "0xc2C8658E1024F7d58741d81E7524ec969e30a5a8", amount: "3004659", category: "MIGRATOR", vesting: "" },
      { address: "0xeE4f05c9d4F723b36246727FA7e2Ee1A18474454", amount: "3012831", category: "MIGRATOR", vesting: "" },
      { address: "0x6338F57e6746867C021e01af0D6F2160471E6Ef7", amount: "3014556", category: "MIGRATOR", vesting: "" },
      { address: "0x640020f191B4117c212b54a13A8A3DA893e0167A", amount: "3022839", category: "MIGRATOR", vesting: "" },
      { address: "0x6Af5B2163F7Fb88Bb809A471a02908152cb50A95", amount: "3039007", category: "MIGRATOR", vesting: "" },
      { address: "0x76690c235ed66c3011cfb8eb63c5f0f5794980a2", amount: "3065415", category: "MIGRATOR", vesting: "" },
      { address: "0x82a10420f936BBf7657C9Cb78672cc44Ef42f9f2", amount: "3109603", category: "MIGRATOR", vesting: "" },
      { address: "0xc1Bf038E939c2c87a4aDE13667E8e10776Ddb524", amount: "3125906", category: "MIGRATOR", vesting: "" },
      { address: "0xE1c1B24f9dA16D6315d0df9712C1E20D232b3fE0", amount: "3197206", category: "MIGRATOR", vesting: "" },
      { address: "0xF5C8Ef9E28E6fa30386f86D3D825D2292e742797", amount: "3330821", category: "MIGRATOR", vesting: "" },
      { address: "0x9eE47817b648A5C3B6F4dfb3702290b23C32d04d", amount: "3363803", category: "MIGRATOR", vesting: "" },
      { address: "0xF4fc8486d32791df75aa5262b2B0115b8021628c", amount: "3400000", category: "MIGRATOR", vesting: "" },
      { address: "0x1718Eb5F55413bC20E895B85782e6EE5504d3DcD", amount: "3456449", category: "MIGRATOR", vesting: "" },
      { address: "0x6d6e147481b6f82fa70b6eba0ab3decb2c695358", amount: "3472781", category: "MIGRATOR", vesting: "" },
      { address: "0x1D6fF6B31DaBA8C383A5bD9A121087fce7E70465", amount: "3640547", category: "MIGRATOR", vesting: "" },
      { address: "0xbDa03E534248b8c4E1EC5583d251430AAab1663C", amount: "3693857", category: "MIGRATOR", vesting: "" },
      { address: "0x5B0d1c9aa3697FD9d75De17D9540e6c73d799A60", amount: "3707881", category: "MIGRATOR", vesting: "" },
      { address: "0x70465f840Cfd8E39A601Ce1C2034143844914dBA", amount: "3892649", category: "MIGRATOR", vesting: "" },
      { address: "0xbaCA4E5621e62f89F64543Fe25c02a67d4C38c8b", amount: "3893903", category: "MIGRATOR", vesting: "" },
      { address: "0x6431594B07BB5A4d6835d5A2fF29748a7f4cf4CF", amount: "3952246", category: "MIGRATOR", vesting: "" },
      { address: "0xb446F46e73A39A8EfBca7442b31725598B3Ca858", amount: "4037740", category: "MIGRATOR", vesting: "" },
      { address: "0xB430082434208fb6E11D9FeA5461b423244BD522", amount: "4120000", category: "MIGRATOR", vesting: "" },
      { address: "0x506A50ec49Ed0891dFf56170cfFB27Dd458AA142", amount: "4367223", category: "MIGRATOR", vesting: "" },
      { address: "0x78A6053acC40F046501123f8720D53141D663eb4", amount: "4501296", category: "MIGRATOR", vesting: "" },
      { address: "0x10bf31E589CED13D45174B44c8dd57c2980F950D", amount: "4517609", category: "MIGRATOR", vesting: "" },
      { address: "0xa064E5E1Aba695857f391d7A0043B050EE14fD57", amount: "4647744", category: "MIGRATOR", vesting: "" },
      { address: "0xD349a4461cd4cCa46C192Ae5C5f1c2a129B15Bd8", amount: "4738436", category: "MIGRATOR", vesting: "" },
      { address: "0x70b3f232F47068fdaCc7f9EE0e3438f789F54c24", amount: "5020298", category: "MIGRATOR", vesting: "" },
      { address: "0xacB05a5dE600701B361f5f4A80dB594FA75Fac48", amount: "5029635", category: "MIGRATOR", vesting: "" },
      { address: "0x096C1Ca1441C91b023187D28BBd6F37eCBd1Ea0B", amount: "5065613", category: "MIGRATOR", vesting: "" },
      { address: "0xc7086fC878426fA7C0f3fb53694C1ABC67e56F70", amount: "5326018", category: "MIGRATOR", vesting: "" },
      { address: "0xE46e7e8464e68521BE3672050426A2a1A5884d39", amount: "5474889", category: "MIGRATOR", vesting: "" },
      { address: "0x64253aB81D8F1f72eC7Ff2A3E01E8D465A90A49D", amount: "5629429", category: "MIGRATOR", vesting: "" },
      { address: "0x5471d7f1113509449919cab2aeef47ff64520a5d", amount: "5819499", category: "MIGRATOR", vesting: "" },
      { address: "0xDd4603947c3673454DacCDc040607E871E688D31", amount: "5855793", category: "MIGRATOR", vesting: "" },
      { address: "0x02C00d843b949E6A9Ab3f36575065caD37E70218", amount: "6294592", category: "MIGRATOR", vesting: "" },
      { address: "0x31690654c53a80485bcd4e6d7453e849332e0847", amount: "6456081", category: "MIGRATOR", vesting: "" },
      { address: "0x3c138d3AeeBa4884FCA79B61059B700E8B2d4087", amount: "6487127", category: "MIGRATOR", vesting: "" },
      { address: "0x0d027F468A9793139BE15Bd1c30651570CEf59dA", amount: "6566531", category: "MIGRATOR", vesting: "" },
      { address: "0x9037D84868307Ff7269c797c021693c28cD3645b", amount: "6690875", category: "MIGRATOR", vesting: "" },
      { address: "0x8617578b8f4cbd28c74eb7c1c2c7468ecc3a9047", amount: "7033091", category: "MIGRATOR", vesting: "" },
      { address: "0xCD45d5011Cd7eC1C8dE9103A7A9765242722897f", amount: "7194381", category: "MIGRATOR", vesting: "" },
      { address: "0x62AfE4820bF5f3A30cFBFf316F0A8dDAC5a5c0E8", amount: "7510961", category: "MIGRATOR", vesting: "" },
      { address: "0xDC4A9AaCf71eee9972a4975c88545b73227de59B", amount: "7589058", category: "MIGRATOR", vesting: "" },
      { address: "0x8CD61448fAa126d9022421aeFb256b3167f1842E", amount: "7605396", category: "MIGRATOR", vesting: "" },
      { address: "0xafb1ea38072408F7f836df9f16bC4C5323715D25", amount: "7623685", category: "MIGRATOR", vesting: "" },
      { address: "0x30A79702327903FAE653A6F6057a82C54D787088", amount: "7674797", category: "MIGRATOR", vesting: "" },
      { address: "0xbb84e99eab6a98fb12348cc6862aebaee77e8db5", amount: "7777529", category: "MIGRATOR", vesting: "" },
      { address: "0x5435ef66ea729ea6fe13f725b25721a1dbfbdf37", amount: "8100000", category: "MIGRATOR", vesting: "" },
      { address: "0xE6F14c4B87b2b409E905870a100c5723f00A7713", amount: "8148548", category: "MIGRATOR", vesting: "" },
      { address: "0xe8b280ff93087b1f6358ebb813ae7a219a7a4782", amount: "8305377", category: "MIGRATOR", vesting: "" },
      { address: "0xD6Ad70f2599135E26aC4Affe0e6c861425DA858f", amount: "8505236", category: "MIGRATOR", vesting: "" },
      { address: "0x81cceBcd6D4E0B5fEd87027907A809cbb18E39Cd", amount: "8604633", category: "MIGRATOR", vesting: "" },
      { address: "0x00c808b4dB1fb25c7BBD248AF9D6CD9241D91149", amount: "8748206", category: "MIGRATOR", vesting: "" },
      { address: "0x69f5E98733c7DF0079e38b6693d1fFaC63b9E0d9", amount: "8792805", category: "MIGRATOR", vesting: "" },
      { address: "0x0167D85a1eC9B914cDc3bCb3Bdf5c51340E21C99", amount: "8912842", category: "MIGRATOR", vesting: "" },
      { address: "0x88bba5Dc031F612269c019A40a54Ef0053841316", amount: "8963861", category: "MIGRATOR", vesting: "" },
      { address: "0x4B858696A26046339bEF04778D8C6B17BeAA0d56", amount: "9211590", category: "MIGRATOR", vesting: "" },
      { address: "0xF6f686C7CE9E90E4c107a0578c879bbDc783C77b", amount: "9216210", category: "MIGRATOR", vesting: "" },
      { address: "0x7AB825a21Ae6640E6B3F23BEFa8d063fe2F6A040", amount: "9265674", category: "MIGRATOR", vesting: "" },
      { address: "0x14CD3A397Bebbc73d25E65EB49B8A8Cf1a221f50", amount: "9933132", category: "MIGRATOR", vesting: "" },
      { address: "0x0821292b41BA446Aba42842cAc70EeF804eA6927", amount: "10000000", category: "MIGRATOR", vesting: "" },
      { address: "0x1075E7D7EBaB3e6958f4d3a008F8e5A6b71B3b35", amount: "10000416", category: "MIGRATOR", vesting: "" },
      { address: "0x7eD2500c2A4BC0AFB07917fB3e42ffF4c2fDD2fd", amount: "10022606", category: "MIGRATOR", vesting: "" },
      { address: "0xdc49DfB9ad5bB4DFF8dadDe60566051F0f96E36a", amount: "10206343", category: "MIGRATOR", vesting: "" },
      { address: "0x942eC4Be7f7d2674A0f16299c326Ad21Ba88E6B4", amount: "10289164", category: "MIGRATOR", vesting: "" },
      { address: "0x7adc5d6c78b8165ecb893d7d9f19c6d7fe7c17b2", amount: "10355042", category: "MIGRATOR", vesting: "" },
      { address: "0xdF06D74079524f211FA110413A78aF4f7eb8d785", amount: "10756458", category: "MIGRATOR", vesting: "" },
      { address: "0x908F973f9D0ca5151284D1AE9aeBDe95EFc74aF2", amount: "10854178", category: "MIGRATOR", vesting: "" },
      { address: "0xF97AAE49Fe2d07dD3DD5fb4029A4C2f0A6ddddf6", amount: "10947194", category: "MIGRATOR", vesting: "" },
      { address: "0xCb6f4A0E81D77CE74C2dc9f64e1EEb4b7DC3B2D5", amount: "11228290", category: "MIGRATOR", vesting: "" },
      { address: "0xec2BCc95D82cdA33000aFb21eC4649aB63C102B1", amount: "11253003", category: "MIGRATOR", vesting: "" },
      { address: "0x21F3286defB4D12d9b244141020311060fC7F55D", amount: "11302566", category: "MIGRATOR", vesting: "" },
      { address: "0xDe47DdA141626214a30877601101f1cf532B56D0", amount: "11368099", category: "MIGRATOR", vesting: "" },
      { address: "0x1F7934d9E5FD73BbcE6dddC91706589848E59d2c", amount: "11504513", category: "MIGRATOR", vesting: "" },
      { address: "0x7A94fC98733b71656C90F20D9977883e8F47Fcf2", amount: "11882534", category: "MIGRATOR", vesting: "" },
      { address: "0x9092c62fb91366Ff80E8d20f3db3D88d7507D0fC", amount: "11988507", category: "MIGRATOR", vesting: "" },
      { address: "0x9e77afd1434b8d4bfadba23fba8dbbe1909aab70", amount: "12281323", category: "MIGRATOR", vesting: "" },
      { address: "0xfeEC41f46E582211cb160e3443A2aaa8b4Fcae9f", amount: "12371233", category: "MIGRATOR", vesting: "" },
      { address: "0x2Bd84dd59aE97Dfe0c5D2740Cd56Da0f5C69058d", amount: "12862049", category: "MIGRATOR", vesting: "" },
      { address: "0x1081749de9bcb8a78a5c5b1e980f83d855205526", amount: "12979088", category: "MIGRATOR", vesting: "" },
      { address: "0x8BBdA6C6A870B284c865bf2e29c30d8aBf227B2c", amount: "13289773", category: "MIGRATOR", vesting: "" },
      { address: "0xe8020BB78e7bad897CB5b8389086aA783fa66CD5", amount: "13361386", category: "MIGRATOR", vesting: "" },
      { address: "0xD719852756F9C0Ec15c28d8d4e9D55d796D0Fc8b", amount: "13683699", category: "MIGRATOR", vesting: "" },
      { address: "0x74f897C7119f04e966e053c8896B9FcA7Af50aFa", amount: "14654923", category: "MIGRATOR", vesting: "" },
      { address: "0x10d1e1219f8710f78FdeC78b128a87E8f67215D4", amount: "14673865", category: "MIGRATOR", vesting: "" },
      { address: "0x34f74661afE3Cc1b881a12Fe8a7325070D6AF6A3", amount: "14858213", category: "MIGRATOR", vesting: "" },
      { address: "0xf51663Cac0D36103eaa256007Bb2138CAb2442BA", amount: "14965601", category: "MIGRATOR", vesting: "" },
      { address: "0x530eBFF7cEECFFe86721eF7b3f61374354853E5c", amount: "15000000", category: "MIGRATOR", vesting: "" },
      { address: "0xa6F4A934635796607041537d789fC2d58D7168C4", amount: "15036593", category: "MIGRATOR", vesting: "" },
      { address: "0x091987fD541Fa7a86F612eDfc98De17Dba64C499", amount: "15370168", category: "MIGRATOR", vesting: "" },
      { address: "0x4C84b53bcba2FA4C039CF4F4E2bd6B3DD4Aa3c19", amount: "15449976", category: "MIGRATOR", vesting: "" },
      { address: "0xb7Aa57B5655b2a4533151831a361C8a057e40e0c", amount: "15648018", category: "MIGRATOR", vesting: "" },
      { address: "0xA7A4E274eF8db025c7adaE968dA26f1bA33F04e2", amount: "16048161", category: "MIGRATOR", vesting: "" },
      { address: "0x9301B10E9E40C43EBC300E00E56A02d1a343Fe0a", amount: "17046252", category: "MIGRATOR", vesting: "" },
      { address: "0xf5b33137efE74c830AAF82fd6fe648Fd42724E36", amount: "17391964", category: "MIGRATOR", vesting: "" },
      { address: "0x985a71754b53039B7398a45982f7055702D0b6b1", amount: "18297811", category: "MIGRATOR", vesting: "" },
      { address: "0x41eDD4bccAE38bBfFEB7BA98F5718F156893e0B1", amount: "18304827", category: "MIGRATOR", vesting: "" },
      { address: "0x583530A73F65309EDd9D3659a76302cac8458cE4", amount: "18704495", category: "MIGRATOR", vesting: "" },
      { address: "0x638c6Ba18d6AE2EF377b35D3d6f15143935b52E7", amount: "20000000", category: "MIGRATOR", vesting: "" },
      { address: "0x19d309d456C08Df61Ae0A4fa9E404eaB12Aa72Dc", amount: "20000001", category: "MIGRATOR", vesting: "" },
      { address: "0xa6272cd2b75c6391a407830562bd642db72fc264", amount: "20130332", category: "MIGRATOR", vesting: "" },
      { address: "0xd339dbfc17ac5cae312ca51189989d6b7341af67", amount: "20190748", category: "MIGRATOR", vesting: "" },
      { address: "0x5a82b565ad183a132c40d49c8cd44c6489ac16f6", amount: "20513385", category: "MIGRATOR", vesting: "" },
      { address: "0xf145aa49e379ef602764bdcc58c0dfae41e0a35d", amount: "21251907", category: "MIGRATOR", vesting: "" },
      { address: "0x7d24eA464cd0E1059A283B2D0529772AA25caF78", amount: "22299778", category: "MIGRATOR", vesting: "" },
      { address: "0xDAeF902F3b9e9AF7BE8c8fe8721365618b3D1BE9", amount: "24302946", category: "MIGRATOR", vesting: "" },
      { address: "0xe50AFD71667d874Eba67321F00d115936A605E4D", amount: "25000000", category: "MIGRATOR", vesting: "" },
      { address: "0x4f7d2d728ce137dd01ec63ef7b225805c7b54575", amount: "25035829", category: "MIGRATOR", vesting: "" },
      { address: "0x057C60911c792eC885CC7995ACC89A2e72241ead", amount: "25944979", category: "MIGRATOR", vesting: "" },
      { address: "0xaC4972Aa691cBb9744b9761c38D95C13e24FFA0a", amount: "28149767", category: "MIGRATOR", vesting: "" },
      { address: "0x548F18D970B25161dc2f90cEe566a6c92860eaaC", amount: "28917028", category: "MIGRATOR", vesting: "" },
      { address: "0xdce62d8db57c8a892C44e1f400F863286a5327b3", amount: "29315769", category: "MIGRATOR", vesting: "" },
      { address: "0x18D5808Da99976b17C2C24E451F8060B3e9D58f6", amount: "30047044", category: "MIGRATOR", vesting: "" },
      { address: "0x9d320CFAD710a7a210B74147508b6056aF8Bb376", amount: "30935495", category: "MIGRATOR", vesting: "" },
      { address: "0x7c03b7952a74f17fE314A71DE88b0AD4f342545A", amount: "31550202", category: "MIGRATOR", vesting: "" },
      { address: "0xfc1584b3D917b0487088d825CdB9f9297bA7225F", amount: "31637174", category: "MIGRATOR", vesting: "" },
      { address: "0x3206f1183928AA7e430bF16371E61d3f2Bd41867", amount: "32992636", category: "MIGRATOR", vesting: "" },
      { address: "0x30910db357A003a3cD819268e04254d0B28E8c8C", amount: "33000000", category: "MIGRATOR", vesting: "" },
      { address: "0x876DE0cbf8455B17470795328C460523fA4Fb433", amount: "33275811", category: "MIGRATOR", vesting: "" },
      { address: "0x724dF8453ff95294307E244A8574b4eC1c24B1F9", amount: "34118540", category: "MIGRATOR", vesting: "" },
      { address: "0xedd88795C0B397B2181E6422caE7B5EDC47DDC05", amount: "34164267", category: "MIGRATOR", vesting: "" },
      { address: "0x7bf11326A34D3D684ef0590aF0e73d7FdF4838B0", amount: "37329258", category: "MIGRATOR", vesting: "" },
      { address: "0xddA793394E97A705a61Ae6AdC037F0747e303e6c", amount: "39834395", category: "MIGRATOR", vesting: "" },
      { address: "0x33C929F45dC5060233540031ca909E2E5DEDa767", amount: "40225449", category: "MIGRATOR", vesting: "" },
      { address: "0x485B6E03Aa364079Fc10D9A160bEF77AC44DFFE0", amount: "41369856", category: "MIGRATOR", vesting: "" },
      { address: "0x3225830A48b52d63603Fc982CBBae37eF108A6E5", amount: "41676791", category: "MIGRATOR", vesting: "" },
      { address: "0x83Fc7240762B72b8E93f2BC40E6F6759fC33b5A3", amount: "42996795", category: "MIGRATOR", vesting: "" },
      { address: "0x8B18e88C6E29Bf559AFD49Aafb46E3a4f8F4d3b9", amount: "45631632", category: "MIGRATOR", vesting: "" },
      { address: "0xC57d01Dbc35603aEca2AEBf2F98558A6135c2F2C", amount: "45813254", category: "MIGRATOR", vesting: "" },
      { address: "0xa537fcC81594356E9b2AF4817a7e797a63cd9a58", amount: "46560316", category: "MIGRATOR", vesting: "" },
      { address: "0x77e1074F84668D5b3a53D0eC15F8a373A5eEC57e", amount: "48357300", category: "MIGRATOR", vesting: "" },
      { address: "0x910face1085b1621fEd0E491c4a485A79eE22002", amount: "50000000", category: "MIGRATOR", vesting: "" },
      { address: "0x1ef7F274D0492A4E0f5A595F25ae91B2a1562769", amount: "50436924", category: "MIGRATOR", vesting: "" },
      { address: "0xc8B3DcA3241D7ba4c6bBc226B5d516ac7EF04315", amount: "52001512", category: "MIGRATOR", vesting: "" },
      { address: "0xdA06036Ac14dC85BD6D14AE0c70dB5fd91bcFCf0", amount: "52278728", category: "MIGRATOR", vesting: "" },
      { address: "0xBA2DA2D96Fd98E44C0914A9B58C93E7Cadd25BeD", amount: "60107160", category: "MIGRATOR", vesting: "" },
      { address: "0x93fa875532476e49441A3987e83DcFB0ef59fe8E", amount: "62164155", category: "MIGRATOR", vesting: "" },
      { address: "0x2AF28D384bD4E700E93939447F777e46715b54E5", amount: "63448217", category: "MIGRATOR", vesting: "" },
      { address: "0xf130b800a2C763227a3DB4471D58524A1D944BF1", amount: "75247470", category: "MIGRATOR", vesting: "" },
      { address: "0x9831cAEe3C0634C50ff87C40F0C2b28d1f60f9e8", amount: "82364880", category: "MIGRATOR", vesting: "" },
      { address: "0x6394222013cd025B343Be4541db27C97BcdE7246", amount: "90090135", category: "MIGRATOR", vesting: "" },
      { address: "0xa34a8df5a6ebb4eb1bcae72628f33ac34b12e129", amount: "96479373", category: "MIGRATOR", vesting: "" },
      { address: "0x01BcB0F8119D071325757D9c931dB572C8dA3bF3", amount: "99999992", category: "MIGRATOR", vesting: "" },
      { address: "0xC1B57ee0318e6db08C083B4D59dE87CE52B37E58", amount: "100732475", category: "MIGRATOR", vesting: "" },
      { address: "0x85DF8e2c16993d94ECF438306B76fd6270A45f01", amount: "103263837", category: "MIGRATOR", vesting: "" },
      { address: "0x180B4A2D9CF5041b1523C9A40c708D4768EFcC36", amount: "107965469", category: "MIGRATOR", vesting: "" },
      { address: "0x230CFECba68C738dFE263f273310a4fe92e0c38b", amount: "117082802", category: "MIGRATOR", vesting: "" },
      { address: "0xa7be66aa60f42574DDEaF5d57587fB0fE3745207", amount: "128362591", category: "MIGRATOR", vesting: "" },
      { address: "0x00BEEb91eBE4618EE0B5E256C151213D2Fa64c62", amount: "152330976", category: "MIGRATOR", vesting: "" },
      { address: "0xDCe200aC095B1069399c3eff9e6e88893522BC7B", amount: "77319", category: "MIGRATOR", vesting: "" },
      { address: "0xb1246e68d4BA03508c3F09325bC15bF7D6F93f3a", amount: "196199", category: "MIGRATOR", vesting: "" },
      { address: "0x712909482efd1c0659eeff027938226a8a8c4c68", amount: "372773", category: "MIGRATOR", vesting: "" },
      { address: "0x07E4a0394cbE1d77304c37176FB31f2C92ccb655", amount: "2158912", category: "MIGRATOR", vesting: "" },
      { address: "0x30aD8cEde5775a9F54657f06ec40611c7a97f410", amount: "10336325", category: "MIGRATOR", vesting: "" },
      { address: "0xf4975bc3F61334D3Ad8261Ce162004be14121Fe3", amount: "13976710", category: "MIGRATOR", vesting: "" },
      { address: "0xd3911C7a8D15B9277C3cc4FdeA6a385547689471", amount: "55214285", category: "MIGRATOR", vesting: "" }
    ];

    // Calculate total to distribute
    let totalToDistribute = ethers.BigNumber.from("0");
    for (const recipient of addressesToDistribute) {
      totalToDistribute = totalToDistribute.add(
        ethers.utils.parseUnits(recipient.amount, decimals)
      );
    }
    
    console.log(`\nTotal tokens to distribute: ${ethers.utils.formatUnits(totalToDistribute, decimals)} ${symbol}`);
    
    // Check contract balance to ensure it has enough tokens
    const contractBalance = await token.balanceOf(contractAddress);
    console.log(`Contract Token Balance: ${ethers.utils.formatUnits(contractBalance, decimals)} ${symbol}`);
    
    if (contractBalance.lt(totalToDistribute)) {
      console.error("Contract doesn't have enough tokens to distribute.");
      return;
    }
    
    console.log("\n=== CHECKING RECIPIENT BALANCES ===");
    
    // Filter addresses with zero balance
    const addressesToActuallyDistribute = [];
    let actualTotalToDistribute = ethers.BigNumber.from("0");
    let recipientsWithBalance = 0;
    
    // First check all balances
    for (const recipient of addressesToDistribute) {
      const currentBalance = await token.balanceOf(recipient.address);
      
      if (currentBalance.isZero()) {
        const amount = ethers.utils.parseUnits(recipient.amount, decimals);
        actualTotalToDistribute = actualTotalToDistribute.add(amount);
        addressesToActuallyDistribute.push(recipient);
        console.log(`${recipient.address} (${recipient.category}) - Current Balance: 0.0 ${symbol} ✓ Will distribute`);
      } else {
        recipientsWithBalance++;
        console.log(`${recipient.address} (${recipient.category}) - Current Balance: ${ethers.utils.formatUnits(currentBalance, decimals)} ${symbol} → Skipping`);
      }
    }
    
    console.log(`\n=== DISTRIBUTION SUMMARY ===`);
    console.log(`Addresses already with tokens: ${recipientsWithBalance} out of ${addressesToDistribute.length}`);
    console.log(`Addresses with zero balance: ${addressesToActuallyDistribute.length} out of ${addressesToDistribute.length}`);
    console.log(`Total tokens to actually distribute: ${ethers.utils.formatUnits(actualTotalToDistribute, decimals)} ${symbol}`);
    
    if (contractBalance.lt(actualTotalToDistribute)) {
      console.error("Contract doesn't have enough tokens to distribute to zero-balance recipients.");
      return;
    }
    
    if (addressesToActuallyDistribute.length === 0) {
      console.log("No addresses with zero balance found. Nothing to distribute.");
      return;
    }
    
    // Ask for confirmation before proceeding
    console.log("\nWould you like to proceed with the distribution? (Type 'yes' to continue)");
    // Note: You'll need to manually confirm in the console
    
    console.log("\n=== DISTRIBUTING TOKENS ===");
    
    // Transfer tokens to each address with zero balance
    for (const recipient of addressesToActuallyDistribute) {
      const amount = ethers.utils.parseUnits(recipient.amount, decimals);
      console.log(`Transferring ${ethers.utils.formatUnits(amount, decimals)} ${symbol} to ${recipient.category} (${recipient.address})...`);
      
      try {
        // Execute the transfer from the contract with explicit gas limit
        const tx = await token.transfer(recipient.address, amount, {
          gasLimit: 200000 // Explicit gas limit to avoid estimation errors
        });
        await tx.wait();
        
        // Verify the new balance
        const newBalance = await token.balanceOf(recipient.address);
        console.log(`✅ New balance: ${ethers.utils.formatUnits(newBalance, decimals)} ${symbol}`);
      } catch (transferError) {
        console.error(`❌ Failed to transfer to ${recipient.address}: ${transferError.message}`);
      }
    }
    
    // Check remaining contract balance
    const remainingBalance = await token.balanceOf(contractAddress);
    console.log(`\nRemaining contract balance: ${ethers.utils.formatUnits(remainingBalance, decimals)} ${symbol}`);
    
    console.log("\n===== DISTRIBUTION COMPLETE =====");
    
  } catch (error) {
    console.error("Error distributing tokens:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Script execution failed:", error);
    process.exit(1);
  });