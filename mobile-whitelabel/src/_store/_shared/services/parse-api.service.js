export const parseJsonFields = (fields = [], obj) => {
  const parsedObj = {};
  for (const field of fields) {
    if (typeof obj[field] === 'string') {
      parsedObj[field] = JSON.parse(obj[field]);
    }
  }
  return parsedObj;
};
