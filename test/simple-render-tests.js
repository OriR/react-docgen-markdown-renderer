const { expect } = require('code');
const Lab = require('lab');
const lab = (exports.lab = Lab.script());
const reactDocgen = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('../lib/index');
const { simpleComponent, simpleMarkdown } = require('./utils');

lab.experiment('simple render', () => {
  lab.beforeEach(({ context }) => {
    context.renderer = new ReactDocGenMarkdownRenderer();
  });

  lab.test('string type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'stringProp', type: 'string' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'stringProp', value: 'String' }] }));
  });

  lab.test('number type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'numProp', type: 'number' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'numProp', value: 'Number' }] }));
  });

  lab.test('bool type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'boolProp', type: 'bool' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'boolProp', value: 'Boolean' }] }));
  });

  lab.test('func type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'funcProp', type: 'func' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'funcProp', value: 'Function' }] }));
  });

  lab.test('array type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'arrayProp', type: 'array' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'arrayProp', value: 'Array' }] }));
  });

  lab.test('object type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'objectProp', type: 'object' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'objectProp', value: 'Object' }] }));
  });

  lab.test('symbol type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'symbolProp', type: 'symbol' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'symbolProp', value: 'Symbol' }] }));
  });

  lab.test('any type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'anyProp', type: 'any' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'anyProp', value: '*' }] }));
  });

  lab.test('node type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'nodeProp', type: 'node' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'nodeProp', value: 'ReactNode' }] }));
  });

  lab.test('element type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'elementProp', type: 'element' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({ types: [{ name: 'elementProp', value: 'ReactElement' }] }),
    );
  });

  lab.test('instanceOf type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'instanceOfProp', type: 'instanceOf(Message)' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({ types: [{ name: 'instanceOfProp', value: 'Message' }] }),
    );
  });

  lab.test('enum type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'oneOfProp', type: `oneOf(['Some', 'values', 1, 2 ])` }],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({ types: [{ name: 'oneOfProp', value: "Enum('Some', 'values', 1, 2)" }] }),
    );
  });

  lab.test('union type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'unionProp', type: 'oneOfType([PropTypes.string, PropTypes.number])' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({
        types: [
          { name: 'unionProp', value: 'Union<String\\|Number>' },
          { name: 'unionProp<1>', value: 'String' },
          { name: 'unionProp<2>', value: 'Number' },
        ],
      }),
    );
  });

  lab.test('arrayOf type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'arrayOfProp', type: 'arrayOf(PropTypes.number)' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({ types: [{ name: 'arrayOfProp', value: 'Array[]<Number>' }] }),
    );
  });

  lab.test('objectOf type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'objectOfProp', type: 'objectOf(PropTypes.number)' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({ types: [{ name: 'objectOfProp', value: 'Object[#]<Number>' }] }),
    );
  });

  lab.test('shape type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'shapeProp', type: 'shape({ index: PropTypes.number })' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({
        types: [
          { name: 'shapeProp', value: 'Shape' },
          { name: 'shapeProp.index', value: 'Number' },
        ],
      }),
    );
  });

  lab.test('exact type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [{ name: 'exactProp', type: 'exact({ index: PropTypes.number })' }],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({
        types: [
          { name: 'exactProp', value: 'Exact' },
          { name: 'exactProp.index', value: 'Number' },
        ],
      }),
    );
  });

  lab.test('custom type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          componentName: 'MyComponent',
          props: [
            {
              name: 'customProp',
              type: 'function(props, propName, componentName){}',
              custom: true,
            },
          ],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({ types: [{ name: 'customProp', value: '(custom validator)' }] }),
    );
  });

  lab.test('arrayOf custom type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          extra: `MyComponent.customShape = PropTypes.shape({ id: PropTypes.number });`,
          componentName: 'MyComponent',
          props: [
            {
              name: 'customProp',
              type: 'PropTypes.arrayOf(MyComponent.customShape)',
              custom: true,
            },
          ],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({
        types: [{ name: 'customProp', value: 'Array[]<MyComponent.customShape>' }],
      }),
    );
  });

  lab.test('objectOf custom type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          extra: `MyComponent.customShape = PropTypes.shape({ id: PropTypes.number });`,
          componentName: 'MyComponent',
          props: [
            {
              name: 'customProp',
              type: 'PropTypes.objectOf(MyComponent.customShape)',
              custom: true,
            },
          ],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({
        types: [{ name: 'customProp', value: 'Object[#]<MyComponent.customShape>' }],
      }),
    );
  });

  lab.test('union custom type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          extra: `MyComponent.customType = [PropTypes.string, PropTypes.shape({ id: PropTypes.number })];`,
          componentName: 'MyComponent',
          props: [
            {
              name: 'customProp',
              type: 'PropTypes.oneOfType(MyComponent.customShape)',
              custom: true,
            },
          ],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({ types: [{ name: 'customProp', value: 'Union<MyComponent.customShape>' }] }),
    );
  });

  lab.test('union with custom type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          extra: `MyComponent.customShape = PropTypes.shape({ id: PropTypes.number });`,
          componentName: 'MyComponent',
          props: [
            {
              name: 'customProp',
              type: 'PropTypes.oneOfType([PropTypes.string, MyComponent.customShape])',
              custom: true,
            },
          ],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({
        types: [
          { name: 'customProp', value: 'Union<String\\|MyComponent.customShape>' },
          { name: 'customProp<1>', value: 'String' },
          { name: 'customProp<2>', value: 'MyComponent.customShape' },
        ],
      }),
    );
  });

  lab.test('enum custom type', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          extra: `MyComponent.customEnum = ['Some', 'values', 1, 2 ];`,
          componentName: 'MyComponent',
          props: [
            { name: 'oneOfProp', type: `PropTypes.oneOf(MyComponent.customEnum)`, custom: true },
          ],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({ types: [{ name: 'oneOfProp', value: 'Enum(MyComponent.customEnum)' }] }),
    );
  });

  lab.test('enum with custom value', ({ context }) => {
    const result = context.renderer.render(
      './some/path',
      reactDocgen.parse(
        simpleComponent({
          extra: `MyComponent.customEnumValue = ['Value', 1, 2];`,
          componentName: 'MyComponent',
          props: [
            {
              name: 'oneOfProp',
              type: `PropTypes.oneOf(['Some', ...MyComponent.customEnumValue])`,
              custom: true,
            },
          ],
        }),
      ),
      [],
    );

    expect(result).to.equal(
      simpleMarkdown({
        types: [{ name: 'oneOfProp', value: "Enum('Some', ...MyComponent.customEnumValue)" }],
      }),
    );
  });

  lab.test('unknown type', ({ context }) => {
    const warn = console.warn;
    console.warn = () => {};

    const docgen = reactDocgen.parse(
      simpleComponent({
        componentName: 'MyComponent',
        props: [
          { name: 'unknownProp', type: 'function(props, propName, componentName){}', custom: true },
        ],
      }),
    );

    docgen.props.unknownProp.type.name = 'Unknown Type';

    const result = context.renderer.render('./some/path', docgen, []);

    expect(result).to.equal(simpleMarkdown({ types: [{ name: 'unknownProp', value: 'Unknown' }] }));

    console.warn = warn;
  });

  lab.test('no displayName', ({ context }) => {
    const docgen = reactDocgen.parse(`export default ({ someProp }) => <div></div>`);

    const result = context.renderer.render('./some/path', docgen, []);

    expect(result).to.equal(simpleMarkdown({ componentName: 'path' }));
  });
});
