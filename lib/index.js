const path = require('path');
const os = require('os');
const process = require('process');
const defaultTemplate = require('./defaultTemplate');

let typeFlatteners = {};

const normalizeValue = value => (value ? value.replace(new RegExp(os.EOL, 'g'), ' ') : value);

const flattenProp = (seed, currentObj, name, isImmediateNesting) => {
  let typeObject;
  if (currentObj.type && typeof currentObj.type.name === 'string') {
    typeObject = currentObj.type;
    /* $lab:coverage:off$ */
  } else if (typeof currentObj.name === 'string') {
    typeObject = currentObj;
  } else if (typeof currentObj === 'string') {
    typeObject = { name: currentObj };
  } else {
    // This is just a safeguard, shouldn't happen though.
    throw new Error(`Unknown object type found for ${name}, check the source code and try again.`);
  }
  /* $lab:coverage:on$ */

  (typeFlatteners[typeObject.name] || (() => {}))(seed, typeObject, name);

  if (!isImmediateNesting) {
    seed[name] = Object.assign({}, currentObj, {
      type: { ...typeObject },
      description: normalizeValue(currentObj.description),
      defaultValue: normalizeValue(currentObj.defaultValue && currentObj.defaultValue.value),
    });
  }
};

typeFlatteners = {
  arrayOf(seed, arrayType, name) {
    flattenProp(seed, arrayType.value, name + '[]', true);
  },
  shape(seed, shapeType, name) {
    Object.keys(shapeType.value).forEach(inner => {
      flattenProp(seed, shapeType.value[inner], name + '.' + inner);
    });
  },
  exact(seed, exactType, name) {
    Object.keys(exactType.value).forEach(inner => {
      flattenProp(seed, exactType.value[inner], name + '.' + inner);
    });
  },
  objectOf(seed, objectOfType, name) {
    flattenProp(seed, objectOfType.value, name + '[#]', true);
  },
  union(seed, unionType, name) {
    if (typeof unionType.value === 'string') {
      return;
    }

    unionType.value.forEach((type, index) => {
      flattenProp(seed, type, name + `<${index + 1}>`);
    });
  },
};

const flattenProps = props => {
  const sortedProps = {};
  if (props) {
    const flattenedProps = Object.keys(props).reduce((seed, prop) => {
      flattenProp(seed, props[prop], prop);
      return seed;
    }, {});

    Object.keys(flattenedProps)
      .sort()
      .forEach(key => {
        sortedProps[key] = flattenedProps[key];
      });
  }

  return sortedProps;
};

class ReactDocGenMarkdownRenderer {
  constructor(options) {
    this.options = {
      componentsBasePath: process.cwd(),
      remoteComponentsBasePath: undefined,
      template: defaultTemplate,
      ...options,
    };

    this.extension = '.md';
  }

  render(file, docs, composes) {
    return this.options.template.instantiate(
      {
        componentName: docs.displayName
          ? docs.displayName
          : path.basename(file, path.extname(file)),
        srcLink:
          this.options.remoteComponentsBasePath &&
          file.replace(this.options.componentsBasePath + path.sep, ''),
        srcLinkUrl:
          this.options.remoteComponentsBasePath &&
          file
            .replace(this.options.componentsBasePath, this.options.remoteComponentsBasePath)
            .replace(/\\/g, '/'),
        description: docs.description,
        isMissingComposes: (docs.composes || []).length > composes.length,
        props: flattenProps(docs.props),
        composes: composes.map(compose => ({
          ...compose,
          componentName: compose.componentName || compose.displayName,
          props: flattenProps(compose.props),
        })),
      },
      this.extension,
    );
  }
}

ReactDocGenMarkdownRenderer.defaultTemplate = defaultTemplate;

module.exports = ReactDocGenMarkdownRenderer;
