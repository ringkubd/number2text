let lt20 = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen" ],
    tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety" ],
    scales = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion" ],
    max = scales.length * 3;

function convert(val) {
    let len;

    // special cases
    if (val[0] === "-") { return "negative " + convert(val.slice(1)); }
    if (val === "0") { return "zero"; }

    val = trim_zeros(val);
    len = val.length;

    // general cases
    if (len < max) { return convert_lt_max(val); }
    if (len >= max) { return convert_max(val); }
}

function convert_max(val) {
    return split_rl(val, max)
        .map(function (val, i, arr) {
            if (i < arr.length - 1) {
                return convert_lt_max(val) + " " + scales.slice(-1);
            }
            return convert_lt_max(val);
        })
        .join(" ");
}

function convert_lt_max(val) {
    let l = val.length;
    if (l < 4) {
        return convert_lt1000(val).trim();
    } else {
        return split_rl(val, 3)
            .map(convert_lt1000)
            .reverse()
            .map(with_scale)
            .reverse()
            .join(" ")
            .trim();
    }
}

function convert_lt1000(val) {
    let rem, l;

    val = trim_zeros(val);
    l = val.length;

    if (l === 0) { return ""; }
    if (l < 3) { return convert_lt100(val); }
    if (l === 3) { //less than 1000
        rem = val.slice(1);
        if (rem) {
            return lt20[val[0]] + " hundred " + convert_lt1000(rem);
        } else {
            return lt20[val[0]] + " hundred";
        }
    }
}

function convert_lt100(val) {
    if (is_lt20(val)) { // less than 20
        return lt20[val];
    } else if (val[1] === "0") {
        return tens[val[0]];
    } else {
        return tens[val[0]] + "-" +  lt20[val[1]];
    }
}


function split_rl(str, n) {
    // takes a string 'str' and an integer 'n'. Splits 'str' into
    // groups of 'n' chars and returns the result as an array. Works
    // from right to left.
    if (str) {
        return Array.prototype.concat
            .apply(split_rl(str.slice(0, (-n)), n), [str.slice(-n)]);
    } else {
        return [];
    }
}

function with_scale(str, i) {
    let scale;
    if (str && i > (-1)) {
        scale = scales[i];
        if (scale !== undefined) {
            return str.trim() + " " + scale;
        } else {
            return convert(str.trim());
        }
    } else {
        return "";
    }
}

function trim_zeros(val) {
    return val
    return val.replace(/^0*/, "");
}

function is_lt20(val) {
    return parseInt(val, 10) < 20;
}

export {
    convert
}
