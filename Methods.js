export function NewArray(length, value) {
    var array = new Array(length);

    for(var i = 0; i < length; ++i) {
        array[i] = value;
    }

    return array;
}

export function ArrayFill(array, value) {
    for(var i = 0; i < array.length; ++i) {
        array[i] = value;
    }
}

export function ArrayCopy(array, length, value) {
    var copy = array.slice(0, length);

    while(copy.length < length) {
        copy.push(value);
    }

    return copy;
}