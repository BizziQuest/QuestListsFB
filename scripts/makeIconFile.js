const fs = require('fs');
let filteredMeta = [];

fs.readFile('node_modules/@mdi/svg/meta.json', 'utf8', (err, data) => {
  if (err) throw err;
  const meta = JSON.parse(data);
  // filteredMeta = meta.map(({ baseIconId, id, codepoint, author, version, ...rest }) => rest);
  filteredMeta = meta.map(({ name, aliases,  tags, styles, deprecated }) => ({title: name, value: `mdi-${name}`, aliases, tags, styles, disabled: deprecated}));
  fs.writeFile('src/assets/icons.json', JSON.stringify(filteredMeta), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
});

