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
        access_token: "",
        products: []
    }

    const readToken = async () => {
        await fetch('api/login', {method: 'POST'})
            .then(r => r.json()).then(data => pageData.access_token = data.access_token )
    }
    const createProduct = async () => {
        await fetch('api/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "access_token" : pageData.access_token,
                "name": "app test 1",
                "description": "somthing longer",
                "brand": "nokia",
                "imageUrl": "https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80", //REQUIRED
                "price": 100,
            })


        }).then(r => r.json()).then(data => pageData.products.push(data))
    }
    const viewProducts = async () => {
        await fetch(`api/product/all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token : pageData['access_token']
            })
        }).then(r => r.json()).then(data => pageData.products = [...pageData.products, ...data] )
    }
    const populatePage = () => {
        //id productTemplate
        let tmplCache = {};
        const tmpl = function (str, data) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            let fn = !/\W/.test(str) ?
                tmplCache[str] = tmplCache[str] ||
                    tmpl(document.getElementById(str).innerHTML) :

                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +

                    // Convert the template into pure JavaScript
                    str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'")
                    + "');}return p.join('');");

            // Provide some basic currying to the user
            return data ? fn(data) : fn;
        };
        let productsSock = document.querySelector('#productsSock')
        productsSock.innerHTML = productsSock.innerHTML + tmpl('productTemplate',pageData)
        }
    ;(function main(){
        readToken()
            .then( ()=> createProduct() )
            .then( ()=> viewProducts() )
            .then( ()=> { console.log(pageData); populatePage()}  )

    })()


}