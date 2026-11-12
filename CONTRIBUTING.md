# Contributing to Parakh AI

Thank you for contributing to Parakh AI.

## Development Workflow
1. Fork and clone the repository.
2. Create a feature branch (`git checkout -b feature/statutory-rule-expansion`).
3. Set up the local virtual environment and frontend dependencies following [Development Guide](docs/development.md).
4. Run the full test suite before committing (`pytest` in backend, `npm test` and `npm run build` in frontend).
5. Ensure all commits adhere to standard conventional commit conventions.

## Code Standards
- Python: PEP 8, formatted with Black and checked with Flake8.
- TypeScript: Strict typing enabled, ESLint compliance.
- Database: All schema changes must be versioned through Django migrations.
