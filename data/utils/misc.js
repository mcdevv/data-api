// divide an array into an array of arrays, each of length n
export function arrayToGroupsOf(arr, itemsPerGroup) {
  return Array.from(
    // eslint no-array-constructor disabled because intentionally making a sparse array
    // eslint-disable-next-line no-array-constructor
    Array(Math.ceil(arr.length / itemsPerGroup)),
    (_, i) => arr.slice(i * itemsPerGroup, i * itemsPerGroup + itemsPerGroup)
  );
}
