const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');

const logErr = msg => msg && console.log(chalk.red(msg));
const logSuccess = msg => msg && console.log(chalk.green(msg));

const hooksDir = path.join(__dirname, '../src/hooks/');
const hooksIndexPath = path.join(hooksDir, 'index.ts');
const getFilePath = name => path.join(hooksDir, `${name}.ts`);
const getContent = name => {
  if (!name.startsWith('use')) {
    throw new Error('hooks name should start with \'use\'');
  }
  return (
`const ${name} = () => {

};

export default ${name};
`
  )
};
const getExportContent = name =>
`export { default as ${name} } from './${name}';
`;

inquirer
  .prompt([
    {
      name: 'hookName',
      type: 'input',
      message: 'please input hooks name: '
    }
  ])
  .then(({ hookName }) => {
    const filePath = getFilePath(hookName);
    const content = getContent(hookName);
    const exportContent = getExportContent(hookName);
    fs.writeFile(filePath, content, logErr);
    fs.appendFile(hooksIndexPath, exportContent, logErr);
    return hookName;
  })
  .then(hookName => {
    logSuccess(`successfully created ${hookName}`)
  })
  .catch(logErr);
