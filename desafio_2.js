const fs = require('fs')

class ProductManager{

    constructor(filePath){
        this.products = []
        this.path = filePath
        fs.promises.writeFile(this.path,JSON.stringify(this.products,'null',2),'utf-8')
    }
    addProduct = async (title,description,price,thumbnail,code,stock) => {
        await this.getProducts()
        try {
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock
        }

        if(this.products.length === 0){
            product.id = 1
        }else{
            product.id = this.products[this.products.length - 1].id + 1
        }

        if(Object.values(product).every(value => value)){
            const code = this.products.find(p => p.code === product.code)
            if (code){
                return 'El code del producto ya existe'
            }else{
                this.products.push(product)
                await fs.promises.writeFile(this.path,JSON.stringify(this.products,'null',2),'utf-8')
            }
            return 'Producto agregado'
        }else {
            return 'Faltan datos del producto'
        }
        } catch (error) {
            return error
        }
    }
    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.path,'utf-8')
            this.products = JSON.parse(data)
            return this.products
        } catch (error) {
            return error
        }
    }
    getProductById = async (id) => {
        await this.getProducts()
        try {
            const prodID = this.products.find(p => p.id === id)
            if(prodID){
                return prodID
            }else{
                return 'Producto no encontrado'
            }
        } catch (error) {
            return error
        }
    }
    updateProduct = async (id,updateProd) => {
        await this.getProducts()
        try {
            let producto = this.products.find(prod => prod.id === id)
            if(!producto) return 'No encontrado'
            producto.title = updateProd.title
            producto.description = updateProd.description
            producto.price = updateProd.price
            producto.thumbnail = updateProd.thumbnail
            producto.stock = updateProd.stock
            producto.code = updateProd.code
            await fs.promises.writeFile(this.path,JSON.stringify(this.products,'null',2),'utf-8')
            return 'Producto actualizado'
        } catch (error) {
            return error
        }
    }
    deleteProduct = async (id) => {
        await this.getProducts()
        try {
            const eliminarProd = this.products.filter(prod => prod.id !== id)
            if (JSON.stringify(eliminarProd) === JSON.stringify(this.products)) return 'ID no encontrado'
            this.products = eliminarProd
            await fs.promises.writeFile(this.path,JSON.stringify(this.products,'null',2),'utf-8')
            return 'Producto eliminado'
        } catch (error) {
            return error
        }
    }
}

const producto = new ProductManager('./Productos.json')

const app = async() => {
    console.log(await producto.getProducts())
    console.log(await producto.addProduct("producto prueba","Este es un producto prueba",200,"sin imagen","abc123",25))
    console.log(await producto.addProduct("producto prueba 2","Este es un producto prueba",300,"sin imagen","abc124",25))
    console.log(await producto.addProduct("producto prueba 3","Este es un producto prueba",400,"sin imagen","abc125",25))
    console.log(await producto.getProducts())
    console.log(await producto.updateProduct(1, {title: 'producto modificado', description: 'Este es un producto prueba', price: 200, thumbnail: 'sin imagen', stock: 200, code: 'abc125'}))
    console.log(await producto.getProducts())
    console.log(await producto.deleteProduct(4))
    console.log(await producto.getProducts())
    console.log(await producto.getProductById(4))
    console.log(await producto.getProductById(3))
    console.log(await producto.deleteProduct(2))
    console.log(await producto.getProducts())

} 

app()