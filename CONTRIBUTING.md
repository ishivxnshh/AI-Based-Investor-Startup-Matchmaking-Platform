# Contributing to AI-Based Investor-Startup Matchmaking Platform

First off, thank you for considering contributing to our project! 🎉

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Note your environment** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Your First Code Contribution

Unsure where to begin? You can start by looking through `beginner` and `help-wanted` issues:

- **Beginner issues** - issues which should only require a few lines of code
- **Help wanted issues** - issues which should be a bit more involved

## Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork locally**
   ```bash
   git clone https://github.com/YOUR-USERNAME/AI-Based-Investor-Startup-Matchmaking-Platform.git
   cd AI-Based-Investor-Startup-Matchmaking-Platform
   ```

3. **Add the upstream repository**
   ```bash
   git remote add upstream https://github.com/ishivxnshh/AI-Based-Investor-Startup-Matchmaking-Platform.git
   ```

4. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

5. **Create a branch for your changes**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Pull Request Process

1. **Update your fork** with the latest upstream changes
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a new branch** for your feature or bugfix
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes** and commit them with clear, descriptive messages

4. **Test your changes** thoroughly
   - Ensure all existing tests pass
   - Add new tests for new features
   - Test in multiple browsers if applicable

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request** on GitHub
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all CI checks pass

7. **Respond to feedback** from reviewers promptly

### PR Title Format

Use conventional commit format for PR titles:
- `feat: add new matching algorithm`
- `fix: resolve login authentication issue`
- `docs: update installation instructions`
- `style: format code with prettier`
- `refactor: restructure API endpoints`
- `test: add unit tests for user service`
- `chore: update dependencies`

## Coding Standards

### JavaScript/Node.js

- Use **ES6+** features where appropriate
- Follow **camelCase** for variables and functions
- Follow **PascalCase** for classes and components
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**
- Avoid **deeply nested code**

### React

- Use **functional components** with hooks
- Keep components **small and reusable**
- Use **PropTypes** or **TypeScript** for type checking
- Follow the **single responsibility principle**
- Extract reusable logic into **custom hooks**

### CSS

- Use **meaningful class names**
- Follow **BEM methodology** when applicable
- Keep styles **modular and scoped**
- Avoid **inline styles** unless necessary

### General Best Practices

- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **YAGNI** (You Aren't Gonna Need It)
- Write **self-documenting code**
- Add **unit tests** for new features
- Update **documentation** as needed

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

### Examples
```
feat(auth): add social login functionality

Implemented OAuth integration for Google and GitHub login.
Users can now sign in using their social accounts.

Closes #123
```

```
fix(api): resolve CORS issue in production

Added proper CORS headers to API responses to fix
cross-origin requests from the frontend.

Fixes #456
```

## Questions?

Don't hesitate to ask questions! You can:
- Open an issue with the `question` label
- Reach out to the maintainers
- Join our community discussions

## Recognition

Contributors will be recognized in our README and release notes. Thank you for making this project better! 🙌

---

**Happy Contributing!** 🚀
