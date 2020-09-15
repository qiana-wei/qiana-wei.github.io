console.log("AAAA")
setTimeout(()=>{console.log('BBB')},4000)
let start = new Date()
while(new Date()- start < 1000){}
console.log("CCCC")
while(new Date()- start < 2000){}
console.log("CCCC2")
while(new Date()- start < 3000){}
console.log("CCCC3")
setTimeout(()=>{console.log('DDDD')},800)