const os = require('os')

module.exports = {
  simpleComponent: ({ componentName, props = [], description = '', composes = [], extra = '' }) => {
    return `
    import React, { Component } from 'react';
    import PropTypes from 'prop-types';
    ${composes.map(compose => `import ${compose} from './src/components/${compose}';`).join(os.EOL)}
    ${description}
    export default class ${componentName} extends Component {
      render() {
        return <div></div>;
      }
    }
    
    ${componentName}.propTypes = {
      ${composes.map(compose => `...${compose}.propTypes`)}${composes.length > 0 ? ',' : ''}${props.map(prop => `${prop.description ? `/**
      * ${prop.description}
      */ ` : ''}
      ${prop.name}: ${!prop.custom ? 'PropTypes.' : ''}${prop.type}${prop.required ? '.isRequired': ''}`)}
    };
    
    ${componentName}.defaultProps = {
      ${props.map(prop => prop.default ? `${prop.name}: ${prop.default}` : '')}
    };
    
    ${extra}`;
  },
  simpleMarkdown: ({ componentName = 'MyComponent', description = '', link = '', types = [], isMissing = false, composes = [] }) => {
    return `## ${componentName}${link}${description}

${types.length > 0 ? `prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
${types.map(type => `**${type.name}** | \`${type.value}\` | ${type.default ? `\`${type.default}\`` : ''} | ${type.required ? ':white_check_mark:' : ':x:'} | ${type.description ? type.description : ''}`).join(os.EOL)}` : 'This component does not have any props.'}
${isMissing ? `*Some or all of the composed components are missing from the list below because a documentation couldn't be generated for them.
See the source code of the component for more information.*` : ''}
${composes.length > 0 ? `${os.EOL}${componentName} gets more \`propTypes\` from these composed components
${composes.map(compose => `#### ${compose.name}

${compose.types.length > 0 ? `prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
${compose.types.map(type => `**${type.name}** | \`${type.value}\` | ${type.default ? `\`${type.default}\`` : ''} | ${type.required ? ':white_check_mark:' : ':x:'} | ${type.description ? type.description : ''}`).join(os.EOL)}` : 'This component does not have any props.'}`
).join(os.EOL + os.EOL)}${os.EOL}` : ''}`;
  }
}
