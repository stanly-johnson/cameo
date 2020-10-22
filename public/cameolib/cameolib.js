function init() {
    console.log('Script is loaded')
    console.log(config)
    var para = document.createElement("p");
    var node = document.createTextNode(`${config.name} and ${config.image}`);
    para.appendChild(node);
    document.body.appendChild(para);
    
}

init()