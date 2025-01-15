class BugReportTwo {
    type = "report";
    title: string;

    constructor(t: string) {
        this.title = t;
    }

    @enumerable(false)
    greet(name: string) {
        console.log("This is greet() method")
        return "Hello, " + name;
    }

    @enumerable(true)
    @uppercaseArgument
    greet2(name: string) {
        console.log("This is greet2() method")
        return "Hello, " + name;
    }
}

function enumerable(value: boolean) {
    console.log("This is enumerable decorator");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

function uppercaseArgument(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    console.log(`propertyKey ${propertyKey}`);
    descriptor.value = function (...args: any[]) {
        console.log("This is uppercaseArgument decorator")
        const modifiedArgs = args.map(arg =>
            typeof arg === 'string' ? arg.toUpperCase() : arg
        );
        return originalMethod.apply(this, modifiedArgs);
    };
}

function listMethods(target: any) {
    const methods = Object.getOwnPropertyNames(target.prototype)
        .filter(prop => typeof target.prototype[prop] === 'function');
    return methods;
}


console.log(listMethods(BugReportTwo))
const bug2 = new BugReportTwo("BugReportTwo title");
console.log(bug2.greet("John"));
console.log(bug2.greet2("John"));