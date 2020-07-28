Vue.component('loading', VueLoading);
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
import zh_TW from './zh_TW.js';

VeeValidate.configure({
    classes: {
        valid: 'is-valid',
        invalid: 'is-invalid'
    }
});

// 自定義驗證規則
// VeeValidate.extend('passwowrd'.{
//     validate: value=>{
//         console.log(value);
//         value.length >= 8
//     },
//     message: '密碼太短'
// })

VeeValidate.localize('tw', zh_TW);

new Vue({
    el: "#app",
    data: {
        form: {
            receiver:'',
            email:'',
            tel:'',
            address:'',
            payment: '',
            msg: ''
        },
        tempData: {},
        prods: [],
        isLoading: false,
        status: {
            loadingItem: '',
            // 加速數量選擇
            loadingNum: ''
        },
        carts: [],
        cartTotal: 0,
        uuid: 'bba8c8a3-a5f2-4a81-91ef-9273532ebb26',
        apiPath: 'https://course-ec-api.hexschool.io'
    },
    methods: {
        submit(){
            console.log('送出')
        },
        getProds(page=1){
            this.isLoading = true
            const url = `${this.apiPath}/api/${this.uuid}/ec/products?page=${page}`;
            axios.get(url)
                .then(res=>{
                    this.isLoading = false;
                    console.log(res)
                    console.log(res.data.data);
                    this.prods = res.data.data;
                })
                .catch(err=>{
                    this.isLoading = false;
                    console.log(err)
                })
        },
        addToCart(id,qty=1){
            this.isLoading = true;
            const url = `${this.apiPath}/api/${this.uuid}/ec/shopping`;
            const cart = {
                product: id,
                quantity: qty
            }
            console.log(cart);
            axios.post(url, cart)
                .then(res=>{
                    this.isLoading = false;
                    console.log(res)
                    $("#modal").modal("hide");
                    this.getCart();
                })
                .catch(err=>{
                    this.isLoading = false;
                    console.log(err)
                    console.log(err.response)
                    console.log(err.response.data.errors[0])
                    alert(err.response.data.errors[0])
                    $("#modal").modal("hide");
                })
        },
        getProd(id){
            this.status.loadingItem = id;
            const url = `${this.apiPath}/api/${this.uuid}/ec/product/${id}`;
            console.log(id);
            this.isLoading = true;
            axios.get(url)
            .then(res=>{
                this.status.loadingItem = '';
                this.isLoading = false;
                console.log(res);
                this.tempData = res.data.data;
                // or
                this.$set(this.tempData, 'num', 1);
                // this.tempData = {
                //     ...res.data.data,
                //     num: 1
                // }
                $("#modal").modal("show")
            })
        },
        getCart(){
            this.isLoading = true;
            const url = `${this.apiPath}/api/${this.uuid}/ec/shopping`;
            axios.get(url)
                .then(res=>{
                    this.isLoading = false;
                    console.log(res)
                    this.carts = res.data.data;
                    this.cartTotal = 0;
                    this.updateCartTotal();
                })
                .catch(err=>{
                    console.log(err)
                })
        },
        updateCartTotal(){
            this.carts.forEach(item=>{
                this.cartTotal += item.product.price*item.quantity;
            })
        },
        updateQuantity(id,qty){
            // 等同addToCart
            // 加速數量選擇
            this.status.loadingNum = id;
            const url = `${this.apiPath}/api/${this.uuid}/ec/shopping`;
            const cart = {
                product: id,
                quantity: qty
            }
            console.log(cart);
            axios.patch(url, cart)
                .then(res=>{
                    // 加速數量選擇
                    this.status.loadingNum = '';
                    console.log(res)
                    this.cartTotal = 0;
                    this.updateCartTotal()
                })
                .catch(err=>{
                    console.log(err)
                })
        },
        rmCartItem(id){
            this.status.loadingNum = id;
            const url = `${this.apiPath}/api/${this.uuid}/ec/shopping/${id}`;

            axios.delete(url)
                .then(res=>{
                    // 加速數量選擇
                    this.status.loadingNum = '';
                    console.log(res)
                    this.getCart();
                })
                .catch(err=>{
                    console.log(err)
                })
        },
        rmCartAllItem(){
            const url = `${this.apiPath}/api/${this.uuid}/ec/shopping/all/product`;

            axios.delete(url)
                .then(res=>{
                    console.log(res)
                    this.getCart();
                })
                .catch(err=>{
                    console.log(err)
                })
        }
    },
    created() {
        this.getProds();
        this.getCart();
    }
})