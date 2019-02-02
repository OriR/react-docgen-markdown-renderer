const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const reactDocgen = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('../lib/index');
const { simpleComponent, simpleMarkdown } = require('./utils');

lab.experiment('header render', () => {
  lab.beforeEach(({ context }) => {
    context.renderer = new ReactDocGenMarkdownRenderer();
  });

  lab.test('without description', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'stringProp', type: 'string' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String' }] }));
  });

  lab.test('with description', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'stringProp', type: 'string' }],
          description: `/**
          * This is some description for the component.
          */`
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ description: '\n\nThis is some description for the component.', types: [{ name: 'stringProp', value: 'String' }] }));
  });

  lab.test('without link', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'stringProp', type: 'string' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String' }] }));
  });

  lab.test('with link', () => {
    const renderer = new ReactDocGenMarkdownRenderer({
      componentsBasePath: './some/path',
      remoteComponentsBasePath: 'https://github.com/gen-org/component-library/tree/master/some/path'
    });

    const result = renderer.render(
      './some/path/MyComponent.js',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'stringProp', type: 'string' }]
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ link: '\nFrom [`MyComponent.js`](https://github.com/gen-org/component-library/tree/master/some/path/MyComponent.js)', types: [{ name: 'stringProp', value: 'String' }] }));
  });

  lab.test('with link & description', () => {
    const renderer = new ReactDocGenMarkdownRenderer({
      componentsBasePath: './some/path',
      remoteComponentsBasePath: 'https://github.com/gen-org/component-library/tree/master/some/path'
    });

    const result = renderer.render(
      './some/path/MyComponent.js',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent',
          props:[{ name: 'stringProp', type: 'string' }],
          description: `/**
          * This is some description for the component.
          */`
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({ description: '\n\nThis is some description for the component.', link: '\nFrom [`MyComponent.js`](https://github.com/gen-org/component-library/tree/master/some/path/MyComponent.js)', types: [{ name: 'stringProp', value: 'String' }] }));
  });

  lab.test('without props', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(simpleComponent(
        {
          componentName: 'MyComponent'
        })),
      []);
    
    expect(result).to.equal(simpleMarkdown({}));
  });
});
