import Product from "../models/products.js";

export function getProduct(req, res) {
  Product.find()
    .then((productList) => {
      res.status(200).json({
        list: productList,
      });
    })
    .catch((err) => {
      res.json({
        message: "Error",
      });
    });
}
export function createProduct(req,res){

   //console.log(req.user)


    const product = new Product(req.body)

   
    product.save().then(()=>{
      res.json({
        message: "Product created"
      })
    }).catch(()=>{
      res.json({
        message: "Product not created"
      })
    })
  }

  export function deleteProduct(req,res){
    Product.deleteOne({name : req.body.name}).then(
      ()=>{
        res.json(
          {
            message : "Product deleted successfully"
          }
        )
      }
    ).catch(
      ()=>{
        res.json(
          {
            message : "Product not deleted"
          }
        )
      }
    )
  }

export function getProductByName(req, res){
    const name = req.params.name;
    
    Product.find({name: name}).then(
      (productList) => {

        if (productList.length > 0) {
            res.json({
             list : productList
            })
            
        } else {
            res.json({
                message : "Product not found"
            })
        }


        res.json({
            list :productList

        })
    }
    ).catch(err => {
        res.json({
            message: "Product not found"
        })
    })
}