import {Vec3} from '../vendor/ogl/src/math/Vec3.js';

self.updateValue = () => {

    self.data += 10.0;
    console.log('updated')

}


self.onmessage = e => {

    console.log(e);
    self.data = e.data[0];
    console.log('worker recieved');
    console.log(Vec3);
    updateValue();    
    postMessage(self.data);

}