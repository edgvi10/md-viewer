import md5 from "locutus/php/strings/md5";

export const isJson = (string) => {
    try {
        if (typeof string === "string") JSON.parse(string);
        else JSON.stringify(string);
        return true;
    } catch (err) {
        return false;
    }
}

export const lf = {
    getItem(key) {
        const data = localStorage.getItem(key);
        if (!data) return null;
        if (isJson(data)) return JSON.parse(data);
        return data;
    },
    setItem(key, value) {
        if (typeof value === "object") value = JSON.stringify(value);
        localStorage.setItem(key, value);
    },
    removeItem(key) {
        localStorage.removeItem(key);
    }
};

export const nameCapitalize = (string) => {
    if (!string) return null;
    const joint = ["de", "da", "do", "das", "dos",];
    var formated_name = "";

    const name = string.split(" ");
    const name_parts = [];
    for (let part of name) name_parts.push((joint.includes(part)) ? part : (part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()))
    formated_name = name_parts.join(" ");
    return formated_name;
}

export const nameFormat = (string, joint) => {
    if (!string) return null;
    joint = ["de", "da", "do", "das", "dos"];
    var formated_name = "";
    const name = string.split(" ");
    const name_parts = [];
    name_parts.push(name[0]);
    if (name.length > 1) {
        name.reverse();
        if (joint.includes(name[1].toLowerCase())) name_parts.push(name[1]);
        name_parts.push(name[0]);
    }
    if (name_parts.length > 1) if (name_parts[0] == name_parts[name_parts.length - 1]) name_parts.pop();
    formated_name = name_parts.join(" ");
    return formated_name.trim();
}

export const normalizeString = (string) => string.toString().replace(/[^a-zA-Z ]+/g, '').replace(/\s+/g, ' ');
export const slugify = (string, separator = "-") => string.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 ]separator/g, '').replace(/\s+/g, separator);

export const validate = {
    cpf: t => { if ("string" != typeof t) return !1; if (11 !== (t = t.replace(/[^\d]+/g, "")).length || t.match(/(\d)\1{10}/)) return !1; const e = (t = t.split("")).filter((t, e, r) => e >= r.length - 2 && t).map(t => +t), r = (e, r) => 10 * (e => t.filter((t, r, n) => r < n.length - e && t).map(t => +t))(r).reduce((t, r, n) => t + r * (e - n), 0) % 11 % 10; return !(r(10, 2) !== e[0] || r(11, 1) !== e[1]) },
    cnpj: t => { if (!t) return !1; const r = "string" == typeof t; if (!(r || Number.isInteger(t) || Array.isArray(t))) return !1; if (r) { if (t.length > 18) return !1; const r = /^\d{14}$/.test(t), e = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(t); if (!r && !e) return !1 } const e = t.toString().match(/\d/g), n = Array.isArray(e) ? e.map(Number) : []; if (14 !== n.length) return !1; if (1 === [...new Set(n)].length) return !1; const s = t => { const r = n.slice(0, t); let e = t - 7, s = 0; for (let n = t; n >= 1; n--) { s += r[t - n] * e--, e < 2 && (e = 9) } const i = 11 - s % 11; return i > 9 ? 0 : i }, i = n.slice(12); return s(12) === i[0] && s(13) === i[1] },
    document: t => { if (!t) return !1; const c = validate.cpf(t), n = validate.cnpj(t); return c || n },
    email: t => { if (!t) return !1; if (-1 == t.indexOf("@")) return !1; const n = t.split("@"); return 2 == n.length && !(n[1].split(".").length < 2) },
    phone: (p) => { if (!p) return !1; p = p.replace(/[^\d]/g, ""); return !(p.length < 8 || p.match(/(\d)\1{7}/)); }
}

export const clean = {
    number: (n) => `${n}`.replace(/[^\d]/g, ""),
    email: e => e.replace(/[^\w\d\@\.]/g, "").toLowerCase(),
    document: d => d.replace(/[^\d]/g, ""),
    phone: (phone) => {
        if (!phone) return null;
        phone = phone.replace(/[^\d]/g, "");
        if (phone.length < 10) return phone;
        if (phone.indexOf("0") == 0) return `${phone.substring(1)}`;
        if (phone.indexOf("55") == 0 && phone.length > 10) return `+${phone}`;
        return `+55${phone}`;
    }
}

export const extractNumbers = (string) => {
    return clean.number(string);
};

export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
}

export const tokenizer = (secret_key) => {
    const secret = md5(secret_key);
    const separator = "::";
    return {
        create: function (data) {
            const encoded_data = isJson(data) ? JSON.stringify(data) : data;

            const token = encoded_data + separator + md5(encoded_data + secret);
            const base64encoded = base64.encode(token, "utf8");
            const reverse = base64encoded.split("").reverse().join("");
            return reverse;
        },
        verify: function (token_string) {
            if (!token_string) return false;
            token_string = token_string.replace("Bearer ", ""); // remove prefix
            token_string = token_string.split("").reverse().join(""); // unreverse

            const decoded = base64.decode(token_string, "utf8"); // decode
            const parts = decoded.split(separator); // split by separator

            const validator = parts.pop(); // get last part
            const encoded_data = parts.join(separator); // get all parts except last

            if (md5(encoded_data + secret) === validator) {
                var data = (parts.length === 1) ? (isJson(parts[0]) ? JSON.parse(parts[0]) : parts[0]) : isJson(parts) ? JSON.parse(parts) : parts;
                try {
                    return JSON.parse(data);
                } catch (e) {
                    return data;
                }
            } else {
                return false;
            }
        }
    }
}

export const paiencrypt = {
    encrypt: (string) => {
        function chr(codePt) {
            if (codePt > 0xFFFF) {
                codePt -= 0x10000;
                return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
            }
            return String.fromCharCode(codePt);
        }

        function ord(string) {
            const str = string + '';
            const code = str.charCodeAt(0);
            if (code >= 0xD800 && code <= 0xDBFF) {
                const hi = code;
                if (str.length === 1) {
                    return code;
                }
                const low = str.charCodeAt(1);
                return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
            }
            if (code >= 0xDC00 && code <= 0xDFFF) {
                return code;
            }
            return code;
        }

        if (!string || string.length === 0) return null;
        var encrypted_password = "";
        for (var i = 0; i < string.length; i++) {
            var ascii = ord(string[i]);
            var ascii_jumped = chr(parseInt(ascii) ^ ((i + 1) * 2));
            if (ascii_jumped != "'") encrypted_password = encrypted_password + ascii_jumped;
        }
        return encrypted_password;
    },
    decrypt: (string) => {
        return paiencrypt.encrypt(string);
    }
}

export const base64 = {
    encode: (string) => {
        if (typeof string === "object") string = JSON.stringify(string);
        var encoded = Buffer.from(string).toString('base64');
        encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
        return encoded;
    },
    decode: (string) => {
        var decoded = Buffer.from(string, 'base64').toString('utf8');
        try {
            return JSON.parse(decoded);
        } catch (e) {
            return decoded;
        }
    }
}

export const ErrorReduce = (error) => {
    const error_info = {};
    error_info.message = error.message;

    const errln = (error.stack + "").split("\n")[1].split(":").reverse();
    const [column, line] = errln.map(item => parseInt(item));

    error.message = `(${line}:${column}) ${error.message}`;

    return new Error(error.message);
}