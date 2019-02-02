## react-docgen-markdown-renderer

A simple renderer object that renders a documentation for React components into markdown.</br>

### Install
```
npm install --save-dev react-docgen-markdown-renderer
```

### Usage
Once installed, you can use the renderer like the example below
```javascript
const path = require('path');
const fs = require('fs');
const reactDocgen = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('react-docgen-markdown-renderer');
const componentPath = path.absolute(path.join(__.dirname, 'components/MyComponent.js'));
const renderer = new ReactDocGenMarkdownRenderer(/* constructor options object */);

fs.readFile(componentPath, (error, content) => {
  const documentationPath = path.basename(componentPath, path.extname(componentPath)) + renderer.extension;
  const doc = reactDocgen.parse(content);
  fs.writeFile(documentationPath, renderer.render(
    /* The path to the component, used for linking to the file. */
    componentPath,
    /* The actual react-docgen AST */
    doc,
    /* Array of component ASTs that this component composes*/
    []));
});
```

#### constructor
**options.componentsBasePath `String`**
This property is optional - defaults to `process.cwd()`.</br>
Represents the base directory where all of your components are stored locally.</br>
It's used as the text for the markdown link at the top of the file - if not specified the link won't appear.

**options.remoteComponentsBasePath `String`**
This property is optional.</br>
Represents the base directory where all of your components are stored remotely.</br>
It's used as the base url for markdown link at the top of the file - if not specified the link won't appear.

**options.template `TemplateObject`**
This property is optional - uses the default template if not specified.</br>
A template should be an object constrcuted through the `template` method coming from `react-docgen-renderer-template`.
The default template is 
```javascript
const defaultTemplate = `
## {{componentName}}

{{#if srcLink }}From [\`{{srcLink}}\`]({{srcLink}}){{/if}}

{{#if description}}{{{description}}}{{/if}}

prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
{{#each props}}
**{{@key}}** | \`{{> (typePartial this) this}}\` | {{#if this.defaultValue}}\`{{{this.defaultValue}}}\`{{/if}} | {{#if this.required}}:white_check_mark:{{else}}:x:{{/if}} | {{#if this.description}}{{{this.description}}}{{/if}}
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
**{{@key}}** | \`{{> (typePartial this) this}}\` | {{#if this.defaultValue}}\`{{{this.defaultValue}}}\`{{/if}} | {{#if this.required}}:white_check_mark:{{else}}:x:{{/if}} | {{#if this.description}}{{{this.description}}}{{/if}}
{{/each}}

{{/each}}
`;
```

### Example
#### input
```javascript
/**
 * This is an example component.
 **/
class MyComponent extends Component {

  constructor(props) {
    super(props);
  }

  getDefaultProps() {
    return {
      enm: 'Photos',
      one: {
        some: 1,
        type: 2,
        of: 3,
        value: 4
      }
    };
  }
  
  render() {
    return <div></div>;
  }
}

MyComponent.propTypes = {
    /**
     *  A simple `objectOf` propType.
     */
    one: React.PropTypes.objectOf(React.PropTypes.number),
    /**
     *  A very complex `objectOf` propType.
     */
    two: React.PropTypes.objectOf(React.PropTypes.shape({
      /**
       *  Just an internal propType for a shape.
       *  It's also required, and as you can see it supports multi-line comments!
       */
      id: React.PropTypes.number.isRequired,
      /**
       *  A simple non-required function
       */
      func: React.PropTypes.func,
      /**
       * An `arrayOf` shape
       */
      arr: React.PropTypes.arrayOf(React.PropTypes.shape({
        /**
         * 5-level deep propType definition and still works.
         */
        index: React.PropTypes.number.isRequired
      }))
    })),
    /**
     * `instanceOf` is also supported and the custom type will be shown instead of `instanceOf`
     */
    msg: React.PropTypes.instanceOf(Message),
    /**
     * `oneOf` is basically an Enum which is also supported but can be pretty big.
     */
    enm: React.PropTypes.oneOf([print('News'), 'Photos']),
    /**
     *  A multi-type prop is also valid and is displayed as `Union<String|Message>`
     */
    union: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.instanceOf(Message)
    ])
  };
```
#### output
<img width="828" alt="Example markdown output" src="https://cloud.githubusercontent.com/assets/2384068/22395353/0622d310-e544-11e6-855c-bb61b5ca46f6.png">

### FAQ
#### What is this weird type notation?
Well, I wanted to create a table for all of my props. Which means that I can't easily nest the components according to their actual structure.</br>
So this notation is helping define the needed types in a flattened manner.
* `[]` - An `arrayOf` notation.
* `.` - A `shape` notation.
* `[#]` - An `objectOf` notation.
* `<{number}>` - A `union` notation, where the `number` indicates the index of the option in the union.

In case of `arrayOf`, `objectOf` and `oneOfType` there also exists the internal type of each value which is noted with `<>`.
#### I want to create my own renderer
This is not as hard as it sounds, but there are some things that you have to know.</br>
A renderer has an `extension` property, a `render(file, doc, composes) => String` and `compile(options) => void` (as described above) functions.</br>
Once you have these you're basically done.</br></br>
`react-docgen-markdown-renderer` expects a `react-docgen` documentation object which helps populate the template above.</br>
It's highly recommended that you use it as well, but note that it doesn't flatten the props by default.
Since you're writing your own renderer you won't have access to all the partials and helpers defined here, but you have the freedom to create your own!</br></br>

For more you can always look at the code or open an issue :)
