# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Considerations

This project is a demonstration of password guessing techniques for educational purposes only. Please note:

- Do not use real passwords you currently use elsewhere
- The application runs entirely in your browser using Web Workers
- No passwords are stored or transmitted to any server
- The demo is intended for learning about cyber security concepts

## Best Practices

When using this demo:
- Run it locally on your own machine
- Don't input sensitive passwords
- Keep your browser updated
- Use the app on a secure network

## Implementation Details

The application uses several security measures:

- Content Security Policy (CSP) headers
- Secure password handling practices
- Input sanitization
- No external dependencies for core functionality
- Client-side only processing

## Local Development

When contributing or running locally:

```bash
# Use HTTPS for git operations
git config --global url."https://".insteadOf git://

# Install dependencies with npm ci instead of npm install
npm ci

# Run security audit
npm audit
```

## Known Issues

None currently. Check our GitHub Issues page for updates.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
