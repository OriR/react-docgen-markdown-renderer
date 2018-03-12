const path = require('path');
const os = require('os');
const process = require('process');
const handlebars = require('handlebars');
const handlebarsConfig = require('./handlebarsConfig');
const getType = require('./getObjectType');

let typeFlatteners = {};

const normalizeValue = value => value ? value.replace(new RegExp(os.EOL, 'g'), ' ') : value;

const flattenProp = (seed, currentObj, name, isImmediateNesting) => {
  const typeObject = getType(currentObj);

  if (typeObject) {
    const flattener = typeFlatteners[typeObject.name] || (() =>{});
    flattener(seed, typeObject, name);
  }

  if (!isImmediateNesting) {
    seed[name] = Object.assign({}, currentObj, {
      description: normalizeValue(currentObj.description),
      defaultValue: normalizeValue(currentObj.defaultValue && currentObj.defaultValue.value)
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
  },
  union(seed, unionType, name) {
    unionType.value.forEach((type, index) => {
      flattenProp(seed, type, name + `<${index + 1}>`, true);
    });
  }
};

const flattenProps = (props) => {
  const sortedProps = {};
  if (props) {
    const flattenedProps = Object.keys(props).reduce((seed, prop) => {
      flattenProp(seed, props[prop], prop);
      return seed;
    }, {});

    Object.keys(flattenedProps).sort().forEach(key => {
      sortedProps[key] = flattenedProps[key];
    });
  }

  return sortedProps;
};

const getHandlebars = (plugins, handlebars) => plugins.reduce((handlebars, plugin) => plugin(handlebars), handlebars);

class ReactDocGenMarkdownRenderer {
  constructor(options) {
    this.options = Object.assign({
      componentsBasePath: process.cwd(),
      remoteComponentsBasePath: undefined
    }, options);

    this.extension = '.md';
  }

  compile(options) {
    this.options = Object.assign({
      template: handlebarsConfig.defaultTemplate,
      handlebarsPlugins: [],
      typePartials: {}
    }, this.options, options);

    const basePlugin = handlebarsConfig.createPlugin(this.options.typePartials);
    this.template = getHandlebars([basePlugin].concat(this.options.handlebarsPlugins), handlebars).compile(this.options.template);
  }

  render(file, docs, composes) {
    return this.template({
      componentName: path.basename(file, path.extname(file)),
      srcLink: file.replace(this.options.componentsBasePath + path.sep, ''),
      srcLinkUrl: file.replace(this.options.componentsBasePath, this.options.remoteComponentsBasePath).replace(/\\/g, '/'),
      description: docs.description,
      isMissingComposes: (docs.composes || []).length !== composes.length,
      props: flattenProps(docs.props),
      composes: composes.map(compose => ({
        componentName: compose.componentName,
        props: flattenProps(compose.props)
      }))
    });
  }
}

module.exports = ReactDocGenMarkdownRenderer;
