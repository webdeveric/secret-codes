(function( root, name, factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        define( [ "SecretCode" ], factory );

    } else if ( typeof module !== "undefined" && module.exports ) {

        module.exports = factory( require("SecretCode") );

    } else {

        if ( root.SecretCode !== void 0 ) {
            root[ name ] = factory( root.SecretCode );
        } else {
            console.warn("Please load SecretCode first.");
        }

    }

}( this, "SecretCodeManager", function( SecretCode ) {
    "use strict";

    function SecretCodeManager()
    {
        this.codes  = [];
        this.buffer = [];
        this.timer  = null;
        this.delay  = 250;
        this.maxCodeLength = 0;
        this.listen();
    }

    SecretCodeManager.prototype.listen = function()
    {
        // Standards compliant only. Don't waste time on IE8.
        if ( document.addEventListener !== void 0 ) {
            document.addEventListener( "keydown", this, false );
            document.addEventListener( "keyup", this, false );
        }

        return this;
    };

    SecretCodeManager.prototype.stopListening = function()
    {
        if ( document.addEventListener !== void 0 ) {
            document.removeEventListener( "keydown", this, false );
            document.removeEventListener( "keyup", this, false );
        }

        return this;
    };

    SecretCodeManager.prototype.handleEvent = function( e )
    {
        /*
            This prevents find as you type in Firefox.
            Only prevent default behavior for letters A-Z.
            I want keys like page up/down to still work.
        */
        if ( e.type === "keydown" && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey ) {

            var tag = e.target.tagName,
                keyCode = e.which;

            if ( ( tag === "HTML" || tag === "BODY" ) && keyCode >= 65 && keyCode <= 90 ) {
                e.preventDefault();
                return;
            }
        }

        if ( e.type === "keyup" && this.codes.length > 0 ) {

            var self = this;

            this.buffer.push( e.which );

            clearTimeout( this.timer );

            this.timer = setTimeout( function() {
                self.checkBuffer();
            }, this.delay );
        }
    };

    SecretCodeManager.prototype.checkBuffer = function()
    {
        if ( this.buffer.length > this.maxCodeLength ) {
            this.buffer = this.buffer.slice( this.buffer.length - this.maxCodeLength );
        }

        var i = 0,
            l = this.codes.length;

        for ( ; i < l ; ++i ) {
            if ( this.codes[ i ].check( this.buffer ) ) {
                this.codes[ i ].run( this.codes[ i ], this );
                this.buffer = [];
                return;
            }
        }
    };

    SecretCodeManager.prototype.add = function( code, callback )
    {
        if ( !(code instanceof SecretCode) ) {
            code = new SecretCode( code, callback );
        }

        this.codes.push( code );

        this.maxCodeLength = Math.max( this.maxCodeLength, code.size() );

        this.codes.sort( function( c1, c2 ) {
            if ( c1.size() == c2.size() ) {
                return 0;
            }
            return c1.size() < c2.size() ? -1 : 1;
        } );

        return this;
    };

    SecretCodeManager.prototype.konami = function( callback ) {
        return this.add("KONAMI", callback );
    };

    SecretCodeManager.prototype.remove = function( code )
    {
        if ( !(code instanceof SecretCode) ) {
            return false;
        }

        var i = 0,
            l = this.codes.length;

        for ( ; i < l ; ++i ) {
            if ( this.codes[ i ] === code ) {
                this.codes.splice( i, 1 );
                break;
            }
        }

        this.findMaxCodeLength();

        return false;
    };

    SecretCodeManager.prototype.findMaxCodeLength = function()
    {
        var i = 0,
            l = this.codes.length;

        this.maxCodeLength = 0;

        for ( ; i < l ; ++i ) {
            this.maxCodeLength = Math.max( this.maxCodeLength, this.codes[ i ].size() );
        }

        return this.maxCodeLength;
    };

    return SecretCodeManager;

} ) );
