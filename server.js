const app=require("./app")

const dotenv=require("dotenv")
const DB=require("./config/db")

const {Server}=require('socket.io')

process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down the server on unhandled rejection")
    process.exit(1);
})


dotenv.config({path:"config/config.env"})

// connecting to databse
DB();

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is waiting on http://localhost:${process.env.PORT}`)
})
const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
let adminsAndsubAdmins=[]
let adminData;
let customers={

}
let waitingCustomer=[]
let onlineEmployees={}




  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on("new-connection",(person)=>{
      console.log(
        person,"in person connection"
      )
      if(person.role=="admin"){
        console.log("in this")
        adminData=person
        adminsAndsubAdmins.push(person);
      }
      else if( person.role=="subadmin"){
          console.log(adminsAndsubAdmins)
            adminsAndsubAdmins.push(person);
            console.log(waitingCustomer)
            io.to(person.socketId).emit("waiting-customer",waitingCustomer);
        }
        else if(person.role=="customer"){
          console.log(person)
          console.log("joining room for cuistomer ",person.roomId)
          socket.join(person.roomId)
        }
      else if(person.role=="employee"){
        onlineEmployees[person.userId]=person.socketId;
      console.log("online employee  ",onlineEmployees)

      }
        console.log("current admuins ",adminsAndsubAdmins)
    })
    socket.on("join-room:employee",({roomId})=>{
      socket.join(roomId);
      console.log("employee has jonied the room ",roomId);

    })
    // sending request to admin 
    socket.on("send-request:admin:subadmin",(data)=>{
      console.log("request from customer",adminsAndsubAdmins)
      socket.join(data.customerId)
        if(adminsAndsubAdmins.length==0){
          console.log("customer will be added in waiting customer ")
          waitingCustomer.push(data)
        }

        adminsAndsubAdmins.forEach((person)=>{
          io.to(person.socketId).emit("new-request:customer",data);
        })
    })
    socket.on("send-msg",(data)=>{
    const clientsInRoom = io.sockets.adapter.rooms.get(data.roomId);

    if (clientsInRoom) {
      const clientIds = Array.from(clientsInRoom);
      if(adminData){
        
        console.log("")
      clientIds.push(adminData.socketId)
      }
    console.log("we have clicnet of ",data.roomId, "clicents ",clientIds)

      clientIds.forEach(ids=>{
        if(socket.id!=ids)
          {
            console.log(ids)
          io.to(ids).emit("receive-msg",data);
          
          }
      })

      
      
    }

    })
    socket.on("transfer:employee",(person)=>{
      console.log("transfering ")
      console.log(person.userId)
      if(onlineEmployees[person.userId]){
        console.log("transfering customer to online employee ",person.userId)
        io.to(onlineEmployees[person.userId]).emit("newCustomer:employee",{check:true})

      }

    })
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Remove the client from the clients array
      adminsAndsubAdmins = adminsAndsubAdmins.filter(client => client.socketId !== socket.id);
      for (let key in onlineEmployees) {
        if (onlineEmployees[key] === socket.id) {
          delete onlineEmployees[key];
        }
      }
      console.log("online employee after disconnected ",onlineEmployees)
      if(socket.id == adminData?.socketId){
        adminData=null;
      }
      console.log('Updated clients:', adminsAndsubAdmins);
    });
});


process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down the server on unhandled rejection")
    server.close(()=>{
        process.exit(1);
    })
})