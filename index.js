import './index.css'
import Hello from './src/hello.js'

import {change} from './src/hello'

new Hello().ask()

change()
require('./src/b')()

require.ensure([],function (require) {
    const dom = require('./src/a.js');
    dom('#root').innerHTML = 'hello world';
})


class Person {
    constructor(age,name){
        this.age = age;
        this.name = name;
    }
    dance(){
        console.log( this.age+this.name+' I can Dancel' )
    }
}

let p = new Person(25, 'dskl')
p.dance()
