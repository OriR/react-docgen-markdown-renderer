const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const reactDocgen = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('../lib/index');
const { simpleComponent, simpleMarkdown } = require('./utils');

lab.experiment('compose render', () => {
  lab.beforeEach(({ context }) => {
    context.renderer = new ReactDocGenMarkdownRenderer();
  });

  lab.test('simple', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          composes: ['AnotherComponent'],
          props: [{ name: 'stringProp', type: 'string' }]
        })),
      [reactDocgen.parse(simpleComponent(
        {
          componentName: 'AnotherComponent',
          props: [{ name: 'numberProp', type: 'number' }]
        }))]);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String' }], composes: [{ name: 'AnotherComponent', types: [{ name: 'numberProp', value: 'Number' }] }] }));
  });

  lab.test('without props', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          composes: ['AnotherComponent'],
          props: [{ name: 'stringProp', type: 'string' }]
        })),
      [reactDocgen.parse(simpleComponent(
        {
          componentName: 'AnotherComponent'
        }))]);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String' }], composes: [{ name: 'AnotherComponent', types: [] }] }));
  });

  lab.test('multi', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          composes: ['AnotherComponent', 'AndAnother'],
          props: [{ name: 'stringProp', type: 'string' }]
        })),
      [
        reactDocgen.parse(simpleComponent(
        {
          componentName: 'AnotherComponent',
          props: [{ name: 'numberProp', type: 'number' }]
        })),
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'AndAnother',
            props: [{ name: 'boolProp', type: 'bool' }]
          })),
      ]);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String' }], composes: [{ name: 'AnotherComponent', types: [{ name: 'numberProp', value: 'Number' }] }, { name: 'AndAnother', types:[{ name: 'boolProp', value: 'Boolean' }] }] }));
  });

  lab.test('missing', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          composes: ['AnotherComponent'],
          props: [{ name: 'stringProp', type: 'string' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String' }], isMissing: true }));
  });

  lab.test('imported types', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          imports: 'import { customImportedShape } from \'./customImportedShape.js\'',
          componentName: 'MyComponent',
          props: [{ name: 'customImportedShape', custom: true, type: 'customImportedShape' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'customImportedShape', value: 'customImportedShape' }] }));
  });


  lab.test('nested imported types', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          imports: 'import { customImportedShape } from \'./customImportedShape.js\'',
          componentName: 'MyComponent',
          props: [{ name: 'nestedImportedShape', custom: true, type: 'PropTypes.oneOfType([PropTypes.arrayOf(customImportedShape), customImportedShape])' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [
      { name: 'nestedImportedShape', value: 'Union<Array[]<customImportedShape>\\|customImportedShape>' },
      { name: 'nestedImportedShape<1>', value: 'Array[]<customImportedShape>' },
      { name: 'nestedImportedShape<2>', value: 'customImportedShape' }
    ] }));
  });

  lab.test('extra', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props: [{ name: 'stringProp', type: 'string' }]
        })),
      [
        reactDocgen.parse(simpleComponent(
        {
          componentName: 'AnotherComponent',
          props: [{ name: 'numberProp', type: 'number' }]
        }))
      ]);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String' }], composes: [{ name: 'AnotherComponent', types: [{ name: 'numberProp', value: 'Number' }] }] }));
  });

  lab.test('custom componentName', ({ context }) => {
    const anotherComponent = reactDocgen.parse(simpleComponent(
      {
        componentName: 'AnotherComponent'
      })
    );
    anotherComponent.componentName = 'CustomComponentName';
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          composes: ['AnotherComponent'],
          props: [{ name: 'stringProp', type: 'string' }]
        })),
      [anotherComponent]);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String' }], composes: [{ name: 'CustomComponentName', types: [] }] }));
  });
});