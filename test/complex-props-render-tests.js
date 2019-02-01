const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const reactDocgen = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('../lib/index');
const { simpleComponent, simpleMarkdown } = require('./utils');

lab.experiment('complex render', () => {
  lab.beforeEach(({ context }) => {
    context.renderer = new ReactDocGenMarkdownRenderer();
    context.renderer.compile();
  });

  lab.experiment('union', () => {
    lab.beforeEach(({ context }) => {
      context.getUnionProp = (types) => ({ name: 'unionProp', type: `oneOfType([${types.map(type => `PropTypes.${type}`)}])` });
    });

    lab.test('with arrayOf', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getUnionProp(['string', 'arrayOf(PropTypes.number)'])]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'unionProp', value: 'Union<String\\|Array[]<Number>>' },
        { name: 'unionProp<1>', value: 'String' },
        { name: 'unionProp<2>', value: 'Array[]<Number>' }
      ] }));
    });

    lab.test('with objectOf', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getUnionProp(['string', 'objectOf(PropTypes.number)'])]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'unionProp', value: 'Union<String\\|Object[#]<Number>>' },
        { name: 'unionProp<1>', value: 'String' },
        { name: 'unionProp<2>', value: 'Object[#]<Number>' }
      ] }));
    });

    lab.test('with shape', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getUnionProp(['string', 'shape({ index: PropTypes.number })'])]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'unionProp', value: 'Union<String\\|Shape>' },
        { name: 'unionProp<1>', value: 'String' },
        { name: 'unionProp<2>', value: 'Shape' },
        { name: 'unionProp<2>.index', value: 'Number' }
      ] }));
    });

    lab.test('with union', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getUnionProp(['string', 'oneOfType([PropTypes.string, PropTypes.number])'])]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'unionProp', value: 'Union<String\\|Union<String\\|Number>>' },
        { name: 'unionProp<1>', value: 'String' },
        { name: 'unionProp<2>', value: 'Union<String\\|Number>' },
        { name: 'unionProp<2><1>', value: 'String' },
        { name: 'unionProp<2><2>', value: 'Number' }
      ] }));
    });
  });

  lab.experiment('arrayOf', () => {
    lab.beforeEach(({ context }) => {
      context.getArrayOfProp = (type) => ({ name: 'arrayOfProp', type: `arrayOf(${type})` });
    });

    lab.test('with arrayOf', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getArrayOfProp('arrayOf(PropTypes.number)')]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'arrayOfProp', value: 'Array[]<Array[]<Number>>' }
      ] }));
    });

    lab.test('with objectOf', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getArrayOfProp('objectOf(PropTypes.number)')]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'arrayOfProp', value: 'Array[]<Object[#]<Number>>' }
      ] }));
    });

    lab.test('with shape', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getArrayOfProp('shape({ index: PropTypes.number })')]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'arrayOfProp', value: 'Array[]<Shape>' },
        { name: 'arrayOfProp[].index', value: 'Number' }
      ] }));
    });

    lab.test('with union', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getArrayOfProp('oneOfType([PropTypes.string, PropTypes.number])')]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'arrayOfProp', value: 'Array[]<Union<String\\|Number>>' },
        { name: 'arrayOfProp[]<1>', value: 'String' },
        { name: 'arrayOfProp[]<2>', value: 'Number' }
      ] }));
    });
  });

  lab.experiment('objectOf', () => {
    lab.beforeEach(({ context }) => {
      context.getObjectOfProp = (type) => ({ name: 'objectOfProp', type: `objectOf(${type})` });
    });

    lab.test('with arrayOf', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getObjectOfProp('arrayOf(PropTypes.number)')]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'objectOfProp', value: 'Object[#]<Array[]<Number>>' }
      ] }));
    });

    lab.test('with objectOf', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getObjectOfProp('objectOf(PropTypes.number)')]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'objectOfProp', value: 'Object[#]<Object[#]<Number>>' }
      ] }));
    });

    lab.test('with shape', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getObjectOfProp('shape({ index: PropTypes.number })')]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'objectOfProp', value: 'Object[#]<Shape>' },
        { name: 'objectOfProp[#].index', value: 'Number' }
      ] }));
    });

    lab.test('with union', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getObjectOfProp('oneOfType([PropTypes.string, PropTypes.number])')]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'objectOfProp', value: 'Object[#]<Union<String\\|Number>>' },
        { name: 'objectOfProp[#]<1>', value: 'String' },
        { name: 'objectOfProp[#]<2>', value: 'Number' }
      ] }));
    });
  });

  lab.experiment('shape', () => {
    lab.beforeEach(({ context }) => {
      context.getShapeProp = (types) => ({ name: 'shapeProp', type: `shape({ ${types.map(type => `${type.name}: PropTypes.${type.type}`) } })` });
    });

    lab.test('with arrayOf', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getShapeProp([{ name: 'stringProp', type: 'string' }, { name: 'arrayOfProp', type: 'arrayOf(PropTypes.number)' }])]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'shapeProp', value: 'Shape' },
        { name: 'shapeProp.arrayOfProp', value: 'Array[]<Number>' },
        { name: 'shapeProp.stringProp', value: 'String' }
      ] }));
    });

    lab.test('with objectOf', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getShapeProp([{ name: 'stringProp', type: 'string' }, { name: 'objectOfProp', type: 'objectOf(PropTypes.number)' }])]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'shapeProp', value: 'Shape' },
        { name: 'shapeProp.objectOfProp', value: 'Object[#]<Number>' },
        { name: 'shapeProp.stringProp', value: 'String' }
      ] }));
    });

    lab.test('with shape', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getShapeProp([{ name: 'stringProp', type: 'string' }, { name: 'shapeProp', type: 'shape({ index: PropTypes.number })' }])]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'shapeProp', value: 'Shape' },
        { name: 'shapeProp.shapeProp', value: 'Shape' },
        { name: 'shapeProp.shapeProp.index', value: 'Number' },
        { name: 'shapeProp.stringProp', value: 'String' }
      ] }));
    });

    lab.test('with union', ({ context }) => {
      const result = context.renderer.render(
        './some/path',
        reactDocgen.parse(simpleComponent(
          {
            componentName: 'MyComponent',
            props:[context.getShapeProp([{ name: 'stringProp', type: 'string' }, { name: 'unionProp', type: 'oneOfType([PropTypes.string, PropTypes.number])' }])]
          })),
        []);

      expect(result).to.equal(simpleMarkdown({ types: [
        { name: 'shapeProp', value: 'Shape' },
        { name: 'shapeProp.stringProp', value: 'String' },
        { name: 'shapeProp.unionProp', value: 'Union<String\\|Number>' },
        { name: 'shapeProp.unionProp<1>', value: 'String' },
        { name: 'shapeProp.unionProp<2>', value: 'Number' }
      ] }));
    });
  });
});