const box = document.querySelector('#box');
//드래그 동작 유무를 체크합니다. (false = 이동불가 / true = 이동가능)
let isDragging = false;

document.addEventListener('mouseup',(e)=>{ isDragging = false; });

box.addEventListener('mousedown',(e)=>{ isDragging = true; });

document.addEventListener('mousemove',(e)=> {

    if(isDragging == true){

        //브라우저 좌표값 계산
        let mouseX = e.clientX;
        let mouseY = e.clientY;
        // //개체 정 중앙 계산
        let boxWidth = box.offsetWidth/2;
        let boxHeight = box.offsetHeight/2;


        box.style.position = 'absolute';
        // //클릭했을 때 마우스가 정 중앙에 위치하게끔 지정
        box.style.left = mouseX - boxWidth + 'px';
        box.style.top = mouseY - boxHeight + 'px';

    }
});

