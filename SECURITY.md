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

## Ethical and Legal Boundaries

- Using tools to attempt unauthorized access to websites or systems is a violation of laws such as the Computer Fraud and Abuse Act (CFAA) in the United States and similar laws in other countries.
- Such actions can lead to severe legal consequences, including fines and imprisonment.

## Implementation Details

The application uses several security measures:

- Content Security Policy (CSP) headers
- Secure password handling practices
- Input sanitization
- No external dependencies for core functionality
- Client-side only processing

## Responsible Use

If you are interested in cybersecurity, consider learning about ethical hacking and penetration testing through legitimate channels. Certifications like Certified Ethical Hacker (CEH) or CompTIA Security+ can help you gain skills while adhering to ethical and legal standards.
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
