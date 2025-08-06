# Pharos Testnet Auto Bot v3.0 RWAfi Edition

An advanced automated bot for interacting with the Pharos Testnet, now with **RWAfi ecosystem integration** for maximum rewards.

## 🚀 New RWAfi Features

### Integrated Platforms:
- **🤖 AutoStaking Pro** - AI-powered auto staking
- **🌉 Bitcoin Bridge** - Cross-chain BTC transactions  
- **📈 CFD Trading** - Decentralized CFD trading
- **🎨 NFT Collecting** - NFT minting and trading

## ✨ Features

### Basic Tasks:
- ✅ **Automated Swaps**: Random swaps between WPHRS and USDC tokens
- ✅ **PHRS Transfers**: Small amount transfers to random addresses  
- ✅ **Faucet Claims**: Automatic testnet token claims
- ✅ **Daily Check-ins**: Complete daily tasks for rewards

### RWAfi Tasks (NEW):
- 🤖 **AutoStaking**: AI-optimized staking operations
- 🌉 **Bitcoin Bridge**: Cross-chain BTC↔PHRS transactions
- 📈 **CFD Trading**: Leveraged trading on multiple pairs
- 🎨 **NFT Collecting**: Mint and trade NFTs across collections

### Advanced Features:
- 🔄 **Multi-wallet Support**: Process multiple wallets sequentially
- 🌐 **Proxy Support**: Rotate proxies for each operation
- 📊 **Statistics Tracking**: Detailed stats for each account
- ⏰ **Smart Delays**: Randomized delays to avoid detection
- 🎯 **Experience System**: Track XP and RWAfi points
- 🔧 **Configurable**: Customize all task parameters

## 📋 Prerequisites

- Node.js v16 or higher
- NPM or Yarn package manager
- Pharos testnet private keys
- (Optional) HTTP proxies for enhanced privacy

## 🛠️ Installation

1. **Clone the repository:**
\`\`\`bash
git clone https://github.com/thinh2004/Pharos-Auto.git
cd Pharos-Auto
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Configure environment:**
\`\`\`bash
cp .env.example .env
# Edit .env with your private keys
\`\`\`

4. **Setup proxies (optional):**
\`\`\`bash
# Add proxies to proxies.txt (one per line)
\`\`\`

## ⚙️ Configuration

### Environment Variables (.env):
\`\`\`env
PRIVATE_KEY_1="your_private_key_here"
PRIVATE_KEY_2="another_private_key_here"
RWAFI_ENABLED=true
STAKING_AMOUNT="0.01"
BRIDGE_AMOUNT="0.005"
CFD_LEVERAGE=2
NFT_BUDGET="0.02"
\`\`\`

### Task Configuration:
Edit the `config` object in `index.js` to customize:
- Task quantities (swaps, transfers, RWAfi operations)
- Delays between operations
- RWAfi platform settings
- Randomization options

## 🚀 Usage

### Start the bot:
\`\`\`bash
npm start
\`\`\`

### Development mode with auto-reload:
\`\`\`bash
npm run dev
\`\`\`

### Stop the bot:
Press `Ctrl+C` to gracefully shutdown

## 📊 Statistics

The bot tracks comprehensive statistics:
- **Transactions**: Total successful transactions
- **Experience Points**: Earned from various tasks
- **RWAfi Points**: Earned from RWAfi platform interactions
- **Success Rate**: Per account and overall
- **Level Progression**: Based on experience points

## 🔧 RWAfi Integration Details

### AutoStaking Pro:
- **Operations**: 3 per cycle (configurable)
- **Amount**: 0.01 PHRS (randomizable)
- **Rewards**: 400-600 RWAfi points per operation

### Bitcoin Bridge:
- **Routes**: BTC↔PHRS, BTC↔WPHRS
- **Transactions**: 2 per cycle (configurable)  
- **Amount**: 0.005 PHRS (randomizable)
- **Rewards**: 600-900 RWAfi points per transaction

### CFD Trading:
- **Pairs**: BTC/USD, ETH/USD, PHRS/USD, SOL/USD, AVAX/USD
- **Positions**: LONG/SHORT with configurable leverage
- **Trades**: 5 per cycle (configurable)
- **Rewards**: 800-1200 RWAfi points per trade

### NFT Collecting:
- **Collections**: GrandLine Pirates, Pharos Legends, RWAfi Heroes
- **Actions**: MINT, BUY, TRADE
- **Operations**: 2 per cycle (configurable)
- **Budget**: 0.02 PHRS per operation
- **Rewards**: 250-400 RWAfi points per NFT

## ⚠️ Disclaimer

This bot is for educational and testing purposes on the Pharos testnet only. Use responsibly and in accordance with the platform's terms of service.

## 📝 License

MIT License - see LICENSE file for details.
