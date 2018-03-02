module.exports = (obj) => {
  return (obj.type && typeof obj.type.name === 'string') ? obj.type : (typeof obj.name === 'string') ? obj : undefined;
};
