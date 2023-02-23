const socket = io("http://localhost:2000");

const messageInput = document.querySelector(".message");
const messageBox = document.querySelector(".msgBox");
const sendBtn = document.querySelector(".sendBtn");

const myName= prompt("enter your name","Name")

socket.on("sendMsg",(data)=>{
    // document.querySelector(".textline").innerHTML=data
    const line= document.createElement("p")
       line.innerHTML=data
       messageBox.append(line)
})

const fn = () => {
  const inputData = messageInput.value;
  console.log(inputData);

  let output=`${myName}: ${inputData}`
  socket.emit("sendMessage", output);
  // const line= document.createElement("p").innerHTML(`${name}:${inputData}`)
  // messageBox.append(line)
};

sendBtn.addEventListener("click", fn);

const sendBtnClick = () => {
  console.log("working");
};
