const mongoose=require("mongoose");
const productSchema=new mongoose.Schema({
  productName: String,
  brandName: String,
  category: String,
  productImage: [{type:String}], // Stores uploaded image URLs
  description: String,
  price: Number,
  sellingPrice: Number
},
{
  timestamps:true
})

const productModel=mongoose.model("product",productSchema);

module.exports=productModel