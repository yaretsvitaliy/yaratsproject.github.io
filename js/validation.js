function validateName(){
    var x=message.value;
    test.innerHTML=x;
    if (x.length < 20) {
        test.innerHTML = '(Введите,пожалуйста, минимум 20 символов)';}
    else {
        test.innerHTML = '';
    }
}

buttons.addEventListener('click', validateName, false);

