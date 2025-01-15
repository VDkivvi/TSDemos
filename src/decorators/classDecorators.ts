@reportableClassDecorator
@sealed
@freeze
class BugReport {
    type = "report";
    title: string;

    constructor(t: string) {
        this.title = t;
    }

    greet() {
        return "Hello, " + this.title;
    }
}

function freeze(constructor: Function) {
    console.log("This is sealed decorator");
    Object.freeze(constructor);
    Object.freeze(constructor.prototype);

    //Person.prototype.sayHello
    /*
    The constructor.prototype is simply the prototype object of the constructor function. 
    Every constructor function (or class in ES6+) has a prototype property, which is an object 
    where you can define methods or properties that will be shared by instances created using that constructor.
    */
}


function sealed(constructor: Function) {
    console.log("This is sealed decorator");
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

type TTT = Function;
type TTT2 = () => string;

function reportableClassDecorator<T extends { new(...args: any[]): {} }>(constructor: T) { //WHAT IS THIS!!!   //unknown vs any
    console.log("This is reportableClassDecorator decorator");
    return class extends constructor {
        reportingURL = "http://www...";
    };
}


const bug = new BugReport("Needs dark mode");
console.log(bug.title);
console.log()
console.log(bug.type);
