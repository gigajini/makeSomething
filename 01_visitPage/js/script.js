const view = document.querySelector('#view');
const writeBtn = document.querySelector('#writeBtn');

let url = 'http://localhost:3000/comments';

//초기화면
let getComment = () => {
    fetch(url)
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('서버오류 : ' + response.status);
        }).then(comments => {

            comments.forEach(comment => {
               const commetBox =  getCommentBox(comment);
               view.prepend(commetBox);
            })

        }).catch(error => console.error('초기 댓글 가져오기 오류', error));
}

// 삭제,수정 기능이 포함된 댓글박스를 만든다.
function getCommentBox(comment) {
    const view = document.querySelector('#view');
    const idx = `${view.childElementCount + 1}`;
    const box = document.createElement('article');
    const date = new Date();
    const getMonth = date.getMonth() < 10 ? '0' + (date.getMonth() + 1): date.getMonth() + 1;
    const getDate = `${date.getFullYear()}-${getMonth}-${date.getDate()}`

    box.className = 'box';
    box.innerHTML = `
        <div>
            <p class="view-user">${comment.name == '' ? `방문자${idx}` : comment.name }</p>
            <p class="date">${getDate}</p>
        </div>
        <p class="view-content">${comment.msg}</p>
        <textarea class="newInput"></textarea>
        <div class="btn-wrap">
            <button class="delBtn">삭제하기</button>
            <button class="modifyBtn">수정하기</button>
            <button class="saveBtn">수정완료</button>
        </div>
    `

    //방명록 삭제
    const delBtn = box.querySelector('.delBtn');
    delBtn.addEventListener('click',() => {
    
        fetch(url + '/' + comment.id, {
            method: "DELETE"
        }).then(response => {
            if (response.ok) getCommentBox(comment);
            else throw new Error('서버 오류 : ' + response.status);
        }).catch(error => console.error('댓글 삭제 오류', error));

    })

    //방명록 수정 및 저장
    const viewContent = box.querySelector('.view-content');
    const newInput = box.querySelector('.newInput');
    const modifyBtn = box.querySelector('.modifyBtn');
    const saveBtn = box.querySelector('.saveBtn');
    modifyBtn.addEventListener('click',() => {
        viewContent.style.display = 'none';
        newInput.style.display = 'block';
        newInput.innerText = comment.msg;
        delBtn.style.display = 'none';
        modifyBtn.style.display = 'none';
        saveBtn.style.display = 'block';
    });
    saveBtn.addEventListener('click',() => {

        comment.msg = newInput.value;
        fetch(url + '/' + comment.id , {
            method : "PUT",
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(comment)
        }).then(response => {
            if (response.ok) getCommentBox(comment);
            else throw new Error('서버 오류 : ' + response.status);
        }).catch(error => console.error('수정 오류', error));

    })

    return box;
}

//방명록 쓰기
let isWriting = true;
writeBtn.addEventListener('click',() => {
    const writeBox = document.querySelector('#write');

    if(isWriting) {
        writeBox.style.display = 'flex';
        writeBtn.style.backgroundColor = 'rgb(58 58 58)';
        writeBtn.style.borderRadius = '4px 4px 0 0';
        writeBtn.innerText = '닫기';
        isWriting = false;
    }else {
        writeBox.style.display = 'none';
        writeBtn.style.backgroundColor = '#6200EE';
        writeBtn.style.borderRadius = '4px';
        writeBtn.innerText = '방명록 쓰기';
        isWriting = true;
    }

    const addBtn = document.querySelector('#addBtn');
    addBtn.addEventListener('click',() => {

        const userName = document.querySelector('#userName').value;
        const content = document.querySelector('#content').value;

        if(content == ''){
            return alert('내용을 입력해주세요.')
        }else {
            addComment(userName,content);
        }
        writeBox.style.display = 'none';
    })

    function addComment(userName,content) {
    
        let addObj = {
            "name" : `${userName}`,
            "msg": `${content}`
        }
        fetch(url, {
            method : "POST",
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(addObj)
        }).then(response => {
            if (response.ok) getComment();
            else throw new Error('서버 오류 : ' + response.status);
        }).catch(error => console.error('댓글 등록 오류', error));
    }
});


getComment();


//json파일에 아이디 자동생성되는 이유
//json파일의 요소 접근은 아이디를 통해서만 가능??