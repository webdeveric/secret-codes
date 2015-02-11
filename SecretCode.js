(function( window ) {
    "use strict";

    if ( !Number.isInteger ) {
        Number.isInteger = function( val ) {
            return typeof val === "number" &&
                isFinite( val ) &&
                val > -9007199254740992 &&
                val < 9007199254740992 &&
                Math.floor( val ) === val;
        };
    }

    /*
    // IE8 fixes
    if ( !Array.isArray ) {
        Array.isArray = function(arg) {
            "use strict";
            return Object.prototype.toString.call(arg) === "[object Array]";
        };
    }

    if ( !String.prototype.trim ) {
        (function() {
            "use strict";
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
                return this.replace(rtrim, "");
            };
        })();
    }
    */

    function SecretCode( code, callback )
    {
        // Code should be an array of numbers
        this.code = SecretCode.parseCode( code );
        this.callback = callback || SecretCode.defaultCallback;
    }

    SecretCode.defaultCallback = function()
    {
        console.log("Please define a secret code callback.");
    };

    /*
        Aliases can be a single integer, an array of integers, or a string.
        If the alias is a string, it will be parsed like any other code so
        you can use an alias within your alias.
    */
    SecretCode.aliases = {
        "TAB":    9,
        "ENTER": 13,
        "SHIFT": 16,
        "CTRL":  17,
        "ALT":   18,
        "ESC":   27,
        "SPACE": 32,
        "PGUP":  33,
        "PGDN":  34,
        "END":   35,
        "HOME":  36,
        "LEFT":  37,
        "UP":    38,
        "RIGHT": 39,
        "DOWN":  40,
        "INS":   45,
        "DEL":   46,
        "WINL":  91,
        "WINR":  92,
        "TICK": 192,
        "CMD":  224,
        "KONAMI": "up up down down left right left right b a"
    };

    SecretCode.parseCode = function( code )
    {
        if ( !Array.isArray( code ) ) {
            code = code.trim().split(/[,|\s-]+\s*/);
        }

        var i = 0,
            l = code.length,
            code_output = [];

        for ( ; i < l ; ++i ) {

            if ( Number.isInteger( code[ i ] ) ) {
                code_output.push( code[ i ] );
                continue;
            }

            var c = code[ i ].toUpperCase();

            if ( SecretCode.aliases[ c ] !== void 0 ) {

                if ( Number.isInteger( SecretCode.aliases[ c ] ) ) {

                    code_output.push( SecretCode.aliases[ c ] );

                } else {

                    code_output = code_output.concat( SecretCode.parseCode( SecretCode.aliases[ c ] ) );

                }

            } else {

                code_output = code_output.concat( SecretCode.parseChars( c ) );

            }
        }

        return code_output;
    };

    SecretCode.parseChars = function( str )
    {
        if ( str.length === 1 ) {
            return str.charCodeAt(0);
        }

        var chars = str.split(""),
            i = 0,
            l = chars.length;

        for ( ; i < l ; ++i ) {
            chars[ i ] = chars[ i ].charCodeAt(0);
        }

        return chars;
    };

    SecretCode.prototype.size = function()
    {
        return this.code.length;
    };

    SecretCode.prototype.run = function()
    {
        return this.callback.apply( this.callback, arguments );
    };

    SecretCode.prototype.check = function( buffer )
    {
        if ( buffer.length >= this.code.length ) {
            var code = buffer.slice( buffer.length - this.code.length ),
                i    = 0,
                l    = code.length;

            for ( ; i < l ; ++i ) {
                if ( code[ i ] !== this.code[ i ] ) {
                    return false;
                }
            }

            return true;
        }

        return false;
    };

    SecretCode.prototype.valueOf = function()
    {
        return this.code;
    };

    SecretCode.prototype.toString = function()
    {
        return this.code.map( function( charCode ) {
            return String.fromCharCode( charCode );
        }).join("");
    };

    if ( typeof define === "function" && define.amd ) {

        define( [], function() {
            return SecretCode;
        });

    } else if ( typeof module !== "undefined" && module.exports ) {

        module.exports = SecretCode;

    } else {

        window.SecretCode = SecretCode;

    }

}( window ));
