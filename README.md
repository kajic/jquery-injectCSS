jquery-injectCSS
================

Allows for injection of CSS defined as javascript JSS objects. 

Based on JSS (http://jss-lang.org/).

### Usage

Inject a rule that sets the hight of the #test element:

```javascript
$.injectCSS({
    "#test": {
        height: 123
    }
});
```

Advanced example:

```javascript
$.injectCSS({
    "#main": {
        ...              // general #main style properties
        a: {
            ...          // styles for links inside #main
            "&:hover":{
                ...      // what happens on mouse over in #main links?
                img:{...}

            },

            "&.selected":{...}

        },
        img: {...}
    }
});
```

See http://jss-lang.org/ for further documenation on the JSS language.

### Options
**containerName** (default="injectCSSContainer"): The id of the style element that will hold the new css.

**truncateFirst** (default=false): Clear all previously set styles in containerName.

**media** (default="all"): Media type.

### License
jquery-injectCSS is free software, and may be redistributed under the MIT-LICENSE.
