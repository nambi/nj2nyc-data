
a = () => {
    let a =100;

    setInterval(function(){
        console.log('afer sometime');
        console.log('this is debug config');
        console.info('this is just a test', a);
    },1000);
}
a();