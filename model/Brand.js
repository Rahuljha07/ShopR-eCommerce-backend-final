const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = new Schema({
    label: { type : String, required: true,unique:true},
    value: { type : String, required: true,unique:true},
   
})
//create a virtual id 
// In response its change _id to id 
const virtualId  = brandSchema.virtual('id');
virtualId.get(function(){
    return this._id;
})
brandSchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function (doc,ret) { delete ret._id}
})

exports.Brand = mongoose.model("Brand", brandSchema);