const box = document.querySelector('#box');
let isDrag = false; // 드래그 상태 변수
let locX, locY = 0;

// mousedown	마우스를 누르고 있을 때
box.addEventListener('mousedown', (e) => {
    isDrag = true;
    locX = e.offsetX;
    locY = e.offsetY;
})

// mouseup	눌렀던 마우스 버튼을 땔 때
window.addEventListener('mouseup', () => {
    isDrag = false;
})

// mousemove 마우스를 움직였을 때
window.addEventListener('mousemove', (e) => {
    if (isDrag) {
        box.innerText = `
                (${locX}, ${locY})에서 드래그 시작 \n
                (${e.clientX}, ${e.clientY})에서 드래그 끝.
                (${e.clientX - locX}, ${e.clientY - locY})로 이동`;

        box.style.left = (e.clientX - locX) + 'px';
        box.style.top = (e.clientY - locY) + 'px';
    }
})

