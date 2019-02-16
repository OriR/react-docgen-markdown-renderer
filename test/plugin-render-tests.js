const { expect } = require('code');
const Lab = require('lab');
const lab = (exports.lab = Lab.script());
const reactDocgen = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('../lib/index');
const { template, type } = require('react-docgen-renderer-template');
const { simpleComponent, simpleMarkdown } = require('./utils');

lab.experiment('plugin render', () => {
  lab.test('new type', () => {
    const docgen = reactDocgen.parse(
      simpleComponent({
        componentName: 'MyComponent',
        props: [{ name: 'newTypeProp', type: 'MyAwesomeType', custom: true }],
      }),
    );

    docgen.props.newTypeProp.type.name = 'awesome';

    const renderer = new ReactDocGenMarkdownRenderer({
      template: ReactDocGenMarkdownRenderer.defaultTemplate.setPlugins([
        {
          getTypeMapping({ extension }) {
            return {
              awesome: type`${({ context, getType }) => {
                return context.type.raw;
              }}`,
            };
          },
        },
      ]),
    });

    const result = renderer.render('./some/path', docgen, []);

    expect(result).to.equal(
      simpleMarkdown({ types: [{ name: 'newTypeProp', value: 'MyAwesomeType' }] }),
    );
  });

  lab.test('custom template', () => {
    const docgen = reactDocgen.parse(
      simpleComponent({
        componentName: 'MyComponent',
      }),
    );

    const renderer = new ReactDocGenMarkdownRenderer({
      template: template({})`${({ context }) =>
        `This is my awesome template! I can even use the context here! look: ${
          context.componentName
        }`}`,
    });

    const result = renderer.render('./some/path', docgen, []);

    expect(result).to.equal(
      'This is my awesome template! I can even use the context here! look: MyComponent',
    );
  });
});
