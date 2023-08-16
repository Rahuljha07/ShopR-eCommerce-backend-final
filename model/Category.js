const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
    label: { type : String, required: true,unique:true},
    value: { type : String, required: true,unique:true},
   
})
//create a virtual id 
// In response its change _id to id 
const virtualId  = categorySchema.virtual('id');
virtualId.get(function(){
    return this._id;
})
categorySchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function (doc,ret) { delete ret._id}
})

exports.Category = mongoose.model("Category", categorySchema);