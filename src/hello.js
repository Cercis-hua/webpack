const msg = "hello";
export default class Hello {
    constructor() {
        this.say = this.say.bind(this);
    }
    say (word) {
        document.write(msg + word);
    }
    ask () {
        document.write("Say Something Please");
        // setTimeout(() => this.say("webpack"), 1000);
    }
}

export function change() {
    document.body.style.background='#dddddd'
}
