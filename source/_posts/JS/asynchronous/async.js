console.log(1)
setTimeout(()=>{console.log(2)},1000)
let start = new Date()
while(new Date() - start < 3000){}
console.log(4)
setTimeout(()=>{
    new Promise((reslove,reject)=>{
        console.log(5)
        reslove()
        console.log(6)
    }).then(()=>{
        console.log(7)
        return new Promise((reslove)=>{
            console.log(8)
            reslove()
        })
    }).then(()=>{
        console.log(9)
    })
},0)
new Promise(()=>{
    console.log(10)
    foo.bar()
}).then(()=>{
    console.log(11)
}).then(()=>{
    console.log(12)
}).catch(()=>{
    console.log(13)
})

console.log(14)






//1,4,10,14,13,2,5,6,7,8,9