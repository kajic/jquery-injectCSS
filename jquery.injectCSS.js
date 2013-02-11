/*
 * jquery.injectCSS.js - jquery css injection plugin
 * Copyright (C) 2013, Robert Kajic (robert@kajic.com)
 * http://kajic.com
 *
 * Allows for injection of CSS defined as javascript JSS objects. 
 *
 * Based on JSS (http://jss-lang.org/).
 *
 * Licensed under the MIT License.
 *
 * Date: 2013-01-08
 * Version: 0.1
 */

(function ($, undefined) {
    
function toCSS(jss) {    
    var result = {};
    
    if(typeof(jss)=="string"){
        // evaluate the JSS object: 
        try{
            eval("var jss = {" + jss +"}");
        }
        catch(e){       
            console.log(e);
            return "/*\nUnable to parse JSS: " + e + "\n*/"
        }
    }
    
    json_to_css("", jss);
    
    // output result:   
    var ret="";
    for(var a in result){
        var css = result[a];
        ret += a + " {\n"
        for(var i in css){
            var values = css[i];    // this is an array !
            for(var j=0; j<values.length; j++) 
                ret += "\t" + i + ": " + values[j] + ";\n"
        } 
        ret += "}\n"
    }
    return ret;
    
    // --------------   
    
    function json_to_css(scope, css){
        if(scope && !result[scope])
            result[scope]={};
        for(var property in css){
            var value = css[property];
            if(value instanceof Array){
                var values = value;
                for(var i=0; i<values.length; i++)
                    addProperty(scope, property, values[i]);
            }
            else switch(typeof(value)){
            case "number":
            case "string":
                addProperty(scope, property, value);
                break;      
            case "object":
                var endChar = property.charAt(property.length-1);
                if(scope && (endChar=="_" || endChar=="-")){
                    var variants = value;
                    for(var i in variants){
                        // i may be a comma separted list
                        var list = i.split(/\s*,\s*/);
                        for(var j=0; j<list.length; j++){
                            var value = variants[i];
                            if(value instanceof Array){
                                var values = value;
                                for(var k=0; k<values.length; k++)
                                    addProperty(scope, property+list[j], values[k]);
                            }
                            else addProperty(scope, property+list[j], variants[i]);
                        }
                    }
                }
                else json_to_css(makeSelectorName(scope, property), value);
                break;
            default: 
                console.log("ignoring unknown type " + typeof(value) + " in property " + property);
            }
        }
    }
    
    function makePropertyName(n){
        return n.replace(/_/g, "-");
    }
    
    function makeSelectorName(scope, name){
        var snames = [];
        var names = name.split(/\s*,\s*/);
        var scopes = scope.split(/\s*,\s*/);
        for(var s=0; s<scopes.length; s++){
            var scope = scopes[s];
            for(var i=0; i<names.length; i++){
                var name = names[i];
                if(name.charAt(0)=="&")
                    snames.push(scope+name.substr(1))
                else snames.push(scope ? scope+" "+name : name)
            }
        }
        return snames.join(", ");
    }
    
    function addProperty(scope, property, value){       

        if(typeof(value)=="number")
            value = value+"px";
        
        var properties = property.split(/\s*,\s*/);
        for(var i=0; i<properties.length; i++){
            var property = makePropertyName(properties[i])
            
            if(result[scope][property])         
                result[scope][property].push(value);
            else result[scope][property]=[value];               
        }
    }
};

var defaults = {
    truncateFirst: false,
    containerName: "injectCSSContainer"
};

$.injectCSS = function(jss, options) {
    options = $.extend({}, defaults, options);

    options.media = options.media || 'screen';

    var container = $("#"+options.containerName);
    if (!container.length) {
        container = $("<style id='"+options.containerName+"' media='"+options.media+"'>").appendTo("head");
    }

    var css = "";
    if (!options.truncateFirst) {
        css += container.text();
    }
    css += toCSS(jss);
    container.text(css);
    return container;
};
})( jQuery, window, document );
