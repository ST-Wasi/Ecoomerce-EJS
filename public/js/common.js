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
    } catch (error) {
        window.location.replace('/login');
    }
   
}

for(let btn of allTheLikeButtons){
    btn.addEventListener('click',()=>{
        const productId = btn.getAttribute('productId')
        likeButton(productId,btn);
    })
}