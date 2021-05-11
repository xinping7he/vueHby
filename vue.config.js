<<<<<<< HEAD
// vue.config.js vue设置代理服务器，实现跨域
module.exports = {
    devServer:{
        port:8081,
        //vueCli4与vueCli3的属性名不同
        proxy:{
            '/api': {   // 匹配所有以 '/api'开头的请求路径
                target: 'http://172.22.203.12:9999',  // 代理目标的基础路径
                changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: {
                    '^/api': '' //'^/api'是正则表达式，把/api及之前的路径替换成target中的请求地址
                }
            }
        }
    },
    //关掉又爱又恨的eslint
    //lintOnSave: false
}
=======
// vue.config.js vue设置代理服务器，实现跨域
module.exports = {
    devServer:{
        port:8081,
        //vueCli4与vueCli3的属性名不同
        proxy:{
            '/api': {   // 匹配所有以 '/api'开头的请求路径
                target: 'http://172.22.203.12:9999',  // 代理目标的基础路径
                changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: {
                    '^/api': '' //'^/api'是正则表达式，把/api及之前的路径替换成target中的请求地址
                }
            }
        }
    },
    //关掉又爱又恨的eslint
    //lintOnSave: false
}
>>>>>>> a1ca4df1fa2bdfc64e7164b49f3df169582bfd5b
