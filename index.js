const path = require('path');
const os = require('os');
const process = require('process');
const reactDocs = require('react-docgen');
const handlebars = require('handlebars');

const getType = (obj) => {
  return (obj.type && typeof obj.type.name === 'string') ? obj.type : (typeof obj.name === 'string') ? obj : undefined;
};

handlebars.registerPartial('Unknown', 'Unknown');

handlebars.registerPartial('func', 'Function');
handlebars.registerPartial('array', 'Array');
handlebars.registerPartial('object', 'Object');
handlebars.registerPartial('string', 'String');
handlebars.registerPartial('number', 'Number');
handlebars.registerPartial('bool', 'Boolean');
handlebars.registerPartial('node', 'ReactNode');
handlebars.registerPartial('element', 'ReactElement');
handlebars.registerPartial('any', '*');
handlebars.registerPartial('custom', '(custom validator)');
handlebars.registerPartial('shape', 'Shape');

handlebars.registerPartial('arrayOf', 'Array[]<{{#with (typeObject this)}}{{> (typePartial value) value}}{{/with}}>');
handlebars.registerPartial('objectOf', 'Object[#]<{{#with (typeObject this)}}{{> (typePartial value) value}}{{/with}}>');
handlebars.registerPartial('instanceOf', '{{#with (typeObject this)}}{{value}}{{/with}}');
handlebars.registerPartial('enum', 'Enum({{#with (typeObject this)}}{{#each value}}{{{this.value}}}{{#unless @last}},{{/unless}}{{/each}}{{/with}})');
handlebars.registerPartial('union', 'Union<{{#with (typeObject this)}}{{#each value}}{{> (typePartial this) this}}{{#unless @last}}\\|{{/unless}}{{/each}}{{/with}}>');

handlebars.registerHelper('typeObject', getType);

handlebars.registerHelper('typePartial', function(type) {
  const partials = [
    'any', 'array', 'arrayOf', 'bool', 'custom', 'element', 'enum', 'func',
    'node', 'number', 'object', 'string', 'union', 'instanceOf', 'objectOf', 'shape'
  ];
  const typeObj = getType(type);
  return typeObj && partials.includes(typeObj.name) ? typeObj.name : 'Unknown';
});

const defaultTemplate = `
## {{componentName}}

{{#if srcLink }}From [\`{{srcLink}}\`]({{srcLink}}){{/if}}

{{#if description}}{{{description}}}{{/if}}

prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
{{#each props}}
**{{@key}}** | \`{{> (typePartial this) this}}\` | {{#if this.defaultValue}}\`{{{this.defaultValue}}}\`{{/if}} | {{#if this.required}}:white_check_mark:{{else}}:x:{{/if}} | {{#if this.description}}{{{this.description}}}{{/if}}
{{/each}}
`;

let typeFlatteners = {};


const replaceNewLine = (value) => value.replace(new RegExp(os.EOL, 'g'), ' ');
const normalizeValue = (value, hasInnerValue) => value ? hasInnerValue ? replaceNewLine(value.value) : replaceNewLine(value) : value;


const flattenProp = (seed, currentObj, name, isImmediateNesting) => {
  const typeObject = getType(currentObj);

  if (typeObject) {
    const flattener = typeFlatteners[typeObject.name] || (() =>{});
    flattener(seed, typeObject, name);
  }

  if (!isImmediateNesting) {
    seed[name] = Object.assign({}, currentObj, {
      description: normalizeValue(currentObj.description, false),
      defaultValue: normalizeValue(currentObj.defaultValue, true)
    });
  }
};

typeFlatteners = {
  arrayOf(seed, arrayType, name) {
    flattenProp(seed, arrayType.value, name + '[]', true);
  },
  shape(seed, shapeType, name) {
    Object.keys(shapeType.value).forEach((inner) => {
      flattenProp(seed, shapeType.value[inner], name + '.' + inner);
    });
  },
  objectOf(seed, objectOfType, name) {
    flattenProp(seed, objectOfType.value, name + '[#]', true);
  }
};



class ReactDocGenMarkdownRenderer {
  constructor(options) {
    this.options = Object.assign({
      componentsBasePath: process.cwd(),
      template: defaultTemplate
    }, options);

    this.template = handlebars.compile(options.template);
    this.extension = '.md';
  }

  render(file, content) {
    const docs = reactDocs.parse(content);
    const componentName = path.basename(file, path.extname(file));

    if (docs.props) {
      const sortedProps = {};
      Object.keys(obj).sort().forEach(key => {
        sortedProps[key] = obj[key];
      });

      return this.template({
        componentName,
        srcLink: file.replace(this.options.componentsBasePath + '/', ''),
        description: docs.description,
        props: sortedProps
      });
    }

    // No proper documentation was provided on the component.
    return '#### NO DOCUMENTATION PROVIDED FOR ' + componentName + ' component';
  }
}

module.exports = ReactDocGenMarkdownRenderer;
