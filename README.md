# Secret Codes

Really simple easter eggs.

**Demo** http://webdeveric.github.io/secret-codes/

## Load the scripts

```html
<script src="SecretCode.js"></script>
<script src="SecretCodeManager.js"></script>
```

These scripts can also be loaded with RequireJS, if you're into that kind of thing.

## Example usage

```js
var manager = new SecretCodeManager();

manager.add( "KONAMI", function( code, manager ) {
    console.log("Konami code called!");
} );

// Since the Konami code is popular, I've added a shortcut method.
manager.konami( function( code, manager ) {
    console.log("Konami code called!");
} );

manager.add( "yourcodehere", function( code, manager ) {
    // Do something here
} );
```

A code can be a string or an array of keyCodes. I recommend using strings since you can use aliases within them. 


## Aliases

I have provided some aliases so you don't have to know the keyCodes to keys like the up or down arrows.
Aliases usually are just Sting key = Int value, but they are more flexible than that.
You can put an alias inside another alias and it will recursively parse it to get the keyCodes it needs to look for.

For example, the Konami code alias is defined like this:

```js
"KONAMI": "up up down down left right left right b a"
```
