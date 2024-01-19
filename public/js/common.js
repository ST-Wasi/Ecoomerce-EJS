const allTheLikeButtons = document.querySelectorAll('.like-btn');

async function likeButton(productId,btn){
    try {
        const response = await axios({
            method: 'post',
            url: `/product/${productId}/like`,
            headers:{
                'X-Requested-With': 'XMLHttpRequest'
            }
           })
           if(btn.children[0].classList.contains('fa-regular')){
            btn.children[0].classList.remove('fa-regular')
            btn.children[0].classList.add('fa-solid')
        }else{
            btn.children[0].classList.remove('fa-solid')
            btn.children[0].classList.add('fa-regular')
        }
    } catch(e){
        if(e.response.status === 401){
            window.location.replace('/login');
            console.log(e.message , 'error hai ye window vaali line ka')
        }
    }
   
}

for(let btn of allTheLikeButtons){
    btn.addEventListener('click',()=>{
        const productId = btn.getAttribute('productId')
        likeButton(productId,btn);
    })
}