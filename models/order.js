import mongoose from "mongoose";

const orderSchema = mongoose.Schema({

    orderId : {
        type : String,
        required : true,
        unique : true
      },
      email : {
        type : String,
        required : true
      },
      orderedItems : [
        {      
          productId : {
            type : String,
            required : true
          },   
          name : {
            type : String,
            required : true
          },
          price : {
            type : Number,
            required : true
          },
          qty : {
            type : Number,
            required : true
          },
          image : {
            type : String,
            
          }
        }
      ],
      date : {
        type : Date,
        default : Date.now
      },
      paymentId:{
        type : String
      },
      status : {
        type : String,
        default : "preparing"
      },
      notes : {
        type : String
      },
      name : {
        type : String,
        required : true
      },
      address : {
        type : String,
        required : true
      },
      phone : {
        type : String,
        required : true
      },
      totalPrice : {
        type : Number,
        required : true
      }
    

});
const Order = mongoose.model("orders", orderSchema);

export default Order;
