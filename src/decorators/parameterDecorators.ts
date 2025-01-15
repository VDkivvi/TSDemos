import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

class BugReport2 {
    type = "report";
    title: string;

    constructor(t: string) {
        this.title = t;
    }

    print(@required verbose: boolean) {
        if (verbose) {
            return `type: ${this.type}\ntitle: ${this.title}`;
        } else {
            return this.title;
        }
    }

    @applyParameterDecorators
    printJson(@stringToJson stringtoJson: string) {
        return stringtoJson;
    }
}

function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    console.log("This is required decorator")
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

function stringToJson(target: any, propertyKey: string | symbol, parameterIndex: number) {
    console.log("This is stringToJson decorator")
    const existingMetadata = Reflect.getOwnMetadata("stringToJson", target, propertyKey) || [];
    existingMetadata.push(parameterIndex);
    Reflect.defineMetadata("stringToJson", existingMetadata, target, propertyKey);
}

function applyParameterDecorators(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("This is applyParameterDecorators decorator")
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const jsonParams: number[] = Reflect.getOwnMetadata("stringToJson", target, propertyKey) || [];
        for (const index of jsonParams) {
            if (typeof args[index] === "string") {
                try {
                    args[index] = JSON.parse(args[index]);
                } catch {
                    throw new Error(`Parameter at index ${index} is not valid JSON: "${args[index]}"`);
                }
            }
        }
        return originalMethod.apply(this, args);
    };
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>): any {
    let method = descriptor.value!;

    descriptor.value = function () {
        let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        if (requiredParameters) {
            for (let parameterIndex of requiredParameters) {
                if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                    throw new Error("Missing required argument.");
                }
            }
        }
        return method.apply(this, arguments);
    };
}


// Retrieve and log all metadata keys and values for the 'property' in Example class
const metadataKeys = Reflect.getMetadataKeys(BugReport2.prototype, "method");
console.log(metadataKeys);
metadataKeys.forEach(key => {
    const metadataValue = Reflect.getMetadata(key, BugReport2.prototype, "method");
    console.log(`Key: ${key}, Value: ${metadataValue}`);
});


// Usage Example
const data = new BugReport2("something");
console.log(data.printJson("{ \"json\" : 4 }"));
