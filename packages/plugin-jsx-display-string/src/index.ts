function(babel) {
  const { types: t } = babel;

  function isComplexExpression(node) {
    return (
      t.isArrayExpression(node) ||
      t.isObjectExpression(node) ||
      t.isCallExpression(node) ||
      t.isIdentifier(node) ||
      t.isMemberExpression(node)
    );
  }

  return {
    name: "transform-jsx-expression",
    visitor: {
      JSXExpressionContainer(path) {
        console.log(path.node);
        
        const expression = path.get("expression");
        
        if (isComplexExpression(expression.node)) {
          // 将表达式包装在 JSON.stringify 调用中
          const stringifyCall = t.callExpression(
            t.memberExpression(t.identifier("JSON"), t.identifier("stringify")),
            [expression.node]
          );
          path.get("expression").replaceWith(stringifyCall);
        } else if (t.isNewExpression(expression.node)) {
          // 将 new Error('error') 转换为 new Error('error).toString()
          const toStringCall = t.callExpression(
            t.memberExpression(expression.node, t.identifier("toString")),
            []
          );
          path.get("expression").replaceWith(toStringCall);
        }
      }
    }
  };
}