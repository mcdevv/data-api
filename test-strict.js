// strict mode makes the arguments variable a local copy within the function 
// non-strict mode, param and arguments[0] are referencing the same value
function test(param) {
  // console.log(`${param} -- ${arguments[0]}`);
  arguments[0] = 2;
  if (param === arguments[0]) console.log('non-strict mode');
  else console.log('strict mode');
  // console.log(`${param} -- ${arguments[0]}`);
}

test(1);
