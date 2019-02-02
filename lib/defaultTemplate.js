
const os = require('os');
const { template, type } = require('react-docgen-renderer-template');

const generatePropsTable = (props, getType) => {
  const entries = Object.entries(props);
  if (entries.length === 0) return 'This component does not have any props.';

  let propsTableHeader = `prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
`;
  return propsTableHeader + entries.map(([propName, propValue]) => `**${propName}** | \`${getType(propValue.type)}\` | ${propValue.defaultValue ? `\`${propValue.defaultValue}\`` : '' } | ${propValue.required ? ':white_check_mark:' : ':x:' } | ${propValue.description ? propValue.description : ''}`).join(os.EOL);
};

const templateCreator = template({
  unknown: 'Unknown',
  func: 'Function',
  array: 'Array',
  object: 'Object',
  string: 'String',
  number: 'Number',
  bool: 'Boolean',
  node: 'ReactNode',
  element: 'ReactElement',
  symbol: 'Symbol',
  any: '*',
  custom: '(custom validator)',
  shape: 'Shape',
  arrayOf: type`Array[]<${({ context, getType }) => getType(context.type.value) }>`,
  objectOf: type`Object[#]<${({ context, getType }) => getType(context.type.value) }>`,
  instanceOf: type`${({ context }) => context.type.value}`,
  enum: type`Enum(${({ context, getType }) => context.type.value.map(value => getType(value)).join(', ')})`,
  union: type`Union<${({ context, getType }) => context.type.value.map(value => getType(value)).join('\\|')}>`
});

const templateObject = templateCreator`## ${({ context }) => context.componentName}${({ context }) => {
  let headerValue = '';
  if (context.srcLinkUrl) {
    headerValue = `${os.EOL}From [\`${context.srcLink}\`](${context.srcLinkUrl})`;
  }

  if (context.description) {
    headerValue += os.EOL + os.EOL + context.description;
  }

  headerValue += os.EOL;
  
  return headerValue;
}}
${({ context, getType }) => generatePropsTable(context.props, getType)}
${({ context }) => context.isMissingComposes
? `*Some or all of the composed components are missing from the list below because a documentation couldn't be generated for them.
See the source code of the component for more information.*`
: ''}${({ context, getType }) => context.composes.length > 0
? `

${context.componentName} gets more \`propTypes\` from these composed components
${context.composes.map(component => 
  `#### ${component.componentName}

${generatePropsTable(component.props, getType)}`
).join(os.EOL + os.EOL)}`
: '' }
`;

module.exports = templateObject;
