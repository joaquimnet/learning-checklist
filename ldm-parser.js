const fs = require('fs');

module.exports = filePath => {
  const dataset = fs.readFileSync(filePath, 'utf8');

  function err(msg, line) {
    return msg + `\n${line.line}: ${line.raw}`;
  }

  const lines = dataset.split('\n').map(l => l.trimRight());

  const parseIndentation = line => {
    let spaces = 0;
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== ' ') {
        break;
      }
      spaces++;
    }
    return [spaces, spaces / 2];
  };

  const indentationData = lines
    .map((line, index) => {
      const [spaces, indentations] = parseIndentation(line);
      if (spaces % 2 !== 0) {
        throw new SyntaxError(err(`Bad indentation`, { line: index + 1, raw: line }));
      }
      if ((index === 0) & (indentations !== 0)) {
        throw new SyntaxError(err(`Bad indentation`, { line: index, raw: line }));
      }
      return {
        indentations,
        raw: line.substring(spaces),
        line: index + 1,
      };
    })
    // Remove empty lines
    .filter(l => l.raw.length);

  const valueData = indentationData.map((line, index, array) => {
    const previousLine = array[index - 1];
    if (previousLine && line.indentations - previousLine.indentations > 1) {
      throw new SyntaxError(err('Bad indentation', line));
    }
    return {
      ...line,
      index,
    };
  });

  function hasChildren(line) {
    return valueData[0].indentations > line.indentations;
  }

  let finalObject = {};
  let path = [];

  function deepKey(object, keyPath) {
    let obj = object;
    if (!keyPath.length) {
      return object;
    }
    for (let i = 0; i < keyPath.length; i++) {
      obj = obj[keyPath[i]];
    }
    return obj;
  }

  while (valueData.length) {
    const line = valueData.shift();

    while (line.indentations !== path.length) {
      path.pop();
    }

    const obj = deepKey(finalObject, path);

    if (valueData.length && hasChildren(line)) {
      obj[line.raw] = {};
      path.push(line.raw);
      latestIndentation = line.indentations;
    } else {
      obj[line.raw] = line.raw;
    }
  }

  return finalObject;
};
