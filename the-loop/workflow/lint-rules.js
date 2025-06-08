// Example: Block direct literal color assignments in codebase
module.exports = {
  rules: {
    'no-literal-colors': context => ({
      Literal(node) {
        if (typeof node.value === 'string' && /^#(?:[A-Fa-f0-9]{3}){1,2}$/.test(node.value)) {
          context.report({ node, message: 'Use design tokens from /the-loop/vars, not hardcoded colors.' });
        }
      }
    })
  }
};
