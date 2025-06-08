# THE LOOP – Source of Truth
All AI coding agents MUST reference these files before generating or editing code.
Every decision must trace back to this folder—no exceptions.
- Human-editable specs: /specs
- Machine-generated: /vars
- Compliance enforced in /workflow
Never commit changes that break spec/code sync—CI will block.
