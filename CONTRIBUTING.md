# Contributing to BASECAMP DeFi Protocol

Thank you for your interest in contributing to BASECAMP! This document provides guidelines and instructions for contributing.

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Our Standards

Positive behavior includes:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Unacceptable behavior includes:
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- Clear and descriptive title
- Exact steps to reproduce the problem
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, network)

Example:
```
Title: Swap fails when slippage is set to 0%

Steps to reproduce:
1. Connect wallet
2. Navigate to Swap page
3. Set slippage to 0%
4. Enter swap amount
5. Click Swap

Expected: Transaction should fail with slippage error
Actual: Transaction hangs indefinitely

Environment:
- OS: macOS 13.0
- Browser: Chrome 120
- Network: Polygon Mumbai
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- Clear and descriptive title
- Detailed description of the proposed feature
- Explain why this enhancement would be useful
- List any alternatives you've considered

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Ensure all tests pass
6. Update documentation
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js v18+
- npm or yarn
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/basecamp-defi-protocol.git
cd basecamp-defi-protocol

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Setup environment
cp .env.example .env
# Edit .env with your values

# Compile contracts
npm run compile

# Run tests
npm test

# Start local node
npm run node

# In another terminal, deploy locally
npm run deploy:local

# Start frontend
npm run frontend
```

## Coding Standards

### Solidity

Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ContractName
 * @dev Brief description
 */
contract ContractName {
    // State variables
    uint256 public stateVariable;
    
    // Events
    event SomethingHappened(address indexed user, uint256 amount);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // Functions (external, public, internal, private)
    function externalFunction() external {
        // Implementation
    }
    
    function publicFunction() public {
        // Implementation
    }
    
    function _internalFunction() internal {
        // Implementation
    }
    
    function _privateFunction() private {
        // Implementation
    }
}
```

### TypeScript/JavaScript

Follow standard TypeScript conventions:

```typescript
// Use meaningful variable names
const userBalance = await token.balanceOf(address);

// Use async/await
async function fetchData() {
  try {
    const data = await contract.getData();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Use TypeScript types
interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
  slippage: number;
}

// Export named functions
export function calculateSlippage(amount: bigint, slippage: number): bigint {
  return (amount * BigInt(slippage)) / BigInt(100);
}
```

### React Components

```typescript
import { useState } from 'react';

interface Props {
  title: string;
  onSubmit: (value: string) => void;
}

export default function Component({ title, onSubmit }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value) return;
    onSubmit(value);
    setValue('');
  };

  return (
    <div className="container">
      <h2>{title}</h2>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

## Testing Requirements

### Smart Contracts

All smart contract changes must include tests:

```javascript
describe("New Feature", function () {
  it("Should work correctly", async function () {
    // Arrange
    const input = "test";
    
    // Act
    await contract.newFeature(input);
    
    // Assert
    expect(await contract.result()).to.equal(expected);
  });

  it("Should revert on invalid input", async function () {
    await expect(
      contract.newFeature(invalidInput)
    ).to.be.revertedWith("Invalid input");
  });
});
```

### Test Coverage

Maintain >80% test coverage:

```bash
npm run test:coverage
```

## Documentation

### Code Comments

```solidity
/**
 * @notice Swaps ETH for tokens
 * @param minTokenOut Minimum tokens to receive
 * @return tokenOut Amount of tokens received
 */
function swapETHForToken(uint256 minTokenOut) 
    external 
    payable 
    returns (uint256 tokenOut) 
{
    // Implementation
}
```

### README Updates

Update README.md when adding features:

```markdown
## New Feature

Description of the feature.

### Usage

```bash
npm run new-feature
```

### Example

```javascript
const result = await contract.newFeature(params);
```
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add limit order functionality
fix: resolve swap slippage calculation
docs: update deployment guide
test: add liquidity pool edge cases
refactor: optimize gas usage in farm contract
style: format code with prettier
chore: update dependencies
```

## Pull Request Process

1. Update README.md with details of changes
2. Update CHANGELOG.md
3. Ensure all tests pass
4. Update documentation
5. Request review from maintainers
6. Address review feedback
7. Squash commits if requested
8. Wait for approval and merge

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

## Review Process

### For Contributors

- Be patient and respectful
- Respond to feedback promptly
- Make requested changes
- Ask questions if unclear

### For Reviewers

- Be constructive and respectful
- Explain reasoning for changes
- Approve when ready
- Merge when approved

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Run full test suite
5. Deploy to testnet
6. Test all features
7. Create GitHub release
8. Deploy to mainnet (if applicable)
9. Announce release

## Community

### Communication Channels

- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: General questions and ideas
- Discord: Real-time chat and support
- Twitter: Announcements and updates

### Getting Help

- Check documentation first
- Search existing issues
- Ask in Discord
- Create GitHub issue if needed

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation
- Eligible for bounties (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out:
- Email: dev@basecamp-defi.io
- Discord: https://discord.gg/basecampdefi
- Twitter: @basecampdefi

Thank you for contributing to BASECAMP DeFi Protocol!
