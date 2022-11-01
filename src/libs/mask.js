export default function Masked(value) {
    const formats = {};

    this.value = value;

    const mask = function (pattern, limit_maxlenth, reverse) {
        if (!this.value) return null;
        var value = this.value;
        var pattern, length = (pattern = pattern.split("")).length, string = value.split(""), j = 0, h = "";

        if (reverse) string = string.reverse();

        for (var i = -1; ++i < length;) {
            if (pattern[i] != "#") {
                if (pattern[i] == "\\" && (h += pattern[++i])) continue;
                h += pattern[i];
                i + 1 == length && (string[j - 1] += h, h = "");
            } else {
                if (!string[j] && !(h = "")) break;
                (string[j] = h + string[j++]) && (h = "");
            }
        }

        if (reverse) string = string.reverse();

        var masked = string.join("") + h;
        if (limit_maxlenth) masked = masked.substring(0, pattern.length);
        return masked;
    }

    formats.toDate = (pattern, translate) => { // Masked(value).toDate("dd/mm/yyyy", -3);
        // console.log({ value: this.value, pattern, translate });
        if (!this.value) return null;

        var datetime;
        if (pattern == undefined) pattern = "DD/MM/YYYY";
        else pattern = pattern.toString();

        if (this.value instanceof Date) datetime = this.value.toISOString();
        else datetime = this.value.toString().replace(" ", "T");

        var [date, time] = datetime.split("T");

        if (translate) {
            var dateNow = new Date(date);
            date = new Date(dateNow.getTime() + translate * 86400000);
            date = date.toISOString().split("T")[0];
        }

        if (pattern === "Y-m-d") {
            date = `${date}`;
        } else if (pattern === "DD/MM/YYYY") {
            if (date.indexOf("-") > -1) date = date.split("-").reverse().join("/");
            return `${date}`;
        } else if (pattern === "DD/MM/YY") {
        } else {
            return false;
        }
    }

    formats.toNumber = (fixed, separator = ",") => {
        var masked = "";
        if (!value) return null;
        if (typeof value === "number") value = parseFloat(value);
        if (typeof value === "string") {
            value = value.replace(/[,]+/g, ".").replace(/[^0-9\.]+/g, "");
            value = parseFloat(value)
        }
        if (value === null || value === undefined) return null;
        if (value === 0) return "0";
        if (fixed) value = parseFloat(value).toFixed(fixed);
        var negative = (value < 0) ? "-" : "";

        var [integer, decimal] = value.toString().split(".");
        var integer = integer.split("").reverse().join("");
        var integerMask = mask("###.###.###.###", true);
        integerMask = integerMask.split("").reverse().join("");
        masked = (negative) + integerMask + (decimal ? separator + decimal : "");

        return masked;
    }

    formats.toPrice = () => {
        return formats.toNumber(2, ",");
    }

    formats.toPhone = (params) => {
        if (!value) return null;

        value = value.toString();
        if (value.length < 10) return value;

        var phone_number = value;
        var pattern = "(##) ####-####";
        if (phone_number.length >= 11) pattern = "(##) #####-####";

        return mask(pattern, true);
    }

    formats.toDocument = (params) => {
        if (!this.value) return null;
        this.value = this.value.toString();
        this.value = this.value.replace(/[^0-9]+/g, "");

        console.log(this.value);

        var pattern = "###.###.###-##";
        if (this.value.length > 11) pattern = "##.###.###/####-##";

        return mask(pattern, true);
    }

    return {
        mask,
        ...formats
    }
}

