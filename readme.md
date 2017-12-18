Gimme:

`tcdh quaternaryFn "a$any#b$any#c$any#d$any~boolean"`

and I'll give you:

```
function quaternaryFn(a: any, b: any, c: any, d: any): boolean
function quaternaryFn(a: any): (b: any, c: any, d: any) => boolean
function quaternaryFn(a: any, b: any): (c: any, d: any) => boolean
function quaternaryFn(a: any, b: any, c: any): (d: any) => boolean
```

`tcdh --export --generic quaternaryFn --return boolean`

```
export function quaternaryFn<A, B, C, D>(a: A, b: B, c: C, d: D): boolean
export function quaternaryFn<A, B, C, D>(a: A): (b: B, c: C, d: D) => boolean
export function quaternaryFn<A, B, C, D>(a: A, b: B): (c: C, d: D) => boolean
export function quaternaryFn<A, B, C, D>(a: A, b: B, c: C): (d: D) => boolean
```

`tcdh --defs definitions.json --export binaryFn --return boolean "a$ReferencedFunction#b$OtherFunction"`

```
interface ReferencedFunction { [...] }
interface OtherFunction { [...] }
function binaryFn(a: ReferencedFunction, b: OtherFunction): boolean
function binaryFn(a: ReferencedFunction): (b: OtherFunction) => boolean
```
