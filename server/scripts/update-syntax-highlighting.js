const fs = require('fs');
const process = require('process');
const axios = require('axios');

axios.get('https://p5js.org/reference/data.json').then((response) => {
  const { data } = response;

  const arr = data.classitems;
  const p5VariableKeywords = {};
  const p5FunctionKeywords = {};

  arr.forEach((obj) => {
    if (obj.class === 'p5' && obj.module !== 'Foundation') {
      if (obj.itemtype === 'property') {
        p5VariableKeywords[`${obj.name}`] = 'p5Variable';
      }
      if (obj.itemtype === 'method') {
        p5FunctionKeywords[`${obj.name}`] = 'p5Function';
      }
    }
  });

  let p5VariablePart = JSON.stringify(p5VariableKeywords);
  let p5FunctionPart = JSON.stringify(p5FunctionKeywords);
  p5VariablePart = p5VariablePart.replace(/"p5Variable"/g, 'p5Variable');
  p5FunctionPart = p5FunctionPart.replace(/"p5Function"/g, 'p5Function');

  let generatedCode = '/* eslint-disable */ \n';
  generatedCode +=
    '/* generated: do not edit! helper file for syntax highlighting.' +
    ' generated by update-syntax-highlighting script */ \n';
  generatedCode +=
    'var p5Function = {type: "variable", style: "p5-function"};\n';
  generatedCode +=
    'var p5Variable = {type: "variable", style: "p5-variable"};\n';
  generatedCode += `let p5VariableKeywords = ${p5VariablePart}; \n`;
  generatedCode += `let p5FunctionKeywords = ${p5FunctionPart}; \n`;
  generatedCode += 'exports.p5FunctionKeywords = p5FunctionKeywords;\n';
  generatedCode += 'exports.p5VariableKeywords = p5VariableKeywords;\n';
  fs.writeFile(
    `${process.cwd()}/client/utils/p5-keywords.js`,
    generatedCode,
    (error) => {
      if (error) {
        console.log("Error!! Couldn't write to the file", error);
      } else {
        console.log('Syntax highlighting files updated successfully');
      }
    }
  );
});
