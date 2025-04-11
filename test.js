let x="asd asfa sfa sfas fas f   asf as fa f as fas"
let ans=x.trim().replaceAll(/\s+/g, ' ')
ans=ans.replaceAll(' ',"%20")

console.log(ans);

