import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { App } from './App.js';
import { Contents } from './Contents.js';

/**
    This class customizes the gui interface for the app
*/
class GuiInterface  {

    /**
     * 
     * @param {App} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {Contents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
    }
}

export { GuiInterface };