/// Create a new array and prefill
/// with an initial value.
/// @param array The desired array length.
/// @param value The value to be assigned.
/// @returns A new array filled with initial values
export function NewArray(length, value) {
    var array = new Array(length);

    for(var i = 0; i < length; ++i) {
        array[i] = value;
    }

    return array;
}

/// Fill an array with a given value.
/// @param array The array to be filled.
/// @param value The value to be assigned.
/// @returns The given array, filled with value
export function ArrayFill(array, value) {
    for(var i = 0; i < array.length; ++i) {
        array[i] = value;
    }
}

/// Copy an array to a certain length. If the source
/// array is shorter, the copy is padded with a given 
/// value.
/// @param array The array to be copied.
/// @param length Length of the resulting copy.
/// @param value The to be repeated padding value.
/// @returns A copy whose length is as specified.
export function ArrayCopy(array, length, value) {
    var copy = array.slice(0, length);

    while(copy.length < length) {
        copy.push(value);
    }

    return copy;
}