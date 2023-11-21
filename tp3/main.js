import { App } from './App.js';
import { GuiInterface } from './GuiInterface.js';
import { Contents } from './Contents.js';

// create the application object
let app = new App()
// initializes the application
app.init()

// create the contents object
let contents = new Contents(app)
// initializes the contents
contents.init()
// hooks the contents object in the application object
app.setContents(contents);

// create the gui interface object
let gui = new GuiInterface(app)
// set the contents object in the gui interface object
gui.setContents(contents)

// we call the gui interface init 
// after contents were created because
// interface elements may control contents items
gui.init();

// main animation loop - calls every 50-60 ms.
app.render()
