(function( window, document ) {
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
    };

    SecretCodeManager.prototype.stopListening = function()
    {
        if ( document.addEventListener !== void 0 ) {
            document.removeEventListener( "keydown", this, false );
            document.removeEventListener( "keyup", this, false );
        }
    };

    SecretCodeManager.prototype.handleEvent = function( e )
    {
        // This prevents find as you type in Firefox.
        if ( e.type === "keydown" ) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if ( this.codes.length ) {

            console.log( e.which );

            this.buffer.push( e.which );

            var self = this;

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

    if( typeof define === "function" && define.amd ) {

        define( [ "SecretCode" ], function () {
            return SecretCodeManager;
        });

    } else if ( typeof module !== "undefined" && module.exports ) {

        module.exports = SecretCodeManager;

    } else {

        window.SecretCodeManager = SecretCodeManager;

    }

}( window, document ));
