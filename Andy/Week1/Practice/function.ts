function add(a: number, b: number) {
  return a + b;
}

type GreetFunction = (a: string) => void;

function greeter(fn: GreetFunction) {
  fn("Hello, World!");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);

// Arrow function
const getFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
}

const fullName = getFullName("John", "Doe");
console.log(fullName);
