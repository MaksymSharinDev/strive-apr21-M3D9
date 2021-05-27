/*
{
    "_id": "5d318e1a8541744830bef139", //SERVER GENERATED
    "name": "app test 1",  //REQUIRED
    "description": "somthing longer", //REQUIRED
    "brand": "nokia", //REQUIRED
    "imageUrl": "https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80", //REQUIRED
    "price": 100, //REQUIRED
    "userId": "admin", //SERVER GENERATED
    "createdAt": "2019-07-19T09:32:10.535Z", //SERVER GENERATED
    "updatedAt": "2019-07-19T09:32:10.535Z", //SERVER GENERATED
    "__v": 0 //SERVER GENERATED
}*/

//MOCK
window.onload = () => {
    let pageData = {
        access_token: [],
        products: []
    }

    const readToken = async () => {
        await fetch('api/login', {method: 'POST'})
            .then(r => r.json()).then(data => pageData.access_token = data.access_token)


    }
    const createProduct = async () => {
        await fetch('api/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': pageData['access_token']
            },
            body: JSON.stringify({
                "name": "app test 1",
                "description": "somthing longer",
                "brand": "nokia",
                "imageUrl": "https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80", //REQUIRED
                "price": 100,
            })


        }).then(r => r.json()).then(data => pageData.products.push(data))
    }
    const viewProducts = async () => {
        fetch('api/product', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': pageData['access_token']
            }
        }).then(r => r.json()).then(data => console.log(data))
    }
    ;(function main(){
        readToken()
            .then( ()=> createProduct() )
            .then( ()=> viewProducts() )
    })()
    /*

    */


}