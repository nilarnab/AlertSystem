const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
    type:String,
    productID:String,
    active:Boolean,
    url:{type:String,default:function(){ if(this.type==="image"){
        return 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png?format=webp&v=1530129113'
    }
    else if(this.type=="video"){
        return 'https://video.vmplay.ml/video/id_video_4/_manifest.mpd'
    }
    else{
        return ''
    } }}
});

// ResourceSchema.virtual('url').get(function(){
//     if(this.type==="image"){
//         return 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png?format=webp&v=1530129113'
//     }
//     else if(this.type=="video"){
//         return 'http://159.223.90.95:5000/video/id_video_1/_manifest.mpd'
//     }
//     else{
//         return ''
//     }
// })
module.exports = mongoose.model('Resource', ResourceSchema)
