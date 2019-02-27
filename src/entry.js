global.THREE = require('three')
let OBJLoader = require('three-obj-loader');
OBJLoader(THREE);
global.OIMO = require('oimo')
import App from './app'

let app = new App()