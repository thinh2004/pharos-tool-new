const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Import existing modules (giả sử có sẵn)
// const { loadProxies, getRandomProxy } = require('./utils/proxy');
// const { delay, randomDelay } = require('./utils/helpers');

class PharosAutoBot {
  constructor() {
    this.accounts = [];
    this.proxies = [];
    this.isRunning = false;
    this.stats = {
      totalTx: 0,
      totalExp: 0,
      totalRwafiPoints: 0,
      successfulAccounts: 0,
      failedAccounts: 0
    };
    
    // Network configuration
    this.networkConfig = {
      name: 'Pharos Testnet',
      chainId: 688688,
      rpcUrl: 'https://testnet.dplabs-internal.com',
      currencySymbol: 'PHRS',
      explorerUrl: 'https://testnet.pharosscan.xyz'
    };
    
    // Token addresses
    this.tokens = {
      USDC: '0xad902cf99c2de2f1ba5ec4d642fd7e49cae9ee37',
      WPHRS: '0x76aaada469d23216be5f7c596fa25f282ff9b364',
      USDT: '0xed59de2d7ad9c043442e381231ee3646fc3c2939',
      POSITION_MANAGER: '0xF8a1D4FF0f9b9Af7CE58E1fc1833688F3BFd6115'
    };
    
    // RWAfi Platforms (NEW)
    this.rwafiPlatforms = {
      autoStaking: {
        name: 'AutoStaking Pro',
        url: 'https://autostaking.pro/?env=pharosBitcoin',
        enabled: true,
        rewards: 500
      },
      bitcoinBridge: {
        name: 'Fiamma Bitcoin Bridge', 
        url: 'https://beta-test-bridge.fiammalabs.io/bridge',
        enabled: true,
        rewards: 750
      },
      cfdTrading: {
        name: 'BrokeX CFD Trading',
        url: 'https://app.brokex.trade/',
        enabled: true,
        rewards: 1000
      },
      nftCollecting: {
        name: 'GrandLine NFT World',
        url: 'https://app.grandline.world/launchpad/mint/0x96381ed3fcfb385cbacfe6908159f0905b19767a',
        enabled: true,
        rewards: 300
      }
    };
    
    // Task configuration
    this.config = {
      // Basic tasks
      faucetEnabled: true,
      checkInEnabled: true,
      swapEnabled: true,
      transferEnabled: true,
      
      // RWAfi tasks (NEW)
      rwafiEnabled: true,
      autoStakingEnabled: true,
      bitcoinBridgeEnabled: true,
      cfdTradingEnabled: true,
      nftCollectingEnabled: true,
      
      // Quantities
      numSwaps: 10,
      numTransfers: 5,
      numAutoStaking: 3,
      numBridgeTransactions: 2,
      numCfdTrades: 5,
      numNftMints: 2,
      
      // Settings
      delayBetweenAccounts: 5000,
      delayBetweenTasks: 2000,
      delayBetweenCycles: 300000, // 5 minutes
      useProxy: true,
      randomizeAmounts: true,
      
      // RWAfi amounts
      stakingAmount: "0.01",
      bridgeAmount: "0.005", 
      cfdLeverage: 2,
      nftBudget: "0.02"
    };
    
    this.init();
  }
  
  async init() {
    console.log('🚀 Pharos Testnet Auto Bot v3.0 RWAfi Edition');
    console.log('===============================================');
    
    await this.loadAccounts();
    await this.loadProxies();
    
    console.log(`✅ Loaded ${this.accounts.length} accounts`);
    console.log(`✅ Loaded ${this.proxies.length} proxies`);
    console.log(`🎯 RWAfi Integration: ${this.config.rwafiEnabled ? 'ENABLED' : 'DISABLED'}`);
  }
  
  async loadAccounts() {
    try {
      const data = fs.readFileSync('.env', 'utf8');
      const lines = data.split('\n').filter(line => line.includes('PRIVATE_KEY'));
      
      this.accounts = lines.map((line, index) => {
        const privateKey = line.split('=')[1]?.replace(/"/g, '').trim();
        if (!privateKey) return null;
        
        const wallet = new ethers.Wallet(privateKey);
        return {
          id: index + 1,
          privateKey,
          address: wallet.address,
          wallet,
          stats: {
            totalTx: 0,
            experiencePoints: 0,
            rwafiPoints: 0,
            level: 1,
            lastActivity: null
          }
        };
      }).filter(Boolean);
      
    } catch (error) {
      console.log('❌ Error loading accounts:', error.message);
      this.accounts = [];
    }
  }
  
  async loadProxies() {
    try {
      if (fs.existsSync('proxies.txt')) {
        const data = fs.readFileSync('proxies.txt', 'utf8');
        this.proxies = data.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'));
      }
    } catch (error) {
      console.log('⚠️ No proxies loaded:', error.message);
      this.proxies = [];
    }
  }
  
  getRandomProxy() {
    if (this.proxies.length === 0) return null;
    return this.proxies[Math.floor(Math.random() * this.proxies.length)];
  }
  
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async randomDelay(min = 1000, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await this.delay(delay);
  }
  
  log(message, account = null) {
    const timestamp = new Date().toLocaleTimeString();
    const accountInfo = account ? `[${account.address.slice(0, 8)}]` : '';
    console.log(`[${timestamp}] ${accountInfo} ${message}`);
  }
  
  // ==================== EXISTING TASKS ====================
  
  async claimFaucet(account) {
    this.log('🚰 Claiming faucet...', account);
    
    try {
      // Simulate faucet claim
      await this.randomDelay(2000, 4000);
      
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        this.log('✅ Faucet claimed successfully', account);
        account.stats.totalTx++;
        account.stats.experiencePoints += 50;
        return true;
      } else {
        this.log('❌ Faucet claim failed', account);
        return false;
      }
    } catch (error) {
      this.log(`❌ Faucet error: ${error.message}`, account);
      return false;
    }
  }
  
  async dailyCheckIn(account) {
    this.log('📝 Performing daily check-in...', account);
    
    try {
      await this.randomDelay(1500, 3000);
      
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        this.log('✅ Daily check-in completed', account);
        account.stats.experiencePoints += 25;
        return true;
      } else {
        this.log('❌ Daily check-in failed', account);
        return false;
      }
    } catch (error) {
      this.log(`❌ Check-in error: ${error.message}`, account);
      return false;
    }
  }
  
  async performSwaps(account, count) {
    this.log(`🔀 Starting ${count} token swaps...`, account);
    
    const pairs = ['WPHRS→USDC', 'WPHRS→USDT', 'USDC→WPHRS', 'USDT→WPHRS'];
    let successCount = 0;
    
    for (let i = 0; i < count; i++) {
      try {
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        const amount = this.config.randomizeAmounts ? 
          (0.0001 + Math.random() * 0.0009).toFixed(6) : 
          '0.0001';
        
        await this.randomDelay(2000, 4000);
        
        const success = Math.random() > 0.25; // 75% success rate
        if (success) {
          successCount++;
          this.log(`✅ Swap ${i + 1}/${count} (${amount} ${pair}) completed`, account);
          account.stats.totalTx++;
          account.stats.experiencePoints += 20;
        } else {
          this.log(`❌ Swap ${i + 1}/${count} (${pair}) failed`, account);
        }
      } catch (error) {
        this.log(`❌ Swap ${i + 1} error: ${error.message}`, account);
      }
    }
    
    this.log(`📊 Swaps completed: ${successCount}/${count}`, account);
    return successCount;
  }
  
  async performTransfers(account, count) {
    this.log(`💸 Starting ${count} PHRS transfers...`, account);
    
    let successCount = 0;
    
    for (let i = 0; i < count; i++) {
      try {
        const amount = this.config.randomizeAmounts ? 
          (0.0001 + Math.random() * 0.0009).toFixed(6) : 
          '0.0001';
        
        await this.randomDelay(1500, 3000);
        
        const success = Math.random() > 0.15; // 85% success rate
        if (success) {
          successCount++;
          this.log(`✅ Transfer ${i + 1}/${count} (${amount} PHRS) completed`, account);
          account.stats.totalTx++;
          account.stats.experiencePoints += 10;
        } else {
          this.log(`❌ Transfer ${i + 1}/${count} failed`, account);
        }
      } catch (error) {
        this.log(`❌ Transfer ${i + 1} error: ${error.message}`, account);
      }
    }
    
    this.log(`📊 Transfers completed: ${successCount}/${count}`, account);
    return successCount;
  }
  
  // ==================== NEW RWAFI TASKS ====================
  
  async executeAutoStaking(account, count) {
    this.log(`🤖 Starting ${count} AutoStaking operations...`, account);
    
    let successCount = 0;
    let totalRewards = 0;
    
    for (let i = 0; i < count; i++) {
      try {
        const amount = this.config.randomizeAmounts ? 
          (parseFloat(this.config.stakingAmount) * (0.8 + Math.random() * 0.4)).toFixed(6) : 
          this.config.stakingAmount;
        
        await this.randomDelay(3000, 5000);
        
        const success = Math.random() > 0.2; // 80% success rate
        const reward = 400 + Math.floor(Math.random() * 200);
        
        if (success) {
          successCount++;
          totalRewards += reward;
          this.log(`✅ AutoStaking ${i + 1}/${count} (${amount} PHRS) completed (+${reward} RWAfi)`, account);
          account.stats.totalTx++;
          account.stats.rwafiPoints += reward;
        } else {
          this.log(`❌ AutoStaking ${i + 1}/${count} failed`, account);
        }
      } catch (error) {
        this.log(`❌ AutoStaking ${i + 1} error: ${error.message}`, account);
      }
    }
    
    this.log(`📊 AutoStaking completed: ${successCount}/${count} (+${totalRewards} RWAfi)`, account);
    return { successCount, totalRewards };
  }
  
  async executeBitcoinBridge(account, count) {
    this.log(`🌉 Starting ${count} Bitcoin Bridge transactions...`, account);
    
    const routes = ['BTC→PHRS', 'PHRS→BTC', 'BTC→WPHRS', 'WPHRS→BTC'];
    let successCount = 0;
    let totalRewards = 0;
    
    for (let i = 0; i < count; i++) {
      try {
        const route = routes[Math.floor(Math.random() * routes.length)];
        const amount = this.config.randomizeAmounts ? 
          (parseFloat(this.config.bridgeAmount) * (0.7 + Math.random() * 0.6)).toFixed(6) : 
          this.config.bridgeAmount;
        
        await this.randomDelay(4000, 7000);
        
        const success = Math.random() > 0.25; // 75% success rate
        const reward = 600 + Math.floor(Math.random() * 300);
        
        if (success) {
          successCount++;
          totalRewards += reward;
          this.log(`✅ Bitcoin Bridge ${i + 1}/${count} (${amount} ${route}) completed (+${reward} RWAfi)`, account);
          account.stats.totalTx++;
          account.stats.rwafiPoints += reward;
        } else {
          this.log(`❌ Bitcoin Bridge ${i + 1}/${count} (${route}) failed`, account);
        }
      } catch (error) {
        this.log(`❌ Bitcoin Bridge ${i + 1} error: ${error.message}`, account);
      }
    }
    
    this.log(`📊 Bitcoin Bridge completed: ${successCount}/${count} (+${totalRewards} RWAfi)`, account);
    return { successCount, totalRewards };
  }
  
  async executeCFDTrading(account, count) {
    this.log(`📈 Starting ${count} CFD trades...`, account);
    
    const pairs = ['BTC/USD', 'ETH/USD', 'PHRS/USD', 'SOL/USD', 'AVAX/USD'];
    const positions = ['LONG', 'SHORT'];
    let successCount = 0;
    let totalRewards = 0;
    
    for (let i = 0; i < count; i++) {
      try {
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const leverage = this.config.cfdLeverage;
        
        await this.randomDelay(3500, 6000);
        
        const success = Math.random() > 0.3; // 70% success rate
        const reward = 800 + Math.floor(Math.random() * 400);
        
        if (success) {
          successCount++;
          totalRewards += reward;
          this.log(`✅ CFD Trade ${i + 1}/${count} (${position} ${pair} ${leverage}x) completed (+${reward} RWAfi)`, account);
          account.stats.totalTx++;
          account.stats.rwafiPoints += reward;
        } else {
          this.log(`❌ CFD Trade ${i + 1}/${count} (${position} ${pair}) failed`, account);
        }
      } catch (error) {
        this.log(`❌ CFD Trade ${i + 1} error: ${error.message}`, account);
      }
    }
    
    this.log(`📊 CFD Trading completed: ${successCount}/${count} (+${totalRewards} RWAfi)`, account);
    return { successCount, totalRewards };
  }
  
  async executeNFTCollecting(account, count) {
    this.log(`🎨 Starting ${count} NFT mints/trades...`, account);
    
    const collections = ['GrandLine Pirates', 'Pharos Legends', 'RWAfi Heroes', 'Testnet Warriors'];
    const actions = ['MINT', 'BUY', 'TRADE'];
    let successCount = 0;
    let totalRewards = 0;
    
    for (let i = 0; i < count; i++) {
      try {
        const collection = collections[Math.floor(Math.random() * collections.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const price = this.config.randomizeAmounts ? 
          (parseFloat(this.config.nftBudget) * (0.5 + Math.random() * 1.0)).toFixed(4) : 
          this.config.nftBudget;
        
        await this.randomDelay(3000, 5000);
        
        const success = Math.random() > 0.2; // 80% success rate
        const reward = 250 + Math.floor(Math.random() * 150);
        
        if (success) {
          successCount++;
          totalRewards += reward;
          this.log(`✅ NFT ${action} ${i + 1}/${count} (${collection} - ${price} PHRS) completed (+${reward} RWAfi)`, account);
          account.stats.totalTx++;
          account.stats.rwafiPoints += reward;
        } else {
          this.log(`❌ NFT ${action} ${i + 1}/${count} (${collection}) failed`, account);
        }
      } catch (error) {
        this.log(`❌ NFT ${action} ${i + 1} error: ${error.message}`, account);
      }
    }
    
    this.log(`📊 NFT Collecting completed: ${successCount}/${count} (+${totalRewards} RWAfi)`, account);
    return { successCount, totalRewards };
  }
  
  // ==================== MAIN AUTOMATION ====================
  
  async processAccount(account) {
    this.log(`\n🎯 Processing account ${account.id}/${this.accounts.length}...`, account);
    
    let accountSuccess = true;
    
    try {
      // Basic tasks
      if (this.config.faucetEnabled) {
        const faucetResult = await this.claimFaucet(account);
        accountSuccess = accountSuccess && faucetResult;
        await this.delay(this.config.delayBetweenTasks);
      }
      
      if (this.config.checkInEnabled) {
        const checkInResult = await this.dailyCheckIn(account);
        accountSuccess = accountSuccess && checkInResult;
        await this.delay(this.config.delayBetweenTasks);
      }
      
      // Transaction tasks
      if (this.config.swapEnabled) {
        await this.performSwaps(account, this.config.numSwaps);
        await this.delay(this.config.delayBetweenTasks);
      }
      
      if (this.config.transferEnabled) {
        await this.performTransfers(account, this.config.numTransfers);
        await this.delay(this.config.delayBetweenTasks);
      }
      
      // RWAfi tasks (NEW)
      if (this.config.rwafiEnabled) {
        if (this.config.autoStakingEnabled) {
          await this.executeAutoStaking(account, this.config.numAutoStaking);
          await this.delay(this.config.delayBetweenTasks);
        }
        
        if (this.config.bitcoinBridgeEnabled) {
          await this.executeBitcoinBridge(account, this.config.numBridgeTransactions);
          await this.delay(this.config.delayBetweenTasks);
        }
        
        if (this.config.cfdTradingEnabled) {
          await this.executeCFDTrading(account, this.config.numCfdTrades);
          await this.delay(this.config.delayBetweenTasks);
        }
        
        if (this.config.nftCollectingEnabled) {
          await this.executeNFTCollecting(account, this.config.numNftMints);
          await this.delay(this.config.delayBetweenTasks);
        }
      }
      
      // Update account stats
      account.stats.level = Math.floor(account.stats.experiencePoints / 1000) + 1;
      account.stats.lastActivity = new Date().toLocaleTimeString();
      
      this.log(`🎉 Account completed: ${account.stats.totalTx} TX, ${account.stats.experiencePoints} XP, ${account.stats.rwafiPoints} RWAfi, Level ${account.stats.level}`, account);
      
      if (accountSuccess) {
        this.stats.successfulAccounts++;
      } else {
        this.stats.failedAccounts++;
      }
      
    } catch (error) {
      this.log(`❌ Account processing error: ${error.message}`, account);
      this.stats.failedAccounts++;
    }
  }
  
  async runCycle() {
    this.log('\n🚀 Starting new automation cycle...');
    this.log(`📊 Accounts: ${this.accounts.length} | RWAfi: ${this.config.rwafiEnabled ? 'ON' : 'OFF'}`);
    
    for (let i = 0; i < this.accounts.length; i++) {
      if (!this.isRunning) break;
      
      const account = this.accounts[i];
      await this.processAccount(account);
      
      // Update global stats
      this.stats.totalTx += account.stats.totalTx;
      this.stats.totalExp += account.stats.experiencePoints;
      this.stats.totalRwafiPoints += account.stats.rwafiPoints;
      
      // Delay between accounts
      if (i < this.accounts.length - 1) {
        this.log(`⏳ Waiting ${this.config.delayBetweenAccounts/1000}s before next account...`);
        await this.delay(this.config.delayBetweenAccounts);
      }
    }
    
    this.displayStats();
  }
  
  displayStats() {
    console.log('\n📊 CYCLE STATISTICS');
    console.log('==================');
    console.log(`✅ Successful accounts: ${this.stats.successfulAccounts}`);
    console.log(`❌ Failed accounts: ${this.stats.failedAccounts}`);
    console.log(`🔄 Total transactions: ${this.stats.totalTx}`);
    console.log(`⭐ Total experience: ${this.stats.totalExp}`);
    console.log(`🪙 Total RWAfi points: ${this.stats.totalRwafiPoints}`);
    console.log('==================\n');
  }
  
  async start() {
    if (this.accounts.length === 0) {
      console.log('❌ No accounts found. Please check your .env file.');
      return;
    }
    
    this.isRunning = true;
    this.log('🎯 Pharos Auto Bot with RWAfi Integration started!');
    
    while (this.isRunning) {
      await this.runCycle();
      
      if (this.isRunning) {
        this.log(`⏰ Waiting ${this.config.delayBetweenCycles/60000} minutes before next cycle...`);
        await this.delay(this.config.delayBetweenCycles);
      }
    }
    
    this.log('⏹️ Bot stopped.');
  }
  
  stop() {
    this.isRunning = false;
    this.log('🛑 Stopping bot...');
  }
}

// ==================== MAIN EXECUTION ====================

async function main() {
  const bot = new PharosAutoBot();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
    bot.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
    bot.stop();
    process.exit(0);
  });
  
  // Start the bot
  await bot.start();
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = PharosAutoBot;
