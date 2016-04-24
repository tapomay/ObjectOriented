Functional Specification Generator


# MDJParser

MDJ file parser for generating functional requirements document from use case diagrams.

## Usage

1. Load the file SpecTemplate.html in a browser.
2. Select MDJ file in HTML.
Please make sure that the diagram image is present in the same folder. It's name should match the StarUML UseCase diagram.

Information extracted from the MDJ is displayed using a different font. Although the font looks informal, I have kept it to differentiate from static text.

I am using the same format and CSS styles as provided in the sample specification at http://cs.sjsu.edu/faculty/pearce/modules//lectures/ooa/requirements/funSpec.htm

## Developing

CODE STRUCTURE:
All the code is modularized into four files:

Parser.js: Main logic. More of a controller.
funcpec_models.js: Contains functions that encapsulate each of UMLModel, UMLUseCase, UMLActor, UMLAssociation and UMLInclude
tools_mod.js: Added a function collectElementsMod() to tools.js. Rest of it is the same. The new function takes as array of types and returns a map.
view.js: This contains all the code to update HTML elements in the DOM using data from model objects of funcspec_models.
 
FLOW:
The entry point is in Parser.js. 
The file selector invokes bootstrap() method defined in SpecTemplate.html.
bootstrap() calls parser.mainHandler(). 


### Tools

1. Using browserify to package node.js modules:
browserify Parser.js --s parser -o bundle.js
The Parser.js module is accessible from the scripts in the HTML as the object "parser".

2. Using JQuery templates to render each individual use-case. The templates are declared in HTML using script tags of type "text/x-jquery-tmpl".

3. 

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
