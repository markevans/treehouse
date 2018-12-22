export default obj => Array.isArray(obj) ? obj.slice() : {...obj}
