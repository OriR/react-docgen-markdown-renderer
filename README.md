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
const ReactDocGenMarkdownRenderer = require('react-docgen-markdown-renderer');
const componentPath = path.absolute(path.join(__.dirname, 'components/MyComponent.js'));
const renderer = new ReactDocGenMarkdownRenderer({
  componentsBasePath: __.dirname
});

fs.readFile(componentPath, (error, content) => {
  const documentationPath = path.basename(componentPath, path.extname(componentPath)) + renderer.extension;
  fs.writeFile(documentationPath, renderer.render(componentPath, content));
});
```

By default `react-docgen-markdown-renderer` will use `process.cwd()` as the `componentsBasePath`.</br>

#### options
##### componentsBasePath `String`
This property is optional.</br>
Represents the base directory where all of your components live.</br>
It's used when creating a markdown link at the top of the file.

##### template `String`
`react-docgen-markdown-renderer` uses [Handlebarsjs](handlebarsjs.com) to generate the markdown template.</br>
Which means that you can use all the partials and helpers that `react-docgen-markdown-renderer` defines in your own template!</br>
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
`;
```

#### Creating your own template
As you can see from the default template you have access to several objects within your template.</br>
##### `componentName // String` 
The name of the component that is being documented.
##### `srcLink // String`
The relative path to the component (based on the `componentsBasePath`). 
##### `description // String`
The description given to that component.
##### `props // Object[#]<Prop>`
A hash-map of the flattened props this component exposes.</br>
The key is the flattened name of the prop.</br>
each `Prop` can have a description, a required flag and a defaultValue. The type is inferred with the helper `typePartial` like so `{{> (typePartial this) this}}`.</br></br>

`react-docgen-markdown-renderer` also comes with some useful partials and helpers if you'll want to take advantage of.
##### `typePartial`
This needs to be used in order to render the type of the prop - travels all the way down to the the leaf nodes to determine the exact type for each flattened prop.
##### `typeObject`
This returns the actual type object of a type, whether it has a `type` property or just a `name`.
##### all React.PropTypes
All `React.PropTypes` have their own partials that know how to render the type given the relevant type object.

#### Example
##### input
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
##### output
<img width="828" alt="Example markdown output" src="https://cloud.githubusercontent.com/assets/2384068/22395353/0622d310-e544-11e6-855c-bb61b5ca46f6.png">

### FAQ
##### What is this weird type notation?
Well, I wanted to create a table for all of my props. Which means that I can't easily nest the components according to their actual structure.</br>
So this notation is helping define the needed types in a flattened manner.
* `[]` - An `arrayOf` notation.
* `.` - A `shape` notation.
* `[#]` -An `objectOf` notation.

In case of `arrayOf`, `objectOf` and `oneOfType` there also exists the internal type of each value which is noted with `<>`.
##### I want to create my own renderer
This is not as hard as it sounds, but there are some things that you have to know.</br>
A renderer has an `extension` property and a `render(file, content) => String` function.</br>
Once you have these two you're basically done.</br>
`react-docgen-markdown-renderer` uses `react-docgen` to generate a documentation object which helps populate the template above.</br>
It's highly recommended that you use it as well, but not that it doesn't flatten the props by default.
Since you're writing your own renderer you won't have access to all the partials and helpers defined here, but you have the freedom to create your own!</br></br>

For more you can always look at the code or open an issue :)
