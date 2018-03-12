const getType = require('./getObjectType');

const createPlugin = (typePartials) => (handlebars) => {
  const partials = Object.assign({}, {
    Unknown: 'Unknown',
    func: 'Function',
    array: 'Array',
    object: 'Object',
    string: 'String',
    number: 'Number',
    bool: 'Boolean',
    node: 'ReactNode',
    element: 'ReactElement',
    any: '*',
    custom: '(custom validator)',
    shape: 'Shape',
    arrayOf: 'Array[]<{{#with (typeObject this)}}{{> (typePartial value) value}}{{/with}}>',
    objectOf: 'Object[#]<{{#with (typeObject this)}}{{> (typePartial value) value}}{{/with}}>',
    instanceOf: '{{#with (typeObject this)}}{{value}}{{/with}}',
    enum: 'Enum({{#with (typeObject this)}}{{#each value}}{{{this.value}}}{{#unless @last}},{{/unless}}{{/each}}{{/with}})',
    union: 'Union<{{#with (typeObject this)}}{{#each value}}{{> (typePartial this) this}}{{#unless @last}} \\| {{/unless}}{{/each}}{{/with}}>'
  }, typePartials);

  Object.keys(partials).forEach(partial => {
    handlebars.registerPartial(partial, partials[partial]);
  });

  handlebars.registerHelper('typeObject', getType);

  handlebars.registerHelper('typePartial', function (type) {
    const typeObj = getType(type);
    return typeObj && Object.keys(partials).includes(typeObj.name) ? typeObj.name : 'Unknown';
  });

  return handlebars;
};

const defaultTemplate = `
## {{componentName}}

{{#if srcLinkUrl }}From [\`{{srcLink}}\`]({{srcLinkUrl}}){{/if}}

{{#if description}}{{{description}}}{{/if}}

prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
{{#each props}}
**{{{@key}}}** | \`{{> (typePartial this) this}}\` | {{#if this.defaultValue}}\`{{{this.defaultValue}}}\`{{/if}} | {{#if this.required}}:white_check_mark:{{else}}:x:{{/if}} | {{#if this.description}}{{{this.description}}}{{/if}}
{{/each}}

{{#if isMissingComposes}}
*Some or all of the composed components are missing from the list below because a documentation couldn't be generated for them.
See the source code of the component for more information.*
{{/if}}

{{#if composes.length}}
{{componentName}} gets more \`propTypes\` from these composed components
{{/if}}

{{#each composes}}
#### {{this.componentName}}

prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
{{#each this.props}}
**{{{@key}}}** | \`{{> (typePartial this) this}}\` | {{#if this.defaultValue}}\`{{{this.defaultValue}}}\`{{/if}} | {{#if this.required}}:white_check_mark:{{else}}:x:{{/if}} | {{#if this.description}}{{{this.description}}}{{/if}}
{{/each}}

{{/each}}
`;

module.exports = {
  defaultTemplate,
  createPlugin
};
