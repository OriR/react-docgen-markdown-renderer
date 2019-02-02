const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const reactDocgen = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('../lib/index');
const { simpleComponent, simpleMarkdown } = require('./utils');

lab.experiment('prop metadata render', () => {
  lab.beforeEach(({ context }) => {
    context.renderer = new ReactDocGenMarkdownRenderer();
  });

  lab.test('description', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'stringProp', type: 'string', description: 'This is a custom required string prop with default' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String', description: 'This is a custom required string prop with default' }] }));
  });

  lab.test('required', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'stringProp', type: 'string', required: true }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String', required: true }] }));
  });

  lab.test('default', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'stringProp', type: 'string', default: "'value'" }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String', default: "'value'" }] }));
  });

  lab.test('func type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'funcProp', type: 'func' }]
        })),
      []);
    

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'funcProp', value: 'Function' }] }));
  });

  lab.test('array type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'arrayProp', type: 'array' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'arrayProp', value: 'Array' }] }));
  });

  lab.test('object type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'objectProp', type: 'object' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'objectProp', value: 'Object' }] }));
  });

  lab.test('symbol type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'symbolProp', type: 'symbol' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'symbolProp', value: 'Symbol' }] }));
  });

  lab.test('any type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'anyProp', type: 'any' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'anyProp', value: '*' }] }));
  });

  lab.test('node type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'nodeProp', type: 'node' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'nodeProp', value: 'ReactNode' }] }));
  });

  lab.test('element type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'elementProp', type: 'element' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'elementProp', value: 'ReactElement' }] }));
  });

  lab.test('instanceOf type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'instanceOfProp', type: 'instanceOf(Message)' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'instanceOfProp', value: 'Message' }] }));
  });

  lab.test('enum type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'oneOfProp', type: `oneOf(['Some', 'values', 1, 2 ])` }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'oneOfProp', value: "Enum('Some', 'values', 1, 2)" }] }));
  });

  lab.test('union type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'unionProp', type: 'oneOfType([PropTypes.string, PropTypes.number])' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [
      { name: 'unionProp', value: 'Union<String\\|Number>' },
      { name: 'unionProp<1>', value: 'String' },
      { name: 'unionProp<2>', value: 'Number' },
    ] }));
  });

  lab.test('arrayOf type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'arrayOfProp', type: 'arrayOf(PropTypes.number)' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [
      { name: 'arrayOfProp', value: 'Array[]<Number>' }
    ] }));
  });

  lab.test('objectOf type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'objectOfProp', type: 'objectOf(PropTypes.number)' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [
      { name: 'objectOfProp', value: 'Object[#]<Number>' }
    ] }));
  });

  lab.test('shape type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'shapeProp', type: 'shape({ index: PropTypes.number })' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [
      { name: 'shapeProp', value: 'Shape' },
      { name: 'shapeProp.index', value: 'Number' }
    ] }));
  });

  lab.test('custom type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'customProp', type: 'function(props, propName, componentName){}', custom: true }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [
      { name: 'customProp', value: '(custom validator)' }
    ] }));
  });
});